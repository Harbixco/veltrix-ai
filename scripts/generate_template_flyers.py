import os
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = os.path.abspath('apps/web/public/designs/flyers')
os.makedirs(OUT_DIR, exist_ok=True)

# Colors
NAVY = (11, 23, 59)
ORANGE = (245, 105, 28)
WHITE = (255, 255, 255)
GRAY = (100, 116, 139)
SKY_BLUE = (14, 165, 233)

def get_font(size):
    for fpath in [
        r'C:\Windows\Fonts\segoeuib.ttf',
        r'C:\Windows\Fonts\arialbd.ttf',
        r'C:\Windows\Fonts\calibrib.ttf'
    ]:
        if os.path.exists(fpath):
            return ImageFont.truetype(fpath, size)
    return ImageFont.load_default()

FLYER_LIST = [
    # =========================================================================
    # 15 MORNING EDUCATIONAL HOOKS
    # =========================================================================
    {
        "slug": "flyer-day01-morning-wrong-problem",
        "badge": "STRATEGY & CONVERSION",
        "line1": "Most business owners are solving",
        "line2": "the wrong online problem.",
        "line3": "Here is how to spot it early:",
        "base_template": "apps/web/public/designs/veltrix-design-2.jpg"
    },
    {
        "slug": "flyer-day02-morning-how-much-disappear",
        "badge": "SALES FUNNEL & TRUST",
        "line1": 'Customers ask "How much?"',
        "line2": "and disappear.",
        "line3": "Here is why they go silent:",
        "base_template": "apps/web/public/designs/veltrix-design-2.jpg"
    },
    {
        "slug": "flyer-day03-morning-more-followers",
        "badge": "AUDIENCE VS REVENUE",
        "line1": "More followers won't",
        "line2": "bring more paying customers.",
        "line3": "Here is what actually closes deals:",
        "base_template": "apps/web/public/designs/veltrix-design-4.jpg"
    },
    {
        "slug": "flyer-day04-morning-10-seconds-clarity",
        "badge": "USER EXPERIENCE & CLARITY",
        "line1": "Can a new customer understand",
        "line2": "what you sell in 10 seconds?",
        "line3": "Take the 10-second clarity test:",
        "base_template": "apps/web/public/designs/veltrix-design-2.jpg"
    },
    {
        "slug": "flyer-day05-morning-website-design-mistakes",
        "badge": "WEBSITE UX AUDIT",
        "line1": "3 website design mistakes",
        "line2": "frustrating your buyers.",
        "line3": "Stop losing mobile traffic today:",
        "base_template": "apps/web/public/designs/veltrix-design-4.jpg"
    },
    {
        "slug": "flyer-day06-morning-verify-your-business",
        "badge": "BRAND CREDIBILITY & TRUST",
        "line1": "Customers need a way to",
        "line2": "verify your business",
        "line3": "before they feel comfortable buying.",
        "base_template": "apps/web/public/designs/veltrix-design-2.jpg"
    },
    {
        "slug": "flyer-day07-morning-why-no-inquiries",
        "badge": "CONVERSION RATE OPTIMIZATION",
        "line1": "People visit your website,",
        "line2": "why aren't they inquiring?",
        "line3": "3 conversion leaks to fix now:",
        "base_template": "apps/web/public/designs/veltrix-design-4.jpg"
    },
    {
        "slug": "flyer-day08-morning-invisible-to-google",
        "badge": "SEARCH ENGINE VISIBILITY",
        "line1": "Your business website may be",
        "line2": "invisible to Google.",
        "line3": "Here is what you need to check:",
        "base_template": "apps/web/public/designs/veltrix-design-2.jpg"
    },
    {
        "slug": "flyer-day09-morning-whatsapp-status-disappears",
        "badge": "AUTOMATED SALES INFRASTRUCTURE",
        "line1": "Your products deserve more than",
        "line2": "a WhatsApp status",
        "line3": "that disappears in 24 hours.",
        "base_template": "apps/web/public/designs/veltrix-design-4.jpg"
    },
    {
        "slug": "flyer-day10-morning-stop-depending-on-whatsapp",
        "badge": "SALES AUTOMATION & SCALE",
        "line1": "Stop depending on WhatsApp",
        "line2": "to carry your whole sales process.",
        "line3": "Build an automated digital home:",
        "base_template": "apps/web/public/designs/veltrix-design-2.jpg"
    },
    {
        "slug": "flyer-day11-morning-less-professional-online",
        "badge": "PREMIUM BRANDING & PERCEPTION",
        "line1": "Looking informal online",
        "line2": "damages customer trust.",
        "line3": "Perception determines your pricing:",
        "base_template": "apps/web/public/designs/veltrix-design-4.jpg"
    },
    {
        "slug": "flyer-day12-morning-why-visitors-leave",
        "badge": "FRICTIONLESS CHECKOUT",
        "line1": "Why visitors leave your site",
        "line2": "without taking action.",
        "line3": "Remove friction & close more sales:",
        "base_template": "apps/web/public/designs/veltrix-design-2.jpg"
    },
    {
        "slug": "flyer-day13-morning-ads-need-landing-page",
        "badge": "AD SPEND EFFICIENCY",
        "line1": "Ads bring visitors, but your site",
        "line2": "must give a reason to act.",
        "line3": "Stop burning money on cold ads:",
        "base_template": "apps/web/public/designs/veltrix-design-4.jpg"
    },
    {
        "slug": "flyer-day14-morning-searches-for-your-business",
        "badge": "REPUTATION MANAGEMENT",
        "line1": "If someone Googles your business,",
        "line2": "what will they find?",
        "line3": "Control your online first impression:",
        "base_template": "apps/web/public/designs/veltrix-design-2.jpg"
    },
    {
        "slug": "flyer-day15-morning-trust-starts-with-clarity",
        "badge": "AUTHORITY & CONVERSION",
        "line1": "Trust starts with how clearly",
        "line2": "you present your business.",
        "line3": "We don't just build sites. We build trust.",
        "base_template": "apps/web/public/designs/veltrix-design-4.jpg"
    },

    # =========================================================================
    # 15 EVENING SERVICE SPOTLIGHTS
    # =========================================================================
    {
        "slug": "flyer-day01-evening-ai-lead-automation",
        "badge": "SERVICE SPOTLIGHT",
        "line1": "AI Business Automation",
        "line2": "Qualify Buyers in 20 Seconds",
        "line3": "Never miss another customer inquiry",
        "base_template": "apps/web/public/designs/veltrix-design-6.jpg"
    },
    {
        "slug": "flyer-day02-evening-website-development",
        "badge": "SERVICE SPOTLIGHT",
        "line1": "Custom Website Development",
        "line2": "Fast, High-Converting & Secure",
        "line3": "Built for real business revenue",
        "base_template": "apps/web/public/designs/veltrix-design-5.jpg"
    },
    {
        "slug": "flyer-day03-evening-ecommerce-development",
        "badge": "SERVICE SPOTLIGHT",
        "line1": "E-Commerce Store Portals",
        "line2": "Sell & Collect Payments 24/7",
        "line3": "Automated inventory & instant receipts",
        "base_template": "apps/web/public/designs/veltrix-design-5.jpg"
    },
    {
        "slug": "flyer-day04-evening-crm-sales-automation",
        "badge": "SERVICE SPOTLIGHT",
        "line1": "CRM & Sales Pipeline",
        "line2": "Automated Follow-Up Workflows",
        "line3": "Never drop an interested buyer again",
        "base_template": "apps/web/public/designs/veltrix-design-6.jpg"
    },
    {
        "slug": "flyer-day04-evening-brand-identity",
        "badge": "SERVICE SPOTLIGHT",
        "line1": "Corporate Brand Identity",
        "line2": "Position for Premium Clients",
        "line3": "Command respect & eliminate haggling",
        "base_template": "apps/web/public/designs/veltrix-design-2.jpg"
    },
    {
        "slug": "flyer-day05-evening-custom-web-apps",
        "badge": "SERVICE SPOTLIGHT",
        "line1": "Custom Business Software",
        "line2": "Replace Messy Spreadsheets",
        "line3": "Tailored internal operations portals",
        "base_template": "apps/web/public/designs/veltrix-design-6.jpg"
    },
    {
        "slug": "flyer-day06-evening-seo-architecture",
        "badge": "SERVICE SPOTLIGHT",
        "line1": "SEO & Google Rank Architecture",
        "line2": "Get Discovered on Page 1",
        "line3": "Turn Google into continuous client leads",
        "base_template": "apps/web/public/designs/veltrix-design-5.jpg"
    },
    {
        "slug": "flyer-day07-evening-ai-chatbots",
        "badge": "SERVICE SPOTLIGHT",
        "line1": "24/7 Smart AI Chatbots",
        "line2": "Automated Customer Booking",
        "line3": "Resolve customer questions without lag",
        "base_template": "apps/web/public/designs/veltrix-design-6.jpg"
    },
    {
        "slug": "flyer-day08-evening-website-maintenance",
        "badge": "SERVICE SPOTLIGHT",
        "line1": "Website Maintenance & Care",
        "line2": "Zero Downtime & 24/7 Security",
        "line3": "Cloud backups & malware protection",
        "base_template": "apps/web/public/designs/veltrix-design-5.jpg"
    },
    {
        "slug": "flyer-day09-evening-cac-registration",
        "badge": "SERVICE SPOTLIGHT",
        "line1": "CAC Business Registration",
        "line2": "Official Corporate Trust Setup",
        "line3": "Certificates, TIN & Legal Authority",
        "base_template": "apps/web/public/designs/veltrix-design-2.jpg"
    },
    {
        "slug": "flyer-day10-evening-landing-pages",
        "badge": "SERVICE SPOTLIGHT",
        "line1": "High-Converting Landing Pages",
        "line2": "Built for Ad Campaigns & ROI",
        "line3": "Double your advertising conversion rate",
        "base_template": "apps/web/public/designs/veltrix-design-5.jpg"
    },
    {
        "slug": "flyer-day11-evening-whatsapp-business-api",
        "badge": "SERVICE SPOTLIGHT",
        "line1": "WhatsApp Business Automation",
        "line2": "Turn Chats into Sales Engines",
        "line3": "Shared team inbox & smart auto-replies",
        "base_template": "apps/web/public/designs/veltrix-design-6.jpg"
    },
    {
        "slug": "flyer-day12-evening-mobile-app-development",
        "badge": "SERVICE SPOTLIGHT",
        "line1": "Custom Mobile App Engineering",
        "line2": "iOS & Android Applications",
        "line3": "60 FPS performance & seamless sync",
        "base_template": "apps/web/public/designs/veltrix-design-5.jpg"
    },
    {
        "slug": "flyer-day13-evening-digital-consultation",
        "badge": "SERVICE SPOTLIGHT",
        "line1": "Digital Systems Consultation",
        "line2": "Uncover Silent Sales Leaks",
        "line3": "Actionable 90-day growth roadmap",
        "base_template": "apps/web/public/designs/veltrix-design-2.jpg"
    },
    {
        "slug": "flyer-day14-evening-digital-transformation",
        "badge": "SERVICE SPOTLIGHT",
        "line1": "Full Digital Transformation",
        "line2": "All-in-One Business Overhaul",
        "line3": "Web, AI Automation & Market Authority",
        "base_template": "apps/web/public/designs/veltrix-design-6.jpg"
    },
    {
        "slug": "flyer-day15-evening-partnership-innovate-build-grow",
        "badge": "TECHNOLOGY PARTNERSHIP",
        "line1": "Your Long-Term Tech Partner",
        "line2": "Innovate • Build • Scale",
        "line3": "Software engineered for business revenue",
        "base_template": "apps/web/public/designs/veltrix-design-6.jpg"
    },

    # =========================================================================
    # ABIODUN TECH & ARCHITECTURE TWEETS
    # =========================================================================
    {
        "slug": "flyer-tech-react-perf",
        "badge": "REACT.JS ARCHITECTURE",
        "line1": "Most React lag isn't useMemo.",
        "line2": "It's lifting state too high.",
        "line3": "Colocate state where it is actually used.",
        "base_template": "apps/web/public/designs/veltrix-design-4.jpg"
    },
    {
        "slug": "flyer-tech-ai-replace-engineers",
        "badge": "AI & FUTURE OF DEV",
        "line1": "AI won't replace engineers.",
        "line2": "Engineers using AI workflows",
        "line3": "will replace legacy agencies.",
        "base_template": "apps/web/public/designs/veltrix-design-2.jpg"
    },
    {
        "slug": "flyer-tech-derived-state",
        "badge": "CLEAN CODE ARCHITECTURE",
        "line1": "Stop using useEffect for state.",
        "line2": "Derive values during render.",
        "line3": "Zero extra render cycles. Zero bugs.",
        "base_template": "apps/web/public/designs/veltrix-design-4.jpg"
    },
    {
        "slug": "flyer-tech-website-speed-cost",
        "badge": "WEB PERFORMANCE ROI",
        "line1": "A 1-second delay in page load",
        "line2": "costs 7% in customer conversion.",
        "line3": "Speed is your most profitable feature.",
        "base_template": "apps/web/public/designs/veltrix-design-5.jpg"
    },
    {
        "slug": "flyer-tech-typescript-production",
        "badge": "TYPESCRIPT STANDARDS",
        "line1": "Stop using 'any' in TypeScript.",
        "line2": "Use 'unknown' + Type Guards.",
        "line3": "Catch structural runtime bugs at compile time.",
        "base_template": "apps/web/public/designs/veltrix-design-4.jpg"
    },
    {
        "slug": "flyer-tech-deterministic-ai",
        "badge": "DETERMINISTIC AI SYSTEMS",
        "line1": "Businesses don't need prompts.",
        "line2": "They need deterministic pipelines.",
        "line3": "Ingest lead -> API verify -> instant quote.",
        "base_template": "apps/web/public/designs/veltrix-design-6.jpg"
    },
    {
        "slug": "flyer-tech-tutorial-hell",
        "badge": "DEV CAREER ROADMAP",
        "line1": "Escape tutorial hell in 3 steps:",
        "line2": "Build 1 production SaaS.",
        "line3": "Ship to real users. Solve real bugs.",
        "base_template": "apps/web/public/designs/veltrix-design-4.jpg"
    },
    {
        "slug": "flyer-tech-react-native-hermes",
        "badge": "MOBILE APP ENGINEERING",
        "line1": "React Native New Architecture:",
        "line2": "60 FPS & 85% shared code.",
        "line3": "Hermes engine + TurboModules scale.",
        "base_template": "apps/web/public/designs/veltrix-design-5.jpg"
    },
    {
        "slug": "flyer-tech-senior-mindset",
        "badge": "ENGINEERING MATURITY",
        "line1": "Junior devs debate frameworks.",
        "line2": "Senior devs focus on revenue.",
        "line3": "Write less code. Deliver more value.",
        "base_template": "apps/web/public/designs/veltrix-design-2.jpg"
    },
    {
        "slug": "flyer-tech-mobile-first-reality",
        "badge": "FRONTEND REALITY",
        "line1": "Designers test on 4K MacBooks.",
        "line2": "Customers visit on $90 phones.",
        "line3": "Optimize for real users on 3G networks.",
        "base_template": "apps/web/public/designs/veltrix-design-5.jpg"
    },
    {
        "slug": "flyer-tech-roadmap-2026",
        "badge": "WEB DEV ROADMAP 2026",
        "line1": "Learning web dev from zero:",
        "line2": "Master fundamentals first.",
        "line3": "HTML, modern CSS, TS & fullstack CRUD.",
        "base_template": "apps/web/public/designs/veltrix-design-4.jpg"
    },
    {
        "slug": "flyer-tech-openai-costs",
        "badge": "AI PRODUCTION COSTS",
        "line1": "Avoid a $3,000 OpenAI bill:",
        "line2": "Cache responses & use small models.",
        "line3": "Deterministic code beats LLMs for logic.",
        "base_template": "apps/web/public/designs/veltrix-design-6.jpg"
    },
    {
        "slug": "flyer-tech-custom-hooks",
        "badge": "REACT CLEAN CODE",
        "line1": "When to write a custom hook:",
        "line2": "Extract logic, not just JSX.",
        "line3": "Keep components thin and declarative.",
        "base_template": "apps/web/public/designs/veltrix-design-4.jpg"
    },
    {
        "slug": "flyer-tech-pwa-vs-native",
        "badge": "STARTUP STRATEGY",
        "line1": "Before spending $10k on an app,",
        "line2": "build a high-performance PWA.",
        "line3": "Zero App Store fees. Instant link install.",
        "base_template": "apps/web/public/designs/veltrix-design-5.jpg"
    },
    {
        "slug": "flyer-tech-saas-portfolio",
        "badge": "GET HIRED IN TECH",
        "line1": "Stop building to-do apps.",
        "line2": "Build 1 polished fullstack SaaS.",
        "line3": "Real auth, payments, analytics & database.",
        "base_template": "apps/web/public/designs/veltrix-design-5.jpg"
    }
]

def render_flyer(item):
    template_path = item["base_template"]
    if not os.path.exists(template_path):
        template_path = "apps/web/public/designs/veltrix-design-2.jpg"

    base = Image.open(template_path).convert("RGB")
    w, h = base.size

    # Ensure standardized 1024x1024 canvas
    if (w, h) != (1024, 1024):
        base = base.resize((1024, 1024), Image.Resampling.LANCZOS)
        w, h = 1024, 1024

    draw = ImageDraw.Draw(base)

    # 1. Clean headline zone: x=60 to 960, y=145 to 365
    draw.rectangle([60, 145, 960, 365], fill=WHITE)

    # 2. Topic Category Badge (Small pill)
    badge_font = get_font(13)
    badge_text = item["badge"].upper()
    badge_bbox = draw.textbbox((0, 0), badge_text, font=badge_font)
    bw = badge_bbox[2] - badge_bbox[0] + 24
    bh = 26
    badge_x = 80
    badge_y = 152
    draw.rounded_rectangle([badge_x, badge_y, badge_x + bw, badge_y + bh], radius=13, fill=(255, 243, 235), outline=(254, 215, 170), width=1)
    draw.text((badge_x + 12, badge_y + 5), badge_text, fill=ORANGE, font=badge_font)

    # 3. Dynamic Headline
    font_main = get_font(40)
    font_hl = get_font(42)
    font_sub = get_font(34)

    y_cursor = 190
    draw.text((80, y_cursor), item["line1"], fill=NAVY, font=font_main)
    y_cursor += 50

    draw.text((80, y_cursor), item["line2"], fill=ORANGE, font=font_hl)
    y_cursor += 54

    draw.text((80, y_cursor), item["line3"], fill=NAVY, font=font_sub)

    # Save as high-res JPG
    jpg_path = os.path.join(OUT_DIR, f"{item['slug']}.jpg")
    base.save(jpg_path, quality=95)

    # Also save as SVG vector envelope
    svg_path = os.path.join(OUT_DIR, f"{item['slug']}.svg")
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <image href="/designs/flyers/{item['slug']}.jpg" x="0" y="0" width="1024" height="1024" />
</svg>'''
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)

    print(f"Generated: {item['slug']}.jpg and .svg")

print("=== Generating Dedicated Topic-Matched Flyers ===")
for item in FLYER_LIST:
    render_flyer(item)

print(f"\nSuccessfully generated {len(FLYER_LIST)} unique topic-matched flyers in: {OUT_DIR}")
