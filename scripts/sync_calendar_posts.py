"""
Sync the new 28-Day X (Twitter) content plan directly into ContentCalendarPage.tsx
and bump the cache version to v22 so user sees the new posts instantly.
"""

import os
import re
import sys
import json
from datetime import datetime, timedelta

# Add scripts directory to path
sys.path.append(os.path.dirname(__file__))
from generate_x_content import get_posts

def format_ts_string(s):
    # Escape string for TypeScript template / single quotes
    return json.dumps(s.strip())

def main():
    calendar_file = os.path.join("apps", "web", "src", "pages", "ContentCalendarPage.tsx")
    with open(calendar_file, "r", encoding="utf-8") as f:
        content = f.read()

    posts = get_posts()
    base_date = datetime(2026, 11, 19)

    # Build dictionary of new Twitter posts keyed by (date_str, 'MORNING'/'EVENING')
    new_twitter_posts = {}
    for post in posts:
        day_idx = post["day"] - 1
        curr_date = (base_date + timedelta(days=day_idx)).strftime("%Y-%m-%d")
        slot = "MORNING" if post["post_num"] % 2 != 0 else "EVENING"
        new_twitter_posts[(curr_date, slot)] = post

    print(f"Loaded {len(new_twitter_posts)} new Twitter posts starting {base_date.strftime('%Y-%m-%d')}")

    # 1. Replace existing Twitter posts in ContentCalendarPage.tsx from 2026-11-19 to 2026-12-15
    for (date_str, slot), post in new_twitter_posts.items():
        slot_lower = "am" if slot == "MORNING" else "pm"
        post_id = f"sched_{date_str.replace('-', '_')}_x_{slot_lower}"
        utc_time = "08:00:00.000Z" if slot == "MORNING" else "18:00:00.000Z"
        care = "Curiosity + Alignment" if slot == "MORNING" else "Reliability + Emotion"

        # Regex to find existing post block if present
        # Pattern matches: // --- YYYY-MM-DD (MORNING|EVENING) TWITTER --- \n {\n ... \n }
        pattern = (
            rf"(\s*// --- {date_str} {slot} TWITTER ---\s*\{{\s*"
            rf"id:\s*[\'\"]{post_id}[\'\"].*?page:\s*\{{[^}}]*\}}\s*\}},?)"
        )

        escaped_caption = format_ts_string(post["content"])
        topic_badge = post["category"].upper()

        new_block = (
            f"\n  // --- {date_str} {slot} TWITTER ---\n"
            f"  {{\n"
            f"    id: '{post_id}',\n"
            f"    socialPageId: 'AbiodunBuilds',\n"
            f"    channel: 'TWITTER',\n"
            f"    slotType: '{slot}',\n"
            f"    formatType: 'TEXT_ONLY',\n"
            f"    topicBadge: {json.dumps(topic_badge)},\n"
            f"    carePillars: {json.dumps(care)},\n"
            f"    caption: {escaped_caption},\n"
            f"    mediaUrls: [],\n"
            f"    scheduledFor: '{date_str}T{utc_time}',\n"
            f"    status: 'SCHEDULED',\n"
            f"    page: {{ pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }}\n"
            f"  }},"
        )

        if re.search(pattern, content, re.DOTALL):
            content = re.sub(pattern, lambda m: new_block, content, count=1, flags=re.DOTALL)
            print(f"Replaced existing Twitter block for {date_str} {slot}")
        else:
            # If date_str is 2026-12-16 (Day 28), it needs to be added before the closing of INITIAL_CURATED_SCHEDULED
            if date_str == "2026-12-16":
                # Find the end of sched_2026_12_15_x_pm
                anchor = r"id:\s*[\'\"]sched_2026_12_15_x_pm[\'\"].*?page:\s*\{{[^}}]*\}}\s*\},?"
                match = re.search(anchor, content, re.DOTALL)
                if match:
                    end_pos = match.end()
                    content = content[:end_pos] + new_block + content[end_pos:]
                    print(f"Appended Day 28 Twitter block for {date_str} {slot}")
                else:
                    print(f"Warning: Could not find anchor to append {date_str} {slot}")

    # 2. Bump cache key from v21 to v22 to force browser to dump old cache
    v21_count = content.count("_v21")
    content = content.replace("veltrix_scheduled_posts_v21", "veltrix_scheduled_posts_v22")
    content = content.replace("veltrix_published_posts_v21", "veltrix_published_posts_v22")
    print(f"Updated cache keys from v21 to v22 ({v21_count} replacements)")

    with open(calendar_file, "w", encoding="utf-8") as f:
        f.write(content)

    print("Successfully updated ContentCalendarPage.tsx!")

if __name__ == "__main__":
    main()
