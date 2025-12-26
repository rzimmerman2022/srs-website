# Southwest Resume Services - AI Context

This file provides context for AI assistants (Claude, GPT, Gemini, etc.) working on this project.
Read this file first before making changes.

---

## IMPORTANT: Development Folder

**This folder (`staging/`) contains the Strategic Placement Diagnostic Questionnaire system - a gamified client intake form.**

### Quick Start

```bash
npm run dev -- -p 3005
# Visit: http://localhost:3005/discovery/test-client
```

### Key Documentation

- **[AI-PASSDOWN.md](./AI-PASSDOWN.md)** - Complete project status, todos, session history
- **[AUDIT-REPORT.md](./AUDIT-REPORT.md)** - Security, accessibility, performance audit findings

### Current Priority

**DO NOT DEPLOY TO PRODUCTION** until critical security issues are fixed. See AI-PASSDOWN.md for the master todo list.

---

## Main Website Overview

- **Site**: Southwest Resume Services (professional resume writing)
- **Framework**: Next.js 15.1.2, React 19, TypeScript, Tailwind CSS
- **Production URL**: <https://southwestresumes.com>

## Deployment

- **Platform**: Vercel
- **Project**: southwest-resume-services
- **Deploy command**: `vercel --prod --yes` (user is logged into Vercel CLI)
- **Token**: Can be set via `$env:VERCEL_TOKEN` if needed, but CLI auth is already configured

## Domain & DNS

- **Registrar**: Spaceship (spaceship.com)
- **Nameservers**: launch1.spaceship.net, launch2.spaceship.net
- **DNS Records** (configured at Spaceship):
  - A record: @ → 76.76.21.21 (Vercel)
  - CNAME: www → cname.vercel-dns.com
  - TXT: @ → google-site-verification=... (GSC verification)
  - TXT: @ → v=spf1 include:_spf.google.com ~all (SPF)
  - TXT: google._domainkey → v=DKIM1... (DKIM)
  - TXT: _dmarc → v=DMARC1... (DMARC)
  - MX: @ → Google Workspace mail servers
- **Email**: Google Workspace (MX records point to Google)
- **Note**: Vercel dashboard may show stale "Wix nameservers" warning - this is a cached display issue, DNS is correctly at Spaceship

### Spaceship API Credentials

**CRITICAL: Credentials stored in `.env.spaceship.local` (gitignored)**

```bash
SPACESHIP_API_KEY=CzoHGOwSXsejPTWnBqmq
SPACESHIP_API_SECRET=xHAI183L0Umgw43TPulh9Qx4BnQGDM1GNHoO958agJ0FR8dK47SvnyYVXui6j3oQ
```

**Backup Keys (also in .env.spaceship.local):**

- SDA Key 2: `nNVZd56BcVM432NDVesj` / Secret: `ZhGu68GbHPyzldqRJNSsPZNkb1l4X3zaTNwywMsCA09VeB1in7mY52X5X957qmth`
- SDA Key - PC: `OlwNlJq7FgknWDHENC5c` / Secret: `vtHRFg9wjjEn2b7Vjks0ZwEkdzXBADSZVjydwkCP7ffbDNvEuZrSUq4elXUTW4SX`

**DNS Management Scripts:**

- `./scripts/spaceship-dns.sh list` - List all DNS records
- `./scripts/spaceship-dns.sh add-txt "value"` - Add TXT record
- `./scripts/spaceship-dns.sh add-google-verification` - Add GSC TXT

---

## ALL API Credentials & Tokens

**SECURITY: All credentials are stored in gitignored `.env*.local` files**

### Supabase (Database & Auth)

**File:** `.env.local` (root directory)
**Project:** SRS-Questionnaire | **Org:** SparkData Analytics | **Region:** AWS us-west-2

```bash
NEXT_PUBLIC_SUPABASE_URL=https://aougseszcvzgxwniossn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdWdzZXN6Y3Z6Z3h3bmlvc3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNzc1NDYsImV4cCI6MjA4MTc1MzU0Nn0.gf3DH1rRE1fWWnNIOdaTNFRM6osnLriG91SFni2BUP4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdWdzZXN6Y3Z6Z3h3bmlvc3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjE3NzU0NiwiZXhwIjoyMDgxNzUzNTQ2fQ.6X4M574Rbrp8-8fHt16p8yKWAsxXy9Vz6rMV5ASoBg8
SUPABASE_PROJECT_REF=aougseszcvzgxwniossn
```

**Supabase CLI Token (for AI automation):**

```bash
# Token Name: AI-Automation | Expires: 01 May 2026
SUPABASE_ACCESS_TOKEN=REDACTED_SUPABASE_TOKEN
```

### Admin Credentials

```bash
ADMIN_EMAIL=ryan.zimmerman@southwestresumes.com
ADMIN_PASSWORD=REDACTED_DB_PASSWORD
```

### Spaceship DNS API

**File:** `.env.spaceship.local`

```bash
# Primary Key (SDA)
SPACESHIP_API_KEY=CzoHGOwSXsejPTWnBqmq
SPACESHIP_API_SECRET=xHAI183L0Umgw43TPulh9Qx4BnQGDM1GNHoO958agJ0FR8dK47SvnyYVXui6j3oQ

# Backup Key 2 (SDA Key 2)
SPACESHIP_API_KEY_2=nNVZd56BcVM432NDVesj
SPACESHIP_API_SECRET_2=ZhGu68GbHPyzldqRJNSsPZNkb1l4X3zaTNwywMsCA09VeB1in7mY52X5X957qmth

# Backup Key 3 (SDA Key - PC)
SPACESHIP_API_KEY_PC=OlwNlJq7FgknWDHENC5c
SPACESHIP_API_SECRET_PC=vtHRFg9wjjEn2b7Vjks0ZwEkdzXBADSZVjydwkCP7ffbDNvEuZrSUq4elXUTW4SX
```

### Google Search Console

**Verification Code (already in DNS):**

```text
google-site-verification=d_45b3Xpuzx9WA0lKmS56bsCOyVsw5PYBa__E1qYaF0
```

### Security Checklist

- [x] All `.env*.local` files are in `.gitignore`
- [x] Service role keys never exposed to client
- [x] API secrets stored securely
- [x] Backup keys documented for disaster recovery

---

## Known Issues (Resolved)

- **React Hydration Error #418**: Fixed by replacing `Math.random()` with `useId()` in Input.tsx
- **CSS loading issues**: Added inline CSS fallback in layout.tsx and `animate-fade-in-up` animation to globals.css

## Key Files

- `deploy-srs-to-vercel.ps1` - Deployment script with additional context
- `vercel.json` - Vercel config with security headers
- `.claude/settings.local.json` - Claude Code permissions
