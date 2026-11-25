import json
import re

with open("content/concise_posts.json", "r", encoding="utf-8") as f:
    concise_posts = json.load(f)

print(f"Loaded {len(concise_posts)} concise posts.")

with open("apps/web/src/pages/ContentCalendarPage.tsx", "r", encoding="utf-8") as f:
    tsx_content = f.read()

# Replace captions of the 56 Twitter posts
# Pattern matches:
# id: 'sched_\d{4}_\d{2}_\d{2}_x_(am|pm)',.*?caption:\s*"([^"\\]*(?:\\.[^"\\]*)*)"
# We only want to update the 56 posts from 2026-11-19 onwards.

# Let's find each block
dates = []
for day in range(19, 31):
    dates.append(f"2026_11_{day:02d}")
for day in range(1, 17):
    dates.append(f"2026_12_{day:02d}")

print(f"Total dates in 28-day schedule: {len(dates)}")

updated_count = 0
for idx, date_prefix in enumerate(dates):
    # Morning post
    am_post = concise_posts[idx * 2]
    am_id = f"sched_{date_prefix}_x_am"
    
    # Evening post
    pm_post = concise_posts[idx * 2 + 1]
    pm_id = f"sched_{date_prefix}_x_pm"
    
    for pid, pdata in [(am_id, am_post), (pm_id, pm_post)]:
        # Regex to find block for pid and replace its caption
        # Pattern: (id:\s*'{pid}',[\s\S]*?caption:\s*")(.*?)("[\s\S]*?scheduledFor:)
        pattern = re.compile(rf"(id:\s*'{pid}',[\s\S]*?caption:\s*\")(.*?)(\",\s*\n\s*mediaUrls:)", re.DOTALL)
        
        # Escape newlines and quotes in JSON string style for JS
        js_escaped_caption = json.dumps(pdata["text"])[1:-1] # strip outer quotes
        
        match = pattern.search(tsx_content)
        if match:
            tsx_content = pattern.sub(lambda m: m.group(1) + js_escaped_caption + m.group(3), tsx_content, count=1)
            updated_count += 1
        else:
            print(f"Could not find block for {pid}")

print(f"Updated {updated_count} Twitter captions in ContentCalendarPage.tsx")

# Bump cache key from v22 to v23
tsx_content = tsx_content.replace("v22", "v23")
print("Bumped cache key to v23")

with open("apps/web/src/pages/ContentCalendarPage.tsx", "w", encoding="utf-8") as f:
    f.write(tsx_content)

print("Saved updated ContentCalendarPage.tsx!")
