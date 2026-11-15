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
  // --- TODAY: SATURDAY, NOV 14 ---
  {
    id: 'sched_nov14_x1',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    topicBadge: 'REACT.JS ARCHITECTURE',
    caption: `React performance tip: Most lag isn't caused by missing useMemo.\n\nIt's caused by lifting state higher than it needs to be.\n\nKeep state local. When state stays near the component that actually uses it, 90% of unnecessary re-renders vanish.\n\n#ReactJS #TypeScript #WebDev`,
    mediaUrls: [],
    scheduledFor: '2026-11-14T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov14_fb',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MIDDAY',
    topicBadge: 'WEBSITE SPEED & CONVERSION',
    caption: `Why 70% of business websites in Nigeria lose customers before they even read the offer:\n\n1. Slow loading speed (over 4 seconds on mobile networks)\n2. No direct WhatsApp conversion button on the screen\n3. Cluttered layout that confuses first-time visitors\n\nAt Veltrix Hub, we build digital infrastructure designed for speed, clarity, and trust.\n\nSend us a DM for a free website review today.`,
    mediaUrls: [],
    scheduledFor: '2026-11-14T13:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov14_x2',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    topicBadge: 'AI AUTOMATION & WORKFLOWS',
    caption: `AI won't replace software engineers.\n\nBut an engineer who builds custom AI automations will replace an entire legacy agency.\n\nWe connect LLMs directly to client databases and WhatsApp to qualify leads in under 20 seconds.\n\n#AIAutomation #SoftwareEngineering`,
    mediaUrls: [],
    scheduledFor: '2026-11-14T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },

  // --- SUNDAY, NOV 15 ---
  {
    id: 'sched_nov15_x1',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    topicBadge: 'CLEAN ARCHITECTURE',
    caption: `Stop using useEffect to sync related state.\n\nIf a value can be computed from existing props or state, derive it during render:\n\nconst fullName = \`\${firstName} \${lastName}\`;\n\nNo extra render cycle. Zero synchronization bugs.\n\n#React #Frontend #CleanCode`,
    mediaUrls: [],
    scheduledFor: '2026-11-15T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov15_fb',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MIDDAY',
    topicBadge: 'CORPORATE BRANDING & TRUST',
    caption: `Professional Branding vs Informal Business:\n\nCustomers will happily pay 3x more to a business with clean corporate branding, verified CAC credentials, and an official domain email.\n\nStop losing high-value clients to competitors with better presentation. Let Veltrix Hub transform your brand perception this week.`,
    mediaUrls: [],
    scheduledFor: '2026-11-15T13:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov15_x2',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    topicBadge: 'AI WORKFLOW ARCHITECTURE',
    caption: `Most businesses don't need another generic ChatGPT prompt.\n\nThey need deterministic AI workflows:\n1. Ingest lead inquiry\n2. Query inventory & pricing via API\n3. Deliver tailored quotation in 15 seconds\n\nThat's how modern businesses scale.\n\n#VeltrixHub #Automation`,
    mediaUrls: [],
    scheduledFor: '2026-11-15T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },

  // --- MONDAY, NOV 16 ---
  {
    id: 'sched_nov16_x1',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    topicBadge: 'TYPESCRIPT PRO',
    caption: `TypeScript tip:\n\nStop reaching for 'any' when dealing with dynamic API responses.\n\nUse 'unknown' paired with a custom type guard. You get compiler safety without compromising flexibility.\n\nJunior devs rush with any; senior devs validate shapes.\n\n#TypeScript`,
    mediaUrls: [],
    scheduledFor: '2026-11-16T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov16_fb',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MIDDAY',
    topicBadge: 'WEBSITE MAINTENANCE & CARE',
    caption: `Did you know that an unmonitored website can go offline for days without the owner noticing?\n\nWith Veltrix Hub Website Maintenance, we provide 24/7 uptime monitoring, daily automated backups, and instant security patches so your business never misses a sale.\n\nFocus on running your business while we handle your digital infrastructure.`,
    mediaUrls: [],
    scheduledFor: '2026-11-16T13:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov16_x2',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    topicBadge: 'LEARN WEB DEV',
    caption: `How to escape tutorial hell in 3 steps:\n\n1. Stop watching 10-hour build videos on YouTube\n2. Pick 1 real-world app (e.g. an invoice builder)\n3. Build it from scratch without templates. Google each error yourself.\n\nStruggle is where real learning happens.\n\n#100DaysOfCode #LearnInPublic`,
    mediaUrls: [],
    scheduledFor: '2026-11-16T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },

  // --- TUESDAY, NOV 17 ---
  {
    id: 'sched_nov17_x1',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    topicBadge: 'FRONTEND REALITY',
    caption: `Designers design on a 4K MacBook.\nReal customers visit on a $90 smartphone with a weak 3G connection in traffic.\n\nIf your web app isn't tested on slow networks and budget devices, it isn't production ready.\n\n#Frontend #MobileFirst`,
    mediaUrls: [],
    scheduledFor: '2026-11-17T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov17_fb',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MIDDAY',
    topicBadge: 'CAC LEGAL REGISTRATION',
    caption: `Is your business legally registered with the CAC?\n\nOperating without CAC registration means any competitor can legally claim your business name tomorrow.\n\nVeltrix Hub handles complete CAC business registration, tax certificates, and official documents smoothly.\n\nProtect your brand name today. Send us a message on WhatsApp.`,
    mediaUrls: [],
    scheduledFor: '2026-11-17T13:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov17_x2',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    topicBadge: 'WEB DEV ROADMAP 2026',
    caption: `If I had to learn web development from zero in 2026:\n\nMonth 1: HTML, CSS & Flexbox layout\nMonth 2: Pure JavaScript & DOM manipulation\nMonth 3: React & TypeScript\nMonth 4: Build 3 fullstack CRUD apps\n\nDon't jump between 10 frameworks. Master fundamentals first.\n\n#CodeNewbie #WebDev`,
    mediaUrls: [],
    scheduledFor: '2026-11-17T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },

  // --- WEDNESDAY, NOV 18 ---
  {
    id: 'sched_nov18_x1',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    topicBadge: 'MOBILE APP DEV',
    caption: `React Native with the New Architecture and Hermes engine is incredible.\n\n60 FPS animations, near-instant startup, and 85% shared code across iOS and Android.\n\nFor most startups, building two separate native apps is financial waste.\n\n#ReactNative #MobileAppDev`,
    mediaUrls: [],
    scheduledFor: '2026-11-18T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov18_fb',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MIDDAY',
    topicBadge: 'AUTOMATED LEAD ACQUISITION',
    caption: `Automating customer inquiries:\n\nWhat if every prospect who messaged your business got their questions answered and booked a consultation within 30 seconds, even at 2 AM?\n\nAI customer automations by Veltrix Hub connect directly to WhatsApp and your CRM to capture sales 24/7.\n\nAsk us for a live demo.`,
    mediaUrls: [],
    scheduledFor: '2026-11-18T13:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov18_x2',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    topicBadge: 'FOUNDER & ENGINEER',
    caption: `What building Veltrix Hub taught me as a Frontend Engineer:\n\nWriting clean code is only 50% of the job. The other 50% is understanding business problems, meeting deadlines, and delivering software that makes clients money.\n\nEngineers who understand business are unstoppable.\n\n#BuildInPublic`,
    mediaUrls: [],
    scheduledFor: '2026-11-18T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },

  // --- THURSDAY, NOV 19 ---
  {
    id: 'sched_nov19_x1',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    topicBadge: 'STARTUP STRATEGY',
    caption: `Before building a mobile app, ask yourself:\n\nDoes your product really need push tokens, bluetooth, or offline storage?\n\nIf not, a high-performance Progressive Web App (PWA) gets you to market in 2 weeks for 1/3 the cost.\n\n#StartupAdvice #MobileDev`,
    mediaUrls: [],
    scheduledFor: '2026-11-19T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov19_fb',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MIDDAY',
    topicBadge: 'GRAPHIC DESIGN & ADS',
    caption: `Flyers that convert vs Flyers that get scrolled past:\n\nHigh-converting flyers have 1 bold headline, 3 clear benefits, an attractive offer, and a direct WhatsApp call-to-action.\n\nElevate your visual marketing with Veltrix Hub Graphic Design & Campaign Studio.`,
    mediaUrls: [],
    scheduledFor: '2026-11-19T13:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov19_x2',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    topicBadge: 'SOFTWARE ARCHITECTURE',
    caption: `Junior engineers debate frameworks.\nSenior engineers debate architecture.\nStaff engineers and founders focus on user experience and business outcomes.\n\nThe higher you climb, the simpler your solutions become.\n\n#SoftwareEngineering #TechCareer`,
    mediaUrls: [],
    scheduledFor: '2026-11-19T18:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },

  // --- FRIDAY, NOV 20 ---
  {
    id: 'sched_nov20_x1',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'MORNING',
    topicBadge: 'GET HIRED FAST',
    caption: `Stop building to-do apps to get hired as a frontend engineer.\n\nBuild one polished SaaS dashboard with:\n• User authentication\n• Dark/light theme\n• Data visualization charts\n• Responsive mobile UI\n\nEmployers want proof you can ship products.\n\n#WebDev #TechJobs`,
    mediaUrls: [],
    scheduledFor: '2026-11-20T09:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Abiodun Builds (@AbiodunBuilds)', pageId: 'AbiodunBuilds' }
  },
  {
    id: 'sched_nov20_fb',
    socialPageId: '112352500475248',
    channel: 'FACEBOOK',
    slotType: 'MIDDAY',
    topicBadge: 'STRATEGIC DIGITAL AUDIT',
    caption: `Ready to scale your business online before the end of the year?\n\nBook a strategic digital consultation with Veltrix Hub. We audit your existing online funnel, brand visibility, and lead generation channels to craft a clear roadmap for growth.\n\nSend us a DM or chat on WhatsApp to schedule your session.`,
    mediaUrls: [],
    scheduledFor: '2026-11-20T13:00:00.000Z',
    status: 'SCHEDULED',
    page: { pageName: 'Veltrixhq', pageId: '112352500475248' }
  },
  {
    id: 'sched_nov20_x2',
    socialPageId: 'AbiodunBuilds',
    channel: 'TWITTER',
    slotType: 'EVENING',
    topicBadge: 'ENGINEERING MANAGEMENT',
    caption: `Never push code on Friday afternoon without automated CI/CD rollbacks in place.\n\n10 minutes of pipeline discipline saves you 10 hours of weekend firefighting.\n\n#DevOps #EngineeringManagement #WebDevelopment`,
    mediaUrls: [],
    scheduledFor: '2026-11-20T18:00:00.000Z',
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
      const saved = localStorage.getItem('veltrix_scheduled_posts_v7');
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
      const saved = localStorage.getItem('veltrix_published_posts_v7');
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
  const [platformFilter, setPlatformFilter] = useState<'ALL' | 'FACEBOOK' | 'TWITTER'>('ALL');

  // Selected Day View Modal (for desktop grid inspection)
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Active day for Mobile Daily Calendar view (displays strictly for the day on mobile)
  const [mobileDay, setMobileDay] = useState<number>(() => {
    const today = new Date();
    return today.getMonth() === 10 && today.getFullYear() === 2026 ? today.getDate() : 15;
  });

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

  // Sync to localStorage with safe try-catch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('veltrix_scheduled_posts_v7', JSON.stringify(scheduledPosts));
      } catch (err) {
        console.warn('Storage quota exceeded, preserving in-memory state:', err);
      }
    }
  }, [scheduledPosts]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('veltrix_published_posts_v7', JSON.stringify(publishedPosts));
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
            caption: post.caption
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
          caption: post.caption
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
      localStorage.setItem('veltrix_scheduled_posts_v7', JSON.stringify(INITIAL_CURATED_SCHEDULED));
      localStorage.setItem('veltrix_published_posts_v7', JSON.stringify(INITIAL_HISTORICAL_PUBLISHED));
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Content Calendar</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Manual Flyer Workflow Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Twitter/𝕏 posts are text-only. Facebook posts support manual and 1-click batch flyer uploads across all 3 accounts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* View Switcher */}
          <div className="bg-slate-800/80 p-1 rounded-xl flex border border-slate-700 w-full sm:w-auto justify-between">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
                viewMode === 'calendar'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
                viewMode === 'timeline'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Timeline / Queue ({scheduledPosts.length})
            </button>
          </div>

          {/* Quick Curate Reset */}
          <button
            onClick={handleResetToCurated}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-all"
            title="Reset Calendar (No Flyers)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Calendar</span>
          </button>

          {/* Header Quick Upload Flyer for Today's 9:00 AM & 6:00 PM Slots */}
          <label className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-600/90 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl shadow cursor-pointer transition-all active:scale-95 shadow-amber-500/20">
            <Sun className="w-3.5 h-3.5" />
            <span>Upload 9:00 AM Flyer</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleSlotFacebookUpload(todayDate.getDate(), 'MORNING', e)}
            />
          </label>

          <label className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow cursor-pointer transition-all active:scale-95 shadow-blue-500/20">
            <Moon className="w-3.5 h-3.5" />
            <span>Upload 6:00 PM Flyer</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleSlotFacebookUpload(todayDate.getDate(), 'EVENING', e)}
            />
          </label>

          {/* Schedule Button */}
          <button
            onClick={() => {
              setNewDate(`${year}-${String(month + 1).padStart(2, '0')}-14T09:00`);
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto justify-center flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {actionSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-2 text-xs sm:text-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main View Area */}
      {viewMode === 'calendar' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-3.5 sm:p-6 shadow-xl">
          {/* ===================================================================== */}
          {/* MOBILE DAILY CALENDAR (SHOWN ONLY ON MOBILE TO AVOID CONFUSION)      */}
          {/* ===================================================================== */}
          <div className="md:hidden space-y-4">
            {/* Mobile Header: Daily Date Navigator */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Daily Schedule
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <h3 className="text-base font-bold text-white">
                      {new Date(year, month, mobileDay).toLocaleDateString('default', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </h3>
                    {isCurrentMonth && mobileDay === todayDate.getDate() && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Today
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setMobileDay((d) => Math.max(1, d - 1))}
                    disabled={mobileDay <= 1}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 transition-colors"
                    title="Previous Day"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {isCurrentMonth && mobileDay !== todayDate.getDate() && (
                    <button
                      onClick={() => setMobileDay(todayDate.getDate())}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                    >
                      Today
                    </button>
                  )}
                  <button
                    onClick={() => setMobileDay((d) => Math.min(daysInMonth, d + 1))}
                    disabled={mobileDay >= daysInMonth}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 transition-colors"
                    title="Next Day"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Scrollable Day Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-slate-800/80">
                {daysArray.map((day) => {
                  const { sched: dSched, pub: dPub } = getPostsForDay(day);
                  const count = dSched.length + dPub.length;
                  const isSelected = day === mobileDay;
                  const isTodayDay = isCurrentMonth && day === todayDate.getDate();

                  return (
                    <button
                      key={day}
                      onClick={() => setMobileDay(day)}
                      className={`flex flex-col items-center justify-center min-w-[44px] py-1.5 rounded-xl text-xs font-semibold transition-all relative shrink-0 ${
                        isSelected
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 font-bold scale-105 ring-1 ring-white/20'
                          : isTodayDay
                          ? 'bg-slate-800 text-emerald-300 border border-emerald-500/50'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <span className="text-[10px] uppercase opacity-75">
                        {new Date(year, month, day).toLocaleDateString('default', { weekday: 'narrow' })}
                      </span>
                      <span className="text-sm">{day}</span>
                      {count > 0 && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                            isSelected ? 'bg-white' : 'bg-emerald-400'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setPlatformFilter('ALL')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all text-center ${
                  platformFilter === 'ALL'
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({getPostsForDay(mobileDay).sched.length + getPostsForDay(mobileDay).pub.length})
              </button>
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

                      return (
                        <div
                          key={post.id}
                          className={`p-4 rounded-2xl border bg-slate-950/80 transition-all space-y-3 ${
                            isTweet ? 'border-slate-800' : 'border-blue-500/30'
                          }`}
                        >
                          {/* Card Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${
                                  isTweet
                                    ? 'bg-white/10 text-white border-white/20'
                                    : isMorningPost(post)
                                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                }`}
                              >
                                {isTweet ? (
                                  <XLogo className="w-3 h-3" />
                                ) : isMorningPost(post) ? (
                                  <Sun className="w-3 h-3 text-amber-400" />
                                ) : (
                                  <Moon className="w-3 h-3 text-blue-400" />
                                )}
                                <span>
                                  {isTweet
                                    ? '𝕏 Tech Hook'
                                    : isMorningPost(post)
                                    ? '9:00 AM Morning'
                                    : '6:00 PM Evening'}
                                </span>
                              </span>
                              {!isTweet && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                  {isMorningPost(post) ? '09:00 AM' : '06:00 PM'}
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

                    {/* Add Post Button for this Day */}
                    <button
                      onClick={() => {
                        setNewDate(
                          `${year}-${String(month + 1).padStart(2, '0')}-${String(mobileDay).padStart(
                            2,
                            '0'
                          )}T09:00`
                        );
                        setIsModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl border border-emerald-500/30 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Post to Day {mobileDay}</span>
                    </button>
                  </>
                );
              })()}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* DESKTOP MONTH CALENDAR GRID (SHOWN ON md: AND ABOVE SCREENS)          */}
          {/* ===================================================================== */}
          <div className="hidden md:block overflow-x-auto no-scrollbar">
            <div className="min-w-[640px] md:min-w-0">
              {/* Calendar Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-white">{monthYearLabel}</h2>
                  <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <button
                      onClick={prevMonth}
                      className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextMonth}
                      className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                    <button
                      onClick={() => setPlatformFilter('ALL')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        platformFilter === 'ALL'
                          ? 'bg-slate-700 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setPlatformFilter('TWITTER')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                        platformFilter === 'TWITTER'
                          ? 'bg-white text-slate-950 font-bold shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <XLogo className="w-3 h-3" />
                      <span>𝕏 Tech Cards</span>
                    </button>
                    <button
                      onClick={() => setPlatformFilter('FACEBOOK')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                        platformFilter === 'FACEBOOK'
                          ? 'bg-blue-600 text-white font-bold shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Facebook className="w-3 h-3" />
                      <span>Facebook Flyers</span>
                    </button>
                  </div>

                  <div className="hidden sm:flex items-center gap-3 text-xs pl-2 border-l border-slate-800">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      {scheduledPosts.length} Scheduled
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                      {publishedPosts.length} Published
                    </span>
                  </div>
                </div>
              </div>

              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className="py-2">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {blanksArray.map((_, i) => (
                  <div
                    key={`blank-${i}`}
                    className="min-h-[120px] bg-slate-950/40 rounded-xl border border-slate-800/40 opacity-40"
                  />
                ))}

                {daysArray.map((day) => {
                  const { sched, pub } = getPostsForDay(day);
                  const isToday = isCurrentMonth && todayDate.getDate() === day;
                  const totalPosts = sched.length + pub.length;

                  return (
                    <div
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`min-h-[120px] p-2 rounded-xl border transition-all flex flex-col justify-between cursor-pointer select-none ${
                        isToday
                          ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                          : totalPosts > 0
                          ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                          : 'bg-slate-950/40 border-slate-800/50 hover:border-slate-700'
                      }`}
                    >
                      {/* Day Number and Post Count Pill */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-xs font-bold ${
                            isToday
                              ? 'w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center -ml-0.5 -mt-0.5 shadow'
                              : 'text-slate-300'
                          }`}
                        >
                          {day}
                        </span>
                        {totalPosts > 0 && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                              isToday
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {totalPosts} post{totalPosts > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      {/* Post Mini Cards with Distinct Topic Flyer Badges */}
                      <div className="space-y-1 overflow-y-auto max-h-[85px]">
                        {sched.map((post) => {
                          const isTweet = post.channel === 'TWITTER' || post.page?.pageId === 'AbiodunBuilds';
                          return (
                            <div
                              key={post.id}
                              className={`p-1 rounded-md text-[10px] leading-tight flex items-center gap-1.5 truncate border ${
                                isTweet
                                  ? 'bg-white/10 text-slate-100 border-white/20'
                                  : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                              }`}
                              title={post.caption}
                            >
                              {isTweet ? (
                                <XLogo className="w-2.5 h-2.5 shrink-0 text-white" />
                              ) : resolveFlyerForPost(post) ? (
                                <img
                                  src={resolveFlyerForPost(post)}
                                  alt="Flyer thumb"
                                  className="w-4 h-4 rounded object-cover shrink-0 border border-slate-700"
                                />
                              ) : (
                                <Facebook className="w-2.5 h-2.5 shrink-0 text-blue-400" />
                              )}
                              <span className="truncate font-medium">
                                {post.topicBadge || (isTweet ? '𝕏 Tech Hook' : 'Facebook')}
                              </span>
                            </div>
                          );
                        })}

                        {pub.map((post) => (
                          <div
                            key={post.id}
                            className="p-1 rounded-md bg-emerald-500/10 text-emerald-300 text-[10px] leading-tight flex items-center gap-1.5 truncate border border-emerald-500/20"
                            title={post.caption}
                          >
                            {resolveFlyerForPost(post) && (
                              <img
                                src={resolveFlyerForPost(post)}
                                alt="Flyer thumb"
                                className="w-4 h-4 rounded object-cover shrink-0 border border-emerald-500/30"
                              />
                            )}
                            <span className="truncate">{post.contentPillar || 'Published'}</span>
                          </div>
                        ))}
                      </div>

                      {/* Bottom Cell Action */}
                      <div className="pt-1 text-[9px] text-slate-500 flex items-center justify-between">
                        <span>{isToday ? 'Today' : ''}</span>
                        <span className="text-emerald-400 font-semibold opacity-80">
                          {totalPosts} post{totalPosts > 1 ? 's' : ''} →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Timeline / Queue View */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-medium text-slate-300 shrink-0">Filter Status:</span>
              <div className="flex gap-1 shrink-0">
                {(['ALL', 'SCHEDULED', 'PUBLISHED'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      statusFilter === filter
                        ? 'bg-slate-700 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Channel Filter */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <span className="text-xs font-medium text-slate-300 shrink-0">Channel:</span>
              <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                <button
                  onClick={() => setPlatformFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    platformFilter === 'ALL'
                      ? 'bg-emerald-500 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Channels ({scheduledPosts.length + publishedPosts.length})
                </button>
                <button
                  onClick={() => setPlatformFilter('TWITTER')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    platformFilter === 'TWITTER'
                      ? 'bg-white text-slate-950 shadow font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <XLogo className="w-3.5 h-3.5" />
                  <span>𝕏 (@AbiodunBuilds)</span>
                </button>
                <button
                  onClick={() => setPlatformFilter('FACEBOOK')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    platformFilter === 'FACEBOOK'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Facebook className="w-3.5 h-3.5" />
                  <span>Facebook (Veltrix Hub)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Scheduled Posts */}
            {(statusFilter === 'ALL' || statusFilter === 'SCHEDULED') &&
              filteredScheduled.map((post) => {
                const isTweet = post.channel === 'TWITTER' || post.page?.pageId === 'AbiodunBuilds';
                const flyerUrl = resolveFlyerForPost(post);

                return (
                  <div
                    key={post.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-xl group"
                  >
                    <div>
                      {/* Card Header with Topic Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1.5 border ${
                            isTweet
                              ? 'bg-white/10 text-white border-white/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{post.topicBadge || (isTweet ? '𝕏 TECH POST' : 'FACEBOOK POST')}</span>
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {new Date(post.scheduledFor).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {/* Flyer Container for Facebook only; Twitter is text-only */}
                      {!isTweet && (
                        flyerUrl ? (
                          <div className="relative mb-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-square group-hover:border-slate-700 transition-all shadow-inner">
                            <img
                              src={flyerUrl}
                              alt="Facebook post flyer"
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                              <button
                                onClick={() =>
                                  setLightboxFlyer({
                                    url: flyerUrl,
                                    title: post.topicBadge || 'Facebook Flyer',
                                    badge: post.channel
                                  })
                                }
                                className="px-3 py-1.5 bg-white text-slate-950 rounded-lg text-xs font-bold shadow flex items-center gap-1 hover:bg-slate-200"
                              >
                                <Maximize2 className="w-3.5 h-3.5" />
                                <span>Inspect</span>
                              </button>
                              <button
                                onClick={() => handleRemovePostFlyer(post.id)}
                                className="p-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold"
                                title="Remove Flyer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] text-slate-300 flex items-center justify-between">
                              <span className="font-semibold text-blue-400">Facebook Flyer</span>
                              <span className="font-mono text-slate-400">1080 × 1080</span>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-4 rounded-xl border border-dashed border-slate-700 hover:border-blue-500/50 bg-slate-950/40 p-3.5 text-center transition-colors">
                            <label className="cursor-pointer flex items-center justify-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300">
                              <Upload className="w-4 h-4" />
                              <span>Upload Flyer for this Facebook Post</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleSinglePostFlyerUpload(post.id, e)}
                              />
                            </label>
                          </div>
                        )
                      )}

                      <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto mb-3 pr-1 font-sans">
                        {post.caption}
                      </p>

                      {/* First Comment box for Facebook, or 280-char badge for X */}
                      {isTweet ? (
                        <div className="mb-4 rounded-xl border border-slate-700 bg-slate-950/60 p-2.5 flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1.5 font-bold text-white">
                            <XLogo className="w-3.5 h-3.5" />
                            <span>Target: @AbiodunBuilds</span>
                          </span>
                          <span className="font-mono text-[10px] text-emerald-400 font-bold">
                            {post.caption.length} / 280 chars
                          </span>
                        </div>
                      ) : (
                        <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Pinned First Comment (Direct CTA)</span>
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `Want a free review of your business's online presence or website? Send Veltrix Hub a message on WhatsApp: https://wa.me/2348087098270`
                                );
                                setActionSuccess('Pinned first comment copied!');
                                setTimeout(() => setActionSuccess(null), 2500);
                              }}
                              className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-300 font-mono leading-relaxed">
                            Want a free review of your business's online presence? Send Veltrix Hub a message.
                            <br />
                            <span className="text-emerald-400">WhatsApp: https://wa.me/2348087098270</span>
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        {isTweet ? (
                          <>
                            <XLogo className="w-3.5 h-3.5 text-white" />
                            <span className="text-white font-medium">@AbiodunBuilds</span>
                          </>
                        ) : (
                          <>
                            <Facebook className="w-3.5 h-3.5 text-blue-400" />
                            <span>{post.page?.pageName || 'Veltrixhq'}</span>
                          </>
                        )}
                      </span>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                        {isTweet ? (
                          <>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(post.caption);
                                setActionSuccess('Tweet copied to clipboard!');
                                setTimeout(() => setActionSuccess(null), 2500);
                              }}
                              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors min-h-[38px] active:scale-95"
                              title="Copy tweet"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </button>

                            <button
                              onClick={() => {
                                window.open(
                                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.caption)}`,
                                  '_blank'
                                );
                              }}
                              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-slate-200 transition-colors shadow min-h-[38px] active:scale-95"
                              title="Tweet on X"
                            >
                              <XLogo className="w-3.5 h-3.5" />
                              <span>Tweet on 𝕏</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(post.caption);
                                setActionSuccess('Facebook post caption copied!');
                                setTimeout(() => setActionSuccess(null), 2500);
                              }}
                              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors min-h-[38px] active:scale-95"
                              title="Copy post"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </button>

                            <button
                              onClick={() => handlePublishNow(post.id)}
                              disabled={publishingId === post.id}
                              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold rounded-xl transition-colors min-h-[38px] active:scale-95 shadow-sm disabled:opacity-50"
                              title="Direct Meta publish like Metricool"
                            >
                              {publishingId === post.id ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Publishing...</span>
                                </>
                              ) : (
                                <>
                                  <Facebook className="w-3.5 h-3.5" />
                                  <span>Publish to Facebook</span>
                                </>
                              )}
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handleCancelPost(post.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
                          title="Cancel post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* Published Posts */}
            {(statusFilter === 'ALL' || statusFilter === 'PUBLISHED') &&
              filteredPublished.map((post) => {
                const flyerUrl = resolveFlyerForPost(post);
                return (
                  <div
                    key={post.id}
                    className="bg-slate-900 border border-slate-800/70 rounded-2xl p-5 flex flex-col justify-between transition-all opacity-95 hover:opacity-100 shadow-xl group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{post.contentPillar || 'PUBLISHED'}</span>
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(post.publishedAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      {flyerUrl && (
                        <div className="relative mb-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-square group-hover:border-slate-700 transition-all">
                          <img
                            src={flyerUrl}
                            alt="Published flyer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                            <button
                              onClick={() =>
                                setLightboxFlyer({
                                  url: flyerUrl,
                                  title: post.contentPillar || 'Published Flyer',
                                  badge: post.channel
                                })
                              }
                              className="px-3 py-1.5 bg-white text-slate-950 rounded-lg text-xs font-bold shadow flex items-center gap-1 hover:bg-slate-200"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                              <span>View Full Size</span>
                            </button>
                          </div>
                        </div>
                      )}

                      <p className="text-slate-300 text-xs leading-relaxed line-clamp-3 mb-4">
                        {post.caption}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">
                        Status:{' '}
                        <strong className="text-emerald-400">
                          {post.metrics?.reach && post.metrics.reach > 0
                            ? `Audience Reach: ${post.metrics.reach.toLocaleString()}`
                            : 'Live on Timeline'}
                        </strong>
                      </span>

                      {post.permalinkUrl && (
                        <a
                          href={post.permalinkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs transition-colors"
                        >
                          <span>View Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* DAY DETAIL MODAL: OPENS WHEN ANY DAY IN THE CALENDAR GRID IS CLICKED */}
      {/* ===================================================================== */}
      {selectedDay !== null && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl p-5 sm:p-6 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-emerald-400" />
                  <span>
                    Schedule & Flyers for {monthYearLabel} {selectedDay}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {getPostsForDay(selectedDay).sched.length} scheduled &bull;{' '}
                  {getPostsForDay(selectedDay).pub.length} published
                </p>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Posts for Selected Day */}
            <div className="space-y-4">
              {/* Two Dedicated Slot Banners: 9:00 AM (Morning Hook) & 6:00 PM (Evening Spotlight) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 9:00 AM Slot Card */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 flex flex-col justify-between gap-3 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                        <Sun className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-bold text-white">9:00 AM Facebook Flyer</h4>
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">Morning Hook</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Applies to 9:00 AM Facebook post across accounts</p>
                      </div>
                    </div>
                  </div>
                  <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-amber-500/20">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload 9:00 AM Flyer</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleSlotFacebookUpload(selectedDay, 'MORNING', e)}
                    />
                  </label>
                </div>

                {/* 6:00 PM Slot Card */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/30 flex flex-col justify-between gap-3 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                        <Moon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-bold text-white">6:00 PM Facebook Flyer</h4>
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">Evening Spotlight</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Applies to 6:00 PM Facebook post across accounts</p>
                      </div>
                    </div>
                  </div>
                  <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload 6:00 PM Flyer</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleSlotFacebookUpload(selectedDay, 'EVENING', e)}
                    />
                  </label>
                </div>
              </div>

              {getPostsForDay(selectedDay).sched.length === 0 &&
              getPostsForDay(selectedDay).pub.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-3">
                  <Clock className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs">No posts scheduled for this day yet.</p>
                  <button
                    onClick={() => {
                      setNewDate(
                        `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(
                          2,
                          '0'
                        )}T09:00`
                      );
                      setSelectedDay(null);
                      setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold"
                  >
                    + Schedule Post on Day {selectedDay}
                  </button>
                </div>
              ) : (
                <>
                  {getPostsForDay(selectedDay).sched.map((post) => {
                    const isTweet = post.channel === 'TWITTER' || post.page?.pageId === 'AbiodunBuilds';
                    const flyerUrl = resolveFlyerForPost(post);

                    return (
                      <div
                        key={post.id}
                        className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 ${
                                isTweet
                                  ? 'bg-white/10 text-white border border-white/20'
                                  : isMorningPost(post)
                                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              }`}
                            >
                              {isTweet ? (
                                <XLogo className="w-3.5 h-3.5" />
                              ) : isMorningPost(post) ? (
                                <Sun className="w-3.5 h-3.5 text-amber-400" />
                              ) : (
                                <Moon className="w-3.5 h-3.5 text-blue-400" />
                              )}
                              <span>
                                {post.topicBadge ||
                                  (isTweet
                                    ? '𝕏 (@AbiodunBuilds)'
                                    : isMorningPost(post)
                                    ? '09:00 AM Morning Hook'
                                    : '06:00 PM Evening Spotlight')}
                              </span>
                            </span>
                            {!isTweet && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                {isMorningPost(post) ? '09:00 AM' : '06:00 PM'}
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400 font-mono text-xs">
                            {new Date(post.scheduledFor).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        {/* Layout: Twitter is pure text; Facebook has optional flyer + upload option */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start">
                          {!isTweet && flyerUrl && (
                            <div
                              onClick={() =>
                                setLightboxFlyer({
                                  url: flyerUrl,
                                  title: post.topicBadge || 'Facebook Flyer',
                                  badge: post.channel
                                })
                              }
                              className="w-full sm:w-28 sm:h-28 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 shrink-0 cursor-pointer relative group"
                            >
                              <img src={flyerUrl} alt="Flyer" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize2 className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}

                          <div className="flex-1 space-y-2">
                            <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                              {post.caption}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80">
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
                                <span>Inspect Flyer</span>
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
                            <label className={`cursor-pointer text-[11px] font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                              isMorningPost(post)
                                ? 'text-amber-300 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20'
                                : 'text-blue-300 bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
                            }`}>
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
                                title="Direct Meta publish like Metricool"
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

                  {getPostsForDay(selectedDay).pub.map((post) => (
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
                          <span className="text-slate-400">
                            {post.metrics?.reach && post.metrics.reach > 0
                              ? `Reach: ${post.metrics.reach.toLocaleString()}`
                              : 'Live'}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 line-clamp-2 leading-relaxed">{post.caption}</p>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setNewDate(
                    `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(
                      2,
                      '0'
                    )}T09:00`
                  );
                  setSelectedDay(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl border border-emerald-500/30 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Post to Day {selectedDay}</span>
              </button>
              <button
                onClick={() => setSelectedDay(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};
