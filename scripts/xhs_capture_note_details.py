from __future__ import annotations

import argparse
import base64
import csv
import time
from collections import OrderedDict
from datetime import datetime
from pathlib import Path

from xhs_cdp_capture import (
    ROOT,
    SCREENSHOT_DIR,
    DEFAULT_CSV,
    DEFAULT_JSON,
    CDP,
    get_tabs,
    is_access_gate,
    pick_tab,
    write_access_audit,
    write_rows,
)


RAW = ROOT / "data" / "evidence" / "raw" / "xhs_public_visible_capture.csv"


DETAIL_JS = r"""
(() => {
  const text = (node) => (node && node.innerText ? node.innerText.replace(/\s+/g, " ").trim() : "");
  const q = (selectors) => {
    for (const sel of selectors) {
      const node = document.querySelector(sel);
      const value = text(node);
      if (value) return value;
    }
    return "";
  };
  const title = q([".title", "[class*='title']", "h1"]);
  const author = q([".author", "[class*='author']", "[class*='name']", "[class*='user']"]);
  const likes = q([".like-wrapper", "[class*='like']", "[class*='count']"]);
  let body = q([".note-content", "[class*='note-content']", "[class*='content']", "main", "body"]);
  if (!body && document.body) body = document.body.innerText.replace(/\s+/g, " ").trim();
  return [{
    title: title || document.title || "",
    author,
    likes,
    url: location.href,
    text: body.slice(0, 1800),
    page_url: location.href,
    page_title: document.title || ""
  }];
})()
"""


def pick_urls(limit: int) -> list[str]:
    with RAW.open("r", encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    seen: OrderedDict[str, None] = OrderedDict()
    preferred_scenes = [
        "上班/离家期间看护",
        "视频监控替代/低干扰提醒",
        "定位与安全边界",
        "生命状态趋势看护",
        "小红书公开宠物看护讨论",
    ]
    for scene in preferred_scenes:
        for row in rows:
            url = row.get("source_url", "")
            if row.get("user_scene") == scene and "/explore/" in url:
                seen.setdefault(url, None)
                if len(seen) >= limit:
                    return list(seen.keys())
    return list(seen.keys())[:limit]


def capture_detail(cdp: CDP, tab: dict, url: str, out_csv: Path, out_json: Path, screenshot_dir: Path, wait: float) -> tuple[int, bool]:
    cdp.call("Page.navigate", {"url": url})
    time.sleep(wait)
    result = cdp.call(
        "Runtime.evaluate",
        {
            "expression": DETAIL_JS,
            "returnByValue": True,
            "awaitPromise": True,
        },
    )
    rows = result.get("result", {}).get("value", [])
    screenshot_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    screenshot_path = screenshot_dir / f"xhs-note-{stamp}.png"
    shot = cdp.call("Page.captureScreenshot", {"format": "png", "fromSurface": True})
    screenshot_path.write_bytes(base64.b64decode(shot["data"]))
    rel_screenshot = str(screenshot_path.relative_to(ROOT))
    if is_access_gate(rows):
        audit_tab = dict(tab)
        audit_tab["title"] = f"XHS note detail: {url}"
        audit_tab["url"] = url
        write_access_audit(rows, rel_screenshot, audit_tab)
        return 0, True

    before = 0
    if out_csv.exists():
        with out_csv.open("r", encoding="utf-8-sig", newline="") as f:
            before = len(list(csv.DictReader(f)))
    write_rows(rows, rel_screenshot, out_csv, out_json)
    after = before
    if out_csv.exists():
        with out_csv.open("r", encoding="utf-8-sig", newline="") as f:
            after = len(list(csv.DictReader(f)))
    return max(0, after - before), False


def main() -> None:
    parser = argparse.ArgumentParser(description="Capture representative Xiaohongshu note detail pages.")
    parser.add_argument("--port", type=int, default=9222)
    parser.add_argument("--limit", type=int, default=12)
    parser.add_argument("--wait", type=float, default=5.0)
    parser.add_argument("--out-csv", type=Path, default=DEFAULT_CSV)
    parser.add_argument("--out-json", type=Path, default=DEFAULT_JSON)
    parser.add_argument("--screenshot-dir", type=Path, default=SCREENSHOT_DIR)
    args = parser.parse_args()

    urls = pick_urls(args.limit)
    tabs = get_tabs(args.port)
    tab = pick_tab(tabs)
    ws_url = tab.get("webSocketDebuggerUrl")
    if not ws_url:
        raise RuntimeError("Selected tab has no webSocketDebuggerUrl.")
    cdp = CDP(ws_url)
    cdp.call("Page.enable")
    cdp.call("Runtime.enable")

    total = 0
    gated = 0
    for url in urls:
        print(f"Opening note: {url}")
        added, blocked = capture_detail(cdp, tab, url, args.out_csv, args.out_json, args.screenshot_dir, args.wait)
        total += added
        gated += 1 if blocked else 0
        print(f"Note result: added={added}, access_gate={blocked}")
    print(f"Detail capture finished. New rows: {total}. Access-gated notes: {gated}/{len(urls)}.")


if __name__ == "__main__":
    main()
