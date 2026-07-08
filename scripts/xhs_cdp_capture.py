from __future__ import annotations

import argparse
import base64
import csv
import hashlib
import json
import os
import re
import socket
import struct
import time
import urllib.request
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "data" / "evidence" / "raw"
AUDIT_DIR = ROOT / "data" / "evidence" / "audit"
SCREENSHOT_DIR = RAW_DIR / "xhs_screenshots"
DEFAULT_CSV = RAW_DIR / "xhs_public_visible_capture.csv"
DEFAULT_JSON = RAW_DIR / "xhs_public_visible_capture.json"


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


EXTRACT_JS = r"""
(() => {
  const abs = (href) => {
    try { return href ? new URL(href, location.origin).href : ""; } catch (e) { return href || ""; }
  };
  const text = (node) => (node && node.innerText ? node.innerText.replace(/\s+/g, " ").trim() : "");
  const pick = (root, selectors) => {
    for (const sel of selectors) {
      const node = root.querySelector(sel);
      const value = text(node);
      if (value) return value;
    }
    return "";
  };
  const candidates = [
    ...document.querySelectorAll(".note-item"),
    ...document.querySelectorAll("[class*='note-item']"),
    ...document.querySelectorAll("[class*='NoteCard']"),
    ...document.querySelectorAll("section"),
    ...document.querySelectorAll("a[href*='/explore/']")
  ];
  const rows = [];
  for (const node of candidates) {
    const card = node.closest(".note-item,[class*='note-item'],section") || node;
    const rect = card.getBoundingClientRect ? card.getBoundingClientRect() : { width: 0, height: 0, top: 0, bottom: 0 };
    const visible = rect.width > 40 && rect.height > 40 && rect.bottom > 80 && rect.top < (window.innerHeight - 20);
    if (!visible) continue;
    const anchor = card.matches && card.matches("a[href]") ? card : card.querySelector("a[href*='/explore/'],a[href]");
    const url = abs(anchor ? anchor.getAttribute("href") : "");
    const title = pick(card, [".title", "[class*='title']", "[class*='Title']", "h1", "h2", "span"]);
    const author = pick(card, [".author", "[class*='author']", "[class*='name']", "[class*='user']"]);
    const likes = pick(card, [".like-wrapper", "[class*='like']", "[class*='count']"]);
    const body = text(card).slice(0, 1200);
    if (!url && body.length < 8) continue;
    rows.push({
      title,
      author,
      likes,
      url,
      text: body,
      page_url: location.href,
      page_title: document.title
    });
  }
  const seen = new Set();
  const clean = [];
  for (const row of rows) {
    const key = row.url || row.text;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    clean.push(row);
  }
  if (clean.length === 0) {
    clean.push({
      title: document.title || "",
      author: "",
      likes: "",
      url: location.href,
      text: document.body ? document.body.innerText.replace(/\s+/g, " ").trim().slice(0, 2000) : "",
      page_url: location.href,
      page_title: document.title || ""
    });
  }
  return clean.slice(0, 50);
})()
"""


def now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")


def get_tabs(port: int) -> list[dict]:
    with urllib.request.urlopen(f"http://127.0.0.1:{port}/json", timeout=5) as response:
        return json.loads(response.read().decode("utf-8"))


def pick_tab(tabs: list[dict]) -> dict:
    xhs_tabs = [tab for tab in tabs if "xiaohongshu.com" in tab.get("url", "")]
    if xhs_tabs:
        return xhs_tabs[0]
    pages = [tab for tab in tabs if tab.get("type") == "page"]
    if pages:
        return pages[0]
    raise RuntimeError("No debuggable browser page found.")


def read_exact(sock: socket.socket, n: int) -> bytes:
    chunks = []
    remaining = n
    while remaining > 0:
        chunk = sock.recv(remaining)
        if not chunk:
            raise ConnectionError("WebSocket closed unexpectedly.")
        chunks.append(chunk)
        remaining -= len(chunk)
    return b"".join(chunks)


class CDP:
    def __init__(self, ws_url: str):
        parsed = urlparse(ws_url)
        self.host = parsed.hostname or "127.0.0.1"
        self.port = parsed.port or 80
        self.path = parsed.path
        self.sock = socket.create_connection((self.host, self.port), timeout=10)
        self.next_id = 1
        self._handshake()

    def _handshake(self) -> None:
        key = base64.b64encode(os.urandom(16)).decode("ascii")
        request = (
            f"GET {self.path} HTTP/1.1\r\n"
            f"Host: {self.host}:{self.port}\r\n"
            "Upgrade: websocket\r\n"
            "Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            "Sec-WebSocket-Version: 13\r\n\r\n"
        )
        self.sock.sendall(request.encode("ascii"))
        response = b""
        while b"\r\n\r\n" not in response:
            response += self.sock.recv(4096)
        if b" 101 " not in response.split(b"\r\n", 1)[0]:
            raise RuntimeError(f"WebSocket handshake failed: {response[:200]!r}")

    def _send_text(self, text: str) -> None:
        payload = text.encode("utf-8")
        header = bytearray([0x81])
        length = len(payload)
        if length < 126:
            header.append(0x80 | length)
        elif length <= 0xFFFF:
            header.append(0x80 | 126)
            header.extend(struct.pack("!H", length))
        else:
            header.append(0x80 | 127)
            header.extend(struct.pack("!Q", length))
        mask = os.urandom(4)
        masked = bytes(byte ^ mask[i % 4] for i, byte in enumerate(payload))
        self.sock.sendall(bytes(header) + mask + masked)

    def _recv_text(self) -> str:
        while True:
            first, second = read_exact(self.sock, 2)
            opcode = first & 0x0F
            masked = bool(second & 0x80)
            length = second & 0x7F
            if length == 126:
                length = struct.unpack("!H", read_exact(self.sock, 2))[0]
            elif length == 127:
                length = struct.unpack("!Q", read_exact(self.sock, 8))[0]
            mask = read_exact(self.sock, 4) if masked else b""
            payload = read_exact(self.sock, length) if length else b""
            if masked:
                payload = bytes(byte ^ mask[i % 4] for i, byte in enumerate(payload))
            if opcode == 0x8:
                raise ConnectionError("WebSocket closed by browser.")
            if opcode == 0x9:
                self._send_pong(payload)
                continue
            if opcode in (0x1, 0x0):
                return payload.decode("utf-8", "replace")

    def _send_pong(self, payload: bytes) -> None:
        header = bytearray([0x8A])
        header.append(0x80 | len(payload))
        mask = os.urandom(4)
        masked = bytes(byte ^ mask[i % 4] for i, byte in enumerate(payload))
        self.sock.sendall(bytes(header) + mask + masked)

    def call(self, method: str, params: dict | None = None) -> dict:
        msg_id = self.next_id
        self.next_id += 1
        self._send_text(json.dumps({"id": msg_id, "method": method, "params": params or {}}))
        while True:
            message = json.loads(self._recv_text())
            if message.get("id") == msg_id:
                if "error" in message:
                    raise RuntimeError(f"CDP error for {method}: {message['error']}")
                return message.get("result", {})


def infer_scene(text: str) -> str:
    if re.search(r"上班|出门|不在家|独自在家|留守|分离焦虑", text):
        return "上班/离家期间看护"
    if re.search(r"走丢|跑丢|定位|围栏|轨迹", text):
        return "定位与安全边界"
    if re.search(r"老年|心率|呼吸|睡眠|健康|监测", text):
        return "生命状态趋势看护"
    if re.search(r"摄像头|监控|隐私|一直看", text):
        return "视频监控替代/低干扰提醒"
    return "小红书公开宠物看护讨论"


def infer_pet(text: str) -> str:
    has_dog = bool(re.search(r"狗|犬|狗狗|小狗|puppy", text, re.I))
    has_cat = bool(re.search(r"猫|猫咪|小猫|kitten", text, re.I))
    if has_dog and has_cat:
        return "狗/猫"
    if has_dog:
        return "狗"
    if has_cat:
        return "猫"
    return ""


def infer_solution(text: str) -> str:
    if re.search(r"摄像头|监控|camera", text, re.I):
        return "宠物摄像头/视频监控"
    if re.search(r"定位器|GPS|项圈|围栏|轨迹", text, re.I):
        return "宠物定位器/智能项圈"
    if re.search(r"记录|日记|照片|视频|vlog", text, re.I):
        return "照片/视频/日常记录"
    return ""


def infer_payment(text: str) -> str:
    if re.search(r"买|购买|多少钱|价格|贵|便宜|值|会员|订阅|付费", text):
        return "present"
    return "not_observed"


def compact_text(row: dict) -> str:
    title = row.get("title") or ""
    body = row.get("text") or ""
    if title and title not in body:
        return f"{title} | {body}"
    return body or title


def evidence_id(source_url: str, text: str) -> str:
    digest = hashlib.sha1(f"{source_url}|{text}".encode("utf-8")).hexdigest()[:10].upper()
    return f"XHS-{digest}"


def write_rows(rows: list[dict], screenshot_path: str, out_csv: Path, out_json: Path) -> None:
    out_csv.parent.mkdir(parents=True, exist_ok=True)
    existing = []
    if out_csv.exists():
        with out_csv.open("r", encoding="utf-8-sig", newline="") as f:
            existing = list(csv.DictReader(f))

    collected_at = now_iso()
    new_rows = []
    for row in rows:
        text = compact_text(row)
        source_url = row.get("url") or row.get("page_url") or ""
        if not text:
            continue
        note = {
            "evidence_id": evidence_id(source_url, text),
            "title": row.get("title", ""),
            "author": row.get("author", ""),
            "likes": row.get("likes", ""),
            "page_title": row.get("page_title", ""),
            "screenshot": screenshot_path,
        }
        new_rows.append(
            {
                "platform": "小红书",
                "source_type": "xhs_visible_page",
                "source_url": source_url,
                "collected_at": collected_at,
                "competitor": "",
                "product": "PawRoom related user discussion",
                "original_text": text[:1800],
                "user_scene": infer_scene(text),
                "pet_type": infer_pet(text),
                "current_solution": infer_solution(text),
                "payment_signal": infer_payment(text),
                "notes": json.dumps(note, ensure_ascii=False),
            }
        )

    merged = existing + new_rows
    seen = set()
    deduped = []
    for row in merged:
        key = (row.get("source_url", ""), row.get("original_text", "")[:160])
        if key in seen:
            continue
        seen.add(key)
        deduped.append(row)

    with out_csv.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(deduped)

    out_json.write_text(json.dumps(deduped, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(new_rows)} new visible XHS rows to {out_csv}")


def is_access_gate(rows: list[dict]) -> bool:
    joined = "\n".join(compact_text(row) for row in rows)
    gate_patterns = [
        "登录后查看搜索结果",
        "获取验证码",
        "扫码",
        "用户协议",
        "隐私政策",
    ]
    has_gate_text = sum(1 for pattern in gate_patterns if pattern in joined) >= 2
    has_note_url = any("/explore/" in (row.get("url") or "") for row in rows)
    return has_gate_text and not has_note_url


def write_access_audit(rows: list[dict], screenshot_path: str, tab: dict) -> None:
    AUDIT_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    audit_path = AUDIT_DIR / f"xhs-access-gate-{stamp}.json"
    payload = {
        "collected_at": now_iso(),
        "reason": "Xiaohongshu required login before showing search results. This is not counted as user evidence.",
        "tab_title": tab.get("title", ""),
        "tab_url": tab.get("url", ""),
        "screenshot": screenshot_path,
        "visible_text_excerpt": compact_text(rows[0])[:1200] if rows else "",
    }
    audit_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Access gate detected. Wrote audit only: {audit_path}")
def main() -> None:
    parser = argparse.ArgumentParser(description="Capture visible Xiaohongshu research evidence from a user-authorized browser tab.")
    parser.add_argument("--port", type=int, default=9222)
    parser.add_argument("--out-csv", type=Path, default=DEFAULT_CSV)
    parser.add_argument("--out-json", type=Path, default=DEFAULT_JSON)
    parser.add_argument("--screenshot-dir", type=Path, default=SCREENSHOT_DIR)
    args = parser.parse_args()

    tabs = get_tabs(args.port)
    tab = pick_tab(tabs)
    ws_url = tab.get("webSocketDebuggerUrl")
    if not ws_url:
        raise RuntimeError("Selected tab has no webSocketDebuggerUrl. Start Chrome/Edge with remote debugging.")

    cdp = CDP(ws_url)
    cdp.call("Page.enable")
    cdp.call("Runtime.enable")
    time.sleep(2)
    result = cdp.call(
        "Runtime.evaluate",
        {
            "expression": EXTRACT_JS,
            "returnByValue": True,
            "awaitPromise": True,
        },
    )
    rows = result.get("result", {}).get("value", [])
    args.screenshot_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    screenshot_path = args.screenshot_dir / f"xhs-visible-{stamp}.png"
    shot = cdp.call("Page.captureScreenshot", {"format": "png", "fromSurface": True})
    screenshot_path.write_bytes(base64.b64decode(shot["data"]))

    rel_screenshot = str(screenshot_path.relative_to(ROOT))
    if is_access_gate(rows):
        write_access_audit(rows, rel_screenshot, tab)
    else:
        write_rows(rows, rel_screenshot, args.out_csv, args.out_json)
    print(f"Captured screenshot: {screenshot_path}")
    print(f"Selected tab: {tab.get('title')} | {tab.get('url')}")
    print("If rows are empty or only show login text, log in and run this script again.")


if __name__ == "__main__":
    main()



