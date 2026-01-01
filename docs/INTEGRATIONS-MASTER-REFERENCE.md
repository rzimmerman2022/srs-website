# Southwest Resume Services - Integrations Master Reference

**Last Updated:** 2026-01-01
**Purpose:** Single source of truth for ALL third-party integrations

---

## QUICK REFERENCE CARD

| Service | Account Email | Dashboard |
|---------|--------------|-----------|
| **Google Analytics** | Google Workspace | [analytics.google.com](https://analytics.google.com) |
| **HubSpot CRM** | Ryan Zimmerman | [app.hubspot.com](https://app.hubspot.com) |
| **Formspree** | ryan.zimmerman@sparkdatalab.ai | [formspree.io/forms](https://formspree.io/forms) |
| **Supabase** | Ryan Zimmerman | [supabase.com](https://supabase.com) |
| **Vercel** | rzimmerman2022 | [vercel.com](https://vercel.com) |

---

## 1. GOOGLE ANALYTICS 4

### Credentials
| Item | Value |
|------|-------|
| **Measurement ID** | `G-BZDVNW58WQ` |
| **Property Name** | Southwest Resume Services |
| **Dashboard** | [analytics.google.com](https://analytics.google.com) |

### Environment Variable
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-BZDVNW58WQ
```

### What It Tracks
- Page views
- Form submissions (`trackFormSubmission`)
- CTA clicks (`trackCTAClick`)
- Phone clicks (`trackPhoneClick`)
- Email clicks (`trackEmailClick`)

### Code Location
- [lib/analytics.ts](../lib/analytics.ts)
- [app/layout.tsx](../app/layout.tsx)

---

## 2. HUBSPOT CRM

### Configuration
| Item | Value |
|------|-------|
| **Portal ID** | `243166647` |
| **App Name** | SRS Integration |
| **App Type** | Legacy Private App |
| **Token** | Stored in `.env.local` (starts with `pat-na2-`) |
| **Secret** | Stored in `.env.local` |

### Access Path (to get/rotate credentials)
1. [app.hubspot.com](https://app.hubspot.com)
2. Settings (gear) → Development → Legacy Apps
3. Click "SRS Integration"
4. Auth tab → Show token

### Environment Variables (actual values in .env.local)
```bash
# SECURITY: Get actual tokens from HubSpot dashboard
HUBSPOT_PRIVATE_APP_TOKEN=<from HubSpot Auth tab>
HUBSPOT_CLIENT_SECRET=<from HubSpot Auth tab>
HUBSPOT_PORTAL_ID=243166647
HUBSPOT_ENABLED=true
HUBSPOT_WEBHOOKS_ENABLED=true
HUBSPOT_BIDIRECTIONAL_SYNC=true
HUBSPOT_CREATE_DEALS=true
HUBSPOT_DEBUG=false
```

### Scopes Configured
- `crm.objects.contacts.read`
- `crm.objects.contacts.write`
- `crm.objects.deals.read`
- `crm.objects.deals.write`

### Code Location
- [lib/hubspot/config.ts](../lib/hubspot/config.ts)
- [lib/hubspot/client.ts](../lib/hubspot/client.ts)
- Full docs: [docs/HUBSPOT-INTEGRATION.md](./HUBSPOT-INTEGRATION.md)

---

## 3. FORMSPREE CONTACT FORM

### Configuration

| Item | Value |
|------|-------|
| **Form ID** | `xaqnnbpp` |
| **Form Name** | Southwest Resume Services Contact |
| **Endpoint** | `https://formspree.io/f/xaqnnbpp` |
| **Account Email** | `ryan.zimmerman@sparkdatalab.ai` |
| **Sends To** | `info@southwestresumes.com` (VERIFIED 2026-01-01) |

### Access Path
1. [formspree.io](https://formspree.io)
2. Login with: `ryan.zimmerman@sparkdatalab.ai`
3. Click "Southwest Resume Services Contact"

### Dashboard Links
- **Integration:** [formspree.io/forms/xaqnnbpp/integration](https://formspree.io/forms/xaqnnbpp/integration)
- **Submissions:** [formspree.io/forms/xaqnnbpp/submissions](https://formspree.io/forms/xaqnnbpp/submissions)
- **Settings:** [formspree.io/forms/xaqnnbpp/settings](https://formspree.io/forms/xaqnnbpp/settings)

### Environment Variable
```bash
NEXT_PUBLIC_FORMSPREE_URL=https://formspree.io/f/xaqnnbpp
```

### Code Location
- [components/sections/ContactForm.tsx](../components/sections/ContactForm.tsx) (line 77)

### To Change Notification Email
1. Login to Formspree with `ryan.zimmerman@sparkdatalab.ai`
2. Forms → Southwest Resume Services Contact → Settings
3. Add new email under "Send emails to"
4. Verify the new email
5. Remove old email if desired

---

## 4. SUPABASE DATABASE

### Credentials
| Item | Value |
|------|-------|
| **Project URL** | `https://aougseszcvzgxwniossn.supabase.co` |
| **Project Ref** | `aougseszcvzgxwniossn` |
| **Dashboard** | [supabase.com/dashboard](https://supabase.com/dashboard) |

### Environment Variables (actual values in .env.local)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://aougseszcvzgxwniossn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Supabase dashboard - API Settings>
SUPABASE_SERVICE_ROLE_KEY=<from Supabase dashboard - API Settings>
SUPABASE_ACCESS_TOKEN=<from Supabase account settings>
SUPABASE_PROJECT_REF=aougseszcvzgxwniossn
```

### Code Location
- [lib/supabase/client.ts](../lib/supabase/client.ts)
- [lib/supabase/server.ts](../lib/supabase/server.ts)

---

## 5. VERCEL DEPLOYMENT

### Access
| Item | Value |
|------|-------|
| **Account** | rzimmerman2022 |
| **Project** | southwest-resume-services |
| **Dashboard** | [vercel.com](https://vercel.com) |

### Production Domains
- `southwestresumes.com`
- `www.southwestresumes.com`
- `southwest-resume-services.vercel.app`

### Environment Variables Location
Settings → Environment Variables

### All Required Variables
| Variable | Required |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Yes |
| `NEXT_PUBLIC_FORMSPREE_URL` | Yes |
| `HUBSPOT_ENABLED` | Yes |
| `HUBSPOT_PRIVATE_APP_TOKEN` | Yes |
| `HUBSPOT_CLIENT_SECRET` | Yes |
| `HUBSPOT_PORTAL_ID` | Yes |
| `HUBSPOT_WEBHOOKS_ENABLED` | Yes |
| `HUBSPOT_BIDIRECTIONAL_SYNC` | Yes |
| `HUBSPOT_CREATE_DEALS` | Yes |

---

## TROUBLESHOOTING

### Form Not Receiving Submissions
1. Check [Formspree Submissions](https://formspree.io/forms/xaqnnbpp/submissions)
2. Verify Settings → "Send emails to" is correct
3. Check spam folder of `info@southwestresumes.com`
4. Test endpoint: `curl -X POST "https://formspree.io/f/xaqnnbpp" -d "email=test@test.com"`

### Analytics Not Tracking
1. Check browser console for gtag errors
2. Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel
3. Check GA4 Realtime view

### HubSpot Not Syncing
1. Verify `HUBSPOT_ENABLED=true` in Vercel
2. Check if token expired: HubSpot → Development → Legacy Apps
3. Check Supabase `hubspot_sync_state` table

### After Changing Environment Variables
1. Go to Vercel → Deployments
2. Click "Redeploy" on latest deployment
3. Uncheck "Use existing Build Cache"
4. Redeploy

---

## DOCUMENTATION MAP

Complete 1:1 mapping of where all APIs, tokens, and configuration details are documented.

### Credential Storage Locations

| Credential Type | Storage Location | Access Method |
|-----------------|------------------|---------------|
| All API tokens/secrets | `.env.local` | Local file (gitignored) |
| Production env vars | Vercel Dashboard | Settings → Environment Variables |
| Public IDs (GA, Portal) | This document | Safe to reference |

### API/Token Documentation by Service

| Service | Token/ID | Documented In | Code Location |
|---------|----------|---------------|---------------|
| **Google Analytics** | `G-BZDVNW58WQ` | This doc, ENVIRONMENT-VARIABLES.md | `lib/analytics.ts` |
| **HubSpot Portal** | `243166647` | This doc, ENVIRONMENT-VARIABLES.md | `lib/hubspot/config.ts` |
| **HubSpot Token** | `pat-na2-...` | `.env.local` only | `lib/hubspot/client.ts` |
| **Formspree Form** | `xaqnnbpp` | This doc, ENVIRONMENT-VARIABLES.md | `components/sections/ContactForm.tsx:77` |
| **Supabase URL** | `aougseszcvzgxwniossn` | This doc, SUPABASE-AI-AUTOMATION.md | `lib/supabase/client.ts` |
| **Supabase Keys** | `eyJ...` | `.env.local` only | `lib/supabase/server.ts` |

### Documentation File Index

| File | Purpose | Contains |
|------|---------|----------|
| `docs/INTEGRATIONS-MASTER-REFERENCE.md` | **START HERE** | Quick reference for all integrations |
| `docs/ENVIRONMENT-VARIABLES.md` | Env var setup | How to configure each variable |
| `docs/HUBSPOT-INTEGRATION.md` | HubSpot deep-dive | Sync architecture, webhooks, troubleshooting |
| `docs/SUPABASE-AI-AUTOMATION.md` | Supabase setup | CLI commands, migrations, schema |
| `docs/handoffs/HANDOFF_2026-01-01_*.md` | Session history | What was done, why, verification steps |
| `README.md` | Project overview | Links to all docs, quick start |
| `CHANGELOG.md` | Change history | What changed and when |

### Dashboard Quick Links

| Service | Dashboard URL | Login |
|---------|---------------|-------|
| Google Analytics | [analytics.google.com](https://analytics.google.com) | Google Workspace |
| HubSpot | [app.hubspot.com](https://app.hubspot.com) | Ryan Zimmerman |
| Formspree | [formspree.io/forms](https://formspree.io/forms) | ryan.zimmerman@sparkdatalab.ai |
| Supabase | [supabase.com/dashboard](https://supabase.com/dashboard) | Ryan Zimmerman |
| Vercel | [vercel.com](https://vercel.com) | rzimmerman2022 |

---

## HISTORY

| Date | Change | By |
|------|--------|-----|
| 2026-01-01 | Added Documentation Map section | Claude Opus 4.5 |
| 2026-01-01 | Added GA4, HubSpot, new Formspree form | Claude Opus 4.5 |
| 2026-01-01 | Created this master reference | Claude Opus 4.5 |

---

## RELATED DOCUMENTATION

- [Environment Variables](./ENVIRONMENT-VARIABLES.md) - Complete env var reference
- [HubSpot Integration](./HUBSPOT-INTEGRATION.md) - Detailed HubSpot setup
- [Lead Capture Handoff](./handoffs/HANDOFF_2026-01-01_lead-capture-configuration.md) - Session details

---

**IMPORTANT FOR AI MODELS:**
- Always check this document first for integration credentials
- Never change integration IDs without updating this document
- Always test after making changes
- Document any changes in the History section
