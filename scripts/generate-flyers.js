import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('apps/web/public/designs/flyers');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const FLYERS = [
  // --- PAST DAYS ---
  {
    fileName: 'flyer-nov10-website-mistakes.svg',
    style: 'DARK_MATRIX',
    badge: 'CONVERSION & REVENUE AUDIT',
    headline: '5 signs your business website is losing you customers in 2026.',
    highlight: 'losing you customers',
    bullets: [
      'Non-mobile responsive on budget smartphones',
      'Loads slower than 3 seconds on local 4G networks',
      'Missing direct 1-tap WhatsApp conversion button'
    ],
    cta: 'Book a Free Website & Funnel Review on WhatsApp',
    tagline: 'INNOVATE • BUILD • SCALE'
  },
  {
    fileName: 'flyer-nov11-react-state.svg',
    style: 'TECH_ARCHITECT',
    badge: 'REACT.JS ARCHITECTURE',
    headline: "Most React lag isn't missing useMemo. It's lifting state too high.",
    highlight: 'lifting state too high.',
    bullets: [
      'Keep state local to the component that needs it',
      '90% of unnecessary re-renders vanish instantly',
      'Zero complex memoization dependencies needed'
    ],
    codeSnippet: `// ❌ Bad: State lifted to root causing app-wide lag\n// ✅ Good: Local component state\nconst [query, setQuery] = useState('');`,
    cta: 'Follow @AbiodunBuilds for Frontend Engineering Insights'
  },
  {
    fileName: 'flyer-nov12-cac-registration.svg',
    style: 'LIGHT_AUTHORITY',
    badge: 'CAC & BUSINESS COMPLIANCE',
    headline: "CAC Registration isn't an expense. It's the foundation of business trust.",
    highlight: 'foundation of business trust.',
    bullets: [
      'Open verified corporate business bank accounts',
      'Protect your business name from competitor theft',
      'Qualify for corporate contracts and federal grants'
    ],
    cta: 'Register Your Business Name Smoothly with Veltrix Hub',
    tagline: 'OFFICIAL CORPORATE AFFAIRS REGISTRATION'
  },
  {
    fileName: 'flyer-nov13-senior-mindset.svg',
    style: 'TECH_ARCHITECT',
    badge: 'ENGINEERING LEADERSHIP',
    headline: 'The difference between a junior and senior engineer is code deletion.',
    highlight: 'code deletion.',
    bullets: [
      'Junior engineers debate frameworks and libraries',
      'Senior engineers focus on architecture and data models',
      'Staff engineers prioritize user experience and business ROI'
    ],
    codeSnippet: `// The ultimate sophistication is simplicity.\n// Write less code. Ship more business value.`,
    cta: 'Building Software that Drives Real Revenue • Veltrix Hub'
  },

  // --- TODAY: NOV 14 ---
  {
    fileName: 'flyer-nov14-website-speed.svg',
    style: 'DARK_MATRIX',
    badge: 'WEBSITE SPEED & CONVERSION',
    headline: 'Why 70% of business websites lose customers before reading the offer.',
    highlight: 'Why 70% lose customers',
    bullets: [
      'Pages that take >4 seconds to load have an 82% bounce rate',
      'Lack of clear value proposition above the fold',
      'Zero instant messaging or direct WhatsApp checkout'
    ],
    cta: 'Get a Fast, High-Converting Website Built for Trust',
    tagline: 'HIGH-PERFORMANCE WEB INFRASTRUCTURE'
  },
  {
    fileName: 'flyer-nov14-react-perf.svg',
    style: 'TECH_ARCHITECT',
    badge: 'REACT.JS ARCHITECTURE',
    headline: 'Stop lifting state higher than it needs to be.',
    highlight: 'lifting state higher',
    bullets: [
      'Lifting state to top levels forces subtree re-renders',
      'Colocate state right next to the UI that renders it',
      'Better maintainability and buttery-smooth 60 FPS UI'
    ],
    codeSnippet: `// Colocation Pattern:\nfunction SearchBox() {\n  const [text, setText] = useState(''); // stays local!\n  return <input value={text} onChange={e => setText(e.target.value)} />;\n}`,
    cta: 'React.js & Frontend Pro Tips • @AbiodunBuilds'
  },
  {
    fileName: 'flyer-nov14-ai-lead-response.svg',
    style: 'DARK_MATRIX',
    badge: 'AI AUTOMATION & WORKFLOWS',
    headline: 'Qualify leads and send custom quotations in under 20 seconds with AI.',
    highlight: 'in under 20 seconds',
    bullets: [
      'Connect LLMs directly to your product inventory & pricing',
      'WhatsApp bot qualifies buyer intent 24 hours a day',
      'Deliver tailored proposals while competitors are asleep'
    ],
    cta: 'Deploy Custom AI Automations for Your Business Today',
    tagline: 'AUTOMATE YOUR REPETITIVE WORKFLOWS'
  },

  // --- NOV 15 ---
  {
    fileName: 'flyer-nov15-branding-trust.svg',
    style: 'LIGHT_AUTHORITY',
    badge: 'CORPORATE BRANDING & TRUST',
    headline: 'Customers happily pay 3x more to businesses with verified branding.',
    highlight: 'pay 3x more',
    bullets: [
      'Clean typography and corporate identity command respect',
      'Custom domain emails replace informal Gmail addresses',
      'High perceived value eliminates price-haggling clients'
    ],
    cta: 'Elevate Your Visual Identity with Veltrix Hub Branding',
    tagline: 'PREMIUM BRANDING & CORPORATE IDENTITY'
  },
  {
    fileName: 'flyer-nov15-derived-state.svg',
    style: 'TECH_ARCHITECT',
    badge: 'CLEAN ARCHITECTURE',
    headline: 'Stop using useEffect to synchronize state. Calculate it during render.',
    highlight: 'Calculate it during render.',
    bullets: [
      'Derived state eliminates extra render cycles',
      'Zero state synchronization bugs or race conditions',
      'Code becomes clean, readable, and predictable'
    ],
    codeSnippet: `// ❌ const [fullName, setFullName] = useState('');\n// ✅ const fullName = \`\${firstName} \${lastName}\`;\n// Zero extra render. Zero bugs.`,
    cta: 'Clean Code Practices • Follow @AbiodunBuilds'
  },
  {
    fileName: 'flyer-nov15-deterministic-ai.svg',
    style: 'DARK_MATRIX',
    badge: 'AI WORKFLOW ARCHITECTURE',
    headline: "Businesses don't need generic prompts. They need deterministic AI.",
    highlight: 'deterministic AI.',
    bullets: [
      'Step 1: Automatically ingest lead message from WhatsApp',
      'Step 2: Query database records via secure API',
      'Step 3: Generate calculated quotation and calendar invite'
    ],
    cta: 'Custom Business Software & Automations • Veltrix Hub',
    tagline: 'RELIABLE DETERMINISTIC PIPELINES'
  },

  // --- NOV 16 ---
  {
    fileName: 'flyer-nov16-website-uptime.svg',
    style: 'DARK_MATRIX',
    badge: 'WEBSITE MAINTENANCE & CARE',
    headline: 'An unmonitored website can go offline for days without you knowing.',
    highlight: 'go offline for days',
    bullets: [
      '24/7 automated ping monitoring alerts you immediately',
      'Daily offsite database backups protect against data loss',
      'Security patches prevent malware and hacked domains'
    ],
    cta: 'Never Miss a Customer with 24/7 Website Care & Support',
    tagline: 'ZERO-DOWNTIME INFRASTRUCTURE'
  },
  {
    fileName: 'flyer-nov16-typescript-pro.svg',
    style: 'TECH_ARCHITECT',
    badge: 'TYPESCRIPT PRO',
    headline: "Stop reaching for 'any'. Use 'unknown' paired with a custom type guard.",
    highlight: "Stop reaching for 'any'.",
    bullets: [
      "'any' disables the TypeScript compiler safety entirely",
      "'unknown' forces you to validate API response shapes",
      'Catch structural bugs at compile-time instead of in production'
    ],
    codeSnippet: `function isUser(data: unknown): data is User {\n  return typeof data === 'object' && data !== null && 'id' in data;\n}`,
    cta: 'TypeScript Engineering Standards • @AbiodunBuilds'
  },
  {
    fileName: 'flyer-nov16-tutorial-hell.svg',
    style: 'TECH_ARCHITECT',
    badge: 'LEARN WEB DEV',
    headline: 'How to escape tutorial hell in 3 steps: Build real products from zero.',
    highlight: 'escape tutorial hell',
    bullets: [
      '1. Stop watching endless 10-hour build videos on YouTube',
      '2. Pick 1 real-world business tool (e.g. invoice generator)',
      '3. Build it from scratch. Read documentation and solve errors yourself'
    ],
    codeSnippet: `// Real learning starts when the tutorial stops.\n// Build in public. Ship to production.`,
    cta: 'Developer Career Roadmap • Follow @AbiodunBuilds'
  },

  // --- NOV 17 ---
  {
    fileName: 'flyer-nov17-cac-protect-name.svg',
    style: 'LIGHT_AUTHORITY',
    badge: 'LEGAL REGISTRATION',
    headline: 'Is your business legally registered before a competitor takes your name?',
    highlight: 'legally registered',
    bullets: [
      'Operating unregistered leaves your brand name open to theft',
      'Get registered with CAC without paperwork headaches',
      'Receive official certificate, Tax ID (TIN), and status report'
    ],
    cta: 'Register Your Business Entity with Veltrix Hub Today',
    tagline: 'CORPORATE COMPLIANCE & LEGAL SAFETY'
  },
  {
    fileName: 'flyer-nov17-mobile-first.svg',
    style: 'DARK_MATRIX',
    badge: 'FRONTEND REALITY',
    headline: 'Designers design on a 4K Mac. Customers visit on a $90 smartphone.',
    highlight: 'on a $90 smartphone.',
    bullets: [
      'Test your web apps on throttled 3G networks in transit',
      'Ensure touch targets are comfortably sized (44px min)',
      'Optimize image payloads to save client data costs'
    ],
    cta: 'We Build Ultra-Fast Mobile-First Web Apps • Veltrix Hub',
    tagline: 'OPTIMIZED FOR REAL USERS'
  },
  {
    fileName: 'flyer-nov17-roadmap-2026.svg',
    style: 'TECH_ARCHITECT',
    badge: 'LEARN WEB DEV',
    headline: 'If I had to learn web development from zero in 2026:',
    highlight: 'from zero in 2026:',
    bullets: [
      'Month 1: HTML, CSS & Modern Flexbox/Grid Layouts',
      'Month 2: Core JavaScript & DOM Event Manipulation',
      'Month 3: React.js, TypeScript & Component Architecture',
      'Month 4: Build 3 Fullstack CRUD SaaS Apps with Databases'
    ],
    codeSnippet: `// Focus on fundamentals first.\n// Don't jump between 10 frameworks at once.`,
    cta: 'Actionable Tech Roadmaps • Follow @AbiodunBuilds'
  },

  // --- NOV 18 ---
  {
    fileName: 'flyer-nov18-ai-quotes-2am.svg',
    style: 'DARK_MATRIX',
    badge: 'AUTOMATED LEAD ACQUISITION',
    headline: 'Answer customer inquiries & book consultations at 2 AM with AI.',
    highlight: 'at 2 AM with AI.',
    bullets: [
      'Over 40% of customer inquiries arrive outside working hours',
      'AI chatbot captures phone numbers and qualifies requirements',
      'Wake up every morning to pre-qualified sales appointments'
    ],
    cta: 'Set Up Automated Lead Funnels for Your Business',
    tagline: '24/7 CUSTOMER CONVERSION ENGINES'
  },
  {
    fileName: 'flyer-nov18-react-native.svg',
    style: 'TECH_ARCHITECT',
    badge: 'MOBILE APP DEV',
    headline: 'React Native New Architecture: 60 FPS & 85% shared code.',
    highlight: '60 FPS & 85% shared code.',
    bullets: [
      'Hermes JavaScript engine brings instant app bootup',
      'Direct C++ TurboModules eliminate asynchronous bridge lag',
      'Build once for iOS & Android without doubling dev costs'
    ],
    codeSnippet: `// Native performance without duplicate engineering teams.\n// Ship to Google Play & Apple App Store simultaneously.`,
    cta: 'Custom Mobile App Engineering • Veltrix Hub'
  },
  {
    fileName: 'flyer-nov18-engineer-founder.svg',
    style: 'LIGHT_AUTHORITY',
    badge: 'FOUNDER & ENGINEER',
    headline: 'Writing code is only 50% of the job. The other 50% is business outcomes.',
    highlight: 'business outcomes.',
    bullets: [
      'Code that does not solve a business problem is financial waste',
      'Engineers who understand revenue and conversion are unstoppable',
      'We architect technology to make our clients money'
    ],
    cta: 'Work with Digital Growth Engineers • Veltrix Hub',
    tagline: 'ENGINEERED FOR BUSINESS REVENUE'
  },

  // --- NOV 19 ---
  {
    fileName: 'flyer-nov19-flyers-convert.svg',
    style: 'DARK_MATRIX',
    badge: 'GRAPHIC DESIGN & ADS',
    headline: 'Flyers that convert vs Flyers that get scrolled past on feeds.',
    highlight: 'Flyers that convert',
    bullets: [
      '1 clear bold headline that stops the thumb scroll',
      '3 concrete benefits instead of cluttered walls of text',
      'Direct WhatsApp conversion pointer with zero confusion'
    ],
    cta: 'High-Converting Marketing Flyers & Creative Banners',
    tagline: 'SCROLL-STOPPING VISUAL MARKETING'
  },
  {
    fileName: 'flyer-nov19-pwa-vs-native.svg',
    style: 'TECH_ARCHITECT',
    badge: 'STARTUP STRATEGY',
    headline: 'Do you really need an App Store download? Try a PWA first.',
    highlight: 'Try a PWA first.',
    bullets: [
      'No 30% App Store revenue tax or 7-day review waiting times',
      'Instant installation from any browser URL with 1 tap',
      'Launch to market in 2 weeks for 1/3 the engineering budget'
    ],
    codeSnippet: `// Progressive Web Apps:\n// Zero app store friction. 100% web distribution.`,
    cta: 'Startup Tech Strategy • Follow @AbiodunBuilds'
  },
  {
    fileName: 'flyer-nov19-senior-code.svg',
    style: 'TECH_ARCHITECT',
    badge: 'SOFTWARE ARCHITECTURE',
    headline: 'Junior devs debate frameworks. Senior devs focus on business value.',
    highlight: 'focus on business value.',
    bullets: [
      'Your users do not care which state management library you picked',
      'They care if the app loads fast, solves their problem, and is reliable',
      'Choose boring, proven technology that ships on time'
    ],
    codeSnippet: `// Simplicity scales. Complexity breaks at 2 AM.\n// Build rock-solid systems that last.`,
    cta: 'Senior Architecture Principles • @AbiodunBuilds'
  },

  // --- NOV 20 ---
  {
    fileName: 'flyer-nov20-digital-audit.svg',
    style: 'LIGHT_AUTHORITY',
    badge: 'STRATEGIC DIGITAL AUDIT',
    headline: 'Scale your business online before year end: Book a strategic audit.',
    highlight: 'Book a strategic audit.',
    bullets: [
      'We audit your current website speed, SEO, and lead leaks',
      'Identify exactly why visitors are leaving without paying',
      'Receive a custom, step-by-step digital transformation roadmap'
    ],
    cta: 'Book Your Free Strategic Consultation on WhatsApp Today',
    tagline: 'PREMIER DIGITAL GROWTH PARTNER'
  },
  {
    fileName: 'flyer-nov20-saas-portfolio.svg',
    style: 'TECH_ARCHITECT',
    badge: 'GET HIRED FAST',
    headline: 'Stop building to-do apps. Build one polished fullstack SaaS dashboard.',
    highlight: 'polished fullstack SaaS',
    bullets: [
      'Include real user authentication with JWT or OAuth',
      'Implement dark and light modes with responsive layouts',
      'Integrate interactive data visualization and live API charts'
    ],
    codeSnippet: `// Employers want proof you can build commercial products.\n// Ship 1 production-grade SaaS and stand out from 99% of devs.`,
    cta: 'Tech Career & Portfolio Advice • @AbiodunBuilds'
  }
];

function generateSVG(f) {
  const isDark = f.style === 'DARK_MATRIX';
  const isTech = f.style === 'TECH_ARCHITECT';

  const bgColor1 = isDark ? '#060B1C' : isTech ? '#05070F' : '#FFFFFF';
  const bgColor2 = isDark ? '#0B173B' : isTech ? '#0A0F24' : '#F8FAFC';
  const textColor = isDark || isTech ? '#FFFFFF' : '#0B132B';
  const accentColor = isTech ? '#38BDF8' : '#F5691C'; // Sky Blue for Tech, Orange for Business
  const cardBg = isDark ? '#0A1330' : isTech ? '#0D142E' : '#F1F5F9';
  const cardBorder = isDark ? '#1E293B' : isTech ? '#1E2B58' : '#E2E8F0';

  // Highlight word replacement in headline
  const parts = f.headline.split(f.highlight);
  const before = parts[0] || '';
  const after = parts[1] || '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgColor1}" />
      <stop offset="100%" stop-color="${bgColor2}" />
    </linearGradient>

    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accentColor}" />
      <stop offset="100%" stop-color="${isTech ? '#818CF8' : '#FB923C'}" />
    </linearGradient>

    <linearGradient id="btnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>

    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1080" fill="url(#bgGrad)" />

  <!-- Geometric Grid Pattern Overlay -->
  <g opacity="${isDark || isTech ? '0.07' : '0.04'}">
    ${Array.from({ length: 12 })
      .map((_, i) => `<line x1="${i * 90}" y1="0" x2="${i * 90}" y2="1080" stroke="#FFFFFF" stroke-width="1.5" />`)
      .join('')}
    ${Array.from({ length: 12 })
      .map((_, i) => `<line x1="0" y1="${i * 90}" x2="1080" y2="${i * 90}" stroke="#FFFFFF" stroke-width="1.5" />`)
      .join('')}
  </g>

  <!-- Ambient Glowing Blobs -->
  <circle cx="950" cy="180" r="260" fill="${accentColor}" opacity="${isDark || isTech ? '0.12' : '0.08'}" />
  <circle cx="120" cy="880" r="220" fill="#10B981" opacity="0.1" />

  ${
    f.style === 'LIGHT_AUTHORITY'
      ? `<path d="M 0 0 L 260 0 Q 130 130 0 260 Z" fill="url(#accentGrad)" opacity="0.9" />`
      : ''
  }

  <!-- ================= TOP HEADER BAR ================= -->
  <g transform="translate(60, 50)">
    <!-- Logo Badge -->
    <rect x="0" y="0" width="60" height="60" rx="16" fill="url(#accentGrad)" />
    <text x="30" y="42" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="32" font-weight="900" fill="#FFFFFF" text-anchor="middle">V</text>

    <!-- Brand Typography -->
    <text x="75" y="32" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="24" font-weight="900" fill="${textColor}" letter-spacing="-0.5">VELTRIX HUB</text>
    <text x="75" y="52" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="${accentColor}" letter-spacing="2">${
      f.tagline || (isTech ? 'LEAD SOFTWARE ENGINEER • @AbiodunBuilds' : 'DIGITAL GROWTH & AI SYSTEMS')
    }</text>

    <!-- Topic Badge (Top Right) -->
    <g transform="translate(960, 15)">
      <rect x="-380" y="0" width="380" height="38" rx="19" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.5" />
      <text x="-190" y="24" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="${accentColor}" letter-spacing="1" text-anchor="middle">${
        f.badge
      }</text>
    </g>
  </g>

  <!-- ================= HEADLINE HOOK (DYNAMIC PER POST) ================= -->
  <g transform="translate(60, 160)">
    <!-- Category label -->
    <text x="0" y="0" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="${accentColor}" letter-spacing="2.5">
      ${isTech ? '⚡ ARCHITECTURE & STRATEGY HOOK' : '🎯 CLIENT CONVERSION HOOK'}
    </text>

    <!-- Dynamic Headline ForeignObject for Wrap -->
    <foreignObject x="0" y="15" width="960" height="230">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; font-size: 46px; font-weight: 900; line-height: 1.18; color: ${textColor}; letter-spacing: -1.2px;">
        ${before}<span style="color: ${accentColor}; text-decoration: underline; text-decoration-color: ${accentColor}80;">${
          f.highlight
        }</span>${after}
      </div>
    </foreignObject>
  </g>

  <!-- ================= CONTENT FOCUS CARD ================= -->
  <g transform="translate(60, 410)">
    <rect x="0" y="0" width="960" height="${f.codeSnippet ? '440' : '390'}" rx="28" fill="${cardBg}" stroke="${cardBorder}" stroke-width="2" filter="url(#cardShadow)" />

    ${
      f.codeSnippet
        ? `
      <!-- Code Snippet Box for Tech Posts -->
      <g transform="translate(40, 35)">
        <rect x="0" y="0" width="880" height="150" rx="16" fill="#030612" stroke="#1E2B58" stroke-width="1.5" />
        <circle cx="25" cy="22" r="5" fill="#EF4444" />
        <circle cx="42" cy="22" r="5" fill="#F59E0B" />
        <circle cx="59" cy="22" r="5" fill="#10B981" />
        <text x="80" y="26" font-family="monospace" font-size="11" fill="#64748B">solution.tsx</text>

        <foreignObject x="25" y="45" width="830" height="95">
          <pre xmlns="http://www.w3.org/1999/xhtml" style="margin: 0; font-family: monospace; font-size: 15px; line-height: 1.45; color: #38BDF8; white-space: pre-wrap;">${
            f.codeSnippet
          }</pre>
        </foreignObject>
      </g>
    `
        : ''
    }

    <!-- Bullets Container -->
    <g transform="translate(45, ${f.codeSnippet ? '215' : '45'})">
      ${f.bullets
        .map(
          (b, idx) => `
        <g transform="translate(0, ${idx * 65})">
          <circle cx="20" cy="20" r="16" fill="${accentColor}25" stroke="${accentColor}" stroke-width="2" />
          <text x="20" y="26" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="${accentColor}" text-anchor="middle">✓</text>
          <foreignObject x="55" y="3" width="800" height="60">
            <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: system-ui, sans-serif; font-size: 21px; font-weight: 700; color: ${textColor}; line-height: 1.35;">
              ${b}
            </div>
          </foreignObject>
        </g>
      `
        )
        .join('')}
    </g>
  </g>

  <!-- ================= BOTTOM CONTACT / CALL TO ACTION RIBBON ================= -->
  <g transform="translate(60, 890)">
    <!-- Main CTA Bar -->
    <rect x="0" y="0" width="960" height="130" rx="24" fill="${isDark || isTech ? '#040816' : '#0B132B'}" stroke="${cardBorder}" stroke-width="2" />

    <!-- WhatsApp CTA Button -->
    <g transform="translate(30, 28)">
      <rect x="0" y="0" width="460" height="74" rx="20" fill="url(#btnGrad)" filter="url(#cardShadow)" />
      <text x="230" y="44" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="18" font-weight="800" fill="#FFFFFF" text-anchor="middle">
        💬 Direct WhatsApp: +234 808 709 8270
      </text>
    </g>

    <!-- Web & Social Badges -->
    <g transform="translate(520, 42)">
      <text x="0" y="16" font-family="system-ui, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF">🌐 www.veltrixhub.ng</text>
      <text x="0" y="42" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#94A3B8">
        ${isTech ? '𝕏: @AbiodunBuilds • Lagos, Nigeria' : 'Official CAC Registered • Pan-African Growth'}
      </text>
    </g>
  </g>
</svg>`;
}

for (const flyer of FLYERS) {
  const filePath = path.join(OUT_DIR, flyer.fileName);
  const svgContent = generateSVG(flyer);
  fs.writeFileSync(filePath, svgContent, 'utf-8');
  console.log(`✅ Generated Flyer: ${flyer.fileName} [${flyer.badge}]`);
}

console.log(`\n🎉 Successfully generated ${FLYERS.length} unique, topic-matched flyers in ${OUT_DIR}`);
