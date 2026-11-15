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
  slotType?: 'MORNING' | 'MIDDAY' | 'EVENING';
  topicBadge?: string;
  formatType?: 'RED_BACKGROUND' | 'MANUAL_PROOF' | 'PICTURE' | 'TEXT_ONLY';
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
    id: 'sched_nov14_fb',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MIDDAY',
    formatType: 'MANUAL_PROOF',
    topicBadge: 'WEBSITE SPEED & CONVERSION',
    carePillars: 'Reliability + Alignment',
    caption: 'Why 70% of business websites in Nigeria lose customers before they even read the offer:\n\n1. Slow loading speed (over 4 seconds on mobile networks)\n2. No direct WhatsApp conversion button on the screen\n3. Cluttered layout that confuses first-time visitors\n\nAt Veltrix Hub, we build digital infrastructure designed for speed, clarity, and trust.',
    firstComment: 'Send us a direct message on WhatsApp for a free website speed audit:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-14T13:00:00.000Z',
    status: 'PUBLISHED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
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
    scheduledFor: '2026-11-15T09:00:00.000Z',
    status: 'PUBLISHED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov15_fb',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MIDDAY',
    formatType: 'MANUAL_PROOF',
    topicBadge: 'CORPORATE BRANDING & TRUST',
    carePillars: 'Reliability + Alignment',
    caption: 'Professional Branding vs Informal Business:\n\nCustomers will happily pay 3x more to a business with clean corporate branding, verified CAC credentials, and an official domain email.\n\nStop losing high-value clients to competitors with better presentation.',
    firstComment: 'Send Veltrix Hub a message on WhatsApp to upgrade your corporate branding:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-15T13:00:00.000Z',
    status: 'PUBLISHED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
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

  // --- MONDAY, NOV 16 ---
  {
    id: 'sched_nov16_fb_am',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MORNING',
    formatType: 'RED_BACKGROUND',
    topicBadge: 'REPETITIVE TASKS',
    carePillars: 'Curiosity + Alignment',
    caption: 'Most business owners spend 3 hours a day answering the exact same 5 questions on WhatsApp. Why are you still doing this manually in 2026?',
    firstComment: 'We connect an AI assistant directly to your WhatsApp to qualify leads and answer FAQs 24/7. Test a live demo here:\nhttps://wa.me/2348087098270',
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
    caption: 'Most business owners spend 3 hours a day answering the exact same 5 questions on WhatsApp.\n\nWhy are you still doing this manually in 2026?\n\nAutomate the repetitive inquiries. Focus on closing the high-value deals.',
    mediaUrls: [],
    scheduledFor: '2026-11-16T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov16_fb_mid',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MIDDAY',
    formatType: 'MANUAL_PROOF',
    isManual: true,
    topicBadge: 'REAL BOT CHAT PROOF',
    carePillars: 'Reliability + Alignment',
    caption: 'A client asked if our AI bot can handle Nigerian customer inquiries, slang, and price questions.\n\nHere is a real screenshot of the bot qualifying a lead and booking a service at 1:40 AM while the business owner was sound asleep.\n\nProof beats promises every single time.',
    firstComment: 'Want to see how this works for your business? Chat with our team:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-16T13:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov16_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'CUSTOMER GHOSTING SOLVED',
    carePillars: 'Reliability + Emotion',
    caption: 'Customers ask "How much?" and disappear. Here is the real reason:\n\nWhen a customer asks for your price and gets just a bare number with no context, they compare you solely on cheapness.\n\nIf your response takes more than 15 minutes, they have already messaged three of your competitors.\n\nAnd if you do not follow up within 24 hours, the lead is permanently dead.\n\nWe built Veltrix AI to fix this: instant 20-second replies, automated value positioning, and scheduled follow-ups on WhatsApp.',
    firstComment: 'Want to test the AI live on your own phone? Send a test message to our demo number on WhatsApp:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-16T18:00:00.000Z',
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
    caption: 'When a prospect asks "How much?" and you take 20 minutes to reply, they have already messaged 3 competitors.\n\nInstant response time is not customer service—it is conversion rate optimization.\n\nAutomate the first response or lose the sale.',
    mediaUrls: [],
    scheduledFor: '2026-11-16T18:00:00.000Z',
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
    caption: 'Having a slow website in 2026 is like locking your shop door and wondering why nobody is buying.',
    firstComment: 'Check how fast your site loads on mobile networks. Send your website link to Veltrix Hub for a free technical speed audit:\nhttps://wa.me/2348087098270',
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
    id: 'sched_nov17_fb_mid',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MIDDAY',
    formatType: 'MANUAL_PROOF',
    isManual: true,
    topicBadge: 'SPEED BENCHMARK PROOF',
    carePillars: 'Reliability + Alignment',
    caption: 'Before and after: We just rebuilt a client\'s e-commerce platform. Mobile load time dropped from 7.4 seconds to 0.8 seconds.\n\nResult? Inquiries doubled within 48 hours.\n\nSpeed is not a luxury. In business, speed is revenue.',
    firstComment: 'Want us to optimize your store for sub-second speeds? Inquire here:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-17T13:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov17_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'WEBSITE CONVERSION ARCHITECTURE',
    carePillars: 'Reliability + Emotion',
    caption: 'Why 80% of business websites fail to make a single sale:\n\n1. They treat their website like a static brochure instead of an active salesperson.\n2. There is no direct WhatsApp conversion button on the screen.\n3. Visitors cannot find pricing or answers to their objections in under 10 seconds.\n\nA high-converting website does not just look pretty. It removes hesitation and drives immediate action.',
    firstComment: 'Let us review your current website and show you where you are losing customers:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-17T18:00:00.000Z',
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
    caption: '3 reasons business websites fail to convert:\n\n1. No clear value proposition in the first 5 seconds\n2. Friction in contact (no one-click WhatsApp or booking)\n3. Buried pricing and zero social proof\n\nFix these three and watch conversions double.',
    mediaUrls: [],
    scheduledFor: '2026-11-17T18:00:00.000Z',
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
    topicBadge: 'COMMISSION OPPORTUNITY',
    carePillars: 'Curiosity + Emotion',
    caption: 'Find people who need websites, e-commerce stores, or AI automation. Bring the job, take your cut. Think like an entrepreneur.',
    firstComment: 'We pay direct commission on every closed web or automation project you refer to Veltrix Hub. Send us a message on WhatsApp to join our partner circle:\nhttps://wa.me/2348087098270',
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
    carePillars: 'Curiosity + Emotion',
    caption: 'You do not need to write code to make money in software.\n\nSpot businesses with terrible websites and manual customer service bottlenecks. Connect them to high-caliber builders. Earn on the deal.\n\nThink like an entrepreneur.',
    mediaUrls: [],
    scheduledFor: '2026-11-18T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov18_fb_mid',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MIDDAY',
    formatType: 'MANUAL_PROOF',
    isManual: true,
    topicBadge: 'COMMISSION PAYOUT PROOF',
    carePillars: 'Reliability + Emotion',
    caption: 'Just sent out another referral commission payout to an associate who connected us with a logistics firm in Lagos.\n\nYou do not need to know how to code to earn in tech. You just need to spot opportunities and connect the dots.',
    firstComment: 'Ready to partner with Veltrix Hub? Message us on WhatsApp:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-18T13:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov18_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'DIGITAL INFRASTRUCTURE',
    carePillars: 'Alignment + Emotion',
    caption: 'The difference between an expense and digital infrastructure:\n\nA website or an AI assistant is not an expense. It is a digital employee that never sleeps, never complains, and handles 50 customers at the same time.\n\nIf your business relies 100% on you being awake to make sales, you do not own a business. You own a 24-hour job.\n\nAutomation is how you reclaim your time while multiplying your revenue.',
    firstComment: 'See how automation works for your specific business model. Message us on WhatsApp:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-18T18:00:00.000Z',
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
    caption: 'If your revenue stops the moment you fall asleep, you do not own a business—you own an exhausting shift.\n\nDigital infrastructure (fast web apps, automated lead capture) works while you rest.\n\nBuild systems, not just tasks.',
    mediaUrls: [],
    scheduledFor: '2026-11-18T18:00:00.000Z',
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
    topicBadge: 'LIVE BOT TEST',
    carePillars: 'Curiosity + Reliability',
    caption: 'I just automated our business WhatsApp and handed it over to AI. If you doubt me, go and test it yourself: +2348087098270',
    firstComment: 'The AI answers FAQs, explains services, and qualifies leads in real-time. Test it right now:\nhttps://wa.me/2348087098270',
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
    topicBadge: 'AI IN PRODUCTION',
    carePillars: 'Curiosity + Reliability',
    caption: 'We connected an LLM directly to client APIs and WhatsApp.\n\nIt answers inquiries, qualifies budget, and schedules discovery calls in under 20 seconds.\n\nTest the live bot right now on WhatsApp: +2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-19T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov19_fb_mid',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MIDDAY',
    formatType: 'MANUAL_PROOF',
    isManual: true,
    topicBadge: 'BACKEND LOG PROOF',
    carePillars: 'Reliability + Alignment',
    caption: 'Screen capture from our backend logs this morning: 14 incoming customer inquiries answered in under 12 seconds with zero human typing.\n\nWhen customers get instant answers, they do not hesitate to make payment.',
    firstComment: 'See our automation stack in action. Chat with Veltrix Hub on WhatsApp:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-19T13:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov19_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'CUSTOMER SERVICE AUTOMATION',
    carePillars: 'Alignment + Reliability',
    caption: 'What happens when an AI agent handles your customer service:\n\nFirst, your response time drops from 45 minutes to 3 seconds.\n\nSecond, your leads get qualified before they ever reach your phone, filtering out time-wasters.\n\nThird, your business captures orders at 2:00 AM, on Sundays, and during public holidays without hiring additional night staff.\n\nThis is the standard for modern businesses in 2026.',
    firstComment: 'Get a custom AI assistant deployed for your brand this week. Chat with our team:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-19T18:00:00.000Z',
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
    caption: 'What custom AI automation actually delivers for businesses:\n\n- 3-second response times\n- 24/7 lead qualification while you sleep\n- Instant booking without back-and-forth messaging\n\nAI is not replacing jobs. It is eliminating bottlenecks.',
    mediaUrls: [],
    scheduledFor: '2026-11-19T18:00:00.000Z',
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
    topicBadge: 'CAC REGISTRATION',
    carePillars: 'Curiosity + Alignment',
    caption: 'Operating a business without CAC registration means any competitor can legally take your business name tomorrow.',
    firstComment: 'Veltrix Hub handles full CAC business name and company registration, status reports, and tax IDs. Inquire on WhatsApp:\nhttps://wa.me/2348087098270',
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
    id: 'sched_nov20_fb_mid',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MIDDAY',
    formatType: 'MANUAL_PROOF',
    isManual: true,
    topicBadge: 'CAC CERTIFICATE PROOF',
    carePillars: 'Reliability + Emotion',
    caption: 'Fresh CAC certificate delivered to a client in Abuja this morning. From name availability search to official certificate in hand without stress.\n\nLegal security gives corporate clients the confidence to send large invoices without fear.',
    firstComment: 'Register your business name or company with CAC this week. Inquire on WhatsApp:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-20T13:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov20_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'PRICING POWER',
    carePillars: 'Alignment + Emotion',
    caption: 'Why corporate presentation determines your pricing power:\n\nClients will happily pay 300,000 Naira to a registered business with a professional domain email and a fast website, while arguing over 50,000 Naira with an informal vendor on WhatsApp.\n\nTrust is not something you claim in words. It is demonstrated in your presentation.\n\nWhen your digital presence looks enterprise-grade, premium clients treat you accordingly.',
    firstComment: 'Upgrade your digital branding, CAC registration, and website with Veltrix Hub:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-20T18:00:00.000Z',
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
    caption: 'Pricing power comes from presentation and perceived risk.\n\nA company with verified CAC credentials, a custom domain, and an automated portal can charge 5x more for the exact same deliverable.\n\nUpgrade your presentation.',
    mediaUrls: [],
    scheduledFor: '2026-11-20T18:00:00.000Z',
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
    caption: 'If your website has not brought you a single paying client this month, it is not a website. It is just an expensive digital picture.',
    firstComment: 'Turn your website into an active lead generator. Book a free review on WhatsApp:\nhttps://wa.me/2348087098270',
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
    id: 'sched_nov21_fb_mid',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MIDDAY',
    formatType: 'MANUAL_PROOF',
    isManual: true,
    topicBadge: 'BUILD SESSION PROOF',
    carePillars: 'Reliability + Alignment',
    caption: 'Saturday build session: Polishing a new client dashboard with real-time analytics and WhatsApp webhook triggers.\n\nWeekend work hits different when you build tools that genuinely move the needle for real businesses.',
    firstComment: 'Need a custom portal or dashboard built for your team? Message us:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-21T13:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov21_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'WEBSITE CHECKLIST',
    carePillars: 'Reliability + Alignment',
    caption: 'Three things every profitable business website needs in 2026:\n\n1. A clear value statement above the fold: Explain what you do in 5 seconds so a 12-year-old could understand it.\n2. Frictionless contact: Direct one-click WhatsApp and call buttons permanently visible on mobile.\n3. Social proof: Client results, real testimonials, and verified credentials displayed before asking for the sale.',
    firstComment: 'Want a website engineered for conversions? Message us on WhatsApp:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-21T18:00:00.000Z',
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
    caption: '3 rules for websites that actually make sales:\n\n1. Explain the value in 5 seconds\n2. Permanent mobile WhatsApp button\n3. Proof before the pitch\n\nSimplicity converts.',
    mediaUrls: [],
    scheduledFor: '2026-11-21T18:00:00.000Z',
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
    topicBadge: 'AUTOMATION STRATEGY',
    carePillars: 'Emotion + Alignment',
    caption: 'The goal of automation is not to work less. The goal is to spend your energy on strategy while systems handle the repetitive routine.',
    firstComment: 'Plan your week ahead with automated workflows. Talk to Veltrix Hub:\nhttps://wa.me/2348087098270',
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
    topicBadge: 'FOUNDER BANDWIDTH',
    carePillars: 'Emotion + Alignment',
    caption: 'The goal of automation is not to be lazy.\n\nIt is to protect your highest-leverage asset: your mental bandwidth.\n\nLet bots answer the FAQs. You close the deals.',
    mediaUrls: [],
    scheduledFor: '2026-11-22T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov22_fb_mid',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MIDDAY',
    formatType: 'MANUAL_PROOF',
    isManual: true,
    topicBadge: 'WEEKEND ANALYTICS PROOF',
    carePillars: 'Reliability + Emotion',
    caption: 'Sunday review: While our office was closed today, our automated systems handled 38 lead inquiries and scheduled 4 discovery calls for Monday morning.\n\nSleep peacefully knowing your business is working even when you are not.',
    firstComment: 'Deploy 24/7 lead capture for your brand. Message Veltrix Hub:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-22T13:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov22_fb_pm',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'EVENING',
    formatType: 'PICTURE',
    topicBadge: 'SYSTEMS AUDIT',
    carePillars: 'Alignment + Emotion',
    caption: 'How to prepare your business infrastructure for the coming week:\n\nAudit where you lost time last week. Was it typing the same price list 20 times? Was it chasing up unclosed quotes manually?\n\nEvery hour spent on repetitive tasks is an hour stolen from closing bigger deals.\n\nSet up your systems once, and let them serve you indefinitely.',
    firstComment: 'Let us automate your business workflows this week. Start a conversation on WhatsApp:\nhttps://wa.me/2348087098270',
    mediaUrls: [],
    scheduledFor: '2026-11-22T18:00:00.000Z',
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
    caption: 'Every hour you spend typing repetitive WhatsApp replies is an hour stolen from growing your business.\n\nAudit your bottlenecks tonight.\n\nAutomate the routine. Scale the revenue.',
    mediaUrls: [],
    scheduledFor: '2026-11-22T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  }
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

  // Cache key v7 (strictly real posts, deduplicated, zero dummy data)
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('veltrix_scheduled_posts_v8');
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
      const saved = localStorage.getItem('veltrix_published_posts_v8');
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
          setActionSuccess(`🎉 Auto-Publisher successfully published ${data.publishedCount} post(s)!`);
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
        setActionSuccess(`🎉 Meta Page Token verified & saved! ${data.publishResult?.publishedCount || 0} due posts published to Facebook!`);
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
        localStorage.setItem('veltrix_scheduled_posts_v8', JSON.stringify(scheduledPosts));
      } catch (err) {
        console.warn('Storage quota exceeded, preserving in-memory state:', err);
      }
    }
  }, [scheduledPosts]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('veltrix_published_posts_v8', JSON.stringify(publishedPosts));
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
              mediaUrls: cleanMediaUrls,
              scheduledFor: p.scheduledFor,
              status: p.status || 'SCHEDULED',
              channel,
              topicBadge: p.topicBadge || (isTwitter ? '𝕏 TECH POST' : 'FACEBOOK BROADCAST'),
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
    setActionSuccess('📋 Caption copied & flyer downloaded! Opened Facebook to paste & finish.');
    setTimeout(() => setActionSuccess(null), 5000);
  };

  // Publish immediate handler (Direct Facebook API publishing like Metricool)
  const handlePublishNow = async (postId: string) => {
    const post = scheduledPosts.find((p) => p.id === postId);
    if (!post) return;

    if (post.channel === 'TWITTER' || post.page?.pageId === 'AbiodunBuilds') {
      setPublishingId(postId);
      setActionSuccess('Publishing to 𝕏 (Twitter)...');
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
          setActionSuccess('Post published to 𝕏 queue & opened composer!');
        } else {
          setActionSuccess('🎉 Published directly to 𝕏 (Twitter)!');
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
        setActionSuccess(`🎉 Published directly to Facebook! Post & First Comment are live on your Page timeline.`);
      } else {
        setActionSuccess('🎉 Published directly to Facebook! Post & First Comment are live on your Page timeline.');
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
      localStorage.setItem('veltrix_scheduled_posts_v8', JSON.stringify(INITIAL_CURATED_SCHEDULED));
      localStorage.setItem('veltrix_published_posts_v8', JSON.stringify(INITIAL_HISTORICAL_PUBLISHED));
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
      const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (str !== targetDateStr && d.getDate() !== day) return false;
      const isTweet = p.channel === 'TWITTER' || p.page?.pageId === 'AbiodunBuilds' || p.socialPageId === 'AbiodunBuilds';
      if (platformFilter === 'FACEBOOK') return !isTweet;
      if (platformFilter === 'TWITTER') return isTweet;
      return true;
    });

    const pub = publishedPosts.filter((p) => {
      const d = new Date(p.publishedAt);
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
                      const isMidday = post.slotType === 'MIDDAY' || post.isManual;
                      const isEvening = post.slotType === 'EVENING';

                      return (
                        <div
                          key={post.id}
                          className={`p-4 sm:p-5 rounded-2xl border bg-slate-950/90 transition-all flex flex-col justify-between space-y-4 shadow-xl ${
                            isTweet
                              ? 'border-slate-800'
                              : isMidday
                              ? 'border-purple-500/40 bg-purple-950/10'
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
                                      : isMidday
                                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                      : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                  }`}
                                >
                                  {isTweet ? (
                                    <XLogo className="w-3 h-3" />
                                  ) : isMorning ? (
                                    <Sun className="w-3 h-3 text-amber-400" />
                                  ) : isMidday ? (
                                    <Clock className="w-3 h-3 text-purple-400" />
                                  ) : (
                                    <Moon className="w-3 h-3 text-blue-400" />
                                  )}
                                  <span>
                                    {isTweet
                                      ? '𝕏 Tech Insight'
                                      : isMorning
                                      ? '09:00 AM (Automated)'
                                      : isMidday
                                      ? '01:00 PM (Manual Post)'
                                      : '06:00 PM (Automated)'}
                                  </span>
                                </span>

                                {/* Format Badge */}
                                {post.formatType === 'RED_BACKGROUND' && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                    🟥 Red Background
                                  </span>
                                )}
                                {post.formatType === 'MANUAL_PROOF' && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                    📸 Real Proof / Chat
                                  </span>
                                )}
                                {post.formatType === 'PICTURE' && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                                    🖼️ 10/10 Executive Picture
                                  </span>
                                )}
                              </div>

                              <span className="text-slate-400 font-mono text-[11px]">
                                {new Date(post.scheduledFor).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>

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

                          {/* Caption */}
                          <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed line-clamp-4">
                            {post.caption}
                          </p>

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
                <p className="text-[11px] text-slate-400">1080 × 1080 High-Resolution Vector Flyer</p>
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
                  download="veltrix-flyer.svg"
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Flyer (SVG)</span>
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
                Once you paste your Page Access Token in <strong>Social Accounts</strong>, every click on <strong>Publish</strong> will send your posts & flyers directly to your Facebook Page timeline automatically!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-slate-800">
              <Link
                to="/facebook-accounts"
                onClick={() => setDirectPublishNotice(null)}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-2.5 text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all text-center"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Update Token in Social Accounts</span>
              </Link>
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
                <p className="font-semibold text-slate-200">💡 How to get a Long-Lived / Permanent Token:</p>
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
