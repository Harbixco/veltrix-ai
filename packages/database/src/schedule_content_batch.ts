import { prisma } from './index';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const POSTS_BATCH = [
  {
    dayOffset: 1,
    hook: "There's one website mistake that's easy to miss—and expensive to ignore.",
    caption: `There's one website mistake that's easy to miss—and expensive to ignore.

Most business owners assume that if visitors land on their homepage, their job is done. But if your value proposition isn't immediately clear in the first 5 seconds, up to 70% of potential customers leave without scrolling.

Here is what you must audit today:
1. Is your primary service obvious above the fold?
2. Do you have a direct, friction-free way for visitors to reach you (e.g. WhatsApp CTA)?
3. Does your website load in under 2 seconds on a mobile phone?

At Veltrix Hub, we don't just build websites. We build trust that turns traffic into paying inquiries.

👉 Send us a DM or click the link in bio to book your free website audit.

#VeltrixHub #WebDevelopment #BusinessGrowth #WebsiteMistakes #DigitalMarketing #SMEgrowth`,
    mediaUrls: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800']
  },
  {
    dayOffset: 2,
    hook: "Customers ask 'How much?' and disappear. Here are a few possible reasons.",
    caption: `Customers ask "How much?" and disappear. Here are a few possible reasons:

1. They don't understand the difference between your offer and the cheapest option on the street.
2. Your pricing wasn't framed with the value and ROI it delivers.
3. Your online presence looks informal, raising doubts about your delivery and after-sales support.

When you have a high-converting website, your process, portfolio, and credibility speak before price is ever discussed.

Stop losing serious buyers to silence. DM @officialveltrixhub to build a customer conversion funnel.

#VeltrixHub #SalesTips #CustomerAcquisition #PricingStrategy #BusinessTrust #CloseDeals`,
    mediaUrls: ['https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800']
  },
  {
    dayOffset: 3,
    hook: "A website doesn't grow a business by itself. It needs a clear purpose.",
    caption: `A website doesn't grow a business by itself. It needs a clear purpose.

Having a digital flyer online won't bring customers unless it guides them:
• What problem do you solve?
• Who have you helped before? (Verified proof)
• What exact action should they take right now?

We don't build generic static sites—we install business growth engines.

#VeltrixHub #BusinessStrategy #WebDesign #Authority #GrowthStrategy #DigitalTransformation`,
    mediaUrls: ['https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800']
  },
  {
    dayOffset: 4,
    hook: "Can a new customer understand what you sell in 10 seconds?",
    caption: `Can a new customer understand what you sell in 10 seconds?

If they have to guess, they bounce to your competitor. 

The 10-Second Test:
• Who is this for?
• What is the transformation?
• How do I get started?

Run this test on your homepage today. If it takes longer than 10 seconds, it's time for a refresh.

#VeltrixHub #UserExperience #WebsiteTips #ConversionRate #BrandClarity`,
    mediaUrls: ['https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800']
  },
  {
    dayOffset: 5,
    hook: "Why your website should work smoothly on mobile phones first.",
    caption: `Why your website should work smoothly on mobile phones first.

Over 85% of your target market is visiting from their smartphone while multitasking.
If your buttons are tiny, images take 10 seconds to load, or popups block the screen, you are handing customers to your competitors.

Every Veltrix Hub website is engineered mobile-first for speed and frictionless navigation.

#VeltrixHub #MobileFirst #ResponsiveDesign #WebDev #TechTips`,
    mediaUrls: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800']
  },
  {
    dayOffset: 6,
    hook: "What makes customers trust one business website over another?",
    caption: `What makes customers trust one business website over another?

It's rarely about flashy animations. Trust is built on:
1. Transparent contact details & official registration (e.g. CAC compliance).
2. Verifiable client testimonials with real names and results.
3. Fast, secure, SSL-encrypted browsing.

"We don't just build websites. We build trust."

#VeltrixHub #BrandTrust #Credibility #OnlineBusiness #Professionalism`,
    mediaUrls: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800']
  },
  {
    dayOffset: 7,
    hook: "Stop making customers work too hard to buy from your business.",
    caption: `Stop making customers work too hard to buy from your business.

Every extra form field, broken link, or slow page load is an exit door.
Streamline your customer journey:
• 1-Click WhatsApp contact
• Transparent service breakdown
• Frictionless checkout & payment options

Make buying effortless.

#VeltrixHub #ConversionOptimization #FrictionlessSales #SalesFunnels #BusinessTips`,
    mediaUrls: ['https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800']
  },
  {
    dayOffset: 8,
    hook: "Want people to find your business on Google? Start with these basics.",
    caption: `Want people to find your business on Google? Start with these basics:

1. Claim and optimize your Google Business Profile.
2. Structure page titles around commercial search intent (e.g. "Web development for businesses in Lagos").
3. Ensure Core Web Vitals pass mobile speed checks.

Visibility gets you noticed. A great website helps people buy.

#VeltrixHub #SEO #GoogleSearch #LocalSEO #DigitalVisibility`,
    mediaUrls: ['https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?w=800']
  },
  {
    dayOffset: 9,
    hook: "Your products deserve more than a WhatsApp status that disappears.",
    caption: `Your products deserve more than a WhatsApp status that disappears.

Status updates vanish after 24 hours. A permanent digital catalogue:
• Allows customers to browse anytime (even while you sleep)
• Automates inventory & pricing questions
• Links directly to instant payments

Scale beyond 24-hour limits with a dedicated e-commerce storefront.

#VeltrixHub #Ecommerce #ProductSales #OnlineStore #ScaleYourBusiness`,
    mediaUrls: ['https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800']
  },
  {
    dayOffset: 10,
    hook: "Your business needs a digital strategy—not just a posting schedule.",
    caption: `Your business needs a digital strategy—not just a posting schedule.

Posting 5 times a day without a conversion destination is like inviting guests to an empty room.
Where does your social media traffic go?
What happens when they arrive?
How are you capturing their inquiries?

Connect the dots with Veltrix Hub.

#VeltrixHub #DigitalStrategy #MarketingFunnel #BusinessGrowth #OnlineSales`,
    mediaUrls: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800']
  },
  {
    dayOffset: 11,
    hook: "People form impressions of your business before they ever speak to you.",
    caption: `People form impressions of your business before they ever speak to you.

Your website, colors, and typography communicate your standards before you reply to a single DM.
Does your online presence match the premium quality of your work?

Elevate your brand authority today.

#VeltrixHub #BrandIdentity #FirstImpressions #VisualBranding #BusinessStandards`,
    mediaUrls: ['https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800']
  },
  {
    dayOffset: 12,
    hook: "The difference between a website that looks good and one that supports a business goal.",
    caption: `The difference between a website that looks good and one that supports a business goal:

A website that looks good wins design compliments.
A website built for business goals captures inquiries, qualifies buyers, and drives revenue.

Choose performance over vanity.

#VeltrixHub #WebDevelopment #ConversionDesign #ROI #BusinessGrowth`,
    mediaUrls: ['https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800']
  },
  {
    dayOffset: 13,
    hook: "Can a visitor tell who you help and what you offer without scrolling?",
    caption: `Can a visitor tell who you help and what you offer without scrolling?

Above-the-fold clarity is the #1 lever for lowering bounce rates.
Rule of thumb: State what you do, who you serve, and how to get started right at the top.

Simple. Clear. Effective.

#VeltrixHub #HomepageDesign #UXDesign #ClearMessaging #GrowOnline`,
    mediaUrls: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800']
  },
  {
    dayOffset: 14,
    hook: "We don't just build websites. We build trust. Here is why credibility converts.",
    caption: `We don't just build websites. We build trust.

In a crowded market, trust is the highest-value currency. Customers don't buy the most complicated product—they buy the one they feel safest choosing.

Ready to establish permanent digital credibility for your business?
Contact Veltrix Hub today.

#VeltrixHub #BuildTrust #DigitalPartner #Authority #WebArchitecture #BrandGrowth`,
    mediaUrls: ['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800']
  }
];

async function scheduleContentBatch() {
  console.log('=== Scheduling 14-Day Automated Content Queue in MongoDB Atlas ===');

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

  console.log(`Connected Page: ${page.pageName} (ID: ${page.pageId})`);

  // Base schedule start: tomorrow at 10:00 AM
  const baseDate = new Date();
  baseDate.setHours(10, 0, 0, 0);

  let scheduledCount = 0;
  for (const item of POSTS_BATCH) {
    const scheduledFor = new Date(baseDate.getTime() + item.dayOffset * 24 * 60 * 60 * 1000);

    const post = await prisma.scheduledPost.create({
      data: {
        organizationId: org.id,
        socialPageId: page.id,
        caption: item.caption,
        mediaUrls: item.mediaUrls,
        scheduledFor,
        status: 'SCHEDULED'
      }
    });

    console.log(`[Day ${item.dayOffset}] Scheduled for ${scheduledFor.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at 10:00 AM -> Hook: "${item.hook.slice(0, 45)}..." (ID: ${post.id})`);
    scheduledCount++;
  }

  const totalInDb = await prisma.scheduledPost.count({ where: { organizationId: org.id, status: 'SCHEDULED' } });
  console.log(`\n🎉 Success! Scheduled ${scheduledCount} new daily posts.`);
  console.log(`Total Scheduled Posts currently in MongoDB Atlas Calendar: ${totalInDb}`);
}

scheduleContentBatch()
  .catch((err) => {
    console.error('Batch scheduling failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
