# Southwest Resume Services - AI Context

This file provides context for AI assistants (Claude, GPT, Gemini, etc.) working on this project.
Read this file first before making changes.

## Project Overview

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
