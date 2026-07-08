from __future__ import annotations

import csv
import json
import shutil
from collections import Counter
from datetime import datetime
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
RAW_CSV = ROOT / "data" / "evidence" / "raw" / "xhs_public_visible_capture.csv"
RAW_JSON = ROOT / "data" / "evidence" / "raw" / "xhs_public_visible_capture.json"
AUDIT_DIR = ROOT / "data" / "evidence" / "audit"
INVALID_ROWS = AUDIT_DIR / "xhs_invalid_screenshot_rows.csv"
INVALID_SCREENSHOTS = AUDIT_DIR / "xhs_invalid_screenshots"


FIELDS = [
    "platform",
    "source_type",
    "source_url",
    "collected_at",
    "competitor",
    "product",
    "original_text",
    "user_scene",
    "pet_type",
    "current_solution",
    "payment_signal",
    "notes",
]


def note_json(row: dict[str, str]) -> dict:
    try:
        return json.loads(row.get("notes") or "{}")
    except Exception:
        return {}


def image_stats(path: Path) -> dict:
    if not path.exists():
        return {"exists": False}
    im = Image.open(path).convert("RGB").resize((80, 80))
    pixels = list(im.getdata())
    lum = [0.299 * r + 0.587 * g + 0.114 * b for r, g, b in pixels]
    return {
        "exists": True,
        "size": path.stat().st_size,
        "dark_ratio": sum(1 for value in lum if value < 35) / len(lum),
        "bright_ratio": sum(1 for value in lum if value > 200) / len(lum),
    }


def invalid_reason(row: dict[str, str]) -> str:
    text = row.get("original_text", "")
    notes = note_json(row)
    shot = notes.get("screenshot", "")
    shot_path = ROOT / shot if shot else None
    source = row.get("source_url", "")

    gate_terms = ["登录后查看搜索结果", "获取验证码", "用户协议", "隐私政策", "扫码", "打开小红书"]
    if sum(1 for term in gate_terms if term in text) >= 2:
        return "login_or_qr_gate_text"
    if not shot:
        return "missing_screenshot_reference"
    stats = image_stats(shot_path)
    if not stats.get("exists"):
        return "missing_screenshot_file"

    name = shot_path.name
    if name.startswith("xhs-visible-"):
        return "visible_capture_login_gate"
    if name.startswith("xhs-note-") and stats["dark_ratio"] > 0.85 and stats["size"] < 220_000:
        return "note_detail_qr_or_empty"
    if stats["dark_ratio"] > 0.80 and stats["size"] < 220_000:
        return "dark_skeleton_or_empty_page"
    if "/explore/" not in source and len(text) < 12:
        return "no_note_link_and_too_short"
    return ""


def read_rows() -> list[dict[str, str]]:
    if not RAW_CSV.exists():
        return []
    with RAW_CSV.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def write_csv(path: Path, rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    AUDIT_DIR.mkdir(parents=True, exist_ok=True)
    INVALID_SCREENSHOTS.mkdir(parents=True, exist_ok=True)
    rows = read_rows()
    valid: list[dict[str, str]] = []
    invalid: list[dict[str, str]] = []
    reasons = Counter()
    invalid_shots = set()

    for row in rows:
        reason = invalid_reason(row)
        if reason:
            row = dict(row)
            notes = note_json(row)
            notes["invalid_reason"] = reason
            notes["invalidated_at"] = datetime.now().isoformat(timespec="seconds")
            row["notes"] = json.dumps(notes, ensure_ascii=False)
            invalid.append(row)
            reasons[reason] += 1
            shot = notes.get("screenshot", "")
            if shot:
                invalid_shots.add(shot)
        else:
            valid.append(row)

    if invalid:
        existing_invalid = []
        if INVALID_ROWS.exists():
            with INVALID_ROWS.open("r", encoding="utf-8-sig", newline="") as f:
                existing_invalid = list(csv.DictReader(f))
        write_csv(INVALID_ROWS, existing_invalid + invalid)

    write_csv(RAW_CSV, valid)
    RAW_JSON.write_text(json.dumps(valid, ensure_ascii=False, indent=2), encoding="utf-8")

    valid_shots = {note_json(row).get("screenshot", "") for row in valid if note_json(row).get("screenshot", "")}
    moved = 0
    for rel in invalid_shots:
        if rel in valid_shots:
            continue
        src = ROOT / rel
        if src.exists() and src.is_file():
            dst = INVALID_SCREENSHOTS / src.name
            if not dst.exists():
                shutil.move(str(src), str(dst))
                moved += 1

    print(f"XHS screenshot quality audit complete.")
    print(f"Valid rows: {len(valid)}")
    print(f"Invalid rows moved to audit: {len(invalid)}")
    print(f"Invalid screenshots moved: {moved}")
    print(f"Reasons: {dict(reasons)}")


if __name__ == "__main__":
    main()

