import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Calendar,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  Info,
  Clock,
  TrendingUp,
  MessageCircle,
  Share2,
  ThumbsUp,
  Eye,
  Send,
  Copy,
  Hash,
  Download
} from 'lucide-react';

// Official X Vector Logo Component
const XLogo: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface ConnectedPage {
  id: string;
  pageId: string;
  pageName: string;
  pageCategory?: string;
  fanCount: number;
  lastSyncedAt?: string;
  _count?: { posts: number };
}

interface TwitterAccount {
  id: string;
  handle: string;
  displayName: string;
  followersCount: number;
  category?: string;
  lastSyncedAt?: string;
  hasApiKeys: boolean;
  postsCount: number;
  scheduledPostsCount: number;
}

interface PostMetric {
  reach: number;
  impressions: number;
  reactions: number;
  comments: number;
  shares: number;
  engagementRate: number;
}

interface SocialPost {
  id: string;
  externalPostId: string;
  caption: string;
  mediaType: string;
  mediaUrls: string[];
  contentPillar: string;
  publishedAt: string;
  metrics: PostMetric;
}

interface XTopicItem {
  id: string;
  category: string;
  badge: string;
  audience: string;
  hook: string;
  text: string;
}

const X_TOPIC_PILLARS = [
  {
    name: 'React.js & Frontend',
    icon: '⚛️',
    audience: 'Developers & Tech Employers',
    items: [
      {
        id: 'react_1',
        category: 'React.js & TypeScript',
        badge: 'Performance',
        audience: 'Developers & Tech Employers',
        hook: 'React tip: Stop lifting state too high.',
        text: `React performance tip: Most lag isn't caused by missing useMemo.\n\nIt's caused by lifting state higher than it needs to be.\n\nKeep state local. When state stays near the component that actually uses it, 90% of unnecessary re-renders vanish.\n\n#ReactJS #TypeScript #WebDev`
      },
      {
        id: 'react_2',
        category: 'React.js & TypeScript',
        badge: 'Clean Architecture',
        audience: 'Developers & Tech Employers',
        hook: 'Calculate derived state during render.',
        text: `Stop using useEffect to sync related state.\n\nIf a value can be computed from existing props or state, derive it during render:\n\nconst fullName = \`\${firstName} \${lastName}\`;\n\nNo extra render cycle. Zero synchronization bugs.\n\n#React #Frontend #CleanCode`
      },
      {
        id: 'react_3',
        category: 'React.js & TypeScript',
        badge: 'TypeScript Pro',
        audience: 'Developers & Tech Employers',
        hook: 'Stop using "any" as an escape hatch.',
        text: `TypeScript tip:\n\nStop reaching for 'any' when dealing with dynamic API responses.\n\nUse 'unknown' paired with a custom type guard. You get compiler safety without compromising flexibility.\n\nJunior devs rush with any; senior devs validate shapes.\n\n#TypeScript`
      }
    ]
  },
  {
    name: 'AI Automation & Workflows',
    icon: '⚡',
    audience: 'Founders & Employers',
    items: [
      {
        id: 'ai_1',
        category: 'AI Automation',
        badge: 'ROI & Sales',
        audience: 'Founders & Employers',
        hook: 'AI won\'t replace engineers; it amplifies them.',
        text: `AI won't replace software engineers.\n\nBut an engineer who builds custom AI automations will replace an entire legacy agency.\n\nWe connect LLMs directly to client databases and WhatsApp to qualify leads in under 20 seconds.\n\n#AIAutomation #SoftwareEngineering`
      },
      {
        id: 'ai_2',
        category: 'AI Automation',
        badge: 'Pipeline Architecture',
        audience: 'Founders & Employers',
        hook: 'Deterministic pipelines over ChatGPT prompts.',
        text: `Most businesses don't need another generic ChatGPT prompt.\n\nThey need deterministic AI workflows:\n1. Ingest lead inquiry\n2. Query inventory & pricing via API\n3. Deliver tailored quotation in 15 seconds\n\nThat's how modern businesses scale.\n\n#VeltrixHub #Automation`
      },
      {
        id: 'ai_3',
        category: 'AI Automation',
        badge: 'Cost Optimization',
        audience: 'Founders & Employers',
        hook: 'How to build LLM apps without huge API bills.',
        text: `Building AI apps? How to avoid a $3,000 OpenAI bill:\n\n1. Cache repeated prompts with Redis\n2. Use smaller models (gpt-4o-mini) for classification\n3. Enforce strict JSON schema response mode\n\nShip smart, ship lean.\n\n#AI #TechInAfrica #WebDev`
      }
    ]
  },
  {
    name: 'Websites & Performance',
    icon: '🌐',
    audience: 'Business Owners & Devs',
    items: [
      {
        id: 'web_1',
        category: 'Websites & Performance',
        badge: 'Speed = Revenue',
        audience: 'Business Owners & Devs',
        hook: '1-second delay costs 7% conversion.',
        text: `A 1-second delay in page load time costs a business 7% of its conversions.\n\nSpeed isn't just a technical metric; it is pure revenue.\n\nIf your landing page takes 5+ seconds to open on mobile, you are throwing ad money away.\n\n#WebPerformance #VeltrixHub #SEO`
      },
      {
        id: 'web_2',
        category: 'Websites & Performance',
        badge: 'Client Value',
        audience: 'Business Owners & Devs',
        hook: 'Customers care about speed and clarity.',
        text: `Your customers don't care about your tech stack.\n\nThey care if:\n1. The page loads in under 2 seconds\n2. What you sell is crystal clear in 5 seconds\n3. The contact/buy button works in 1 tap\n\nClarity beats complexity every time.\n\n#WebDesign #ConversionRate`
      },
      {
        id: 'web_3',
        category: 'Websites & Performance',
        badge: 'Mobile-First Reality',
        audience: 'Business Owners & Devs',
        hook: 'Design for low-end mobile first.',
        text: `Designers design on a 4K MacBook.\nReal customers visit on a $90 smartphone with a weak 3G connection in traffic.\n\nIf your web app isn't tested on slow networks and budget devices, it isn't production ready.\n\n#Frontend #MobileFirst`
      }
    ]
  },
  {
    name: 'Mobile App Dev',
    icon: '📱',
    audience: 'Founders & Tech Community',
    items: [
      {
        id: 'mobile_1',
        category: 'Mobile Apps',
        badge: 'React Native',
        audience: 'Founders & Tech Community',
        hook: 'React Native New Architecture is a game changer.',
        text: `React Native with the New Architecture and Hermes engine is incredible.\n\n60 FPS animations, near-instant startup, and 85% shared code across iOS and Android.\n\nFor most startups, building two separate native apps is financial waste.\n\n#ReactNative #MobileAppDev`
      },
      {
        id: 'mobile_2',
        category: 'Mobile Apps',
        badge: 'PWA vs Native',
        audience: 'Founders & Tech Community',
        hook: 'Do you really need an App Store download?',
        text: `Before building a mobile app, ask yourself:\n\nDoes your product really need push tokens, bluetooth, or offline storage?\n\nIf not, a high-performance Progressive Web App (PWA) gets you to market in 2 weeks for 1/3 the cost.\n\n#StartupAdvice #MobileDev`
      }
    ]
  },
  {
    name: 'Learn Web Dev Roadmaps',
    icon: '🚀',
    audience: 'Junior Devs & Tech Community',
    items: [
      {
        id: 'learn_1',
        category: 'Learn Web Dev',
        badge: 'Tutorial Hell Escape',
        audience: 'Junior Devs & Tech Community',
        hook: '3 steps to escape tutorial hell.',
        text: `How to escape tutorial hell in 3 steps:\n\n1. Stop watching 10-hour build videos on YouTube\n2. Pick 1 real-world app (e.g. an invoice builder)\n3. Build it from scratch without templates. Google each error yourself.\n\nStruggle is where real learning happens.\n\n#100DaysOfCode #LearnInPublic`
      },
      {
        id: 'learn_2',
        category: 'Learn Web Dev',
        badge: '2026 Roadmap',
        audience: 'Junior Devs & Tech Community',
        hook: 'If I had to learn web development from zero.',
        text: `If I had to learn web development from zero in 2026:\n\nMonth 1: HTML, CSS & Flexbox layout\nMonth 2: Pure JavaScript & DOM manipulation\nMonth 3: React & TypeScript\nMonth 4: Build 3 fullstack CRUD apps\n\nDon't jump between 10 frameworks. Master fundamentals first.\n\n#CodeNewbie`
      },
      {
        id: 'learn_3',
        category: 'Learn Web Dev',
        badge: 'Get Hired Fast',
        audience: 'Junior Devs & Tech Community',
        hook: 'Stop building to-do apps to get hired.',
        text: `Want to get hired as a frontend engineer? Stop building to-do apps.\n\nBuild one polished SaaS dashboard with:\n• User authentication\n• Dark/light theme\n• Data visualization charts\n• Responsive mobile UI\n\nEmployers want proof you can ship products.\n\n#WebDev #TechJobs`
      }
    ]
  },
  {
    name: 'Founder & Engineering Lessons',
    icon: '💼',
    audience: 'Recruiters, Clients & Devs',
    items: [
      {
        id: 'founder_1',
        category: 'Founder & Engineering',
        badge: 'Engineer + Founder',
        audience: 'Recruiters, Clients & Devs',
        hook: 'Code that doesn\'t ship has zero value.',
        text: `What building Veltrix Hub taught me as a Frontend Engineer:\n\nWriting clean code is only 50% of the job. The other 50% is understanding business problems, meeting deadlines, and delivering software that makes clients money.\n\nEngineers who understand business are unstoppable.\n\n#BuildInPublic`
      },
      {
        id: 'founder_2',
        category: 'Founder & Engineering',
        badge: 'Senior Mindset',
        audience: 'Recruiters, Clients & Devs',
        hook: 'The higher you climb, the simpler your code.',
        text: `Junior engineers debate frameworks.\nSenior engineers debate architecture.\nStaff engineers and founders focus on user experience and business outcomes.\n\nThe higher you climb, the simpler your solutions become.\n\n#SoftwareEngineering #TechCareer`
      }
    ]
  }
];

const DEFAULT_CONNECTED_PAGES: ConnectedPage[] = [
  {
    id: 'page_1',
    pageId: '109283746520192',
    pageName: 'Veltrix Hub Official',
    pageCategory: 'Digital Growth & Technology Agency',
    fanCount: 1240,
    lastSyncedAt: new Date().toISOString(),
    _count: { posts: 14 }
  },
  {
    id: 'page_2',
    pageId: '109283746520193',
    pageName: 'Abiodun Digital Growth',
    pageCategory: 'Technology & Web Architecture',
    fanCount: 860,
    lastSyncedAt: new Date().toISOString(),
    _count: { posts: 8 }
  },
  {
    id: 'page_3',
    pageId: '109283746520194',
    pageName: 'Veltrix AI Automation',
    pageCategory: 'AI Automation & Workflows',
    fanCount: 420,
    lastSyncedAt: new Date().toISOString(),
    _count: { posts: 6 }
  }
];

const DEFAULT_TWITTER_ACCOUNTS: TwitterAccount[] = [
  {
    id: 'tw_1',
    handle: 'AbiodunBuilds',
    displayName: 'Abiodun Builds',
    followersCount: 1840,
    category: 'Frontend & AI Automation Engineer',
    lastSyncedAt: new Date().toISOString(),
    hasApiKeys: true,
    postsCount: 42,
    scheduledPostsCount: 14
  }
];

const DEFAULT_SYNCED_POSTS: SocialPost[] = [
  {
    id: 'post_1',
    externalPostId: 'fb_post_101',
    caption: `Why 70% of business websites in Nigeria lose customers before they even read the offer:\n\n1. Slow loading speed (over 4 seconds on mobile networks)\n2. No direct WhatsApp conversion button on the screen\n3. Cluttered layout that confuses first-time visitors\n\nAt Veltrix Hub, we build digital infrastructure designed for speed, clarity, and trust.`,
    mediaType: 'IMAGE',
    mediaUrls: ['/designs/flyers/flyer-nov14-website-speed.svg'],
    contentPillar: 'WEBSITE SPEED & CONVERSION',
    publishedAt: '2026-11-14T10:00:00.000Z',
    metrics: { reach: 2420, impressions: 3890, reactions: 94, comments: 24, shares: 12, engagementRate: 5.4 }
  },
  {
    id: 'post_2',
    externalPostId: 'fb_post_102',
    caption: `CAC Registration isn't an expense. It's the foundation of business trust.\n\nOpen corporate bank accounts, bid for high-value tenders, and protect your brand name from competitor theft with Veltrix Hub.`,
    mediaType: 'IMAGE',
    mediaUrls: ['/designs/flyers/flyer-nov12-cac-registration.svg'],
    contentPillar: 'CAC BUSINESS COMPLIANCE',
    publishedAt: '2026-11-12T13:30:00.000Z',
    metrics: { reach: 2120, impressions: 3410, reactions: 88, comments: 19, shares: 11, engagementRate: 5.1 }
  },
  {
    id: 'post_3',
    externalPostId: 'fb_post_103',
    caption: `Professional Branding vs Informal Business:\n\nCustomers will happily pay 3x more to a business with clean corporate branding, verified CAC credentials, and an official domain email. Let Veltrix Hub elevate your brand authority.`,
    mediaType: 'IMAGE',
    mediaUrls: ['/designs/flyers/flyer-nov15-branding-trust.svg'],
    contentPillar: 'CORPORATE BRANDING & TRUST',
    publishedAt: '2026-11-10T14:00:00.000Z',
    metrics: { reach: 1840, impressions: 2950, reactions: 72, comments: 14, shares: 6, engagementRate: 4.8 }
  },
  {
    id: 'post_4',
    externalPostId: 'fb_post_104',
    caption: `Did you know that an unmonitored website can go offline for days without the owner noticing? Veltrix Hub Website Maintenance provides 24/7 uptime monitoring and daily automated backups.`,
    mediaType: 'IMAGE',
    mediaUrls: ['/designs/flyers/flyer-nov16-website-uptime.svg'],
    contentPillar: '24/7 WEBSITE MAINTENANCE',
    publishedAt: '2026-11-08T11:00:00.000Z',
    metrics: { reach: 1650, impressions: 2600, reactions: 61, comments: 12, shares: 5, engagementRate: 4.6 }
  },
  {
    id: 'post_5',
    externalPostId: 'fb_post_105',
    caption: `Automating customer inquiries: What if every prospect who messaged your business got their questions answered and booked a consultation within 30 seconds at 2 AM? AI automations by Veltrix Hub make this possible.`,
    mediaType: 'IMAGE',
    mediaUrls: ['/designs/flyers/flyer-nov18-ai-quotes-2am.svg'],
    contentPillar: 'AI AUTOMATION WORKFLOWS',
    publishedAt: '2026-11-06T16:20:00.000Z',
    metrics: { reach: 2890, impressions: 4720, reactions: 134, comments: 38, shares: 22, engagementRate: 6.8 }
  }
];

export const FacebookAccountsPage: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState<'facebook' | 'twitter'>('facebook');

  // Facebook state with fallback to seeded verified slots
  const [pages, setPages] = useState<ConnectedPage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('veltrix_fb_pages_v3');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return DEFAULT_CONNECTED_PAGES;
  });

  const [posts, setPosts] = useState<SocialPost[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('veltrix_fb_posts_v3');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return DEFAULT_SYNCED_POSTS;
  });

  const [loading, setLoading] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [lightboxFlyer, setLightboxFlyer] = useState<{ url: string; title: string } | null>(null);

  // Facebook connect form inputs
  const [newPageName, setNewPageName] = useState('Veltrix Hub Official Page');
  const [newPageId, setNewPageId] = useState('109823471928374');
  const [newPageCategory, setNewPageCategory] = useState('Digital Growth & Technology Agency');
  const [newFanCount, setNewFanCount] = useState(1240);

  // Twitter/X state
  const [twitterAccounts, setTwitterAccounts] = useState<TwitterAccount[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('veltrix_x_accounts_v3');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return DEFAULT_TWITTER_ACCOUNTS;
  });
  const [showTwitterModal, setShowTwitterModal] = useState(false);
  const [newTwitterHandle, setNewTwitterHandle] = useState('officialveltrixhub');
  const [newTwitterName, setNewTwitterName] = useState('Veltrix Hub');
  const [newTwitterFollowers, setNewTwitterFollowers] = useState(480);
  const [newTwitterBio, setNewTwitterBio] = useState('We build websites, AI automations & digital solutions that help businesses grow.');
  const [tweetComposerText, setTweetComposerText] = useState(
    'Most business owners are solving the wrong online problem.\n\nClarity, speed, and trust convert visitors into paying clients.\n\n👉 DM us or visit https://veltrixhub.ng\n\n#VeltrixHub #WebDesign #AIAutomation'
  );
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);

  const fetchPagesAndPosts = async () => {
    const token = localStorage.getItem('veltrix_token');
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Connected Facebook Pages
      const pagesRes = await fetch('/api/v1/meta/pages', { headers });
      const pagesData = await pagesRes.json();

      if (pagesData.success) {
        setPages(pagesData.data);
      }

      // Fetch Synced Posts
      const postsRes = await fetch('/api/v1/meta/posts?limit=10', { headers });
      const postsData = await postsRes.json();

      if (postsData.success) {
        setPosts(postsData.data);
      }

      // Fetch Connected X (Twitter) Accounts
      const twitterRes = await fetch('/api/v1/twitter/accounts', { headers });
      const twitterData = await twitterRes.json();
      if (twitterData.success) {
        setTwitterAccounts(twitterData.data);
      }
    } catch (err) {
      console.warn('API error, using cached state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagesAndPosts();
  }, []);

  // Facebook connect handler
  const handleConnectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('veltrix_token');

    try {
      const res = await fetch('/api/v1/meta/connect-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          pageId: newPageId,
          pageName: newPageName,
          pageCategory: newPageCategory,
          fanCount: newFanCount,
          rawToken: `mock_eaag_${Date.now()}`
        })
      });

      const data = await res.json();
      if (data.success) {
        setShowConnectModal(false);
        setNotification({ type: 'success', message: `Page "${newPageName}" connected successfully!` });
        fetchPagesAndPosts();
      } else {
        setNotification({ type: 'error', message: data.error?.message || 'Failed to connect page' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Connection failed' });
    }
  };

  // Twitter/X connect handler
  const handleTwitterConnectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('veltrix_token');

    try {
      const res = await fetch('/api/v1/twitter/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          handle: newTwitterHandle,
          displayName: newTwitterName,
          followersCount: newTwitterFollowers,
          bio: newTwitterBio
        })
      });

      const data = await res.json();
      if (data.success) {
        setShowTwitterModal(false);
        setNotification({ type: 'success', message: `X Account @${newTwitterHandle.replace('@', '')} connected successfully!` });
        fetchPagesAndPosts();
      } else {
        setNotification({ type: 'error', message: data.error?.message || 'Failed to connect X account' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Connection failed' });
    }
  };

  const handleDisconnectTwitter = async (handle: string) => {
    if (!confirm(`Are you sure you want to disconnect ${handle}?`)) return;

    const token = localStorage.getItem('veltrix_token');
    try {
      const res = await fetch(`/api/v1/twitter/accounts/${encodeURIComponent(handle)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: 'success', message: `X Account ${handle} disconnected successfully.` });
        fetchPagesAndPosts();
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to disconnect' });
    }
  };

  const handleSyncPage = async (pageId: string) => {
    setSyncingId(pageId);
    setNotification(null);
    const token = localStorage.getItem('veltrix_token');

    try {
      const res = await fetch(`/api/v1/meta/sync/${pageId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        setNotification({
          type: 'success',
          message: `Synchronized ${data.data.syncedPostsCount} historical posts & insights successfully!`
        });
        fetchPagesAndPosts();
      } else {
        setNotification({ type: 'error', message: data.error?.message || 'Sync failed' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Sync request failed' });
    } finally {
      setSyncingId(null);
    }
  };

  const handleDisconnect = async (pageId: string) => {
    if (!confirm('Are you sure you want to disconnect this Facebook Page? Historical posts will be safely archived.')) {
      return;
    }

    const token = localStorage.getItem('veltrix_token');
    try {
      const res = await fetch(`/api/v1/meta/pages/${pageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        setNotification({ type: 'success', message: 'Page disconnected successfully' });
        fetchPagesAndPosts();
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to disconnect' });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Social Accounts & Distribution Channels</h1>
          <p className="text-xs text-slate-400 mt-1">
            Connect and synchronize authorized Facebook business identities and your official X (formerly Twitter) presence.
          </p>
        </div>

        {/* Platform Switching Tabs */}
        <div className="w-full sm:w-auto grid grid-cols-2 sm:flex items-center gap-1.5 sm:gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActivePlatform('facebook')}
            className={`flex items-center justify-center gap-2 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[40px] sm:min-h-0 ${
              activePlatform === 'facebook'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Facebook className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            <span>Facebook ({pages.length}/3)</span>
          </button>

          <button
            onClick={() => setActivePlatform('twitter')}
            className={`flex items-center justify-center gap-2 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[40px] sm:min-h-0 ${
              activePlatform === 'twitter'
                ? 'bg-white text-slate-950 shadow-md shadow-white/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <XLogo className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            <span>𝕏 / Twitter {twitterAccounts.length > 0 ? `(${twitterAccounts.length})` : ''}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`flex items-center justify-between rounded-xl border p-4 text-xs ${
            notification.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-400" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs underline hover:opacity-80">
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FACEBOOK TAB CONTENT */}
      {/* ========================================================================= */}
      {activePlatform === 'facebook' && (
        <div className="space-y-6">
          {/* Important Meta Policy Alert Card */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
              <Shield className="h-4 w-4" />
              <span>Meta Graph API Architectural Policy Notice</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Official Meta Graph API policies distinguish **Facebook Pages** from **Personal Profiles**. Automated post analytics, reach tracking, and publishing require an authorized Page identity. For personal profiles, Veltrix Hub provides an assisted workflow (one-click copy and manual distribution). All access tokens are securely stored using **AES-256-GCM encryption**.
            </p>
          </div>

          {/* 1-Click Batch Flyer Upload Banner for Facebook */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/40 to-slate-900 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0">
                <Facebook className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Upload Flyer for All 3 Facebook Accounts</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">1-Click Batch</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Open Content Calendar to upload a single flyer and attach it to all Facebook posts scheduled across your accounts.
                </p>
              </div>
            </div>
            <Link
              to="/content-calendar"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20"
            >
              <Calendar className="w-4 h-4" />
              <span>Go to Content Calendar</span>
            </Link>
          </div>

          {/* 3 Identity Slots Display */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white font-heading">
                Connected Facebook Accounts ({pages.length} / 3 Slots Used)
              </h2>
              <span className="text-xs text-slate-400">15-minute sync cooldown enforced</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[0, 1, 2].map((slotIndex) => {
                const page = pages[slotIndex];

                if (page) {
                  const isSyncing = syncingId === page.pageId;
                  return (
                    <div
                      key={page.id}
                      className="rounded-xl border border-blue-500/30 bg-[#0F1420] p-5 space-y-4 relative overflow-hidden shadow-lg"
                    >
                      <div className="absolute top-0 right-0 rounded-bl-lg bg-blue-600/20 border-b border-l border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
                        Slot #{slotIndex + 1} • Connected
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-md">
                          <Facebook className="h-5 w-5" />
                        </div>
                        <div className="truncate pr-12">
                          <h3 className="font-heading text-sm font-bold text-white truncate">{page.pageName}</h3>
                          <p className="text-[11px] text-slate-400 truncate">{page.pageCategory || 'Business Page'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase">Followers</span>
                          <p className="font-semibold text-slate-200">{page.fanCount?.toLocaleString() || 0}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase">Synced Posts</span>
                          <p className="font-semibold text-slate-200">{page._count?.posts || posts.length}</p>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        <span>Last synced: {page.lastSyncedAt ? new Date(page.lastSyncedAt).toLocaleTimeString() : 'Never'}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                        <button
                          onClick={() => handleSyncPage(page.pageId)}
                          disabled={isSyncing}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-blue-400' : ''}`} />
                          <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                        </button>
                        <button
                          onClick={() => handleDisconnect(page.pageId)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                          title="Disconnect Page"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={slotIndex}
                    onClick={() => setShowConnectModal(true)}
                    className="group flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-[#0F1420]/40 p-6 text-center space-y-3 hover:border-blue-500/40 hover:bg-slate-900/40 transition-all cursor-pointer min-h-[220px]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/80 text-slate-500 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                      <Plus className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-300">Account Slot #{slotIndex + 1} Available</p>
                      <p className="text-[11px] text-slate-500">Click to connect an eligible Facebook Page</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historical Posts Ingestion Table */}
          <div className="rounded-xl border border-slate-800/80 bg-[#0F1420] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-400" />
                <h2 className="text-sm font-semibold text-white font-heading">
                  Synchronized Post Intelligence & Insights
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">
                {posts.length} verified records in MongoDB Atlas
              </span>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-10 space-y-2 text-slate-500 text-xs">
                <Facebook className="h-8 w-8 mx-auto text-slate-600" />
                <p>No historical posts ingested yet. Connect a page and click "Sync Now" to import.</p>
              </div>
            ) : (
              <>
                {/* Mobile Cards View (md:hidden) */}
                <div className="md:hidden space-y-3">
                  {posts.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                          {p.contentPillar}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(p.publishedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex gap-2.5 items-start">
                        {p.mediaUrls && p.mediaUrls.length > 0 && p.mediaUrls[0] ? (
                          <img
                            src={p.mediaUrls[0]}
                            alt="Post thumbnail"
                            onClick={() => setLightboxFlyer({ url: p.mediaUrls[0], title: p.contentPillar || 'Flyer' })}
                            className="h-14 w-14 rounded-lg object-cover border border-slate-800 shrink-0 cursor-pointer hover:border-emerald-500 transition-colors"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-800 text-[10px] text-slate-400 shrink-0">
                            Text
                          </div>
                        )}
                        <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed flex-1">
                          {p.caption}
                        </p>
                      </div>

                      <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-800/80 text-[11px] text-center">
                        <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/60">
                          <span className="text-[9px] text-slate-500 block uppercase font-medium">Reach</span>
                          <span className="font-bold text-white">{p.metrics?.reach?.toLocaleString() || 0}</span>
                        </div>
                        <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/60">
                          <span className="text-[9px] text-slate-500 block uppercase font-medium">Likes</span>
                          <span className="font-bold text-blue-400">{p.metrics?.reactions || 0}</span>
                        </div>
                        <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/60">
                          <span className="text-[9px] text-slate-500 block uppercase font-medium">Comments</span>
                          <span className="font-bold text-emerald-400">{p.metrics?.comments || 0}</span>
                        </div>
                        <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/60">
                          <span className="text-[9px] text-slate-500 block uppercase font-medium">Engage</span>
                          <span className="font-bold text-emerald-400">{p.metrics?.engagementRate || 0.0}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View (hidden md:block) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-800 text-[10px] uppercase font-semibold text-slate-400 bg-slate-900/40">
                      <tr>
                        <th className="py-2.5 px-3">Post Caption & Media</th>
                        <th className="py-2.5 px-3">Content Pillar</th>
                        <th className="py-2.5 px-3">Reach</th>
                        <th className="py-2.5 px-3">Reactions</th>
                        <th className="py-2.5 px-3">Comments</th>
                        <th className="py-2.5 px-3">Shares</th>
                        <th className="py-2.5 px-3">Engagement Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {posts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-900/30 transition-colors">
                          <td className="py-3 px-3 max-w-sm">
                            <div className="flex items-start gap-2.5">
                              {p.mediaUrls && p.mediaUrls.length > 0 && p.mediaUrls[0] ? (
                                <img
                                  src={p.mediaUrls[0]}
                                  alt="Post thumbnail"
                                  onClick={() => setLightboxFlyer({ url: p.mediaUrls[0], title: p.contentPillar || 'Flyer' })}
                                  className="h-10 w-10 rounded-md object-cover border border-slate-800 shrink-0 cursor-pointer hover:border-emerald-500 transition-colors"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-800 text-[10px] text-slate-400 shrink-0">
                                  Text
                                </div>
                              )}
                              <div className="truncate">
                                <p className="truncate text-xs font-medium text-slate-200">{p.caption}</p>
                                <span className="text-[10px] text-slate-500">
                                  {new Date(p.publishedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                              {p.contentPillar}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-white">
                            {p.metrics?.reach?.toLocaleString() || 0}
                          </td>
                          <td className="py-3 px-3">
                            <span className="flex items-center gap-1 text-slate-300">
                              <ThumbsUp className="h-3 w-3 text-blue-400" />
                              {p.metrics?.reactions || 0}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="flex items-center gap-1 text-slate-300">
                              <MessageCircle className="h-3 w-3 text-emerald-400" />
                              {p.metrics?.comments || 0}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="flex items-center gap-1 text-slate-300">
                              <Share2 className="h-3 w-3 text-sky-400" />
                              {p.metrics?.shares || 0}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold text-emerald-400">
                              {p.metrics?.engagementRate || 0.0}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 𝕏 / TWITTER TAB CONTENT */}
      {/* ========================================================================= */}
      {activePlatform === 'twitter' && (
        <div className="space-y-6">
          {/* X Platform Notice */}
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <XLogo className="h-4 w-4" />
                <span>𝕏 (Twitter) Multi-Channel Integration</span>
              </div>
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-200">
                280 Character Limit Engine
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Connect your official X account to schedule, format, and publish high-impact tweets alongside your Facebook campaign. Posts can be published using 1-Click Assisted Publishing (no developer keys required) or via official X API v2.
            </p>
          </div>

          {/* Connected X Account Card / Connect Slot */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white font-heading">
                Connected 𝕏 Accounts
              </h2>
              <button
                onClick={() => setShowTwitterModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md hover:bg-slate-200 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>{twitterAccounts.length > 0 ? 'Add Another 𝕏 Account' : 'Connect 𝕏 Account'}</span>
              </button>
            </div>

            {twitterAccounts.length === 0 ? (
              <div
                onClick={() => setShowTwitterModal(true)}
                className="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-[#0F1420]/60 p-8 text-center space-y-3 hover:border-slate-500 hover:bg-slate-900/60 transition-all cursor-pointer min-h-[200px]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white group-hover:scale-110 transition-transform">
                  <XLogo className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">No 𝕏 Account Connected Yet</p>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Click here to connect your 𝕏 handle (e.g. @officialveltrixhub) to enable automated tweet formatting and cross-posting.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {twitterAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="rounded-2xl border border-slate-700 bg-[#0F1420] p-5 space-y-4 shadow-xl relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-lg">
                          <XLogo className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-heading text-sm font-bold text-white">{acc.displayName}</h3>
                            <span className="text-sky-400 text-xs" title="Connected">✓</span>
                          </div>
                          <p className="text-xs font-mono text-slate-400">{acc.handle}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDisconnectTwitter(acc.handle)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                        title="Disconnect Account"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Followers</span>
                        <p className="font-bold text-white text-sm">{acc.followersCount?.toLocaleString() || 0}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Scheduled</span>
                        <p className="font-bold text-emerald-400 text-sm">{acc.scheduledPostsCount || 0}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Status</span>
                        <p className="font-bold text-sky-400 text-sm">Active</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Assisted 1-Click Publishing Active</span>
                      <a
                        href={`https://x.com/${acc.handle.replace('@', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-slate-300 hover:text-white underline"
                      >
                        <span>View on 𝕏</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trending 𝕏 Topic Vault & Thought Leadership Library */}
          <div className="rounded-2xl border border-slate-800 bg-[#0F1420] p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-heading">
                  Trending 𝕏 Topics & Thought Leadership Vault
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Pillars tailored for Developers, Tech Employers & Business Owners
              </span>
            </div>

            {/* Topic Category Pills (Smooth Thumb Swipe on Mobile) */}
            <div className="flex overflow-x-auto no-scrollbar pb-1.5 gap-2 flex-nowrap sm:flex-wrap">
              {X_TOPIC_PILLARS.map((pillar, idx) => (
                <button
                  key={pillar.name}
                  onClick={() => setSelectedTopicIndex(idx)}
                  className={`flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all min-h-[38px] ${
                    selectedTopicIndex === idx
                      ? 'bg-white text-slate-950 shadow-md font-bold'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{pillar.icon}</span>
                  <span>{pillar.name}</span>
                </button>
              ))}
            </div>

            {/* Target Audience Badge */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/80">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-semibold">🎯 Target Audience:</span>
                <span className="text-slate-200">{X_TOPIC_PILLARS[selectedTopicIndex].audience}</span>
              </span>
              <span>Click any card below to load into composer</span>
            </div>

            {/* Tweet Cards for Selected Pillar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {X_TOPIC_PILLARS[selectedTopicIndex].items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setTweetComposerText(item.text)}
                  className="group rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2.5 hover:border-slate-600 hover:bg-slate-900 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold text-sky-300">
                        {item.badge}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {item.text.length}/280
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-5 whitespace-pre-line group-hover:text-white">
                      {item.text}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-emerald-400 font-medium group-hover:underline">
                      Load into Composer →
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(item.text)}`, '_blank');
                      }}
                      className="text-slate-400 hover:text-white flex items-center gap-1 p-1"
                      title="Tweet directly"
                    >
                      <XLogo className="h-3 w-3" />
                      <span>Tweet</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tweet Composer & Tester */}
          <div className="rounded-2xl border border-slate-800 bg-[#0F1420] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4 text-white" />
                <h3 className="text-sm font-bold text-white font-heading">
                  Quick Tweet Composer & 280-Character Optimizer
                </h3>
              </div>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  tweetComposerText.length <= 280
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                    : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                }`}
              >
                {tweetComposerText.length} / 280 characters
              </span>
            </div>

            <div className="space-y-3">
              <textarea
                value={tweetComposerText}
                onChange={(e) => setTweetComposerText(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-white focus:border-white focus:outline-none resize-none leading-relaxed"
                placeholder="Compose a tweet for Veltrix Hub..."
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                <div className="grid grid-cols-2 sm:flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(tweetComposerText);
                      setNotification({ type: 'success', message: 'Tweet copied to clipboard!' });
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 sm:py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white min-h-[42px] sm:min-h-0 active:scale-95"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Tweet</span>
                  </button>

                  <button
                    onClick={() => {
                      setTweetComposerText(
                        'Most business owners solve the wrong online problem.\n\nClarity, speed, and trust convert visitors into paying clients.\n\n👉 DM us or WhatsApp: https://wa.me/2348087098270\n\n#VeltrixHub #WebDesign #AIAutomation'
                      );
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 sm:py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white min-h-[42px] sm:min-h-0 active:scale-95"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>Sample Hook</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetComposerText)}`;
                    window.open(url, '_blank');
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg hover:bg-slate-200 transition-all min-h-[44px] active:scale-95"
                >
                  <XLogo className="h-4 w-4" />
                  <span>Publish to 𝕏 (1-Click)</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONNECT FACEBOOK MODAL */}
      {/* ========================================================================= */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-[#0F1420] p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Facebook className="h-5 w-5 text-blue-500" />
                <h3 className="font-heading text-base font-bold text-white">Connect Facebook Page</h3>
              </div>
              <button
                onClick={() => setShowConnectModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConnectSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Page Name</label>
                <input
                  type="text"
                  required
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Veltrix Hub Official"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Facebook Page ID</label>
                <input
                  type="text"
                  required
                  value={newPageId}
                  onChange={(e) => setNewPageId(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., 109823471928374"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Industry / Category</label>
                <input
                  type="text"
                  value={newPageCategory}
                  onChange={(e) => setNewPageCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Digital Growth Agency"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Audience / Follower Count</label>
                <input
                  type="number"
                  value={newFanCount}
                  onChange={(e) => setNewFanCount(parseInt(e.target.value, 10))}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-2.5 text-[11px] text-slate-400">
                <span className="font-semibold text-blue-400">AES-256 Encryption: </span>
                Tokens are cryptographically encrypted before persistence to MongoDB Atlas.
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="flex-1 rounded-lg border border-slate-800 bg-slate-900 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500"
                >
                  Confirm Connection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONNECT 𝕏 / TWITTER MODAL */}
      {/* ========================================================================= */}
      {showTwitterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-[#0F1420] p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-950 font-bold">
                  <XLogo className="h-4 w-4" />
                </div>
                <h3 className="font-heading text-base font-bold text-white">Connect 𝕏 (Twitter) Account</h3>
              </div>
              <button
                onClick={() => setShowTwitterModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTwitterConnectSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">𝕏 Handle / Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-mono text-slate-500">@</span>
                  <input
                    type="text"
                    required
                    value={newTwitterHandle.replace('@', '')}
                    onChange={(e) => setNewTwitterHandle(e.target.value.replace('@', ''))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 pl-7 pr-3 py-2 text-xs text-white focus:border-white focus:outline-none font-mono"
                    placeholder="e.g. officialveltrixhub"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={newTwitterName}
                  onChange={(e) => setNewTwitterName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-white focus:outline-none"
                  placeholder="e.g. Veltrix Hub"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Followers Count (approx)</label>
                <input
                  type="number"
                  value={newTwitterFollowers}
                  onChange={(e) => setNewTwitterFollowers(parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-white focus:outline-none"
                  placeholder="e.g. 500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Profile Bio / Description</label>
                <textarea
                  rows={2}
                  value={newTwitterBio}
                  onChange={(e) => setNewTwitterBio(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-white focus:outline-none resize-none"
                  placeholder="Brief description of your brand..."
                />
              </div>

              <div className="rounded-lg bg-white/5 border border-white/10 p-2.5 text-[11px] text-slate-400 space-y-1">
                <span className="font-semibold text-white">Instant Assisted Publishing: </span>
                <span>Enables 1-click tweet composer with real-time 280-character validation, automatic hashtag inclusion, and scheduling support.</span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTwitterModal(false)}
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-900 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-white py-2 text-xs font-bold text-slate-950 shadow-lg hover:bg-slate-200 transition-all"
                >
                  Connect 𝕏 Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Fullscreen Lightbox Flyer Modal */}
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
                ✕
              </button>
            </div>

            <div className="w-full aspect-square rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
              <img
                src={lightboxFlyer.url}
                alt={lightboxFlyer.title}
                className="w-full h-full object-contain"
              />
            </div>

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
    </div>
  );
};
