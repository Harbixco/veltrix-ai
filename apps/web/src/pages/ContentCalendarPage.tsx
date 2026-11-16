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
    scheduledFor: '2026-11-14T09:00:00.000Z',
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
    scheduledFor: '2026-11-14T19:00:00.000Z',
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
    scheduledFor: '2026-11-15T09:00:00.000Z',
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
    scheduledFor: '2026-11-15T19:00:00.000Z',
    status: 'PUBLISHED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },

  // --- MONDAY, NOV 16 ---
  {
    id: 'sched_nov16_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: 'REPETITIVE TASKS',
    carePillars: 'Curiosity + Alignment',
    caption: 'If your business takes more than 15 minutes to reply to a WhatsApp inquiry, you are quietly handing your paying customers over to your competitors.',
    firstComment: 'We build custom AI assistants that answer inquiries, qualify leads, and handle pricing on WhatsApp in under 20 seconds. Test a live demo with Veltrix Hub here:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-16T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov16_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'AUTOMATION LEVERAGE',
    carePillars: 'Curiosity + Alignment',
    caption: 'If your business takes 15 minutes to reply to an inquiry, you are giving away deals to faster competitors.\n\nSpeed is not just customer service. Speed is conversion rate optimization.\n\nAutomate the first response.',
    mediaUrls: [],
    scheduledFor: '2026-11-16T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov16_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'CUSTOMER GHOSTING SOLVED',
    carePillars: 'Reliability + Emotion',
    caption: "Customers ask \"How much?\" and disappear. Here is the real reason:\n\nWhen a customer asks for your price and gets just a bare number with no context, they compare you solely on cheapness.\n\nIf your response takes more than fifteen minutes, they have already messaged three of your competitors.\n\nAnd if you do not follow up within twenty-four hours, the lead is permanently dead.\n\nHere is what changes the outcome:\n\n1. Never quote a bare number alone. Explain what is included, who it is for, and the result it protects before stating the price.\n2. Cut your response window from twenty minutes to twenty seconds. Fast, structured answers build immediate credibility.\n3. Keep the conversation alive with one clarifying question instead of waiting for them to reply.\n\nAt Veltrix Hub, we build digital infrastructure and automated WhatsApp systems that reply in seconds, position your value before naming price, and nurture warm inquiries so you stop losing ready buyers to delay.",
    firstComment: "Send us your current website or catalog link on WhatsApp and we will review your inquiry response flow:\nhttps://wa.me/2348087098270",
    mediaUrls: ['/designs/executive/flyer-nov16-how-much-disappear.jpg'],
    scheduledFor: '2026-11-16T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov16_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'CONVERSION TIMING',
    carePillars: 'Reliability + Emotion',
    caption: "When a customer asks \"How much?\" and gets just a bare number, they compare you solely on cheapness.\n\nPosition your value before naming price. Reply in 20 seconds instead of 20 minutes.\n\nSpeed and positioning convert inquiries into sales.",
    mediaUrls: [],
    scheduledFor: '2026-11-16T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },

  // --- TUESDAY, NOV 17 ---
  {
    id: 'sched_nov17_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: 'WEBSITE SPEED',
    carePillars: 'Curiosity + Alignment',
    caption: 'A slow website on mobile is quietly bleeding your sales. If your page takes more than 3 seconds to load in Nigerian traffic, visitors leave before seeing your prices.',
    firstComment: 'We engineer sub-second web platforms designed to load instantly on mobile networks. Send your link to Veltrix Hub for a free technical speed audit:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-17T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov17_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'MOBILE PERFORMANCE',
    carePillars: 'Curiosity + Alignment',
    caption: 'Designers build websites on 4K MacBooks with fiber optic WiFi.\n\nReal customers visit on budget smartphones with 3G connections in traffic.\n\nIf your web app is not tested on slow networks, it is not production ready.',
    mediaUrls: [],
    scheduledFor: '2026-11-17T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov17_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'WEBSITE CONVERSION ARCHITECTURE',
    carePillars: 'Reliability + Emotion',
    caption: "Most business owners are solving the wrong online problem. Here is how to spot it:\n\nYou might think your business needs more followers, more traffic, or a larger ad budget.\n\nBut if nine out of ten visitors land on your page and leave without asking a single question, pouring more money into marketing only burns cash faster.\n\nThe issue is rarely visibility. It is usually clarity, speed, and trust:\n\n1. Does your homepage explain what you do and who you help in five seconds? If a visitor has to scroll through paragraphs to understand your offer, they close the tab.\n2. Is your contact path frictionless? If a ready buyer has to copy a phone number, save it manually, and open WhatsApp themselves, you lose them to friction.\n3. Can customers verify your credibility before they pay? Without visible proof, reviews, and clear terms, doubt kills the purchase.\n\nBefore you spend another naira on ads, inspect where your visitors drop off. At Veltrix Hub, we diagnose the leaks in your customer journey and build websites engineered to turn visitors into paying clients.",
    firstComment: "Send us your website link on WhatsApp and we will audit where your visitors are dropping off:\nhttps://wa.me/2348087098270",
    mediaUrls: ['/designs/executive/flyer-nov17-wrong-problem.jpg'],
    scheduledFor: '2026-11-17T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov17_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'CONVERSION ARCHITECTURE',
    carePillars: 'Reliability + Emotion',
    caption: "Most businesses don't have a traffic problem. They have a conversion leak.\n\nIf 95% of visitors leave without asking a question, buying more ads just burns money faster.\n\nFix clarity, speed, and trust first.",
    mediaUrls: [],
    scheduledFor: '2026-11-17T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },

  // --- WEDNESDAY, NOV 18 ---
  {
    id: 'sched_nov18_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: 'AUTOMATION LEVERAGE',
    carePillars: 'Emotion + Alignment',
    caption: 'Most founders work 14 hours a day not because they have too many clients, but because they have zero automated systems handling repetitive questions.',
    firstComment: 'Automate your customer replies, order capture, and lead qualification so you can focus strictly on closing high-value deals. Talk to our team on WhatsApp:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-18T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov18_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'TECH LEVERAGE',
    carePillars: 'Emotion + Alignment',
    caption: 'Most business owners work 14 hours a day because they act like human routers, manually copying and pasting the same information.\n\nBuild deterministic systems. Protect your cognitive bandwidth.',
    mediaUrls: [],
    scheduledFor: '2026-11-18T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov18_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'DIGITAL INFRASTRUCTURE',
    carePillars: 'Alignment + Emotion',
    caption: "Can a new customer understand what you sell in ten seconds?\n\nWhen someone lands on your website for the first time, they are not reading every word. They are scanning to see if they are in the right place.\n\nIf your headline is poetic, vague, or filled with buzzwords like \"innovative synergies\" and \"next-generation excellence\", visitors leave because thinking requires too much effort.\n\nA high-converting homepage answers three straightforward questions above the fold:\n\n1. What do you actually sell or build? State your service plainly in words a twelve-year-old would understand.\n2. Who is this specifically for? Name your target audience so the right client immediately recognizes themselves.\n3. What is the single next step? Provide one clear action button, whether that is booking a call or messaging on WhatsApp.\n\nClarity always outperforms cleverness. At Veltrix Hub, we build clean website architectures that pass the ten-second test and guide visitors straight toward a buying decision.",
    firstComment: "Does your website pass the 10-second test? Share your link with Veltrix Hub on WhatsApp for a quick breakdown:\nhttps://wa.me/2348087098270",
    mediaUrls: ['/designs/executive/flyer-nov18-ten-seconds.jpg'],
    scheduledFor: '2026-11-18T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov18_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'SYSTEMS OVER TASKS',
    carePillars: 'Alignment + Emotion',
    caption: "Can a visitor understand what you sell in 10 seconds without scrolling?\n\nIf your headline is filled with corporate jargon, visitors leave.\n\nState what you do, who it is for, and the next step. Clarity beats cleverness.",
    mediaUrls: [],
    scheduledFor: '2026-11-18T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },

  // --- THURSDAY, NOV 19 ---
  {
    id: 'sched_nov19_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: 'CONVERSION TIMING',
    carePillars: 'Curiosity + Reliability',
    caption: 'Customers never buy from the best product. They buy from the business that answers their questions first with zero friction.',
    firstComment: 'Give your brand a 24/7 automated assistant that qualifies leads and schedules appointments around the clock. Start a conversation with Veltrix Hub:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-19T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov19_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'SPEED WINS DEALS',
    carePillars: 'Curiosity + Reliability',
    caption: 'The company that replies in 20 seconds wins 70% of inbound sales deals over the company that replies in 20 minutes.\n\nFriction is the biggest conversion killer in modern commerce.',
    mediaUrls: [],
    scheduledFor: '2026-11-19T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov19_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'CUSTOMER SERVICE AUTOMATION',
    carePillars: 'Alignment + Reliability',
    caption: "Three website design mistakes that frustrate potential customers and kill inquiries:\n\n1. Hidden contact options. Forcing visitors to fill out an eight-field form when all they want is a quick WhatsApp answer creates immediate friction. A direct, one-click WhatsApp button should remain accessible on every screen.\n\n2. Unresponsive mobile layouts. Over eighty percent of your visitors are browsing on a smartphone, often on mobile data. If text shifts awkwardly, buttons are too tiny to tap, or pages take six seconds to load, visitors abandon your business for a competitor.\n\n3. Buried pricing and zero context. When visitors cannot find an idea of what working with you entails, they assume you are either overpriced or disorganized.\n\nYour website should remove hesitation, not create more questions. At Veltrix Hub, we build lightning-fast, mobile-first websites with direct conversion triggers that make contacting your business effortless.",
    firstComment: "Let us inspect your website on mobile and show you where friction is costing you clients:\nhttps://wa.me/2348087098270",
    mediaUrls: ['/designs/executive/flyer-nov19-design-mistakes.jpg'],
    scheduledFor: '2026-11-19T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov19_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'BOTTLENECK REMOVAL',
    carePillars: 'Alignment + Reliability',
    caption: "3 website mistakes killing your sales:\n\n1. Hidden WhatsApp button\n2. Slow mobile load speed on mobile data\n3. Zero pricing context or proof\n\nRemove the friction between your visitor and your contact button.",
    mediaUrls: [],
    scheduledFor: '2026-11-19T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },

  // --- FRIDAY, NOV 20 ---
  {
    id: 'sched_nov20_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: 'BRAND PROTECTION',
    carePillars: 'Curiosity + Alignment',
    caption: 'Operating an unregistered business means any competitor can legally take your brand name tomorrow and lock you out of corporate contracts.',
    firstComment: 'Veltrix Hub handles full CAC business name and company registration, status reports, and tax IDs. Protect your brand this week on WhatsApp:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-20T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov20_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'BRAND PROTECTION',
    carePillars: 'Curiosity + Alignment',
    caption: 'Operating an unregistered business is building on rented land.\n\nAny competitor can file for your brand name tomorrow and legally shut you down.\n\nProtect your legal identity before scaling your marketing.',
    mediaUrls: [],
    scheduledFor: '2026-11-20T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov20_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'PRICING POWER',
    carePillars: 'Alignment + Emotion',
    caption: "Customers need confidence, not just product photos.\n\nPosting high-resolution pictures of what you sell is easy. Any competitor can do that. What actually determines whether someone transfers money to an unfamiliar business is perceived risk.\n\nOnline buyers in Nigeria are naturally cautious. Before they buy, their mind is asking: Is this business real? Will they deliver? What happens if there is an issue?\n\nHere is what gives customers the confidence to pay:\n\n1. Verifiable credentials and real business details. Display your official business registration, working office location, and direct contact avenues prominently.\n2. Unedited client proof. Show real conversations, delivered projects, and before-and-after case studies instead of generic stock images.\n3. Clear terms and guarantees. State your turnaround timelines, delivery policies, and support terms openly before asking for payment.\n\nAt Veltrix Hub, our core motto is simple: We do not just build websites. We build trust. We construct digital infrastructure that removes customer doubt and positions your business as the dependable choice.",
    firstComment: "Build a digital presence that commands trust. Talk to our digital architecture team on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ['/designs/executive/flyer-nov20-confidence-not-photos.jpg'],
    scheduledFor: '2026-11-20T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov20_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'PERCEIVED VALUE',
    carePillars: 'Alignment + Emotion',
    caption: "Customers don't just need product photos. They need confidence.\n\nDisplay your verified credentials, real delivery proof, and clear policies upfront.\n\nReduce perceived risk and watch conversion rates double.",
    mediaUrls: [],
    scheduledFor: '2026-11-20T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },

  // --- SATURDAY, NOV 21 ---
  {
    id: 'sched_nov21_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: 'WEBSITE REVENUE',
    carePillars: 'Curiosity + Alignment',
    caption: 'Your business website should be your best salesperson, not an expensive digital flyer that brings zero phone calls and zero revenue.',
    firstComment: 'We design websites engineered with direct WhatsApp triggers and conversion architecture. Request a site review from Veltrix Hub:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-21T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov21_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'CONVERSION ARCHITECTURE',
    carePillars: 'Curiosity + Alignment',
    caption: 'A website without conversion architecture is just an expensive digital brochure.\n\nClear headlines. Clear social proof. Direct WhatsApp triggers.\n\nMake it easy for customers to pay you.',
    mediaUrls: [],
    scheduledFor: '2026-11-21T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov21_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'WEBSITE CHECKLIST',
    carePillars: 'Reliability + Alignment',
    caption: "Stop depending on WhatsApp to carry your whole sales process.\n\nWhatsApp is one of the greatest closing tools in modern commerce. But when WhatsApp is your only digital asset, you become the primary bottleneck of your own business.\n\nIf you have to manually type the same price list twenty times a day, re-send pictures already on your phone, and answer \"Where are you located?\" at 11:00 PM, you do not own a scalable system. You own an exhaustion trap.\n\nHere is the healthy division of labor:\n\n1. Let your website do the educating. Your website should showcase your portfolio, answer frequent objections, explain packages, and qualify serious clients before they reach out.\n2. Let WhatsApp do the closing. When a prospect clicks from your website to WhatsApp, they are already informed, pre-qualified, and ready to finalize.\n3. Connect automated workflows. When inquiries arrive after hours, automated assistants can answer basics, capture contact details, and schedule follow-ups.\n\nAt Veltrix Hub, we pair high-converting websites with intelligent WhatsApp automations so your business sells even while you rest.",
    firstComment: "Ready to automate your repetitive sales questions? Connect with Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ['/designs/executive/flyer-nov21-stop-depending-whatsapp.jpg'],
    scheduledFor: '2026-11-21T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov21_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'SIMPLICITY CONVERTS',
    carePillars: 'Reliability + Alignment',
    caption: "If WhatsApp is your entire sales system, you are the bottleneck.\n\nTyping the same price list 20 times a day is an exhaustion trap.\n\nLet your website educate and qualify. Let WhatsApp close the sale.",
    mediaUrls: [],
    scheduledFor: '2026-11-21T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },

  // --- SUNDAY, NOV 22 ---
  {
    id: 'sched_nov22_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: 'SCALABLE INFRASTRUCTURE',
    carePillars: 'Emotion + Alignment',
    caption: 'The difference between an exhausted vendor and a scalable business is whether your revenue stops the moment you turn off your phone to sleep.',
    firstComment: 'Build digital infrastructure that captures leads and processes inquiries 24 hours a day. Prepare your business for the week with Veltrix Hub:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-22T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov22_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'FOUNDER LEVERAGE',
    carePillars: 'Emotion + Alignment',
    caption: 'If your revenue stops the moment you fall asleep, you do not own a scalable company.\n\nBuild digital infrastructure that captures leads and qualifies prospects around the clock.',
    mediaUrls: [],
    scheduledFor: '2026-11-22T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov22_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'SYSTEMS AUDIT',
    carePillars: 'Alignment + Emotion',
    caption: "If you were a first-time visitor, would you trust your own business website?\n\nTake your phone right now. Open your business website on mobile data, just like a stranger would.\n\nLook at it with complete honesty:\n\n1. Does the page load in under three seconds, or does it hang while graphics struggle to render?\n2. Is the design clean and modern, or does it look like a template thrown together five years ago?\n3. Can a visitor verify who owns the business, where you are located, and how to reach a real human instantly?\n4. Are client reviews and delivered results visible without hunting through menus?\n\nIf your website feels dated, slow, or impersonal, customers will not tell you. They will quietly navigate to a competitor whose presentation looks established and secure.\n\nYour digital presence should reflect the genuine quality of your work. At Veltrix Hub, we audit and rebuild business websites to ensure every touchpoint commands credibility.",
    firstComment: "Request an honest, professional review of your business website on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ['/designs/executive/flyer-nov22-first-time-visitor.jpg'],
    scheduledFor: '2026-11-22T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov22_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'SCALE THE REVENUE',
    carePillars: 'Alignment + Emotion',
    caption: "Open your website on mobile right now.\n\nWould a stranger trust you enough to pay in 30 seconds?\n\nIf navigation is slow, contacts are buried, or proof is missing, visitors buy from someone else.",
    mediaUrls: [],
    scheduledFor: '2026-11-22T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-23 ---
  {
    id: 'sched_nov23_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: 'MOBILE FRICTION',
    carePillars: 'Curiosity + Alignment',
    caption: "If a customer has to pinch and zoom to read your price list on their phone, they have already decided not to buy.",
    firstComment: "We build clean, responsive mobile web platforms with direct WhatsApp checkout. Audit your mobile site with Veltrix Hub:\nhttps://wa.me/2348087098270",
    mediaUrls: [],
    scheduledFor: '2026-11-23T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov23_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'MOBILE FRICTION',
    carePillars: 'Curiosity + Alignment',
    caption: "If your website requires pinching and zooming on a phone, you are losing 80% of mobile buyers.\n\nMobile-first is not optional.",
    mediaUrls: [],
    scheduledFor: '2026-11-23T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov23_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'THE REAL COST OF A CHEAP WEBSITE',
    carePillars: 'Reliability + Alignment',
    caption: "A cheap website can become costly if customers struggle to use it.\n\nWhen hiring a web designer, cutting corners on price often looks like a smart expense saving. But a website is not a stationary expense. It is your primary digital storefront.\n\nHere is what a poorly built website actually costs you:\n\n1. Lost clients from broken mobile layouts. If buttons overlap or navigation menus refuse to close on an iPhone or Android, visitors leave immediately. You rarely see the sales you lost.\n2. Security vulnerabilities and zero backups. Cheap setups often skip SSL configuration, database backups, and software updates, leaving your business exposed to downtime and crashes.\n3. Rebuild expenses. Fixing structural code flaws, slow load speeds, and bad navigation six months down the line usually costs twice as much as building it properly from the start.\n\nBuild your business infrastructure on solid foundations. At Veltrix Hub, we engineer custom, robust web platforms designed for speed, security, and measurable client acquisition.",
    firstComment: "Do not let poor code cost you ready buyers. Talk to our engineering team on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ['/designs/executive/flyer-nov23-cheap-website-costly.jpg'],
    scheduledFor: '2026-11-23T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov23_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'THE REAL COST OF A CHEAP WEBSITE',
    carePillars: 'Reliability + Alignment',
    caption: "A cheap website is often the most expensive asset you own.\n\nBroken mobile buttons, 6-second load speeds, and zero backups cost you high-value clients every week.\n\nInvest in proper digital infrastructure.",
    mediaUrls: [],
    scheduledFor: '2026-11-23T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-24 ---
  {
    id: 'sched_nov24_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: 'CLARITY OVER CLEVERNESS',
    carePillars: 'Curiosity + Alignment',
    caption: "Poetic taglines sound smart in meetings, but plain language makes sales on the internet.",
    firstComment: "We engineer website architectures that state your value in 5 seconds and convert visitors immediately. Message our team:\nhttps://wa.me/2348087098270",
    mediaUrls: [],
    scheduledFor: '2026-11-24T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov24_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'CLARITY OVER CLEVERNESS',
    carePillars: 'Curiosity + Alignment',
    caption: "Vague taglines sound clever in boardroom meetings.\n\nPlain, simple language makes sales on the internet.\n\nClarity over poetry.",
    mediaUrls: [],
    scheduledFor: '2026-11-24T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov24_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'CONVERSION LEAKS EXPLAINED',
    carePillars: 'Curiosity + Alignment',
    caption: "Why do visitors leave a website without taking the next step?\n\nYou drove traffic to your page, but your inbox remains completely quiet. Where did the interest disappear?\n\nIn most cases, visitors do not leave because they dislike your product. They leave because of three silent conversion leaks:\n\n1. Analysis paralysis. Giving visitors five competing buttons—download our brochure, watch our video, follow our Instagram, sign up for a newsletter, or send an email—overwhelms them. A high-converting page guides visitors toward one primary action.\n2. Slow load speeds. Every additional second of loading time cuts conversion rates significantly. If a page takes longer than three seconds on mobile data, over half your visitors bounce before seeing your offer.\n3. Lack of immediate reassurance. If pricing or process details feel hidden, prospective clients assume there are hidden fees and back away.\n\nRemove the obstacles between your visitor and your contact button. At Veltrix Hub, we build streamlined customer journeys that make taking the next step simple and obvious.",
    firstComment: "Let us inspect your website and eliminate the friction in your customer journey:\nhttps://wa.me/2348087098270",
    mediaUrls: ['/designs/executive/flyer-nov24-visitors-leave-website.jpg'],
    scheduledFor: '2026-11-24T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov24_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'CONVERSION LEAKS EXPLAINED',
    carePillars: 'Curiosity + Alignment',
    caption: "Visitors don't leave websites because they dislike products.\n\nThey leave because of:\n- Analysis paralysis (too many buttons)\n- 4-second load speeds on mobile\n- Buried contact paths\n\nOne clear offer. One clear next step.",
    mediaUrls: [],
    scheduledFor: '2026-11-24T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-25 ---
  {
    id: 'sched_nov25_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: 'FOLLOW-UP SYSTEMS',
    carePillars: 'Reliability + Alignment',
    caption: "Eighty percent of sales are made on the second or third follow-up, yet most businesses never follow up once.",
    firstComment: "Automate your 24-hour and 48-hour prospect follow-ups on WhatsApp without typing manually. See how Veltrix Hub builds automated workflows:\nhttps://wa.me/2348087098270",
    mediaUrls: [],
    scheduledFor: '2026-11-25T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov25_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'FOLLOW-UP SYSTEMS',
    carePillars: 'Reliability + Alignment',
    caption: "Most deals are closed on the follow-up.\n\nYet 90% of SMEs send a price and never message back.\n\nAutomate follow-ups or leave revenue on the table.",
    mediaUrls: [],
    scheduledFor: '2026-11-25T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov25_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'THE FIRST IMPRESSION TEST',
    carePillars: 'Reliability + Emotion',
    caption: "Your website has only a moment to make a clear first impression.\n\nResearch consistently shows that visitors form an opinion about your business website in less than a second.\n\nBefore a prospective client reads your about page or inspects your service catalog, their subconscious makes a rapid calculation: Does this company look legitimate, organized, and capable?\n\nHere is what shapes that instant judgment:\n\n1. Clean typography and balanced spacing. Cluttered text walls, unreadable fonts, and neon colors scream amateur. Clean contrast and ample white space signal professional maturity.\n2. Fast, seamless rendering. A website that renders instantly on mobile tells the visitor your business operates with precision.\n3. An immediate, prominent call to action. When a visitor sees a direct way to communicate without hunting, they feel respected and welcome.\n\nDo not let poor visual architecture undermine years of hard work. At Veltrix Hub, we design corporate websites and brand identities that make an unforgettable, credible first impression.",
    firstComment: "Send your website to Veltrix Hub on WhatsApp for an executive visual and conversion review:\nhttps://wa.me/2348087098270",
    mediaUrls: ['/designs/executive/flyer-nov25-moment-first-impression.jpg'],
    scheduledFor: '2026-11-25T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov25_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'THE FIRST IMPRESSION TEST',
    carePillars: 'Reliability + Emotion',
    caption: "Visitors form an opinion about your business in under 1 second.\n\nClean typography, instant mobile rendering, and an obvious contact button signal competence.\n\nVisual clutter signals disorder.",
    mediaUrls: [],
    scheduledFor: '2026-11-25T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-26 ---
  {
    id: 'sched_nov26_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: 'TRUST BEFORE PITCH',
    carePillars: 'Reliability + Emotion',
    caption: "Show proof of what you have built before you ask strangers on the internet to trust you with their money.",
    firstComment: "Showcase your portfolio, client reviews, and verified credentials with an executive web presence from Veltrix Hub:\nhttps://wa.me/2348087098270",
    mediaUrls: [],
    scheduledFor: '2026-11-26T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov26_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'TRUST BEFORE PITCH',
    carePillars: 'Reliability + Emotion',
    caption: "Strangers on the internet do not owe you trust.\n\nShow verifiable proof, real testimonials, and clear terms before asking for the sale.",
    mediaUrls: [],
    scheduledFor: '2026-11-26T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov26_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'THE LANDING PAGE AUDIT',
    carePillars: 'Curiosity + Alignment',
    caption: "Before you spend more money on ads, check where your visitors will land.\n\nRunning Facebook, Instagram, or Google ads without an optimized destination page is the fastest way to waste a marketing budget.\n\nIf an advertisement promises a specific solution, but the link dumps visitors onto a generic homepage with no clear mention of that offer, the visitor feels disoriented and bounces.\n\nBefore launching your next marketing campaign, verify these four essentials:\n\n1. Message consistency. The exact headline and promise from your ad must be the very first thing visitors see on the page they open.\n2. Direct mobile contact. Include a prominent WhatsApp button pre-loaded with a message indicating which campaign they clicked.\n3. Lightning-fast mobile speed. Compress images and streamline code so the page opens instantly on 4G networks.\n4. Proof before the pitch. Feature real client results right next to your offer.\n\nTraffic is only an amplifier. If your destination converts well, ads become an investment instead of an expense. At Veltrix Hub, we engineer conversion-optimized landing pages that turn ad clicks into confirmed inquiries.",
    firstComment: "Need a high-converting landing page before your next campaign? Message our team on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ['/designs/executive/flyer-nov26-spend-more-on-ads.jpg'],
    scheduledFor: '2026-11-26T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov26_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'THE LANDING PAGE AUDIT',
    carePillars: 'Curiosity + Alignment',
    caption: "Running ads to a generic, unoptimized homepage is burning capital.\n\nMatch the ad headline on the landing page. Make the WhatsApp button permanent. Show proof first.\n\nTraffic only amplifies your conversion rate.",
    mediaUrls: [],
    scheduledFor: '2026-11-26T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-27 ---
  {
    id: 'sched_nov27_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: 'BUSINESS EMAIL TRUST',
    carePillars: 'Alignment + Reliability',
    caption: "Pitching corporate clients from a free personal email address instantly signals you are an informal freelancer rather than an established enterprise.",
    firstComment: "Get custom corporate domain emails, digital branding, and enterprise web architecture set up for your brand:\nhttps://wa.me/2348087098270",
    mediaUrls: [],
    scheduledFor: '2026-11-27T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov27_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'BUSINESS EMAIL TRUST',
    carePillars: 'Alignment + Reliability',
    caption: "Sending corporate proposals from a free personal email immediately hurts your pricing power.\n\nProfessional domains signal permanence.",
    mediaUrls: [],
    scheduledFor: '2026-11-27T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov27_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'PRICING POWER AND PERCEPTION',
    carePillars: 'Alignment + Emotion',
    caption: "Does your business look like it offers the value you charge for?\n\nThere is often a painful gap between how good a business actually is and how it looks on the internet.\n\nYou might deliver exceptional work, source premium materials, and provide world-class service. But if your online presence consists of inconsistent social flyers, a broken link in your bio, and no professional website, clients will treat you like a bargain vendor.\n\nPerception governs pricing power:\n\n1. Premium clients rarely buy through informal channels alone. Corporate decision-makers and high-ticket buyers require a professional web destination to justify spending significant budgets with you.\n2. Consistent brand architecture signals reliability. Uniform color palettes, sharp typography, and verified business emails (@yourcompany.com) communicate permanence.\n3. Clear service packages remove haggling. Presenting your solutions with structured deliverables sets a firm benchmark for your value.\n\nStop leaving your revenue to chance. At Veltrix Hub, we build elevated digital platforms that help businesses command the prices their expertise deserves.",
    firstComment: "Elevate your brand presence and command higher margins. Start a conversation on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ['/designs/executive/flyer-nov27-worth-price-you-charge.jpg'],
    scheduledFor: '2026-11-27T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov27_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'PRICING POWER AND PERCEPTION',
    carePillars: 'Alignment + Emotion',
    caption: "If your business delivers premium work but your website looks amateur, clients will treat you like a bargain vendor.\n\nPerception governs pricing power.\n\nUpgrade your digital presentation.",
    mediaUrls: [],
    scheduledFor: '2026-11-27T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-28 ---
  {
    id: 'sched_nov28_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: 'DIGITAL CATALOGS',
    carePillars: 'Alignment + Reliability',
    caption: "Sending fifty unorganized photos to a customer on WhatsApp creates confusion. A clean web catalog creates orders.",
    firstComment: "Launch a fast, search-ready digital product catalog with direct WhatsApp ordering. Start with Veltrix Hub:\nhttps://wa.me/2348087098270",
    mediaUrls: [],
    scheduledFor: '2026-11-28T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov28_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'DIGITAL CATALOGS',
    carePillars: 'Alignment + Reliability',
    caption: "Dumping 30 raw photos into a WhatsApp chat confuses customers.\n\nA clean web catalog with instant search turns interest into orders.",
    mediaUrls: [],
    scheduledFor: '2026-11-28T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov28_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'PERMANENT E-COMMERCE ASSETS',
    carePillars: 'Alignment + Reliability',
    caption: "Your products deserve more than a WhatsApp status that disappears after twenty-four hours.\n\nPosting your inventory on WhatsApp status is a great way to generate immediate, daily buzz. But relying solely on ephemeral stories creates severe business limitations:\n\n1. No searchable inventory. When a customer remembers an item you posted three days ago, they cannot find it unless they message you and ask you to search through your camera roll.\n2. Zero search engine discovery. Google cannot index a WhatsApp status. New customers actively searching online for what you sell will never discover your catalog.\n3. Manual payment and order taking. Typing account numbers and verifying transfers manually for twenty orders steals hours you could spend sourcing or expanding.\n\nGive your inventory a permanent home. A structured digital catalog or e-commerce website allows customers to browse 24/7, check specifications, and order with one click directly into your WhatsApp.\n\nAt Veltrix Hub, we build clean, fast e-commerce platforms engineered specifically for modern African merchants and SMEs.",
    firstComment: "Ready to launch a permanent digital store for your products? Message Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ['/designs/executive/flyer-nov28-whatsapp-status-disappears.jpg'],
    scheduledFor: '2026-11-28T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov28_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'PERMANENT E-COMMERCE ASSETS',
    carePillars: 'Alignment + Reliability',
    caption: "A WhatsApp status disappears in 24 hours. A web catalog works forever.\n\nGive your products a permanent home with search, specifications, and instant ordering.\n\nStop running your business out of your camera roll.",
    mediaUrls: [],
    scheduledFor: '2026-11-28T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  // --- 2026-11-29 ---
  {
    id: 'sched_nov29_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: 'FOUNDER FREEDOM',
    carePillars: 'Emotion + Alignment',
    caption: "The ultimate goal of business automation is not to work less. It is to spend your energy on growth instead of maintenance.",
    firstComment: "Reclaim your time and scale your customer acquisition. Prepare your systems for the new month with Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: [],
    scheduledFor: '2026-11-29T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov29_x_am',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'FOUNDER FREEDOM',
    carePillars: 'Emotion + Alignment',
    caption: "Automation is not about being lazy.\n\nIt is about freeing the founder to focus on high-ticket deals while systems handle the routine.",
    mediaUrls: [],
    scheduledFor: '2026-11-29T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov29_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'MONTHLY WEBSITE HEALTH AUDIT',
    carePillars: 'Reliability + Alignment',
    caption: "Three simple checks every business owner should run on their website once a month:\n\n1. Test your contact pathways. Click every WhatsApp button, submit a test inquiry through your form, and call your listed number. It is alarming how many businesses discover their contact form has been failing silently for weeks while leads vanished.\n\n2. Audit your mobile speed. Open Google PageSpeed Insights on your smartphone and enter your URL. If uncompressed images or heavy plugins have slowed your load time past four seconds, clean them up immediately.\n\n3. Verify your core information. Confirm that your opening hours, pricing guides, active services, and physical address are completely accurate. Outdated details erode customer trust faster than almost anything else.\n\nYour website is an active digital employee. A ten-minute monthly review protects your pipeline and ensures ready buyers never encounter a broken door.\n\nAt Veltrix Hub, we provide continuous technical maintenance and conversion monitoring so your digital systems stay fast, secure, and ready to convert.",
    firstComment: "Let us handle your monthly website maintenance and performance audits. Contact us on WhatsApp:\nhttps://wa.me/2348087098270",
    mediaUrls: ['/designs/executive/flyer-nov29-three-website-checks.jpg'],
    scheduledFor: '2026-11-29T19:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov29_x_pm',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    formatType: 'TEXT_ONLY',
    topicBadge: 'MONTHLY WEBSITE HEALTH AUDIT',
    carePillars: 'Reliability + Alignment',
    caption: "3 simple checks to run on your website monthly:\n\n1. Click every contact and WhatsApp button yourself\n2. Test load speed on your phone's 4G\n3. Verify pricing, hours, and addresses\n\nPrevent silent conversion leaks.",
    mediaUrls: [],
    scheduledFor: '2026-11-29T19:00:00.000Z',
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
      const saved = localStorage.getItem('veltrix_scheduled_posts_v16');
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
      const saved = localStorage.getItem('veltrix_published_posts_v16');
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
        localStorage.setItem('veltrix_scheduled_posts_v16', JSON.stringify(scheduledPosts));
      } catch (err) {
        console.warn('Storage quota exceeded, preserving in-memory state:', err);
      }
    }
  }, [scheduledPosts]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('veltrix_published_posts_v16', JSON.stringify(publishedPosts));
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
      localStorage.setItem('veltrix_scheduled_posts_v16', JSON.stringify(INITIAL_CURATED_SCHEDULED));
      localStorage.setItem('veltrix_published_posts_v16', JSON.stringify(INITIAL_HISTORICAL_PUBLISHED));
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
                  onClick={() => setMobileDay((d) => Math.max(1, d - 1))}
                  disabled={mobileDay <= 1}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-30 transition-all active:scale-95"
                  title="Previous Day"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMobileDay((d) => Math.min(daysInMonth, d + 1))}
                  disabled={mobileDay >= daysInMonth}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-30 transition-all active:scale-95"
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
                              className="w-full h-44 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 cursor-pointer relative group"
                            >
                              <img src={flyerUrl} alt="Flyer" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize2 className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          )}

                          {/* Caption or Visual Red Background Design Card */}
                          {post.formatType === 'RED_BACKGROUND' ? (
                            <div className="space-y-2">
                              <div className="relative w-full aspect-[16/10] bg-[#d91b42] rounded-2xl p-6 sm:p-8 flex items-center justify-center text-center shadow-xl border border-red-500/40 overflow-hidden group select-all">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-[#d91b42] to-red-700 opacity-95 pointer-events-none" />
                                
                                {/* Bold White Centered Text (Exact layout as template: NO hashtags, NO icons) */}
                                <p className="relative z-10 text-white font-bold text-sm sm:text-base md:text-lg leading-snug tracking-tight max-w-md mx-auto drop-shadow-sm font-sans">
                                  {post.caption}
                                </p>

                                {/* Action Overlay: Copy text or Download 1080x1080 PNG */}
                                <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard.writeText(post.caption);
                                      setActionSuccess('Red background text copied! Paste into Facebook red canvas.');
                                      setTimeout(() => setActionSuccess(null), 3000);
                                    }}
                                    className="px-2.5 py-1 bg-black/70 hover:bg-black/90 backdrop-blur-md text-white text-[10px] font-semibold rounded-lg border border-white/20 transition-all flex items-center gap-1"
                                    title="Copy Text to paste into Facebook Red Canvas"
                                  >
                                    <Copy className="w-3 h-3" />
                                    <span>Copy Text</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      downloadRedCardImage(post.caption, `red-card-${post.id}`);
                                      setActionSuccess('1080x1080 Red graphic downloaded!');
                                      setTimeout(() => setActionSuccess(null), 3000);
                                    }}
                                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#d91b42] text-[10px] font-bold rounded-lg shadow transition-all flex items-center gap-1"
                                    title="Download 1080x1080 High-Res PNG Image"
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>Save PNG</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
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
