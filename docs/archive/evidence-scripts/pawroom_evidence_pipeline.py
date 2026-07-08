#!/usr/bin/env python3
"""PawRoom user-evidence pipeline.

This script intentionally avoids bypassing platform restrictions. It supports:
- importing Thunderbit/Apify/manual CSV exports;
- importing seed public evidence CSV files;
- generating search tasks for manual or no-code collection;
- optional Reddit collection via PRAW when credentials and dependency exist.

Outputs are traceable CSV/JSON evidence tables plus Markdown reports.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import hashlib
import json
import os
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CONFIG = ROOT / "config" / "pawroom_evidence_config.json"
RAW_DIR = ROOT / "data" / "evidence" / "raw"
MANUAL_DIR = ROOT / "data" / "evidence" / "manual"
PROCESSED_DIR = ROOT / "data" / "evidence" / "processed"
DOCS_DIR = ROOT / "docs"

CANONICAL_FIELDS = [
    "evidence_id",
    "platform",
    "source_type",
    "source_url",
    "collected_at",
    "competitor",
    "product",
    "original_text",
    "user_scene",
    "pet_type",
    "painpoint_tags",
    "emotion_strength",
    "current_solution",
    "competitor_gap",
    "payment_signal",
    "pawroom_implication",
    "hypothesis_ids",
    "evidence_strength",
    "notes",
]

ALIASES = {
    "platform": ["platform", "平台", "source_platform"],
    "source_type": ["source_type", "类型", "内容类型", "type"],
    "source_url": ["source_url", "url", "link", "链接", "source", "来源"],
    "collected_at": ["collected_at", "采集时间", "date", "日期"],
    "competitor": ["competitor", "竞品", "brand", "品牌"],
    "product": ["product", "产品", "title", "标题"],
    "original_text": ["original_text", "text", "comment", "review", "content", "评论", "原文", "正文", "摘录"],
    "user_scene": ["user_scene", "场景", "scene"],
    "pet_type": ["pet_type", "宠物类型", "pet"],
    "current_solution": ["current_solution", "现有方案", "solution"],
    "payment_signal": ["payment_signal", "付费信号", "price", "价格"],
    "notes": ["notes", "备注", "note"],
}

NEGATIVE_WORDS = [
    "worry",
    "worried",
    "anxiety",
    "anxious",
    "can't",
    "cannot",
    "problem",
    "issue",
    "complaint",
    "glitch",
    "false",
    "drain",
    "expensive",
    "担心",
    "焦虑",
    "不准",
    "误报",
    "贵",
    "差评",
    "麻烦",
    "断连",
    "隐私",
]

PAYMENT_WORDS = [
    "buy",
    "paid",
    "price",
    "cost",
    "subscription",
    "premium",
    "monthly",
    "purchase",
    "购买",
    "价格",
    "付费",
    "订阅",
    "会员",
    "硬件",
]


def now_iso() -> str:
    return dt.datetime.now(dt.timezone.utc).astimezone().isoformat(timespec="seconds")


def load_config(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def ensure_dirs() -> None:
    for path in [RAW_DIR, MANUAL_DIR, PROCESSED_DIR, DOCS_DIR]:
        path.mkdir(parents=True, exist_ok=True)


def lower_text(value: str) -> str:
    return (value or "").casefold()


def first_present(row: dict[str, str], keys: list[str]) -> str:
    normalized = {k.strip().casefold(): v for k, v in row.items()}
    for key in keys:
        value = normalized.get(key.casefold())
        if value is not None:
            return value.strip()
    return ""


def read_csv_records(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames:
            return []
        rows = []
        for row in reader:
            if not any((v or "").strip() for v in row.values()):
                continue
            rows.append({k: (v or "").strip() for k, v in row.items()})
        return rows


def record_hash(record: dict[str, str]) -> str:
    raw = "|".join(
        [
            record.get("source_url", ""),
            record.get("original_text", ""),
            record.get("platform", ""),
            record.get("product", ""),
        ]
    )
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()[:10].upper()


def normalize_row(row: dict[str, str], config: dict[str, Any]) -> dict[str, str]:
    record: dict[str, str] = {}
    for field, aliases in ALIASES.items():
        record[field] = first_present(row, aliases)

    if not record.get("collected_at"):
        record["collected_at"] = now_iso()
    if not record.get("source_type"):
        record["source_type"] = "manual_export"

    text = record.get("original_text", "")
    combined = " ".join([text, record.get("notes", ""), record.get("product", ""), record.get("competitor", "")])

    tags = classify_tags(combined, config["painpoint_tags"])
    record["painpoint_tags"] = ";".join(tags)
    record["emotion_strength"] = str(score_emotion(combined))
    record["hypothesis_ids"] = ";".join(match_hypotheses(combined, config["hypotheses"]))
    record["competitor_gap"] = infer_competitor_gap(combined)
    record["pawroom_implication"] = infer_pawroom_implication(tags, combined)
    record["payment_signal"] = record.get("payment_signal") or infer_payment_signal(combined)
    record["evidence_strength"] = score_evidence_strength(record)
    record["evidence_id"] = "EV-" + record_hash(record)

    for field in CANONICAL_FIELDS:
        record.setdefault(field, "")
    return record


def classify_tags(text: str, tag_rules: dict[str, list[str]]) -> list[str]:
    haystack = lower_text(text)
    tags = []
    for tag, keywords in tag_rules.items():
        if any(lower_text(keyword) in haystack for keyword in keywords):
            tags.append(tag)
    return tags


def score_emotion(text: str) -> int:
    haystack = lower_text(text)
    hits = sum(1 for word in NEGATIVE_WORDS if lower_text(word) in haystack)
    exclamation = min(text.count("!") + text.count("！"), 2)
    score = 1 + hits + exclamation
    return max(1, min(score, 5))


def match_hypotheses(text: str, hypotheses: list[dict[str, Any]]) -> list[str]:
    haystack = lower_text(text)
    ids = []
    for hypothesis in hypotheses:
        if any(lower_text(keyword) in haystack for keyword in hypothesis.get("keywords", [])):
            ids.append(hypothesis["id"])
    return ids


def infer_payment_signal(text: str) -> str:
    haystack = lower_text(text)
    if any(lower_text(word) in haystack for word in PAYMENT_WORDS):
        return "present"
    return "not_observed"


def infer_competitor_gap(text: str) -> str:
    haystack = lower_text(text)
    gaps = []
    if any(word in haystack for word in ["battery", "charge", "续航", "电量"]):
        gaps.append("续航/充电负担")
    if any(word in haystack for word in ["inaccurate", "false", "gps", "不准", "误报", "定位"]):
        gaps.append("定位或提醒可信度不足")
    if any(word in haystack for word in ["privacy", "camera", "video", "隐私", "摄像头", "监控"]):
        gaps.append("视频监控隐私和打扰压力")
    if any(word in haystack for word in ["subscription", "premium", "cost", "price", "订阅", "会员", "价格"]):
        gaps.append("订阅或价格敏感")
    if any(word in haystack for word in ["chart", "dashboard", "timeline", "boring", "图表", "地图", "数据"]):
        gaps.append("数据表达偏工具化")
    return "；".join(gaps) if gaps else "待人工复核"


def infer_pawroom_implication(tags: list[str], text: str) -> str:
    implications = []
    tag_set = set(tags)
    if "安全焦虑" in tag_set:
        implications.append("强化安全看护和离家状态提醒")
    if "生命状态趋势需求" in tag_set:
        implications.append("保留非医疗生命趋势提醒")
    if "监控隐私压力" in tag_set or "不想一直看监控" in tag_set:
        implications.append("用桌面小世界替代持续视频监控")
    if "设备不准" in tag_set:
        implications.append("展示置信度，避免承诺精准监控")
    if "续航连接问题" in tag_set:
        implications.append("在硬件 Demo 中展示电量和连接状态")
    if "愿意为硬件付费" in tag_set:
        implications.append("验证硬件+基础软件捆绑价格")
    if "愿意为内容/情绪价值付费" in tag_set:
        implications.append("验证 Paw Credits 创作付费")
    return "；".join(implications) if implications else "待人工复核"


def score_evidence_strength(record: dict[str, str]) -> str:
    source_type = lower_text(record.get("source_type", ""))
    has_url = bool(record.get("source_url"))
    text_len = len(record.get("original_text", ""))
    if source_type in {"reddit", "forum", "user_review", "app_review", "comment", "taobao_review", "xhs_visible_page", "xhs_export"} and has_url and text_len >= 30:
        return "strong"
    if source_type in {"expert_review", "news"} and has_url and text_len >= 30:
        return "medium"
    if source_type in {"official", "documentation"} and has_url:
        return "context"
    return "weak"


def dedupe(records: list[dict[str, str]]) -> list[dict[str, str]]:
    seen = set()
    result = []
    for record in records:
        key = record["evidence_id"]
        if key in seen:
            continue
        seen.add(key)
        result.append(record)
    return result


def collect_imported_records(config: dict[str, Any]) -> list[dict[str, str]]:
    records: list[dict[str, str]] = []
    csv_files = sorted(RAW_DIR.glob("*.csv")) + sorted(MANUAL_DIR.glob("*.csv"))
    for csv_file in csv_files:
        if csv_file.name == "evidence_import_template.csv":
            continue
        for row in read_csv_records(csv_file):
            normalized = normalize_row(row, config)
            normalized["notes"] = (normalized.get("notes", "") + f" | imported_from={csv_file.as_posix()}").strip(" |")
            records.append(normalized)
    return dedupe(records)


def optional_collect_reddit(config: dict[str, Any], limit: int) -> list[dict[str, str]]:
    """Collect Reddit evidence via PRAW if installed and credentials exist.

    Required env vars:
      REDDIT_CLIENT_ID
      REDDIT_CLIENT_SECRET
      REDDIT_USER_AGENT
    """
    if not os.getenv("REDDIT_CLIENT_ID") or not os.getenv("REDDIT_CLIENT_SECRET"):
        return []
    try:
        import praw  # type: ignore
    except Exception:
        print("PRAW not installed; skipping Reddit API collection.", file=sys.stderr)
        return []

    reddit = praw.Reddit(
        client_id=os.environ["REDDIT_CLIENT_ID"],
        client_secret=os.environ["REDDIT_CLIENT_SECRET"],
        user_agent=os.getenv("REDDIT_USER_AGENT", "PawRoomResearch/0.1"),
    )

    records = []
    reddit_tasks = [task for task in config.get("search_tasks", []) if task.get("platform") == "Reddit"]
    for task in reddit_tasks:
        query = task["query"]
        for submission in reddit.subreddit("all").search(query, sort="relevance", limit=limit):
            text = f"{submission.title}\n{submission.selftext or ''}".strip()
            if not text:
                continue
            row = {
                "platform": "Reddit",
                "source_type": "reddit",
                "source_url": f"https://www.reddit.com{submission.permalink}",
                "collected_at": now_iso(),
                "competitor": "",
                "product": submission.subreddit.display_name,
                "original_text": text[:1500],
                "user_scene": "",
                "pet_type": "",
                "current_solution": "",
                "payment_signal": "",
                "notes": f"query={query}; score={submission.score}; comments={submission.num_comments}",
            }
            records.append(normalize_row(row, config))
    return dedupe(records)


def write_csv(path: Path, rows: list[dict[str, str]], fields: list[str]) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def write_json(path: Path, payload: Any) -> None:
    with path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)


def generate_search_tasks(config: dict[str, Any]) -> None:
    rows = []
    for i, task in enumerate(config.get("search_tasks", []), start=1):
        rows.append(
            {
                "task_id": f"ST-{i:03d}",
                "platform": task.get("platform", ""),
                "query": task.get("query", ""),
                "url": task.get("url", ""),
                "method": task.get("method", ""),
                "notes": task.get("notes", ""),
            }
        )
    write_csv(PROCESSED_DIR / "search_tasks.csv", rows, ["task_id", "platform", "query", "url", "method", "notes"])


def summarize(records: list[dict[str, str]]) -> dict[str, Any]:
    tag_counts: Counter[str] = Counter()
    platform_counts: Counter[str] = Counter()
    competitor_counts: Counter[str] = Counter()
    hypothesis_counts: Counter[str] = Counter()
    strength_counts: Counter[str] = Counter()
    payment_counts: Counter[str] = Counter()

    for record in records:
        platform_counts[record["platform"] or "unknown"] += 1
        competitor_counts[record["competitor"] or "unknown"] += 1
        strength_counts[record["evidence_strength"] or "unknown"] += 1
        payment_counts[record["payment_signal"] or "unknown"] += 1
        for tag in split_semicolon(record.get("painpoint_tags", "")):
            tag_counts[tag] += 1
        for hypothesis_id in split_semicolon(record.get("hypothesis_ids", "")):
            hypothesis_counts[hypothesis_id] += 1

    return {
        "record_count": len(records),
        "tag_counts": dict(tag_counts.most_common()),
        "platform_counts": dict(platform_counts.most_common()),
        "competitor_counts": dict(competitor_counts.most_common()),
        "hypothesis_counts": dict(hypothesis_counts.most_common()),
        "strength_counts": dict(strength_counts.most_common()),
        "payment_counts": dict(payment_counts.most_common()),
    }


def split_semicolon(value: str) -> list[str]:
    return [item.strip() for item in value.split(";") if item.strip()]


def representative_records(records: list[dict[str, str]], tag: str, limit: int = 3) -> list[dict[str, str]]:
    tagged = [record for record in records if tag in split_semicolon(record.get("painpoint_tags", ""))]
    tagged.sort(key=lambda r: (strength_rank(r["evidence_strength"]), int(r["emotion_strength"])), reverse=True)
    return tagged[:limit]


def strength_rank(value: str) -> int:
    return {"strong": 4, "medium": 3, "context": 2, "weak": 1}.get(value, 0)


def md_escape(text: str, max_len: int = 240) -> str:
    text = re.sub(r"\s+", " ", text or "").strip()
    if len(text) > max_len:
        return text[: max_len - 3] + "..."
    return text


def generate_report(records: list[dict[str, str]], summary: dict[str, Any], config: dict[str, Any]) -> str:
    generated_at = now_iso()
    lines = [
        "# PawRoom 用户证据报告",
        "",
        f"生成时间：{generated_at}",
        "",
        "## 结论状态",
        "",
    ]
    if len(records) < 100:
        lines.append(f"- 当前证据量：{len(records)} 条，尚未达到计划中的 100 条样本验收线。")
        lines.append("- 当前报告可用于验证管线和形成初步方向，不能替代完整用户调研。")
    else:
        lines.append(f"- 当前证据量：{len(records)} 条，达到样本验收线。")
    lines += [
        "- 强证据定义：来自用户评论/论坛/评测评论，且有链接和原文。",
        "- 中证据定义：来自第三方评测、新闻或公开资料，可用于佐证市场和竞品事实。",
        "- 背景证据定义：来自官方文档或产品页，用于确认竞品能力，不直接代表用户痛点。",
        "",
        "## 样本概览",
        "",
        f"- 平台分布：{format_counter(summary['platform_counts'])}",
        f"- 证据强度：{format_counter(summary['strength_counts'])}",
        f"- 付费信号：{format_counter(summary['payment_counts'])}",
        "",
        "## 高频痛点聚类",
        "",
    ]

    for tag, count in summary["tag_counts"].items():
        lines.append(f"### {tag}（{count} 条）")
        reps = representative_records(records, tag)
        if not reps:
            lines.append("- 暂无代表性证据。")
        for record in reps:
            lines.append(
                f"- `{record['evidence_id']}` [{record['platform']}] {md_escape(record['original_text'])} "
                f"来源：{record['source_url'] or '待补充'}"
            )
        lines.append("")

    lines += [
        "## 对 PawRoom 的产品启发",
        "",
    ]
    implication_counts = Counter()
    for record in records:
        for implication in split_semicolon(record.get("pawroom_implication", "")):
            implication_counts[implication] += 1
    for implication, count in implication_counts.most_common():
        lines.append(f"- {implication}：{count} 条证据关联。")

    lines += [
        "",
        "## 核心假设验证状态",
        "",
    ]
    hypothesis_names = {item["id"]: item["name"] for item in config["hypotheses"]}
    for hypothesis_id, name in hypothesis_names.items():
        count = summary["hypothesis_counts"].get(hypothesis_id, 0)
        status = "证据不足" if count < 3 else "初步支持"
        lines.append(f"- `{hypothesis_id}` {name}：{count} 条关联证据，状态：{status}。")

    lines += [
        "",
        "## 审计备注",
        "",
        "- 国内平台建议通过 Thunderbit/手动导出后导入，不绕过登录、验证码或反爬限制。",
        "- Reddit 当前环境匿名 JSON 访问受限，建议使用 Reddit API/PRAW 凭证或 Apify 导出。",
        "- 每个最终结论进入 PPT/PRD 前，需要至少 3 条可追溯证据支撑。",
    ]
    return "\n".join(lines) + "\n"


def generate_prd_addendum(records: list[dict[str, str]], summary: dict[str, Any], config: dict[str, Any]) -> str:
    lines = [
        "# PawRoom PRD 用户证据补充章节",
        "",
        "## 用户证据摘要",
        "",
        f"当前已结构化证据 {len(records)} 条。证据来源包含公开竞品资料、第三方评测和可导入的用户评论表。后续导入 Reddit、小红书、抖音、淘宝评论后，可复跑脚本更新本章节。",
        "",
        "## 可进入 PRD 的初步判断",
        "",
    ]

    for tag, count in summary["tag_counts"].items():
        reps = representative_records(records, tag, 2)
        if not reps:
            continue
        lines.append(f"### {tag}")
        lines.append(f"- 证据数量：{count} 条。")
        lines.append(f"- 产品启发：{reps[0].get('pawroom_implication', '待人工复核')}")
        lines.append("- 代表证据：")
        for record in reps:
            lines.append(f"  - `{record['evidence_id']}` {md_escape(record['original_text'])} 来源：{record['source_url'] or '待补充'}")
        lines.append("")

    lines += [
        "## 对 v0.4 PRD 的建议修订",
        "",
        "- 在机会判断中保留“安全看护是硬件付费主因，桌宠是高频打开和情绪表达层”的双层价值。",
        "- 在 MVP 中保留置信度、连接状态、电量状态，避免用户误以为系统能精准监控。",
        "- 在商业模式中保留“安全功能不扣 Paw Credits”，只对小剧场、表情包、动画等创作型输出收费。",
        "- 在验证计划中优先补足真实用户评论证据，尤其是宠物摄像头差评、智能项圈续航/定位吐槽、老年宠监测需求。",
    ]
    return "\n".join(lines) + "\n"


def format_counter(counter: dict[str, int]) -> str:
    if not counter:
        return "无"
    return "，".join([f"{key} {value}" for key, value in counter.items()])


def write_summary_tables(records: list[dict[str, str]], summary: dict[str, Any]) -> None:
    tag_rows = []
    for tag, count in summary["tag_counts"].items():
        avg_emotion = average(
            int(record["emotion_strength"])
            for record in records
            if tag in split_semicolon(record.get("painpoint_tags", ""))
        )
        tag_rows.append({"painpoint_tag": tag, "count": str(count), "avg_emotion_strength": f"{avg_emotion:.2f}"})
    write_csv(PROCESSED_DIR / "painpoint_summary.csv", tag_rows, ["painpoint_tag", "count", "avg_emotion_strength"])

    competitor_rows = []
    for competitor, count in summary["competitor_counts"].items():
        competitor_rows.append({"competitor": competitor, "count": str(count)})
    write_csv(PROCESSED_DIR / "competitor_summary.csv", competitor_rows, ["competitor", "count"])


def average(values: Any) -> float:
    values = list(values)
    if not values:
        return 0.0
    return sum(values) / len(values)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Run PawRoom evidence pipeline.")
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    parser.add_argument("--reddit", action="store_true", help="Collect Reddit via PRAW when credentials exist.")
    parser.add_argument("--reddit-limit", type=int, default=10)
    args = parser.parse_args(argv)

    ensure_dirs()
    config = load_config(args.config)
    generate_search_tasks(config)

    records = collect_imported_records(config)
    if args.reddit:
        records = dedupe(records + optional_collect_reddit(config, args.reddit_limit))

    records.sort(key=lambda r: (r["platform"], r["competitor"], r["evidence_id"]))
    summary = summarize(records)

    write_csv(PROCESSED_DIR / "evidence_items.csv", records, CANONICAL_FIELDS)
    write_json(PROCESSED_DIR / "evidence_items.json", records)
    write_json(PROCESSED_DIR / "evidence_summary.json", summary)
    write_summary_tables(records, summary)

    (DOCS_DIR / "pawroom-user-evidence-report.md").write_text(
        generate_report(records, summary, config), encoding="utf-8"
    )
    (DOCS_DIR / "pawroom-prd-user-evidence-addendum.md").write_text(
        generate_prd_addendum(records, summary, config), encoding="utf-8"
    )

    print(f"Processed {len(records)} evidence records.")
    print(f"Wrote {PROCESSED_DIR / 'evidence_items.csv'}")
    print(f"Wrote {DOCS_DIR / 'pawroom-user-evidence-report.md'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


