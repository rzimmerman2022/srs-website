# AI Context Files

This folder contains reference documentation for AI models working on the SRS Website project.

## Files

| File | Purpose |
|------|---------|
| `PROJECT-OVERVIEW.md` | Tech stack, directory structure, design system |
| `DEPLOYMENT.md` | Vercel config, deployment commands, troubleshooting |
| `SUPABASE.md` | Database schema, types, migrations |

## Quick Reference

### Production URLs
- **Live Site**: https://southwestresumes.com
- **Vercel Dashboard**: https://vercel.com/rzimmerman2022/srs-website
- **GitHub**: https://github.com/rzimmerman2022/srs-website

### Critical Paths
- Homepage: `/app/page.tsx`
- Database types: `/lib/supabase/types.ts`
- Vercel config: `/vercel.json`

### Build & Deploy
```bash
# Build locally
npm run build

# Push to deploy (auto-deploys to Vercel)
git push origin main

# Check deployments
npx vercel ls --token "$VERCEL_TOKEN"
```

## When to Update These Files

Update these files when:
1. Database schema changes
2. New environment variables added
3. Deployment process changes
4. Major architectural changes

## Last Updated
2024-12-22
