from __future__ import annotations

import argparse
import base64
import csv
import time
from datetime import datetime
from pathlib import Path
from urllib.parse import quote_plus

from xhs_cdp_capture import (
    ROOT,
    SCREENSHOT_DIR,
    DEFAULT_CSV,
    DEFAULT_JSON,
    CDP,
    EXTRACT_JS,
    get_tabs,
    is_access_gate,
    pick_tab,
    write_access_audit,
    write_rows,
)


TASKS = ROOT / "data" / "evidence" / "tasks" / "xhs_keyword_tasks.csv"


def read_keywords(path: Path, limit: int | None = None) -> list[str]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    keywords = [row["keyword"].strip() for row in rows if row.get("keyword", "").strip()]
    if limit:
        keywords = keywords[:limit]
    return keywords


def capture_current(cdp: CDP, tab: dict, keyword: str, out_csv: Path, out_json: Path, screenshot_dir: Path) -> tuple[int, bool]:
    cdp.call("Runtime.evaluate", {"expression": "window.scrollTo(0, 0)"})
    for _ in range(6):
        count_result = cdp.call(
            "Runtime.evaluate",
            {
                "expression": "Array.from(document.querySelectorAll(\"a[href*='/explore/']\")).filter(a => { const r = a.getBoundingClientRect(); return r.width > 40 && r.height > 40 && r.bottom > 80 && r.top < window.innerHeight - 20; }).length",
                "returnByValue": True,
            },
        )
        count = count_result.get("result", {}).get("value", 0)
        if count >= 3:
            break
        time.sleep(1.5)
    time.sleep(1.0)

    result = cdp.call(
        "Runtime.evaluate",
        {
            "expression": EXTRACT_JS,
            "returnByValue": True,
            "awaitPromise": True,
        },
    )
    rows = result.get("result", {}).get("value", [])
    screenshot_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    screenshot_path = screenshot_dir / f"xhs-batch-{stamp}.png"
    shot = cdp.call("Page.captureScreenshot", {"format": "png", "fromSurface": True})
    screenshot_path.write_bytes(base64.b64decode(shot["data"]))
    rel_screenshot = str(screenshot_path.relative_to(ROOT))

    if is_access_gate(rows):
        audit_tab = dict(tab)
        audit_tab["title"] = f"XHS search: {keyword}"
        audit_tab["url"] = f"https://www.xiaohongshu.com/search_result?keyword={quote_plus(keyword)}"
        write_access_audit(rows, rel_screenshot, audit_tab)
        return 0, True

    before = 0
    if out_csv.exists():
        with out_csv.open("r", encoding="utf-8-sig", newline="") as f:
            before = max(0, len(list(csv.DictReader(f))))
    write_rows(rows, rel_screenshot, out_csv, out_json)
    after = before
    if out_csv.exists():
        with out_csv.open("r", encoding="utf-8-sig", newline="") as f:
            after = max(0, len(list(csv.DictReader(f))))
    return max(0, after - before), False


def main() -> None:
    parser = argparse.ArgumentParser(description="Batch-capture Xiaohongshu visible evidence after user-authorized login.")
    parser.add_argument("--port", type=int, default=9222)
    parser.add_argument("--tasks", type=Path, default=TASKS)
    parser.add_argument("--limit", type=int, default=5)
    parser.add_argument("--wait", type=float, default=8.0)
    parser.add_argument("--out-csv", type=Path, default=DEFAULT_CSV)
    parser.add_argument("--out-json", type=Path, default=DEFAULT_JSON)
    parser.add_argument("--screenshot-dir", type=Path, default=SCREENSHOT_DIR)
    args = parser.parse_args()

    keywords = read_keywords(args.tasks, args.limit)
    tabs = get_tabs(args.port)
    tab = pick_tab(tabs)
    ws_url = tab.get("webSocketDebuggerUrl")
    if not ws_url:
        raise RuntimeError("Selected tab has no webSocketDebuggerUrl. Start browser with scripts/start_xhs_research_browser.ps1.")

    cdp = CDP(ws_url)
    cdp.call("Page.enable")
    cdp.call("Runtime.enable")

    total_new = 0
    blocked = 0
    for keyword in keywords:
        url = f"https://www.xiaohongshu.com/search_result?keyword={quote_plus(keyword)}"
        print(f"Opening: {keyword}")
        cdp.call("Page.navigate", {"url": url})
        time.sleep(args.wait)
        added, gated = capture_current(cdp, tab, keyword, args.out_csv, args.out_json, args.screenshot_dir)
        total_new += added
        blocked += 1 if gated else 0
        print(f"Keyword result: added={added}, access_gate={gated}")

    print(f"Batch finished. New rows: {total_new}. Access-gated pages: {blocked}/{len(keywords)}.")
    if blocked:
        print("If all pages are access-gated, log in inside the opened research browser and run this command again.")


if __name__ == "__main__":
    main()

