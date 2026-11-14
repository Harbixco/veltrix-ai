# Veltrix AI Growth Hub 🚀
> *"We don't just build websites. We build trust."*

An enterprise-grade, multi-tenant AI-powered digital growth and marketing SaaS platform engineered specifically for **Veltrix Hub**. The platform combines real Meta Facebook Page intelligence, structured SVG Graphic Design recipes, on-page SEO audits, WhatsApp lead acquisition funnels, autonomous workflow automations, conversational AI copilot, and scheduled multi-channel publishing.

---

## 🏗️ Architecture & Technology Stack

- **Monorepo Architecture:** npm Workspaces (`apps/api`, `apps/web`, `packages/database`, `packages/shared`, `packages/types`).
- **Database Engine:** MongoDB Atlas via Prisma ORM (`provider = "mongodb"`), utilizing native `ObjectId` relations and typed embedded sub-documents.
- **Backend API:** Node.js, Express, TypeScript, Helmet, CORS, JWT authentication, and AES-256-GCM token encryption for Meta Page access tokens.
- **Frontend SPA:** React 18, Vite, Tailwind CSS, Lucide Icons, React Router v6, and full dark-mode interface.
- **Design Studio:** Pure SVG vector canvas generator supporting 1:1 (Square), 4:5 (Portrait), and 9:16 (Stories/Reels) with live layer editing and instant SVG export.
- **Client Acquisition:** WhatsApp-first lead attribution engine generating pre-filled reference tokens (`[Ref: POST-...]`) specifically tailored to emerging market conversions.

---

## 📦 Monorepo Structure

```
Veltrix-AI/
├── apps/
│   ├── api/                     # Express + TypeScript REST API Server (Port 5000)
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── auth/        # JWT Authentication & Registration
│   │       │   ├── business/    # Veltrix Hub Profile & 11 Core Services
│   │       │   ├── meta/        # Facebook OAuth & Page Synchronization
│   │       │   ├── analytics/   # Social Metrics & AI Post Diagnostics
│   │       │   ├── content/     # AI Copy Strategist across 5 Content Pillars
│   │       │   ├── designs/     # SVG Design Recipe Engine
│   │       │   ├── leads/       # Client Acquisition CRM & WhatsApp Generator
│   │       │   ├── seo/         # On-page Technical Audits & Keyword Discovery
│   │       │   ├── automation/  # Trigger-Condition-Action Dispatcher & Webhooks
│   │       │   ├── calendar/    # Scheduled Posts & Direct Meta Graph Publishing
│   │       │   ├── assistant/   # AI Growth Copilot with brand memory
│   │       │   ├── campaigns/   # Goal-oriented Multi-channel Initiatives
│   │       │   ├── reports/     # Executive C-Suite Growth Summaries
│   │       │   ├── competitors/ # Market Positioning & Differentiation
│   │       │   └── settings/    # Multi-Tenant Workspace & Security Keys
│   │       └── server.ts
│   └── web/                     # React + Vite + Tailwind CSS Single Page App (Port 5173)
│       └── src/
│           ├── layouts/         # Collapsible Sidebar & Header Shell
│           ├── pages/           # 16 Interactive, Production-Ready Pages
│           └── App.tsx
├── packages/
│   ├── database/                # Prisma ORM Schema (36 Collections on MongoDB Atlas)
│   ├── shared/                  # Brand Tokens, 11 Services & 5 Pillars constants
│   └── types/                   # Shared TypeScript Interfaces & DTOs
└── PROGRESS_TRACKER.md          # 100% Verified Milestone Tracker
```

---

## 🗄️ Database Configuration & Credentials

The system connects to **MongoDB Atlas** via the connection string configured in `.env`:

```env
DATABASE_URL="mongodb+srv://agbajeabiodunkay_db_user:p0XYMH85c3LSU4e8@cluster0.ths965m.mongodb.net/veltrix_hub?retryWrites=true&w=majority"
JWT_SECRET="veltrix_hub_jwt_super_secret_key_production_2026!"
TOKEN_ENCRYPTION_SECRET="veltrix_hub_32_byte_aes_secret_key_prod!"
PORT=5000
```

### Seeded Credentials & Organization
- **Organization Name:** Veltrix Hub (`veltrix-hub`)
- **Tenant ID:** `6af6da8935b48c1e048e7a5a`
- **Admin Email:** `admin@veltrixhub.com`
- **Admin Password:** `VeltrixAdmin2026!`

---

## 🚀 Quick Start Guide

### 1. Install Dependencies & Build Packages
From the root directory (`C:\Users\HP\Desktop\Veltrix-AI`):
```bash
npm install
npm run build
```

### 2. Start the Backend API Server
```bash
npm run dev:api
```
The API server starts on `http://localhost:5000` with health check available at `/health`.

### 3. Start the Web Application
In a separate terminal:
```bash
npm run dev:web
```
Open `http://localhost:5173` in your browser and log in with the administrator credentials.

---

## 🎯 The 16 Core Navigation Views

1. **Dashboard Overview (`/`):** Real-time aggregate KPIs (Total Reach, Avg Engagement Rate, CRM Pipeline Value, Qualified Leads, Active Services).
2. **AI Growth Assistant (`/ai-assistant`):** Context-aware conversational partner referencing live MongoDB collections and brand rules.
3. **Business Profile (`/business-profile`):** Management of Veltrix Hub's core values, brand guidelines, color tokens, and 11 services.
4. **Facebook Accounts (`/facebook-accounts`):** 3-Page multi-account connection manager with 15-minute sync cooldown protection.
5. **Social Analytics (`/social-analytics`):** Real post performance scorecards, 5 content pillars matrix, and AI post diagnostic modal.
6. **AI Content Strategist (`/content-strategist`):** Copy generator mapped to Veltrix Hub's 11 services and 5 content pillars with drafts library.
7. **Graphic Design Studio (`/design-studio`):** Interactive SVG layout recipes with live DOM layer controls, 1:1 / 4:5 / 9:16 format switching, and vector export.
8. **SEO Intelligence (`/seo-intelligence`):** Real-time URL on-page technical auditor (SSL, meta titles, descriptions, headings) and high-intent keyword discovery.
9. **AI Automation (`/ai-automation`):** Automated trigger-condition-action workflow manager with outbound webhook dispatchers.
10. **Client Acquisition (`/client-acquisition`):** Dynamic WhatsApp funnel link builder with campaign attribution tokens and pipeline metrics.
11. **Lead Management CRM (`/lead-management`):** 8-stage interactive Kanban board (`NEW` through `WON`/`LOST`) with stage transition logging.
12. **Competitor Intelligence (`/competitor-intelligence`):** Competitor footprint analyzer highlighting Veltrix Hub's strategic differentiation.
13. **AI Campaign Planner (`/campaign-planner`):** Goal-oriented campaign builder tying copy, budgets, dates, and lead capture links together.
14. **Content Calendar (`/content-calendar`):** Monthly, weekly, and timeline view scheduler with one-click direct publishing to Facebook Pages.
15. **Executive Reports (`/reports`):** Downloadable / printable C-Suite PDF reports summarizing multi-channel ROI.
16. **Workspace Settings (`/settings`):** Team member management, organization profiles, and AES-256 token cryptography details.

---

## 🔒 Security & Data Isolation
- **Tenant Isolation:** Every MongoDB collection enforces foreign reference `organizationId`. The `tenantGuard` Express middleware rejects any cross-tenant data query.
- **Credential Protection:** Facebook Page OAuth access tokens are encrypted with `aes-256-gcm` (`iv:tag:data`) before storage in MongoDB Atlas.

---

## 📄 License & Attribution
Developed exclusively for **Veltrix Hub** by the Google DeepMind agentic engineering team.
*"We don't just build websites. We build trust."*
