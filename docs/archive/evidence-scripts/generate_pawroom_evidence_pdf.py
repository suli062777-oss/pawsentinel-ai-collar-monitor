from __future__ import annotations

import csv
import json
import math
import re
from collections import Counter
from datetime import datetime
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
EVIDENCE_CSV = ROOT / "data" / "evidence" / "processed" / "evidence_items.csv"
PAINPOINT_CSV = ROOT / "data" / "evidence" / "processed" / "painpoint_summary.csv"
COMPETITOR_CSV = ROOT / "data" / "evidence" / "processed" / "competitor_analysis.csv"
OUT_DIR = ROOT / "output" / "pdf"
OUT_PDF = OUT_DIR / "pawroom-evidence-competitor-onepage.pdf"
OUT_JSON = OUT_DIR / "pawroom-evidence-competitor-onepage-data.json"


PALETTE = {
    "ink": colors.HexColor("#16202A"),
    "muted": colors.HexColor("#64707D"),
    "line": colors.HexColor("#DCE3EA"),
    "paper": colors.HexColor("#F6F8FA"),
    "card": colors.white,
    "teal": colors.HexColor("#0E766E"),
    "blue": colors.HexColor("#276EF1"),
    "orange": colors.HexColor("#F59E0B"),
    "red": colors.HexColor("#E5484D"),
    "green": colors.HexColor("#22A06B"),
    "violet": colors.HexColor("#7C3AED"),
    "yellow": colors.HexColor("#FACC15"),
}


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def register_fonts() -> tuple[str, str]:
    candidates = [
        (r"C:\Windows\Fonts\NotoSansSC-Regular.ttf", r"C:\Windows\Fonts\SourceHanSansSC-Medium.ttf"),
        (r"C:\Windows\Fonts\simhei.ttf", r"C:\Windows\Fonts\simhei.ttf"),
        (r"C:\Windows\Fonts\Deng.ttf", r"C:\Windows\Fonts\Dengb.ttf"),
    ]
    for regular, bold in candidates:
        if Path(regular).exists() and Path(bold).exists():
            pdfmetrics.registerFont(TTFont("CN", regular))
            pdfmetrics.registerFont(TTFont("CN-Bold", bold))
            return "CN", "CN-Bold"
    return "Helvetica", "Helvetica-Bold"


FONT, FONT_BOLD = register_fonts()


def chex(value: str) -> colors.Color:
    return colors.HexColor(value)


def wrap_text(text: str, font_name: str, font_size: float, max_width: float, max_lines: int | None = None) -> list[str]:
    text = re.sub(r"\s+", " ", text.strip())
    if not text:
        return []
    lines: list[str] = []
    current = ""
    for char in text:
        candidate = current + char
        if pdfmetrics.stringWidth(candidate, font_name, font_size) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = char
            if max_lines and len(lines) >= max_lines:
                break
    if current and (not max_lines or len(lines) < max_lines):
        lines.append(current)
    if max_lines and len(lines) == max_lines:
        last = lines[-1]
        while last and pdfmetrics.stringWidth(last + "...", font_name, font_size) > max_width:
            last = last[:-1]
        lines[-1] = last + "..."
    return lines


def draw_text(
    c: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    size: float = 10,
    font: str = FONT,
    color: colors.Color = PALETTE["ink"],
    max_width: float | None = None,
    max_lines: int | None = None,
    leading: float | None = None,
) -> float:
    c.setFillColor(color)
    c.setFont(font, size)
    if max_width:
        lines = wrap_text(text, font, size, max_width, max_lines=max_lines)
    else:
        lines = [text]
    if leading is None:
        leading = size * 1.35
    yy = y
    for line in lines:
        c.drawString(x, yy, line)
        yy -= leading
    return yy


def draw_right_text(c: canvas.Canvas, text: str, x: float, y: float, size: float, font: str, color: colors.Color) -> None:
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawRightString(x, y, text)


def card(c: canvas.Canvas, x: float, y: float, w: float, h: float, title: str | None = None) -> None:
    c.setFillColor(colors.Color(0, 0, 0, alpha=0.05))
    c.roundRect(x + 1.5, y - 1.5, w, h, 8, stroke=0, fill=1)
    c.setFillColor(PALETTE["card"])
    c.setStrokeColor(PALETTE["line"])
    c.setLineWidth(0.7)
    c.roundRect(x, y, w, h, 8, stroke=1, fill=1)
    if title:
        draw_text(c, title, x + 14, y + h - 22, 10.5, FONT_BOLD, PALETTE["ink"])


def draw_metric(c: canvas.Canvas, x: float, y: float, w: float, h: float, label: str, value: str, detail: str, color: colors.Color) -> None:
    card(c, x, y, w, h)
    c.setFillColor(color)
    c.roundRect(x + 12, y + h - 24, 24, 6, 3, stroke=0, fill=1)
    draw_text(c, label, x + 12, y + h - 42, 8.5, FONT_BOLD, PALETTE["muted"])
    draw_text(c, value, x + 12, y + 22, 25, FONT_BOLD, PALETTE["ink"])
    draw_text(c, detail, x + 72, y + 27, 8.3, FONT, PALETTE["muted"], max_width=w - 84, max_lines=2)


def draw_bar_chart(c: canvas.Canvas, x: float, y: float, w: float, h: float, painpoints: list[dict[str, str]]) -> None:
    card(c, x, y, w, h, "高频痛点聚类 - 证据量与情绪强度")
    chart_x = x + 16
    chart_y = y + 22
    chart_w = w - 32
    top = y + h - 44
    rows = painpoints[:8]
    max_count = max(int(row["count"]) for row in rows) if rows else 1
    row_h = (top - chart_y) / max(len(rows), 1)
    colors_list = [
        PALETTE["green"],
        PALETTE["violet"],
        PALETTE["orange"],
        PALETTE["blue"],
        PALETTE["teal"],
        PALETTE["red"],
        cHex("#8A63D2"),
        cHex("#7A869A"),
    ]
    for idx, row in enumerate(rows):
        yy = top - (idx + 1) * row_h + 5
        label = row["painpoint_tag"]
        count = int(row["count"])
        emotion = float(row["avg_emotion_strength"])
        draw_text(c, label, chart_x, yy + 8, 8.4, FONT_BOLD, PALETTE["ink"], max_width=135, max_lines=1)
        bar_x = chart_x + 144
        bar_w = (chart_w - 202) * count / max_count
        c.setFillColor(cHex("#EDF2F7"))
        c.roundRect(bar_x, yy + 8, chart_w - 202, 8, 4, stroke=0, fill=1)
        c.setFillColor(colors_list[idx % len(colors_list)])
        c.roundRect(bar_x, yy + 8, bar_w, 8, 4, stroke=0, fill=1)
        dot_x = bar_x + min(chart_w - 202, max(0, (emotion / 5.0) * (chart_w - 202)))
        c.setFillColor(PALETTE["ink"])
        c.circle(dot_x, yy + 12, 2.4, stroke=0, fill=1)
        draw_right_text(c, f"{count}条 / 强度{emotion:.1f}", x + w - 16, yy + 8, 8, FONT, PALETTE["muted"])
    draw_text(c, "黑点代表平均情绪强度，越靠右越强。", chart_x + 144, y + 10, 7.3, FONT, PALETTE["muted"])


def cHex(value: str) -> colors.Color:
    return colors.HexColor(value)


def draw_donut(c: canvas.Canvas, cx: float, cy: float, r: float, values: list[tuple[str, int, colors.Color]]) -> None:
    total = sum(v for _, v, _ in values) or 1
    start = 90
    for label, value, color in values:
        extent = -360 * value / total
        c.setFillColor(color)
        c.wedge(cx - r, cy - r, cx + r, cy + r, start, extent, stroke=0, fill=1)
        start += extent
    c.setFillColor(PALETTE["card"])
    c.circle(cx, cy, r * 0.58, stroke=0, fill=1)
    draw_text(c, str(total), cx - 8, cy + 2, 16, FONT_BOLD, PALETTE["ink"])
    draw_text(c, "竞品", cx - 13, cy - 13, 7.8, FONT, PALETTE["muted"])


def draw_threat_panel(c: canvas.Canvas, x: float, y: float, w: float, h: float, competitors: list[dict[str, str]]) -> None:
    card(c, x, y, w, h, "竞品威胁格局")
    threat_counts = Counter(row["threat_level"] for row in competitors)
    values = [
        ("高", threat_counts.get("高", 0), PALETTE["red"]),
        ("中", threat_counts.get("中", 0), PALETTE["orange"]),
        ("低", threat_counts.get("低", 0), PALETTE["green"]),
    ]
    draw_donut(c, x + 66, y + h - 86, 42, values)
    legend_x = x + 126
    legend_y = y + h - 58
    for idx, (label, value, color) in enumerate(values):
        yy = legend_y - idx * 22
        c.setFillColor(color)
        c.roundRect(legend_x, yy - 2, 16, 8, 4, stroke=0, fill=1)
        draw_text(c, f"{label}威胁 {value} 个", legend_x + 22, yy - 3, 9, FONT_BOLD, PALETTE["ink"])
    high = [row for row in competitors if row["threat_level"] == "高"]
    high_sorted = sorted(high, key=lambda row: int(row["evidence_count"]), reverse=True)[:6]
    draw_text(c, "高威胁直接对手", x + 16, y + h - 140, 9.5, FONT_BOLD, PALETTE["ink"])
    cols = 2
    tag_w = (w - 42) / cols
    for idx, row in enumerate(high_sorted):
        col = idx % cols
        rrow = idx // cols
        tx = x + 16 + col * (tag_w + 10)
        ty = y + h - 164 - rrow * 24
        c.setFillColor(cHex("#FFF5F5") if row["threat_level"] == "高" else cHex("#F7FAFC"))
        c.setStrokeColor(cHex("#FFD1D1"))
        c.roundRect(tx, ty, tag_w, 16, 5, stroke=1, fill=1)
        draw_text(c, f"{row['competitor']} {row['evidence_count']}条", tx + 6, ty + 4, 7.6, FONT_BOLD, PALETTE["ink"], max_width=tag_w - 12, max_lines=1)


def draw_strategy_panel(c: canvas.Canvas, x: float, y: float, w: float, h: float) -> None:
    card(c, x, y, w, h, "PawRoom 战略切入")
    left_w = w * 0.49
    mid_x = x + left_w + 16
    c.setStrokeColor(PALETTE["line"])
    c.line(mid_x - 8, y + 18, mid_x - 8, y + h - 40)

    draw_text(c, "市场判断", x + 16, y + h - 52, 9.8, FONT_BOLD, PALETTE["teal"])
    market_lines = [
        "安全焦虑是付费理由: 逃跑、误食、老年/幼宠异常。",
        "视频监控有压力: 用户需要知道状态，但不想一直盯着画面。",
        "硬件竞品强: PawRoom 先做数据解释层和可爱化体验层。",
    ]
    yy = y + h - 72
    for line in market_lines:
        c.setFillColor(PALETTE["teal"])
        c.circle(x + 21, yy + 4, 2.2, stroke=0, fill=1)
        yy = draw_text(c, line, x + 30, yy, 8.8, FONT, PALETTE["ink"], max_width=left_w - 44, max_lines=2, leading=12) - 2

    draw_text(c, "MVP 优先级", mid_x, y + h - 52, 9.8, FONT_BOLD, PALETTE["blue"])
    mvp_lines = [
        "做: 桌面小世界、状态摘要、今日小剧场、Paw Credits。",
        "接: CSV/JSON/手动数据，后续再接 Tractive、Fi、FitBark 等。",
        "避: 自研项圈、医疗诊断、训练电刺激、完整摄像头硬件。",
    ]
    yy = y + h - 72
    for line in mvp_lines:
        c.setFillColor(PALETTE["blue"])
        c.circle(mid_x + 5, yy + 4, 2.2, stroke=0, fill=1)
        yy = draw_text(c, line, mid_x + 14, yy, 8.8, FONT, PALETTE["ink"], max_width=w - left_w - 40, max_lines=2, leading=12) - 2


def build_data() -> dict:
    evidence = read_csv(EVIDENCE_CSV)
    painpoints = read_csv(PAINPOINT_CSV)
    competitors = read_csv(COMPETITOR_CSV)
    platform_counts = Counter(row["platform"] for row in evidence)
    strength_counts = Counter(row["evidence_strength"] for row in evidence)
    threat_counts = Counter(row["threat_level"] for row in competitors)
    high_competitors = [
        {
            "competitor": row["competitor"],
            "category": row["category"],
            "evidence_count": int(row["evidence_count"]),
            "top_painpoints": row["top_painpoints"],
            "opportunity": row["pawroom_opportunity"],
        }
        for row in competitors
        if row["threat_level"] == "高"
    ]
    high_competitors.sort(key=lambda row: row["evidence_count"], reverse=True)
    data = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "source_files": {
            "evidence": str(EVIDENCE_CSV.relative_to(ROOT)),
            "painpoints": str(PAINPOINT_CSV.relative_to(ROOT)),
            "competitors": str(COMPETITOR_CSV.relative_to(ROOT)),
        },
        "metrics": {
            "evidence_count": len(evidence),
            "strong_evidence_count": strength_counts.get("strong", 0),
            "medium_evidence_count": strength_counts.get("medium", 0),
            "context_evidence_count": strength_counts.get("context", 0),
            "competitor_count": len(competitors),
            "high_threat_count": threat_counts.get("高", 0),
            "medium_threat_count": threat_counts.get("中", 0),
            "low_threat_count": threat_counts.get("低", 0),
        },
        "platform_counts": dict(platform_counts),
        "painpoints": painpoints,
        "threat_counts": dict(threat_counts),
        "high_competitors": high_competitors,
    }
    return data


def render_pdf(data: dict) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    width, height = landscape(A4)
    c = canvas.Canvas(str(OUT_PDF), pagesize=(width, height))
    c.setTitle("PawRoom Evidence and Competitor One-page Chart")
    c.setAuthor("Codex")

    c.setFillColor(PALETTE["paper"])
    c.rect(0, 0, width, height, stroke=0, fill=1)

    margin = 28
    draw_text(c, "PawRoom 用户证据与竞品机会图谱", margin, height - 45, 19, FONT_BOLD, PALETTE["ink"])
    draw_text(c, "一页结构化可视化: 证据规模、痛点聚类、竞品威胁与 MVP 切入", margin, height - 65, 9.5, FONT, PALETTE["muted"])
    draw_right_text(c, f"生成时间 {data['generated_at'][:10]}", width - margin, height - 42, 8.8, FONT, PALETTE["muted"])
    draw_right_text(c, "数据源: evidence_items / painpoint_summary / competitor_analysis", width - margin, height - 58, 8.2, FONT, PALETTE["muted"])

    metrics = data["metrics"]
    gap = 12
    metric_y = height - 132
    metric_h = 54
    metric_w = (width - margin * 2 - gap * 3) / 4
    metric_cards = [
        ("证据总量", str(metrics["evidence_count"]), "已超过 100 条验收线", PALETTE["blue"]),
        ("强证据", str(metrics["strong_evidence_count"]), "公开用户评论为主", PALETTE["green"]),
        ("竞品覆盖", str(metrics["competitor_count"]), "含硬件、摄像头、服务、内容", PALETTE["violet"]),
        ("高威胁竞品", str(metrics["high_threat_count"]), "集中在安全和数据入口", PALETTE["red"]),
    ]
    for i, item in enumerate(metric_cards):
        draw_metric(c, margin + i * (metric_w + gap), metric_y, metric_w, metric_h, *item)

    left_x = margin
    main_y = 190
    main_h = 242
    left_w = 500
    right_x = left_x + left_w + 14
    right_w = width - margin - right_x
    draw_bar_chart(c, left_x, main_y, left_w, main_h, data["painpoints"])

    competitors = read_csv(COMPETITOR_CSV)
    draw_threat_panel(c, right_x, main_y, right_w, main_h, competitors)

    draw_strategy_panel(c, margin, 32, width - margin * 2, 142)

    footer = "可追溯文件: output/pdf/pawroom-evidence-competitor-onepage-data.json；完整证据见 data/evidence/processed/evidence_items.csv"
    draw_text(c, footer, margin, 14, 7.2, FONT, PALETTE["muted"])
    c.showPage()
    c.save()


def main() -> None:
    data = build_data()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    render_pdf(data)
    print(f"Wrote {OUT_PDF}")
    print(f"Wrote {OUT_JSON}")


if __name__ == "__main__":
    main()
