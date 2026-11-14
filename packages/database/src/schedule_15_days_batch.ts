import { prisma } from './index';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const DESIGN_TEMPLATES = [
  '/designs/flyers/flyer-day01-morning-wrong-problem.jpg',
  '/designs/flyers/flyer-day02-morning-how-much-disappear.jpg',
  '/designs/flyers/flyer-day03-morning-more-followers.jpg',
  '/designs/flyers/flyer-day04-morning-10-seconds-clarity.jpg',
  '/designs/flyers/flyer-day05-morning-website-design-mistakes.jpg',
  '/designs/flyers/flyer-day06-morning-verify-your-business.jpg',
  '/designs/flyers/flyer-day07-morning-why-no-inquiries.jpg',
  '/designs/flyers/flyer-day08-morning-invisible-to-google.jpg',
  '/designs/flyers/flyer-day09-morning-whatsapp-status-disappears.jpg',
  '/designs/flyers/flyer-day10-morning-stop-depending-on-whatsapp.jpg',
  '/designs/flyers/flyer-day11-morning-less-professional-online.jpg',
  '/designs/flyers/flyer-day12-morning-why-visitors-leave.jpg',
  '/designs/flyers/flyer-day13-morning-ads-need-landing-page.jpg',
  '/designs/flyers/flyer-day14-morning-searches-for-your-business.jpg',
  '/designs/flyers/flyer-day15-morning-trust-starts-with-clarity.jpg'
];

interface PostDefinition {
  dayOffset: number; // 1 to 15
  dateStr: string;
  hook: string;
  caption: string;
  designIndex: number;
}

const FIFTEEN_DAY_POSTS: PostDefinition[] = [
  {
    dayOffset: 1,
    dateStr: '2026-11-14T09:00:00+01:00',
    hook: "Most business owners are solving the wrong online problem. Here's how to spot it.",
    designIndex: 0,
    caption: `Most business owners are solving the wrong online problem. Here's how to spot it.

You might think you need more followers, more traffic, or more ad spend. But if 95% of visitors leave your page without contacting you, pouring more money into marketing only burns cash faster.

The real problem isn't always visibility—it's clarity, speed, and trust.

What to inspect first:
1. Does your homepage answer "What's in it for me?" in under 5 seconds?
2. Is your contact button frictionless and instant?
3. Can customers verify your credibility before they pay?

At Veltrix Hub, we diagnose the leaks in your customer journey and build websites that convert visitors into paying clients.


#VeltrixHub #DigitalStrategy #BusinessGrowth #WebsiteAudit #NigeriaSME #ConversionRate`
  },
  {
    dayOffset: 2,
    dateStr: '2026-11-15T09:00:00+01:00',
    hook: "Customers ask 'How much?' and disappear. Here are a few possible reasons.",
    designIndex: 1,
    caption: `Customers ask "How much?" and disappear. Here are a few possible reasons:

1. They don't understand the difference between your offer and the cheapest alternative.
2. Your pricing wasn't framed with the value, process, and transformation it delivers.
3. Your online presence looks informal, raising doubts about your reliability and after-sales support.

When you have a high-converting website, your process, portfolio, and verified credibility speak before price is ever discussed.

Stop losing serious buyers to silence. Message Veltrix Hub to build your customer conversion engine.


#SalesStrategy #ConversionOptimization #VeltrixHub #WebDesignNigeria #CloseDeals`
  },
  {
    dayOffset: 3,
    dateStr: '2026-11-16T09:00:00+01:00',
    hook: "More followers won't automatically bring more customers. Here's what else matters.",
    designIndex: 2,
    caption: `More followers won't automatically bring more customers. Here's what else matters:

A social media audience gives you attention. But customers need confidence before they make a payment.

What bridges the gap between a follower and a paying customer?
• A dedicated landing page explaining your offer clearly.
• Verifiable proof of past work and happy clients.
• A secure, structured booking or inquiry system.

Don't depend purely on social algorithms. Own your digital storefront.

Websites • E-commerce • Branding


#BusinessStrategy #WebArchitecture #VeltrixHub #BrandTrust #NigeriaBusiness`
  },
  {
    dayOffset: 4,
    dateStr: '2026-11-17T09:00:00+01:00',
    hook: "Can a new customer understand what you sell in 10 seconds?",
    designIndex: 3,
    caption: `Can a new customer understand what you sell in 10 seconds?

If a first-time visitor has to scroll endlessly or decipher complex jargon to find out what you do, they will simply click away to your competitor.

The 10-Second Test:
• Who is your service for?
• What exact problem do you solve?
• What is the next immediate step?

Run this test on your homepage today. If it takes longer than 10 seconds, your site is losing inquiries every single day.

Websites • E-commerce • Branding


#UserExperience #WebDesign #ConversionRate #VeltrixHub #OnlineClarity`
  },
  {
    dayOffset: 5,
    dateStr: '2026-11-18T09:00:00+01:00',
    hook: "3 website design mistakes that can frustrate potential customers.",
    designIndex: 4,
    caption: `3 website design mistakes that can frustrate potential customers:

1. Slow Mobile Loading: If your page takes more than 3 seconds to open on a 4G phone, over half your visitors are gone.
2. Hidden Contact Details: Forcing visitors to dig through menus just to find a phone number or WhatsApp link kills conversion.
3. Unclear Call to Action: Having 5 different buttons asking people to "Learn more", "Subscribe", "Read blog", and "Buy" causes decision fatigue.

At Veltrix Hub, we build clean, fast, mobile-first websites designed to guide your visitors straight to an inquiry.


#WebsiteMistakes #WebDevelopment #UXDesign #VeltrixHub #DigitalGrowth`
  },
  {
    dayOffset: 6,
    dateStr: '2026-11-19T09:00:00+01:00',
    hook: "Customers need a way to verify your business before they feel comfortable buying.",
    designIndex: 5,
    caption: `Customers need a way to verify your business before they feel comfortable buying.

In today's digital landscape, customers are more cautious than ever. If your only presence is a social media profile without a registered domain, verifiable reviews, or a transparent business address, customers hesitate.

How to establish instant credibility:
• A custom domain email and SSL-secured website.
• Real testimonials with client photos or company names.
• Clear refund policies, terms, and direct support channels.

"We don't just build websites. We build trust."


#BuildTrust #BrandCredibility #VeltrixHub #NigeriaStartups #CustomerConfidence`
  },
  {
    dayOffset: 7,
    dateStr: '2026-11-20T09:00:00+01:00',
    hook: "People visit your website, but why aren't they making inquiries?",
    designIndex: 6,
    caption: `People visit your website, but why aren't they making inquiries?

Having website traffic is like having people walk into your store. But if everyone walks in and walks right back out without asking a question, something is broken in the layout.

Check these 3 conversion blockers:
• Is your WhatsApp button floating and clickable on mobile?
• Does your headline explain the exact benefit you deliver?
• Is your pricing transparent or easy to request?

Let Veltrix Hub review your website for free and show you where your visitors are dropping off.

Websites • E-commerce • Branding


#LeadGeneration #CRO #WebsiteAudit #VeltrixHub #BusinessStrategy`
  },
  {
    dayOffset: 8,
    dateStr: '2026-11-21T09:00:00+01:00',
    hook: "Your website may be invisible to Google. Here's what to check.",
    designIndex: 7,
    caption: `Your website may be invisible to Google. Here's what to check:

Just because your website is live doesn't mean Google has indexed it. When someone in your city searches for your services, does your business appear?

3 Essential SEO checks:
1. Google Search Console: Have you submitted an XML sitemap?
2. Target Keywords in Page Titles: Does your title include your primary service and location?
3. Mobile Responsiveness & Speed: Google ranks fast, mobile-friendly sites first.

Want your business to attract organic leads from Google without paying for ads every day? Contact Veltrix Hub today.

Websites • E-commerce • Branding


#SEONigeria #GoogleVisibility #SearchOptimization #VeltrixHub #InboundLeads`
  },
  {
    dayOffset: 9,
    dateStr: '2026-11-22T09:00:00+01:00',
    hook: "Your products deserve more than a WhatsApp status that disappears.",
    designIndex: 8,
    caption: `Your products deserve more than a WhatsApp status that disappears.

WhatsApp status is great for quick updates. But relying on disappearing stories to run an entire business means:
• You spend hours re-uploading the same product photos.
• New customers can't browse your catalog when you are asleep.
• You have to manually answer "How much?", "Is this available?", and send bank details 50 times a day.

An e-commerce website displays your inventory 24/7, collects payments automatically, and delivers order confirmations straight to your phone.

Upgrade from manual hustle to automated sales with Veltrix Hub.


#EcommerceNigeria #AutomatedSales #OnlineStore #VeltrixHub #ScaleYourBusiness`
  },
  {
    dayOffset: 10,
    dateStr: '2026-11-23T09:00:00+01:00',
    hook: "Stop depending on WhatsApp to carry your whole sales process.",
    designIndex: 9,
    caption: `Stop depending on WhatsApp to carry your whole sales process.

WhatsApp should be your closing room—not your entire warehouse, catalog, FAQ, and invoice desk.

When your sales process relies 100% on manual DM replies:
1. You lose impatient buyers who want immediate information at midnight.
2. You spend hours fielding unqualified inquiries from people with zero intention to buy.
3. You risk losing all client chats if your account gets flagged or your phone is lost.

Build a professional digital home that pre-qualifies leads before they ever message your WhatsApp.


#BusinessEfficiency #Automation #VeltrixHub #DigitalInfrastructure #SalesFunnel`
  },
  {
    dayOffset: 11,
    dateStr: '2026-11-24T09:00:00+01:00',
    hook: "Looking less professional online can affect how customers perceive your offer.",
    designIndex: 10,
    caption: `Looking less professional online can affect how customers perceive your offer.

Perception determines price. If a customer visits your online presence and sees low-resolution graphics, inconsistent typography, and broken links, they automatically assume your work is low quality.

A polished, coherent brand identity allows you to:
• Command premium rates without price haggling.
• Attract corporate and high-ticket clients.
• Build long-term brand equity that compounds over time.

Does your online presence reflect the quality of your actual work?

Websites • E-commerce • Branding


#BrandIdentity #PremiumBranding #VeltrixHub #DesignExcellence #BusinessAuthority`
  },
  {
    dayOffset: 12,
    dateStr: '2026-11-25T09:00:00+01:00',
    hook: "Why do visitors leave a website without taking the next step?",
    designIndex: 11,
    caption: `Why do visitors leave a website without taking the next step?

Most website exits boil down to cognitive friction:
• Confusion: "I don't understand what this company actually does."
• Skepticism: "There are no verified reviews, CAC details, or address."
• Frustration: "The buttons don't work smoothly on my phone."

When you remove friction, conversions naturally rise.

At Veltrix Hub, we build digital touchpoints designed around customer psychology.

Websites • E-commerce • Branding


#UserExperience #ConversionRate #VeltrixHub #WebsiteOptimization #ConsumerTrust`
  },
  {
    dayOffset: 13,
    dateStr: '2026-11-26T09:00:00+01:00',
    hook: "Ads can bring visitors, but your website still needs to give them a reason to act.",
    designIndex: 12,
    caption: `Ads can bring visitors, but your website still needs to give them a reason to act.

Running Facebook, Instagram, or Google ads without an optimized landing page is like paying for a billboard that points people to an empty store.

Ads generate curiosity. Your website builds conviction.

Before you increase your ad budget this month:
• Ensure your landing page matches the exact promise of your ad.
• Give visitors a clear, compelling reason to act immediately.
• Make the inquiry process fast and effortless.

Let's optimize your conversion funnel with Veltrix Hub.


#AdOptimization #DigitalMarketing #LandingPage #VeltrixHub #ROI`
  },
  {
    dayOffset: 14,
    dateStr: '2026-11-27T09:00:00+01:00',
    hook: "If someone searches for your business today, what will they find?",
    designIndex: 13,
    caption: `If someone searches for your business today, what will they find?

When a customer hears about you through word of mouth, the very first thing they do is Google your business name.

Will they find:
• A verified Google Business profile and a professional website?
• Or an unverified page with outdated phone numbers?

Control your narrative. Make sure your business appears authoritative, trustworthy, and ready for business from the very first search result.


#BrandReputation #GoogleSearch #VeltrixHub #OnlinePresence #BusinessTrust`
  },
  {
    dayOffset: 15,
    dateStr: '2026-11-28T09:00:00+01:00',
    hook: "Trust starts with how clearly you present your business online.",
    designIndex: 14,
    caption: `Trust starts with how clearly you present your business online.

In business, clarity equals confidence, and confidence equals conversion. When your value proposition, services, and proof are laid out seamlessly, clients feel secure investing in your solutions.

"We don't just build websites. We build trust."

Whether you need a custom corporate website, an e-commerce platform, or a complete brand overhaul, Veltrix Hub is your dedicated growth partner.

Websites • E-commerce • Branding


#VeltrixHub #BuildTrust #DigitalPartner #Authority #WebArchitecture #BrandGrowth`
  }
];

async function runFifteenDaysScheduler() {
  console.log('=== Scheduling 15-Day Automated Content Queue (9:00 AM Daily) in MongoDB Atlas ===');

  const org = await prisma.organization.findFirst({
    where: { slug: 'veltrix-hub' }
  });

  if (!org) {
    throw new Error('Organization Veltrix Hub not found!');
  }

  const page = await prisma.socialPage.findFirst({
    where: { organizationId: org.id, isActive: true }
  });

  if (!page) {
    throw new Error('Active Facebook Page not found!');
  }

  console.log(`Connected Organization: ${org.name} (${org.id})`);
  console.log(`Connected Meta Facebook Page: ${page.pageName} (Page ID: ${page.pageId})`);

  // 1. Clean up existing scheduled posts to ensure a pristine 15-day sequence
  const deleted = await prisma.scheduledPost.deleteMany({
    where: { organizationId: org.id, status: 'SCHEDULED' }
  });
  console.log(`Purged ${deleted.count} prior scheduled posts to ensure clean 15-day 9:00 AM daily sequence.`);

  // 2. Schedule each of the 15 posts
  let count = 0;
  for (const item of FIFTEEN_DAY_POSTS) {
    const scheduledDate = new Date(item.dateStr);
    const media = [DESIGN_TEMPLATES[item.designIndex]];

    const post = await prisma.scheduledPost.create({
      data: {
        organizationId: org.id,
        socialPageId: page.id,
        caption: item.caption,
        mediaUrls: media,
        scheduledFor: scheduledDate,
        status: 'SCHEDULED'
      }
    });

    const displayDate = scheduledDate.toLocaleString('en-US', {
      timeZone: 'Africa/Lagos',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    console.log(`[Day ${item.dayOffset} | ${displayDate}] Hook: "${item.hook.slice(0, 50)}..." -> Asset: ${media[0]} (ID: ${post.id})`);
    count++;
  }

  const totalInDb = await prisma.scheduledPost.count({
    where: { organizationId: org.id, status: 'SCHEDULED' }
  });

  console.log(`\n🎉 Success! Successfully scheduled exactly ${count} posts for 15 consecutive days at 9:00 AM daily!`);
  console.log(`Total Scheduled Posts currently active in MongoDB Atlas: ${totalInDb}`);
}

runFifteenDaysScheduler()
  .catch((err) => {
    console.error('Scheduling error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
