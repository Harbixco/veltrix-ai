import json
import re
from datetime import datetime, timedelta

with open("content/concise_posts.json", "r", encoding="utf-8") as f:
    concise_posts = json.load(f)

print(f"Loaded {len(concise_posts)} concise posts.")

with open("apps/web/src/pages/ContentCalendarPage.tsx", "r", encoding="utf-8") as f:
    tsx_content = f.read()

start_date = datetime(2026, 11, 26)
dates = [(start_date + timedelta(days=i)).strftime("%Y_%m_%d") for i in range(28)]

updated_count = 0
for idx, date_prefix in enumerate(dates):
    # Morning post
    am_post = concise_posts[idx * 2]
    am_id = f"sched_{date_prefix}_x_am"
    
    # Evening post
    pm_post = concise_posts[idx * 2 + 1]
    pm_id = f"sched_{date_prefix}_x_pm"
    
    for pid, pdata in [(am_id, am_post), (pm_id, pm_post)]:
        pattern = re.compile(rf"(id:\s*'{pid}',[\s\S]*?caption:\s*\")(.*?)(\",\s*\n\s*mediaUrls:)", re.DOTALL)
        js_escaped_caption = json.dumps(pdata["text"])[1:-1]
        
        match = pattern.search(tsx_content)
        if match:
            tsx_content = pattern.sub(lambda m: m.group(1) + js_escaped_caption + m.group(3), tsx_content, count=1)
            updated_count += 1
        else:
            print(f"Could not find block for {pid}")

print(f"Updated {updated_count} Twitter captions in ContentCalendarPage.tsx")

# Bump cache key from v24 to v25
tsx_content = tsx_content.replace("v24", "v25")
print("Bumped cache key to v25")

with open("apps/web/src/pages/ContentCalendarPage.tsx", "w", encoding="utf-8") as f:
    f.write(tsx_content)

print("Saved updated ContentCalendarPage.tsx!")
