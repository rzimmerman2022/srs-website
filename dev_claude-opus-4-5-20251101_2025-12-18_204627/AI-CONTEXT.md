# Southwest Resume Services - AI Context

This file provides context for AI assistants (Claude, GPT, Gemini, etc.) working on this project.
Read this file first before making changes.

---

## IMPORTANT: Development Folder

**This folder (`dev_claude-opus-4-5-20251101_2025-12-18_204627/`) contains the Strategic Placement Diagnostic Questionnaire system - a gamified client intake form.**

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

- **Registrar**: Spaceship
- **Nameservers**: launch1.spaceship.net, launch2.spaceship.net
- **DNS Records** (configured at Spaceship):
  - A record: @ → 76.76.21.21 (Vercel)
  - CNAME: www → cname.vercel-dns.com
- **Email**: Google Workspace (MX records point to Google)
- **Note**: Vercel dashboard may show stale "Wix nameservers" warning - this is a cached display issue, DNS is correctly at Spaceship

## Known Issues (Resolved)

- **React Hydration Error #418**: Fixed by replacing `Math.random()` with `useId()` in Input.tsx
- **CSS loading issues**: Added inline CSS fallback in layout.tsx and `animate-fade-in-up` animation to globals.css

## Key Files

- `deploy-srs-to-vercel.ps1` - Deployment script with additional context
- `vercel.json` - Vercel config with security headers
- `.claude/settings.local.json` - Claude Code permissions
