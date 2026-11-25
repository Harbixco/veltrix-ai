import json
import re

with open("content/concise_posts.json", "r", encoding="utf-8") as f:
    concise_posts = json.load(f)

with open("content/X_CONTENT_PLAN_28_DAYS.md", "r", encoding="utf-8") as f:
    md_content = f.read()

# Pattern for each post block:
# #### Post (\d+) — .*?\n\n\*\*Target Metric / CTA:\*\* `(.*?)`\s*\n\*\*Suggested Media / Visual Asset:\*\* \*(.*?)\*\s*\n\n```markdown\n(.*?)\n```
pattern = re.compile(
    r"(#### Post (\d+) — .*?\n\n\*\*Target Metric / CTA:\*\* `.*?`\s*\n\*\*Suggested Media / Visual Asset:\*\* \*.*?\*\s*\n\n```markdown\n)(.*?)(\n```)",
    re.DOTALL
)

def replace_post(match):
    prefix = match.group(1)
    post_num = int(match.group(2))
    suffix = match.group(4)
    
    post_data = next((p for p in concise_posts if p["post_num"] == post_num), None)
    if post_data:
        return f"{prefix}{post_data['text']}{suffix}"
    return match.group(0)

new_md = pattern.sub(replace_post, md_content)

with open("content/X_CONTENT_PLAN_28_DAYS.md", "w", encoding="utf-8") as f:
    f.write(new_md)

print("Updated content/X_CONTENT_PLAN_28_DAYS.md successfully!")
