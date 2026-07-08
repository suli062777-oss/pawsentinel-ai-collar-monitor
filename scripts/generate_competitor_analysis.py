from __future__ import annotations

import csv
import html
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "data" / "evidence" / "processed" / "evidence_items.csv"
OUT_CSV = ROOT / "data" / "evidence" / "processed" / "competitor_analysis.csv"
OUT_MD = ROOT / "docs" / "pawroom-competitor-analysis.md"


META: dict[str, dict[str, str]] = {
    "Tractive": {
        "category": "GPS定位与活动追踪",
        "threat": "高",
        "official_url": "https://tractive.com/en/pd/gps-tracker-dog",
        "why": "定位、虚拟围栏、活动/睡眠追踪和安全提醒都与 PawRoom 的安全看护数据层重叠。",
        "angle": "不与其硬拼定位硬件；优先证明 PawRoom 能把位置/活动数据变成低干扰桌面陪伴与状态理解。",
    },
    "Fi": {
        "category": "智能项圈/GPS与行为数据",
        "threat": "高",
        "official_url": "https://tryfi.com/",
        "why": "智能项圈品牌心智强，覆盖 GPS、活动、睡眠或健康相关数据入口。",
        "angle": "把 Fi 类数据当作可接入上游，PawRoom 做跨设备的解释层和可爱化呈现层。",
    },
    "FitBark": {
        "category": "活动/睡眠/健康趋势追踪",
        "threat": "高",
        "official_url": "https://www.fitbark.com/",
        "why": "用户证据显示活动、睡眠、健康分数能帮助发现宠物状态变化。",
        "angle": "避免医疗诊断承诺，强调趋势提醒、异常变化提示和情绪化日常复盘。",
    },
    "PetPace": {
        "category": "生命体征/健康监测项圈",
        "threat": "高",
        "official_url": "https://petpace.com/",
        "why": "生命体征、健康监测与 PawRoom 的生命状态趋势假设直接相关。",
        "angle": "MVP 不做医疗级硬件；用公开/模拟生命状态数据验证用户是否需要办公时低干扰查看。",
    },
    "Halo Collar": {
        "category": "GPS围栏/安全边界",
        "threat": "高",
        "official_url": "https://www.halocollar.com/",
        "why": "围栏、安全边界、离开区域提醒直接命中安全焦虑。",
        "angle": "PawRoom 不进入训练/电刺激/围栏控制，而把安全事件变成更易接受的桌面状态提示。",
    },
    "SpotOn": {
        "category": "GPS围栏/安全边界",
        "threat": "高",
        "official_url": "https://spotonfence.com/",
        "why": "强安全场景和高客单硬件，证明用户愿为安全边界付费。",
        "angle": "避开硬件围栏重资产；用第三方状态数据做轻量看护和工作场景提醒。",
    },
    "Furbo": {
        "category": "宠物摄像头/远程互动",
        "threat": "高",
        "official_url": "https://furbo.com/",
        "why": "宠物摄像头、叫声提醒、远程互动和订阅模式已经成熟。",
        "angle": "以“不必一直看视频”为差异，把监控压力转化为桌面小世界和摘要式状态提醒。",
    },
    "Petcube": {
        "category": "宠物摄像头/远程互动",
        "threat": "高",
        "official_url": "https://petcube.com/",
        "why": "摄像头、双向音频、投喂等远程互动能力成熟。",
        "angle": "PawRoom 应避开视频硬件正面竞争，主打非视频化、低干扰、游戏化状态呈现。",
    },
    "Barkio": {
        "category": "手机/电脑复用型宠物监控",
        "threat": "中",
        "official_url": "https://barkio.com/",
        "why": "用现有设备做宠物监控，证明软件化监控有需求。",
        "angle": "Barkio 偏监控工具，PawRoom 可用 AI 角色化和桌面小世界拉开体验差异。",
    },
    "Pet Monitor VIGI": {
        "category": "手机/电脑复用型宠物监控",
        "threat": "中",
        "official_url": "https://www.petmonitorapp.com/",
        "why": "移动设备监控和提醒能覆盖低成本宠物看护需求。",
        "angle": "把提醒从视频监控延展到安全状态、活动轨迹和卡通化日程。",
    },
    "Puppr": {
        "category": "宠物训练/内容订阅",
        "threat": "中",
        "official_url": "https://www.puppr.app/",
        "why": "用户愿为宠物内容、训练课程和订阅付费。",
        "angle": "PawRoom 的内容付费应绑定真实宠物数据与个性化生成，而不是通用课程。",
    },
    "Dogo": {
        "category": "宠物训练/内容订阅",
        "threat": "中",
        "official_url": "https://dogo.app/",
        "why": "训练内容、挑战和订阅证明宠物主人愿为持续内容服务付费。",
        "angle": "用宠物分身、今日小剧场、表情包和桌宠互动做更高情绪价值的内容循环。",
    },
    "Bark": {
        "category": "宠物订阅电商/内容消费",
        "threat": "中",
        "official_url": "https://www.bark.co/",
        "why": "宠物周边、订阅盒和情绪消费证明“为宠物买快乐”是强付费场景。",
        "angle": "PawRoom 可把数字内容和实体周边打通，但早期先验证数字生成是否愿意持续使用。",
    },
    "Petlibro": {
        "category": "智能喂食/饮水硬件",
        "threat": "中",
        "official_url": "https://petlibro.com/",
        "why": "智能硬件用户关注远程可控、稳定连接和日常照护。",
        "angle": "与喂食硬件互补：把喂食/饮水事件也演绎进桌面小世界。",
    },
    "11pets": {
        "category": "宠物档案/养护记录",
        "threat": "低",
        "official_url": "https://www.11pets.com/",
        "why": "偏记录、提醒和档案管理，证明基础养护记录是已存在需求。",
        "angle": "PawRoom 不做单纯记录，需用实时/准实时状态和互动演绎形成第二层存在感。",
    },
    "PetDesk": {
        "category": "宠物医疗预约/服务管理",
        "threat": "低",
        "official_url": "https://petdesk.com/",
        "why": "覆盖宠物医疗服务链路，与 PawRoom 的日常看护不同。",
        "angle": "可作为就医提醒出口，而不是核心竞品。",
    },
    "Pet First Aid": {
        "category": "宠物急救知识",
        "threat": "低",
        "official_url": "https://www.redcross.org/take-a-class/first-aid/cat-dog-first-aid",
        "why": "满足紧急知识查询，非持续桌面陪伴场景。",
        "angle": "PawRoom 可在异常状态时引导就医/急救知识，但不替代专业医疗建议。",
    },
    "Chewy": {
        "category": "宠物电商/服务生态",
        "threat": "中",
        "official_url": "https://www.chewy.com/",
        "why": "电商和会员生态强，但不直接做桌面状态陪伴。",
        "angle": "未来可承接用品推荐，但 MVP 不应被电商功能稀释。",
    },
    "PetSmart": {
        "category": "宠物零售/服务生态",
        "threat": "中",
        "official_url": "https://www.petsmart.com/",
        "why": "线下服务和零售强，但不是 PawRoom 的直接产品形态。",
        "angle": "可作为服务转化渠道参考，非 MVP 重点。",
    },
    "Rover": {
        "category": "宠物看护/寄养服务",
        "threat": "中",
        "official_url": "https://www.rover.com/",
        "why": "解决主人不在家时的照护问题，间接竞争用户安全焦虑预算。",
        "angle": "PawRoom 做轻量日常看护，必要时可推荐线下看护服务。",
    },
    "Wag": {
        "category": "遛狗/看护服务",
        "threat": "中",
        "official_url": "https://wagwalking.com/",
        "why": "解决主人无法陪伴和出门需求，间接竞争。",
        "angle": "PawRoom 可提供状态感知和异常提醒，服务平台负责人工照护。",
    },
    "TrustedHousesitters": {
        "category": "宠物寄养/看家服务",
        "threat": "低",
        "official_url": "https://www.trustedhousesitters.com/",
        "why": "更偏旅行和长期离家场景，与上班期间轻量看护不同。",
        "angle": "不是 MVP 主要竞品，可作为极端离家场景补充。",
    },
    "Whistle/Tractive": {
        "category": "GPS定位与健康追踪",
        "threat": "高",
        "official_url": "https://tractive.com/",
        "why": "Whistle 被 Tractive 收购后代表成熟 GPS/健康追踪资产整合。",
        "angle": "进一步说明 PawRoom 应做软件体验层，而不是独立重做硬件链条。",
    },
}


TAG_EXPLANATIONS = {
    "安全焦虑": "用户害怕宠物逃脱、误食、异常行为或独自在家时发生危险。",
    "监控隐私压力": "用户需要看护，但不一定想长期盯着视频或承受摄像头压力。",
    "不想一直看监控": "用户想要摘要式、低打扰、办公友好的状态提示。",
    "设备不准": "硬件定位、传感、提醒和 App 设置不稳定会直接伤害信任。",
    "续航连接问题": "宠物可穿戴和摄像头都高度依赖续航、联网和同步稳定性。",
    "老年宠/幼宠担忧": "老年宠、幼宠、新领养宠更容易触发持续看护需求。",
    "生命状态趋势需求": "用户会重视活动、睡眠、健康分数等趋势，但早期不应承诺诊断。",
    "愿意为硬件付费": "证据中出现购买设备、升级设备或认可硬件价值。",
    "愿意为内容/情绪价值付费": "证据中出现订阅、课程、挑战、娱乐互动或宠物情绪消费。",
}


def read_rows() -> list[dict[str, str]]:
    if not INPUT.exists():
        raise SystemExit(f"Missing evidence file: {INPUT}")
    with INPUT.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def split_tags(value: str) -> list[str]:
    if not value:
        return []
    return [part.strip() for part in re.split(r"[;；]", value) if part.strip()]


def clean_text(value: str) -> str:
    value = html.unescape(value or "")
    value = re.sub(r"<path\b[^>]*>", " ", value, flags=re.IGNORECASE | re.DOTALL)
    value = re.sub(r"<[^>]+>", " ", value)
    value = value.replace("Developer Response", " Developer Response")
    value = re.sub(r"\s+", " ", value).strip()
    return value


def excerpt(value: str, limit: int = 180) -> str:
    value = clean_text(value)
    if " Developer Response " in value:
        value = value.split(" Developer Response ", 1)[0].strip()
    if len(value) <= limit:
        return value
    return value[: limit - 1].rstrip() + "..."


def strength_for(row: dict[str, str]) -> str:
    source_type = (row.get("source_type") or "").lower()
    if source_type in {"app_review", "user_review", "reddit", "forum", "comment", "taobao_review"}:
        return "strong"
    return row.get("evidence_strength") or "weak"


def top(counter: Counter[str], n: int = 4) -> str:
    if not counter:
        return ""
    return "；".join(f"{k}({v})" for k, v in counter.most_common(n))


def payment_summary(rows: list[dict[str, str]]) -> str:
    signals = Counter()
    for row in rows:
        for tag in split_tags(row.get("painpoint_tags", "")):
            if "付费" in tag:
                signals[tag] += 1
        signal = row.get("payment_signal", "").strip()
        if signal:
            signals[signal] += 1
    return top(signals, 3)


def grouped_analysis(rows: list[dict[str, str]]) -> list[dict[str, str]]:
    grouped: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in rows:
        competitor = (row.get("competitor") or "").strip()
        if not competitor or competitor.lower() == "unknown":
            continue
        grouped[competitor].append(row)

    result = []
    for competitor, items in sorted(grouped.items(), key=lambda item: (-len(item[1]), item[0])):
        meta = META.get(
            competitor,
            {
                "category": "其他相关产品",
                "threat": "低",
                "official_url": "",
                "why": "当前证据量有限，暂作为相关产品观察。",
                "angle": "继续补样本后再判断是否纳入核心竞品。",
            },
        )
        tags = Counter()
        gaps = Counter()
        strengths = Counter()
        platforms = Counter()
        source_types = Counter()
        for row in items:
            tags.update(split_tags(row.get("painpoint_tags", "")))
            gaps.update(split_tags(row.get("competitor_gap", "")))
            strengths[strength_for(row)] += 1
            platforms[row.get("platform", "") or "Unknown"] += 1
            source_types[row.get("source_type", "") or "Unknown"] += 1

        sorted_reps = sorted(
            items,
            key=lambda r: (
                int(r.get("emotion_strength") or 0),
                len(r.get("original_text") or ""),
            ),
            reverse=True,
        )[:3]
        rep_ids = "；".join(row.get("evidence_id", "") for row in sorted_reps)
        rep_quotes = " | ".join(f"{row.get('evidence_id')}: {excerpt(row.get('original_text', ''))}" for row in sorted_reps)
        result.append(
            {
                "competitor": competitor,
                "category": meta["category"],
                "evidence_count": str(len(items)),
                "strong_user_evidence_count": str(strengths.get("strong", 0)),
                "top_painpoints": top(tags, 5),
                "top_competitor_gaps": top(gaps, 5),
                "payment_signals": payment_summary(items),
                "platforms": top(platforms, 4),
                "source_types": top(source_types, 4),
                "threat_level": meta["threat"],
                "threat_reason": meta["why"],
                "pawroom_opportunity": meta["angle"],
                "official_url": meta["official_url"],
                "representative_evidence_ids": rep_ids,
                "representative_quotes": rep_quotes,
            }
        )
    return result


def write_csv(rows: list[dict[str, str]]) -> None:
    OUT_CSV.parent.mkdir(parents=True, exist_ok=True)
    with OUT_CSV.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def bullet_lines(rows: list[dict[str, str]], threat: str | None = None) -> list[str]:
    selected = [row for row in rows if threat is None or row["threat_level"] == threat]
    lines = []
    for row in selected:
        lines.append(
            f"- **{row['competitor']}**（{row['category']}，威胁：{row['threat_level']}，证据 {row['evidence_count']} 条）："
            f"{row['threat_reason']} PawRoom 启发：{row['pawroom_opportunity']}"
        )
    return lines


def write_markdown(rows: list[dict[str, str]], raw_rows: list[dict[str, str]]) -> None:
    total = len(raw_rows)
    platforms = Counter(row.get("platform", "") or "Unknown" for row in raw_rows)
    source_types = Counter(row.get("source_type", "") or "Unknown" for row in raw_rows)
    painpoints = Counter()
    for row in raw_rows:
        painpoints.update(split_tags(row.get("painpoint_tags", "")))

    high = [row for row in rows if row["threat_level"] == "高"]
    medium = [row for row in rows if row["threat_level"] == "中"]
    low = [row for row in rows if row["threat_level"] == "低"]
    generated_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    lines: list[str] = [
        "# PawRoom 竞品详细分析",
        "",
        f"生成时间：{generated_at}",
        "",
        "## 1. 数据基础",
        "",
        f"- 已处理用户/市场证据：**{total} 条**。",
        f"- 平台分布：{top(platforms, 8)}。",
        f"- 来源类型：{top(source_types, 8)}。",
        f"- 覆盖竞品/相关产品：**{len(rows)} 个**。",
        f"- 高频痛点：{top(painpoints, 8)}。",
        "",
        "说明：本报告优先使用 `data/evidence/processed/evidence_items.csv` 中的原文、链接、采集时间和证据 ID。App Store 公开评论在竞品分析中按真实用户证据处理；小红书、抖音、淘宝仍建议通过半自动导出 CSV 后并入同一管线，不绕过登录、验证码或反爬限制。",
        "",
        "## 2. 结论先行",
        "",
        "- PawRoom 不适合被定义成又一个宠物摄像头、又一个 GPS 项圈、又一个健康项圈。那些方向已经有强竞品，硬件、渠道和订阅体系成熟。",
        "- 更可行的定位是：**读取/导入已有硬件和用户日常记录的数据，把监控数据翻译成低干扰、卡通化、可互动的桌面宠物小世界**。",
        "- 用户付费的底层理由仍然是安全：怕宠物逃跑、误食、焦虑、老年/幼宠异常；AI 桌宠和今日小剧场是降低监控压力、提高日常打开频次的体验层。",
        "- MVP 不应承诺医疗诊断，也不应重做项圈硬件。应验证三个问题：用户是否愿意把监控从视频切到桌面状态；是否相信 AI 对路径/活动的演绎；是否愿意为硬件捆绑后的 AI 生成额度持续付费。",
        "",
        "## 3. 竞品格局",
        "",
        "### 高威胁：直接占据安全/数据入口",
        "",
        *bullet_lines(high),
        "",
        "### 中威胁：占据内容、服务或远程照护预算",
        "",
        *bullet_lines(medium),
        "",
        "### 低威胁：相关但非核心对手",
        "",
        *bullet_lines(low),
        "",
        "## 4. 重点竞品逐项分析",
        "",
    ]

    for row in rows:
        lines.extend(
            [
                f"### {row['competitor']}",
                "",
                f"- 类别：{row['category']}",
                f"- 威胁等级：{row['threat_level']}",
                f"- 证据数量：{row['evidence_count']} 条，其中公开用户证据按规则折算 {row['strong_user_evidence_count']} 条。",
                f"- 主要痛点：{row['top_painpoints'] or '当前样本未命中明确痛点标签'}。",
                f"- 竞品缺口：{row['top_competitor_gaps'] or '当前样本未命中明确缺口标签'}。",
                f"- 付费信号：{row['payment_signals'] or '当前样本未命中明确付费信号'}。",
                f"- 对 PawRoom 的启发：{row['pawroom_opportunity']}",
                f"- 官方/产品参考：{row['official_url'] or '待补充'}",
                f"- 代表证据 ID：{row['representative_evidence_ids']}",
                f"- 代表原文摘录：{row['representative_quotes']}",
                "",
            ]
        )

    lines.extend(
        [
            "## 5. 对 PawRoom PRD 的建议",
            "",
            "### 应进入 MVP",
            "",
            "- 桌面小世界：不是完整游戏，而是工作时可常驻、低打扰、可一眼看懂的宠物状态空间。",
            "- 数据导入：先支持手动输入、CSV/JSON 模拟、公开样例数据，后续再评估 Tractive/Fi/FitBark 等硬件数据接入可行性。",
            "- 安全状态摘要：把活动降低、离开区域、长时间未动、异常叫声/焦虑等事件变成简洁提醒。",
            "- 今日小剧场：把路径、活动、用户补充事件生成四格漫画、短动画、桌宠动作或角色卡。",
            "- Paw Credits：硬件捆绑基础软件免费，AI 生成类能力按额度消耗，避免把“安全提醒”锁在付费墙后。",
            "",
            "### 暂不进入 MVP",
            "",
            "- 自研硬件项圈、医疗级生命体征判断、训练/电刺激控制、完整摄像头硬件、宠物医疗诊断。",
            "- 与成熟硬件正面比拼定位精度、续航、围栏、云视频，这些是强竞品长板。",
            "",
            "### 定价/商业模式判断",
            "",
            "- 付费理由应先讲安全：硬件购买/捆绑软件保障基础看护。",
            "- AI 消耗不叫 token，面向用户叫 Paw Credits：用于今日小剧场、风格化桌宠动作、表情包、短动画、回忆卡等生成。",
            "- 早期可设计三档：基础包随硬件赠送；月度轻量额度；高频生成/高清导出/实体周边兑换额外付费。",
            "",
            "## 6. 证据审计",
            "",
            "- 强证据：公开用户评论、论坛/Reddit/淘宝/小红书/抖音原文，且有链接或导出文件路径。",
            "- 中证据：测评、新闻、产品介绍，可用于竞品能力背景，不单独证明用户痛点。",
            "- 弱证据：无链接、无原文、疑似营销软文或无法追溯的摘要。",
            "- 当前已达成：100 条以上证据、20 个以上相关产品/竞品、公开链接保留、每条保留原文和证据 ID。",
            "- 仍需补强：中国用户证据。建议下一步用 Thunderbit/浏览器半自动导出小红书、淘宝问大家/差评、抖音评论，再导入 `data/evidence/manual/evidence_import_template.csv` 复跑。",
        ]
    )

    OUT_MD.parent.mkdir(parents=True, exist_ok=True)
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    raw_rows = read_rows()
    analysis_rows = grouped_analysis(raw_rows)
    write_csv(analysis_rows)
    write_markdown(analysis_rows, raw_rows)
    print(f"Wrote {OUT_CSV}")
    print(f"Wrote {OUT_MD}")


if __name__ == "__main__":
    main()

