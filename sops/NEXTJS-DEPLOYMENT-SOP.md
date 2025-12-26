# NEXT.JS 15 DEPLOYMENT SOP (Standard Operating Procedure)

**Last Updated:** 2025-12-22

**Platform:** Next.js 15 with Vercel
**Deployment Target:** Production

---

## Table of Contents

1. [Overview](#overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Deployment Procedure](#deployment-procedure)
4. [Post-Deployment Verification](#post-deployment-verification)
5. [Rollback Procedures](#rollback-procedures)
6. [Troubleshooting](#troubleshooting)

---

## Overview

### DPS Workflow (Vercel Recommended)

**D.P.S. = Develop → Preview → Ship**

1. **Develop:** Write code with hot reloading locally
2. **Preview:** Push changes to branch for preview deployment via URL
3. **Ship:** Merge to main for production deployment

**Source:** [Vercel & Next.js: Edge Functions, Preview Deployments](https://medium.com/@takafumi.endo/how-vercel-simplifies-deployment-for-developers-beaabe0ada32)

### Deployment Contexts

| Context | Branch | URL | Purpose |
|---------|--------|-----|---------|
| **Local** | - | http://localhost:3000 | Development & unit testing |
| **Preview** | feature/* | deploy-preview-[pr]--site.vercel.app | PR testing & stakeholder review |
| **Production** | main | example.com | Live users |

### Key Principle

> "Every pull request generates its own preview environment, letting you see changes instantly. Automatically generated preview environments for every pull request have streamlined team collaboration: reviewers can test actual live environments instead of combing through code or local setups, drastically shortening feedback loops."

**Source:** [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)

---

## Pre-Deployment Checklist

### Phase 1: Code Quality

#### 1.1 TypeScript Validation

```bash
# Run TypeScript type checking
npx tsc --noEmit
```

**Expected Output:**
```
✓ No TypeScript errors found
```

**Next.js 15 Recommendation:**
> "Use TypeScript and the TypeScript plugin for better type-safety to catch errors early."

**Source:** [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)

- [ ] TypeScript compilation passes with zero errors
- [ ] No `any` types in critical code paths
- [ ] All environment variables have proper types

---

#### 1.2 Linting

```bash
# Run ESLint
npm run lint
```

**Expected Output:**
```
✓ No ESLint warnings
```

- [ ] ESLint passes with zero errors
- [ ] No disabled ESLint rules without documentation
- [ ] Code follows project style guide

---

#### 1.3 Unit Tests

```bash
# Run all unit tests
npm test
```

**Expected Output:**
```
Test Suites: X passed, X total
Tests:       X passed, X total
Time:        X.XXs
```

- [ ] All unit tests pass (100%)
- [ ] Code coverage meets minimum threshold (80%+)
- [ ] No skipped tests without documentation

---

### Phase 2: Environment Configuration

#### 2.1 Environment Variables

**Validate Required Variables:**

```javascript
// scripts/validate-env.js
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'JWT_SECRET',
  'NEXT_PUBLIC_API_URL',
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`❌ Missing required environment variable: ${envVar}`);
  }
});

console.log('✅ All required environment variables are set');
```

```bash
# Run validation
node scripts/validate-env.js
```

**Checklist:**

- [ ] All required environment variables documented
- [ ] Production environment variables set in Vercel
- [ ] No hardcoded secrets in code
- [ ] `.env.local` in `.gitignore`
- [ ] Public variables prefixed with `NEXT_PUBLIC_`

**Next.js 15 Security:**
> "Environment variables should be managed carefully with .env.* files added to .gitignore and only public variables prefixed with NEXT_PUBLIC_."

**Source:** [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)

---

#### 2.2 Secrets Rotation

**Before Production Deployment:**

```bash
# Rotate these secrets:
- JWT_SECRET
- SUPABASE_SERVICE_ROLE_KEY (if used)
- Third-party API keys
```

**Stripe Recommendation:**
> "Rotate your API keys on a regular basis, and also rotate them immediately before going live in case they've been saved somewhere outside of your codebase during development."

**Source:** [Stripe Go-Live Checklist](https://stripe.com/docs/development/checklist)

- [ ] JWT_SECRET rotated before production
- [ ] Database passwords rotated
- [ ] Third-party API keys verified as production keys
- [ ] Old secrets revoked

---

### Phase 3: Security

#### 3.1 Content Security Policy

**Verify CSP Header:**

```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ];
  },
};
```

**Next.js 15 Recommendation:**
> "Consider adding a Content Security Policy to protect against cross-site scripting, clickjacking, and code injection attacks."

**Source:** [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)

- [ ] CSP header configured
- [ ] CSP tested in preview environment
- [ ] No CSP violations in browser console

---

#### 3.2 Cookie Security

**Verify Cookie Configuration:**

```typescript
// Correct cookie configuration
const cookieOptions = {
  httpOnly: true,
  secure: true, // Requires HTTPS
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: '/',
};
```

**Critical:**
- [ ] `Secure` flag set (requires HTTPS)
- [ ] `HttpOnly` flag set (prevents XSS)
- [ ] `SameSite` configured (`Lax` or `Strict`)
- [ ] Cookie expiration set appropriately

**Common Failure:**
> "For cross-site cookies, SameSite=None; Secure is required, but developers often forget the Secure flag during localhost development, which works on localhost but fails in production."

**Source:** [How to Fix Cookie Issues in Local Development](https://medium.com/@adarshtz313/how-to-fix-cookie-related-issues-in-local-development-for-beginners-365223cde666)

---

#### 3.3 OWASP Security Checklist

**OWASP Pre-Deployment:**

- [ ] Remove all debugging code
- [ ] Remove test accounts and default credentials
- [ ] No source control metadata (.git folders)
- [ ] Error messages don't leak sensitive info
- [ ] Rate limiting configured
- [ ] CORS policy configured correctly
- [ ] SQL injection protection verified
- [ ] XSS protection verified

**OWASP Recommendation:**
> "Remove all unnecessary functionality such as files, accounts, software, and demo capabilities. Remove test code or any functionality not intended for production, prior to deployment."

**Source:** [OWASP: Configuration and Deployment Management Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/README)

---

### Phase 4: Database

#### 4.1 Database Migrations

```bash
# Test migrations in staging first
npm run migration:up

# Verify schema
npm run migration:status
```

**Checklist:**

- [ ] Migrations tested in staging
- [ ] Migrations are reversible (down migrations)
- [ ] No data loss in migration
- [ ] Database backup created before migration
- [ ] Migration rollback plan documented

**Supabase-Specific:**
> "In a production environment, use a CI/CD pipeline to deploy new migrations with GitHub Actions rather than deploying from your local machine."

**Source:** [Supabase: Managing Environments](https://supabase.com/docs/guides/deployment/managing-environments)

---

#### 4.2 Database Performance

```bash
# Test query performance
npm run test:db-performance
```

**Checklist:**

- [ ] Slow queries identified and optimized
- [ ] Indexes created for frequent queries
- [ ] Connection pooling configured
- [ ] Database version matches staging

---

### Phase 5: Build Verification

#### 5.1 Production Build

```bash
# Create production build
npm run build
```

**Expected Output:**
```
Route (app)                              Size     First Load JS
┌ ○ /                                    142 B          87.3 kB
├ ○ /about                               142 B          87.3 kB
└ ○ /api/admin/auth/login                0 B                0 B
```

**Checklist:**

- [ ] Build completes without errors
- [ ] Build completes without warnings
- [ ] Bundle size is reasonable (< 1MB for critical pages)
- [ ] No unexpected dependencies included

---

#### 5.2 Production Build Local Test

```bash
# Test production build locally
npm run start
```

**Checklist:**

- [ ] Application starts successfully
- [ ] Critical pages load correctly
- [ ] API routes respond correctly
- [ ] Authentication works
- [ ] Database connections work

---

### Phase 6: Preview Environment Testing

#### 6.1 Create Pull Request

```bash
# Create feature branch
git checkout -b feature/your-feature

# Commit changes
git add .
git commit -m "Add your feature"

# Push to GitHub
git push origin feature/your-feature
```

**Vercel Preview Deployment:**
- Vercel automatically creates preview deployment
- Preview URL: `deploy-preview-[pr-number]--yoursite.vercel.app`

**Checklist:**

- [ ] Pull request created
- [ ] Vercel preview deployment succeeded
- [ ] Preview URL accessible

---

#### 6.2 Preview Environment Tests

**Test in Preview Environment:**

**Authentication & Sessions:**
- [ ] Login works
- [ ] Logout works
- [ ] Session persists across page refreshes
- [ ] Session expires after timeout
- [ ] Password reset flow works

**Cookie Behavior:**
- [ ] Cookies set correctly (check DevTools)
- [ ] `Secure` flag present
- [ ] `HttpOnly` flag present
- [ ] `SameSite` attribute correct

**External Integrations:**
- [ ] Webhooks receive events
- [ ] Email sending works (test mode)
- [ ] Payment processing works (test mode)
- [ ] File uploads work

**Performance:**
- [ ] Page load times acceptable
- [ ] API response times acceptable
- [ ] No console errors

**Cross-Browser Testing:**
- [ ] Chrome (desktop)
- [ ] Safari (desktop)
- [ ] Firefox (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (iOS)

**End-to-End Tests:**

```bash
# Run E2E tests against preview URL
PREVIEW_URL=https://deploy-preview-42--yoursite.vercel.app npm run test:e2e
```

- [ ] All E2E tests pass
- [ ] Critical user flows verified

---

#### 6.3 Stakeholder Review

**Share Preview URL with:**
- Product manager
- Designer
- QA team
- Stakeholders

**Checklist:**

- [ ] Stakeholder approval received
- [ ] All feedback addressed
- [ ] No blocking issues

---

### Phase 7: Final Checks

#### 7.1 SEO Metadata

**Verify Metadata:**

```typescript
// app/layout.tsx or app/page.tsx
export const metadata = {
  title: 'Your Page Title',
  description: 'Your page description',
  openGraph: {
    title: 'Your Page Title',
    description: 'Your page description',
    images: ['/og-image.jpg'],
  },
};
```

**Next.js 15 Recommendation:**
> "Use the Metadata API to improve SEO by adding page titles, descriptions, and more."

**Source:** [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)

- [ ] Page titles set
- [ ] Meta descriptions set
- [ ] Open Graph tags set
- [ ] Twitter Card tags set
- [ ] Canonical URLs set

---

#### 7.2 robots.txt

```txt
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
```

- [ ] robots.txt configured
- [ ] Sitemap generated
- [ ] No sensitive routes exposed

---

#### 7.3 Analytics & Monitoring

**Checklist:**

- [ ] Error tracking configured (Sentry, Rollbar)
- [ ] Analytics configured (Google Analytics, Plausible)
- [ ] Performance monitoring configured (Vercel Analytics)
- [ ] Uptime monitoring configured (UptimeRobot, Pingdom)

---

## Deployment Procedure

### Step 1: Merge Pull Request

```bash
# Ensure you're on feature branch
git checkout feature/your-feature

# Pull latest main
git fetch origin
git rebase origin/main

# Resolve any conflicts
# Test after rebase

# Push updated branch
git push origin feature/your-feature --force-with-lease
```

**On GitHub:**
1. Open pull request
2. Ensure all checks pass (CI/CD)
3. Request code review (if not already done)
4. Wait for approval
5. **Merge pull request to main**

**Checklist:**

- [ ] All CI/CD checks pass
- [ ] Code review approved
- [ ] Conflicts resolved
- [ ] Preview environment tested

---

### Step 2: Automatic Production Deployment

**Vercel Automatic Deployment:**

When you merge to `main`:
1. Vercel detects commit
2. Triggers production build
3. Runs build command: `npm run build`
4. Deploys to production
5. Updates DNS to new deployment

**Monitor Deployment:**

1. Go to Vercel dashboard
2. Watch deployment logs
3. Verify build succeeds

**Deployment Time:**
- Typical: 1-3 minutes
- Complex builds: 3-5 minutes

---

### Step 3: Manual Deployment (Alternative)

**If Using Vercel CLI:**

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

**Checklist:**

- [ ] Deployment initiated
- [ ] Build logs monitored
- [ ] Deployment succeeded

---

## Post-Deployment Verification

### Step 1: Smoke Tests (Immediate)

**Critical Path Testing:**

```bash
# Automated smoke tests
npm run test:smoke -- --url=https://example.com
```

**Manual Smoke Tests:**

- [ ] Homepage loads
- [ ] Login page loads
- [ ] Login works with test account
- [ ] API health check: `https://example.com/api/health`
- [ ] Database connectivity verified

**Timeline:** Complete within 5 minutes of deployment

---

### Step 2: Functional Verification (15 minutes)

**Test Critical User Flows:**

1. **User Authentication:**
   - [ ] User can log in
   - [ ] User can log out
   - [ ] Session persists correctly
   - [ ] Password reset works

2. **Core Functionality:**
   - [ ] Questionnaire submission works
   - [ ] Admin dashboard accessible
   - [ ] Data saves correctly
   - [ ] File uploads work (if applicable)

3. **External Integrations:**
   - [ ] Webhooks receiving events
   - [ ] Email notifications sending
   - [ ] Payment processing works (if applicable)

---

### Step 3: Performance Monitoring (30 minutes)

**Monitor Key Metrics:**

```bash
# Vercel Analytics
- Page load times
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
```

**Acceptable Thresholds:**
- LCP: < 2.5s
- FCP: < 1.8s
- TTFB: < 600ms

**Checklist:**

- [ ] Page load times acceptable
- [ ] API response times acceptable
- [ ] No performance regressions
- [ ] Core Web Vitals meet targets

**Source:** [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)

---

### Step 4: Error Monitoring (1 hour)

**Monitor Error Rates:**

**Sentry Dashboard:**
- [ ] Error rate < baseline
- [ ] No new critical errors
- [ ] No new security issues

**Vercel Logs:**
- [ ] No 5xx errors
- [ ] 4xx errors expected (invalid requests)
- [ ] No database connection errors

**Alert Thresholds:**
- Critical: Error rate > 5%
- Warning: Error rate > 1%

---

### Step 5: Database Verification

**Database Health:**

```sql
-- Check recent data
SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '1 hour';

-- Check connections
SELECT count(*) FROM pg_stat_activity;
```

**Checklist:**

- [ ] Database responding normally
- [ ] Connection pool healthy
- [ ] No deadlocks
- [ ] No slow queries

---

### Step 6: Security Verification

**Security Headers:**

```bash
# Check security headers
curl -I https://example.com
```

**Expected Headers:**
```
Content-Security-Policy: ...
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
```

**Checklist:**

- [ ] CSP header present
- [ ] HSTS header present
- [ ] X-Frame-Options present
- [ ] No sensitive data in headers

---

### Step 7: SEO Verification

**Google Search Console:**
- [ ] Sitemap submitted
- [ ] No crawl errors
- [ ] robots.txt accessible

**Meta Tags:**
- [ ] Open Graph tags present
- [ ] Twitter Card tags present
- [ ] Canonical URLs correct

---

## Rollback Procedures

### When to Rollback

**Immediate Rollback Required:**
- Critical functionality broken
- Security vulnerability introduced
- Data loss occurring
- Error rate > 10%
- Payment processing failing

**Consider Rollback:**
- Performance degradation > 50%
- User complaints about critical feature
- Error rate > 5%

---

### Rollback Method 1: Vercel Instant Rollback

**Fastest Method (30 seconds):**

1. Go to Vercel Dashboard
2. Navigate to project
3. Go to "Deployments" tab
4. Find last known good deployment
5. Click "..." menu
6. Click "Promote to Production"
7. Confirm rollback

**Vercel Instant Rollback:**
> "After a swap with production, the slot with a previously staged app now has the previous production app, and if the changes swapped into the production slot aren't as you expect, you can immediately reverse the swap to get your 'last known good instance' back."

**Source:** [Azure App Service: Set Up Staging Environments](https://learn.microsoft.com/en-us/azure/app-service/deploy-staging-slots) (same principle applies)

**Checklist:**

- [ ] Previous deployment identified
- [ ] Rollback initiated
- [ ] DNS updated (automatic)
- [ ] Smoke tests pass on rolled-back version

---

### Rollback Method 2: Git Revert

**If Vercel Rollback Not Available:**

```bash
# Find commit to revert
git log --oneline

# Revert the commit
git revert <commit-hash>

# Push to main (triggers new deployment)
git push origin main
```

**Timeline:** 3-5 minutes (includes build time)

**Checklist:**

- [ ] Commit identified
- [ ] Revert commit created
- [ ] Pushed to main
- [ ] New deployment triggered
- [ ] Deployment succeeded

---

### Rollback Method 3: Database Rollback

**If Database Migration Caused Issue:**

```bash
# Rollback database migration
npm run migration:down

# Verify schema
npm run migration:status
```

**CRITICAL:**
- Have database backup before migration
- Test rollback procedure in staging first

**Checklist:**

- [ ] Database backup confirmed
- [ ] Migration rolled back
- [ ] Schema verified
- [ ] Application tested

---

### Post-Rollback Actions

**After Rollback:**

1. **Notify Stakeholders**
   - Engineering team
   - Product manager
   - Customer support (if user-facing)

2. **Create Incident Report**
   - What went wrong
   - When it was detected
   - Impact on users
   - Rollback actions taken

3. **Root Cause Analysis**
   - Investigate cause
   - Document findings
   - Create prevention plan

4. **Fix and Redeploy**
   - Fix issue locally
   - Test in preview environment
   - Redeploy when ready

---

## Troubleshooting

### Common Deployment Issues

#### Issue 1: Build Fails

**Symptoms:**
- Vercel deployment fails
- Build logs show errors

**Common Causes:**
- TypeScript errors
- Missing environment variables
- Missing dependencies
- Syntax errors

**Solution:**

```bash
# Test build locally
npm run build

# Fix errors
# Commit and push
```

---

#### Issue 2: Environment Variables Not Set

**Symptoms:**
- Application starts but features don't work
- "Missing environment variable" errors

**Solution:**

1. Go to Vercel Dashboard
2. Project Settings → Environment Variables
3. Add missing variables
4. Redeploy

**Vercel Note:**
> "Environment variables can be configured separately for Preview (deployment previews) and Production environments in the project settings."

**Source:** [Managing Next.js Environment Variables](https://www.wisp.blog/blog/managing-nextjs-environment-variables-from-development-to-production-vercel)

---

#### Issue 3: Database Connection Fails

**Symptoms:**
- 500 errors
- "Could not connect to database" errors

**Common Causes:**
- Wrong `DATABASE_URL`
- Database not accessible from Vercel
- Connection pool exhausted

**Solution:**

```bash
# Verify DATABASE_URL in Vercel
# Check database is accessible
# Verify connection pool settings
```

---

#### Issue 4: Authentication Not Working

**Symptoms:**
- Users can't log in
- Sessions not persisting
- Cookies not set

**Common Causes:**
- Wrong JWT secret
- Cookie `Secure` flag without HTTPS
- `SameSite` policy too restrictive

**Solution:**

```typescript
// Verify cookie configuration
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Requires HTTPS
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: '/',
};
```

**Critical:**
> "JWT token generated on staging environment was accepted by production server" - ensure different JWT secrets per environment.

**Source:** [From Staging to Full Admin Control In Prod](https://blog.securitybreached.org/2024/10/22/from-staging-to-full-admin-control-in-prod-a-breakdown-of-critical-authentication-flaws/)

---

#### Issue 5: Performance Issues

**Symptoms:**
- Slow page loads
- Timeouts
- High server load

**Common Causes:**
- Missing database indexes
- N+1 queries
- Large bundle sizes
- No caching

**Solution:**

```bash
# Analyze bundle size
npm run build -- --analyze

# Optimize queries
# Add database indexes
# Implement caching
```

---

## Summary

### Pre-Deployment Checklist Summary

**Code Quality:**
- [ ] TypeScript passes
- [ ] ESLint passes
- [ ] Unit tests pass

**Configuration:**
- [ ] Environment variables set
- [ ] Secrets rotated
- [ ] CSP configured

**Database:**
- [ ] Migrations tested
- [ ] Database backup created

**Build:**
- [ ] Production build succeeds
- [ ] Preview environment tested

**Security:**
- [ ] OWASP checklist complete
- [ ] Cookie security verified

---

### Deployment Steps Summary

1. **Merge PR to main**
2. **Vercel auto-deploys**
3. **Monitor deployment**
4. **Run smoke tests**
5. **Monitor for 1 hour**
6. **Document deployment**

---

### Rollback Plan Summary

1. **Detect issue** (monitoring, alerts)
2. **Decide to rollback** (severity assessment)
3. **Rollback via Vercel** (30 seconds)
4. **Verify rollback** (smoke tests)
5. **Notify stakeholders**
6. **Fix and redeploy**

---

## Additional Resources

- [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Vercel Deployment Documentation](https://vercel.com/docs)
- [OWASP Deployment Security](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/README)
- [Google SRE: Canary Release](https://sre.google/workbook/canarying-releases/)

---

**Document Prepared:** 2025-12-22
**Maintained By:** Engineering Team
**Next Review:** After each deployment
