# DEVELOPMENT ROADMAP & EXECUTION STRATEGY
## Veltrix AI Growth Hub

**Methodology:** Incremental Staged Delivery with Horizon Gating  
**Document Version:** 1.0.0  
**Status:** Approved for Implementation (Phase 1)  

---

## 1. The 3-Horizon Delivery Framework

To eliminate the risk of building 13 disconnected modules simultaneously, execution is organized into three sequential horizons:

```
HORIZON 1: CORE REVENUE & ANALYTICS LOOP (Weeks 1 - 4)
├── Phase 1: Research, Architecture & Project Planning [CURRENT]
├── Phase 2: Application Foundation (Auth, Monorepo, DB Setup)
├── Phase 3: Business Knowledge Base (Brand & 11 Services)
├── Phase 4: Facebook Page Integration (OAuth & Ingestion)
└── Phase 5: Analytics Engine & Lead Attribution CRM

HORIZON 2: CREATIVE PRODUCTION & SCHEDULING (Weeks 5 - 8)
├── Phase 6: AI Content Strategist & Design Recipe Studio
├── Phase 7: Client Acquisition & WhatsApp Attribution Engine
└── Phase 9: Interactive Content Calendar & Publishing

HORIZON 3: EXPANSION & COMMERCIAL SCALE (Weeks 9 - 12)
├── Phase 8: SEO Intelligence & Automation Webhooks
└── Phase 10: Enterprise Hardening, Testing & Deployment
```

---

## 2. Detailed Phase-by-Phase Roadmap

### PHASE 1: RESEARCH, ARCHITECTURE & PLANNING (IN PROGRESS)
* **Objective:** Establish the comprehensive blueprint, database schema, and project tracking structure.
* **Key Deliverables:**
  * [x] `PROJECT_REQUIREMENTS.md`
  * [x] `SYSTEM_ARCHITECTURE.md`
  * [x] `DATABASE_SCHEMA.md` (MongoDB + Prisma)
  * [x] `API_DOCUMENTATION.md`
  * [x] `DEVELOPMENT_ROADMAP.md`
  * [x] `INTEGRATION_REQUIREMENTS.md`
  * [x] `PROGRESS_TRACKER.md`
* **Exit Gate:** All architecture documents written, reviewed, and approved.

---

### PHASE 2: APPLICATION FOUNDATION
* **Objective:** Scaffold the monorepo workspace, configure MongoDB Atlas connectivity, seed the database, and establish authentication.
* **Key Deliverables:**
  * Monorepo setup (`apps/web`, `apps/api`, `packages/database`, `packages/shared`, `packages/types`).
  * Prisma schema initialization connected to MongoDB Atlas.
  * Express API server with CORS, Helmet, JSON body parsing, and error-handling middleware.
  * React frontend with Vite, Tailwind CSS, Lucide icons, and modern dashboard layout skeleton.
  * User Registration, Login, JWT session management, and `TenantGuard` middleware.
* **Verification Gate:** User can register, log in, view the dashboard layout, and verify database connectivity.

---

### PHASE 3: BUSINESS KNOWLEDGE BASE
* **Objective:** Build the onboarding wizard and permanent business knowledge repository.
* **Key Deliverables:**
  * Seed script populating the 11 Veltrix Hub services with descriptions, target audiences, and default CTAs.
  * Business profile UI: edit mission, vision, tagline, and location.
  * Brand guidelines UI: manage color palette (hex codes), typography, and logo uploads.
  * Target audience persona builder.
  * AI Knowledge Context Serializer: converts business data into token-efficient context slices.
* **Verification Gate:** Veltrix Hub brand data fully saved and retrievable via API and frontend UI.

---

### PHASE 4: FACEBOOK INTEGRATION
* **Objective:** Implement official Meta OAuth 2.0 flow, token encryption, and background sync.
* **Key Deliverables:**
  * Meta OAuth login button redirecting to Facebook permissions dialog.
  * OAuth callback exchanging temporary code for 60-day long-lived access token.
  * Page discovery endpoint showing all eligible managed Facebook Pages.
  * Connect up to 3 authorized identities/pages.
  * Background worker job retrieving recent posts, engagement counts, and media URLs.
  * Manual assisted publishing / fallback mode for unsupported accounts.
* **Verification Gate:** Successful connection of an authorized test page and ingestion of historical posts into MongoDB.

---

### PHASE 5: ANALYTICS ENGINE
* **Objective:** Transform raw post counts into qualitative marketing intelligence.
* **Key Deliverables:**
  * Aggregate metric cards: Reach, Impressions, Total Reactions, Engagement Rate.
  * Ranked posts table with sorting by performance and content pillar filters.
  * AI Post Diagnosis modal: evaluates headline strength, visual clarity, and CTA effectiveness.
  * Comparative analytics view comparing performance across connected accounts.
* **Verification Gate:** Real historical posts rendered with accurate metrics and AI-generated qualitative diagnoses.

---

### PHASE 6: CONTENT & DESIGN INTELLIGENCE
* **Objective:** Accelerate marketing asset production with AI copy and structured design recipes.
* **Key Deliverables:**
  * AI Content Strategist: Generate structured post drafts mapped to content pillars and services.
  * Structured Design Recipe Engine: SVG/HTML templates for quotes, announcements, and carousels.
  * Design visual customizer: inline text, colors, and logo placement with PNG rendering.
  * Integration with AI image generation adapter for background and hero imagery.
* **Verification Gate:** User can generate an educational post with branded visual collateral in under 60 seconds.

---

### PHASE 7: CLIENT ACQUISITION & CRM
* **Objective:** Close the loop between social visibility and paying clients.
* **Key Deliverables:**
  * Kanban Lead Pipeline: `NEW`, `CONTACTED`, `INTERESTED`, `QUALIFIED`, `PROPOSAL_SENT`, `WON`, `LOST`.
  * WhatsApp Attribution Link Generator: creates tracked `wa.me` links with post reference tokens.
  * Lead activity logs: record calls, client notes, and deal estimates.
  * AI Opportunity Finder: automated recommendations based on lead sources and service performance.
* **Verification Gate:** Leads can be created, moved through pipeline stages, and attributed to specific campaigns.

---

### PHASE 8: SEO & AUTOMATION INTELLIGENCE
* **Objective:** Expand digital growth capabilities into organic search and workflow automation.
* **Key Deliverables:**
  * Google Search Console OAuth and query analytics dashboard.
  * On-page SEO auditor checking meta tags, headings, and keyword intent.
  * AI SEO Content Assistant: generates blog outlines and meta descriptions.
  * Automation workflow builder: trigger-condition-action definitions.
  * Outbound webhook dispatcher with execution logging.
* **Verification Gate:** Successful audit of a target URL and dispatch of an outbound webhook on lead creation.

---

### PHASE 9: CONTENT CALENDAR & PUBLISHING
* **Objective:** Unified scheduling and distribution dashboard.
* **Key Deliverables:**
  * Multi-view calendar (Monthly, Weekly, Daily views).
  * Post scheduling modal with media preview.
  * Automated background publisher for scheduled posts to Meta Pages.
  * Assisted copy-to-clipboard publishing flow for personal profiles and other platforms.
* **Verification Gate:** Post can be scheduled on the calendar and successfully published at the target time.

---

### PHASE 10: TESTING, HARDENING & DEPLOYMENT
* **Objective:** Prepare the platform for commercial reliability and scale.
* **Key Deliverables:**
  * End-to-end automated testing for auth, tenancy isolation, and critical workflows.
  * Security audit: verify AES token encryption, rate limiting, and CORS restrictions.
  * Mobile responsiveness review across all 13 modules.
  * Docker containerization and production deployment configuration.
* **Verification Gate:** Zero high-severity vulnerabilities, 100% green test suite, and live deployment.
