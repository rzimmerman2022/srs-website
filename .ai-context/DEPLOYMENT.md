# SRS Website Deployment Configuration

## Vercel Project Details

- **Project Name**: southwest-resume-services
- **Production URL**: https://southwestresumes.com
- **Vercel Dashboard**: https://vercel.com/rzimmerman2022s-projects/southwest-resume-services
- **GitHub Repo**: https://github.com/rzimmerman2022/srs-website
- **Preview URL Pattern**: southwest-resume-services-[hash]-rzimmerman2022s-projects.vercel.app

## Git Configuration

- **Main Branch**: `main`
- **Auto-deploy**: Enabled on push to `main`
- **Preview Deploys**: Enabled for PRs

## Environment Variables (Vercel Dashboard)

Required environment variables that must be set in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>
```

## Vercel CLI Authentication

To use Vercel CLI, you need a token:

1. Go to https://vercel.com/account/tokens
2. Create a new token with appropriate scope
3. Export it: `export VERCEL_TOKEN="your-token-here"`

Or login interactively:
```bash
npx vercel login
```

## Checking Deployment Status

### Via CLI (requires token)
```bash
npx vercel ls --token "$VERCEL_TOKEN"
npx vercel inspect <deployment-url> --token "$VERCEL_TOKEN"
```

### Via API
```bash
curl -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v6/deployments?projectId=<project-id>"
```

### Via Dashboard
Direct link: https://vercel.com/rzimmerman2022/srs-website/deployments

## Triggering Manual Deploy

```bash
# From project root
npx vercel --prod --token "$VERCEL_TOKEN"
```

## Build Configuration

From `vercel.json`:
- Framework: Next.js
- Build Command: `npm run build`
- Install Command: `npm install`
- Dev Command: `npm run dev`

## Troubleshooting

### Deployment Not Triggering
1. Check GitHub webhook in Vercel project settings
2. Verify main branch is connected
3. Check Vercel dashboard for build errors
4. Ensure `vercel.json` is valid

### Build Failures
1. Run `npm run build` locally first
2. Check for TypeScript errors
3. Verify all dependencies are in package.json
4. Check environment variables are set in Vercel

## Last Updated
2024-12-22
