#!/usr/bin/env python3
"""Collect public App Store review cards for PawRoom competitor evidence.

The old Apple customerreviews RSS endpoint now often returns an empty feed.
This script reads public App Store "see all reviews" pages and extracts visible
review cards. It does not log in, bypass access controls, or call private APIs.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import html
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "data" / "evidence" / "raw"

APPS = [
    {"competitor": "Furbo", "term": "Furbo", "expected": "Furbo"},
    {"competitor": "Petcube", "term": "Petcube", "expected": "Petcube"},
    {"competitor": "Tractive", "term": "Tractive GPS", "expected": "Tractive"},
    {"competitor": "Fi", "term": "Fi GPS Dog Tracker", "expected": "Fi"},
    {"competitor": "FitBark", "term": "FitBark GPS", "expected": "FitBark"},
    {"competitor": "PetPace", "term": "PetPace Health", "expected": "PetPace"},
    {"competitor": "Halo Collar", "term": "Halo Collar", "expected": "Halo"},
    {"competitor": "SpotOn", "term": "SpotOn GPS Fence", "expected": "SpotOn"},
    {"competitor": "Barkio", "term": "Barkio Dog Monitor Pet Cam", "expected": "Barkio"},
    {"competitor": "Petlibro", "term": "Petlibro", "expected": "Petlibro"},
    {"competitor": "PetSmart", "term": "PetSmart", "expected": "PetSmart"},
    {"competitor": "Dogo", "term": "Dogo Dog Training", "expected": "Dogo"},
    {"competitor": "Puppr", "term": "Puppr dog training", "expected": "Puppr"},
]


def fetch_json(url: str) -> dict:
    with urllib.request.urlopen(url, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def fetch_text(url: str) -> str:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 PawRoomResearch/0.1",
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8", "ignore")


def itunes_search(term: str) -> list[dict]:
    query = urllib.parse.urlencode({"term": term, "country": "us", "entity": "software", "limit": 8})
    return fetch_json(f"https://itunes.apple.com/search?{query}").get("results", [])


def choose_app(results: list[dict], expected: str) -> dict | None:
    expected_lower = expected.casefold()
    for result in results:
        name = result.get("trackName", "")
        artist = result.get("artistName", "")
        combined = f"{name} {artist}".casefold()
        if expected_lower in combined:
            return result
    return results[0] if results else None


def strip_tags(fragment: str) -> str:
    fragment = re.sub(r"<script.*?</script>", " ", fragment, flags=re.S | re.I)
    fragment = re.sub(r"<style.*?</style>", " ", fragment, flags=re.S | re.I)
    fragment = re.sub(r"<[^>]+>", " ", fragment)
    fragment = html.unescape(fragment)
    fragment = re.sub(r"\s+", " ", fragment).strip()
    return fragment


def extract_review_cards(page: str) -> list[dict[str, str]]:
    section_pos = page.find('id="allProductReviews"')
    section = page[section_pos:] if section_pos >= 0 else page
    ids = list(dict.fromkeys(re.findall(r'review-(\d+)-title', section)))
    reviews = []
    for review_id in ids:
        start_match = re.search(rf'<li><div[^>]+aria-labelledby="review-{review_id}-title"', section)
        if not start_match:
            start_match = re.search(rf'<div[^>]+aria-labelledby="review-{review_id}-title"', section)
        if not start_match:
            continue
        start = start_match.start()
        next_start = None
        next_match = re.search(r'<li><div[^>]+aria-labelledby="review-\d+-title"', section[start + 10 :])
        if next_match:
            next_start = start + 10 + next_match.start()
        fragment = section[start:next_start] if next_start else section[start : start + 9000]
        text = strip_tags(fragment)
        title_match = re.search(rf'<h3 id="review-{review_id}-title"[^>]*>(.*?)</h3>', fragment, re.S)
        title = strip_tags(title_match.group(1)) if title_match else ""
        rating_match = re.search(r'aria-label="([1-5](?:\.\d)? out of 5)"', fragment)
        rating = rating_match.group(1) if rating_match else ""
        reviews.append({"review_id": review_id, "title": title, "rating": rating, "text": text})
    return reviews


def collect(max_apps: int | None = None) -> list[dict[str, str]]:
    rows = []
    apps = APPS[:max_apps] if max_apps else APPS
    collected_at = dt.datetime.now(dt.timezone.utc).astimezone().isoformat(timespec="seconds")
    for app in apps:
        try:
            result = choose_app(itunes_search(app["term"]), app["expected"])
            if not result:
                continue
            app_id = result["trackId"]
            track_name = result.get("trackName", "")
            app_url = result.get("trackViewUrl", f"https://apps.apple.com/us/app/id{app_id}")
            reviews_url = f"https://apps.apple.com/us/app/{app_id}?see-all=reviews&platform=iphone"
            page = fetch_text(reviews_url)
            reviews = extract_review_cards(page)
            if not reviews:
                fallback_page = fetch_text(app_url)
                reviews = extract_review_cards(fallback_page)
            for review in reviews:
                text = review["text"]
                if len(text) < 40:
                    continue
                rows.append(
                    {
                        "platform": "App Store",
                        "source_type": "app_review",
                        "source_url": reviews_url + f"#review-{review['review_id']}",
                        "collected_at": collected_at,
                        "competitor": app["competitor"],
                        "product": track_name,
                        "original_text": text,
                        "user_scene": "mobile app review",
                        "pet_type": "",
                        "current_solution": track_name,
                        "payment_signal": "present" if any(word in text.casefold() for word in ["subscription", "price", "paid", "premium", "$"]) else "",
                        "notes": f"rating={review['rating']}; title={review['title']}; app_id={app_id}",
                    }
                )
            print(f"{app['competitor']}: {track_name} / {len(reviews)} reviews")
            time.sleep(0.5)
        except Exception as exc:
            print(f"{app['competitor']}: failed: {exc}")
    return rows


def write_csv(path: Path, rows: list[dict[str, str]]) -> None:
    fields = [
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
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", type=Path, default=RAW_DIR / "app_store_competitor_reviews.csv")
    parser.add_argument("--max-apps", type=int, default=None)
    args = parser.parse_args()
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    rows = collect(args.max_apps)
    write_csv(args.out, rows)
    print(f"Wrote {len(rows)} rows to {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
