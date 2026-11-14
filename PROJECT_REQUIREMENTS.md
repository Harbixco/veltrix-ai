# PROJECT REQUIREMENTS SPECIFICATION
## Veltrix AI Growth Hub

**Project Name:** Veltrix AI Growth Hub  
**Organization:** Veltrix Hub  
**Document Version:** 1.0.0  
**Status:** Approved for Implementation (Phase 1)  
**Database Engine:** MongoDB Atlas (via Prisma ORM)  
**Target Environment:** Node.js v22+ / React 18+ / TypeScript  

---

## 1. Executive Summary & Brand Identity

### 1.1 Brand Overview
* **Brand Name:** Veltrix Hub
* **Core Philosophy:** *"We don't just build websites. We build trust."*
* **Mission:** To empower businesses to achieve prominent online visibility, establish authoritative trust, attract high-intent leads, and scale sustainably through end-to-end digital growth systems.
* **Vision:** To become Africa's premier digital growth powerhouse, guiding thousands of businesses from informal online marketing into robust, revenue-generating digital infrastructure.
* **Brand Voice & Personality:** Professional, empathetic, highly practical, authoritative yet approachable, transparent, results-driven, and strictly anti-jargon.

### 1.2 The Problem Being Solved
Target businesses (SMBs, startups, professional practices) often rely on fragile, ephemeral channels like WhatsApp status updates and inconsistent social posting. They suffer from:
* Low online visibility and absence of search presence.
* Inability to translate social media "likes" into paying customer inquiries.
* Inconsistent visual branding and non-compelling copy.
* Disconnected tools (one for design, one for scheduling, one for copywriting, one for leads).

### 1.3 The 11 Core Veltrix Hub Services
The system must natively recognize, categorize, and build strategies for all 11 core offerings:
1. **Website Development:** High-performance, conversion-oriented corporate and portfolio websites.
2. **E-commerce Development:** Secure, scalable online storefronts with payment gateways.
3. **Mobile App Development:** Cross-platform iOS and Android mobile solutions.
4. **Search Engine Optimization (SEO):** Organic visibility, technical on-page optimization, and local ranking.
5. **AI Automation:** Custom AI-driven business workflows, lead routing, and operational efficiency tools.
6. **Graphic Design:** Branded marketing collateral, social flyers, brochures, and visual identities.
7. **Business Branding:** Full brand style guides, logo systems, color palettes, and typography.
8. **Website Maintenance:** Security updates, backups, bug fixes, uptime monitoring, and performance tuning.
9. **CAC Business Registration:** Official corporate regulatory registration and compliance documentation.
10. **Digital Consultation:** High-level strategic digital transformation roadmaps and audits.
11. **Website Training:** Practical client training for content management and web operations.

### 1.4 The 5 Core Content Pillars
Every post, campaign, and design generated must strictly belong to one of these pillars:
1. **Education:** Teaching businesses about technology, web design, SEO, and digital growth.
2. **Business Growth:** Insights into lead acquisition, customer retention, sales strategies, and credibility.
3. **Authority:** Showcasing case studies, live portfolios, metrics, and technical expertise.
4. **Inspiration:** Practical entrepreneurial lessons, client growth stories, and motivational business mindset.
5. **Promotion:** Direct, consultative service offerings and special packages (strictly capped to prevent spammy feeds).

---

## 2. Functional Requirements by Module (13 Modules)

### Module 1: Business Onboarding & AI Knowledge Base
* **REQ-1.1:** Organizations must maintain a structured, editable knowledge base (mission, vision, industry, competitor list, target audiences).
* **REQ-1.2:** Store pre-populated profiles for the 11 Veltrix Hub services, editable with custom pricing, benefits, and target buyer personas.
* **REQ-1.3:** Brand Identity repository storing logos, typography choices, primary/secondary/accent hex codes, and brand imagery.
* **REQ-1.4:** AI Context Engine: Automatically inject relevant business knowledge slices into prompt contexts without exceeding context windows.

### Module 2: Facebook Multi-Account Integration
* **REQ-2.1:** Official Meta OAuth 2.0 flow supporting up to 3 authorized Facebook identities/pages.
* **REQ-2.2:** Explicit differentiation between Facebook Pages (supported for insights and auto-publishing) and Personal Profiles (assisted manual workflow).
* **REQ-2.3:** Background synchronization worker polling historical posts, comments count, reach, impressions, reactions, and shares.
* **REQ-2.4:** Secure, encrypted token storage with automatic expiration detection and re-authentication alerts.
* **REQ-2.5:** Comparative multi-account performance dashboard with filtering by account, date range, and content pillar.

### Module 3: AI Social Media Analytics Engine
* **REQ-3.1:** Quantitative performance metrics calculation (engagement rate, click-through rate, reach per post).
* **REQ-3.2:** AI Qualitative diagnosis: Categorize posts into "High Performer", "Average", and "Underperformer", evaluating headline strength, CTA clarity, visual presentation, and topic resonance.
* **REQ-3.3:** Clear distinction between verified empirical data and AI hypothesis.
* **REQ-3.4:** Automated generation of weekly and monthly executive performance reports.

### Module 4: AI Content Strategist
* **REQ-4.1:** Generation of multi-format content: Single image posts, carousel slide decks, Reels scripts, and long-form authority articles.
* **REQ-4.2:** Every generated piece must return: Topic, Headline, Content Pillar, Target Audience, Problem Addressed, Full Caption with emojis/hashtags, Suggested Call to Action, and Visual Concept.
* **REQ-4.3:** Content gap detection: Analyze historical posts to identify underserved services or missing pillars.

### Module 5: AI Graphic Design Studio
* **REQ-5.1:** Design Upload & Computer Vision Inspection: Extract layout structure, typography hierarchy, and color palettes from user-uploaded graphics.
* **REQ-5.2:** Layout Recipe Engine: Structured HTML/SVG templating for high-converting social formats (Quote cards, Announcement banners, Carousel slides) allowing inline text/color editing.
* **REQ-5.3:** Generative AI Image generation for background visuals, product mockups, and illustrations.
* **REQ-5.4:** Multi-format asset export: 1:1 (Square), 4:5 (Portrait), 9:16 (Stories/Reels), and 16:9 (Landscape).

### Module 6: AI Client Acquisition Engine
* **REQ-6.1:** Dedicated Lead CRM pipeline with stages: `NEW`, `CONTACTED`, `INTERESTED`, `QUALIFIED`, `PROPOSAL_SENT`, `NEGOTIATION`, `WON`, `LOST`.
* **REQ-6.2:** Attribution tracking: Link each lead to its originating post, campaign, or specific service.
* **REQ-6.3:** WhatsApp Attribution Engine: Generate pre-filled `wa.me` links with campaign-specific reference codes (`[Ref: POST-SEO-104]`).
* **REQ-6.4:** AI Opportunity Finder: Proactively scan CRM conversion data and social metrics to recommend high-ROI marketing actions.

### Module 7: AI Search Engine Optimization (SEO) Intelligence
* **REQ-7.1:** Website property connection with Google Search Console (GSC) API integration.
* **REQ-7.2:** On-page technical and content audit (meta titles, headings hierarchy, keyword density, broken links).
* **REQ-7.3:** Keyword intent intelligence: Group keywords by Informational, Commercial, and Transactional intent.
* **REQ-7.4:** AI SEO Content Assistant: Generate search-optimized article outlines and meta descriptions without keyword stuffing.

### Module 8: AI Automation Intelligence
* **REQ-8.1:** Business Process Assessment questionnaire identifying manual bottlenecks (lead intake, manual email replies, manual invoicing).
* **REQ-8.2:** Automation Workflow Builder: Visual definition of Triggers, Conditions, and Actions.
* **REQ-8.3:** Outbound Webhook Dispatcher: Connect with platforms like Zapier, Make, and WhatsApp Cloud API.
* **REQ-8.4:** Human-in-the-loop approval gating for sensitive outgoing communications.

### Module 9: AI Competitor & Market Intelligence
* **REQ-9.1:** Competitor registry storing public competitor URLs and social profiles.
* **REQ-9.2:** Differentiation Engine: Analyze competitor service offerings and messaging to identify unique value propositions for Veltrix Hub.
* **REQ-9.3:** Strict ethical boundary: Operate exclusively on public footprint data; never fabricate or claim access to private analytics.

### Module 10: AI Marketing Assistant
* **REQ-10.1:** Chat assistant embedded across the entire application with unified system context.
* **REQ-10.2:** Ability to query live database metrics (e.g., "What was our best-performing post on Web Development last month?").
* **REQ-10.3:** Role-tailored conversational responses grounded in Veltrix Hub's brand voice.

### Module 11: Content Calendar & Publishing
* **REQ-11.1:** Interactive calendar supporting Month, Week, and Day views.
* **REQ-11.2:** Publishing state machine: `DRAFT` $\rightarrow$ `IN_REVIEW` $\rightarrow$ `APPROVED` $\rightarrow$ `SCHEDULED` $\rightarrow$ `PUBLISHED` / `FAILED`.
* **REQ-11.3:** Dual publishing path: Automated Meta Graph API publishing for authorized Pages; manual copy-to-clipboard assisted workflow for unsupported channels.

### Module 12: AI Campaign Planner
* **REQ-12.1:** Campaign creation around specific business goals (e.g., "Q1 CAC Registration Awareness").
* **REQ-12.2:** Coordinated asset bundle creation: Multi-post scheduling, ad copy variations, and lead capture links tied to a unified campaign ID.

### Module 13: Executive Performance Dashboard & PDF Reports
* **REQ-13.1:** High-level executive dashboard showing total reach, engagement rates, lead acquisition velocity, and closed deal values.
* **REQ-13.2:** Filter by date range, organization, service, and campaign.
* **REQ-13.3:** One-click automated PDF generation for stakeholder and client reporting.

---

## 3. Non-Functional Requirements

### 3.1 Security & Data Privacy
* **NFR-1.1:** AES-256-GCM encryption for all OAuth access tokens, refresh tokens, and API secrets stored in MongoDB.
* **NFR-1.2:** Strict multi-tenant data isolation: Every MongoDB document must be indexed and filtered by `organizationId`.
* **NFR-1.3:** Role-Based Access Control (RBAC): `OWNER`, `ADMIN`, `MARKETER`, `VIEWER`.
* **NFR-1.4:** Passwords hashed with bcrypt (salt rounds $\ge 12$).

### 3.2 Reliability & Fault Tolerance
* **NFR-2.1:** Background synchronization workers must implement exponential backoff retry algorithms when encountering Meta or third-party rate limits (HTTP 429).
* **NFR-2.2:** Graceful degradation: The failure of an external API (Meta or GSC) must never crash or block the core platform.

### 3.3 Scalability & Performance
* **NFR-3.1:** API response times $\le 250$ms for standard queries (p95).
* **NFR-3.2:** Database indexes on all foreign references, compound queries (`organizationId + createdAt`), and status flags.
* **NFR-3.3:** Streaming responses for generative AI chat endpoints to minimize time-to-first-token.
