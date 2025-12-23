# SRS Website - AI Context Overview

## Project Summary

Southwest Resume Services (SRS) marketing website built with Next.js 15.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Domain**: southwestresumes.com

## Directory Structure

```
/                           # Root - PRODUCTION code
├── app/                    # Next.js App Router pages
├── components/             # React components
├── lib/                    # Utilities, auth, database types
├── public/                 # Static assets
├── .ai-context/            # AI model reference docs (this folder)
├── archive/                # Archived old code
├── prototype/              # Development sandbox (EXCLUDED from build)
├── staging/                # Staging sandbox (EXCLUDED from build)
└── tests/                  # Test files (EXCLUDED from build)
```

## Key Files

- `app/page.tsx` - Homepage
- `lib/supabase/types.ts` - Database schema types
- `lib/auth/admin-auth.ts` - Admin authentication
- `lib/auth/questionnaire-auth.ts` - Client questionnaire tokens
- `vercel.json` - Deployment configuration
- `tsconfig.json` - TypeScript config (excludes prototype/staging/tests)

## Database Tables

1. `questionnaire_responses` - Client questionnaire answers
2. `response_history` - Snapshot history of responses
3. `questionnaire_access_tokens` - Secure access tokens for clients
4. `admin_users` - Admin panel users with roles
5. `admin_settings` - Application configuration

## Design System

- **Navy**: `#1e3a5f` - Primary brand color
- **Gold**: `#d4af37` - Accent color
- **Charcoal**: `#333333` - Text color
- **Sand**: `#f5f5dc` variants - Background colors

## Important Notes

1. **Prototype vs Root**: Development happens in `/prototype/`, then migrates to root for production
2. **TypeScript Strict**: All code must pass strict TypeScript checks
3. **Build before push**: Always run `npm run build` before pushing to main
4. **Auto-deploy**: Pushing to `main` triggers Vercel deployment automatically

## Common Tasks

### Run Development Server
```bash
cd "/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website"
npm run dev
# Opens at http://localhost:3000
```

### Build for Production
```bash
npm run build
```

### Check Deployment
See `.ai-context/DEPLOYMENT.md`

## Last Updated
2024-12-22
