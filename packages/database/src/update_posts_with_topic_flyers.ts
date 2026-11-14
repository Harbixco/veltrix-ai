import { prisma } from './index';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

function getFlyerForCaption(caption: string): string {
  // Morning Educational Hooks
  if (caption.includes('wrong online problem')) {
    return '/designs/flyers/flyer-day01-morning-wrong-problem.jpg';
  }
  if (caption.includes('How much?') || caption.includes('ask "How much?"') || caption.includes("ask 'How much?'")) {
    return '/designs/flyers/flyer-day02-morning-how-much-disappear.jpg';
  }
  if (caption.includes('More followers') || caption.includes("won't automatically bring")) {
    return '/designs/flyers/flyer-day03-morning-more-followers.jpg';
  }
  if (caption.includes('understand what you sell in 10 seconds') || caption.includes('10-Second Test')) {
    return '/designs/flyers/flyer-day04-morning-10-seconds-clarity.jpg';
  }
  if (caption.includes('website design mistakes') || caption.includes('frustrate potential customers')) {
    return '/designs/flyers/flyer-day05-morning-website-design-mistakes.jpg';
  }
  if (caption.includes('verify your business') || caption.includes('comfortable buying')) {
    return '/designs/flyers/flyer-day06-morning-verify-your-business.jpg';
  }
  if (caption.includes("aren't they making inquiries") || caption.includes('why no inquiries')) {
    return '/designs/flyers/flyer-day07-morning-why-no-inquiries.jpg';
  }
  if (caption.includes('invisible to Google')) {
    return '/designs/flyers/flyer-day08-morning-invisible-to-google.jpg';
  }
  if (caption.includes('WhatsApp status that disappears') || caption.includes('WhatsApp status is great')) {
    return '/designs/flyers/flyer-day09-morning-whatsapp-status-disappears.jpg';
  }
  if (caption.includes('Stop depending on WhatsApp') || caption.includes('whole sales process')) {
    return '/designs/flyers/flyer-day10-morning-stop-depending-on-whatsapp.jpg';
  }
  if (caption.includes('Looking less professional online') || caption.includes('Perception determines price')) {
    return '/designs/flyers/flyer-day11-morning-less-professional-online.jpg';
  }
  if (caption.includes('Why do visitors leave a website')) {
    return '/designs/flyers/flyer-day12-morning-why-visitors-leave.jpg';
  }
  if (caption.includes('Ads can bring visitors')) {
    return '/designs/flyers/flyer-day13-morning-ads-need-landing-page.jpg';
  }
  if (caption.includes('If someone searches for your business') || caption.includes('Google your business name')) {
    return '/designs/flyers/flyer-day14-morning-searches-for-your-business.jpg';
  }
  if (caption.includes('Trust starts with how clearly')) {
    return '/designs/flyers/flyer-day15-morning-trust-starts-with-clarity.jpg';
  }

  // Evening Service Spotlights
  if (caption.includes('AI Business Automations') || caption.includes('AI Automation:')) {
    return '/designs/flyers/flyer-day01-evening-ai-lead-automation.jpg';
  }
  if (caption.includes('Custom Website Development') || caption.includes('Corporate Web Architectures')) {
    return '/designs/flyers/flyer-day02-evening-website-development.jpg';
  }
  if (caption.includes('E-Commerce Store Development') || caption.includes('E-Commerce Development:')) {
    return '/designs/flyers/flyer-day03-evening-ecommerce-development.jpg';
  }
  if (caption.includes('CRM & Sales Pipeline Automation')) {
    return '/designs/flyers/flyer-day04-evening-crm-sales-automation.jpg';
  }
  if (caption.includes('Corporate Branding & Identity Design') || caption.includes('Brand Identity & Design')) {
    return '/designs/flyers/flyer-day04-evening-brand-identity.jpg';
  }
  if (caption.includes('Custom Web Applications') || caption.includes('Custom Business Software')) {
    return '/designs/flyers/flyer-day05-evening-custom-web-apps.jpg';
  }
  if (caption.includes('Search Engine Optimization (SEO)') || caption.includes('SEO Architecture:')) {
    return '/designs/flyers/flyer-day06-evening-seo-architecture.jpg';
  }
  if (caption.includes('Custom AI Support Chatbots') || caption.includes('AI Chatbots:')) {
    return '/designs/flyers/flyer-day07-evening-ai-chatbots.jpg';
  }
  if (caption.includes('Professional Website Maintenance') || caption.includes('Website Maintenance & Security:')) {
    return '/designs/flyers/flyer-day08-evening-website-maintenance.jpg';
  }
  if (caption.includes('CAC Business Registration') || caption.includes('CAC Registration')) {
    return '/designs/flyers/flyer-day09-evening-cac-registration.jpg';
  }
  if (caption.includes('High-Converting Landing Page Design') || caption.includes('Landing Pages: Built for Ad')) {
    return '/designs/flyers/flyer-day10-evening-landing-pages.jpg';
  }
  if (caption.includes('WhatsApp Business Automation') || caption.includes('WhatsApp Business API')) {
    return '/designs/flyers/flyer-day11-evening-whatsapp-business-api.jpg';
  }
  if (caption.includes('Custom Mobile Application Development') || caption.includes('Mobile App Development:')) {
    return '/designs/flyers/flyer-day12-evening-mobile-app-development.jpg';
  }
  if (caption.includes('Digital Growth Consultation') || caption.includes('Digital Systems Consultation')) {
    return '/designs/flyers/flyer-day13-evening-digital-consultation.jpg';
  }
  if (caption.includes('Full Digital Transformation') || caption.includes('Digital Transformation Overhaul')) {
    return '/designs/flyers/flyer-day14-evening-digital-transformation.jpg';
  }
  if (caption.includes('Why Businesses Choose Veltrix Hub')) {
    return '/designs/flyers/flyer-day15-evening-partnership-innovate-build-grow.jpg';
  }

  // Abiodun Tech / Strategy Tweets
  if (caption.includes('React performance tip') || caption.includes('lifting state higher')) {
    return '/designs/flyers/flyer-tech-react-perf.jpg';
  }
  if (caption.includes("AI won't replace software engineers")) {
    return '/designs/flyers/flyer-tech-ai-replace-engineers.jpg';
  }
  if (caption.includes('Stop using useEffect to sync related state')) {
    return '/designs/flyers/flyer-tech-derived-state.jpg';
  }
  if (caption.includes('delay in page load time costs')) {
    return '/designs/flyers/flyer-tech-website-speed-cost.jpg';
  }
  if (caption.includes('TypeScript in production')) {
    return '/designs/flyers/flyer-tech-typescript-production.jpg';
  }
  if (caption.includes("Most businesses don't need another generic ChatGPT")) {
    return '/designs/flyers/flyer-tech-deterministic-ai.jpg';
  }
  if (caption.includes('escape tutorial hell')) {
    return '/designs/flyers/flyer-tech-tutorial-hell.jpg';
  }
  if (caption.includes('React Native with the New Architecture')) {
    return '/designs/flyers/flyer-tech-react-native-hermes.jpg';
  }
  if (caption.includes('Junior engineers debate frameworks')) {
    return '/designs/flyers/flyer-tech-senior-mindset.jpg';
  }
  if (caption.includes('Designers design on a 4K MacBook') || caption.includes('budget smartphones')) {
    return '/designs/flyers/flyer-tech-mobile-first-reality.jpg';
  }
  if (caption.includes('learn web development from zero in 2026')) {
    return '/designs/flyers/flyer-tech-roadmap-2026.jpg';
  }
  if (caption.includes('OpenAI bill') || caption.includes('Building AI apps')) {
    return '/designs/flyers/flyer-tech-openai-costs.jpg';
  }
  if (caption.includes('custom React hook')) {
    return '/designs/flyers/flyer-tech-custom-hooks.jpg';
  }
  if (caption.includes('spending $10,000 building a mobile app') || caption.includes('try a PWA')) {
    return '/designs/flyers/flyer-tech-pwa-vs-native.jpg';
  }
  if (caption.includes('Stop building to-do apps') || caption.includes('SaaS dashboard')) {
    return '/designs/flyers/flyer-tech-saas-portfolio.jpg';
  }
  if (caption.includes("don't need Redux or Zustand")) {
    return '/designs/flyers/flyer-tech-react-perf.jpg';
  }
  if (caption.includes('What building Veltrix Hub taught me')) {
    return '/designs/flyers/flyer-tech-senior-mindset.jpg';
  }
  if (caption.includes('Senior frontend debugging tip')) {
    return '/designs/flyers/flyer-tech-derived-state.jpg';
  }
  if (caption.includes('Why most website chatbots fail')) {
    return '/designs/flyers/flyer-tech-deterministic-ai.jpg';
  }
  if (caption.includes('accessibility (a11y)')) {
    return '/designs/flyers/flyer-tech-mobile-first-reality.jpg';
  }
  if (caption.includes('reasons e-commerce carts get abandoned')) {
    return '/designs/flyers/flyer-day03-evening-ecommerce-development.jpg';
  }
  if (caption.includes('Modern CSS in 2026')) {
    return '/designs/flyers/flyer-tech-roadmap-2026.jpg';
  }
  if (caption.includes('price software projects')) {
    return '/designs/flyers/flyer-tech-senior-mindset.jpg';
  }
  if (caption.includes('cut your React bundle size')) {
    return '/designs/flyers/flyer-tech-react-perf.jpg';
  }
  if (caption.includes('Managing client leads on WhatsApp alone')) {
    return '/designs/flyers/flyer-day10-morning-stop-depending-on-whatsapp.jpg';
  }
  if (caption.includes('In code reviews, look for these 3 red flags')) {
    return '/designs/flyers/flyer-tech-typescript-production.jpg';
  }
  if (caption.includes('pays for high-ticket services online')) {
    return '/designs/flyers/flyer-day06-morning-verify-your-business.jpg';
  }
  if (caption.includes('The frontend engineer skill stack')) {
    return '/designs/flyers/flyer-tech-roadmap-2026.jpg';
  }
  if (caption.includes('digital solutions that actually close deals')) {
    return '/designs/flyers/flyer-day15-evening-partnership-innovate-build-grow.jpg';
  }

  return '/designs/flyers/flyer-day01-morning-wrong-problem.jpg';
}

async function updatePostsWithTopicFlyers() {
  console.log('=== Updating MongoDB Atlas Posts with Topic-Matched Flyers ===');

  const org = await prisma.organization.findFirst({
    where: { slug: 'veltrix-hub' }
  });

  if (!org) {
    throw new Error('Organization Veltrix Hub not found!');
  }

  const posts = await prisma.scheduledPost.findMany({
    where: { organizationId: org.id },
    orderBy: { scheduledFor: 'asc' }
  });

  console.log(`Found ${posts.length} posts to update in MongoDB Atlas.`);

  let updatedCount = 0;
  for (const post of posts) {
    const flyer = getFlyerForCaption(post.caption);
    await prisma.scheduledPost.update({
      where: { id: post.id },
      data: {
        mediaUrls: [flyer]
      }
    });
    updatedCount++;
    const firstLine = post.caption.split('\n')[0].slice(0, 40);
    console.log(`[${updatedCount}/${posts.length}] "${firstLine}..." -> ${flyer}`);
  }

  console.log(`\n🎉 Success! Updated ${updatedCount} posts with their 100% dedicated topic-matched flyers!`);
}

updatePostsWithTopicFlyers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
