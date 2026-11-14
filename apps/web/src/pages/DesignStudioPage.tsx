import React, { useState, useRef } from 'react';
import {
  Download,
  Calendar,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Layers,
  Palette,
  Phone,
  Globe,
  Share2,
  ChevronRight,
  Maximize2,
  Clock,
  Eye,
  Sliders,
  MessageSquare
} from 'lucide-react';

interface MasterTemplate {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  hookHeadline: string;
  hookHighlight: string;
  caption: string;
  category: string;
}

const MASTER_TEMPLATES: MasterTemplate[] = [
  {
    id: 'master_1',
    name: '1. Strategy & Problem Spotting (Founder Light)',
    subtitle: 'Kayode Founder Circular Badge • WhatsApp CTA • 3-Column Footer',
    image: '/designs/veltrix-design-1.jpg',
    hookHeadline: "Most business owners are solving the wrong online problem. Here's how to spot it.",
    hookHighlight: 'wrong online problem.',
    category: 'Curiosity & Strategy',
    caption: `Most business owners are solving the wrong online problem. Here's how to spot it.

You might think you need more traffic, more followers, or more ad spend. But if 95% of visitors leave your page without contacting you, pouring more money into marketing only burns cash faster.

The real problem isn't always visibility—it's clarity, speed, and trust.

What to inspect first:
1. Does your homepage answer "What's in it for me?" in under 5 seconds?
2. Is your contact button frictionless and instant?
3. Can customers verify your credibility before they pay?

At Veltrix Hub, we diagnose the leaks in your customer journey and build websites that convert visitors into paying clients.

👉 Want a free initial review of your business's online presence? Check our first comment below! 👇

#VeltrixHub #DigitalStrategy #BusinessGrowth #WebsiteAudit #NigeriaSME #ConversionRate`
  },
  {
    id: 'master_2',
    name: '2. Lead Loss & Conversion (Action Hero)',
    subtitle: 'Photographic Kayode Pointing • Orange Accent Circle • WhatsApp CTA',
    image: '/designs/veltrix-design-2.jpg',
    hookHeadline: "Customers ask 'How much?' and disappear. Here are a few possible reasons.",
    hookHighlight: 'and disappear.',
    category: 'Customer Pain & Challenges',
    caption: `Customers ask "How much?" and disappear. Here are a few possible reasons:

1. They don't understand the difference between your offer and the cheapest alternative.
2. Your pricing wasn't framed with the value, process, and transformation it delivers.
3. Your online presence looks informal, raising doubts about your reliability and after-sales support.

When you have a high-converting website, your process, portfolio, and verified credibility speak before price is ever discussed.

Stop losing serious buyers to silence. Build a customer conversion engine that works for you 24/7.

👉 Want a free initial review of your business's online presence? Check our first comment below! 👇

#SalesStrategy #ConversionOptimization #VeltrixHub #WebDesignNigeria #CloseDeals`
  },
  {
    id: 'master_3',
    name: '3. Market Authority (Deep Royal Blue)',
    subtitle: 'Executive Kayode Portrait • Services Tagline • Free Review CTA',
    image: '/designs/veltrix-design-3.jpg',
    hookHeadline: 'Your competitors may be easier to find, understand or trust online.',
    hookHighlight: 'easier to find, understand or trust',
    category: 'Market Authority',
    caption: `Your competitors may be easier to find, understand or trust online.

They don't necessarily have a better product or service than you. But when a customer searches on Google or social media:
• Their website loads instantly.
• Their pricing and process are crystal clear.
• Their contact details inspire immediate confidence.

Websites • E-commerce • Branding

👉 Want a free initial review of your business's online presence? Check our first comment below! 👇

#MarketLeadership #BrandAuthority #VeltrixHub #DigitalTransformation #NigeriaBusiness`
  },
  {
    id: 'master_4',
    name: '4. 10-Second Clarity (Executive White)',
    subtitle: 'Branded VH Shirt Portrait • Directional Arrow • Free Review CTA',
    image: '/designs/veltrix-design-4.jpg',
    hookHeadline: 'Can a new customer understand what you sell in 10 seconds?',
    hookHighlight: 'in 10 seconds?',
    category: 'User Experience & Clarity',
    caption: `Can a new customer understand what you sell in 10 seconds?

If a first-time visitor has to guess what problem you solve, who you help, and how to reach you, they will bounce to someone else.

The 10-Second Test:
1. Is your core service obvious above the fold?
2. Can visitors reach you in one tap?
3. Does your proof reassure their doubts?

Websites • E-commerce • Branding

👉 Want a free initial review of your business's online presence? Check our first comment below! 👇

#UserExperience #ConversionRate #VeltrixHub #WebsiteClarity #WebDesign`
  },
  {
    id: 'master_5',
    name: '5. Need a Professional Website? (Device Mockups)',
    subtitle: 'Laptop & Mobile 3D Mockups • Fast & Responsive • WhatsApp CTA',
    image: '/designs/veltrix-design-5.jpg',
    hookHeadline: 'Need a professional website that turns visitors into paying customers?',
    hookHighlight: 'professional website',
    category: 'Service Spotlight',
    caption: `Need a professional website that turns visitors into paying customers?

Veltrix Hub delivers fast, modern, and mobile-responsive websites crafted specifically for new and growing businesses.

What every Veltrix Hub website includes:
⚡ Lightning-Fast Loading: Keeps visitors engaged without bouncing
🔒 Secure & Reliable: Built on enterprise-grade infrastructure
📱 100% Mobile Optimized: Looks stunning on phones, tablets, and laptops
🔍 Search Engine Ready: Structured so local customers find you on Google
💬 Direct WhatsApp Integration: Start conversations with one tap

Stop losing customers to outdated or slow pages. Let's elevate your brand authority.

👉 Want a free initial review of your business's online presence or a professional website quote? Check our first comment below! 👇

#WebDesign #VeltrixHub #BusinessWebsite #Ecommerce #NigeriaSME #WebsiteDeveloper #DigitalGrowth`
  },
  {
    id: 'master_6',
    name: '6. Complete Services & AI Workflows (Matrix Flyer)',
    subtitle: 'Web • Mobile • AI Automation • Custom Software • Branding & CAC',
    image: '/designs/veltrix-design-6.jpg',
    hookHeadline: 'Looking for custom web, mobile, or AI automation solutions built for real business growth?',
    hookHighlight: 'web, mobile, or AI automation',
    category: 'Service Spotlight',
    caption: `Looking for custom web, mobile, or AI automation solutions built for real business growth?

At Veltrix Hub, we don't just build websites—we architect complete digital ecosystems that streamline your operations and scale your revenue.

Here is what we build for ambitious businesses:
🌐 WEBSITE DEVELOPMENT: High-converting corporate, portfolio, e-commerce & educational platforms built for speed and SEO.
📱 MOBILE APP DEVELOPMENT: Native and cross-platform mobile applications crafted with intuitive UI and rock-solid backend stability.
⚡ AI AUTOMATION & WORKFLOWS: Intelligent workflow automations, custom AI customer agents, LLM integrations and automated operational pipelines.
💻 CUSTOM SOFTWARE & APPS: Bespoke internal management platforms, robust REST/GraphQL APIs and secure cloud architectures.
✨ ALSO OFFERING: Corporate Branding & UI/UX, Website Maintenance, CAC Business Registration, and Google SEO Ranking.

Whatever stage your business is at, we give you the modern digital infrastructure to win in your industry.

👉 Want a free initial review of your business's online presence or a project consultation? Check our first comment below! 👇

#AIAutomation #SoftwareDevelopment #VeltrixHub #WebDevelopment #MobileApps #DigitalTransformation #TechInAfrica`
  }
];

interface HookItem {
  category: string;
  headline: string;
  highlight: string;
}

const CATEGORIZED_HOOKS: Record<string, HookItem[]> = {
  'Curiosity Hooks': [
    { category: 'Curiosity Hooks', headline: "Most business owners are solving the wrong online problem. Here's how to spot it.", highlight: "wrong online problem." },
    { category: 'Curiosity Hooks', headline: "There's one website mistake that's easy to miss—and expensive to ignore.", highlight: "expensive to ignore." },
    { category: 'Curiosity Hooks', headline: "Your biggest online competitor may not be the business you expect.", highlight: "business you expect." },
    { category: 'Curiosity Hooks', headline: "What if your website isn't the real reason customers aren't buying?", highlight: "real reason" },
    { category: 'Curiosity Hooks', headline: "You may be losing potential customers before they ever contact you.", highlight: "before they ever contact you." },
    { category: 'Curiosity Hooks', headline: "The advice you're following online might not fit your business.", highlight: "might not fit" },
    { category: 'Curiosity Hooks', headline: "Here's what I'd check first if a business website wasn't getting inquiries.", highlight: "check first" },
    { category: 'Curiosity Hooks', headline: "One small website issue can make a business look less professional than it is.", highlight: "less professional" },
    { category: 'Curiosity Hooks', headline: "What customers notice on your website may surprise you.", highlight: "may surprise you." },
    { category: 'Curiosity Hooks', headline: "Your online presence might be sending the wrong message without you realizing it.", highlight: "wrong message" }
  ],
  'Customer Pain & Challenges': [
    { category: 'Customer Pain & Challenges', headline: "You post every day, but the sales still aren't coming. What could be missing?", highlight: "sales still aren't coming." },
    { category: 'Customer Pain & Challenges', headline: "Customers ask 'How much?' and disappear. Here are a few possible reasons.", highlight: "and disappear." },
    { category: 'Customer Pain & Challenges', headline: "You're working harder to promote your business, but growth still feels slow.", highlight: "growth still feels slow." },
    { category: 'Customer Pain & Challenges', headline: "Your website is live—but is it helping your business move forward?", highlight: "helping your business" },
    { category: 'Customer Pain & Challenges', headline: "Your competitors may be easier to find, understand or trust online.", highlight: "easier to find" },
    { category: 'Customer Pain & Challenges', headline: "Likes and followers are useful, but how are they helping your business?", highlight: "helping your business?" },
    { category: 'Customer Pain & Challenges', headline: "Your business may not need more attention first. It may need a clearer online presence.", highlight: "clearer online presence." },
    { category: 'Customer Pain & Challenges', headline: "A cheap website can become costly if customers struggle to use it.", highlight: "become costly" },
    { category: 'Customer Pain & Challenges', headline: "Customers need a way to verify your business before they feel comfortable buying.", highlight: "verify your business" },
    { category: 'Customer Pain & Challenges', headline: "Your business deserves an online presence that reflects the quality of your work.", highlight: "reflects the quality" }
  ],
  'Belief-Changing Hooks': [
    { category: 'Belief-Changing Hooks', headline: "More followers won't automatically bring more customers. Here's what else matters.", highlight: "won't automatically bring" },
    { category: 'Belief-Changing Hooks', headline: "A website doesn't grow a business by itself. It needs a clear purpose.", highlight: "clear purpose." },
    { category: 'Belief-Changing Hooks', headline: "Your logo is only one part of your brand.", highlight: "only one part" },
    { category: 'Belief-Changing Hooks', headline: "Being busy online isn't the same as making progress.", highlight: "isn't the same" },
    { category: 'Belief-Changing Hooks', headline: "WhatsApp is a useful tool, but it shouldn't have to do everything.", highlight: "shouldn't have to do everything." },
    { category: 'Belief-Changing Hooks', headline: "Ads can bring visitors, but your website still needs to give them a reason to act.", highlight: "reason to act." },
    { category: 'Belief-Changing Hooks', headline: "A beautiful website can still fail if people don't know what to do next.", highlight: "can still fail" },
    { category: 'Belief-Changing Hooks', headline: "Customers need confidence—not just product photos.", highlight: "need confidence" },
    { category: 'Belief-Changing Hooks', headline: "Visibility opens the door. Trust makes them walk through.", highlight: "Trust" },
    { category: 'Belief-Changing Hooks', headline: "Your website can support your business even when you're not available to reply.", highlight: "support your business" }
  ],
  'Question Hooks': [
    { category: 'Question Hooks', headline: "If you were a first-time visitor, would you trust your own business website?", highlight: "would you trust" },
    { category: 'Question Hooks', headline: "Can a new customer understand what you sell in 10 seconds?", highlight: "in 10 seconds?" },
    { category: 'Question Hooks', headline: "What happens after someone visits your Instagram page?", highlight: "What happens after" },
    { category: 'Question Hooks', headline: "Is your online presence helping your business—or making it harder to choose you?", highlight: "making it harder" },
    { category: 'Question Hooks', headline: "What might make a customer choose your competitor instead?", highlight: "choose your competitor" },
    { category: 'Question Hooks', headline: "Are you building a clear online presence, or just posting more often?", highlight: "clear online presence" },
    { category: 'Question Hooks', headline: "What does your website communicate before you speak to a customer?", highlight: "before you speak" },
    { category: 'Question Hooks', headline: "Is your business ready to handle the attention your marketing brings?", highlight: "handle the attention" },
    { category: 'Question Hooks', headline: "Could a customer find your contact details without asking you?", highlight: "without asking you?" },
    { category: 'Question Hooks', headline: "If someone searches for your business today, what will they find?", highlight: "what will they find?" }
  ],
  'Website Design & UX': [
    { category: 'Website Design & UX', headline: "Your website looks professional—but can customers find what they need?", highlight: "can customers find" },
    { category: 'Website Design & UX', headline: "3 website design mistakes that can frustrate potential customers.", highlight: "frustrate potential customers." },
    { category: 'Website Design & UX', headline: "Why do visitors leave a website without taking the next step?", highlight: "without taking the next step?" },
    { category: 'Website Design & UX', headline: "Your website has only a moment to make a clear first impression.", highlight: "clear first impression." },
    { category: 'Website Design & UX', headline: "What makes a website feel professional without making it complicated?", highlight: "feel professional" },
    { category: 'Website Design & UX', headline: "A beautiful website isn't always an effective website. Here's the difference.", highlight: "effective website." },
    { category: 'Website Design & UX', headline: "3 things every business website should have before it goes live.", highlight: "before it goes live." },
    { category: 'Website Design & UX', headline: "Why your website should work smoothly on mobile phones first.", highlight: "on mobile phones first." },
    { category: 'Website Design & UX', headline: "Your website works on a laptop. What happens on a customer's phone?", highlight: "customer's phone?" },
    { category: 'Website Design & UX', headline: "A broken link can interrupt a customer who was ready to take action.", highlight: "ready to take action." }
  ],
  'Trust & Credibility': [
    { category: 'Trust & Credibility', headline: "Customers can visit your website and still have reasons not to trust your business.", highlight: "reasons not to trust" },
    { category: 'Trust & Credibility', headline: "What makes customers trust one business website over another?", highlight: "trust one business" },
    { category: 'Trust & Credibility', headline: "3 things that can make a business look less professional online.", highlight: "less professional online." },
    { category: 'Trust & Credibility', headline: "Would you buy from your business if you were seeing it for the first time?", highlight: "for the first time?" },
    { category: 'Trust & Credibility', headline: "Why customers may hesitate to buy from a business they don't know yet.", highlight: "may hesitate to buy" },
    { category: 'Trust & Credibility', headline: "Your website should reduce doubt—not create more questions.", highlight: "reduce doubt" },
    { category: 'Trust & Credibility', headline: "What do customers look for before trusting an unfamiliar business online?", highlight: "trusting an unfamiliar business" },
    { category: 'Trust & Credibility', headline: "Your social media page is active, but can customers verify your business elsewhere?", highlight: "verify your business elsewhere?" },
    { category: 'Trust & Credibility', headline: "Before customers contact you, your website should answer these three questions.", highlight: "answer these three questions." },
    { category: 'Trust & Credibility', headline: "Does your online presence reflect the quality of your actual service?", highlight: "reflect the quality" }
  ],
  'Sales & Conversion': [
    { category: 'Sales & Conversion', headline: "People visit your website, but why aren't they making inquiries?", highlight: "making inquiries?" },
    { category: 'Sales & Conversion', headline: "Your website gets attention—but does it guide visitors toward a decision?", highlight: "toward a decision?" },
    { category: 'Sales & Conversion', headline: "3 reasons visitors might leave your website without buying.", highlight: "without buying." },
    { category: 'Sales & Conversion', headline: "Stop making customers work too hard to buy from your business.", highlight: "work too hard" },
    { category: 'Sales & Conversion', headline: "Your call-to-action button might be confusing your visitors.", highlight: "confusing your visitors." },
    { category: 'Sales & Conversion', headline: "Why a price alone may not explain the value of your offer.", highlight: "value of your offer." },
    { category: 'Sales & Conversion', headline: "How to turn website visitors into more meaningful customer inquiries.", highlight: "meaningful customer inquiries." },
    { category: 'Sales & Conversion', headline: "Your website should help customers understand what to do next.", highlight: "what to do next." },
    { category: 'Sales & Conversion', headline: "Make it easier for customers to contact you, book you or place an order.", highlight: "Make it easier" },
    { category: 'Sales & Conversion', headline: "Your website shouldn't just show products. It should help customers make informed decisions.", highlight: "informed decisions." }
  ],
  'SEO & Search Visibility': [
    { category: 'SEO & Search Visibility', headline: "Your website may be invisible to Google. Here's what to check.", highlight: "invisible to Google." },
    { category: 'SEO & Search Visibility', headline: "Having a website isn't enough if customers can't find it.", highlight: "can't find it." },
    { category: 'SEO & Search Visibility', headline: "3 SEO mistakes that could be limiting your website's visibility.", highlight: "limiting your website's visibility." },
    { category: 'SEO & Search Visibility', headline: "Google doesn't automatically show every website in search results. Here's what matters.", highlight: "search results." },
    { category: 'SEO & Search Visibility', headline: "Want people to find your business on Google? Start with these basics.", highlight: "find your business on Google" },
    { category: 'SEO & Search Visibility', headline: "What happens when a customer searches for your product and finds a competitor first?", highlight: "finds a competitor first?" },
    { category: 'SEO & Search Visibility', headline: "Your website is live—but have you checked whether Google can discover its pages?", highlight: "discover its pages?" },
    { category: 'SEO & Search Visibility', headline: "Why page titles and useful content matter for search visibility.", highlight: "search visibility." },
    { category: 'SEO & Search Visibility', headline: "SEO setup is a starting point, not a guarantee of first-page rankings.", highlight: "starting point" }
  ],
  'E-Commerce & Products': [
    { category: 'E-Commerce & Products', headline: "Your online store isn't broken—it may be making buying harder than it needs to be.", highlight: "making buying harder" },
    { category: 'E-Commerce & Products', headline: "People like your products. What might be stopping them from ordering?", highlight: "stopping them from ordering?" },
    { category: 'E-Commerce & Products', headline: "Why do some customers abandon their shopping carts before checkout?", highlight: "abandon their shopping carts" },
    { category: 'E-Commerce & Products', headline: "Your products deserve more than a WhatsApp status that disappears.", highlight: "WhatsApp status that disappears." },
    { category: 'E-Commerce & Products', headline: "Your competitor sells similar products. What might make customers choose them?", highlight: "choose them?" },
    { category: 'E-Commerce & Products', headline: "3 features every e-commerce website should get right.", highlight: "get right." },
    { category: 'E-Commerce & Products', headline: "What happens when a customer wants to buy but can't figure out how to order?", highlight: "how to order?" },
    { category: 'E-Commerce & Products', headline: "Why product descriptions matter just as much as product photos.", highlight: "product descriptions" }
  ],
  'Social Media & Strategy': [
    { category: 'Social Media & Strategy', headline: "Instagram is useful—but it doesn't have to be your entire online presence.", highlight: "entire online presence." },
    { category: 'Social Media & Strategy', headline: "Stop depending on WhatsApp to carry your whole sales process.", highlight: "whole sales process." },
    { category: 'Social Media & Strategy', headline: "What happens if your business relies on just one platform to reach customers?", highlight: "just one platform" },
    { category: 'Social Media & Strategy', headline: "Posting more content won't fix every business problem.", highlight: "won't fix every business problem." },
    { category: 'Social Media & Strategy', headline: "Before you spend more on ads, check where your visitors will land.", highlight: "where your visitors will land." },
    { category: 'Social Media & Strategy', headline: "Your social media brings attention. Where can customers go to learn more?", highlight: "learn more?" },
    { category: 'Social Media & Strategy', headline: "Read this before you hire a web designer.", highlight: "hire a web designer." },
    { category: 'Social Media & Strategy', headline: "Your business needs a digital strategy—not just a posting schedule.", highlight: "digital strategy" },
    { category: 'Social Media & Strategy', headline: "How your website and social media can work together instead of competing.", highlight: "work together" }
  ],
  'Branding & Business Identity': [
    { category: 'Branding & Business Identity', headline: "People form impressions of your business before they ever speak to you.", highlight: "before they ever speak to you." },
    { category: 'Branding & Business Identity', headline: "Looking less professional online can affect how customers perceive your offer.", highlight: "less professional online" },
    { category: 'Branding & Business Identity', headline: "Customers need to understand your brand—not just recognize your logo.", highlight: "understand your brand" },
    { category: 'Branding & Business Identity', headline: "Does your business look like it offers the value you charge for?", highlight: "value you charge for?" },
    { category: 'Branding & Business Identity', headline: "Your logo may not be the first thing you need to fix.", highlight: "first thing you need to fix." },
    { category: 'Branding & Business Identity', headline: "Why your website and branding should feel like one consistent business.", highlight: "one consistent business." },
    { category: 'Branding & Business Identity', headline: "Trust starts with how clearly you present your business online.", highlight: "how clearly you present" },
    { category: 'Branding & Business Identity', headline: "A strong brand helps customers choose you even when alternatives exist.", highlight: "choose you" }
  ],
  'AI Automation & Workflows': [
    { category: 'AI Automation & Workflows', headline: "Still answering repetitive customer questions manually at 2 AM? AI automation can handle that.", highlight: "AI automation can handle that." },
    { category: 'AI Automation & Workflows', headline: "How smart businesses in Nigeria are using AI to respond to leads in under 30 seconds.", highlight: "under 30 seconds." },
    { category: 'AI Automation & Workflows', headline: "Stop losing weekend sales: here is how an AI customer agent books clients while you sleep.", highlight: "books clients while you sleep." },
    { category: 'AI Automation & Workflows', headline: "Automating your repetitive sales workflow isn't the future—it's how your competitors are winning today.", highlight: "how your competitors are winning" },
    { category: 'AI Automation & Workflows', headline: "What if your WhatsApp and CRM could automatically qualify leads and send quotes without you lifting a finger?", highlight: "without you lifting a finger?" },
    { category: 'AI Automation & Workflows', headline: "Your staff is spending 15 hours a week copying data between spreadsheets. AI pipelines solve this.", highlight: "AI pipelines solve this." }
  ],
  'Custom Software & Apps': [
    { category: 'Custom Software & Apps', headline: "Outgrowing Excel spreadsheets? Here's how to know your business needs custom internal software.", highlight: "custom internal software." },
    { category: 'Custom Software & Apps', headline: "Why generic off-the-shelf software is slowing your operations down—and costing you more.", highlight: "slowing your operations down" },
    { category: 'Custom Software & Apps', headline: "Managing client bookings, staff, and payments on WhatsApp is costing you hours every week.", highlight: "costing you hours every week." },
    { category: 'Custom Software & Apps', headline: "Custom software isn't just for big tech companies. Here's how modern SMEs build tailored portals.", highlight: "tailored portals." }
  ],
  'CAC Registration & Business Trust': [
    { category: 'CAC Registration & Business Trust', headline: "Why having an official CAC registration badge makes customers 3x more likely to pay upfront.", highlight: "3x more likely to pay upfront." },
    { category: 'CAC Registration & Business Trust', headline: "Before customers transfer money to your account, they check these 3 trust signals.", highlight: "these 3 trust signals." },
    { category: 'CAC Registration & Business Trust', headline: "Protect your business name before someone else registers it legally.", highlight: "before someone else registers it" },
    { category: 'CAC Registration & Business Trust', headline: "A registered business and a dedicated corporate domain instantly eliminate client hesitation.", highlight: "eliminate client hesitation." }
  ]
};

export const DesignStudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'masters' | 'customizer'>('masters');
  const [selectedMaster, setSelectedMaster] = useState<MasterTemplate>(MASTER_TEMPLATES[0]);
  const [copiedCaptionId, setCopiedCaptionId] = useState<string | null>(null);
  const [schedulingPost, setSchedulingPost] = useState<MasterTemplate | null>(null);
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [isSubmittingSchedule, setIsSubmittingSchedule] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Customizer State
  const [customStyle, setCustomStyle] = useState<'LIGHT_FOUNDER' | 'ROYAL_BLUE' | 'MINIMAL_WHITE'>('LIGHT_FOUNDER');
  const [selectedCategory, setSelectedCategory] = useState<string>('Curiosity Hooks');
  const [headline, setHeadline] = useState("Most business owners are solving the wrong online problem. Here's how to spot it.");
  const [highlightWord, setHighlightWord] = useState("wrong online problem.");
  const [categoryTags, setCategoryTags] = useState("Websites • E-commerce • Branding");
  const [ctaText, setCtaText] = useState("Message us on WhatsApp");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyCaption = (template: MasterTemplate) => {
    navigator.clipboard.writeText(template.caption);
    setCopiedCaptionId(template.id);
    showToast('Caption and hashtags copied to clipboard!');
    setTimeout(() => setCopiedCaptionId(null), 2500);
  };

  const handleDownloadMaster = (template: MasterTemplate) => {
    const link = document.createElement('a');
    link.href = template.image;
    link.download = `Veltrix_Master_Template_${template.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloading exact master template: ${template.name}`);
  };

  const handleOpenScheduleModal = (template: MasterTemplate) => {
    setSchedulingPost(template);
    // Default to tomorrow 10:00 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    const localIso = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setScheduleDate(localIso);
  };

  const handleSubmitSchedule = async () => {
    if (!schedulingPost || !scheduleDate) return;
    try {
      setIsSubmittingSchedule(true);
      const token = localStorage.getItem('veltrix_token');
      const res = await fetch('/api/v1/calendar/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          caption: schedulingPost.caption,
          mediaUrls: [schedulingPost.image],
          scheduledFor: new Date(scheduleDate).toISOString()
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('Successfully scheduled post to Content Calendar!');
        setSchedulingPost(null);
      } else {
        showToast(data.error?.message || 'Could not schedule post.');
      }
    } catch (err: any) {
      showToast('Error scheduling post. Please check calendar connection.');
    } finally {
      setIsSubmittingSchedule(false);
    }
  };

  const handleSelectHook = (hook: HookItem) => {
    setHeadline(hook.headline);
    setHighlightWord(hook.highlight);
    showToast(`Loaded hook from ${hook.category}`);
  };

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('preview-canvas-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `Veltrix_Design_${Date.now()}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    showToast('Downloaded SVG vector file!');
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-emerald-900/50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Veltrix Brand Design Studio</h1>
            <span className="rounded-full bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-400">
              Photorealistic Master Assets
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Access your 4 exact high-definition master templates or customize new variants for your 165+ hooks with real brand imagery.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center rounded-xl bg-slate-900 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('masters')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'masters'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Exact Master Templates (6)</span>
          </button>

          <button
            onClick={() => setActiveTab('customizer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'customizer'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Dynamic Hook Studio</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: EXACT MASTER TEMPLATES (THE AUTHENTIC HIGH-RES ORIGINALS) */}
      {activeTab === 'masters' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white">Your Authentic High-Resolution Master Templates</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                These are your 6 official master flyers and photographic templates featuring Kayode's studio portrait, official Veltrix Hub gradient logo, device mockups, and verified contact footer.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                onClick={() => handleDownloadMaster(selectedMaster)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-orange-500 transition-colors min-h-[40px] sm:min-h-0 active:scale-95"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Selected Master (JPG)</span>
              </button>
              <button
                onClick={() => handleOpenScheduleModal(selectedMaster)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-500 transition-colors min-h-[40px] sm:min-h-0 active:scale-95"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Schedule to Calendar</span>
              </button>
            </div>
          </div>

          {/* Grid of the 6 Master Templates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {MASTER_TEMPLATES.map((tmpl) => {
              const isSelected = selectedMaster.id === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedMaster(tmpl)}
                  className={`group relative rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col bg-slate-900 ${
                    isSelected
                      ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-xl shadow-orange-500/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Image Container */}
                  <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
                    <img
                      src={tmpl.image}
                      alt={tmpl.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <span className="rounded-full bg-slate-950/80 backdrop-blur border border-white/10 px-2 py-0.5 text-[10px] font-bold text-white">
                        {tmpl.category}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2.5 left-2.5">
                        <span className="flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md">
                          <Check className="h-3 w-3" /> Selected
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-xs font-bold text-white line-clamp-1">{tmpl.name}</h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">"{tmpl.hookHeadline}"</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadMaster(tmpl);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-800 py-1.5 text-[11px] font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                        title="Download raw original JPG"
                      >
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyCaption(tmpl);
                        }}
                        className="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Copy pre-written post copy"
                      >
                        {copiedCaptionId === tmpl.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenScheduleModal(tmpl);
                        }}
                        className="flex items-center justify-center rounded-lg bg-emerald-600/20 border border-emerald-500/30 p-1.5 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                        title="Schedule this post to calendar"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Master Template Inspector & Caption Preview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-300 mb-2 self-start flex items-center gap-2">
                <Eye className="h-4 w-4 text-orange-400" />
                <span>Full-Resolution Master Inspection</span>
              </span>
              <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl max-w-sm w-full aspect-square bg-slate-950">
                <img
                  src={selectedMaster.image}
                  alt={selectedMaster.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full max-w-sm mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>Original Dimensions: 1080 × 1080 px</span>
                <span className="text-emerald-400 font-medium">Verified Photographic Quality</span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-orange-400">Selected Template</span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedMaster.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{selectedMaster.subtitle}</p>
              </div>

              {/* Pre-written Copy Box */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-300">Ready-to-Publish Caption & Hashtags</span>
                  <button
                    onClick={() => handleCopyCaption(selectedMaster)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-orange-400 hover:text-orange-300"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy Full Caption</span>
                  </button>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed">
                  {selectedMaster.caption}
                </div>
              </div>

              {/* First Comment Box with WhatsApp Link */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Pinned First Comment (Links kept in comments)</span>
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `Want a free initial review of your business's online presence or a professional website? Send Veltrix Hub a message.\nWhatsApp: https://wa.me/2348087098270`
                      );
                      showToast('First comment copied to clipboard!');
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy Comment</span>
                  </button>
                </div>
                <div className="text-xs text-slate-200 font-mono leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  Want a free initial review of your business's online presence or a professional website? Send Veltrix Hub a message.
                  <br />
                  <span className="text-emerald-400 font-semibold">WhatsApp: https://wa.me/2348087098270</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
                <button
                  onClick={() => handleDownloadMaster(selectedMaster)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-orange-600/20 hover:bg-orange-500 transition-all min-h-[44px] active:scale-95"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Master (JPG)</span>
                </button>

                <button
                  onClick={() => handleOpenScheduleModal(selectedMaster)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all min-h-[44px] active:scale-95"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Schedule to Content Calendar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DYNAMIC HOOK STUDIO (APPLY REAL BRAND ASSETS TO ANY OF THE 165+ HOOKS) */}
      {activeTab === 'customizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Panel */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. Layout Style Picker */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-2">
              <label className="block text-xs font-semibold text-white">1. Select Layout Style</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'LIGHT_FOUNDER', label: 'Light Founder' },
                  { id: 'ROYAL_BLUE', label: 'Royal Blue' },
                  { id: 'MINIMAL_WHITE', label: 'Minimal White' }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setCustomStyle(st.id as any)}
                    className={`py-2 px-2 rounded-xl border text-xs font-medium text-center transition-all ${
                      customStyle === st.id
                        ? 'border-orange-500 bg-orange-500/10 text-orange-400 font-bold'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. 165+ Categorized Hook Picker */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-white">2. Pick from 165+ Categorized Hooks</label>
                <span className="text-[10px] text-orange-400 font-mono">11 Categories</span>
              </div>

              {/* Category Selector */}
              <div>
                <span className="block text-[11px] text-slate-400 mb-1">Hook Category</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-orange-500 focus:outline-none"
                >
                  {Object.keys(CATEGORIZED_HOOKS).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} ({CATEGORIZED_HOOKS[cat].length} hooks)
                    </option>
                  ))}
                </select>
              </div>

              {/* Hook Item Selector */}
              <div>
                <span className="block text-[11px] text-slate-400 mb-1">Choose Specific Headline Hook</span>
                <select
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    if (!isNaN(idx) && CATEGORIZED_HOOKS[selectedCategory]?.[idx]) {
                      handleSelectHook(CATEGORIZED_HOOKS[selectedCategory][idx]);
                    }
                  }}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-orange-500 focus:outline-none"
                >
                  {CATEGORIZED_HOOKS[selectedCategory]?.map((h, i) => (
                    <option key={i} value={i}>
                      {h.headline.length > 55 ? `${h.headline.slice(0, 55)}...` : h.headline}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Text & Copy Customizer */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3">
              <label className="block text-xs font-semibold text-white">3. Refine Copy & CTA</label>

              <div>
                <span className="block text-[11px] text-slate-400 mb-1">Headline Text</span>
                <textarea
                  rows={2}
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <span className="block text-[11px] text-slate-400 mb-1">Highlighted Word / Phrase (Veltrix Orange)</span>
                <input
                  type="text"
                  value={highlightWord}
                  onChange={(e) => setHighlightWord(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-orange-400 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <span className="block text-[11px] text-slate-400 mb-1">Services Tagline</span>
                <input
                  type="text"
                  value={categoryTags}
                  onChange={(e) => setCategoryTags(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <span className="block text-[11px] text-slate-400 mb-1">CTA Button Text</span>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Export Actions */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleDownloadSVG}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Vector (SVG)</span>
              </button>

              <button
                onClick={() => {
                  handleOpenScheduleModal({
                    id: 'custom_hook',
                    name: 'Custom Hook Design',
                    subtitle: headline,
                    image: '/designs/veltrix-design-1.jpg',
                    hookHeadline: headline,
                    hookHighlight: highlightWord,
                    category: selectedCategory,
                    caption: `${headline}\n\n${categoryTags}\n\n👉 Want a free initial review of your business's online presence? Check our first comment below! 👇\n\n#VeltrixHub #DigitalGrowth #BusinessTrust`
                  });
                }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-colors"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Schedule Post</span>
              </button>
            </div>
          </div>

          {/* Live High-Definition Preview Canvas with REAL CEO Photo & REAL Logo */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-orange-400" />
                <span>Live High-Definition Canvas (Photorealistic)</span>
              </span>
              <span className="font-mono text-[11px] text-orange-400">1080 × 1080 px</span>
            </div>

            <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-800 aspect-square bg-slate-950">
              <svg
                id="preview-canvas-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1080 1080"
                className="w-full h-full select-none"
              >
                <defs>
                  {/* Clip path for Kayode Founder Photo */}
                  <clipPath id="avatarRoundClip">
                    <circle cx="55" cy="55" r="46" />
                  </clipPath>

                  {/* Clip path for Logo Badge */}
                  <clipPath id="logoRoundClip">
                    <circle cx="50" cy="50" r="48" />
                  </clipPath>

                  {/* Gradients */}
                  <linearGradient id="orangeCtaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F5691C" />
                    <stop offset="100%" stopColor="#FF8F3D" />
                  </linearGradient>

                  <linearGradient id="royalBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0B1E5B" />
                    <stop offset="100%" stopColor="#06154C" />
                  </linearGradient>

                  <linearGradient id="waveBlueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1E40AF" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>

                {/* Background Layer */}
                {customStyle === 'LIGHT_FOUNDER' && (
                  <>
                    <rect width="1080" height="1080" fill="#FFFFFF" />
                    {/* Halftone / Dot pattern */}
                    <g opacity="0.18">
                      {Array.from({ length: 8 }).map((_, r) =>
                        Array.from({ length: 9 }).map((_, c) => (
                          <circle key={`${r}-${c}`} cx={900 + c * 18} cy={60 + r * 18} r="2.8" fill="#1E3A8A" />
                        ))
                      )}
                    </g>
                    {/* Top-Left Corner Curve Accent */}
                    <path d="M 0 0 L 150 0 Q 75 75 0 150 Z" fill="#F5691C" />
                  </>
                )}

                {customStyle === 'ROYAL_BLUE' && (
                  <>
                    <rect width="1080" height="1080" fill="url(#royalBlueGrad)" />
                    {/* Orange disc backdrop on left */}
                    <circle cx="160" cy="540" r="280" fill="#F5691C" opacity="0.95" />
                  </>
                )}

                {customStyle === 'MINIMAL_WHITE' && (
                  <>
                    <rect width="1080" height="1080" fill="#F8FAFC" />
                    <circle cx="540" cy="850" r="320" fill="#F5691C" opacity="0.9" />
                  </>
                )}

                {/* Top-Left Real Veltrix Hub Logo Badge */}
                <g transform="translate(60, 48)">
                  <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#0D47A1" strokeWidth="2.5" />
                  <image
                    href="/brand/logo.png"
                    x="2"
                    y="2"
                    width="96"
                    height="96"
                    preserveAspectRatio="xMidYMid contain"
                    clipPath="url(#logoRoundClip)"
                  />
                </g>

                {/* Main Headline */}
                <foreignObject x="80" y="195" width="920" height="300">
                  <div
                    style={{
                      color: customStyle === 'ROYAL_BLUE' ? '#FFFFFF' : '#06154C',
                      fontFamily: 'Montserrat, system-ui, -apple-system, sans-serif',
                      fontSize: '66px',
                      fontWeight: 900,
                      lineHeight: '1.14',
                      letterSpacing: '-0.025em'
                    }}
                  >
                    {headline.split(highlightWord).map((chunk, i, arr) => (
                      <React.Fragment key={i}>
                        {chunk}
                        {i < arr.length - 1 && (
                          <span style={{ color: '#F5691C' }}>{highlightWord}</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </foreignObject>

                {/* Category Subtext (Websites • E-commerce • Branding) */}
                <g transform="translate(80, 510)">
                  <text
                    x="0"
                    y="20"
                    fill={customStyle === 'ROYAL_BLUE' ? '#93C5FD' : '#0D47A1'}
                    fontSize="28"
                    fontWeight="800"
                    fontFamily="Montserrat, sans-serif"
                    letterSpacing="0.01em"
                  >
                    {categoryTags}
                  </text>
                </g>

                {/* CTA Pill Button with WhatsApp Icon */}
                <g transform="translate(80, 565)">
                  <rect width="440" height="68" rx="34" fill="url(#orangeCtaGrad)" />
                  {/* WhatsApp SVG Icon inside CTA */}
                  <g transform="translate(32, 17) scale(0.065)">
                    <path
                      d="M 191.1 33.7 C 147.2 -10.2 75.8 -10.2 31.9 33.7 C -12 77.6 -12 149 31.9 192.9 L 10 260 L 78.8 238.2 C 122.7 274.6 186.7 266.3 220.6 220.6 C 254.5 174.9 246.3 110.9 200.6 77 C 197.4 74.4 194.2 72 191.1 33.7 Z"
                      fill="#FFFFFF"
                    />
                  </g>
                  <text x="245" y="43" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    {ctaText}
                  </text>
                </g>

                {/* Real Photographic Founder Avatar Badge (Kayode) */}
                {customStyle === 'LIGHT_FOUNDER' && (
                  <g transform="translate(80, 695)">
                    {/* Orange Outer Ring */}
                    <circle cx="55" cy="55" r="52" fill="#F5691C" />
                    <circle cx="55" cy="55" r="48" fill="#FFFFFF" />
                    {/* Actual Photograph of Kayode */}
                    <image
                      href="/brand/kayode-photo.jpg"
                      x="9"
                      y="9"
                      width="92"
                      height="92"
                      preserveAspectRatio="xMidYMid slice"
                      clipPath="url(#avatarRoundClip)"
                    />
                    <text x="125" y="48" fill="#06154C" fontSize="26" fontWeight="bold" fontFamily="sans-serif">
                      Kayode,
                    </text>
                    <text x="125" y="74" fill="#475569" fontSize="20" fontWeight="500" fontFamily="sans-serif">
                      Founder, Veltrix Hub
                    </text>
                  </g>
                )}

                {/* Bottom Fluid Wave Curves */}
                <path
                  d="M 0 920 Q 250 880, 540 930 T 1080 900 L 1080 970 L 0 970 Z"
                  fill="url(#waveBlueGrad)"
                  opacity="0.35"
                />
                <path
                  d="M 0 940 Q 300 900, 600 950 T 1080 920 L 1080 970 L 0 970 Z"
                  fill="#1D4ED8"
                  opacity="0.85"
                />

                {/* White Contact Footer Bar (3 Columns) */}
                <rect x="0" y="970" width="1080" height="110" fill="#FFFFFF" />
                <line x1="0" y1="970" x2="1080" y2="970" stroke="#E2E8F0" strokeWidth="2" />

                {/* Column 1: WhatsApp with REAL WhatsApp Icon */}
                <g transform="translate(60, 988)">
                  <circle cx="26" cy="36" r="22" fill="#22C55E" />
                  {/* WhatsApp SVG Phone Symbol */}
                  <g transform="translate(14, 24) scale(0.048)">
                    <path
                      d="M 260 0 C 116.4 0 0 116.4 0 260 C 0 306 12 350.4 34.8 388.8 L 0 520 L 133.2 485.2 C 170.4 505.2 214.8 520 260 520 C 403.6 520 520 403.6 520 260 C 520 116.4 403.6 0 260 0 Z"
                      fill="#FFFFFF"
                    />
                  </g>
                  <text x="58" y="27" fill="#64748B" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                    WHATSAPP
                  </text>
                  <text x="58" y="48" fill="#06154C" fontSize="17" fontWeight="bold" fontFamily="sans-serif">
                    +2348087098270
                  </text>
                </g>
                <line x1="390" y1="990" x2="390" y2="1060" stroke="#CBD5E1" strokeWidth="1.5" />

                {/* Column 2: Website with REAL Globe Icon */}
                <g transform="translate(420, 988)">
                  <circle cx="26" cy="36" r="22" fill="#2563EB" />
                  {/* Globe SVG */}
                  <g transform="translate(16, 26) scale(0.8)">
                    <circle cx="12" cy="12" r="10" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                    <line x1="2" y1="12" x2="22" y2="12" stroke="#FFFFFF" strokeWidth="2" />
                    <path d="M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                  </g>
                  <text x="58" y="27" fill="#64748B" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                    WEBSITE
                  </text>
                  <text x="58" y="48" fill="#06154C" fontSize="17" fontWeight="bold" fontFamily="sans-serif">
                    Veltrixhub.ng
                  </text>
                </g>
                <line x1="710" y1="990" x2="710" y2="1060" stroke="#CBD5E1" strokeWidth="1.5" />

                {/* Column 3: Social Media with REAL Brand Badges */}
                <g transform="translate(735, 988)">
                  {/* Facebook */}
                  <circle cx="20" cy="36" r="16" fill="#1877F2" />
                  <text x="20" y="42" fill="#FFFFFF" fontSize="18" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    f
                  </text>
                  {/* Instagram */}
                  <circle cx="56" cy="36" r="16" fill="#E4405F" />
                  <rect x="48" y="28" width="16" height="16" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="56" cy="36" r="3.5" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
                  {/* TikTok */}
                  <circle cx="92" cy="36" r="16" fill="#000000" />
                  <text x="92" y="43" fill="#FFFFFF" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    ♪
                  </text>
                  <text x="120" y="43" fill="#06154C" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
                    @officialveltrixhub
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE POST MODAL */}
      {schedulingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Schedule Post to Content Calendar</h3>
              </div>
              <button
                onClick={() => setSchedulingPost(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <img
                src={schedulingPost.image}
                alt="Post preview"
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div>
                <span className="text-xs font-bold text-white block">{schedulingPost.name}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Veltrix Hub Official Facebook Page</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">Scheduled Publication Date & Time</label>
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">Caption Preview</label>
              <textarea
                rows={4}
                value={schedulingPost.caption}
                onChange={(e) =>
                  setSchedulingPost({ ...schedulingPost, caption: e.target.value })
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSchedulingPost(null)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitSchedule}
                disabled={isSubmittingSchedule || !scheduleDate}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors disabled:opacity-50"
              >
                {isSubmittingSchedule ? (
                  <span>Scheduling...</span>
                ) : (
                  <>
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Confirm & Schedule</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
