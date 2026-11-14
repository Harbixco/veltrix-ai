import { prisma } from './index';

const DESIGN_TEMPLATES = [
  '/designs/veltrix-design-1.jpg',
  '/designs/veltrix-design-2.jpg',
  '/designs/veltrix-design-3.jpg',
  '/designs/veltrix-design-4.jpg'
];

interface PostScheduleItem {
  dateStr: string;
  timeSlot: 'MORNING' | 'EVENING';
  type: 'HOOK_EDUCATIONAL' | 'SERVICE_BASED';
  title: string;
  caption: string;
  designIndex: number;
}

// 15 Morning Posts (9:00 AM) - Educational & Curiosity Hooks
const MORNING_HOOKS = [
  {
    day: 1,
    hook: "Most business owners are solving the wrong online problem. Here's how to spot it.",
    caption: `Most business owners are solving the wrong online problem. Here's how to spot it.

You might think you need more followers, more traffic, or more ad spend. But if 95% of visitors leave your page without contacting you, pouring more money into marketing only burns cash faster.

The real problem isn't always visibility—it's clarity, speed, and trust.

What to inspect first:
1. Does your homepage answer "What's in it for me?" in under 5 seconds?
2. Is your contact button frictionless and instant?
3. Can customers verify your credibility before they pay?

At Veltrix Hub, we diagnose the leaks in your customer journey and build websites that convert visitors into paying clients.

#VeltrixHub #DigitalStrategy #BusinessGrowth #WebsiteAudit #NigeriaSME #ConversionRate

👉 Want a free initial review of your business's online presence? Check our first comment below! 👇`
  },
  {
    day: 2,
    hook: "Customers ask 'How much?' and disappear. Here are a few possible reasons.",
    caption: `Customers ask "How much?" and disappear. Here are a few possible reasons:

1. They don't understand the difference between your offer and the cheapest alternative.
2. Your pricing wasn't framed with the value, process, and transformation it delivers.
3. Your online presence looks informal, raising doubts about your reliability and after-sales support.

When you have a high-converting website, your process, portfolio, and verified credibility speak before price is ever discussed.

Stop losing serious buyers to silence. Build a customer conversion engine that works for you 24/7.

#SalesStrategy #ConversionOptimization #VeltrixHub #WebDesignNigeria #CloseDeals

👉 Want a free initial review of your business's online presence? Check our first comment below! 👇`
  },
  {
    day: 3,
    hook: "More followers won't automatically bring more customers. Here's what else matters.",
    caption: `More followers won't automatically bring more customers. Here's what else matters:

A social media audience gives you attention. But customers need confidence before they make a payment.

What bridges the gap between a follower and a paying customer?
• A dedicated landing page explaining your offer clearly.
• Verifiable proof of past work and happy clients.
• A secure, structured booking or inquiry system.

Don't depend purely on social algorithms. Own your digital storefront.

Websites • E-commerce • Branding

#BusinessStrategy #WebArchitecture #VeltrixHub #BrandTrust #NigeriaBusiness

👉 Want a free initial review of your business's online presence? Check our first comment below! 👇`
  },
  {
    day: 4,
    hook: "Can a new customer understand what you sell in 10 seconds?",
    caption: `Can a new customer understand what you sell in 10 seconds?

If a first-time visitor has to scroll endlessly or decipher complex jargon to find out what you do, they will simply click away to your competitor.

The 10-Second Test:
• Who is your service for?
• What exact problem do you solve?
• What is the next immediate step?

Run this test on your homepage today. If it takes longer than 10 seconds, your site is losing inquiries every single day.

Websites • E-commerce • Branding

#UserExperience #WebDesign #ConversionRate #VeltrixHub #OnlineClarity

👉 Want a free initial review of your business's online presence? Check our first comment below! 👇`
  },
  {
    day: 5,
    hook: "3 website design mistakes that can frustrate potential customers.",
    caption: `3 website design mistakes that can frustrate potential customers:

1. Slow Mobile Loading: If your page takes more than 3 seconds to open on a 4G phone, over half your visitors are gone.
2. Hidden Contact Details: Forcing visitors to dig through menus just to find a phone number or WhatsApp link kills conversion.
3. Unclear Call to Action: Having 5 different buttons asking people to "Learn more", "Subscribe", "Read blog", and "Buy" causes decision fatigue.

At Veltrix Hub, we build clean, fast, mobile-first websites designed to guide your visitors straight to an inquiry.

#WebsiteMistakes #WebDevelopment #UXDesign #VeltrixHub #DigitalGrowth

👉 Want a free initial review of your business's online presence? Check our first comment below! 👇`
  },
  {
    day: 6,
    hook: "Customers need a way to verify your business before they feel comfortable buying.",
    caption: `Customers need a way to verify your business before they feel comfortable buying.

In today's digital landscape, customers are more cautious than ever. If your only presence is a social media profile without a registered domain, verifiable reviews, or a transparent business address, customers hesitate.

How to establish instant credibility:
• A custom domain email and SSL-secured website.
• Real testimonials with client photos or company names.
• Clear refund policies, terms, and direct support channels.

"We don't just build websites. We build trust."

#BuildTrust #BrandCredibility #VeltrixHub #NigeriaStartups #CustomerConfidence

👉 Want a free initial review of your business's online presence? Check our first comment below! 👇`
  },
  {
    day: 7,
    hook: "People visit your website, but why aren't they making inquiries?",
    caption: `People visit your website, but why aren't they making inquiries?

Having website traffic is like having people walk into your store. But if everyone walks in and walks right back out without asking a question, something is broken in the layout.

Check these 3 conversion blockers:
• Is your WhatsApp button floating and clickable on mobile?
• Does your headline explain the exact benefit you deliver?
• Is your pricing transparent or easy to request?

Let Veltrix Hub review your website for free and show you where your visitors are dropping off.

Websites • E-commerce • Branding

#LeadGeneration #CRO #WebsiteAudit #VeltrixHub #BusinessStrategy

👉 Want a free initial review of your business's online presence? Check our first comment below! 👇`
  },
  {
    day: 8,
    hook: "Your website may be invisible to Google. Here's what to check.",
    caption: `Your website may be invisible to Google. Here's what to check:

Just because your website is live doesn't mean Google has indexed it. When someone in your city searches for your services, does your business appear?

3 Essential SEO checks:
1. Google Search Console: Have you submitted an XML sitemap?
2. Target Keywords in Page Titles: Does your title include your primary service and location?
3. Mobile Responsiveness & Speed: Google ranks fast, mobile-friendly sites first.

Want your business to attract organic leads from Google without paying for ads every day? Contact Veltrix Hub today.

Websites • E-commerce • Branding

#SEONigeria #GoogleVisibility #SearchOptimization #VeltrixHub #InboundLeads

👉 Want a free initial review of your business's online presence? Check our first comment below! 👇`
  },
  {
    day: 9,
    hook: "Your products deserve more than a WhatsApp status that disappears.",
    caption: `Your products deserve more than a WhatsApp status that disappears.

WhatsApp status is great for quick updates. But relying on disappearing stories to run an entire business means:
• You spend hours re-uploading the same product photos.
• New customers can't browse your catalog when you are asleep.
• You have to manually answer "How much?", "Is this available?", and send bank details 50 times a day.

An e-commerce website displays your inventory 24/7, collects payments automatically, and delivers order confirmations straight to your phone.

Upgrade from manual hustle to automated sales with Veltrix Hub.

#EcommerceNigeria #AutomatedSales #OnlineStore #VeltrixHub #ScaleYourBusiness

👉 Want a free initial review of your business's online presence? Check our first comment below! 👇`
  },
  {
    day: 10,
    hook: "Stop depending on WhatsApp to carry your whole sales process.",
    caption: `Stop depending on WhatsApp to carry your whole sales process.

WhatsApp should be your closing room—not your entire warehouse, catalog, FAQ, and invoice desk.

When your sales process relies 100% on manual DM replies:
1. You lose impatient buyers who want immediate information at midnight.
2. You spend hours fielding unqualified inquiries from people with zero intention to buy.
3. You risk losing all client chats if your account gets flagged or your phone is lost.

Build a professional digital home that pre-qualifies leads before they ever message your WhatsApp.

#BusinessEfficiency #Automation #VeltrixHub #DigitalInfrastructure #SalesFunnel

👉 Want a free initial review of your business's online presence? Check our first comment below! 👇`
  },
  {
    day: 11,
    hook: "Looking less professional online can affect how customers perceive your offer.",
    caption: `Looking less professional online can affect how customers perceive your offer.

Perception determines price. If a customer visits your online presence and sees low-resolution graphics, inconsistent typography, and broken links, they automatically assume your work is low quality.

A polished, coherent brand identity allows you to:
• Command premium rates without price haggling.
• Attract corporate and high-ticket clients.
• Build long-term brand equity that compounds over time.

Does your online presence reflect the quality of your actual work?

Websites • E-commerce • Branding

#BrandIdentity #PremiumBranding #VeltrixHub #DesignExcellence #BusinessAuthority

👉 Want a free initial review of your business's online presence? Check our first comment below! 👇`
  },
  {
    day: 12,
    hook: "Why do visitors leave a website without taking the next step?",
    caption: `Why do visitors leave a website without taking the next step?

Most website exits boil down to cognitive friction:
• Confusion: "I don't understand what this company actually does."
• Skepticism: "There are no verified reviews, CAC details, or address."
• Frustration: "The buttons don't work smoothly on my phone."

When you remove friction, conversions naturally rise.

At Veltrix Hub, we build digital touchpoints designed around customer psychology.

Websites • E-commerce • Branding

#UserExperience #ConversionRate #VeltrixHub #WebsiteOptimization #ConsumerTrust

👉 Want a free initial review of your business's online presence? Check our first comment below! 👇`
  },
  {
    day: 13,
    hook: "Ads can bring visitors, but your website still needs to give them a reason to act.",
    caption: `Ads can bring visitors, but your website still needs to give them a reason to act.

Running Facebook, Instagram, or Google ads without an optimized landing page is like paying for a billboard that points people to an empty store.

Ads generate curiosity. Your website builds conviction.

Before you increase your ad budget this month:
• Ensure your landing page matches the exact promise of your ad.
• Give visitors a clear, compelling reason to act immediately.
• Make the inquiry process fast and effortless.

Let's optimize your conversion funnel with Veltrix Hub.

#AdOptimization #DigitalMarketing #LandingPage #VeltrixHub #ROI

👉 Want a free initial review of your business's online presence? Check our first comment below! 👇`
  },
  {
    day: 14,
    hook: "If someone searches for your business today, what will they find?",
    caption: `If someone searches for your business today, what will they find?

When a customer hears about you through word of mouth, the very first thing they do is Google your business name.

Will they find:
• A verified Google Business profile and a professional website?
• Or an unverified page with outdated phone numbers?

Control your narrative. Make sure your business appears authoritative, trustworthy, and ready for business from the very first search result.

#BrandReputation #GoogleSearch #VeltrixHub #OnlinePresence #BusinessTrust

👉 Want a free initial review of your business's online presence? Check our first comment below! 👇`
  },
  {
    day: 15,
    hook: "Trust starts with how clearly you present your business online.",
    caption: `Trust starts with how clearly you present your business online.

In business, clarity equals confidence, and confidence equals conversion. When your value proposition, services, and proof are laid out seamlessly, clients feel secure investing in your solutions.

"We don't just build websites. We build trust."

Whether you need a custom corporate website, an e-commerce platform, or a complete brand overhaul, Veltrix Hub is your dedicated growth partner.

Websites • E-commerce • Branding

#VeltrixHub #BuildTrust #DigitalPartner #Authority #WebArchitecture #BrandGrowth

👉 Want a free initial review of your business's online presence? Check our first comment below! 👇`
  }
];

// 15 Evening Posts (6:00 PM) - Service-Based ("What I Do" & AI Automations)
const EVENING_SERVICES = [
  {
    day: 1,
    title: "AI Automation: Intelligent Lead Qualification & Instant Reply Systems",
    caption: `Service Spotlight: AI Business Automations 🤖⚡️

Are you still manually answering the same 20 customer questions every single day? 

At Veltrix Hub, we build intelligent AI workflows that run your business on autopilot:
• Instant AI lead qualification on WhatsApp, Facebook, and Web.
• Automated CRM synchronization (never lose a lead's contact again).
• Intelligent routing: sends high-ticket buyers directly to your calendar.

Free your team from repetitive manual tasks so you can focus on closing deals.

#AIAutomation #BusinessSystems #VeltrixHub #SmartWorkflows #LeadCapture #AutomationAgency

👉 Want to automate your customer inquiries and lead capture? Check our first comment below! 👇`
  },
  {
    day: 2,
    title: "Website Development: High-Converting Corporate Web Architectures",
    caption: `Service Spotlight: Custom Website Development 💻✨

Your website shouldn't just be an expensive online business card. It should be your top-performing salesperson that never sleeps.

What we deliver at Veltrix Hub:
1. Lightning-fast load speeds (under 2 seconds).
2. Clean, mobile-first responsive architecture.
3. Frictionless inquiry paths engineered for conversions.
4. Bank-grade SSL encryption and automated daily backups.

We don't just build websites. We build trust.

#WebDevelopment #WebDesignNigeria #CorporateWebsite #VeltrixHub #CustomWebsites

👉 Ready to build a website that turns visitors into clients? Check our first comment below! 👇`
  },
  {
    day: 3,
    title: "E-Commerce Development: Automated Stores that Sell While You Sleep",
    caption: `Service Spotlight: E-Commerce Store Development 🛍️💳

Tired of sending your bank account details manually in DMs for every single order?

We build complete e-commerce growth engines:
• Automated payment gateways (Paystack, Flutterwave, Stripe).
• Live inventory tracking & low-stock alerts.
• Automated customer email and SMS receipts.
• Cart abandonment recovery systems that win back lost sales.

Scale your product sales effortlessly across Nigeria and worldwide.

#EcommerceDevelopment #OnlineStore #PaystackIntegration #VeltrixHub #RetailAutomation

👉 Want an automated online store for your products? Check our first comment below! 👇`
  },
  {
    day: 4,
    title: "AI Automation: Automated CRM & Follow-up Pipelines",
    caption: `Service Spotlight: CRM & Sales Pipeline Automation 📊🚀

Over 60% of lost sales happen simply because business owners forget to follow up with leads after the initial inquiry.

With Veltrix Hub AI Automations:
• Every inquiry from Facebook, Web, and WhatsApp is automatically saved to your CRM.
• Intelligent drip sequences nurture leads automatically over 7, 14, and 30 days.
• Automatic reminder alerts when a warm prospect is ready for a call.

Stop leaving money on the table due to manual follow-up delays.

#SalesCRM #PipelineAutomation #LeadNurture #VeltrixHub #B2BGrowth #TechSolutions

👉 Want an automated follow-up system for your business? Check our first comment below! 👇`
  },
  {
    day: 5,
    title: "Corporate Branding: Visual Identity that Commands Premium Rates",
    caption: `Service Spotlight: Corporate Branding & Identity Design 🎨🏷️

Looking like an amateur online forces you to compete purely on low price. A polished, cohesive brand allows you to command premium rates.

What our branding package includes:
• Distinctive corporate logo design & vector master files.
• Comprehensive brand style guide (typography, color palettes, spacing).
• Social media kit, business cards, letterheads, and proposal templates.
• Marketing collateral tailored for high-ticket client acquisition.

Does your brand reflect the quality of your actual work?

#CorporateBranding #BrandIdentity #LogoDesign #VeltrixHub #DesignAgency #NigeriaBranding

👉 Want to elevate your business's visual credibility? Check our first comment below! 👇`
  },
  {
    day: 6,
    title: "SEO Architecture: Getting Discovered on Page 1 of Google",
    caption: `Service Spotlight: Search Engine Optimization (SEO) 🔍📈

Relying solely on paid ads means when you stop spending, your inquiries stop completely.

Our SEO Architecture services ensure sustainable, organic visibility:
• Technical on-page SEO: site speed, schema markup, and mobile indexability.
• Local SEO: Google Business Profile optimization to capture buyers in your city.
• High-intent keyword targeting: rank for what your ideal customers are actively typing.

Turn Google into a continuous source of high-intent inquiries.

#SEONigeria #GoogleRanking #LocalSEO #SearchOptimization #VeltrixHub #OrganicTraffic

👉 Want to rank your business higher on Google? Check our first comment below! 👇`
  },
  {
    day: 7,
    title: "AI Chatbots: 24/7 Smart Customer Support & Booking",
    caption: `Service Spotlight: Custom AI Support Chatbots 💬⚡️

Customers don't want to wait 4 hours for an email reply. If they don't get answers in minutes, they move on.

At Veltrix Hub, we deploy customized AI Chatbots trained specifically on your business:
• Trained on your FAQs, product catalogs, pricing, and policies.
• Books client consultation appointments straight to your calendar.
• Resolves customer support queries 24/7 with zero human intervention.

Deliver an enterprise-grade customer experience at a fraction of the cost.

#AIChatbot #CustomerSupport #AutomatedBooking #VeltrixHub #SmartBusiness #AI2026

👉 Want a 24/7 AI chatbot tailored to your business? Check our first comment below! 👇`
  },
  {
    day: 8,
    title: "Website Maintenance & Security: Zero Downtime & Maximum Speed",
    caption: `Service Spotlight: Professional Website Maintenance 🛡️⚙️

A broken plugin, outdated security patch, or hacked database can destroy years of hard-earned client trust overnight.

Our Website Maintenance Service takes the headache away:
• Weekly security audits & malware scanning.
• Automated off-site cloud backups.
• Core CMS, plugin, and framework updates.
• 24/7 uptime monitoring with instant incident response.

Keep your digital storefront running smoothly and securely 365 days a year.

#WebMaintenance #WebsiteSecurity #UptimeMonitoring #VeltrixHub #TechSupport

👉 Need reliable maintenance and security for your website? Check our first comment below! 👇`
  },
  {
    day: 9,
    title: "CAC Business Registration & Verification Setup",
    caption: `Service Spotlight: CAC Business Registration & Legal Setup 📜🏛️

Corporate clients and high-value buyers in Nigeria will NOT do business with unregistered entities.

Veltrix Hub helps you bridge the formal trust barrier:
• Business Name and Limited Liability (LLC) registration with the CAC.
• Official Status Report, Certificate of Incorporation, and Tax Identification (TIN).
• Official bank account setup assistance and Google verification.

Start building legitimate business authority today.

#CACRegistration #BusinessRegistrationNigeria #CorporateTrust #VeltrixHub #SMEVerification

👉 Need your business registered or verified with CAC? Check our first comment below! 👇`
  },
  {
    day: 10,
    title: "High-Converting Landing Pages: Built for Ad Campaigns",
    caption: `Service Spotlight: High-Converting Landing Page Design 🎯🚀

Are you running Facebook, Instagram, or TikTok ads and sending traffic to a generic homepage? You are wasting your ad spend.

Our custom Landing Pages are conversion machines:
• Single, hyper-focused call to action (no confusing side menus).
• Irresistible value framing & psychological proof stacking.
• Blazing-fast mobile load time for zero drop-off.
• Integrated pixel tracking and lead analytics.

Double your ad campaign conversion rates with purpose-built landing pages.

#LandingPageDesign #AdFunnels #PPCMarketing #VeltrixHub #CRO #PaidAds

👉 Want a high-converting landing page for your next campaign? Check our first comment below! 👇`
  },
  {
    day: 11,
    title: "WhatsApp Business API & Smart Auto-Responders",
    caption: `Service Spotlight: WhatsApp Business Automation 📲⚡️

WhatsApp is where business happens in Nigeria and Africa. But managing hundreds of incoming chats manually leads to burnout and dropped leads.

Veltrix Hub connects your WhatsApp to smart automation:
• Automated greeting & interactive service menus.
• Instant order status updates and booking notifications.
• Team inbox sharing (multiple agents on one WhatsApp number).
• Smart triggers based on customer keywords.

Turn WhatsApp into an automated sales machine.

#WhatsAppAutomation #WhatsAppBusinessAPI #ChatAutomation #VeltrixHub #SalesEfficiency

👉 Want to automate your WhatsApp customer workflow? Check our first comment below! 👇`
  },
  {
    day: 12,
    title: "Mobile App Development: Custom iOS & Android Applications",
    caption: `Service Spotlight: Custom Mobile Application Development 📱💻

When your business model requires instant push notifications, offline access, and direct customer retention, a mobile app is the ultimate asset.

What we build:
• Clean, intuitive UI/UX for both iOS and Android.
• Real-time database sync and secure cloud backends.
• Seamless in-app payments, biometric login, and user accounts.
• App Store and Google Play Store deployment & compliance.

Bring your mobile software vision to life with Veltrix Hub.

#MobileAppDev #AppDevelopment #Flutter #ReactNative #VeltrixHub #TechStartup

👉 Looking to build a mobile app for your business? Check our first comment below! 👇`
  },
  {
    day: 13,
    title: "Digital Consultation: Complete Business Systems Diagnostic",
    caption: `Service Spotlight: 1-on-1 Digital Growth Consultation 💡🔍

Unsure whether your business needs a website redesign, paid ads, SEO, or an AI automation workflow?

Our strategic consultation provides actionable clarity:
• Complete audit of your current digital presence and customer journey.
• Identification of silent conversion leaks where you lose buyers.
• A clear, step-by-step 90-day digital growth roadmap tailored to your budget.

Stop guessing. Make decisions backed by data and proven systems.

#DigitalConsulting #StrategySession #BusinessAudit #VeltrixHub #GrowthRoadmap

👉 Book your 1-on-1 digital systems review today! Check our first comment below! 👇`
  },
  {
    day: 14,
    title: "Complete Digital Transformation: All-in-One Growth Overhaul",
    caption: `Service Spotlight: Full Digital Transformation Overhaul 🚀🏢

For businesses ready to take market leadership and leave outdated competitors behind.

The Full Overhaul Package unites all our core disciplines:
1. Complete brand identity redesign & collateral.
2. Custom corporate website or e-commerce platform.
3. Automated AI lead capture, CRM pipeline & WhatsApp automation.
4. Foundation SEO setup for long-term Google discovery.

Transform your business from manual hustle into an automated digital authority.

#DigitalTransformation #FullServiceAgency #VeltrixHub #ScaleYourBusiness #MarketLeadership

👉 Ready for a full digital overhaul? Check our first comment below! 👇`
  },
  {
    day: 15,
    title: "Veltrix Hub Partnership: Innovate • Build • Grow",
    caption: `Why Businesses Choose Veltrix Hub as Their Growth Partner 🤝💼

We are not just a freelance shop that delivers a zip file and disappears. We are long-term technology partners committed to your real business results.

Our Motto:
"We don't just build websites. We build trust."

From custom web design and e-commerce platforms to cutting-edge AI automations and corporate branding, we engineer digital touchpoints that help you get found, build trust, and win more customers.

Let's build something remarkable together.

Websites • AI Automations • Branding

#VeltrixHub #TechnologyPartner #InnovateBuildGrow #DigitalExcellence #NigeriaBusiness

👉 Want to discuss your next project with Veltrix Hub? Check our first comment below! 👇`
  }
];

async function scheduleThirtyPostsBatch() {
  console.log('=== Scheduling 30-Post Batch (2 Posts Daily: Morning 9AM & Evening 6PM) in MongoDB Atlas ===');

  const org = await prisma.organization.findFirst({ where: { slug: 'veltrix-hub' } });
  if (!org) throw new Error('Veltrix Hub org not found');

  // Use the active connected page
  const page = await prisma.socialPage.findFirst({
    where: { organizationId: org.id, isActive: true }
  });
  if (!page) throw new Error('Active page not found');

  console.log(`Target Facebook Page: ${page.pageName} (ID: ${page.pageId})`);

  // Clear previous scheduled batch to set up pristine 30-post queue
  const deleted = await prisma.scheduledPost.deleteMany({
    where: { organizationId: org.id, status: 'SCHEDULED' }
  });
  console.log(`Cleared ${deleted.count} prior scheduled posts.`);

  let totalScheduled = 0;

  for (let day = 1; day <= 15; day++) {
    const dayNumber = day + 13; // Nov 14 = day 1, Nov 28 = day 15
    const dateBase = `2026-11-${String(dayNumber).padStart(2, '0')}`;

    // 1. Morning Post: 09:00 AM WAT (08:00 UTC)
    const morningDate = new Date(`${dateBase}T09:00:00+01:00`);
    const morningItem = MORNING_HOOKS[day - 1];
    const morningDesign = DESIGN_TEMPLATES[(day - 1) % DESIGN_TEMPLATES.length];

    await prisma.scheduledPost.create({
      data: {
        organizationId: org.id,
        socialPageId: page.id,
        caption: morningItem.caption,
        mediaUrls: [morningDesign],
        scheduledFor: morningDate,
        status: 'SCHEDULED'
      }
    });
    totalScheduled++;

    // 2. Evening Post: 06:00 PM (18:00 WAT / 17:00 UTC)
    const eveningDate = new Date(`${dateBase}T18:00:00+01:00`);
    const eveningItem = EVENING_SERVICES[day - 1];
    const eveningDesign = DESIGN_TEMPLATES[(day + 1) % DESIGN_TEMPLATES.length];

    await prisma.scheduledPost.create({
      data: {
        organizationId: org.id,
        socialPageId: page.id,
        caption: eveningItem.caption,
        mediaUrls: [eveningDesign],
        scheduledFor: eveningDate,
        status: 'SCHEDULED'
      }
    });
    totalScheduled++;

    console.log(`[Day ${day} | Nov ${dayNumber}] Scheduled 2 Posts:`);
    console.log(`   🌅 09:00 AM (Morning Hook): "${morningItem.hook.slice(0, 45)}..."`);
    console.log(`   🌆 06:00 PM (Evening Service): "${eveningItem.title.slice(0, 45)}..."`);
  }

  const finalCount = await prisma.scheduledPost.count({
    where: { organizationId: org.id, status: 'SCHEDULED' }
  });

  console.log(`\n🎉 Success! Scheduled exactly ${totalScheduled} posts (2 per day for 15 days) in MongoDB Atlas!`);
  console.log(`Total Active Posts in Content Calendar: ${finalCount}`);
}

scheduleThirtyPostsBatch()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
