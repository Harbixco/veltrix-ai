import { prisma } from './index';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface XScheduleItem {
  day: number;
  dateStr: string;
  slot: 'MORNING' | 'EVENING';
  scheduledFor: Date;
  caption: string;
  pillar: string;
}

const X_TWEETS_BATCH: Omit<XScheduleItem, 'day' | 'dateStr' | 'scheduledFor'>[] = [
  // Day 1 - Nov 14
  {
    slot: 'MORNING',
    pillar: 'REACT_PERFORMANCE',
    caption: `React performance tip:\n\nMost UI lag isn't caused by missing useMemo. It's caused by lifting state higher than it needs to be.\n\nKeep state local. When state stays near the component that uses it, unnecessary re-renders disappear.\n\n#ReactJS #TypeScript #WebDev`
  },
  {
    slot: 'EVENING',
    pillar: 'AI_AUTOMATION',
    caption: `AI won't replace software engineers.\n\nBut an engineer who integrates custom AI automations into real business workflows will replace an entire legacy agency.\n\nWe build systems that automate lead replies and data sync in under 20s.\n\n#AIAutomation #SoftwareEngineering`
  },

  // Day 2 - Nov 15
  {
    slot: 'MORNING',
    pillar: 'CLEAN_CODE',
    caption: `Stop using useEffect to sync related state in React.\n\nIf a value can be computed from existing props or state, derive it during render:\n\nconst fullName = \`\${firstName} \${lastName}\`;\n\nNo extra render cycle. Zero synchronization bugs.\n\n#React #Frontend #CleanCode`
  },
  {
    slot: 'EVENING',
    pillar: 'WEB_CONVERSION',
    caption: `A 1-second delay in page load time costs a business 7% of its conversions.\n\nSpeed isn't just a technical metric; it is pure revenue.\n\nIf your landing page takes 5+ seconds to open on mobile, you are throwing ad money away.\n\n#WebPerformance #VeltrixHub #SEO`
  },

  // Day 3 - Nov 16
  {
    slot: 'MORNING',
    pillar: 'TYPESCRIPT',
    caption: `TypeScript in production:\n\nStop reaching for 'any' when you are in a rush.\n\nUse 'unknown' with a custom type guard instead. It forces you to validate data shapes safely without disabling compiler protection.\n\nYour future self will thank you.\n\n#TypeScript #WebDev`
  },
  {
    slot: 'EVENING',
    pillar: 'AI_PIPELINES',
    caption: `Most businesses don't need another generic ChatGPT prompt.\n\nThey need deterministic AI workflows:\n1. Ingest customer inquiry\n2. Query DB via API\n3. Deliver tailored quote to WhatsApp in 15 seconds\n\nThat is how modern SMEs scale.\n\n#VeltrixHub #Automation`
  },

  // Day 4 - Nov 17
  {
    slot: 'MORNING',
    pillar: 'LEARN_WEB_DEV',
    caption: `How to escape tutorial hell in 3 steps:\n\n1. Stop watching 10-hour build videos\n2. Pick 1 real-world project (e.g. invoice builder)\n3. Build it from scratch without templates. Google each error yourself.\n\nStruggle is where real learning happens.\n\n#100DaysOfCode #LearnInPublic`
  },
  {
    slot: 'EVENING',
    pillar: 'MOBILE_DEV',
    caption: `React Native with the New Architecture and Hermes engine is incredible.\n\n60 FPS animations, near-instant startup, and 85% shared code across iOS and Android.\n\nFor most startups, building two separate native apps is financial waste.\n\n#ReactNative #MobileAppDev`
  },

  // Day 5 - Nov 18
  {
    slot: 'MORNING',
    pillar: 'FRONTEND_ARCHITECTURE',
    caption: `Junior engineers debate frameworks.\nSenior engineers debate architecture.\nStaff engineers and founders focus on user experience and business outcomes.\n\nThe higher you climb, the simpler your solutions become.\n\n#SoftwareEngineering #TechCareer`
  },
  {
    slot: 'EVENING',
    pillar: 'CLIENT_VALUE',
    caption: `Your customers don't care what tech stack you used.\n\nThey care if:\n1. The page loads in under 2 seconds\n2. What you sell is obvious in 5 seconds\n3. The contact/buy button works in 1 tap\n\nClarity beats complexity every time.\n\n#WebDesign #ConversionRate`
  },

  // Day 6 - Nov 19
  {
    slot: 'MORNING',
    pillar: 'LEARN_ROADMAP',
    caption: `If I had to learn web development from zero in 2026:\n\nMonth 1: HTML, CSS & Flexbox layout\nMonth 2: Pure JavaScript & DOM manipulation\nMonth 3: React & TypeScript\nMonth 4: Build 3 fullstack CRUD apps\n\nDon't jump between 10 frameworks. Master fundamentals.\n\n#CodeNewbie`
  },
  {
    slot: 'EVENING',
    pillar: 'AI_COSTS',
    caption: `Building AI apps? How to avoid a $3,000 OpenAI bill:\n\n1. Cache repeated prompts with Redis\n2. Use smaller models (gpt-4o-mini) for classification\n3. Enforce strict JSON schema response mode\n\nShip smart, ship lean.\n\n#AI #TechInAfrica #WebDev`
  },

  // Day 7 - Nov 20
  {
    slot: 'MORNING',
    pillar: 'CUSTOM_HOOKS',
    caption: `When should you write a custom React hook?\n\nNot just for code reuse. Write a custom hook to isolate complex stateful logic from your UI rendering.\n\nYour UI components should read like clean declarative templates, not backend controllers.\n\n#ReactJS #CleanCode`
  },
  {
    slot: 'EVENING',
    pillar: 'MOBILE_PWA',
    caption: `Before you spend $10,000 building a mobile app, ask yourself:\n\nDoes your product really need bluetooth, background audio, or push tokens?\n\nIf not, a high-performance PWA gets you to market in 2 weeks for a fraction of the cost.\n\n#StartupTips #MobileDev`
  },

  // Day 8 - Nov 21
  {
    slot: 'MORNING',
    pillar: 'GET_HIRED',
    caption: `Want to get hired as a frontend engineer? Stop building to-do apps.\n\nBuild one polished SaaS dashboard with:\n• User authentication\n• Dark/light theme\n• Data visualization charts\n• Responsive mobile UI\n\nEmployers want proof you can ship products.\n\n#WebDev #TechJobs`
  },
  {
    slot: 'EVENING',
    pillar: 'MOBILE_FIRST_REALITY',
    caption: `Designers design on a 4K MacBook.\nReal customers visit on a $90 smartphone with a weak 3G connection in traffic.\n\nIf your web app isn't tested on slow networks and budget devices, it isn't production ready.\n\n#Frontend #MobileFirst #VeltrixHub`
  },

  // Day 9 - Nov 22
  {
    slot: 'MORNING',
    pillar: 'STATE_MANAGEMENT',
    caption: `You probably don't need Redux or Zustand for your next project.\n\n90% of app state is server cache (use React Query or SWR). The remaining 10% is local component state.\n\nStop over-engineering client stores before you have data.\n\n#React #WebDevelopment`
  },
  {
    slot: 'EVENING',
    pillar: 'FOUNDER_LESSON',
    caption: `What building Veltrix Hub taught me as a Frontend Engineer:\n\nWriting clean code is only 50% of the job. The other 50% is understanding business problems, meeting deadlines, and delivering software that makes clients money.\n\nEngineers who get business win.\n\n#BuildInPublic`
  },

  // Day 10 - Nov 23
  {
    slot: 'MORNING',
    pillar: 'DEBUGGING',
    caption: `Senior frontend debugging tip:\n\nBefore you spend 3 hours guessing why a component isn't updating, inspect your Network tab first, then React DevTools Profiler.\n\nData flow bugs are almost always upstream from where the UI breaks.\n\n#Debugging #ReactJS`
  },
  {
    slot: 'EVENING',
    pillar: 'CHATBOT_AI',
    caption: `Why most website chatbots fail:\n\nThey ask visitors for an email, send a generic 'we will be in touch', and reply 2 days later.\n\nModern AI chatbots connect to live WhatsApp pipelines and answer product queries in 10 seconds.\n\nSpeed closes deals.\n\n#AIAutomation`
  },

  // Day 11 - Nov 24
  {
    slot: 'MORNING',
    pillar: 'ACCESSIBILITY',
    caption: `Web accessibility (a11y) isn't extra work; it's professional craft.\n\nSemantic HTML tags (<button>, <nav>, <main>) give you keyboard navigation and screen reader support for free.\n\nStop turning <div> tags into clickable buttons.\n\n#WebDev #Frontend`
  },
  {
    slot: 'EVENING',
    pillar: 'ECOMMERCE_CONVERSION',
    caption: `3 reasons e-commerce carts get abandoned:\n\n1. Surprise shipping fees at the last step\n2. Mandatory account creation before checkout\n3. Cluttered checkout forms that lag on mobile\n\nFrictionless checkout = immediate revenue growth.\n\n#Ecommerce #WebDesign`
  },

  // Day 12 - Nov 25
  {
    slot: 'MORNING',
    pillar: 'CSS_MODERN',
    caption: `Modern CSS in 2026 is insanely powerful:\n\n• CSS Grid subgrid for nested alignments\n• :has() selector for parent styling\n• Container queries for component-level responsiveness\n\nYou need far less JavaScript for layout than you did 3 years ago.\n\n#CSS #WebDev`
  },
  {
    slot: 'EVENING',
    pillar: 'AGENCY_DELIVERY',
    caption: `How to price software projects as an engineer or agency:\n\nNever charge by the hour. Clients don't buy hours; they buy an outcome.\n\nA checkout system built in 5 days that handles $100K in sales is worth 10x more than slow work.\n\nCharge for value delivered.\n\n#FreelanceDev`
  },

  // Day 13 - Nov 26
  {
    slot: 'MORNING',
    pillar: 'BUNDLE_OPTIMIZATION',
    caption: `How to cut your React bundle size in half:\n\n1. Code-split heavy routes with React.lazy()\n2. Audit your imports (don't import the entire icon library)\n3. Replace moment.js with date-fns or native Intl API\n\nFaster downloads = happier users.\n\n#Performance #React`
  },
  {
    slot: 'EVENING',
    pillar: 'CRM_AUTOMATION',
    caption: `Managing client leads on WhatsApp alone is a recipe for missed deals.\n\nSync your WhatsApp inquiries into an automated CRM pipeline so no customer slips through the cracks.\n\nAutomation gives small teams the leverage of a 20-person company.\n\n#Automation #VeltrixHub`
  },

  // Day 14 - Nov 27
  {
    slot: 'MORNING',
    pillar: 'CODE_REVIEW',
    caption: `In code reviews, look for these 3 red flags:\n\n1. Hardcoded magic numbers without named constants\n2. Prop drilling through 5 levels of components\n3. Functions that do 4 different things\n\nReadable code > clever code.\n\n#CleanCode #SoftwareEngineering`
  },
  {
    slot: 'EVENING',
    pillar: 'TRUST_SIGNALS',
    caption: `Before a customer pays for high-ticket services online, they look for 3 things:\n\n1. Real case studies and client results\n2. Verifiable business identity (CAC registration / registered domain)\n3. Frictionless direct communication\n\nTrust closes deals.\n\n#DigitalStrategy`
  },

  // Day 15 - Nov 28
  {
    slot: 'MORNING',
    pillar: 'ENGINEERING_SUMMARY',
    caption: `The frontend engineer skill stack for 2026:\n\n1. TypeScript & React / Next.js\n2. Performance & Web Vitals optimization\n3. REST & GraphQL API design\n4. AI agent & LLM integrations\n5. Product and business empathy\n\nMaster these and you will never lack opportunities.\n\n#FrontendDev`
  },
  {
    slot: 'EVENING',
    pillar: 'VELTRIX_VISION',
    caption: `At Veltrix Hub, we build digital solutions that actually move businesses forward.\n\nHigh-converting websites • Mobile applications • Intelligent AI workflows • Brand systems.\n\nBuilding for real growth. Let's make it happen.\n\n👉 https://veltrixhub.ng\n\n#VeltrixHub #TechNigeria`
  }
];

async function schedule30XTweets() {
  console.log('=== Scheduling 30 Dedicated X (Twitter) Tweets for @AbiodunBuilds ===');

  const org = await prisma.organization.findFirst({
    where: { slug: 'veltrix-hub' }
  });

  if (!org) {
    throw new Error('Veltrix Hub organization not found!');
  }

  // Find X SocialPage
  const xPage = await prisma.socialPage.findFirst({
    where: {
      organizationId: org.id,
      pageId: 'AbiodunBuilds'
    }
  });

  if (!xPage) {
    throw new Error('X Profile @AbiodunBuilds not found! Please connect it first.');
  }

  console.log(`Target 𝕏 Page: @${xPage.pageId} (${xPage.pageName}) [ID: ${xPage.id}]`);

  // Start date: Nov 14, 2026
  const startDate = new Date('2026-11-14T00:00:00.000Z');

  let scheduledCount = 0;

  for (let i = 0; i < X_TWEETS_BATCH.length; i++) {
    const item = X_TWEETS_BATCH[i];
    const dayIndex = Math.floor(i / 2); // 0 to 14 (15 days)
    const isMorning = item.slot === 'MORNING';

    // Calculate exact scheduled timestamp:
    // WAT is UTC+1.
    // 09:00 AM WAT = 08:00 UTC
    // 06:00 PM WAT = 17:00 UTC
    const scheduledDate = new Date(startDate);
    scheduledDate.setDate(startDate.getDate() + dayIndex);
    scheduledDate.setUTCHours(isMorning ? 8 : 17, 0, 0, 0);

    // Validate 280-character limit
    const charLen = item.caption.length;
    if (charLen > 280) {
      console.warn(`[WARNING] Tweet ${i + 1} exceeds 280 chars (${charLen} chars)!`);
    }

    const post = await prisma.scheduledPost.create({
      data: {
        organizationId: org.id,
        socialPageId: xPage.id,
        caption: item.caption,
        mediaUrls: [],
        scheduledFor: scheduledDate,
        status: 'SCHEDULED'
      }
    });

    scheduledCount++;
    console.log(`[Tweet ${scheduledCount}/30] Scheduled: ${scheduledDate.toISOString()} | Slot: ${item.slot} (${charLen} chars) -> ID: ${post.id}`);
  }

  console.log(`✅ Successfully scheduled ${scheduledCount} dedicated 𝕏 tweets for @AbiodunBuilds in MongoDB Atlas!`);
}

schedule30XTweets()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
