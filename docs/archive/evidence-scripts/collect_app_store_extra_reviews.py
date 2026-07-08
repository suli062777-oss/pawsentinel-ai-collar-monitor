#!/usr/bin/env python3
"""Collect a second batch of public App Store review cards."""

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
    {"competitor": "Chewy", "term": "Chewy pet", "expected": "Chewy"},
    {"competitor": "Rover", "term": "Rover pet sitter dog walking", "expected": "Rover"},
    {"competitor": "Wag", "term": "Wag dog walker", "expected": "Wag"},
    {"competitor": "PetDesk", "term": "PetDesk pet health", "expected": "PetDesk"},
    {"competitor": "11pets", "term": "11pets pet care", "expected": "11pets"},
    {"competitor": "DogLog", "term": "DogLog pet care", "expected": "DogLog"},
    {"competitor": "Pet First Aid", "term": "Pet First Aid American Red Cross", "expected": "Pet First Aid"},
    {"competitor": "TrustedHousesitters", "term": "TrustedHousesitters pet", "expected": "TrustedHousesitters"},
    {"competitor": "Bark", "term": "Bark dog", "expected": "Bark"},
    {"competitor": "Pet Monitor VIGI", "term": "Pet Monitor VIGI", "expected": "Pet Monitor"},
]


def fetch_json(url: str) -> dict:
    with urllib.request.urlopen(url, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def fetch_text(url: str) -> str:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 PawRoomResearch/0.1", "Accept-Language": "en-US,en;q=0.9"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8", "ignore")


def search(term: str) -> list[dict]:
    url = "https://itunes.apple.com/search?" + urllib.parse.urlencode(
        {"term": term, "country": "us", "entity": "software", "limit": 8}
    )
    return fetch_json(url).get("results", [])


def choose(results: list[dict], expected: str) -> dict | None:
    expected = expected.casefold()
    for result in results:
        if expected in f"{result.get('trackName','')} {result.get('artistName','')}".casefold():
            return result
    return results[0] if results else None


def strip_tags(fragment: str) -> str:
    fragment = re.sub(r"<script.*?</script>", " ", fragment, flags=re.S | re.I)
    fragment = re.sub(r"<style.*?</style>", " ", fragment, flags=re.S | re.I)
    fragment = re.sub(r"<[^>]+>", " ", fragment)
    fragment = html.unescape(fragment)
    return re.sub(r"\s+", " ", fragment).strip()


def extract(page: str) -> list[dict[str, str]]:
    section_pos = page.find('id="allProductReviews"')
    section = page[section_pos:] if section_pos >= 0 else page
    ids = list(dict.fromkeys(re.findall(r'review-(\d+)-title', section)))
    rows = []
    for review_id in ids:
        start_match = re.search(rf'<li><div[^>]+aria-labelledby="review-{review_id}-title"', section)
        if not start_match:
            start_match = re.search(rf'<div[^>]+aria-labelledby="review-{review_id}-title"', section)
        if not start_match:
            continue
        start = start_match.start()
        next_match = re.search(r'<li><div[^>]+aria-labelledby="review-\d+-title"', section[start + 10 :])
        end = start + 10 + next_match.start() if next_match else start + 9000
        fragment = section[start:end]
        text = strip_tags(fragment)
        title_match = re.search(rf'<h3 id="review-{review_id}-title"[^>]*>(.*?)</h3>', fragment, re.S)
        rating_match = re.search(r'aria-label="([1-5](?:\.\d)? out of 5)"', fragment)
        rows.append(
            {
                "review_id": review_id,
                "title": strip_tags(title_match.group(1)) if title_match else "",
                "rating": rating_match.group(1) if rating_match else "",
                "text": text,
            }
        )
    return rows


def collect() -> list[dict[str, str]]:
    collected_at = dt.datetime.now(dt.timezone.utc).astimezone().isoformat(timespec="seconds")
    evidence = []
    for app in APPS:
        try:
            result = choose(search(app["term"]), app["expected"])
            if not result:
                print(f"{app['competitor']}: no app result")
                continue
            app_id = result["trackId"]
            track_name = result.get("trackName", "")
            url = f"https://apps.apple.com/us/app/{app_id}?see-all=reviews&platform=iphone"
            reviews = extract(fetch_text(url))
            print(f"{app['competitor']}: {track_name} / {len(reviews)} reviews")
            for review in reviews:
                if len(review["text"]) < 40:
                    continue
                evidence.append(
                    {
                        "platform": "App Store",
                        "source_type": "app_review",
                        "source_url": url + f"#review-{review['review_id']}",
                        "collected_at": collected_at,
                        "competitor": app["competitor"],
                        "product": track_name,
                        "original_text": review["text"],
                        "user_scene": "mobile app review",
                        "pet_type": "",
                        "current_solution": track_name,
                        "payment_signal": "present"
                        if any(word in review["text"].casefold() for word in ["subscription", "price", "paid", "premium", "$"])
                        else "",
                        "notes": f"rating={review['rating']}; title={review['title']}; app_id={app_id}",
                    }
                )
            time.sleep(1.5)
        except Exception as exc:
            print(f"{app['competitor']}: failed: {exc}")
    return evidence


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", type=Path, default=RAW_DIR / "app_store_extra_reviews.csv")
    args = parser.parse_args()
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    rows = collect()
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
    with args.out.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)
    print(f"Wrote {len(rows)} rows to {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
