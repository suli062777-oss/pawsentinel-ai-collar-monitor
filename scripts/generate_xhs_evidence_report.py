from __future__ import annotations

import csv
import json
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "evidence" / "raw" / "xhs_public_visible_capture.csv"
OUT_MD = ROOT / "docs" / "pawroom-xhs-evidence-addendum.md"
OUT_CSV = ROOT / "data" / "evidence" / "processed" / "xhs_evidence_summary.csv"


def read_rows() -> list[dict[str, str]]:
    if not RAW.exists():
        return []
    with RAW.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def excerpt(text: str, limit: int = 86) -> str:
    text = " ".join((text or "").split())
    if len(text) <= limit:
        return text
    return text[: limit - 1] + "..."


def note_value(row: dict[str, str], key: str) -> str:
    try:
        data = json.loads(row.get("notes") or "{}")
    except Exception:
        return ""
    return str(data.get(key, ""))


def pick_reps(rows: list[dict[str, str]], scene: str, limit: int = 5) -> list[dict[str, str]]:
    candidates = [row for row in rows if row.get("user_scene") == scene]
    candidates.sort(
        key=lambda row: (
            1 if "/explore/" in row.get("source_url", "") else 0,
            len(row.get("original_text", "")),
        ),
        reverse=True,
    )
    return candidates[:limit]


def write_summary_csv(rows: list[dict[str, str]]) -> None:
    groups: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in rows:
        groups[row.get("user_scene") or "未分类"].append(row)
    OUT_CSV.parent.mkdir(parents=True, exist_ok=True)
    with OUT_CSV.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "user_scene",
                "count",
                "top_current_solutions",
                "sample_source_urls",
                "sample_screenshots",
            ],
        )
        writer.writeheader()
        for scene, items in sorted(groups.items(), key=lambda item: (-len(item[1]), item[0])):
            solutions = Counter(row.get("current_solution") or "未识别" for row in items)
            writer.writerow(
                {
                    "user_scene": scene,
                    "count": len(items),
                    "top_current_solutions": "；".join(f"{k}({v})" for k, v in solutions.most_common(4)),
                    "sample_source_urls": "；".join(row.get("source_url", "") for row in items[:3]),
                    "sample_screenshots": "；".join(note_value(row, "screenshot") for row in items[:3]),
                }
            )


def write_markdown(rows: list[dict[str, str]]) -> None:
    scene_counts = Counter(row.get("user_scene") or "未分类" for row in rows)
    solution_counts = Counter(row.get("current_solution") or "未识别" for row in rows)
    payment_counts = Counter(row.get("payment_signal") or "not_observed" for row in rows)
    pet_counts = Counter(row.get("pet_type") or "未识别" for row in rows)
    screenshot_count = len({note_value(row, "screenshot") for row in rows if note_value(row, "screenshot")})
    explore_count = sum(1 for row in rows if "/explore/" in row.get("source_url", ""))

    lines = [
        "# PawRoom 小红书用户证据补充",
        "",
        f"生成时间：{datetime.now().isoformat(timespec='seconds')}",
        "",
        "## 样本概览",
        "",
        f"- 小红书可见帖子/搜索结果证据：**{len(rows)} 条**。",
        f"- 其中包含笔记详情链接 `/explore/` 的证据：**{explore_count} 条**。",
        f"- 已保存截图批次：**{screenshot_count} 张**。",
        f"- 场景分布：{'；'.join(f'{k}({v})' for k, v in scene_counts.most_common())}。",
        f"- 现有方案分布：{'；'.join(f'{k}({v})' for k, v in solution_counts.most_common())}。",
        f"- 宠物类型识别：{'；'.join(f'{k}({v})' for k, v in pet_counts.most_common())}。",
        f"- 付费信号：{'；'.join(f'{k}({v})' for k, v in payment_counts.most_common())}。",
        "",
        "说明：本次采集使用正常浏览器页面和本地可见内容截图，不使用反检测、验证码绕过、签名逆向或代理池。卡片文本较短，适合作为“小红书上存在相关讨论/种草/吐槽方向”的证据；真正进入汇报时，建议优先展示截图和链接，不把短卡片当作深访替代。",
        "",
        "## 与 PawRoom 假设的关系",
        "",
        "- **安全与离家看护**：关键词中出现上班、独自在家、摄像头、监控等内容，说明国内内容平台也存在离家看宠场景。",
        "- **视频监控替代/低干扰提醒**：大量帖子围绕宠物摄像头、移动宠物监控、全屋跟随摄像头，说明现有解决方案仍以视频监控为主。",
        "- **定位与安全边界**：定位器、走丢找回、定位不准等关键词有可见结果，支持 PawRoom 后续接入定位/项圈数据而非自研硬件。",
        "- **生命状态趋势**：老年犬、睡眠、健康监测关键词有样本，但数量低于摄像头类，适合做 MVP 的辅助看护而不是第一卖点。",
        "- **情绪价值内容**：宠物桌宠、表情包、小剧场等关键词有可见内容，能支撑 PawRoom 的第二层存在感和 AI 生成内容方向。",
        "",
        "## 代表证据",
        "",
    ]

    for scene in scene_counts:
        reps = pick_reps(rows, scene, limit=5)
        lines.extend([f"### {scene}", ""])
        for row in reps:
            source = row.get("source_url", "")
            shot = note_value(row, "screenshot")
            title = note_value(row, "title") or excerpt(row.get("original_text", ""), 42)
            author = note_value(row, "author")
            likes = note_value(row, "likes")
            lines.append(f"- `{title}` | 作者/时间：{author or '未识别'} | 互动：{likes or '未识别'}")
            lines.append(f"  原文摘录：{excerpt(row.get('original_text', ''))}")
            lines.append(f"  来源：{source}")
            lines.append(f"  截图：`{shot}`")
        lines.append("")

    lines.extend(
        [
            "## 对 PRD 的补充建议",
            "",
            "- 汇报时可以把小红书作为“中国用户社交平台信号”，和 App Store 公开评论形成跨平台三角验证。",
            "- 目前小红书样本更强地支持“摄像头/监控场景已经存在且内容活跃”，而不是直接证明用户愿意为 PawRoom 付费。",
            "- 下一步应挑选 10 条高相关笔记进入详情页，补充评论区原话，重点看用户是否抱怨：一直看监控、被摄像头打扰、定位不准、续航差、上班焦虑。",
        ]
    )

    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    rows = read_rows()
    write_summary_csv(rows)
    write_markdown(rows)
    print(f"Wrote {OUT_MD}")
    print(f"Wrote {OUT_CSV}")


if __name__ == "__main__":
    main()
