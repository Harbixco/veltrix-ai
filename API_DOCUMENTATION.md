# API DOCUMENTATION SPECIFICATION
## Veltrix AI Growth Hub

**API Protocol:** RESTful over HTTPS with Server-Sent Events (SSE) for AI Streaming  
**Base URL:** `/api/v1`  
**Authentication:** Bearer JWT in `Authorization` header  
**Standard Envelopes:** Strict `{ success: boolean, data?: any, error?: ErrorObject }`  
**Document Version:** 1.0.0  

---

## 1. Core Principles & Standard Envelope

### 1.1 Response Envelope Structure

#### Success Response (2xx)
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 142
  }
}
```

#### Error Response (4xx / 5xx)
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED_ORGANIZATION_ACCESS",
    "message": "User does not belong to the requested organization.",
    "details": null
  }
}
```

---

## 2. API Endpoints Specification

### 2.1 Authentication & Tenancy (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register new user & bootstrap organization | No |
| `POST` | `/api/v1/auth/login` | Email/password login $\rightarrow$ returns JWT & Org list | No |
| `POST` | `/api/v1/auth/refresh` | Refresh expired access token | Yes |
| `GET` | `/api/v1/auth/me` | Fetch active user profile and permissions | Yes |
| `POST` | `/api/v1/auth/switch-org` | Switch active organization context | Yes |

---

### 2.2 Business Knowledge & Services (`/api/v1/business`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/business/profile` | Retrieve business profile and tagline | Yes |
| `PUT` | `/api/v1/business/profile` | Update mission, vision, description, industry | Yes |
| `GET` | `/api/v1/business/brand` | Retrieve brand colors, fonts, logo URLs | Yes |
| `PUT` | `/api/v1/business/brand` | Update brand guidelines & style rules | Yes |
| `GET` | `/api/v1/business/services` | List all services (prepopulated with 11 Veltrix services) | Yes |
| `POST` | `/api/v1/business/services` | Create new custom service | Yes |
| `PUT` | `/api/v1/business/services/:id` | Update service pricing, benefits, CTAs | Yes |
| `GET` | `/api/v1/business/audiences` | List defined buyer personas & challenges | Yes |
| `POST` | `/api/v1/business/audiences` | Add buyer persona profile | Yes |

---

### 2.3 Meta & Facebook Integration (`/api/v1/meta`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/meta/connect` | Returns Meta OAuth authorization URL | Yes |
| `GET` | `/api/v1/meta/callback` | OAuth redirect handler: exchange code for long-lived token | Yes |
| `GET` | `/api/v1/meta/pages` | List discovered Facebook Pages managed by user | Yes |
| `POST` | `/api/v1/meta/pages/connect` | Connect specific Page with permissions | Yes |
| `POST` | `/api/v1/meta/sync/:pageId` | Trigger background synchronization of posts & metrics | Yes |
| `DELETE`| `/api/v1/meta/pages/:pageId` | Disconnect Facebook Page and revoke token | Yes |

---

### 2.4 Social Analytics & Intelligence (`/api/v1/analytics`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/analytics/overview` | Aggregated reach, reactions, engagement trends | Yes |
| `GET` | `/api/v1/analytics/posts` | Ranked list of posts with engagement & pillar filters | Yes |
| `GET` | `/api/v1/analytics/posts/:id/diagnosis` | AI qualitative critique (Headline, CTA, Visual) | Yes |
| `GET` | `/api/v1/analytics/compare` | Cross-account comparative performance matrix | Yes |
| `POST` | `/api/v1/analytics/reports/generate`| Generate weekly/monthly executive PDF report | Yes |

---

### 2.5 AI Content Strategist (`/api/v1/content`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/content/generate-ideas` | Generate content ideas based on service & pillar | Yes |
| `POST` | `/api/v1/content/generate-copy` | Generate full caption, hook, CTA & visual brief | Yes |
| `GET` | `/api/v1/content/drafts` | List saved drafts with status filter | Yes |
| `POST` | `/api/v1/content/drafts` | Save draft to library | Yes |
| `PUT` | `/api/v1/content/drafts/:id` | Update draft content or approval status | Yes |
| `POST` | `/api/v1/content/drafts/:id/schedule`| Push draft to content calendar | Yes |

---

### 2.6 AI Graphic Design Studio (`/api/v1/designs`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/designs/inspect` | Computer vision analysis of uploaded flyer | Yes |
| `GET` | `/api/v1/designs/templates` | List structured responsive design recipes | Yes |
| `POST` | `/api/v1/designs/render` | Render recipe (SVG/HTML $\rightarrow$ PNG) with brand tokens | Yes |
| `POST` | `/api/v1/designs/ai-image` | Generate AI image background or hero visual | Yes |
| `GET` | `/api/v1/designs/library` | List organization design assets | Yes |

---

### 2.7 Client Acquisition & Lead CRM (`/api/v1/leads`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/leads` | List leads with stage, service & attribution filters | Yes |
| `POST` | `/api/v1/leads` | Create lead manually or via webhook | Yes |
| `PUT` | `/api/v1/leads/:id/stage` | Update pipeline stage (`NEW` $\rightarrow$ `WON`) | Yes |
| `POST` | `/api/v1/leads/:id/activities` | Append activity note or call log | Yes |
| `POST` | `/api/v1/leads/whatsapp-link` | Generate attribution-tagged `wa.me` link | Yes |
| `GET` | `/api/v1/leads/opportunities` | AI Opportunity Finder actionable recommendations | Yes |

---

### 2.8 SEO Intelligence (`/api/v1/seo`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/seo/connect-gsc` | Connect Google Search Console property | Yes |
| `GET` | `/api/v1/seo/queries` | Retrieve top organic search queries & average ranks | Yes |
| `POST` | `/api/v1/seo/audit` | Run on-page technical and content audit for a URL | Yes |
| `POST` | `/api/v1/seo/content-outline` | Generate SEO article outline & heading structure | Yes |

---

### 2.9 Automation Workflows (`/api/v1/automation`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/automation/workflows` | List configured automated workflows | Yes |
| `POST` | `/api/v1/automation/workflows` | Create trigger-condition-action workflow | Yes |
| `POST` | `/api/v1/automation/webhook/inbound`| Inbound webhook receiver (leads/forms) | API Key |
| `POST` | `/api/v1/automation/test-trigger` | Simulate workflow trigger execution | Yes |

---

### 2.10 AI Conversational Assistant (`/api/v1/ai`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/ai/chat` | Send message to AI assistant (supports SSE streaming) | Yes |
| `GET` | `/api/v1/ai/conversations` | List user conversation sessions | Yes |
| `GET` | `/api/v1/ai/conversations/:id` | Fetch conversation history | Yes |
| `DELETE`| `/api/v1/ai/conversations/:id` | Delete conversation history | Yes |

---

### 2.11 Content Calendar & Publishing (`/api/v1/calendar`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/calendar/posts` | Fetch scheduled and published posts for date range | Yes |
| `POST` | `/api/v1/calendar/schedule` | Schedule post for future publication | Yes |
| `DELETE`| `/api/v1/calendar/posts/:id` | Cancel scheduled post | Yes |
| `POST` | `/api/v1/calendar/publish-now/:id` | Immediately publish approved post to Meta Page | Yes |
