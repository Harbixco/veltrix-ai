export const VELTRIX_BRAND_DEFAULTS = {
  businessName: 'Veltrix Hub',
  tagline: "We don't just build websites. We build trust.",
  mission: 'To help businesses become visible online, attract more customers, build trust, and increase sales through professional digital solutions.',
  vision: "To become one of Africa's most trusted digital growth brands, helping thousands of businesses build a powerful online presence.",
  location: 'Nigeria',
  brandVoice: 'Clear, educational, empathetic, confident, inspiring, practical, and professional.',
  colors: {
    primary: '#0F172A',   // Slate 900
    secondary: '#2563EB', // Blue 600
    accent: '#38BDF8',    // Sky 400
    neutral: '#64748B',   // Slate 500
    dark: '#020617',      // Slate 950
    light: '#F8FAFC'      // Slate 50
  },
  typography: {
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter'
  }
};

export const VELTRIX_SERVICES = [
  {
    name: 'Website Development',
    slug: 'website-development',
    description: 'High-performance, conversion-focused corporate and portfolio websites that establish credibility and turn visitors into qualified inquiries.',
    benefits: ['Professional online presence', 'Mobile responsive and lightning fast', 'Search engine friendly structure', 'Built for conversion'],
    painPoints: ['Losing customers because people cannot find you online', 'Unprofessional appearance harming trust', 'Relying exclusively on WhatsApp status'],
    targetAudience: 'Small and medium business owners, startups, corporate organizations',
    defaultCta: 'Request a free website consultation today.',
    orderIndex: 1
  },
  {
    name: 'E-commerce Development',
    slug: 'ecommerce-development',
    description: 'Secure, automated online stores with automated payment gateways and inventory tracking.',
    benefits: ['Sell 24/7 without manual messaging', 'Direct payment collection (Paystack, Flutterwave)', 'Automated customer receipts and order tracking'],
    painPoints: ['Overwhelmed by manual DM orders', 'Customers abandoning purchases due to friction', 'Loss of payment records'],
    targetAudience: 'Retail brands, fashion designers, beauty stores, food vendors',
    defaultCta: 'Start selling online 24/7. Get your e-commerce store built.',
    orderIndex: 2
  },
  {
    name: 'Mobile App Development',
    slug: 'mobile-app-development',
    description: 'Custom iOS and Android mobile applications that give customers an effortless, direct way to interact with your services.',
    benefits: ['Direct push notifications to clients', 'Frictionless customer retention', 'Modern operational workflows'],
    painPoints: ['Competitors providing faster app experiences', 'Difficulty maintaining recurring customer contact'],
    targetAudience: 'Growth-stage businesses, logistics firms, fintechs, service providers',
    defaultCta: 'Bring your business directly to your customers’ phones.',
    orderIndex: 3
  },
  {
    name: 'Search Engine Optimization (SEO)',
    slug: 'seo',
    description: 'Data-driven on-page, technical, and local SEO strategies that place your business in front of customers actively searching on Google.',
    benefits: ['Consistent organic inbound leads without paying for every ad click', 'Higher authority and trust in your industry', 'Long-term customer acquisition'],
    painPoints: ['Having a website that nobody visits', 'Ranking behind competitors on Google search results', 'Wasting ad spend without building lasting visibility'],
    targetAudience: 'Businesses with existing websites looking for sustainable traffic',
    defaultCta: 'Discover where you rank on Google. Book an SEO audit.',
    orderIndex: 4
  },
  {
    name: 'AI Automation',
    slug: 'ai-automation',
    description: 'Intelligent business automation pipelines that eliminate repetitive tasks, route customer inquiries instantly, and reduce operating costs.',
    benefits: ['Instant 24/7 lead responses', 'Zero manual data entry errors', 'Automated follow-up reminders that close deals'],
    painPoints: ['Spending hours answering the same questions on WhatsApp', 'Delayed responses losing hot leads', 'Overworked administrative staff'],
    targetAudience: 'Busy entrepreneurs, agencies, clinics, consulting firms',
    defaultCta: 'Automate your repetitive business tasks today.',
    orderIndex: 5
  },
  {
    name: 'Graphic Design',
    slug: 'graphic-design',
    description: 'Impactful marketing visuals, promotional flyers, brochures, and digital banners that capture attention and communicate value.',
    benefits: ['Stops the scroll on crowded social feeds', 'Communicates pricing and offers clearly', 'Maintains a premium aesthetic across all platforms'],
    painPoints: ['Amateur-looking flyers reducing perceived value', 'Inconsistent visuals confusing customers', 'Struggling to design high-quality graphics quickly'],
    targetAudience: 'Brands running promotional campaigns and product launches',
    defaultCta: 'Upgrade your visual marketing with professional design.',
    orderIndex: 6
  },
  {
    name: 'Business Branding',
    slug: 'business-branding',
    description: 'Comprehensive brand identity development including logo suites, typography rules, brand voice guidelines, and stationery.',
    benefits: ['Instantly commands premium pricing', 'Memorable and recognized brand footprint', 'Consistent corporate guidelines for all staff'],
    painPoints: ['Lack of consistent identity', 'Looking like an unverified informal seller', 'Low customer trust'],
    targetAudience: 'New businesses, rebranding companies, personal brands',
    defaultCta: 'Build a brand that customers respect and remember.',
    orderIndex: 7
  },
  {
    name: 'Website Maintenance',
    slug: 'website-maintenance',
    description: 'Ongoing technical upkeep, security patches, daily backups, speed optimization, and content updates to keep your site running seamlessly.',
    benefits: ['Zero downtime worries', 'Protection against hacking and malware', 'Fresh, up-to-date content without technical headaches'],
    painPoints: ['Broken site features after updates', 'Hacked websites losing customer trust', 'No developer available when things break'],
    targetAudience: 'Any business operating a mission-critical website',
    defaultCta: 'Keep your website secure, fast, and always online.',
    orderIndex: 8
  },
  {
    name: 'CAC Business Registration',
    slug: 'cac-registration',
    description: 'End-to-end Corporate Affairs Commission (CAC) business name and company registration, tax compliance, and official documentation.',
    benefits: ['Legally registered business entity', 'Qualifies for corporate bank accounts and government grants', 'Protects your business name from theft'],
    painPoints: ['Customers hesitant to pay into personal bank accounts', 'Risk of someone else registering your brand name first', 'Bureaucracy and confusion with paperwork'],
    targetAudience: 'Unregistered business owners, entrepreneurs, new startups',
    defaultCta: 'Legitimize your business with official CAC registration.',
    orderIndex: 9
  },
  {
    name: 'Digital Consultation',
    slug: 'digital-consultation',
    description: 'One-on-one strategic advisory sessions auditing your current marketing, conversion funnels, and online visibility to build a customized growth blueprint.',
    benefits: ['Clarity on what to fix first', 'Avoid wasting money on ineffective marketing', 'Actionable, step-by-step digital roadmap'],
    painPoints: ['Confusion about which marketing channel to prioritize', 'Spending money without seeing sales results', 'Lack of a clear strategy'],
    targetAudience: 'Business executives, directors, ambitious founders',
    defaultCta: 'Book a strategic digital growth consultation.',
    orderIndex: 10
  },
  {
    name: 'Website Training',
    slug: 'website-training',
    description: 'Practical, hands-on training sessions teaching you or your staff how to update, manage, and optimize your website confidently.',
    benefits: ['Empowered in-house team', 'Zero ongoing costs for minor text/product updates', 'Step-by-step recorded documentation'],
    painPoints: ['Depending on an external agency for every minor word change', 'Fear of breaking the website by accident'],
    targetAudience: 'In-house marketing teams, small business owners, administrative assistants',
    defaultCta: 'Master your website. Book a personalized training session.',
    orderIndex: 11
  }
];

export const CONTENT_PILLARS = [
  'EDUCATION',
  'BUSINESS_GROWTH',
  'AUTHORITY',
  'INSPIRATION',
  'PROMOTION'
] as const;

export const LEAD_STAGES = [
  'NEW',
  'CONTACTED',
  'INTERESTED',
  'QUALIFIED',
  'PROPOSAL_SENT',
  'NEGOTIATION',
  'WON',
  'LOST'
] as const;
