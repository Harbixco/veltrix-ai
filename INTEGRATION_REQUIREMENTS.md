# INTEGRATION REQUIREMENTS & EXTERNAL CREDENTIALS
## Veltrix AI Growth Hub

**Document Version:** 1.0.0  
**Status:** Approved for Implementation (Phase 1)  

---

## 1. External Services & Credentials Matrix

| Service | Primary Purpose | Required Credentials / Config | Status |
| :--- | :--- | :--- | :--- |
| **MongoDB Atlas** | Primary Multi-Tenant Datastore | `DATABASE_URL` (Cluster URI, Username, Password) | **Configured** |
| **Meta Graph API** | Facebook Page OAuth, Insights & Publishing | `META_APP_ID`, `META_APP_SECRET`, `META_REDIRECT_URI` | Pending App Config |
| **Google Gemini API** | Primary LLM & Vision Provider | `GEMINI_API_KEY` | Pending Key |
| **OpenAI / Anthropic** | Secondary / Fallback LLM Provider | `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` | Optional / Fallback |
| **Google Search Console** | SEO Organic Rankings & Queries | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Pending Google App |
| **Cloud Object Storage** | Brand Assets, Logos & Designs | AWS S3 / Cloudinary / Supabase Storage credentials | Pending Selection |
| **WhatsApp Cloud API** | Direct WhatsApp Inquiries & Webhooks | `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` | Optional / Assisted |

---

## 2. Deep Dive: Meta Graph API Integration

### 2.1 Supported Account Types & Nuance
* **Facebook Pages (Full Automation Supported):** Eligible for automated OAuth, historical insights retrieval, post analytics, and programmatic publishing.
* **Personal Facebook Profiles (Assisted Workflow Only):** Meta strictly disallows automated publishing and detailed insight scraping from personal profiles. The system provides an "Assisted Publishing" flow (preview + copy caption + download image) for personal accounts.

### 2.2 Required Meta Permissions
When configuring the Meta App in the Meta for Developers console, request the following permissions:
1. `public_profile`: Basic user identity.
2. `pages_show_list`: Allows the app to discover which Facebook Pages the user manages.
3. `pages_read_engagement`: Allows the app to fetch posts, comments, reactions, and engagement metrics.
4. `read_insights`: Allows the app to read Page and post-level performance insights (impressions, reach).
5. `pages_manage_posts`: Allows the app to publish approved posts and schedule content directly to Pages.

### 2.3 Meta App Review & Development Mode
* In **Development Mode**, only admins, developers, and testers registered in your Meta App Dashboard can connect their accounts.
* For commercial SaaS release (Horizon 3), the app must submit screencasts and privacy policy documentation for **Meta App Review**.
* **Graceful Degradation:** During development, if live Meta credentials are not yet entered, the app gracefully presents the "Connect Facebook Page" configuration screen with clear instructions rather than crashing.

---

## 3. Database Connection Configuration

### 3.1 MongoDB Atlas Connection String
The provided production-ready connection URI is:
```env
DATABASE_URL="mongodb+srv://agbajeabiodunkay_db_user:p0XYMH85c3LSU4e8@cluster0.ths965m.mongodb.net/veltrix_hub?retryWrites=true&w=majority"
```

### 3.2 Network Access Requirements
* In MongoDB Atlas under **Security $\rightarrow$ Network Access**:
  * Ensure either your current public IP is whitelisted, or add `0.0.0.0/0` (Allow Access from Anywhere) for local development flexibility.

---

## 4. Master Environment Template (`.env.example`)

Below is the master `.env.example` that will reside in the project root:

```env
# =============================================================================
# ENVIRONMENT & CORE SERVER
# =============================================================================
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=super_secret_jwt_key_change_in_production_min_32_chars
JWT_EXPIRES_IN=7d
TOKEN_ENCRYPTION_SECRET=32_character_secret_for_aes_token_encryption!

# =============================================================================
# DATABASE (MONGODB ATLAS)
# =============================================================================
DATABASE_URL="mongodb+srv://agbajeabiodunkay_db_user:p0XYMH85c3LSU4e8@cluster0.ths965m.mongodb.net/veltrix_hub?retryWrites=true&w=majority"

# =============================================================================
# AI PROVIDERS
# =============================================================================
GEMINI_API_KEY=""
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""

# =============================================================================
# META / FACEBOOK GRAPH API
# =============================================================================
META_APP_ID=""
META_APP_SECRET=""
META_REDIRECT_URI="http://localhost:5000/api/v1/meta/callback"

# =============================================================================
# GOOGLE SEARCH CONSOLE API
# =============================================================================
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_REDIRECT_URI="http://localhost:5000/api/v1/seo/callback"

# =============================================================================
# STORAGE (OPTIONAL LOCAL OR CLOUD)
# =============================================================================
STORAGE_DRIVER=local
UPLOAD_DIR=./uploads
```
