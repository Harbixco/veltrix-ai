import json
import re
from datetime import datetime, timedelta

with open("content/concise_posts.json", "r", encoding="utf-8") as f:
    concise_posts = json.load(f)

with open("apps/web/src/pages/ContentCalendarPage.tsx", "r", encoding="utf-8") as f:
    tsx_content = f.read()

# Original date prefixes (28 days starting Nov 19)
old_dates = []
for day in range(19, 31):
    old_dates.append(f"2026_11_{day:02d}")
for day in range(1, 17):
    old_dates.append(f"2026_12_{day:02d}")

# New date prefixes (28 days starting Nov 26)
start_date = datetime(2026, 11, 26)
new_dates = []
for i in range(28):
    d = start_date + timedelta(days=i)
    new_dates.append(d.strftime("%Y_%m_%d"))

print(f"Old dates count: {len(old_dates)}, New dates count: {len(new_dates)}")

# For each of the 28 pairs, replace the block's ID and scheduledFor
for idx in range(28):
    old_prefix = old_dates[idx]
    new_prefix = new_dates[idx]
    
    # Morning
    old_am_id = f"sched_{old_prefix}_x_am"
    new_am_id = f"sched_{new_prefix}_x_am"
    new_am_date = new_prefix.replace("_", "-") + "T08:00:00.000Z"
    
    # Pattern for morning post
    # match from old_am_id down to scheduledFor: '...'
    am_pattern = re.compile(
        rf"(id:\s*'){old_am_id}('[\s\S]*?scheduledFor:\s*')[^']+(')",
        re.DOTALL
    )
    tsx_content = am_pattern.sub(
        lambda m, nid=new_am_id, ndt=new_am_date: f"{m.group(1)}{nid}{m.group(2)}{ndt}{m.group(3)}",
        tsx_content,
        count=1
    )
    
    # Evening
    old_pm_id = f"sched_{old_prefix}_x_pm"
    new_pm_id = f"sched_{new_prefix}_x_pm"
    new_pm_date = new_prefix.replace("_", "-") + "T18:00:00.000Z"
    
    pm_pattern = re.compile(
        rf"(id:\s*'){old_pm_id}('[\s\S]*?scheduledFor:\s*')[^']+(')",
        re.DOTALL
    )
    tsx_content = pm_pattern.sub(
        lambda m, nid=new_pm_id, ndt=new_pm_date: f"{m.group(1)}{nid}{m.group(2)}{ndt}{m.group(3)}",
        tsx_content,
        count=1
    )

# Bump cache key to v24
tsx_content = tsx_content.replace("v23", "v24")

with open("apps/web/src/pages/ContentCalendarPage.tsx", "w", encoding="utf-8") as f:
    f.write(tsx_content)

print("Successfully rescheduled all 56 Twitter posts in ContentCalendarPage.tsx to Nov 26 - Dec 23 and bumped to v24!")
