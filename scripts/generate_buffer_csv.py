import csv
import os
from datetime import datetime, timedelta

input_csv = "content/x_schedule_buffer_typefully.csv"

rows = []
with open(input_csv, mode="r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        rows.append(row)

print(f"Total input rows: {len(rows)}")

fieldnames = ["Text", "Image URL", "Tags", "Posting Time"]

# 1. Original Buffer CSV
buffer_rows_orig = []
for r in rows:
    date_str = r["Date"].strip()
    time_str = r["Time"].strip()
    if "PM" in time_str:
        parts = time_str.replace("PM", "").strip().split(":")
        hr = int(parts[0])
        if hr != 12:
            hr += 12
        time_24 = f"{hr:02d}:{parts[1]}"
    else:
        parts = time_str.replace("AM", "").strip().split(":")
        hr = int(parts[0])
        if hr == 12:
            hr = 0
        time_24 = f"{hr:02d}:{parts[1]}"
        
    posting_time = f"{date_str} {time_24}"
    buffer_rows_orig.append({
        "Text": r["Post_Text"].strip(),
        "Image URL": "",
        "Tags": "AbiodunBuilds",
        "Posting Time": posting_time
    })

with open("content/buffer_all_56_posts.csv", mode="w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
    writer.writeheader()
    writer.writerows(buffer_rows_orig)

# 2. Starting Fresh from TODAY (Nov 20, 2026 onwards)
# Slot 1: Today Nov 20 at 01:00 PM (13:00) - Post 1 Intro
# Slot 2: Today Nov 20 at 07:00 PM (19:00) - Post 2
# Slot 3: Tomorrow Nov 21 at 09:00 AM (09:00) - Post 3
# Slot 4: Tomorrow Nov 21 at 07:00 PM (19:00) - Post 4
# ... and so on for all 56 posts!
buffer_rows_fresh = []
start_date = datetime(2026, 11, 20)

for idx, r in enumerate(rows):
    if idx == 0:
        post_time = "2026-11-20 13:00"
    elif idx == 1:
        post_time = "2026-11-20 19:00"
    else:
        # Remaining 54 posts: 2 per day starting Nov 21
        rem_idx = idx - 2
        day_offset = rem_idx // 2 + 1 # 1 = Nov 21, 2 = Nov 22, etc.
        is_morning = (rem_idx % 2 == 0)
        curr_day = start_date + timedelta(days=day_offset)
        time_str = "09:00" if is_morning else "19:00"
        post_time = f"{curr_day.strftime('%Y-%m-%d')} {time_str}"
        
    buffer_rows_fresh.append({
        "Text": r["Post_Text"].strip(),
        "Image URL": "",
        "Tags": "AbiodunBuilds",
        "Posting Time": post_time
    })

fresh_output = "content/buffer_all_56_posts_starting_today.csv"
with open(fresh_output, mode="w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
    writer.writeheader()
    writer.writerows(buffer_rows_fresh)

# 3. Create 10-post Batches for Buffer Free Plan (based on fresh schedule starting today)
batch_size = 10
batch_dir = "content/buffer_batches"
os.makedirs(batch_dir, exist_ok=True)

num_batches = (len(buffer_rows_fresh) + batch_size - 1) // batch_size
for i in range(num_batches):
    batch_slice = buffer_rows_fresh[i*batch_size : (i+1)*batch_size]
    batch_filename = f"{batch_dir}/buffer_batch_{i+1}_posts_{i*batch_size + 1}_to_{min((i+1)*batch_size, len(buffer_rows_fresh))}.csv"
    with open(batch_filename, mode="w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        writer.writerows(batch_slice)

print(f"Generated {fresh_output} and {num_batches} batches in {batch_dir}!")
