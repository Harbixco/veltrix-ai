import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  Sun,
  Moon,
  Calendar as CalendarIcon,
  Clock,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Facebook,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Image as ImageIcon,
  Sparkles,
  Share2,
  Copy,
  MessageSquare,
  Eye,
  Check,
  X,
  Download,
  Maximize2,
  Key,
  RefreshCw
} from 'lucide-react';

// Official X Vector Logo Component
const XLogo: React.FC<{ className?: string }> = ({ className = 'w-3 h-3' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export interface ScheduledPost {
  id: string;
  socialPageId: string;
  caption: string;
  mediaUrls: string[];
  scheduledFor: string;
  status: 'SCHEDULED' | 'PUBLISHED' | 'FAILED';
  channel: 'FACEBOOK' | 'TWITTER';
  slotType?: 'MORNING' | 'EVENING';
  topicBadge?: string;
  formatType?: 'RED_BACKGROUND' | 'PICTURE' | 'TEXT_ONLY';
  firstComment?: string;
  isManual?: boolean;
  carePillars?: string;
  page?: {
    pageName: string;
    pageId: string;
  };
}

export interface PublishedPost {
  id: string;
  socialPageId: string;
  externalPostId?: string;
  pageName: string;
  caption: string;
  mediaUrls: string[];
  contentPillar: string;
  publishedAt: string;
  channel: 'FACEBOOK' | 'TWITTER';
  permalinkUrl?: string;
  metrics?: {
    reach: number;
    engagementRate: number;
    reactions: number;
    comments?: number;
    shares?: number;
  };
}

// ============================================================================
// DYNAMIC FLYER RESOLVER
// Guarantees that every post always renders its OWN distinct topic-matched flyer,
// even if an older database record or cache references a generic template.
// ============================================================================
export function resolveFlyerForPost(
  post: { caption?: string; mediaUrls?: string[]; channel?: string; page?: { pageId?: string } } | null | undefined
): string {
  if (!post) return '';
  // Twitter posts NEVER have flyers (strictly text-only)
  if (post.channel === 'TWITTER' || post.page?.pageId === 'AbiodunBuilds') {
    return '';
  }
  // Only return manually attached/uploaded flyer from mediaUrls
  if (post.mediaUrls && Array.isArray(post.mediaUrls) && post.mediaUrls.length > 0 && post.mediaUrls[0]) {
    const url = post.mediaUrls[0];
    // Ignore legacy auto-generated flyer paths
    if (url.includes('/designs/flyers/') || url.includes('veltrix-design')) {
      return '';
    }
    return url;
  }
  return '';
}


/**
 * Compresses and scales an image file down to max 1080x1080 at 82% JPEG quality.
 * Prevents localStorage quota errors and avoids Vercel 4.5MB payload limits.
 */
export function compressImageFile(file: File, maxWidth = 1080, maxHeight = 1080, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        resolve(e.target?.result as string);
      };
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Generates and downloads a crisp 1080x1080 high-resolution solid red background text graphic
 * matching the Facebook red status template (pure #d91b42 background with bold white centered text).
 */
export function downloadRedCardImage(text: string, filename = 'veltrix-red-card') {
  if (typeof window === 'undefined') return;
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Solid vibrant red canvas
  ctx.fillStyle = '#d91b42';
  ctx.fillRect(0, 0, 1080, 1080);

  // Bold white typography
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 50px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Word wrap for readability
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  const maxWidth = 900;
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  const lineHeight = 74;
  const totalHeight = lines.length * lineHeight;
  let startY = (1080 - totalHeight) / 2 + lineHeight / 2;

  for (const line of lines) {
    ctx.fillText(line, 540, startY);
    startY += lineHeight;
  }

  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ============================================================================
// CURATED MASTER CONTENT CALENDAR FOR NOVEMBER 2026
// All posts start clean with mediaUrls: [] (manual upload for Facebook, text-only for Twitter)
// ============================================================================
const INITIAL_CURATED_SCHEDULED: ScheduledPost[] = [
  // --- SATURDAY, NOV 14 ---
  {
    id: 'sched_nov14_x1',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'REACT PERFORMANCE',
    carePillars: 'Curiosity + Alignment',
    caption: 'React performance tip: Most lag is not caused by missing useMemo.\n\nIt is caused by lifting state higher than it needs to be.\n\nKeep state local. When state stays near the component that actually uses it, 90% of unnecessary re-renders vanish.',
    mediaUrls: [],
    scheduledFor: '2026-11-14T08:00:00.000Z',
    status: 'PUBLISHED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov14_x2',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'AI AUTOMATION',
    carePillars: 'Reliability + Emotion',
    caption: 'AI will not replace software engineers.\n\nBut an engineer who builds custom AI automations will replace an entire legacy agency.\n\nWe connect LLMs directly to client databases and WhatsApp to qualify leads in under 20 seconds.',
    mediaUrls: [],
    scheduledFor: '2026-11-14T18:00:00.000Z',
    status: 'PUBLISHED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },

  // --- SUNDAY, NOV 15 (TODAY - PUBLISHED LIVE) ---
  {
    id: 'sched_nov15_x1',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'CLEAN ARCHITECTURE',
    carePillars: 'Curiosity + Alignment',
    caption: 'Stop using useEffect to sync related state.\n\nIf a value can be computed from existing props or state, derive it during render.\n\nNo extra render cycle. Zero synchronization bugs.',
    mediaUrls: [],
    scheduledFor: '2026-11-15T08:00:00.000Z',
    status: 'PUBLISHED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov15_x2',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'AI WORKFLOW ARCHITECTURE',
    carePillars: 'Reliability + Emotion',
    caption: 'Most businesses do not need another generic ChatGPT prompt.\n\nThey need deterministic AI workflows:\n1. Ingest lead inquiry\n2. Query inventory & pricing via API\n3. Deliver tailored quotation in 15 seconds\n\nThat is how modern businesses scale.',
    mediaUrls: [],
    scheduledFor: '2026-11-15T18:00:00.000Z',
    status: 'PUBLISHED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-16 MORNING FACEBOOK ---
  {
    id: 'sched_2026_11_16_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "REPETITIVE TASKS",
    carePillars: "Curiosity + Alignment",
    caption: "If your business takes more than 15 minutes to reply to a WhatsApp inquiry, you are quietly handing your paying customers over to your competitors.",
    firstComment: "We build custom AI assistants that answer inquiries, qualify leads, and handle pricing on WhatsApp in under 20 seconds. Test a live demo with Veltrix Hub here:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-nov16.jpg"],
    scheduledFor: '2026-11-16T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-16 MORNING TWITTER ---
  {
    id: 'sched_2026_11_16_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "REPETITIVE TASKS",
    carePillars: "Curiosity + Alignment",
    caption: "If your business takes 15 minutes to reply to an inquiry, you are giving away deals to faster competitors.\n\nSpeed is not just customer service. Speed is conversion rate optimization.\n\nAutomate the first response.",
    mediaUrls: [],
    scheduledFor: '2026-11-16T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-16 EVENING FACEBOOK ---
  {
    id: 'sched_2026_11_16_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "CUSTOMER GHOSTING SOLVED",
    carePillars: "Reliability + Emotion",
    caption: "Customers ask \"How much?\" and disappear. Here is the real reason:\n\nWhen a customer asks for your price and gets just a bare number with no context, they compare you solely on cheapness.\n\nIf your response takes more than fifteen minutes, they have already messaged three of your competitors.\n\nAnd if you do not follow up within twenty-four hours, the lead is permanently dead.\n\nHere is what changes the outcome:\n\n1. Never quote a bare number alone. Explain what is included, who it is for, and the result it protects before stating the price.\n2. Cut your response window from twenty minutes to twenty seconds. Fast, structured answers build immediate credibility.\n3. Keep the conversation alive with one clarifying question instead of waiting for them to reply.\n\nAt Veltrix Hub, we build digital infrastructure and automated WhatsApp systems that reply in seconds, position your value before naming price, and nurture warm inquiries so you stop losing ready buyers to delay.",
    firstComment: "Send us your current website or catalog link on WhatsApp and we will review your inquiry response flow:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-nov16-how-much-disappear.jpg"],
    scheduledFor: '2026-11-16T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-16 EVENING TWITTER ---
  {
    id: 'sched_2026_11_16_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "CUSTOMER GHOSTING SOLVED",
    carePillars: "Reliability + Emotion",
    caption: "When a prospect asks \"How much?\" and you take twenty minutes to reply, they have already messaged three competitors.\n\nFast response time is not just customer service. It is how you win the sale.\n\nAutomate the first response or lose the customer.",
    mediaUrls: ["/designs/executive/flyer-nov16-how-much-disappear.jpg"],
    scheduledFor: '2026-11-16T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-17 MORNING FACEBOOK ---
  {
    id: 'sched_2026_11_17_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "DATABASE LEVERAGE",
    carePillars: "Curiosity + Alignment",
    caption: "Your past customer phone numbers are the most valuable asset you own. Most business owners never follow up once.",
    firstComment: "We set up automated customer retention and repeat-order workflows for your business. Chat directly with Veltrix Hub:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-nov17.jpg"],
    scheduledFor: '2026-11-17T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-17 MORNING TWITTER ---
  {
    id: 'sched_2026_11_17_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "DATABASE LEVERAGE",
    carePillars: "Curiosity + Alignment",
    caption: "Your past customer database is worth more than next month's ad budget.\n\nAutomate your retention workflows before spending more on customer acquisition.",
    mediaUrls: [],
    scheduledFor: '2026-11-17T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-17 EVENING FACEBOOK ---
  {
    id: 'sched_2026_11_17_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "THE WRONG ONLINE PROBLEM",
    carePillars: "Curiosity + Alignment",
    caption: "Most business owners are solving the wrong online problem. Here is how to spot it:\n\nWhen sales stall, the immediate instinct is to buy more ads, post three more times a day, or change flyer designs.\n\nThat treats the symptom while ignoring the disease.\n\nIn eight out of ten business audits, visibility is not the bottleneck. Friction is:\n\n1. Slow load times on mobile devices. If your page takes five seconds to open on a customer's phone, 60% of your ad spend never sees your offer.\n2. Complicated checkout pathways. Forcing customers through three different forms just to make an inquiry causes silent drop-offs.\n3. Zero instant response mechanism. Inquiries that wait two hours for an answer go cold permanently.\n\nFix your conversion foundation before spending another naira on ads.\n\nAt Veltrix Hub, we audit and rebuild your digital funnel so that every visitor who arrives finds a fast, clear, and trustworthy path to buy.",
    firstComment: "Audit your conversion funnel with Veltrix Hub today. Reach our engineering team on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-nov17-wrong-problem.jpg"],
    scheduledFor: '2026-11-17T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-17 EVENING TWITTER ---
  {
    id: 'sched_2026_11_17_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "THE WRONG ONLINE PROBLEM",
    carePillars: "Curiosity + Alignment",
    caption: "Most businesses do not have a traffic problem. They have a conversion leak.\n\nSlow mobile pages and delayed replies burn your marketing budget.\n\nFix the foundation first.",
    mediaUrls: ["/designs/executive/flyer-nov17-wrong-problem.jpg"],
    scheduledFor: '2026-11-17T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-18 MORNING FACEBOOK ---
  {
    id: 'sched_2026_11_18_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "FRICTIONLESS CONVERSION",
    carePillars: "Curiosity + Alignment",
    caption: "Every extra field in your checkout form drops completed purchases by 20 percent. Keep it under 3 fields.",
    firstComment: "Need a streamlined checkout or payment flow for your products? Speak with our team on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-nov18.jpg"],
    scheduledFor: '2026-11-18T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-18 MORNING TWITTER ---
  {
    id: 'sched_2026_11_18_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "FRICTIONLESS CONVERSION",
    carePillars: "Curiosity + Alignment",
    caption: "Every unnecessary field in your checkout form cuts conversions.\n\nName, phone number, delivery address. That is all you need to close the deal.",
    mediaUrls: [],
    scheduledFor: '2026-11-18T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-18 EVENING FACEBOOK ---
  {
    id: 'sched_2026_11_18_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "THE 10-SECOND TEST",
    carePillars: "Curiosity + Alignment",
    caption: "Can a new customer understand what you sell in 10 seconds?\n\nHand your phone to someone who does not know your business. Open your homepage. Take it back after ten seconds.\n\nAsk them two simple questions:\n1. What does this business sell?\n2. What is the very next step I should take?\n\nIf they hesitate, your website is actively costing you revenue every day.\n\nVisitors do not read online; they scan. If your headline uses poetic agency jargon instead of clear value, they bounce to Google and find your competitor.\n\nClarity always beats cleverness in digital commerce.\n\nAt Veltrix Hub, we build web architectures that state your exact value proposition in five seconds and guide ready buyers straight to checkout.",
    firstComment: "Send us your website URL on WhatsApp and we will run our 10-second conversion audit for you:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-nov18-ten-seconds.jpg"],
    scheduledFor: '2026-11-18T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-18 EVENING TWITTER ---
  {
    id: 'sched_2026_11_18_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "THE 10-SECOND TEST",
    carePillars: "Curiosity + Alignment",
    caption: "If a first-time visitor cannot understand what you sell in 10 seconds, you do not have an aesthetic issue.\n\nYou have a positioning leak.\n\nClarity beats cleverness every single time.",
    mediaUrls: ["/designs/executive/flyer-nov18-ten-seconds.jpg"],
    scheduledFor: '2026-11-18T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-19 MORNING FACEBOOK ---
  {
    id: 'sched_2026_11_19_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "SPEED AS REVENUE",
    carePillars: "Curiosity + Alignment",
    caption: "A 1-second delay in page load time costs a business 7% of its customer inquiries. Speed is not a feature. Speed is revenue.",
    firstComment: "We optimize website load times to under 1.5 seconds on mobile networks. Get your performance audit:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-nov19.jpg"],
    scheduledFor: '2026-11-19T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-19 MORNING TWITTER ---
  {
    id: 'sched_2026_11_19_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "POSITIONING / INTRO",
    carePillars: "Curiosity + Alignment",
    caption: "Most developers focus only on *how* to write code.\n\nI focus on *why* that code needs to exist.\n\nHi, I\u2019m Abiodun \ud83d\udc4b \u2014 Frontend Engineer working with React, TypeScript, and modern web UX.\n\nI specialize in turning raw concepts into high-performance, user-friendly digital products that actually solve real problems.\n\nOver the next 28 days, I\u2019m documenting:\n\u2022 Practical React & TypeScript patterns\n\u2022 Building intuitive UI for non-technical users\n\u2022 Bridging engineering decisions with business outcomes\n\nIf you\u2019re a developer, founder, or hiring manager, let's connect. Drop a comment below!",
    mediaUrls: [],
    scheduledFor: '2026-11-19T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-19 EVENING FACEBOOK ---
  {
    id: 'sched_2026_11_19_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "3 DESIGN MISTAKES EXPOSED",
    carePillars: "Curiosity + Reliability",
    caption: "3 website design mistakes that frustrate potential customers:\n\n1. Hidden contact details. If a prospect has to click through three menus to find your WhatsApp number or physical office address, they will simply open Google and find another vendor.\n2. Uncompressed high-resolution images. Uploading raw five-megabyte camera photos slows mobile load times to a crawl. On cellular data, customers abandon the page within four seconds.\n3. Vague call-to-action buttons. Buttons that say \"Learn More\" generate hesitation. Buttons that say \"Request Quote on WhatsApp\" generate action.\n\nYour website is an active digital salesperson. When you remove friction, customer inquiries naturally surge.\n\nAt Veltrix Hub, we design fast, ultra-responsive platforms engineered strictly for credibility, speed, and sales generation.",
    firstComment: "Upgrade your business website to high-conversion digital infrastructure. Message Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-nov19-design-mistakes.jpg"],
    scheduledFor: '2026-11-19T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-19 EVENING TWITTER ---
  {
    id: 'sched_2026_11_19_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "ENGINEERING MINDSET",
    carePillars: "Reliability + Emotion",
    caption: "Writing code is the easiest part of software engineering.\n\nUnderstanding *why* you are writing it takes real maturity.\n\nJunior mindset: \"How do I build this feature?\"\n\nSenior mindset:\n1. Who actually needs this?\n2. What business or user bottleneck does it solve?\n3. What happens if this fails in production?\n4. Can the next developer maintain this in 6 months?\n\nCode is cheap. Context and problem-solving are expensive.\n\nWhich question do you ask first before writing a single line of code?",
    mediaUrls: [],
    scheduledFor: '2026-11-19T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-20 MORNING FACEBOOK ---
  {
    id: 'sched_2026_11_20_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "SYSTEMS OVER GUESSWORK",
    carePillars: "Curiosity + Alignment",
    caption: "If your business relies on you remembering to send invoices, you do not have a system. You have a stressful job.",
    firstComment: "Automate invoicing, receipts, and order confirmations with Veltrix Hub. Message us on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-nov20.jpg"],
    scheduledFor: '2026-11-20T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-20 MORNING TWITTER ---
  {
    id: 'sched_2026_11_20_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "FRONTEND ENGINEERING",
    carePillars: "Curiosity + Alignment",
    caption: "If a user needs instructions to navigate your app, your frontend failed.\n\nFrontend engineering isn't just about making Figma mockups look pretty in Chrome.\n\nReal frontend engineering happens where 4 things meet:\n\u2022 Accessibility: Everyone can use it without frustration.\n\u2022 Performance: It loads instantly even on poor 3G connections.\n\u2022 Intuitive UX: Zero cognitive load or second-guessing.\n\u2022 Resilient Logic: Errors and edge cases are handled gracefully.\n\nA pretty UI that confuses users is just decoration.\n\nSave this for your next design review \ud83d\udccc",
    mediaUrls: [],
    scheduledFor: '2026-11-20T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-20 EVENING FACEBOOK ---
  {
    id: 'sched_2026_11_20_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "CONFIDENCE OVER PHOTOS",
    carePillars: "Reliability + Emotion",
    caption: "Customers need confidence—not just product photos.\n\nPosting high-resolution pictures of your products is standard practice. Every competitor in your niche does it.\n\nProduct photos answer what you sell. Confidence answers whether you will deliver.\n\nTo turn hesitant scrollers into paying buyers, your digital presence must prove:\n1. Proof of delivery. Show verified customer unboxings, receipts, and real-time tracking confirmations.\n2. Transparent terms. State your return policy, exchange guidelines, and delivery timelines clearly upfront.\n3. Institutional presence. A dedicated website with verified registration shows you are a legitimate corporate entity, not an anonymous account.\n\nConfidence accelerates transactions.\n\nAt Veltrix Hub, we build trust-engineered web platforms and digital verification systems that remove buyer doubt and elevate your business above competitors.",
    firstComment: "Build real credibility for your brand online. Connect with Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-nov20-confidence-not-photos.jpg"],
    scheduledFor: '2026-11-20T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-20 EVENING TWITTER ---
  {
    id: 'sched_2026_11_20_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "BUSINESS & UX",
    carePillars: "Reliability + Emotion",
    caption: "Your customers aren't abandoning your website because of your price.\n\nThey're leaving because your digital experience feels confusing.\n\nWhen someone lands on your site, they decide within 3 seconds:\n\u2022 Can I instantly tell what you do?\n\u2022 Can I find pricing without hunting through menus?\n\u2022 Do I trust you with my credit card?\n\u2022 Is the next step completely obvious?\n\nIf your competitor's site answers these in 3 seconds and yours takes 30, they win the customer.\n\nYour website isn\u2019t a digital business card. It\u2019s your 24/7 sales representative.",
    mediaUrls: [],
    scheduledFor: '2026-11-20T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-21 MORNING FACEBOOK ---
  {
    id: 'sched_2026_11_21_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "API OVER MANUAL WORK",
    carePillars: "Curiosity + Alignment",
    caption: "Copying order details from WhatsApp into an Excel sheet is a waste of human talent. APIs do it in 200 milliseconds.",
    firstComment: "Connect WhatsApp directly to your spreadsheet or CRM. Test custom automations with Veltrix Hub:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-nov21.jpg"],
    scheduledFor: '2026-11-21T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-21 MORNING TWITTER ---
  {
    id: 'sched_2026_11_21_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "REACT BEST PRACTICES",
    carePillars: "Curiosity + Alignment",
    caption: "Stop using `useEffect` to calculate values that can be derived directly.\n\nIt\u2019s the #1 cause of unnecessary re-renders and sync bugs in React.\n\n\u274c DON'T DO THIS:\nconst [items, setItems] = useState([]);\nconst [total, setTotal] = useState(0);\nuseEffect(() => {\n  setTotal(items.reduce((acc, i) => acc + i.price, 0));\n}, [items]);\n\n\u2705 DO THIS INSTEAD:\nconst total = items.reduce((acc, i) => acc + i.price, 0);\n// Or wrap in useMemo only if calculation is computationally heavy\n\nNot everything needs state. Not everything needs an effect.\n\nKeep data flow simple, and your components will stay bug-free.\n\nBookmark this snippet \ud83d\udccc",
    mediaUrls: [],
    scheduledFor: '2026-11-21T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-21 EVENING FACEBOOK ---
  {
    id: 'sched_2026_11_21_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "THE WHATSAPP BOTTLENECK",
    carePillars: "Reliability + Emotion",
    caption: "Stop depending on WhatsApp to carry your whole sales process.\n\nWhatsApp is an extraordinary channel for direct communication and closing warm prospects. But when you force it to serve as your catalog, checkout counter, inventory manager, and payment tracker, it breaks.\n\nHere is the daily breakdown:\n1. You spend hours answering the exact same questions about prices, sizes, and availability.\n2. Prospective buyers message late at night while you sleep and purchase from a faster vendor by morning.\n3. Order details get buried in chat histories, leading to missed shipments and frustrated clients.\n\nThe solution is not working eighteen hours a day. The solution is infrastructure.\n\nPair your WhatsApp with a high-speed catalog website. Let customers browse, select items, and calculate totals automatically, and use WhatsApp purely to confirm the deal.\n\nAt Veltrix Hub, we build integrated web platforms that connect seamlessly to WhatsApp, giving you automated catalog browsing with personal client closing.",
    firstComment: "Eliminate the manual WhatsApp bottleneck. Contact Veltrix Hub to automate your catalog flow:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-nov21-stop-depending-whatsapp.jpg"],
    scheduledFor: '2026-11-21T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-21 EVENING TWITTER ---
  {
    id: 'sched_2026_11_21_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "DEVELOPER GROWTH",
    carePillars: "Reliability + Emotion",
    caption: "Watching 30 hours of tutorials won't make you a software developer.\n\nBuilding 1 project without hand-holding will.\n\nTutorials give a false sense of mastery because someone else already:\n\u2022 Debugged the weird console errors\n\u2022 Structured the folders\n\u2022 Designed the data architecture\n\nReal engineering begins the minute your screen goes red and Google has no direct answer.\n\nTo all devs: What was the breakthrough project that finally pulled you out of tutorial hell?",
    mediaUrls: [],
    scheduledFor: '2026-11-21T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-22 MORNING FACEBOOK ---
  {
    id: 'sched_2026_11_22_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "TRUST ENGINEERING",
    carePillars: "Curiosity + Alignment",
    caption: "A business website without client testimonials is like a restaurant with no customers inside. Social proof creates trust.",
    firstComment: "We build high-converting websites featuring verified reviews and portfolio case studies. Message our team:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-nov22.jpg"],
    scheduledFor: '2026-11-22T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-22 MORNING TWITTER ---
  {
    id: 'sched_2026_11_22_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "PRODUCT & UX",
    carePillars: "Curiosity + Alignment",
    caption: "The most dangerous assumption in tech:\n\n\"It works for me, so it works for the user.\"\n\nAs the developer, you have full context:\n\u2022 You know which button to click first\n\u2022 You know not to double-click submit\n\u2022 You know what happens behind the scenes\n\nYour users don't care about your component tree. They skim, misclick, use poor connections, and expect everything to just work.\n\nBuild for human behavior, not developer ideals.",
    mediaUrls: [],
    scheduledFor: '2026-11-22T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-22 EVENING FACEBOOK ---
  {
    id: 'sched_2026_11_22_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "THE FIRST-TIME VISITOR AUDIT",
    carePillars: "Reliability + Alignment",
    caption: "If you were a first-time visitor, would you trust your own business website?\n\nTake an objective look at your digital presence from the viewpoint of someone who has never heard of you.\n\nDoes your website load within three seconds, or does it hang on a blank screen?\nAre your contact phone numbers, email addresses, and registered CAC details clearly displayed?\nDoes the checkout button take them to a secure, branded payment portal or an ambiguous personal account?\n\nFirst impressions on the internet happen in milliseconds. When doubt enters a customer's mind, they do not ask for clarification; they click the back button.\n\nCredibility is built intentionally through clear typography, fast load speeds, secure certificates, and transparent company policies.\n\nAt Veltrix Hub, we design corporate web platforms that immediately establish institutional authority and position your brand as the obvious choice in your market.",
    firstComment: "Get an executive digital presence that earns customer confidence instantly. Message Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-nov22-first-time-visitor.jpg"],
    scheduledFor: '2026-11-22T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-22 EVENING TWITTER ---
  {
    id: 'sched_2026_11_22_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "BUSINESS & CONVERSION",
    carePillars: "Reliability + Emotion",
    caption: "The #1 conversion killer on 90% of business websites:\n\nNo clear next step.\n\nA visitor lands on your homepage. They scroll. They read. And then...\n\nNothing.\n\nAre they supposed to:\n\u2022 Book a 15-min discovery call?\n\u2022 Request an instant quote?\n\u2022 Add the product to cart?\n\u2022 Sign up for a free trial?\n\nIf you don't tell visitors exactly what action to take next, they take the easiest option available: closing the tab.\n\nEvery single page needs one clear, prominent Primary CTA.",
    mediaUrls: [],
    scheduledFor: '2026-11-22T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-23 MORNING FACEBOOK ---
  {
    id: 'sched_2026_11_23_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "MOBILE FRICTION",
    carePillars: "Curiosity + Alignment",
    caption: "If a customer has to pinch and zoom to read your price list on their phone, they have already decided not to buy.",
    firstComment: "We build clean, responsive mobile web platforms with direct WhatsApp checkout. Audit your mobile site with Veltrix Hub:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-nov23.jpg"],
    scheduledFor: '2026-11-23T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-23 MORNING TWITTER ---
  {
    id: 'sched_2026_11_23_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "TYPESCRIPT",
    carePillars: "Curiosity + Alignment",
    caption: "TypeScript isn't just about catching typos in your code.\n\nIt\u2019s the best documentation your codebase will ever have.\n\nWhen you write strict, expressive types:\n\u2022 Onboarding new engineers takes days, not weeks\n\u2022 Refactoring a 500-line component is no longer terrifying\n\u2022 Your IDE autocompletes complex API payloads effortlessly\n\u2022 Null and undefined bugs are resolved before git push\n\nGood types turn implicit guesses into rock-solid guarantees.\n\nTypeScript isn't overhead\u2014it's production insurance.\n\nSave this for your team \ud83d\udccc",
    mediaUrls: [],
    scheduledFor: '2026-11-23T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-23 EVENING FACEBOOK ---
  {
    id: 'sched_2026_11_23_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "THE REAL COST OF A CHEAP WEBSITE",
    carePillars: "Reliability + Alignment",
    caption: "A cheap website can become costly if customers struggle to use it.\n\nWhen hiring a web designer, cutting corners on price often looks like a smart expense saving. But a website is not a stationary expense. It is your primary digital storefront.\n\nHere is what a poorly built website actually costs you:\n\n1. Lost clients from broken mobile layouts. If buttons overlap or navigation menus refuse to close on an iPhone or Android, visitors leave immediately. You rarely see the sales you lost.\n2. Security vulnerabilities and zero backups. Cheap setups often skip SSL configuration, database backups, and software updates, leaving your business exposed to downtime and crashes.\n3. Rebuild expenses. Fixing structural code flaws, slow load speeds, and bad navigation six months down the line usually costs twice as much as building it properly from the start.\n\nBuild your business infrastructure on solid foundations. At Veltrix Hub, we engineer custom, robust web platforms designed for speed, security, and measurable client acquisition.",
    firstComment: "Do not let poor code cost you ready buyers. Talk to our engineering team on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-nov23-cheap-website-costly.jpg"],
    scheduledFor: '2026-11-23T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-23 EVENING TWITTER ---
  {
    id: 'sched_2026_11_23_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "CAREER STRATEGY",
    carePillars: "Reliability + Emotion",
    caption: "Stop collecting certificates like Pok\u00e9mon cards.\n\nBuild 2 production-grade applications instead.\n\nHiring managers don't care how many 40-hour course completion badges are on your LinkedIn profile.\n\nThey want to see that you can:\n1. Build an app that solves an actual user problem\n2. Defend your technical decisions and trade-offs\n3. Handle network errors, empty states, and loading UI\n4. Write clean, maintainable code with clear commit messages\n\nOne live, deployed app with clean architecture beats 10 certificates every single time.",
    mediaUrls: [],
    scheduledFor: '2026-11-23T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-24 MORNING FACEBOOK ---
  {
    id: 'sched_2026_11_24_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "CLARITY OVER CLEVERNESS",
    carePillars: "Curiosity + Alignment",
    caption: "Poetic taglines sound smart in meetings, but plain language makes sales on the internet.",
    firstComment: "We engineer website architectures that state your value in 5 seconds and convert visitors immediately. Message our team:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-nov24.jpg"],
    scheduledFor: '2026-11-24T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-24 MORNING TWITTER ---
  {
    id: 'sched_2026_11_24_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "WEB PERFORMANCE",
    carePillars: "Curiosity + Alignment",
    caption: "Nobody cares how clean your React architecture is if your website takes 5 seconds to load.\n\nWith every extra second of loading time:\n\u2022 Bounce rates climb by 32%\n\u2022 Conversion rates drop sharply\n\u2022 Mobile users on weak networks abandon your app\n\nPerformance is not a 'nice-to-have' polish step before launch. It starts on Day 1:\n\u2022 Next-gen image formats & lazy loading\n\u2022 Tree-shaking heavy npm dependencies\n\u2022 Code-splitting dynamic routes\n\u2022 Preventing Layout Shift (CLS)\n\nFast feels modern. Slow feels broken.",
    mediaUrls: [],
    scheduledFor: '2026-11-24T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-24 EVENING FACEBOOK ---
  {
    id: 'sched_2026_11_24_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "CONVERSION LEAKS EXPLAINED",
    carePillars: "Curiosity + Reliability",
    caption: "Why do visitors leave a website without taking the next step?\n\nYou have spent money running ads and promoting your business online. Visitors land on your website, but ninety-five out of a hundred exit without making an inquiry.\n\nHere are the three primary conversion leaks:\n\n1. Ambiguous value propositions. Within the first screen, the visitor cannot tell whether you service their specific location, what problem you solve, or why you are better than alternatives.\n2. Hidden pricing benchmarks. When prices are completely absent, customers assume you are either too expensive or that you will quote arbitrary prices based on who is asking.\n3. Friction-heavy action pathways. Demanding an account registration, lengthy form completion, or forcing users through multiple pages to ask a question kills buyer momentum.\n\nPlug these leaks with clear headlines, upfront pricing indicators, and direct WhatsApp contact channels.\n\nAt Veltrix Hub, our technical team builds conversion-optimized web applications that guide incoming traffic directly toward confirmed sales.",
    firstComment: "Audit and plug your conversion leaks today. Connect with Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-nov24-visitors-leave-website.jpg"],
    scheduledFor: '2026-11-24T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-24 EVENING TWITTER ---
  {
    id: 'sched_2026_11_24_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "COMMUNITY / DISCUSSION",
    carePillars: "Reliability + Emotion",
    caption: "If you could travel back to Day 1 of your software engineering journey, what would you change?\n\nWould you:\n1. Skip tutorial hell and start building right away?\n2. Master core JavaScript before touching any framework?\n3. Find a mentor and join dev communities earlier?\n4. Focus heavily on DSA and computer science fundamentals?\n\nIf I could rewind, I would have spent way more time learning how browsers render and handle the event loop before diving into state libraries.\n\nDrop your #1 lesson below \ud83d\udc47",
    mediaUrls: [],
    scheduledFor: '2026-11-24T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-25 MORNING FACEBOOK ---
  {
    id: 'sched_2026_11_25_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "THE 5-SECOND RULE",
    carePillars: "Curiosity + Alignment",
    caption: "Your website has only 5 seconds to answer: What do you sell? Who is it for? And how do I buy it?",
    firstComment: "Get a clear, conversion-tested website for your business. Chat with Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-nov25.jpg"],
    scheduledFor: '2026-11-25T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-25 MORNING TWITTER ---
  {
    id: 'sched_2026_11_25_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "SENIOR ENGINEERING",
    carePillars: "Curiosity + Alignment",
    caption: "Senior engineers aren't walking documentation libraries.\n\nThey are master problem-solvers.\n\nWhat actually separates top developers from average ones:\n\u2022 Breaking complex, ambiguous requests into simple tasks\n\u2022 Reading official RFCs and source code instead of guessing\n\u2022 Writing code so simple that a junior can maintain it tomorrow\n\u2022 Explaining technical trade-offs to business stakeholders\n\u2022 Debugging with discipline, not superstition\n\nFrameworks come and go every 2 years. Problem-solving compound for a lifetime.",
    mediaUrls: [],
    scheduledFor: '2026-11-25T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-25 EVENING FACEBOOK ---
  {
    id: 'sched_2026_11_25_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "MAKING FIRST IMPRESSIONS COUNT",
    carePillars: "Curiosity + Alignment",
    caption: "Your website has only a moment to make a clear first impression.\n\nOnline visitors do not give second chances. Research shows users form an opinion about your business within fifty milliseconds of landing on your page.\n\nThat opinion determines whether they explore your services or immediately hit the back button.\n\nWhat drives that rapid first impression?\n1. Visual hierarchy and clean typography. Crammed layouts and mismatched fonts communicate amateur operations, regardless of how good your actual service is.\n2. Above-the-fold clarity. Your headline, primary service offerings, and contact button must be fully visible without scrolling on both mobile phones and laptops.\n3. Lightning-fast response. If your website stutters while loading images, visitors subconsciously associate that lag with slow delivery and poor customer care.\n\nProfessional digital presentation is not an indulgence. It is your strongest competitive advantage.\n\nAt Veltrix Hub, we build clean, modern, and rapid web platforms tailored to establish instant credibility for serious growing businesses.",
    firstComment: "Elevate your online presentation to executive standards. Talk to Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-nov25-moment-first-impression.jpg"],
    scheduledFor: '2026-11-25T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-25 EVENING TWITTER ---
  {
    id: 'sched_2026_11_25_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "WEEKLY REFLECTION",
    carePillars: "Reliability + Emotion",
    caption: "Week 1 of 4 completed.\n\nHere is my biggest takeaway as an engineer this week:\n\nGrowth in software isn't about memorizing the newest release notes.\n\nReal growth is:\n\u2022 Understanding the tools you already use at a fundamental level\n\u2022 Knowing when NOT to reach for a complex abstraction\n\u2022 Writing less code to achieve a superior user experience\n\nExperience teaches you that simple code that works reliably in production beats clever code every time.\n\nWhat is one technical or career win you achieved this week?",
    mediaUrls: [],
    scheduledFor: '2026-11-25T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-26 MORNING FACEBOOK ---
  {
    id: 'sched_2026_11_26_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "ADS VS INFRASTRUCTURE",
    carePillars: "Curiosity + Alignment",
    caption: "Spending money on ads before fixing your landing page is like pouring water into a bucket full of holes.",
    firstComment: "We build high-converting landing pages that maximize your return on ad spend. Message our team:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-nov26.jpg"],
    scheduledFor: '2026-11-26T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-26 MORNING TWITTER ---
  {
    id: 'sched_2026_11_26_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "COMPONENT ARCHITECTURE",
    carePillars: "Curiosity + Alignment",
    caption: "Premature abstraction is the root of all evil in frontend codebases.\n\nReusable components are powerful.\nForcing everything into a reusable component on Day 1 is dangerous.\n\nWhen you build a component with 14 boolean props just to satisfy 3 slightly different buttons, you haven\u2019t written reusable code\u2014you\u2019ve created a monster.\n\nRule of thumb:\n\u2022 1st time: Write it directly.\n\u2022 2nd time: Tolerate duplication.\n\u2022 3rd time: Extract a clean abstraction.\n\nDuplication is far cheaper than the wrong abstraction.\n\nSave this for your next refactor \ud83d\udccc",
    mediaUrls: [],
    scheduledFor: '2026-11-26T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-26 EVENING FACEBOOK ---
  {
    id: 'sched_2026_11_26_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "THE PRE-AD AUDIT",
    carePillars: "Reliability + Alignment",
    caption: "Before you spend more money on ads, check where your visitors will land.\n\nIncreasing your ad budget when your website is not converting is the fastest way to burn capital. More traffic will only accelerate your losses if your landing page fails to convert.\n\nBefore launching your next marketing campaign, check these essentials:\n\n1. Message consistency. The exact promise made in your social media ad must appear word-for-word as the headline on your landing page. Disconnected headlines break user trust instantly.\n2. Dedicated offer landing pages. Never send paid traffic to a generic homepage with twenty distracting navigation links. Direct them to a focused page built around a single specific call to action.\n3. Frictionless inquiry pathways. Ensure your contact button opens WhatsApp with a pre-filled message referencing the specific promotion they clicked.\n\nWhen your landing page matches visitor expectations and makes action effortless, your cost per acquisition plummets.\n\nAt Veltrix Hub, we build specialized landing pages and conversion funnels engineered to convert paid traffic into paying customers.",
    firstComment: "Maximize your advertising ROI with custom landing pages. Contact Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-nov26-spend-more-on-ads.jpg"],
    scheduledFor: '2026-11-26T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-26 EVENING TWITTER ---
  {
    id: 'sched_2026_11_26_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "CLIENT & PRODUCT",
    carePillars: "Reliability + Emotion",
    caption: "A great engineer doesn't just take orders.\n\nThey interrogate requirements.\n\nWhen a client or founder says, \"We need a new dashboard,\"\n\nAn average developer starts coding immediately.\n\nA product-minded developer asks:\n\u2022 What decisions will users make based on these metrics?\n\u2022 Who is checking this, and how often?\n\u2022 Can this be solved with a simple email digest first?\n\u2022 What does success look like for this feature?\n\nThe highest ROI work in software is eliminating features that never needed to be built.",
    mediaUrls: [],
    scheduledFor: '2026-11-26T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-27 MORNING FACEBOOK ---
  {
    id: 'sched_2026_11_27_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "PRICING POWER",
    carePillars: "Curiosity + Alignment",
    caption: "If your brand looks amateur online, high-paying clients will assume your actual work is amateur too.",
    firstComment: "Transform your web presence into an executive-grade platform that commands premium pricing. Reach out:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-nov27.jpg"],
    scheduledFor: '2026-11-27T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-27 MORNING TWITTER ---
  {
    id: 'sched_2026_11_27_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "JAVASCRIPT MASTERY",
    carePillars: "Curiosity + Alignment",
    caption: "Learning 5 new frameworks won't make you a senior engineer.\n\nMaster these 6 JavaScript fundamentals first:\n\n1. Closures & Lexical Scope\n2. The Event Loop (Call Stack, Microtasks, Macrotasks)\n3. Promises & Async/Await execution timing\n4. Prototype chain and `this` binding\n5. Array immutability vs mutation\n6. Value vs Reference storage in memory\n\nModern frameworks change every 3 years. These 6 concepts haven't changed in a decade.\n\nMaster the engine, not just the dashboard.\n\nSave this checklist \ud83d\udccc",
    mediaUrls: [],
    scheduledFor: '2026-11-27T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-27 EVENING FACEBOOK ---
  {
    id: 'sched_2026_11_27_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "THE VALUE PERCEPTION GAP",
    carePillars: "Reliability + Emotion",
    caption: "Does your business look like it offers the value you charge for?\n\nThere is often a painful gap between the high quality of work a business delivers and how amateur it appears online.\n\nYou might have years of experience, a verified track record, and outstanding client results. But if your online presence consists solely of compressed social media graphics and a free email address, new prospects cannot distinguish you from a beginner.\n\nHigh-value clients pay for certainty and professionalism. They look for:\n1. A custom domain and corporate web platform that proves institutional stability.\n2. Comprehensive case studies outlining client challenges, solutions, and concrete outcomes.\n3. Professional executive communication channels that respond systematically without delay.\n\nWhen your digital presence matches the actual caliber of your service, price resistance disappears.\n\nAt Veltrix Hub, we build corporate-grade digital platforms that elevate your brand positioning and give premium clients the confidence to pay what you are worth.",
    firstComment: "Close the perception gap and command premium client fees. Message Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-nov27-worth-price-you-charge.jpg"],
    scheduledFor: '2026-11-27T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-27 EVENING TWITTER ---
  {
    id: 'sched_2026_11_27_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "BUSINESS & FRICTION",
    carePillars: "Reliability + Emotion",
    caption: "You don't need more ad traffic.\n\nYou need to fix the friction holes in your checkout.\n\nImagine a buyer ready to spend money on your site:\n\u2022 They can't find shipping estimates without creating an account\n\u2022 The form resets when there's an error\n\u2022 The mobile keyboard blocks the 'Submit' button\n\u2022 There's no Apple Pay or 1-click option\n\nResult: They leave and buy from Amazon.\n\nBefore spending another $1,000 on Facebook ads, audit your user journey. Remove the friction.",
    mediaUrls: [],
    scheduledFor: '2026-11-27T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-28 MORNING FACEBOOK ---
  {
    id: 'sched_2026_11_28_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "PERMANENT ASSETS",
    carePillars: "Curiosity + Alignment",
    caption: "A WhatsApp status lasts 24 hours. A custom web platform works for your business every single day.",
    firstComment: "Build permanent digital assets that generate leads 365 days a year. Chat with Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-nov28.jpg"],
    scheduledFor: '2026-11-28T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-28 MORNING TWITTER ---
  {
    id: 'sched_2026_11_28_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "DEBUGGING DISCIPLINE",
    carePillars: "Curiosity + Alignment",
    caption: "Randomly changing code until an error disappears isn't debugging.\n\nIt\u2019s guessing.\n\nProfessional debugging is systematic:\n1. Isolate the bug: Reproduce it with the minimal reproducible steps.\n2. Inspect the data: Where does the payload deviate from expectations?\n3. Form a hypothesis: What exact condition caused this?\n4. Test the fix: Verify that edge cases don't break.\n5. Write a regression test: Ensure it never happens again.\n\nCalm, disciplined developers solve in 15 minutes what panic-coders spend 2 days on.\n\nWhat\u2019s your go-to debugging step?",
    mediaUrls: [],
    scheduledFor: '2026-11-28T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-28 EVENING FACEBOOK ---
  {
    id: 'sched_2026_11_28_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "PERMANENT ASSETS VS DISAPPEARING POSTS",
    carePillars: "Reliability + Alignment",
    caption: "Your products deserve more than a WhatsApp status that disappears.\n\nRelying entirely on daily WhatsApp status updates to drive your sales is exhausting. You post twenty photos every morning, answer repetitive inquiries all afternoon, and twenty-four hours later, everything vanishes into thin air.\n\nThat is the treadmill of manual hustle.\n\nSustainable business growth requires permanent digital assets:\n1. Searchable online catalogs. Allow customers to browse past collections, view real-time availability, and filter by size or category whenever they choose.\n2. Search engine visibility. Unlike statuses that are invisible to Google, an indexed web catalog allows customers searching for your products to find and contact you organically.\n3. Automated reference links. Instead of sending forty individual pictures to every inquiry, send a single structured link that showcases your full range professionally.\n\nStop building your business on disappearing posts. Build permanent infrastructure that works while you rest.\n\nAt Veltrix Hub, we turn transient social businesses into scalable digital brands with structured web catalogs and automated order routing.",
    firstComment: "Graduate from temporary statuses to a permanent web catalog. Connect with Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-nov28-whatsapp-status-disappears.jpg"],
    scheduledFor: '2026-11-28T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-28 EVENING TWITTER ---
  {
    id: 'sched_2026_11_28_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "TEAMWORK & CULTURE",
    carePillars: "Reliability + Emotion",
    caption: "The best engineering teams don't avoid disagreement.\n\nThey disagree with high intellectual honesty.\n\nTwo engineers can completely disagree on state management, database schema, or component structure.\n\nWeak teams turn it into an ego battle.\nHigh-performing teams focus on:\n\u2022 What are the operational trade-offs?\n\u2022 Which solution is easier to debug under fire?\n\u2022 How does this affect end-user performance?\n\nDisagree and commit. The goal is building a great product, not winning an argument.",
    mediaUrls: [],
    scheduledFor: '2026-11-28T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-29 MORNING FACEBOOK ---
  {
    id: 'sched_2026_11_29_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "TECHNICAL PRUDENCE",
    carePillars: "Curiosity + Alignment",
    caption: "The most expensive website is the one that was built cheap and had to be rebuilt six months later.",
    firstComment: "We engineer durable, scalable software and web architectures built to last. Partner with Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-nov29.jpg"],
    scheduledFor: '2026-11-29T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-29 MORNING TWITTER ---
  {
    id: 'sched_2026_11_29_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "RESPONSIVE UX",
    carePillars: "Curiosity + Alignment",
    caption: "Responsive design is NOT shrinking a desktop UI until it fits an iPhone.\n\nMobile users behave in fundamentally different ways:\n\u2022 Thumbs have a limited reach zone\n\u2022 Hover states do not exist\n\u2022 Keyboards take up 50% of the viewport\n\u2022 Connectivity is intermittent\n\nIf your mobile user has to pinch-to-zoom or struggles to tap an 18px link, the layout isn\u2019t responsive.\n\nDesign for mobile thumbs, thumb zones, and touch targets (minimum 44x44px).\n\nSave this reminder \ud83d\udccc",
    mediaUrls: [],
    scheduledFor: '2026-11-29T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-29 EVENING FACEBOOK ---
  {
    id: 'sched_2026_11_29_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "THE MONTHLY HEALTH CHECK",
    carePillars: "Reliability + Alignment",
    caption: "Three simple checks every business owner should run on their website once a month:\n\n1. Test your contact pathways. Click every WhatsApp button, submit a test inquiry through your form, and call your listed number. It is alarming how many businesses discover their contact form has been failing silently for weeks while leads vanished.\n\n2. Audit your mobile speed. Open Google PageSpeed Insights on your smartphone and enter your URL. If uncompressed images or heavy plugins have slowed your load time past four seconds, clean them up immediately.\n\n3. Verify your core information. Confirm that your opening hours, pricing guides, active services, and physical address are completely accurate. Outdated details erode customer trust faster than almost anything else.\n\nYour website is an active digital employee. A ten-minute monthly review protects your pipeline and ensures ready buyers never encounter a broken door.\n\nAt Veltrix Hub, we provide continuous technical maintenance and conversion monitoring so your digital systems stay fast, secure, and ready to convert.",
    firstComment: "Let us handle your monthly website maintenance and performance audits. Contact us on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-nov29-three-website-checks.jpg"],
    scheduledFor: '2026-11-29T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-29 EVENING TWITTER ---
  {
    id: 'sched_2026_11_29_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "CONVERSION ECONOMICS",
    carePillars: "Reliability + Emotion",
    caption: "Pouring traffic into a website with poor UX is like filling a bucket with holes.\n\nBusinesses spend thousands on SEO, Google Ads, and influencers.\n\nYet visitors arrive and encounter:\n\u2022 Slow page loads (>4s)\n\u2022 Unclear headlines that don't explain the product\n\u2022 Cluttered navigation menus\n\u2022 Broken mobile layouts\n\nTraffic generates visibility. User experience generates revenue.\n\nPatch the bucket before buying more water.",
    mediaUrls: [],
    scheduledFor: '2026-11-29T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-30 MORNING FACEBOOK ---
  {
    id: 'sched_2026_11_30_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "TRANSPARENT PRICING",
    carePillars: "Curiosity + Alignment",
    caption: "If your pricing is a complete secret, customers assume they cannot afford you and move on to your competitor.",
    firstComment: "We help brands present pricing frameworks that filter tire-kickers and attract serious buyers. Message our team:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-nov30.jpg"],
    scheduledFor: '2026-11-30T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-30 MORNING TWITTER ---
  {
    id: 'sched_2026_11_30_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "REACT STATE MANAGEMENT",
    carePillars: "Curiosity + Alignment",
    caption: "You probably don't need Redux, Zustand, or Context for that feature.\n\nBefore reaching for a global state library, use this hierarchy:\n\n1. Local Component State (`useState`)\n   \u2192 If only this component cares, keep it here.\n\n2. Lifted State (`props`)\n   \u2192 If siblings care, lift it to their common parent.\n\n3. Server State (`TanStack Query / SWR`)\n   \u2192 If it comes from an API, cache it; don't put it in global client state.\n\n4. Global Client State (`Zustand / Jotai`)\n   \u2192 Only for true app-wide UI state (modals, auth sessions, themes).\n\nSimpler architecture = fewer bugs.\n\nBookmark this decision tree \ud83d\udccc",
    mediaUrls: [],
    scheduledFor: '2026-11-30T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-30 EVENING FACEBOOK ---
  {
    id: 'sched_2026_11_30_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "EXPENSIVE WEBSITE MISTAKES",
    carePillars: "Curiosity + Reliability",
    caption: "There is one website mistake that is easy to miss and expensive to ignore.\n\nBusiness owners frequently spend weeks agonizing over color palettes, logo positioning, and aesthetic fonts. Meanwhile, their primary inquiry pathway is silently broken.\n\nHere is what happens:\n1. A potential buyer lands on your site, reads your offer, and clicks the inquiry button.\n2. The button connects to an outdated form with an unmonitored email address or a broken WhatsApp redirect link.\n3. The visitor sees an error message, gives up, and immediately searches for another vendor on Google.\n\nYou never receive an error notification. You never see the customer you lost. The inquiry simply vanishes into thin air.\n\nTest your conversion channels like an actual customer at least once a month.\n\nAt Veltrix Hub, we build redundant inquiry routing that sends lead alerts directly to your phone within three seconds, ensuring no buyer ever slips through the cracks.",
    firstComment: "Protect your sales pipeline with verified conversion engineering. Contact Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-nov30-website-mistake-ignore.jpg"],
    scheduledFor: '2026-11-30T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-11-30 EVENING TWITTER ---
  {
    id: 'sched_2026_11_30_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "RECRUITER / HIRING",
    carePillars: "Reliability + Emotion",
    caption: "To Engineering Managers & Tech Recruiters:\n\nWhat is the #1 signal that tells you a frontend developer is truly senior?\n\nIs it:\n\u2022 Clean code architecture & design patterns?\n\u2022 Ownership and ability to ship without supervision?\n\u2022 Clear communication with non-technical stakeholders?\n\u2022 Track record of business impact and user-centric thinking?\n\nBeyond LeetCode and tech keywords, what makes a portfolio or interview an instant 'YES'?\n\nCurious to hear your perspectives \ud83d\udc47",
    mediaUrls: [],
    scheduledFor: '2026-11-30T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-01 MORNING FACEBOOK ---
  {
    id: 'sched_2026_12_01_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "FUNCTIONAL DESIGN",
    carePillars: "Curiosity + Alignment",
    caption: "Good design is not how a website looks. Good design is how easily a first-time visitor buys.",
    firstComment: "We build high-performance e-commerce and lead gen platforms designed for seamless user checkout. Connect with us:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-dec01.jpg"],
    scheduledFor: '2026-12-01T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-01 MORNING TWITTER ---
  {
    id: 'sched_2026_12_01_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "ACCESSIBILITY (A11Y)",
    carePillars: "Curiosity + Alignment",
    caption: "Accessibility isn't an optional checklist feature for \"later\".\n\nIt\u2019s basic engineering competency.\n\nBuilding accessible interfaces isn't rocket science:\n\u2022 Use native `<button>` instead of `<div onClick>`\n\u2022 Provide meaningful `alt` text for images\n\u2022 Maintain clear contrast ratios for readability\n\u2022 Ensure the entire app is fully keyboard navigable\n\u2022 Use semantic tags (`<nav>`, `<main>`, `<header>`)\n\nOver 1 billion people worldwide navigate with accessibility needs.\n\nWhen you build accessible software, you make the web better for everyone.\n\nSave this reminder \ud83d\udccc",
    mediaUrls: [],
    scheduledFor: '2026-12-01T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-01 EVENING FACEBOOK ---
  {
    id: 'sched_2026_12_01_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "YOUR REAL COMPETITOR",
    carePillars: "Curiosity + Alignment",
    caption: "Your biggest online competitor may not be the business you expect.\n\nMost founders spend considerable energy monitoring other businesses in their industry, checking competitor price points and product launches.\n\nIn digital commerce, your biggest rival is rarely another company.\n\nYour biggest competitor is visitor inertia and hesitation:\n1. The distraction of social notifications pulling your buyer away before they finish reading your offer.\n2. The frustration of a mobile page taking five seconds to load on a 4G connection.\n3. The friction of waiting twenty minutes for an inquiry reply while buyer urgency cools off.\n\nYou do not need to beat twenty competitors. You only need to make purchasing easier, faster, and clearer than doing nothing.\n\nAt Veltrix Hub, we build digital infrastructure that cuts load latency, answers buyer questions instantly, and closes deals before momentum is lost.",
    firstComment: "Eliminate buying friction and outperform your real competitors. Talk to Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-dec01-biggest-competitor.jpg"],
    scheduledFor: '2026-12-01T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-01 EVENING TWITTER ---
  {
    id: 'sched_2026_12_01_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "COMMUNICATION SKILLS",
    carePillars: "Reliability + Emotion",
    caption: "A 10x developer who can\u2019t communicate clearly is effectively a 1x developer.\n\nTechnical brilliance means little if you can't:\n\u2022 Explain why a deadline needs to shift\n\u2022 Translate an API outage into plain language for customer support\n\u2022 Write Pull Requests that reviewers can understand in 5 minutes\n\u2022 Articulate the ROI of technical debt refactoring to leadership\n\nCode is written for computers to execute, but communication is what moves teams forward.\n\nInvest in your writing and speaking as much as your code.",
    mediaUrls: [],
    scheduledFor: '2026-12-01T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-02 MORNING FACEBOOK ---
  {
    id: 'sched_2026_12_02_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "PROFESSIONAL DOMAIN",
    carePillars: "Curiosity + Alignment",
    caption: "Stop sending high-value prospects to an Instagram bio link. Give them a professional home to evaluate your business.",
    firstComment: "Establish your brand's official corporate web presence with custom engineering from Veltrix Hub:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-dec02.jpg"],
    scheduledFor: '2026-12-02T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-02 MORNING TWITTER ---
  {
    id: 'sched_2026_12_02_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "PORTFOLIO & SHOWCASE",
    carePillars: "Curiosity + Alignment",
    caption: "Your portfolio shouldn't just be screenshots of pretty landing pages.\n\nAnyone can clone a UI tutorial.\n\nA compelling engineering case study shows:\n\u2022 The Problem: What specific business/user issue were you solving?\n\u2022 The Architecture: Why did you pick this tech stack over others?\n\u2022 The Edge Cases: How did you handle errors, offline mode, and latency?\n\u2022 The Result: How did it impact speed, usability, or conversions?\n\nShow your engineering thinking, not just your CSS styles.\n\nSave this framework for your portfolio rewrite \ud83d\udccc",
    mediaUrls: [],
    scheduledFor: '2026-12-02T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-02 EVENING FACEBOOK ---
  {
    id: 'sched_2026_12_02_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "WHY CUSTOMERS DO NOT BUY",
    carePillars: "Curiosity + Reliability",
    caption: "What if your website is not the real reason customers are not buying?\n\nWhen conversions drop, business owners often assume they need a brand-new website template, new brand colors, or modern graphic design.\n\nThey spend weeks on redesigns, only to discover sales remain completely flat.\n\nThe issue is rarely visual aesthetics. The underlying blocker is usually strategic:\n1. Vague positioning. You are trying to sell everything to everyone instead of solving one specific problem for an identifiable customer.\n2. Lack of perceived safety. The visitor cannot tell whether your business has delivered for real clients in the past because reviews and proof are nowhere to be found.\n3. Unclear next steps. There is no obvious call to action telling the prospect exactly how to book a consultation or place an order.\n\nBefore paying for cosmetic redesigns, fix your offer clarity and proof architecture.\n\nAt Veltrix Hub, we diagnose your entire conversion funnel from initial headline to final inquiry, ensuring your platform converts traffic into tangible revenue.",
    firstComment: "Fix your conversion funnel with strategic technical engineering. Message Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-dec02-website-real-reason.jpg"],
    scheduledFor: '2026-12-02T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-02 EVENING TWITTER ---
  {
    id: 'sched_2026_12_02_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "MID-POINT REFLECTION",
    carePillars: "Reliability + Emotion",
    caption: "Day 14. Two weeks of sharing frontend engineering daily.\n\nHere are the two hardest lessons experience teaches you:\n\n1. Knowing how to build a complex system.\n2. Knowing when NOT to build it.\n\nThe second one is 10x harder.\n\nWhen you start coding, you want to use every design pattern, every state library, and every animation tool.\n\nAs you mature, you realize the ultimate sophistication in software is simplicity and reliability.\n\nWhat\u2019s a lesson that only real production experience taught you?",
    mediaUrls: [],
    scheduledFor: '2026-12-02T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-03 MORNING FACEBOOK ---
  {
    id: 'sched_2026_12_03_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "ROI VELOCITY",
    carePillars: "Curiosity + Alignment",
    caption: "A slow website does not just frustrate visitors. It quietly kills your advertising return on investment.",
    firstComment: "Speed up your web infrastructure and slash your cost per customer acquisition. Message Veltrix Hub:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-dec03.jpg"],
    scheduledFor: '2026-12-03T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-03 MORNING TWITTER ---
  {
    id: 'sched_2026_12_03_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "TECH & PRACTICALITY",
    carePillars: "Curiosity + Alignment",
    caption: "Your users do not care if your app is built with Next.js, Remix, Astro, or plain HTML.\n\nThey only care:\n\u2022 Does it solve my problem quickly?\n\u2022 Does it work without crashing?\n\u2022 Is it intuitive and fast?\n\nToo many projects drown in technical bikeshedding before finding product-market fit.\n\nTechnology is a vehicle, not the destination.\n\nPick reliable tools. Ship value. Iterate with real user feedback.",
    mediaUrls: [],
    scheduledFor: '2026-12-03T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-03 EVENING FACEBOOK ---
  {
    id: 'sched_2026_12_03_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "THE SILENT CUSTOMER LEAK",
    carePillars: "Reliability + Emotion",
    caption: "You may be losing potential customers before they ever contact you.\n\nOne of the most dangerous metrics in business is the silent visitor: the qualified buyer who arrived on your site, spent sixty seconds looking around, and left without saying a single word.\n\nThey had purchasing intent and the budget to buy. Why did they leave?\n1. Unclear terms and delivery timelines. If they cannot quickly confirm how long delivery takes or how service is delivered, they leave to find an answer elsewhere.\n2. Missing verification details. An unfamiliar buyer looks for company registration, direct office addresses, or executive identities before parting with their money.\n3. Too much friction to ask a simple question. If asking a price requires submitting a lengthy form with an email address, they will simply open a competitor's direct WhatsApp chat.\n\nMake reaching your team effortless and present your credentials prominently.\n\nAt Veltrix Hub, we build trust-engineered platforms that anticipate buyer concerns and eliminate hesitation before inquiries are lost.",
    firstComment: "Turn silent visitors into active, qualified buyers. Talk with Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-dec03-losing-customers-before-contact.jpg"],
    scheduledFor: '2026-12-03T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-03 EVENING TWITTER ---
  {
    id: 'sched_2026_12_03_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "BUSINESS FIRST IMPRESSION",
    carePillars: "Reliability + Emotion",
    caption: "Business owners: Take a look at your website on your phone right now.\n\nAsk yourself these 3 honest questions:\n\n1. In 5 seconds, can a stranger tell *exactly* what you offer?\n2. Can they find proof (testimonials, reviews, client results) easily?\n3. Can they contact or purchase in under 2 clicks?\n\nIf the answer to any of these is NO, you are actively leaking money every day.\n\nYour website isn\u2019t an expense\u2014it\u2019s an investment that should generate returns.",
    mediaUrls: [],
    scheduledFor: '2026-12-03T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-04 MORNING FACEBOOK ---
  {
    id: 'sched_2026_12_04_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "ACTIVE CREDENTIALS",
    carePillars: "Curiosity + Alignment",
    caption: "Never make a client ask: \"Are you still in business?\" Keep your digital presence active, current, and verified.",
    firstComment: "Maintain an active, credible digital footprint with continuous updates from Veltrix Hub. Reach out:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-dec04.jpg"],
    scheduledFor: '2026-12-04T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-04 MORNING TWITTER ---
  {
    id: 'sched_2026_12_04_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "API INTEGRATION",
    carePillars: "Curiosity + Alignment",
    caption: "A great frontend isn\u2019t just how your app looks when the backend works perfectly.\n\nIt\u2019s how it behaves when the backend catches fire.\n\nEvery production frontend must gracefully handle:\n\u2022 Network timeouts & offline mode\n\u2022 401 Unauthorized token expirations\n\u2022 429 Rate limiting backoffs\n\u2022 500 Server error retry states with clear user messaging\n\u2022 Skeleton loading screens (never jarring layout shifts)\n\nDefensive frontend engineering is what separates fragile prototypes from enterprise-grade software.\n\nSave this checklist for your next API integration \ud83d\udccc",
    mediaUrls: [],
    scheduledFor: '2026-12-04T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-04 EVENING FACEBOOK ---
  {
    id: 'sched_2026_12_04_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "THE ZERO-INQUIRY DIAGNOSTIC",
    carePillars: "Curiosity + Alignment",
    caption: "Here is what I would check first if a business website was not getting inquiries:\n\nWhen traffic lands on a website but inquiries remain at zero, do not guess what is wrong. Run this diagnostic:\n\n1. The Mobile Tap Test. Open your website on a mobile phone with low cellular signal. Tap every single button. Does your inquiry button open WhatsApp immediately with a clean pre-filled prompt, or does it trigger an error screen?\n2. The 5-Second Headline Audit. Does your primary headline state the concrete result you deliver, or is it a vague philosophical slogan?\n3. The Proof Placement. Is your client social proof buried in a footer subpage, or is it prominently positioned directly beneath your primary offer?\n\nIn almost every audit, fixing these three elements unlocks an immediate flow of inquiries without spending an extra dollar on marketing.\n\nAt Veltrix Hub, we perform systematic conversion audits to help business owners turn stagnant websites into dependable lead engines.",
    firstComment: "Request a comprehensive conversion audit for your business website on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-dec04-check-first-no-inquiries.jpg"],
    scheduledFor: '2026-12-04T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-04 EVENING TWITTER ---
  {
    id: 'sched_2026_12_04_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "NETWORKING & BREADTH",
    carePillars: "Reliability + Emotion",
    caption: "The best advice I can give any frontend developer:\n\nSpend less time talking only to developers.\n\nTalk to:\n\u2022 Designers (learn visual hierarchy and usability)\n\u2022 Product managers (learn prioritization and roadmaps)\n\u2022 Marketers (learn conversion psychology and SEO)\n\u2022 Founders (learn unit economics and client acquisition)\n\nWhen you understand the whole business engine, your code becomes 10x more valuable.\n\nWho outside of tech taught you the most valuable lesson for your career?",
    mediaUrls: [],
    scheduledFor: '2026-12-04T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-05 MORNING FACEBOOK ---
  {
    id: 'sched_2026_12_05_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "COMPOUNDING SYSTEMS",
    carePillars: "Curiosity + Alignment",
    caption: "Consistency beats intensity. Two focused digital inquiries a day will build a bigger company than occasional viral posts.",
    firstComment: "We engineer automated inbound pipelines that generate predictable client inquiries every single week. Message Veltrix Hub:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-dec05.jpg"],
    scheduledFor: '2026-12-05T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-05 MORNING TWITTER ---
  {
    id: 'sched_2026_12_05_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "CLEAN CODE",
    carePillars: "Curiosity + Alignment",
    caption: "Clean code isn\u2019t code that looks clever.\n\nClean code is code that makes its intent completely obvious.\n\nBefore merging a PR, ask yourself:\n\u2022 Can a teammate understand this function without a 30-minute walkthrough?\n\u2022 Can I come back to this file in 6 months without being confused?\n\u2022 Are variable names descriptive, or did I use single-letter shortcuts?\n\nAlways write code as if the person who will maintain it is a violent psychopath who knows where you live.\n\nAnd remember: that maintainer will usually be future you.\n\nBookmark this rule \ud83d\udccc",
    mediaUrls: [],
    scheduledFor: '2026-12-05T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-05 EVENING FACEBOOK ---
  {
    id: 'sched_2026_12_05_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "THE DAILY POSTING TRAP",
    carePillars: "Reliability + Emotion",
    caption: "You post every day, but the sales still are not coming. What could be missing?\n\nIt is one of the most frustrating traps in modern business: you spend three hours designing flyers and writing social media captions daily, but your bank account does not reflect the effort.\n\nHere is the underlying reality: social media algorithms are designed to keep users on their app, not to grow your revenue.\n\nSocial content gets attention, but attention without a conversion mechanism evaporates:\n1. You have no dedicated landing page to collect customer details and qualify serious buyers.\n2. You have no automated inquiry flow to follow up with people who showed interest three days ago.\n3. Your buying process is entirely manual, forcing prospects into slow DM conversations that fizzle out.\n\nStop relying on daily posting alone to feed your business. Build a dedicated conversion hub that captures audience interest and converts it into revenue automatically.\n\nAt Veltrix Hub, we engineer complete inbound systems that turn social visibility into verifiable customer acquisition.",
    firstComment: "Build a real digital conversion hub for your brand. Message Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-dec05-post-every-day-no-sales.jpg"],
    scheduledFor: '2026-12-05T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-05 EVENING TWITTER ---
  {
    id: 'sched_2026_12_05_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "DIGITAL TRANSFORMATION",
    carePillars: "Reliability + Emotion",
    caption: "Small businesses don't need million-dollar custom enterprise software.\n\nThey need one frustrating bottleneck solved.\n\nOften, the highest value tech upgrades are simple:\n\u2022 Automating a manual booking or WhatsApp inquiry workflow\n\u2022 Replacing a clunky PDF menu with a fast, mobile-friendly web page\n\u2022 Setting up automated order confirmations\n\u2022 Making their location and operating hours unmistakable\n\nDon't sell technology. Sell hours saved and friction eliminated.",
    mediaUrls: [],
    scheduledFor: '2026-12-05T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-06 MORNING FACEBOOK ---
  {
    id: 'sched_2026_12_06_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "SPEED AS MOAT",
    carePillars: "Curiosity + Alignment",
    caption: "If your customer support takes 4 hours to reply, your competitors will close the deal in 4 minutes.",
    firstComment: "Automate instant 24/7 lead responses on WhatsApp and web with Veltrix Hub. Connect with our team:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-dec06.jpg"],
    scheduledFor: '2026-12-06T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-06 MORNING TWITTER ---
  {
    id: 'sched_2026_12_06_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "FRONTEND ARCHITECTURE",
    carePillars: "Curiosity + Alignment",
    caption: "Organizing your React components by `components/`, `hooks/`, and `utils/` breaks down after 10 features.\n\nSwitch to a Feature-First architecture:\n\nsrc/\n\u251c\u2500\u2500 features/\n\u2502   \u251c\u2500\u2500 auth/\n\u2502   \u2502   \u251c\u2500\u2500 components/\n\u2502   \u2502   \u251c\u2500\u2500 hooks/\n\u2502   \u2502   \u2514\u2500\u2500 api/\n\u2502   \u2514\u2500\u2500 billing/\n\u2502       \u251c\u2500\u2500 components/\n\u2502       \u2514\u2500\u2500 hooks/\n\u2514\u2500\u2500 shared/ (common buttons, inputs, layouts)\n\nWhy? Code that changes together stays together.\n\nWhen you delete or refactor a feature, you don\u2019t have to hunt across 12 different root directories.\n\nSave this structure for your next app \ud83d\udccc",
    mediaUrls: [],
    scheduledFor: '2026-12-06T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-06 EVENING FACEBOOK ---
  {
    id: 'sched_2026_12_06_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "THE EFFORT VS INFRASTRUCTURE GAP",
    carePillars: "Reliability + Emotion",
    caption: "You are working harder to promote your business, but growth still feels slow.\n\nWhen business growth stalls, the traditional advice is to work harder: send more cold outreach, run more campaigns, and spend more late nights managing customer DMs.\n\nWorking harder inside a broken system only leads to founder burnout.\n\nEffort cannot compensate for missing infrastructure:\n1. If your website takes six seconds to load, doubling your ad spend only doubles the money you lose to bounce rates.\n2. If inquiry qualification is manual, taking on more leads simply creates a severe operational bottleneck.\n3. If order fulfillment is tracked on paper, inventory errors will destroy client trust as volume increases.\n\nTo grow predictably, you do not need more sweat. You need scalable digital systems that handle inquiries, payments, and confirmations automatically.\n\nAt Veltrix Hub, we build enterprise-grade software and web platforms that scale your operations smoothly without multiplying your workload.",
    firstComment: "Scale your business operations with custom automation. Speak with Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-dec06-working-harder-slow-growth.jpg"],
    scheduledFor: '2026-12-06T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-06 EVENING TWITTER ---
  {
    id: 'sched_2026_12_06_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "INTERVIEW STRATEGY",
    carePillars: "Reliability + Emotion",
    caption: "How to ace technical frontend interviews without memorizing 500 LeetCode problems:\n\nInterviewers care far more about *how you think* than instant perfection.\n\nDuring a live coding session:\n1. Clarify constraints: Ask about edge cases and data shapes before typing.\n2. Talk out loud: Explain your mental model and trade-offs.\n3. Start simple: Build a working naive solution, then optimize.\n4. Handle failure gracefully: When something breaks, debug systematically instead of panicking.\n\nDemonstrating collaboration and resilience will win you more offers than rote memorization.",
    mediaUrls: [],
    scheduledFor: '2026-12-06T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-07 MORNING FACEBOOK ---
  {
    id: 'sched_2026_12_07_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "TRUST VS LOGOS",
    carePillars: "Curiosity + Alignment",
    caption: "Your logo is only 5 percent of your brand. The other 95 percent is the trust customers feel when doing business with you.",
    firstComment: "We engineer high-trust digital assets that establish corporate credibility and elevate client confidence. Connect with us:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-dec07.jpg"],
    scheduledFor: '2026-12-07T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-07 MORNING TWITTER ---
  {
    id: 'sched_2026_12_07_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "PASSION FOR FRONTEND",
    carePillars: "Curiosity + Alignment",
    caption: "Why I chose Frontend Engineering over everything else:\n\nIn frontend, there is zero barrier between the code you write and the human using it.\n\n\u2022 A 50ms performance optimization saves users precious seconds.\n\u2022 A well-placed form validation error prevents real user anxiety.\n\u2022 An accessible component allows someone with a disability to complete their work.\n\nWe aren't just manipulating the DOM.\n\nWe are designing the bridge between human intention and computer power.\n\nThat will never stop being exciting to me.",
    mediaUrls: [],
    scheduledFor: '2026-12-07T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-07 EVENING FACEBOOK ---
  {
    id: 'sched_2026_12_07_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "FOLLOWERS VS CUSTOMERS",
    carePillars: "Curiosity + Alignment",
    caption: "More followers will not automatically bring more customers. Here is what else matters:\n\nA social media account with fifty thousand followers can easily generate less monthly profit than a focused business with five hundred qualified contacts.\n\nFollowers represent passive entertainment. Customers represent verified transactions.\n\nTo turn followers into paying buyers, three bridges are required:\n1. Targeted problem alignment. Your audience must know the exact business challenge you solve, not just enjoy entertaining video clips.\n2. Institutional credibility. Serious clients verify businesses outside social media: they look for an official corporate website, transparent policies, and verifiable credentials.\n3. Frictionless transaction pathways. When someone decides to buy, they should not have to navigate back-and-forth chat threads just to obtain an invoice or account number.\n\nFocus on building conversion systems instead of chasing viral follower milestones.\n\nAt Veltrix Hub, we engineer digital business systems that convert audience attention into predictable corporate revenue.",
    firstComment: "Build a predictable revenue engine from your existing audience. Message Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-dec07-more-followers-not-customers.jpg"],
    scheduledFor: '2026-12-07T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-07 EVENING TWITTER ---
  {
    id: 'sched_2026_12_07_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "FOUNDER ENGAGEMENT",
    carePillars: "Reliability + Emotion",
    caption: "To startup founders and business owners:\n\nWhat is the single most repetitive task in your business that drives you crazy?\n\nIs it:\n\u2022 Copy-pasting data between spreadsheets and emails?\n\u2022 Manually answering the same 5 customer questions on WhatsApp/DM?\n\u2022 Chasing clients for invoice approvals?\n\u2022 Updating inventory or booking schedules manually?\n\nMost founders lose 10+ hours a week on manual grind that a simple script or automated web portal could eliminate.\n\nTell me your biggest operational bottleneck below \ud83d\udc47",
    mediaUrls: [],
    scheduledFor: '2026-12-07T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-08 MORNING FACEBOOK ---
  {
    id: 'sched_2026_12_08_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "OWNED PLATFORMS",
    carePillars: "Curiosity + Alignment",
    caption: "Do not build a digital business on rented land alone. Own your domain, your customer database, and your website.",
    firstComment: "Own your business infrastructure with a dedicated web platform from Veltrix Hub. Speak with us:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-dec08.jpg"],
    scheduledFor: '2026-12-08T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-08 MORNING TWITTER ---
  {
    id: 'sched_2026_12_08_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "ERROR HANDLING UX",
    carePillars: "Curiosity + Alignment",
    caption: "Never leave a user staring at a blank white screen.\n\nError boundaries are mandatory, not optional.\n\nWhen an uncaught JavaScript error crashes a component, your user shouldn't face a dead page.\n\nA resilient UI provides:\n1. Clear explanation: \"Something went wrong loading this widget.\"\n2. Actionable recovery: A direct \"Try Again\" button that resets state.\n3. Isolation: The rest of the app/navbar continues functioning.\n4. Telemetry: Silent logging to Sentry/monitoring behind the scenes.\n\nError states are part of your user experience. Design them with care.\n\nSave this for your app resilience checklist \ud83d\udccc",
    mediaUrls: [],
    scheduledFor: '2026-12-08T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-08 EVENING FACEBOOK ---
  {
    id: 'sched_2026_12_08_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "THE PURPOSE-DRIVEN WEBSITE",
    carePillars: "Curiosity + Alignment",
    caption: "A website does not grow a business by itself. It needs a clear purpose.\n\nHaving a website is not a badge of honor. A website that sits on the internet without a defined assignment is simply an ongoing hosting expense.\n\nEvery effective business website is built around one primary job:\n1. For service businesses: qualify incoming leads, filter out budget mismatches, and book consultations automatically.\n2. For product brands: display real-time inventory, handle seamless checkout, and route orders directly to fulfillment.\n3. For corporate agencies: establish enterprise authority, showcase proven case studies, and initiate structured RFP inquiries.\n\nWhen your website has one clear mission, every headline, testimonial, and button works toward that single measurable goal.\n\nStop treating your website as an online brochure. Build it as an active revenue generator.\n\nAt Veltrix Hub, we build goal-oriented web applications engineered to achieve specific business outcomes from day one.",
    firstComment: "Turn your website into an active revenue generator. Talk with Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-dec08-website-clear-purpose.jpg"],
    scheduledFor: '2026-12-08T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-08 EVENING TWITTER ---
  {
    id: 'sched_2026_12_08_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "PROFESSIONAL GROWTH",
    carePillars: "Reliability + Emotion",
    caption: "You don't need to know everything to be an exceptional software engineer.\n\nYou just need two things:\n\n1. Relentless curiosity:\n   The hunger to dig into the source code, read the specs, and ask \"why does this behave like this?\"\n\n2. Absolute accountability:\n   Taking ownership when things break, communicating proactively, and following through until the fix is shipped.\n\nCuriosity builds your technical depth.\nAccountability builds your reputation.\n\nWhat is one professional skill you're intentionally developing this quarter?",
    mediaUrls: [],
    scheduledFor: '2026-12-08T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-09 MORNING FACEBOOK ---
  {
    id: 'sched_2026_12_09_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "FOLLOW-UP AUTOMATION",
    carePillars: "Curiosity + Alignment",
    caption: "An inquiry without follow-up is wasted marketing money. Automate your reminders or lose the deal.",
    firstComment: "Implement automated follow-up workflows that close warm leads systematically. Message Veltrix Hub:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-dec09.jpg"],
    scheduledFor: '2026-12-09T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-09 MORNING TWITTER ---
  {
    id: 'sched_2026_12_09_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "FULLSTACK / BACKEND AWARENESS",
    carePillars: "Curiosity + Alignment",
    caption: "A frontend engineer who understands database modeling is 3x more lethal than one who doesn't.\n\nYou don't need to be a DBA or write complex PostgreSQL migrations every day.\n\nBut understanding:\n\u2022 One-to-many vs Many-to-many relationships\n\u2022 How database indexing impacts API latency\n\u2022 Pagination strategies (Cursor vs Offset)\n\u2022 Caching headers (`Cache-Control`, `ETags`)\n\nEmpowers you to collaborate effectively with backend teams and design seamless, ultra-fast client-side state.\n\nConnect the dots across the stack.\n\nSave this reminder \ud83d\udccc",
    mediaUrls: [],
    scheduledFor: '2026-12-09T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-09 EVENING FACEBOOK ---
  {
    id: 'sched_2026_12_09_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "UNBURDENING WHATSAPP",
    carePillars: "Reliability + Emotion",
    caption: "WhatsApp is a useful tool, but it should not have to do everything.\n\nWhatsApp is arguably the most powerful closing tool in commerce today. But when business owners use it to handle initial browsing, payment accounting, stock tracking, and customer onboarding simultaneously, the entire system grinds to a halt.\n\nManual chat management creates friction:\n1. Prospects wait three hours for basic price quotes while you type replies to thirty other chats.\n2. Details are lost in scrolling conversations, causing fulfillment errors and delayed shipments.\n3. You are chained to your phone eighteen hours a day, unable to step away without losing sales.\n\nUnburden your WhatsApp. Use a custom website to display products, calculate totals, and answer standard FAQs, and use WhatsApp exclusively to close warm, qualified buyers.\n\nAt Veltrix Hub, we build integrated web platforms that automate browsing and preliminary vetting while keeping your final sales conversations personal.",
    firstComment: "Free yourself from manual WhatsApp fatigue. Connect with Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-dec09-whatsapp-not-everything.jpg"],
    scheduledFor: '2026-12-09T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-09 EVENING TWITTER ---
  {
    id: 'sched_2026_12_09_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "CODE REVIEWS & FEEDBACK",
    carePillars: "Reliability + Emotion",
    caption: "Your code is not your identity.\n\nDetach your ego from your Pull Requests.\n\nEarly in your career, code review comments can feel like personal attacks:\n\u2022 \"Why did they suggest rewriting this?\"\n\u2022 \"Did they not see how clever my one-liner was?\"\n\nMaturity is realizing that feedback is a free masterclass.\n\nAnother engineer spotted an edge case you missed, a performance leak, or a simpler API.\n\nThe goal is not defending your code. The goal is shipping the best possible product.",
    mediaUrls: [],
    scheduledFor: '2026-12-09T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-10 MORNING FACEBOOK ---
  {
    id: 'sched_2026_12_10_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "CHECKOUT EFFICIENCY",
    carePillars: "Curiosity + Alignment",
    caption: "If your checkout process takes more than 3 steps, you are actively paying customers to leave.",
    firstComment: "Streamline your checkout and inquiry flows with custom web engineering from Veltrix Hub. Message us:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-dec10.jpg"],
    scheduledFor: '2026-12-10T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-10 MORNING TWITTER ---
  {
    id: 'sched_2026_12_10_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "AI IN ENGINEERING",
    carePillars: "Curiosity + Alignment",
    caption: "AI won't replace software engineers.\n\nEngineers who use AI with deep technical judgment will replace those who don\u2019t.\n\nGenerating code with LLMs is easy.\n\nThe real engineering skill is:\n\u2022 Knowing when the AI generated hallucinated or deprecated APIs\n\u2022 Spotting subtle security flaws and XSS vulnerabilities\n\u2022 Refactoring bloated boilerplate into maintainable architecture\n\u2022 Understanding the system boundaries that AI can't see\n\nAI is a 10x multiplier on your existing fundamentals.\n10x times 0 fundamentals is still 0.\n\nInvest in the foundation.",
    mediaUrls: [],
    scheduledFor: '2026-12-10T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-10 EVENING FACEBOOK ---
  {
    id: 'sched_2026_12_10_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "BEAUTY VS DIRECTION",
    carePillars: "Curiosity + Alignment",
    caption: "A beautiful website can still fail if people do not know what to do next.\n\nMany businesses spend considerable budgets hiring design agencies to craft visually stunning websites with full-screen video backgrounds, complex animations, and minimalist typography.\n\nYet months later, the business owner wonders why nobody is actually buying.\n\nAesthetic beauty without directional clarity is a recipe for low conversion:\n1. When everything looks artistic, the primary call-to-action button blends into the background.\n2. Visitors admire the visual flair, but leave without understanding how to initiate an order.\n3. Complex animation scripts slow down mobile page loading, frustrating customers on cellular data.\n\nClarity must always lead. Your website should tell visitors precisely what you do, why it matters to them, and what button to click next without ambiguity.\n\nAt Veltrix Hub, our technical team combines elegant modern aesthetics with laser-focused conversion architecture so your website looks exceptional and sells consistently.",
    firstComment: "Build a website that combines executive design with high conversion. Reach Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-dec10-beautiful-website-fails.jpg"],
    scheduledFor: '2026-12-10T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-10 EVENING TWITTER ---
  {
    id: 'sched_2026_12_10_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "BUSINESS CONVERSION",
    carePillars: "Reliability + Emotion",
    caption: "An online brochure costs money.\n\nA conversion-optimized website prints money.\n\nWhat makes the difference?\n\nBrochure site:\n\u2022 Generic text: \"We provide quality services\"\n\u2022 Complicated multi-step contact forms\n\u2022 Hidden pricing and vague offerings\n\nConversion-optimized site:\n\u2022 Laser-sharp value proposition above the fold\n\u2022 Proof: Case studies, numbers, social proof\n\u2022 Frictionless next step (1-click WhatsApp, direct booking, or instant checkout)\n\nIs your website an expense or an asset?",
    mediaUrls: [],
    scheduledFor: '2026-12-10T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-11 MORNING FACEBOOK ---
  {
    id: 'sched_2026_12_11_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "CREDIBILITY ACCELERATORS",
    carePillars: "Curiosity + Alignment",
    caption: "Trust is the ultimate conversion accelerator. Display your verified credentials and testimonials prominently.",
    firstComment: "We build high-trust digital platforms engineered to turn skeptical prospects into committed buyers. Connect with us:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-dec11.jpg"],
    scheduledFor: '2026-12-11T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-11 MORNING TWITTER ---
  {
    id: 'sched_2026_12_11_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "CONTINUOUS LEARNING",
    carePillars: "Curiosity + Alignment",
    caption: "How to learn a new framework without getting overwhelmed by 300 pages of documentation:\n\nDon't start by memorizing every API.\n\nAsk 4 core questions:\n1. What exact problem was this built to solve that existing tools couldn't?\n2. How does it handle data flow and reactivity?\n3. How does it manage server vs client rendering?\n4. What are its architectural limitations and trade-offs?\n\nOnce you understand the *philosophy* of a tool, learning its syntax takes 48 hours.\n\nSave this learning framework \ud83d\udccc",
    mediaUrls: [],
    scheduledFor: '2026-12-11T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-11 EVENING FACEBOOK ---
  {
    id: 'sched_2026_12_11_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "THE CREDIBILITY EQUATION",
    carePillars: "Reliability + Alignment",
    caption: "What makes customers trust one business website over another?\n\nWhen a customer searches for a service online, they typically open three competing tabs in their browser. All three businesses claim to be the best.\n\nWhich one wins the inquiry? The one that establishes the highest degree of trust the fastest.\n\nHere are the credibility signals that tip the balance:\n1. Verifiable business identity. An active CAC registration number, verified physical office address, and executive contact line eliminate the fear of internet fraud.\n2. Concrete proof of competence. Specific case studies detailing exact client problems, the solutions implemented, and verified results speak louder than generic marketing claims.\n3. Transparent terms of service. Clear refund policies, delivery guarantees, and straightforward pricing demonstrate corporate maturity.\n\nTrust is built deliberately into every line of code and every headline on your platform.\n\nAt Veltrix Hub, we build trust-engineered web platforms designed to position your company as the authoritative, risk-free choice in your market.",
    firstComment: "Elevate your business credibility and win high-value clients. Connect with Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-dec11-why-customers-trust-website.jpg"],
    scheduledFor: '2026-12-11T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-11 EVENING TWITTER ---
  {
    id: 'sched_2026_12_11_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "NETWORKING & OPPORTUNITIES",
    carePillars: "Reliability + Emotion",
    caption: "Building my network on tech X.\n\nI\u2019m looking to connect with:\n\u2022 Frontend & Full-stack Engineers (React, TypeScript, Next.js)\n\u2022 Engineering Managers & Tech Leads\n\u2022 Startup Founders building ambitious digital products\n\u2022 Technical Recruiters sourcing top engineering talent\n\nI share practical frontend lessons, clean architecture breakdowns, and product insights daily.\n\nIf that\u2019s your world, drop a comment below with what you\u2019re currently building. Let's connect!",
    mediaUrls: [],
    scheduledFor: '2026-12-11T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-12 MORNING FACEBOOK ---
  {
    id: 'sched_2026_12_12_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "CONVERSION PRIORITY",
    carePillars: "Curiosity + Alignment",
    caption: "You do not need more website visitors if you are converting zero percent of the ones you already have.",
    firstComment: "Fix your conversion mechanics before spending on more traffic. Get a conversion audit with Veltrix Hub:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-dec12.jpg"],
    scheduledFor: '2026-12-12T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-12 MORNING TWITTER ---
  {
    id: 'sched_2026_12_12_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "CODE REVIEW CULTURE",
    carePillars: "Curiosity + Alignment",
    caption: "A great code review shouldn't feel like an interrogation.\n\nIt should feel like collaborative pair programming.\n\nBad review comments:\n\u274c \"Why did you do it this way? This is bad.\"\n\u274c \"Rewrite this.\"\n\nGreat review comments:\n\u2705 \"Have we considered how this behaves if the array is empty?\"\n\u2705 \"Extracting this logic into a custom hook might make unit testing easier. What do you think?\"\n\nAsk guiding questions instead of making demands.\n\nCode reviews build team culture just as much as they build software.",
    mediaUrls: [],
    scheduledFor: '2026-12-12T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-12 EVENING FACEBOOK ---
  {
    id: 'sched_2026_12_12_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "WHERE INQUIRIES DIE",
    carePillars: "Curiosity + Reliability",
    caption: "People visit your website, but why are they not making inquiries?\n\nIt is disheartening to see analytics confirm that hundreds of unique users visited your business website this week, yet your WhatsApp inbox remained completely quiet.\n\nWhere did those potential inquiries disappear?\n1. The question was too hard to ask. If asking a price or timeline requires filling out a six-field contact form and waiting for an email response, prospects abandon the effort.\n2. The proposition lacked relevance. If your headline uses generic industry terms instead of speaking directly to the customer's specific problem, they assume you do not understand their needs.\n3. No risk reversal. Without clear warranties, verified client reviews, or satisfaction guarantees, the perceived risk of reaching out feels too high.\n\nFixing these friction points transforms a dormant website into an active inquiry magnet.\n\nAt Veltrix Hub, we build conversion-engineered web platforms that make initiating inquiries as fast and frictionless as tapping a button.",
    firstComment: "Turn passive web visitors into active customer inquiries. Message Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-dec12-visitors-no-inquiries.jpg"],
    scheduledFor: '2026-12-12T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-12 EVENING TWITTER ---
  {
    id: 'sched_2026_12_12_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "PLATFORM OWNERSHIP",
    carePillars: "Reliability + Emotion",
    caption: "Building your entire business on Instagram or TikTok is building your house on rented land.\n\nSocial media is phenomenal for discovery and attention.\n\nBut you don't own:\n\u2022 The algorithm\n\u2022 Your follower reach\n\u2022 Your customer list\n\u2022 The checkout experience\n\nOne algorithm tweak or account suspension can cripple your revenue overnight.\n\nUse social media to capture attention. Direct that attention to an owned website and email list that you control 100%.",
    mediaUrls: [],
    scheduledFor: '2026-12-12T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-13 MORNING FACEBOOK ---
  {
    id: 'sched_2026_12_13_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "ACCESSIBLE CONTACT",
    carePillars: "Curiosity + Alignment",
    caption: "Make your contact details impossible to miss. A customer ready to pay should never have to search for your number.",
    firstComment: "We design frictionless communication pathways that connect ready buyers straight to your phone. Message us:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-dec13.jpg"],
    scheduledFor: '2026-12-13T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-13 MORNING TWITTER ---
  {
    id: 'sched_2026_12_13_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "FRONTEND SECURITY",
    carePillars: "Curiosity + Alignment",
    caption: "Frontend developers: Never assume that hiding something in the UI makes it secure.\n\nDisabling a 'Submit' button with `disabled={!isAdmin}` doesn't stop anyone from opening DevTools or sending a raw POST request with Postman.\n\nFrontend security rules every dev must know:\n\u2022 Client validation is for UX; Server validation is for SECURITY.\n\u2022 Never store sensitive API secrets in frontend `.env` bundles.\n\u2022 Sanitize user input to eliminate Cross-Site Scripting (XSS).\n\u2022 Use `HttpOnly`, `SameSite` cookies for session tokens.\n\nNever trust data simply because it came from your own frontend.\n\nSave this security reminder \ud83d\udccc",
    mediaUrls: [],
    scheduledFor: '2026-12-13T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-13 EVENING FACEBOOK ---
  {
    id: 'sched_2026_12_13_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "REMOVING BUYER HURDLES",
    carePillars: "Reliability + Alignment",
    caption: "Stop making customers work too hard to buy from your business.\n\nMany businesses unintentionally design their buying process like an obstacle course.\n\nConsider the typical journey:\n1. The customer finds your product and has to send a direct message to ask for the price.\n2. You take four hours to reply, by which time their buying impulse has cooled down.\n3. They agree to buy, but you have to manually copy-paste account numbers, ask for payment screenshots, and manually verify transactions.\n\nEvery manual hurdle cuts your completed sales by twenty to thirty percent.\n\nMake buying effortless. Provide transparent pricing, instant catalog selection, and direct one-click WhatsApp checkout so customers can complete transactions in sixty seconds.\n\nAt Veltrix Hub, we engineer streamlined e-commerce and lead workflows that eliminate friction and maximize completed business transactions.",
    firstComment: "Eliminate buying hurdles and accelerate your sales. Talk to Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-dec13-stop-making-customers-work-hard.jpg"],
    scheduledFor: '2026-12-13T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-13 EVENING TWITTER ---
  {
    id: 'sched_2026_12_13_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "RELATIONSHIP BUILDING",
    carePillars: "Reliability + Emotion",
    caption: "The biggest mistake in professional networking:\n\nOnly reaching out when you need a job.\n\nTrue networking is about planting seeds before you need shade:\n\u2022 Celebrate other people\u2019s project launches\n\u2022 Share thoughtful feedback on their work\n\u2022 Answer questions in public communities\n\u2022 Introduce two people who could help each other\n\nGive value with zero immediate expectation.\n\nWhen you treat networking as genuine relationship building, opportunities find you naturally.",
    mediaUrls: [],
    scheduledFor: '2026-12-13T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-14 MORNING FACEBOOK ---
  {
    id: 'sched_2026_12_14_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "LOCAL DISCOVERY",
    carePillars: "Curiosity + Alignment",
    caption: "If Google cannot find your business, your local competitors will take all your inbound customers.",
    firstComment: "We engineer websites with clean technical SEO and structured data to dominate local search. Chat with Veltrix Hub:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-dec14.jpg"],
    scheduledFor: '2026-12-14T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-14 MORNING TWITTER ---
  {
    id: 'sched_2026_12_14_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "ENGINEERING REALITY",
    carePillars: "Curiosity + Alignment",
    caption: "Software development in reality:\n\n30 minutes writing new code.\n2.5 hours figuring out why the existing code behaves unexpectedly.\n\nAnd that\u2019s completely normal.\n\nYour value as an engineer is never measured by:\n\u2022 Lines of code written\n\u2022 How fast your fingers type\n\u2022 How many files you touched\n\nYour value is measured by the quality, reliability, and business impact of the problems you resolve.\n\nSome of the most valuable days in engineering end with a net negative lines of code in your Git diff.",
    mediaUrls: [],
    scheduledFor: '2026-12-14T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-14 EVENING FACEBOOK ---
  {
    id: 'sched_2026_12_14_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "THE SEARCH VISIBILITY AUDIT",
    carePillars: "Curiosity + Alignment",
    caption: "Your website may be invisible to Google. Here is what to check:\n\nYou paid for a website, put it live, and waited for customers to find you on search engines. Months later, typing your service into Google yields nothing but your competitors.\n\nWhy does Google ignore your website?\n1. Missing Google Search Console integration. If you have not submitted your XML sitemap to Google, search crawler bots may not even know your pages exist.\n2. Generic page titles and meta descriptions. Leaving page titles as \"Home\" or \"Services\" tells Google zero about what you do or which city you serve.\n3. Severe mobile speed penalties. Google evaluates websites on mobile-first indexing. A website that takes five seconds to load on mobile is quietly demoted beneath faster competitors.\n\nFixing your technical SEO foundations is the most cost-effective long-term client acquisition strategy you can deploy.\n\nAt Veltrix Hub, every web platform we engineer comes pre-configured with schema markup, optimized metadata, and lightning-fast speed for maximum search engine discovery.",
    firstComment: "Make your business visible to high-intent Google searchers. Message Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-dec14-website-invisible-google.jpg"],
    scheduledFor: '2026-12-14T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-14 EVENING TWITTER ---
  {
    id: 'sched_2026_12_14_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "BUSINESS PAIN POINTS",
    carePillars: "Reliability + Emotion",
    caption: "To business owners and founders:\n\nIf you could fix ONE thing about your company\u2019s website this week, what would it be?\n\n1. Increasing the conversion rate (more enquiries & sales)\n2. Making it look modern and credible to high-end clients\n3. Fixing mobile responsiveness and slow loading speed\n4. Automating customer onboarding and appointment booking\n\nWhat\u2019s your current #1 bottleneck?\n\nReply with your site or drop a comment below. I\u2019ll give you a free, honest UX & performance review \ud83d\udc47",
    mediaUrls: [],
    scheduledFor: '2026-12-14T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-15 MORNING FACEBOOK ---
  {
    id: 'sched_2026_12_15_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: "DIGITAL WORKFORCE",
    carePillars: "Curiosity + Alignment",
    caption: "Your website should be your hardest-working employee: never sleeping, never taking a break, and always closing deals.",
    firstComment: "Build an automated digital powerhouse that generates revenue 24/7 with Veltrix Hub. Message us on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/morning/red-card-dec15.jpg"],
    scheduledFor: '2026-12-15T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-15 MORNING TWITTER ---
  {
    id: 'sched_2026_12_15_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "CODE MAINTAINABILITY",
    carePillars: "Curiosity + Alignment",
    caption: "Getting code to work is amateur hour.\n\nGetting code to be easily maintainable and extensible is professional engineering.\n\nBefore shipping, ask the Maintainability Test:\n\u2022 Are variable and function names self-descriptive?\n\u2022 Does each component have a single, well-defined responsibility?\n\u2022 Are complex business rules encapsulated in pure functions or custom hooks?\n\u2022 Are errors caught where they can be properly recovered?\n\nFast shipping wins hackathons. Maintainable architecture wins long-term businesses.\n\nSave this reminder \ud83d\udccc",
    mediaUrls: [],
    scheduledFor: '2026-12-15T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-15 EVENING FACEBOOK ---
  {
    id: 'sched_2026_12_15_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: "FRICTIONLESS E-COMMERCE",
    carePillars: "Reliability + Alignment",
    caption: "Your online store is not broken—it may be making buying harder than it needs to be.\n\nIf customers are visiting your e-commerce store, viewing products, and even adding items to cart, but dropping off before finalizing payment, you do not have a product issue.\n\nYou have a checkout friction leak:\n1. Forcing mandatory user account creation before purchase. First-time buyers want to pay and leave; demanding passwords and account setup causes sixty percent of cart abandonments.\n2. Hidden delivery fees revealed at the very end. State delivery pricing upfront on product pages so there are zero unpleasant surprises at checkout.\n3. Limited payment pathways. If you only accept one card gateway that frequently fails on local bank networks, provide direct transfer or instant WhatsApp order confirmation as seamless fallbacks.\n\nStreamline your e-commerce buying flow and watch your completed order volume compound immediately.\n\nAt Veltrix Hub, we build friction-free commerce platforms engineered for rapid mobile checkout, multi-channel payment fallbacks, and maximum order completion rates.",
    firstComment: "Optimize your online store for maximum completed orders. Contact Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ["/designs/executive/flyer-dec15-online-store-buying-hard.jpg"],
    scheduledFor: '2026-12-15T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  // --- 2026-12-15 EVENING TWITTER ---
  {
    id: 'sched_2026_12_15_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "RECRUITER / PORTFOLIO ADVICE",
    carePillars: "Reliability + Emotion",
    caption: "To engineering recruiters & hiring managers:\n\nWhen reviewing hundreds of frontend portfolios, what makes you stop scrolling and say: \"We need to interview this person\"?\n\nIs it:\n\u2022 A live, deployed product solving a real-world problem?\n\u2022 Clear write-ups explaining technical architecture & trade-offs?\n\u2022 Deep attention to detail in UX, animations, and accessibility?\n\u2022 High-quality open-source contributions?\n\nWould love to hear what truly moves the needle in 2026 \ud83d\udc47",
    mediaUrls: [],
    scheduledFor: '2026-12-15T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-16 MORNING TWITTER ---
  {
    id: 'sched_2026_12_16_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: "CORE ENGINEERING PHILOSOPHY",
    carePillars: 'Curiosity + Alignment',
    caption: "My 6-step framework for building world-class digital products:\n\n1. Understand the real problem (not just the surface request).\n2. Understand the human user (their constraints, habits, and pains).\n3. Select simple, reliable tools (avoid trend-chasing).\n4. Build the core loop first (cut every non-essential feature).\n5. Optimize for speed, accessibility, and edge-case errors.\n6. Iterate based on real behavioral data, not developer opinions.\n\nGreat software isn\u2019t built with the most lines of code.\nIt\u2019s built with the highest clarity of purpose.\n\nBookmark this blueprint \ud83d\udccc",
    mediaUrls: [],
    scheduledFor: '2026-12-16T08:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-12-16 EVENING TWITTER ---
  {
    id: 'sched_2026_12_16_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: "GRAND FINALE & NETWORK EXPANSION",
    carePillars: 'Reliability + Emotion',
    caption: "28 days. 56 posts. One mission:\n\nTo bridge frontend engineering with real-world business impact.\n\nIf you\u2019ve been following along, thank you.\n\nHere is my ongoing commitment:\n\u2022 Building intuitive, high-performance web products with React & TypeScript\n\u2022 Sharing transparent lessons, clean architecture, and practical tips\n\u2022 Collaborating with founders, engineering teams, and visionary leaders\n\nIf you're hiring, building a new product, or looking for an engineer who treats your business like their own:\n\nMy DMs are open. Let\u2019s build something extraordinary together \ud83d\ude80",
    mediaUrls: [],
    scheduledFor: '2026-12-16T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
];

const INITIAL_HISTORICAL_PUBLISHED: PublishedPost[] = [];

// Helper functions for persistent flyer caching across reloads & devices
function getFlyerSlotKey(scheduledFor: string, channel: string): string {
  try {
    const d = new Date(scheduledFor);
    const hour = d.getHours();
    const isMorning = hour < 14;
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}_${channel}_${isMorning ? 'am' : 'pm'}`;
  } catch (e) {
    return '';
  }
}

function getStoredFlyersCache(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('veltrix_flyers_cache');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveFlyerToCache(postId: string, scheduledFor: string, channel: string, dataUrl: string) {
  if (typeof window === 'undefined') return;
  try {
    const cache = getStoredFlyersCache();
    if (postId) cache[postId] = dataUrl;
    const slotKey = getFlyerSlotKey(scheduledFor, channel);
    if (slotKey) cache[slotKey] = dataUrl;
    localStorage.setItem('veltrix_flyers_cache', JSON.stringify(cache));
  } catch (e) {
    console.warn('Flyer cache storage warning:', e);
  }
}

function removeFlyerFromCache(postId: string, scheduledFor: string, channel: string) {
  if (typeof window === 'undefined') return;
  try {
    const cache = getStoredFlyersCache();
    if (postId) delete cache[postId];
    const slotKey = getFlyerSlotKey(scheduledFor, channel);
    if (slotKey) delete cache[slotKey];
    localStorage.setItem('veltrix_flyers_cache', JSON.stringify(cache));
  } catch (e) {}
}

function applyFlyerCacheToPosts(posts: ScheduledPost[]): ScheduledPost[] {
  const cache = getStoredFlyersCache();
  return posts.map((post) => {
    const cleanMedia = (post.mediaUrls || []).filter(
      (u) => !u.includes('/designs/flyers/') && !u.includes('veltrix-design')
    );
    if (cleanMedia.length > 0) {
      return { ...post, mediaUrls: cleanMedia };
    }
    const slotKey = getFlyerSlotKey(post.scheduledFor, post.channel);
    const cached = (post.id && cache[post.id]) || (slotKey && cache[slotKey]);
    if (cached) {
      return { ...post, mediaUrls: [cached] };
    }
    return { ...post, mediaUrls: [] };
  });
}

export const ContentCalendarPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 14)); // November 2026

  // Cache key v15 (strictly real posts, deduplicated, zero dummy data)
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('veltrix_scheduled_posts_v22');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return applyFlyerCacheToPosts(parsed);
          }
        } catch (e) {
          // ignore
        }
      }
    }
    return applyFlyerCacheToPosts(INITIAL_CURATED_SCHEDULED);
  });

  const [publishedPosts, setPublishedPosts] = useState<PublishedPost[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('veltrix_published_posts_v22');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((p: PublishedPost) => ({
              ...p,
              mediaUrls: (p.mediaUrls || []).filter(
                (u) => !u.includes('/designs/flyers/') && !u.includes('veltrix-design')
              )
            }));
          }
        } catch (e) {
          // ignore
        }
      }
    }
    return INITIAL_HISTORICAL_PUBLISHED;
  });

  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SCHEDULED' | 'PUBLISHED'>('ALL');
  const [platformFilter, setPlatformFilter] = useState<'FACEBOOK' | 'TWITTER'>('FACEBOOK');

  // Selected Day View Modal (for desktop grid inspection)
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Active day for Mobile Daily Calendar view (displays strictly for the day on mobile)
  const [mobileDay, setMobileDay] = useState<number>(() => {
    const today = new Date();
    return today.getMonth() === 10 && today.getFullYear() === 2026 ? today.getDate() : 16;
  });

  // Calendar Layout Mode: 'daily' (default on all devices to avoid confusion) vs 'month'
  const [calendarLayout, setCalendarLayout] = useState<'daily' | 'month'>('daily');

  // Fullscreen Lightbox Flyer Modal
  const [lightboxFlyer, setLightboxFlyer] = useState<{ url: string; title: string; badge?: string } | null>(null);

  // Schedule Post Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<'FACEBOOK' | 'TWITTER'>('TWITTER');
  const [newCaption, setNewCaption] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Direct publishing state (Metricool mode)
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [directPublishNotice, setDirectPublishNotice] = useState<{
    post: ScheduledPost;
    message: string;
  } | null>(null);

  // Auto-Publisher Countdown & Status State
  const [nowTime, setNowTime] = useState<number>(Date.now());
  const [isTriggeringAutoPublish, setIsTriggeringAutoPublish] = useState<boolean>(false);
  const [autoPublishStatus, setAutoPublishStatus] = useState<{
    lastRun?: string;
    publishedCount?: number;
    error?: string | null;
  }>({});
  const [isTokenModalOpen, setIsTokenModalOpen] = useState<boolean>(false);
  const [quickTokenInput, setQuickTokenInput] = useState<string>('');
  const [isSubmittingQuickToken, setIsSubmittingQuickToken] = useState<boolean>(false);
  const [quickTokenError, setQuickTokenError] = useState<string | null>(null);

  // Ticking 1-second timer for live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate next scheduled or overdue post
  const { overduePosts, nextUpcomingPost, countdownText } = React.useMemo(() => {
    const activeScheduled = scheduledPosts.filter((p) => p.status === 'SCHEDULED');
    const overdue = activeScheduled.filter((p) => new Date(p.scheduledFor).getTime() <= nowTime);
    const upcoming = activeScheduled
      .filter((p) => new Date(p.scheduledFor).getTime() > nowTime)
      .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());

    const nextPost = upcoming[0] || null;
    let cdText = '00:00:00';

    if (nextPost) {
      const diffMs = Math.max(0, new Date(nextPost.scheduledFor).getTime() - nowTime);
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs / (1000 * 60)) % 60);
      const secs = Math.floor((diffMs / 1000) % 60);
      cdText = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    return {
      overduePosts: overdue,
      nextUpcomingPost: nextPost,
      countdownText: cdText
    };
  }, [scheduledPosts, nowTime]);

  // Trigger Auto-Publisher
  const triggerAutoPublish = async (isManual = false) => {
    if (isTriggeringAutoPublish) return;
    setIsTriggeringAutoPublish(true);
    try {
      const res = await fetch('/api/v1/calendar/cron/publish-due', { method: 'POST' });
      const data = await res.json();
      if (data && data.success) {
        const failErr = data.results?.find((r: any) => r.status === 'FAILED')?.error;
        setAutoPublishStatus({
          lastRun: new Date().toLocaleTimeString(),
          publishedCount: data.publishedCount,
          error: failErr || null
        });

        if (data.publishedCount > 0) {
          setActionSuccess(`Auto-Publisher successfully published ${data.publishedCount} post(s)!`);
          setTimeout(() => setActionSuccess(null), 4000);
          fetchCalendarData();
        } else if (isManual) {
          if (failErr) {
            setActionSuccess(`Auto-publish note: ${failErr}`);
          } else {
            setActionSuccess('Auto-Publisher checked queue: all due posts are up to date.');
          }
          setTimeout(() => setActionSuccess(null), 4000);
        }
      }
    } catch (e: any) {
      setAutoPublishStatus({
        lastRun: new Date().toLocaleTimeString(),
        error: e.message || 'Network error triggering publisher'
      });
    } finally {
      setIsTriggeringAutoPublish(false);
    }
  };

  // Quick Token Submit
  const handleQuickTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTokenInput.trim()) return;
    setIsSubmittingQuickToken(true);
    setQuickTokenError(null);

    try {
      const res = await fetch('/api/v1/calendar/quick-update-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawToken: quickTokenInput.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsTokenModalOpen(false);
        setQuickTokenInput('');
        setActionSuccess(`Meta Page Token verified & saved! ${data.publishResult?.publishedCount || 0} due posts published to Facebook!`);
        setTimeout(() => setActionSuccess(null), 5000);
        fetchCalendarData();
      } else {
        setQuickTokenError(data.error?.message || 'Token verification failed. Please check token permissions.');
      }
    } catch (err: any) {
      setQuickTokenError(err.message || 'Connection failed');
    } finally {
      setIsSubmittingQuickToken(false);
    }
  };

  // Sync to localStorage with safe try-catch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('veltrix_scheduled_posts_v22', JSON.stringify(scheduledPosts));
      } catch (err) {
        console.warn('Storage quota exceeded, preserving in-memory state:', err);
      }
    }
  }, [scheduledPosts]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('veltrix_published_posts_v22', JSON.stringify(publishedPosts));
      } catch (err) {
        console.warn('Storage quota exceeded, preserving in-memory state:', err);
      }
    }
  }, [publishedPosts]);

  // Fetch from backend API
  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('veltrix_token');
      const response = await fetch('/api/v1/calendar/posts', {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
      const data = await response.json();
      if (data.success && data.data) {
        if (data.data.scheduledPosts && data.data.scheduledPosts.length > 0) {
          const cache = getStoredFlyersCache();
          const mappedScheduled: ScheduledPost[] = data.data.scheduledPosts.map((p: any) => {
            const isTwitter =
              p.channel === 'TWITTER' ||
              p.page?.pageId === 'AbiodunBuilds' ||
              p.socialPageId === 'AbiodunBuilds' ||
              p.caption?.includes('@AbiodunBuilds') ||
              p.caption?.includes('#ReactJS');

            const channel: 'TWITTER' | 'FACEBOOK' = isTwitter ? 'TWITTER' : 'FACEBOOK';
            const slotKey = getFlyerSlotKey(p.scheduledFor, channel);

            // Match with curated post by time or ID to preserve rich C.A.R.E. metadata & format
            const curated = INITIAL_CURATED_SCHEDULED.find((cur) => {
              if (cur.id === p.id) return true;
              const pTime = new Date(p.scheduledFor).getTime();
              const curTime = new Date(cur.scheduledFor).getTime();
              return cur.channel === channel && Math.abs(curTime - pTime) < 3600000;
            });

            let cleanMediaUrls = Array.isArray(p.mediaUrls)
              ? p.mediaUrls.filter(
                  (u: string) => !u.includes('/designs/flyers/') && !u.includes('veltrix-design')
                )
              : [];

            // Restore from flyer cache if backend has no flyer
            if (cleanMediaUrls.length === 0 && (cache[p.id] || (slotKey && cache[slotKey]))) {
              cleanMediaUrls = [cache[p.id] || cache[slotKey]];
            }

            // Sync into cache if backend has flyer
            if (cleanMediaUrls.length > 0) {
              if (p.id) cache[p.id] = cleanMediaUrls[0];
              if (slotKey) cache[slotKey] = cleanMediaUrls[0];
            }

            return {
              id: p.id,
              socialPageId: p.socialPageId || (isTwitter ? 'AbiodunBuilds' : '153585724815630'),
              caption: p.caption,
              mediaUrls: cleanMediaUrls.length > 0 ? cleanMediaUrls : (curated?.mediaUrls || []),
              scheduledFor: p.scheduledFor,
              status: p.status || 'SCHEDULED',
              channel,
              slotType: p.slotType || curated?.slotType,
              formatType: p.formatType || curated?.formatType,
              carePillars: p.carePillars || curated?.carePillars,
              firstComment: p.firstComment || curated?.firstComment,
              isManual: p.isManual ?? curated?.isManual,
              topicBadge: p.topicBadge || curated?.topicBadge || (isTwitter ? 'Tech Insight' : 'Facebook Broadcast'),
              page: p.page || {
                pageName: isTwitter ? 'Abiodun Builds (@AbiodunBuilds)' : 'Veltrix Hub',
                pageId: isTwitter ? 'AbiodunBuilds' : '153585724815630'
              }
            };
          });

          try {
            localStorage.setItem('veltrix_flyers_cache', JSON.stringify(cache));
          } catch (e) {}

          setScheduledPosts(mappedScheduled);
        }
        if (data.data.publishedPosts && data.data.publishedPosts.length > 0) {
          const mappedPublished: PublishedPost[] = data.data.publishedPosts.map((p: any) => {
            const isTwitter =
              p.channel === 'TWITTER' ||
              p.page?.pageId === 'AbiodunBuilds' ||
              p.caption?.includes('AbiodunBuilds');
            return {
              id: p.id,
              socialPageId: p.socialPageId,
              externalPostId: p.externalPostId,
              pageName: p.pageName || (isTwitter ? 'Abiodun Builds (@AbiodunBuilds)' : 'Veltrix Hub'),
              caption: p.caption,
              mediaUrls: Array.isArray(p.mediaUrls)
                ? p.mediaUrls.filter(
                    (u: string) => !u.includes('/designs/flyers/') && !u.includes('veltrix-design')
                  )
                : [],
              contentPillar: isTwitter ? '𝕏 Broadcast' : 'Facebook Broadcast',
              publishedAt: p.publishedAt,
              channel: isTwitter ? 'TWITTER' : 'FACEBOOK',
              permalinkUrl: p.permalinkUrl,
              metrics: p.metrics || { reach: 0, impressions: 0 }
            };
          });

          // Strict deduplication by externalPostId or caption
          const uniqueMap = new Map<string, PublishedPost>();
          for (const item of mappedPublished) {
            const key = item.externalPostId || item.caption.trim().slice(0, 60);
            if (!uniqueMap.has(key)) {
              uniqueMap.set(key, item);
            }
          }
          setPublishedPosts(Array.from(uniqueMap.values()));
        } else {
          setPublishedPosts([]);
        }
      }
    } catch (err) {
      console.info('Using loaded curated schedule for November 2026');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();

    // Automated background heartbeat: checks every 60 seconds for due posts
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/v1/calendar/cron/publish-due', { method: 'POST' });
        const data = await res.json();
        if (data && data.publishedCount > 0) {
          fetchCalendarData();
        }
      } catch (e) {
        // background check
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);


  // Batch upload single flyer for all Facebook posts on a specific day
  const handleBatchFacebookUpload = async (day: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setActionSuccess('Compressing & applying flyer image...');
      const dataUrl = await compressImageFile(file);

      // Find all scheduled Facebook posts for this day
      // A post is Facebook if it's NOT a twitter post
      let dayPosts = scheduledPosts.filter((p) => {
        const d = new Date(p.scheduledFor);
        const isSameDay = d.getDate() === day;
        const isTweet =
          p.channel === 'TWITTER' ||
          p.page?.pageId === 'AbiodunBuilds' ||
          p.socialPageId === 'AbiodunBuilds';
        return isSameDay && !isTweet;
      });

      // Secondary check by string match if local timezone differs from UTC
      if (dayPosts.length === 0) {
        const targetDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dayPosts = scheduledPosts.filter((p) => {
          const isTweet =
            p.channel === 'TWITTER' ||
            p.page?.pageId === 'AbiodunBuilds' ||
            p.socialPageId === 'AbiodunBuilds';
          return p.scheduledFor.startsWith(targetDateStr) && !isTweet;
        });
      }

      const targetPostIds = dayPosts.map((p) => p.id);

      if (targetPostIds.length === 0) {
        setActionSuccess(`No scheduled Facebook posts found for Day ${day}. Please schedule a Facebook post first.`);
        setTimeout(() => setActionSuccess(null), 3500);
        return;
      }

      // Persist to local flyer cache across all day's Facebook posts
      dayPosts.forEach((p) => {
        saveFlyerToCache(p.id, p.scheduledFor, p.channel, dataUrl);
      });

      setScheduledPosts((prev) =>
        prev.map((post) => {
          if (targetPostIds.includes(post.id)) {
            return { ...post, mediaUrls: [dataUrl] };
          }
          return post;
        })
      );

      setActionSuccess(`Single flyer successfully attached to all ${targetPostIds.length} Facebook posts for Day ${day}!`);
      setTimeout(() => setActionSuccess(null), 4000);

      // Persist to backend database
      const token = localStorage.getItem('veltrix_token');
      await fetch('/api/v1/calendar/posts/batch-flyer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          flyerUrl: dataUrl,
          postIds: targetPostIds
        })
      });
    } catch (err: any) {
      console.error('Batch upload error:', err);
      setActionSuccess(`Upload failed: ${err.message || 'Please choose a valid image file'}`);
      setTimeout(() => setActionSuccess(null), 4000);
    } finally {
      e.target.value = '';
    }
  };


  // Helper to distinguish 9:00 AM morning post vs 6:00 PM evening post
  const isMorningPost = (post: ScheduledPost) => {
    if (post.slotType === 'MORNING') return true;
    const d = new Date(post.scheduledFor);
    const hour = d.getHours();
    const utcHour = d.getUTCHours();
    return hour < 14 || utcHour < 14;
  };

  // Upload flyer for a specific time slot (9:00 AM or 6:00 PM) on a day
  const handleSlotFacebookUpload = async (
    day: number,
    slot: 'MORNING' | 'EVENING',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const slotLabel = slot === 'MORNING' ? '9:00 AM' : '6:00 PM';

    try {
      setActionSuccess(`Compressing & applying ${slotLabel} flyer to Facebook...`);
      const dataUrl = await compressImageFile(file);

      let targetPosts = scheduledPosts.filter((p) => {
        const d = new Date(p.scheduledFor);
        const isSameDay = d.getDate() === day;
        const isTweet =
          p.channel === 'TWITTER' ||
          p.page?.pageId === 'AbiodunBuilds' ||
          p.socialPageId === 'AbiodunBuilds';
        if (!isSameDay || isTweet) return false;
        return slot === 'MORNING' ? isMorningPost(p) : !isMorningPost(p);
      });

      if (targetPosts.length === 0) {
        const targetDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        targetPosts = scheduledPosts.filter((p) => {
          const isTweet =
            p.channel === 'TWITTER' ||
            p.page?.pageId === 'AbiodunBuilds' ||
            p.socialPageId === 'AbiodunBuilds';
          if (!p.scheduledFor.startsWith(targetDateStr) || isTweet) return false;
          return slot === 'MORNING' ? isMorningPost(p) : !isMorningPost(p);
        });
      }

      const targetPostIds = targetPosts.map((p) => p.id);

      if (targetPostIds.length === 0) {
        setActionSuccess(`No ${slotLabel} Facebook post scheduled for Day ${day}.`);
        setTimeout(() => setActionSuccess(null), 3500);
        return;
      }

      // Persist to local flyer cache
      targetPosts.forEach((p) => {
        saveFlyerToCache(p.id, p.scheduledFor, p.channel, dataUrl);
      });

      setScheduledPosts((prev) =>
        prev.map((post) => {
          if (targetPostIds.includes(post.id)) {
            return { ...post, mediaUrls: [dataUrl] };
          }
          return post;
        })
      );

      setActionSuccess(`${slotLabel} flyer applied to ${targetPostIds.length} Facebook post(s) for Day ${day}!`);
      setTimeout(() => setActionSuccess(null), 4000);

      const token = localStorage.getItem('veltrix_token');
      await fetch('/api/v1/calendar/posts/batch-flyer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          flyerUrl: dataUrl,
          postIds: targetPostIds
        })
      });
    } catch (err: any) {
      console.error('Slot flyer upload error:', err);
      setActionSuccess(`Upload failed: ${err.message || 'Please try again'}`);
      setTimeout(() => setActionSuccess(null), 4000);
    } finally {
      e.target.value = '';
    }
  };

  // Upload single flyer for a specific Facebook post
  const handleSinglePostFlyerUpload = async (postId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setActionSuccess('Compressing & attaching flyer to Facebook post...');
      const dataUrl = await compressImageFile(file);

      const targetPost = scheduledPosts.find((p) => p.id === postId);
      if (targetPost) {
        saveFlyerToCache(postId, targetPost.scheduledFor, targetPost.channel, dataUrl);
      } else {
        saveFlyerToCache(postId, '', 'FACEBOOK', dataUrl);
      }

      setScheduledPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return { ...post, mediaUrls: [dataUrl] };
          }
          return post;
        })
      );

      setActionSuccess('Facebook flyer attached successfully!');
      setTimeout(() => setActionSuccess(null), 3000);

      const token = localStorage.getItem('veltrix_token');
      await fetch(`/api/v1/calendar/posts/${postId}/media`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ mediaUrls: [dataUrl] })
      });
    } catch (err: any) {
      console.error('Single upload error:', err);
      setActionSuccess(`Upload notice: flyer saved locally.`);
      setTimeout(() => setActionSuccess(null), 4000);
    } finally {
      e.target.value = '';
    }
  };

  // Remove flyer from a post
  const handleRemovePostFlyer = async (postId: string) => {
    const targetPost = scheduledPosts.find((p) => p.id === postId);
    if (targetPost) {
      removeFlyerFromCache(postId, targetPost.scheduledFor, targetPost.channel);
    } else {
      removeFlyerFromCache(postId, '', 'FACEBOOK');
    }

    setScheduledPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return { ...post, mediaUrls: [] };
        }
        return post;
      })
    );

    setActionSuccess('Flyer removed from post.');
    setTimeout(() => setActionSuccess(null), 3000);

    try {
      const token = localStorage.getItem('veltrix_token');
      await fetch(`/api/v1/calendar/posts/${postId}/media`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ mediaUrls: [] })
      });
    } catch (err) {
      console.error('Failed to remove flyer on backend:', err);
    }
  };

  // Helper for manual fallback when Meta direct API token is missing
  const handleManualFallbackPost = async (post: ScheduledPost) => {
    try {
      await navigator.clipboard.writeText(post.caption);
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }

    const flyer = resolveFlyerForPost(post);
    if (flyer) {
      try {
        const a = document.createElement('a');
        a.href = flyer;
        a.download = `facebook-flyer-${post.slotType || 'slot'}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (e) {
        console.warn('Flyer auto-download failed:', e);
      }
    }

    const fbUrl = post.page?.pageId && !isNaN(Number(post.page.pageId))
      ? `https://facebook.com/${post.page.pageId}`
      : 'https://www.facebook.com';
    window.open(fbUrl, '_blank');

    // Move to published locally
    const updatedScheduled = scheduledPosts.filter((p) => p.id !== post.id);
    const newPublished: PublishedPost = {
      id: `pub_${Date.now()}`,
      socialPageId: post.socialPageId,
      pageName: post.page?.pageName || 'Facebook Page',
      caption: post.caption,
      mediaUrls: post.mediaUrls,
      contentPillar: post.topicBadge || 'Social Broadcast',
      publishedAt: new Date().toISOString(),
      channel: post.channel,
      metrics: { reach: 1, engagementRate: 0, reactions: 0 }
    };
    setScheduledPosts(updatedScheduled);
    setPublishedPosts([newPublished, ...publishedPosts]);
    setDirectPublishNotice(null);
    setActionSuccess('Caption copied & flyer downloaded! Opened Facebook to paste & finish.');
    setTimeout(() => setActionSuccess(null), 5000);
  };

  // Publish immediate handler (Direct Facebook API publishing like Metricool)
  const handlePublishNow = async (postId: string) => {
    const post = scheduledPosts.find((p) => p.id === postId);
    if (!post) return;

    if (post.channel === 'TWITTER' || post.page?.pageId === 'AbiodunBuilds') {
      setPublishingId(postId);
      setActionSuccess('Publishing to Twitter (X)...');
      try {
        const token = localStorage.getItem('veltrix_token');
        const res = await fetch(`/api/v1/calendar/publish-now/${postId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : ''
          },
          body: JSON.stringify({
          mediaUrls: post.mediaUrls || [],
          caption: post.caption,
          firstComment: post.firstComment
        })
        });
        const data = await res.json();
        const updatedScheduled = scheduledPosts.filter((p) => p.id !== postId);
        const newPublished: PublishedPost = {
          id: data.publishedPost?.id || `pub_${Date.now()}`,
          socialPageId: post.socialPageId,
          pageName: post.page?.pageName || 'Abiodun Builds (@AbiodunBuilds)',
          caption: post.caption,
          mediaUrls: post.mediaUrls,
          contentPillar: post.topicBadge || 'Tech Insight',
          publishedAt: new Date().toISOString(),
          channel: 'TWITTER',
          metrics: { reach: 0, engagementRate: 0, reactions: 0 }
        };
        setScheduledPosts(updatedScheduled);
        setPublishedPosts((prev) => {
          const filtered = prev.filter(
            (p) => p.id !== post.id && p.caption?.trim().slice(0, 60) !== post.caption?.trim().slice(0, 60)
          );
          return [newPublished, ...filtered];
        });

        if (data.permalinkUrl && data.permalinkUrl.includes('intent/tweet')) {
          window.open(data.permalinkUrl, '_blank');
          setActionSuccess('Post published to Twitter queue & opened composer!');
        } else {
          setActionSuccess('Published directly to Twitter (X)!');
        }
      } catch (err: any) {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.caption)}`, '_blank');
      } finally {
        setPublishingId(null);
        setTimeout(() => setActionSuccess(null), 4000);
      }
      return;
    }

    // Direct Facebook Publishing (Metricool Mode)
    setPublishingId(postId);
    setActionSuccess('Publishing directly to Facebook Page via Meta Graph API...');

    try {
      const token = localStorage.getItem('veltrix_token');
      const res = await fetch(`/api/v1/calendar/publish-now/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          mediaUrls: post.mediaUrls || [],
          caption: post.caption,
          firstComment: post.firstComment
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        const errorMsg =
          data.error?.message ||
          data.message ||
          'Meta Graph API rejected the direct publish request.';
        setDirectPublishNotice({ post, message: errorMsg });
        setActionSuccess(null);
        return;
      }

      // Success: Directly Published on Facebook!
      const updatedScheduled = scheduledPosts.filter((p) => p.id !== postId);
      const newPublished: PublishedPost = {
        id: data.publishedPost?.id || `pub_${Date.now()}`,
        socialPageId: post.socialPageId,
        pageName: post.page?.pageName || 'Facebook Page',
        caption: post.caption,
        mediaUrls: post.mediaUrls,
        contentPillar: post.topicBadge || 'Social Broadcast',
        publishedAt: new Date().toISOString(),
        channel: post.channel,
        metrics: { reach: 0, engagementRate: 0, reactions: 0 }
      };

      setScheduledPosts(updatedScheduled);
      setPublishedPosts((prev) => {
        const filtered = prev.filter(
          (p) => p.id !== post.id && p.caption?.trim().slice(0, 60) !== post.caption?.trim().slice(0, 60)
        );
        return [newPublished, ...filtered];
      });

      if (data.permalinkUrl) {
        setActionSuccess(`Published directly to Facebook! Post and First Comment are live on your Page.`);
      } else {
        setActionSuccess('Published directly to Facebook! Post and First Comment are live on your Page.');
      }
      setTimeout(() => setActionSuccess(null), 6000);
    } catch (err: any) {
      console.error('Publish error:', err);
      setDirectPublishNotice({
        post,
        message: err.message || 'Network connection failed while calling Meta Graph API'
      });
      setActionSuccess(null);
    } finally {
      setPublishingId(null);
    }
  };

  // Cancel scheduled post
  const handleCancelPost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled post?')) return;
    try {
      const token = localStorage.getItem('veltrix_token');
      await fetch(`/api/v1/calendar/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
    } catch (err) {
      // Offline fallback
    }

    setScheduledPosts(scheduledPosts.filter((p) => p.id !== postId));
    setActionSuccess('Scheduled post removed from calendar.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Handle new schedule submission
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaption || !newDate) return;

    setIsSubmitting(true);
    const isTweet = selectedChannel === 'TWITTER';

    const newPost: ScheduledPost = {
      id: `sched_${Date.now()}`,
      socialPageId: isTweet ? 'AbiodunBuilds' : '112352500475248',
      channel: selectedChannel,
      caption: newCaption,
      mediaUrls: newMediaUrl ? [newMediaUrl] : [],
      scheduledFor: new Date(newDate).toISOString(),
      status: 'SCHEDULED',
      topicBadge: isTweet ? '𝕏 TECH INSIGHT' : 'FACEBOOK BROADCAST',
      page: {
        pageName: isTweet ? 'Abiodun Builds (@AbiodunBuilds)' : 'Veltrixhq',
        pageId: isTweet ? 'AbiodunBuilds' : '112352500475248'
      }
    };

    try {
      const token = localStorage.getItem('veltrix_token');
      await fetch('/api/v1/calendar/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          caption: newCaption,
          scheduledFor: new Date(newDate).toISOString(),
          mediaUrls: newPost.mediaUrls
        })
      });
    } catch (err) {
      // Offline fallback
    }

    setScheduledPosts([...scheduledPosts, newPost]);
    setIsModalOpen(false);
    setNewCaption('');
    setNewDate('');
    setNewMediaUrl('');
    setIsSubmitting(false);
    setActionSuccess(`New ${selectedChannel === 'TWITTER' ? '𝕏 post' : 'Facebook post'} scheduled successfully!`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Quick reset to clean November 2026 schedule
  const handleResetToCurated = () => {
    if (window.confirm('Reset content calendar for November 2026? All posts will start clean without flyers.')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('veltrix_flyers_cache');
      }
      setScheduledPosts(INITIAL_CURATED_SCHEDULED);
      setPublishedPosts(INITIAL_HISTORICAL_PUBLISHED);
      localStorage.setItem('veltrix_scheduled_posts_v22', JSON.stringify(INITIAL_CURATED_SCHEDULED));
      localStorage.setItem('veltrix_published_posts_v22', JSON.stringify(INITIAL_HISTORICAL_PUBLISHED));
      setActionSuccess('Content calendar reloaded cleanly!');
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  // Month navigation helpers
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthYearLabel = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Generate calendar days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDay }, (_, i) => i);

  // Group posts by day
  const getPostsForDay = (day: number) => {
    const targetDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const sched = scheduledPosts.filter((p) => {
      const d = new Date(p.scheduledFor);
      // Strictly 9:00 AM and 6:00 PM alone (exclude 1:00 PM / midday completely)
      if ((p as any).slotType === 'MIDDAY' || d.getUTCHours() === 13 || d.getHours() === 13) return false;
      const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (str !== targetDateStr && d.getDate() !== day) return false;
      const isTweet = p.channel === 'TWITTER' || p.page?.pageId === 'AbiodunBuilds' || p.socialPageId === 'AbiodunBuilds';
      if (platformFilter === 'FACEBOOK') return !isTweet;
      if (platformFilter === 'TWITTER') return isTweet;
      return true;
    });

    const pub = publishedPosts.filter((p) => {
      const d = new Date(p.publishedAt);
      if (d.getUTCHours() === 13 || d.getHours() === 13) return false;
      const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (str !== targetDateStr && d.getDate() !== day) return false;
      const isTweet = p.channel === 'TWITTER' || p.socialPageId === 'AbiodunBuilds' || p.pageName?.includes('Abiodun');
      if (platformFilter === 'FACEBOOK') return !isTweet;
      if (platformFilter === 'TWITTER') return isTweet;
      return true;
    });

    // Deduplicate published posts by externalPostId or caption to avoid duplicate cards
    const pubMap = new Map<string, PublishedPost>();
    for (const p of pub) {
      const key = p.externalPostId || p.caption.trim().slice(0, 60);
      if (!pubMap.has(key)) {
        pubMap.set(key, p);
      }
    }

    return { sched, pub: Array.from(pubMap.values()) };
  };

  // Filtered lists for timeline
  const filteredScheduled = scheduledPosts.filter((p) => {
    const isTweet = p.channel === 'TWITTER' || p.page?.pageId === 'AbiodunBuilds' || p.socialPageId === 'AbiodunBuilds';
    if (platformFilter === 'FACEBOOK') return !isTweet;
    if (platformFilter === 'TWITTER') return isTweet;
    return true;
  });

  const filteredPublished = (() => {
    const raw = publishedPosts.filter((p) => {
      const isTweet = p.channel === 'TWITTER' || p.socialPageId === 'AbiodunBuilds' || p.pageName?.includes('Abiodun');
      if (platformFilter === 'FACEBOOK') return !isTweet;
      if (platformFilter === 'TWITTER') return isTweet;
      return true;
    });
    const map = new Map<string, PublishedPost>();
    for (const p of raw) {
      const key = p.externalPostId || p.caption.trim().slice(0, 60);
      if (!map.has(key)) {
        map.set(key, p);
      }
    }
    return Array.from(map.values());
  })();

  // Today marker
  const todayDate = new Date();
  const isCurrentMonth = todayDate.getFullYear() === year && todayDate.getMonth() === month;

  return (
    <div className="space-y-6">
      {/* Header with Live Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="w-5 h-5 text-emerald-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">Daily Content Dispatch</h1>
        </div>

        {/* Live Countdown Box (Only element kept from the banner) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-2.5 shadow-lg w-fit">
          <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
              {overduePosts.length > 0 ? 'Status' : 'Countdown'}
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-white tracking-widest">
              {overduePosts.length > 0 ? 'DUE NOW' : countdownText}
            </span>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-2 text-xs sm:text-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Error or token warning banner if token expired */}
      {autoPublishStatus.error && autoPublishStatus.error.toLowerCase().includes('token') && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>Facebook token expired. Renew to enable automatic posting:</span>
          <button
            onClick={() => setIsTokenModalOpen(true)}
            className="underline hover:text-white font-semibold text-rose-200 ml-1"
          >
            Update Token
          </button>
        </div>
      )}

      {/* Main View Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-3.5 sm:p-6 shadow-xl space-y-5">
        <div className="space-y-4">
            {/* Clean Date Navigator: Just Date & Prev/Next Buttons */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {new Date(year, month, mobileDay).toLocaleDateString('default', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </h2>

              {/* Just two buttons for prev and next */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (mobileDay <= 1) {
                      const prevDate = new Date(year, month - 1, 1);
                      setCurrentDate(prevDate);
                      const prevDaysInMonth = new Date(year, month, 0).getDate();
                      setMobileDay(prevDaysInMonth);
                    } else {
                      setMobileDay((d) => d - 1);
                    }
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95"
                  title="Previous Day"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (mobileDay >= daysInMonth) {
                      const nextDate = new Date(year, month + 1, 1);
                      setCurrentDate(nextDate);
                      setMobileDay(1);
                    } else {
                      setMobileDay((d) => d + 1);
                    }
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95"
                  title="Next Day"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Tabs (Facebook & Twitter) */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setPlatformFilter('FACEBOOK')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1 ${
                  platformFilter === 'FACEBOOK'
                    ? 'bg-[#1877F2] text-white font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Facebook className="w-3 h-3" />
                <span>Facebook</span>
              </button>
              <button
                onClick={() => setPlatformFilter('TWITTER')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1 ${
                  platformFilter === 'TWITTER'
                    ? 'bg-white text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <XLogo className="w-3 h-3" />
                <span>𝕏 Twitter</span>
              </button>
            </div>

            {/* Posts For This Selected Day */}
            <div className="space-y-3">
              {(() => {
                const { sched: mobileSched, pub: mobilePub } = getPostsForDay(mobileDay);
                const hasAny = mobileSched.length > 0 || mobilePub.length > 0;

                if (!hasAny) {
                  return (
                    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                        <CalendarIcon className="w-5 h-5" />
                      </div>
                      <p className="text-xs text-slate-300 font-medium">
                        No posts scheduled for {new Date(year, month, mobileDay).toLocaleDateString('default', { month: 'short', day: 'numeric' })}.
                      </p>
                      <button
                        onClick={() => {
                          setNewDate(
                            `${year}-${String(month + 1).padStart(2, '0')}-${String(mobileDay).padStart(2, '0')}T09:00`
                          );
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-500/20"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Post to Day {mobileDay}</span>
                      </button>
                    </div>
                  );
                }

                return (
                  <>
                    {mobileSched.map((post) => {
                      const isTweet = post.channel === 'TWITTER' || post.page?.pageId === 'AbiodunBuilds';
                      const flyerUrl = resolveFlyerForPost(post);
                      const isMorning = post.slotType === 'MORNING';

                      return (
                        <div
                          key={post.id}
                          className={`p-4 sm:p-5 rounded-2xl border bg-slate-950/90 transition-all flex flex-col justify-between space-y-4 shadow-xl ${
                            isTweet
                              ? 'border-slate-800'
                              : isMorning
                              ? 'border-amber-500/40 bg-amber-950/10'
                              : 'border-blue-500/40 bg-blue-950/10'
                          }`}
                        >
                          <div className="space-y-3">
                            {/* Card Header */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${
                                    isTweet
                                      ? 'bg-white/10 text-white border-white/20'
                                      : isMorning
                                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                      : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                  }`}
                                >
                                  {isTweet ? (
                                    <XLogo className="w-3 h-3" />
                                  ) : isMorning ? (
                                    <Sun className="w-3 h-3 text-amber-400" />
                                  ) : (
                                    <Moon className="w-3 h-3 text-blue-400" />
                                  )}
                                  <span>
                                    {isTweet
                                      ? (isMorning ? '09:00 AM Tech Insight' : '07:00 PM Tech Insight')
                                      : isMorning
                                      ? '09:00 AM (Automated)'
                                      : '07:00 PM (Automated)'}
                                  </span>
                                </span>
                              </div>

                              <span className="text-slate-400 font-mono text-[11px]">
                                {new Date(post.scheduledFor).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>

                            {/* Prominent Format Requirement Notification Banner */}
                            {post.formatType === 'RED_BACKGROUND' && (
                              <div className="px-3.5 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center justify-between">
                                <span>FORMAT REQUIREMENT: Solid Red Background Text Card</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-rose-500/30 rounded text-rose-100">
                                  RED BACKGROUND
                                </span>
                              </div>
                            )}
                            {post.formatType === 'PICTURE' && (
                              <div className="px-3.5 py-2.5 rounded-xl bg-blue-500/15 border border-blue-500/40 text-blue-200 text-xs font-semibold flex items-center justify-between">
                                <span>FORMAT REQUIREMENT: Attach 10/10 executive portrait image</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-500/30 rounded text-blue-100">
                                  EXECUTIVE IMAGE
                                </span>
                              </div>
                            )}
                            {post.formatType === 'TEXT_ONLY' && (
                              <div className="px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-semibold flex items-center justify-between">
                                <span>FORMAT REQUIREMENT: Post as clean text-only update</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-700/50 rounded text-slate-200">
                                  TEXT ONLY
                                </span>
                              </div>
                            )}

                            {/* C.A.R.E. Pillar indicator */}
                            {post.carePillars && (
                              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                                <Sparkles className="w-3 h-3" />
                                <span>C.A.R.E: {post.carePillars}</span>
                              </div>
                            )}

                          {/* Flyer Thumbnail (if attached) */}
                          {!isTweet && flyerUrl && (
                            <div
                              onClick={() =>
                                setLightboxFlyer({
                                  url: flyerUrl,
                                  title: post.topicBadge || 'Facebook Flyer',
                                  badge: post.channel
                                })
                              }
                              className="w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 cursor-pointer relative group"
                            >
                              <img src={flyerUrl} alt="Flyer" className="w-full h-auto object-contain block" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Maximize2 className="w-5 h-5 text-white" />
                                <span className="text-xs text-white font-semibold">View Full Resolution</span>
                              </div>
                            </div>
                          )}

                          {/* Caption for non-red-background posts (e.g. Evening posts show multi-paragraph text) */}
                          {post.formatType !== 'RED_BACKGROUND' && (
                            <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed line-clamp-4">
                              {post.caption}
                            </p>
                          )}

                          {/* Auto First Comment Preview */}
                            {post.firstComment && (
                              <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>Auto First Comment (Posted to Facebook)</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(post.firstComment || '');
                                      setActionSuccess('First comment copied to clipboard!');
                                      setTimeout(() => setActionSuccess(null), 2500);
                                    }}
                                    className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                                  >
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </button>
                                </div>
                                <p className="font-mono text-slate-300 text-[11px] whitespace-pre-line leading-relaxed">
                                  {post.firstComment}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Card Footer Actions */}
                          <div className="pt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80">
                            {isTweet ? (
                              <span className="text-[11px] font-mono text-slate-400">
                                {post.caption.length} / 280 chars
                              </span>
                            ) : flyerUrl ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    setLightboxFlyer({
                                      url: flyerUrl,
                                      title: post.topicBadge || 'Flyer',
                                      badge: post.channel
                                    })
                                  }
                                  className="text-[11px] text-blue-400 font-semibold hover:underline flex items-center gap-1"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>View Flyer</span>
                                </button>
                                <button
                                  onClick={() => handleRemovePostFlyer(post.id)}
                                  className="text-[11px] text-rose-400 font-semibold hover:underline flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Remove</span>
                                </button>
                              </div>
                            ) : (
                              <label
                                className={`cursor-pointer text-[11px] font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                                  isMorningPost(post)
                                    ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
                                    : 'text-blue-300 bg-blue-500/10 border-blue-500/30'
                                }`}
                              >
                                <Upload className="w-3 h-3" />
                                <span>Upload {isMorningPost(post) ? '9:00 AM' : '6:00 PM'} Flyer</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleSinglePostFlyerUpload(post.id, e)}
                                />
                              </label>
                            )}

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(post.caption);
                                  setActionSuccess('Caption copied to clipboard!');
                                  setTimeout(() => setActionSuccess(null), 2500);
                                }}
                                className="px-2.5 py-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg"
                              >
                                Copy
                              </button>
                              {isTweet ? (
                                <button
                                  onClick={() => {
                                    window.open(
                                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                        post.caption
                                      )}`,
                                      '_blank'
                                    );
                                  }}
                                  className="px-3 py-1 text-xs font-bold bg-white text-slate-950 hover:bg-slate-200 rounded-lg flex items-center gap-1"
                                >
                                  <XLogo className="w-3 h-3" />
                                  <span>Tweet on 𝕏</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handlePublishNow(post.id)}
                                  disabled={publishingId === post.id}
                                  className="px-3 py-1.5 text-xs font-semibold bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                                >
                                  {publishingId === post.id ? (
                                    <>
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                      <span>Publishing...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Facebook className="w-3 h-3" />
                                      <span>Publish to Facebook</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Published Posts for this Day */}
                    {mobilePub.map((post) => (
                      <div
                        key={post.id}
                        className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>
                              {post.channel === 'TWITTER' ? 'Published to 𝕏' : 'Published to Facebook'}
                            </span>
                          </span>
                          {post.permalinkUrl ? (
                            <a
                              href={post.permalinkUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
                            >
                              <span>View Live</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-400">Live</span>
                          )}
                        </div>
                        <p className="text-slate-300 line-clamp-2 leading-relaxed">{post.caption}</p>
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
          </div>
        </div>

      {/* ===================================================================== */}
      {/* FULLSCREEN LIGHTBOX FLYER MODAL: INSPECT & DOWNLOAD 1080x1080 FLYER */}
      {/* ===================================================================== */}
      {lightboxFlyer && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl flex flex-col items-center space-y-4">
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>{lightboxFlyer.title}</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {lightboxFlyer.url.endsWith('.jpg') || lightboxFlyer.url.endsWith('.jpeg')
                    ? '1024 × 1024 High-Resolution Executive Portrait Flyer'
                    : '1080 × 1080 High-Resolution Vector Flyer'}
                </p>
              </div>
              <button
                onClick={() => setLightboxFlyer(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Flyer Image Container */}
            <div className="w-full aspect-square rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
              <img
                src={lightboxFlyer.url}
                alt={lightboxFlyer.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Action Bar */}
            <div className="w-full flex items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-400">Official Veltrix Hub Brand Template</span>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxFlyer.url}
                  download={lightboxFlyer.url.split('/').pop() || (lightboxFlyer.url.endsWith('.jpg') ? 'veltrix-flyer.jpg' : 'veltrix-flyer.svg')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    Download Flyer ({lightboxFlyer.url.endsWith('.jpg') || lightboxFlyer.url.endsWith('.jpeg') ? 'JPG' : 'SVG'})
                  </span>
                </a>
                <button
                  onClick={() => setLightboxFlyer(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SCHEDULE POST MODAL */}
      {/* ===================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-5 sm:p-6 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-emerald-400" />
                  <span>Schedule Content with Flyer</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Plan automated broadcasts with matching visual flyers.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              {/* Channel Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target Channel
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedChannel('TWITTER');
                      setNewMediaUrl('');
                    }}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      selectedChannel === 'TWITTER'
                        ? 'bg-white text-slate-950 border-white shadow'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <XLogo className="w-4 h-4" />
                    <span>𝕏 (@AbiodunBuilds)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedChannel('FACEBOOK');
                    }}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      selectedChannel === 'FACEBOOK'
                        ? 'bg-blue-600 text-white border-blue-500 shadow'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Facebook className="w-4 h-4" />
                    <span>Facebook Page</span>
                  </button>
                </div>
              </div>

              {/* Optional Manual Flyer Upload */}
              {selectedChannel === 'FACEBOOK' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Flyer Visual (Optional - Manual Upload)
                    </label>
                    {newMediaUrl && (
                      <button
                        type="button"
                        onClick={() => setNewMediaUrl('')}
                        className="text-[11px] text-red-400 hover:text-red-300"
                      >
                        Remove flyer
                      </button>
                    )}
                  </div>
                  {newMediaUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2 flex items-center gap-3">
                      <img src={newMediaUrl} alt="Flyer preview" className="w-12 h-12 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-200 font-medium truncate">Flyer Attached</p>
                        <p className="text-[10px] text-emerald-400">Ready to publish</p>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl bg-slate-950/60 cursor-pointer transition-colors">
                      <Upload className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-xs text-slate-300 font-medium">Click to upload flyer image</span>
                      <span className="text-[10px] text-slate-500">PNG, JPG, WebP</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const dataUrl = await compressImageFile(file);
                              setNewMediaUrl(dataUrl);
                            } catch (err) {
                              console.error('Failed to process image:', err);
                            }
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              )}

              {/* Caption */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Post Copy & Text
                  </label>
                  <span
                    className={`text-[11px] font-mono font-semibold ${
                      newCaption.length > 280 && selectedChannel === 'TWITTER'
                        ? 'text-rose-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {newCaption.length} {selectedChannel === 'TWITTER' ? '/ 280 max' : 'chars'}
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder={
                    selectedChannel === 'TWITTER'
                      ? 'Share a technical tip, React architecture pattern, or founder milestone...'
                      : 'Share a client insight, educational tip, or service highlight...'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
                  required
                />
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Scheduled Publication Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  {isSubmitting ? 'Scheduling...' : 'Save to Content Calendar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* DIRECT PUBLISHING NOTICE MODAL (METRICOOL REQUIREMENT) */}
      {/* ========================================================================= */}
      {directPublishNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-blue-500/30 bg-[#0B0F19] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                  <Facebook className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-white">Direct Facebook Publishing</h3>
                  <p className="text-[11px] text-slate-400">Meta Graph API Authentication Notice</p>
                </div>
              </div>
              <button
                onClick={() => setDirectPublishNotice(null)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs text-amber-200 space-y-2">
              <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Meta API Notice:</span>
              </div>
              <p className="text-[11px] text-amber-300 leading-relaxed font-mono">
                {directPublishNotice.message}
              </p>
            </div>

            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-xs text-slate-300 space-y-2">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>How Metricool & Veltrix publish directly:</span>
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Metricool posts directly without human intervention because it is authorized with a genuine <strong>Meta Page Access Token</strong> (starts with <code className="text-blue-300 font-mono">EAAG...</code>).
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Once you paste your Page Access Token, every click on <strong>Publish</strong> will send your posts & flyers directly to your Facebook Page timeline automatically!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setDirectPublishNotice(null);
                  setIsTokenModalOpen(true);
                }}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-2.5 text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all text-center"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Update Facebook Token</span>
              </button>
              <button
                type="button"
                onClick={() => handleManualFallbackPost(directPublishNotice.post)}
                className="w-full sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 text-xs font-medium transition-colors"
                title="Copy caption, download flyer & open Facebook to post right now"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Post Manually Right Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* QUICK FACEBOOK TOKEN RENEWAL MODAL                                   */}
      {/* ===================================================================== */}
      {isTokenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Facebook className="w-5 h-5 text-[#1877F2]" />
                <h3 className="text-base font-bold text-white">Renew Facebook Page Access Token</h3>
              </div>
              <button
                onClick={() => {
                  setIsTokenModalOpen(false);
                  setQuickTokenError(null);
                }}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Meta Graph API tokens from the Explorer expire after 1-2 hours unless generated with a long-lived exchange. Paste your fresh or permanent Page Access Token (<code className="text-emerald-400 font-mono">EAAV...</code>) below:
            </p>

            <form onSubmit={handleQuickTokenSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Page Access Token (EAAV...)
                </label>
                <textarea
                  rows={3}
                  value={quickTokenInput}
                  onChange={(e) => setQuickTokenInput(e.target.value)}
                  placeholder="Paste your fresh EAAV... token here"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              {quickTokenError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{quickTokenError}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                <p className="font-semibold text-slate-200">How to get a Long-Lived / Permanent Token:</p>
                <p>1. In <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Meta Graph API Explorer</a>, select your Meta App and Page.</p>
                <p>2. Under Permissions, add: <code className="text-slate-200 font-mono">pages_manage_posts</code>, <code className="text-slate-200 font-mono">pages_read_engagement</code>, <code className="text-slate-200 font-mono">pages_show_list</code>.</p>
                <p>3. Generate the token and paste it here. Saving will automatically trigger publishing for today&apos;s pending posts!</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsTokenModalOpen(false);
                    setQuickTokenError(null);
                  }}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingQuickToken || !quickTokenInput.trim()}
                  className="px-5 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-[#1877F2]/20 disabled:opacity-50 transition-all active:scale-95"
                >
                  {isSubmittingQuickToken ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying & Saving...</span>
                    </>
                  ) : (
                    <span>Save & Auto-Publish Due Posts</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
