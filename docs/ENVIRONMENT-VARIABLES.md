# Environment Variables Configuration

**Last Updated:** 2026-01-01
**Purpose:** Complete reference for all environment variables required by Southwest Resume Services website

## Quick Reference

| Variable | Required | Location | Status |
|----------|----------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | `.env.local` + Vercel | Configured |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | `.env.local` + Vercel | Configured |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | `.env.local` + Vercel | Configured |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Yes | `.env.local` + Vercel | **G-BZDVNW58WQ** |
| `HUBSPOT_ENABLED` | Yes | `.env.local` + Vercel | **true** (ENABLED) |
| `HUBSPOT_PRIVATE_APP_TOKEN` | Yes | `.env.local` + Vercel | **Configured** (pat-na2-...) |
| `HUBSPOT_PORTAL_ID` | Yes | `.env.local` + Vercel | **243166647** |
| `NEXT_PUBLIC_FORMSPREE_URL` | Yes | `.env.local` + Vercel | **xaqnnbpp** (Configured) |

---

## 1. Google Analytics 4

### Variable
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-BZDVNW58WQ
```

### Purpose
Enables Google Analytics tracking for:
- Page views
- Form submissions (`trackFormSubmission`)
- CTA clicks (`trackCTAClick`)
- Phone clicks (`trackPhoneClick`)
- Email clicks (`trackEmailClick`)

### Where to Find
1. Go to [analytics.google.com](https://analytics.google.com)
2. Admin (gear icon) → Data Streams → Web
3. Copy the Measurement ID (starts with `G-`)

### Code Location
- Configuration: [lib/analytics.ts](../lib/analytics.ts)
- Script injection: [app/layout.tsx](../app/layout.tsx) (lines 340-357)

### Verification
After setting, check:
1. Google Analytics → Realtime → Visit your site
2. You should see yourself as an active user

---

## 2. HubSpot CRM Integration

### Configuration (Credentials in .env.local only)

```bash
# SRS Integration App - Legacy Private App
# Created: 2026-01-01 by Ryan Zimmerman
# SECURITY: Actual tokens stored in .env.local only - NEVER commit to git
HUBSPOT_PRIVATE_APP_TOKEN=pat-na2-xxxx-xxxx-xxxx-xxxxxxxxxxxx
HUBSPOT_CLIENT_SECRET=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
HUBSPOT_PORTAL_ID=243166647

# Feature Flags - ALL ENABLED
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

### Synchronization Features

Enables automatic synchronization of:

- Client contacts from admin panel to HubSpot
- Questionnaire status updates
- Deal creation and tracking

### Where to Find (if credentials need rotation)

**Private App Token:**

1. HubSpot → Development → Legacy Apps
2. Select "SRS Integration" app
3. Click "Auth" tab → "Show token" → Copy

**Portal ID:**

1. Look at HubSpot URL: `app.hubspot.com/developer/243166647/...`

### Code Location
- Configuration: [lib/hubspot/config.ts](../lib/hubspot/config.ts)
- Full documentation: [docs/HUBSPOT-INTEGRATION.md](./HUBSPOT-INTEGRATION.md)

### CRITICAL NOTE
If `HUBSPOT_ENABLED` is not set to `true`, the entire HubSpot integration is disabled and NO leads sync to CRM.

---

## 3. Supabase Database

### Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=https://aougseszcvzgxwniossn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# CLI Access (for AI automation)
SUPABASE_ACCESS_TOKEN=sbp_...
SUPABASE_PROJECT_REF=aougseszcvzgxwniossn
```

### Purpose
- `NEXT_PUBLIC_*` - Client-side database access
- `SERVICE_ROLE_KEY` - Server-side elevated access
- `ACCESS_TOKEN` - CLI automation for migrations

### Code Location
- Client: [lib/supabase/client.ts](../lib/supabase/client.ts)
- Server: [lib/supabase/server.ts](../lib/supabase/server.ts)

---

## 4. Formspree Contact Form

### Configuration

```bash
# Form Name: "Southwest Resume Services Contact"
# Form ID: xaqnnbpp
# Account Owner: ryan.zimmerman@sparkdatalab.ai
# Dashboard: https://formspree.io/forms/xaqnnbpp/integration
# IMPORTANT: Email destination is configured in Formspree dashboard, NOT in code
# Target: info@southwestresumes.com (VERIFY in Formspree Settings!)
# Created: 2026-01-01
NEXT_PUBLIC_FORMSPREE_URL=https://formspree.io/f/xaqnnbpp
```

### CRITICAL - DO NOT CHANGE WITHOUT READING THIS

**Account Access:**

- Login URL: [formspree.io](https://formspree.io)
- Account Email: `ryan.zimmerman@sparkdatalab.ai`
- Forms Dashboard: [formspree.io/forms](https://formspree.io/forms)

**Form Details:**

| Property | Value |
|----------|-------|
| Form Name | Southwest Resume Services Contact |
| Form ID | `xaqnnbpp` |
| Full Endpoint | `https://formspree.io/f/xaqnnbpp` |
| Notifications | `info@southwestresumes.com` (VERIFIED 2026-01-01) |
| Dashboard | [View Form](https://formspree.io/forms/xaqnnbpp/integration) |
| Submissions | [View Submissions](https://formspree.io/forms/xaqnnbpp/submissions) |

### Purpose

Handles contact form submissions from the website:

- Receives form data (name, email, phone, message, resume file)
- Sends email notification to configured address
- Provides submission dashboard for review

### Code Location

- Form Component: [components/sections/ContactForm.tsx](../components/sections/ContactForm.tsx)
- Fallback defined at line 77: `'https://formspree.io/f/xaqnnbpp'`

### To Change Notification Email

1. Log into [formspree.io](https://formspree.io) with `ryan.zimmerman@sparkdatalab.ai`
2. Go to Forms → "Southwest Resume Services Contact" → Settings
3. Under "Send emails to", add new email address
4. Formspree will send verification email to new address
5. Once verified, you can remove old address if desired

### History & Lessons Learned

**IMPORTANT:** On 2026-01-01, we discovered the previous form (`xgvglrbr`) was an orphan form created without proper account association. Submissions were going to `ryan.zimmerman@sparkdatalab.ai` but nobody knew this.

**To prevent this in future:**

1. ALWAYS document the Formspree account email
2. ALWAYS verify form ID matches what's in the dashboard
3. ALWAYS test form submission after any changes
4. NEVER change form ID without updating this documentation

### Verification Steps

1. Log into [formspree.io](https://formspree.io) with `ryan.zimmerman@sparkdatalab.ai`
2. Verify form `xaqnnbpp` exists and is named "Southwest Resume Services Contact"
3. Check Settings → "Send emails to" shows correct recipient
4. Submit test form on website
5. Verify email arrives at configured address
6. Check Submissions tab in Formspree dashboard

---

## 5. Admin Authentication

### Variables
```bash
ADMIN_EMAIL=ryan.zimmerman@southwestresumes.com
ADMIN_PASSWORD=<your-password>
```

### Purpose
Admin panel login credentials.

### Code Location
- Auth: [lib/auth/admin-auth.ts](../lib/auth/admin-auth.ts)

---

## Complete `.env.local` Template

**SECURITY WARNING:** Actual credentials are stored ONLY in `.env.local` (gitignored).
Copy this template and fill in actual values from your secure credential storage.

```bash
# =============================================================================
# SUPABASE CONFIGURATION
# Get credentials from: https://supabase.com/dashboard/project/aougseszcvzgxwniossn/settings/api
# =============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://aougseszcvzgxwniossn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<get from Supabase dashboard - anon/public key>
SUPABASE_SERVICE_ROLE_KEY=<get from Supabase dashboard - service_role key>
SUPABASE_ACCESS_TOKEN=<get from Supabase account settings - access token>
SUPABASE_PROJECT_REF=aougseszcvzgxwniossn

# =============================================================================
# ADMIN LOGIN
# =============================================================================
ADMIN_EMAIL=ryan.zimmerman@southwestresumes.com
ADMIN_PASSWORD=<your secure admin password>

# =============================================================================
# GOOGLE ANALYTICS 4
# Get from: https://analytics.google.com → Admin → Data Streams
# =============================================================================
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-BZDVNW58WQ

# =============================================================================
# HUBSPOT CRM INTEGRATION
# Get credentials from: https://app.hubspot.com → Development → Legacy Apps → SRS Integration
# =============================================================================
HUBSPOT_PRIVATE_APP_TOKEN=<get from HubSpot - Auth tab - Show token>
HUBSPOT_CLIENT_SECRET=<get from HubSpot - Auth tab>
HUBSPOT_PORTAL_ID=243166647
HUBSPOT_ENABLED=true
HUBSPOT_WEBHOOKS_ENABLED=true
HUBSPOT_BIDIRECTIONAL_SYNC=true
HUBSPOT_CREATE_DEALS=true
HUBSPOT_DEBUG=false

# =============================================================================
# FORMSPREE CONTACT FORM
# Dashboard: https://formspree.io/forms/xaqnnbpp/integration
# Login with: ryan.zimmerman@sparkdatalab.ai
# VERIFY "Send emails to" is set correctly in Formspree Settings!
# =============================================================================
NEXT_PUBLIC_FORMSPREE_URL=https://formspree.io/f/xaqnnbpp
```

---

## Vercel Deployment

All variables marked as required must ALSO be set in Vercel:

1. Go to [vercel.com](https://vercel.com) → Your Project
2. Settings → Environment Variables
3. Add each variable for Production, Preview, and Development

### Vercel-Specific Notes
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Non-prefixed variables are server-side only
- Changes require redeployment to take effect

---

## Troubleshooting

### "Google Analytics not tracking"
1. Check `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
2. Restart dev server after adding env var
3. Check browser console for gtag errors
4. Verify in GA Realtime view

### "HubSpot sync not working"
1. Check `HUBSPOT_ENABLED=true`
2. Verify token hasn't expired
3. Check Supabase `hubspot_sync_state` table for errors
4. Enable `HUBSPOT_DEBUG=true` for verbose logging

### "Form submissions not received"
1. Check Formspree dashboard for submissions
2. Check spam folder
3. Verify email forwarding is configured
4. Test with a different email address

---

## Security Notes

- NEVER commit `.env.local` to git (it's in `.gitignore`)
- Rotate credentials if exposed
- Use different credentials for staging vs production
- Service role key has elevated privileges - protect it

---

**Document Maintainer:** AI Automation System
**Last Verified:** 2026-01-01
