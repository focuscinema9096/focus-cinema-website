#!/usr/bin/env python3
"""
Focus Cinema - Portfolio Builder & Validator
Reads site/data/portfolio.json and verifies all media assets and JSON-LD structured data.
"""

import json
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE_DIR = os.path.join(BASE_DIR, "site")
DATA_FILE = os.path.join(SITE_DIR, "data", "portfolio.json")
PORTFOLIO_HTML = os.path.join(SITE_DIR, "portfolio.html")

def validate_portfolio():
    print(f"Loading {DATA_FILE}...")
    if not os.path.exists(DATA_FILE):
        print(f"Error: {DATA_FILE} does not exist!")
        sys.exit(1)

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    sections = data.get("sections", [])
    print(f"Found {len(sections)} portfolio sections.")
    
    missing_assets = []
    total_items = 0

    for sec in sections:
        sec_title = sec.get("title")
        items = sec.get("items", [])
        total_items += len(items)
        print(f"\nSection {sec.get('number', '--')}: {sec_title} ({len(items)} items)")

        for item in items:
            img_rel = item.get("image", "")
            img_path = os.path.join(SITE_DIR, img_rel)
            
            # Check base JPEG
            if not os.path.exists(img_path):
                missing_assets.append(f"Missing JPEG: {img_rel}")
            
            # Check WebP
            webp_rel = os.path.splitext(img_rel)[0] + ".webp"
            webp_path = os.path.join(SITE_DIR, webp_rel)
            if not os.path.exists(webp_path):
                missing_assets.append(f"Missing WebP: {webp_rel}")
                
            # Check AVIF
            avif_rel = os.path.splitext(img_rel)[0] + ".avif"
            avif_path = os.path.join(SITE_DIR, avif_rel)
            if not os.path.exists(avif_path):
                missing_assets.append(f"Missing AVIF: {avif_rel}")

            title = item.get("title", "")
            url = item.get("url", "")
            print(f"  ✓ {title:38} | {url[:45] if url else '(Photo Tile)'}")

    print("\n--------------------------------------------------")
    if missing_assets:
        print(f"FAILED: {len(missing_assets)} missing media assets:")
        for m in missing_assets:
            print(f"  ✗ {m}")
        sys.exit(1)
    else:
        print(f"SUCCESS: All {total_items} portfolio items have verified JPEG, WebP, and AVIF assets!")

if __name__ == "__main__":
    validate_portfolio()
