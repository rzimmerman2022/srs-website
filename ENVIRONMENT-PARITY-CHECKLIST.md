# ENVIRONMENT PARITY CHECKLIST

**Last Updated:** 2025-12-22

This checklist ensures development, staging, and production environments maintain parity to prevent "works on my machine" issues.

---

## Table of Contents

1. [What is Environment Parity?](#what-is-environment-parity)
2. [Parity Checklist by Category](#parity-checklist-by-category)
3. [Configuration Management](#configuration-management)
4. [Secret Management](#secret-management)
5. [Database Parity](#database-parity)
6. [Testing Environment Parity](#testing-environment-parity)
7. [Common Parity Violations](#common-parity-violations)

---

## What is Environment Parity?

### The Twelve-Factor App Definition

> "The twelve-factor app is designed for continuous deployment by keeping the gap between development and production small. Minimize differences between development and production environments."

**Source:** [The Twelve-Factor App: Dev/Prod Parity](https://12factor.net/dev-prod-parity)

### Three Gaps to Minimize

1. **Time Gap**
   - ❌ Bad: Code takes weeks/months to deploy
   - ✅ Good: Code deploys hours/days after commit

2. **Personnel Gap**
   - ❌ Bad: Developers write code, ops deploy it
   - ✅ Good: Developers deploy their own code

3. **Tools Gap**
   - ❌ Bad: SQLite in dev, PostgreSQL in production
   - ✅ Good: PostgreSQL in all environments

### Why Environment Parity Matters

> "Differences between backing services mean that tiny incompatibilities crop up, causing code that worked and passed tests in development or staging to fail in production."

**Statistics:**
- Environment drift is the primary source of bugs undiscoverable during local development
- 96% of organizations struggle with secrets sprawl
- Configuration drift causes testing discrepancies and missed bugs

**Sources:**
- [The Twelve-Factor App: Dev/Prod Parity](https://12factor.net/dev-prod-parity)
- [Environment Parity Testing - LoadFocus](https://loadfocus.com/templates/environment-testing-for-development-staging-and-production-parity)

---

## Parity Checklist by Category

### 1. Application Runtime

| Component | Local | Staging | Production | Status |
|-----------|-------|---------|------------|--------|
| Node.js version | | | | ☐ |
| Package manager (npm/pnpm/yarn) | | | | ☐ |
| Runtime environment (Node/Edge) | | | | ☐ |
| Process manager | | | | ☐ |
| Environment variables format | | | | ☐ |

**Validation:**
```bash
# Check Node.js version
node --version

# Check package manager
npm --version

# Verify environment variables loaded
node -e "console.log(process.env.DATABASE_URL ? 'Set' : 'Missing')"
```

**Best Practice:**
- Use `.nvmrc` to lock Node.js version
- Specify `engines` in `package.json`
- Use same package manager in all environments

```json
// package.json
{
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
```

---

### 2. Database

| Component | Local | Staging | Production | Status |
|-----------|-------|---------|------------|--------|
| Database engine (PostgreSQL) | | | | ☐ |
| Database version | | | | ☐ |
| Connection pooling | | | | ☐ |
| Schema/migrations | | | | ☐ |
| Indexes | | | | ☐ |
| Constraints | | | | ☐ |
| Extensions | | | | ☐ |

**Validation:**
```sql
-- Check PostgreSQL version
SELECT version();

-- Check installed extensions
SELECT * FROM pg_extension;

-- Verify schema matches
\d+ table_name
```

**Anti-Pattern to Avoid:**
```
❌ Local: SQLite
✅ Staging: PostgreSQL 16
✅ Production: PostgreSQL 16
```

**Twelve-Factor App Warning:**
> "Using SQLite locally and PostgreSQL in production; or local process memory for caching in development and Memcached in production are practices that twelve-factor apps discourage."

**Best Practice:**
- Use Docker to run PostgreSQL locally
- Match major and minor versions
- Use same connection pooling library

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: myapp_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
```

**Supabase-Specific:**
- Use Supabase CLI for local development
- Test migrations in staging before production
- Use branching feature for PR-based testing

**Source:** [Supabase: Managing Environments](https://supabase.com/docs/guides/deployment/managing-environments)

---

### 3. Caching Layer

| Component | Local | Staging | Production | Status |
|-----------|-------|---------|------------|--------|
| Cache engine (Redis/Memcached) | | | | ☐ |
| Cache version | | | | ☐ |
| Cache configuration | | | | ☐ |
| TTL policies | | | | ☐ |

**Anti-Pattern to Avoid:**
```
❌ Local: In-memory cache
✅ Staging: Redis
✅ Production: Redis
```

**Best Practice:**
```yaml
# docker-compose.yml
services:
  redis:
    image: redis:7
    ports:
      - "6379:6379"
```

---

### 4. Web Server & Hosting

| Component | Local | Staging | Production | Status |
|-----------|-------|---------|------------|--------|
| Protocol (HTTP/HTTPS) | | | | ☐ |
| Port configuration | | | | ☐ |
| SSL/TLS certificates | | | | ☐ |
| Headers (CORS, CSP) | | | | ☐ |
| Compression (gzip/brotli) | | | | ☐ |

**Critical Difference: HTTP vs. HTTPS**

**Localhost (HTTP):**
- http://localhost:3000
- Browsers give special exemptions
- `Secure` cookies work (special case)
- Service Workers work (special case)

**Production (HTTPS):**
- https://example.com
- Strict security enforcement
- `Secure` cookies required for HTTPS
- Service Workers require HTTPS

**Problem:**
> "This special localhost treatment creates a false sense of security. Code that works on localhost may fail in production."

**Solution:**
Use HTTPS locally with mkcert:

```bash
# Install mkcert
brew install mkcert

# Create local CA
mkcert -install

# Generate certificate
mkcert localhost 127.0.0.1 ::1

# Use in Next.js
next dev --experimental-https
```

**Source:** [When to Use HTTPS for Local Development](https://web.dev/articles/when-to-use-local-https)

---

### 5. Environment Variables

| Category | Local | Staging | Production | Status |
|----------|-------|---------|------------|--------|
| Database URL | | | | ☐ |
| API keys | | | | ☐ |
| JWT secret | | | | ☐ |
| OAuth credentials | | | | ☐ |
| Email service | | | | ☐ |
| Payment provider | | | | ☐ |
| Logging level | | | | ☐ |
| Feature flags | | | | ☐ |

**Best Practice: Different Values, Same Keys**

```bash
# .env.local (Local)
DATABASE_URL=postgresql://localhost:5432/dev
JWT_SECRET=local-dev-secret-not-for-prod
STRIPE_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:3000

# .env.staging (Staging)
DATABASE_URL=postgresql://staging-db.supabase.co:5432/staging
JWT_SECRET=staging-secret-different-from-prod
STRIPE_KEY=sk_test_...
NEXT_PUBLIC_API_URL=https://staging.example.com

# .env.production (Production)
DATABASE_URL=postgresql://prod-db.supabase.co:5432/prod
JWT_SECRET=production-secret-highly-secure
STRIPE_KEY=sk_live_...
NEXT_PUBLIC_API_URL=https://example.com
```

**Validation Script:**

```javascript
// scripts/validate-env.js
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'NEXT_PUBLIC_API_URL',
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

console.log('✅ All required environment variables are set');
```

**Run on startup:**

```json
// package.json
{
  "scripts": {
    "dev": "node scripts/validate-env.js && next dev",
    "build": "node scripts/validate-env.js && next build",
    "start": "node scripts/validate-env.js && next start"
  }
}
```

---

### 6. Dependencies & Packages

| Component | Local | Staging | Production | Status |
|-----------|-------|---------|------------|--------|
| Package versions (package.json) | | | | ☐ |
| Lock file (package-lock.json) | | | | ☐ |
| System dependencies | | | | ☐ |
| Build tools | | | | ☐ |

**Best Practice:**

✅ **DO:**
- Commit `package-lock.json` or `pnpm-lock.yaml`
- Use exact versions for critical packages
- Use `npm ci` in CI/CD (not `npm install`)

❌ **DON'T:**
- Use different package managers (npm vs. pnpm vs. yarn)
- Allow floating versions (`^` or `~`) for critical dependencies
- Manually edit lock files

**Validation:**

```bash
# Check for dependency mismatches
npm ls

# Audit for vulnerabilities
npm audit

# Check for outdated packages
npm outdated
```

---

### 7. Build Process

| Component | Local | Staging | Production | Status |
|-----------|-------|---------|------------|--------|
| Build command | | | | ☐ |
| Build output | | | | ☐ |
| Minification | | | | ☐ |
| Source maps | | | | ☐ |
| Environment injection | | | | ☐ |

**Development vs. Production Build:**

```bash
# Local (Development)
npm run dev
- Unminified code
- Source maps included
- Debug logging enabled
- Hot module reloading
- Fast refresh

# Staging & Production (Production Build)
npm run build && npm start
- Minified and compressed
- No source maps (or external)
- Debug logging disabled
- Optimized assets
- Static generation
```

**Test Production Build Locally:**

```json
// package.json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "test:prod-build": "npm run build && npm start"
  }
}
```

---

### 8. Logging & Monitoring

| Component | Local | Staging | Production | Status |
|-----------|-------|---------|------------|--------|
| Log level | | | | ☐ |
| Log format | | | | ☐ |
| Log destination | | | | ☐ |
| Error tracking | | | | ☐ |
| APM tool | | | | ☐ |

**Best Practice:**

```javascript
// lib/logger.js
const LOG_LEVELS = {
  local: 'debug',
  staging: 'info',
  production: 'warn',
};

const logLevel = LOG_LEVELS[process.env.NODE_ENV] || 'info';

export const logger = {
  debug: (msg) => logLevel === 'debug' && console.debug(msg),
  info: (msg) => ['debug', 'info'].includes(logLevel) && console.info(msg),
  warn: (msg) => console.warn(msg),
  error: (msg) => console.error(msg),
};
```

---

### 9. External Services

| Service | Local | Staging | Production | Status |
|---------|-------|---------|------------|--------|
| Email provider | | | | ☐ |
| Payment processor | | | | ☐ |
| SMS provider | | | | ☐ |
| Storage (S3/Blob) | | | | ☐ |
| CDN | | | | ☐ |

**Best Practice: Use Test Mode**

```bash
# Local
STRIPE_KEY=sk_test_...
SENDGRID_API_KEY=test_key

# Staging (still test mode)
STRIPE_KEY=sk_test_...
SENDGRID_API_KEY=test_key

# Production (live mode)
STRIPE_KEY=sk_live_...
SENDGRID_API_KEY=live_key
```

**Stripe-Specific:**
> "Your Stripe account can have both test and live webhook endpoints, so make sure you've defined live endpoints and confirm that the live endpoint functions exactly the same as your test endpoint."

**Source:** [Stripe Go-Live Checklist](https://stripe.com/docs/development/checklist)

---

### 10. Security Configuration

| Component | Local | Staging | Production | Status |
|-----------|-------|---------|------------|--------|
| CORS policy | | | | ☐ |
| CSP headers | | | | ☐ |
| Rate limiting | | | | ☐ |
| Cookie security (Secure, SameSite) | | | | ☐ |
| HTTPS enforcement | | | | ☐ |
| Secrets rotation | | | | ☐ |

**Cookie Configuration:**

```javascript
// ❌ BAD: Different cookie config per environment
// Local
res.setHeader('Set-Cookie', 'session=abc; SameSite=Lax; HttpOnly');

// Production
res.setHeader('Set-Cookie', 'session=abc; SameSite=None; Secure; HttpOnly');

// ✅ GOOD: Same cookie config (use HTTPS locally)
// All environments
res.setHeader('Set-Cookie', 'session=abc; SameSite=None; Secure; HttpOnly');
```

**OWASP Recommendation:**
> "Handle server errors (40x or 50x) with custom-made pages instead of with the default web server pages. Specifically make sure that any application errors will not be returned to the end user."

**Source:** [OWASP: Configuration and Deployment Management Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/README)

---

## Configuration Management

### Infrastructure as Code (IaC)

**Benefits:**
- Version-controlled infrastructure
- Reproducible environments
- Automated provisioning
- Documented configuration

**Tools:**
- Terraform
- Pulumi
- AWS CDK
- Vercel/Netlify config files

**Example: vercel.json**

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "framework": "nextjs",
  "env": {
    "DATABASE_URL": "@database-url"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "https://api.example.com"
    }
  }
}
```

---

### Environment-Specific Configuration

**Pattern: Config Files per Environment**

```
/config
  ├── local.ts
  ├── staging.ts
  └── production.ts
```

```typescript
// config/index.ts
const configs = {
  local: () => import('./local'),
  staging: () => import('./staging'),
  production: () => import('./production'),
};

const env = process.env.NODE_ENV || 'local';
export const config = await configs[env]();
```

---

### Validation & Drift Detection

**Automated Drift Detection:**

```javascript
// scripts/check-env-parity.js
const fs = require('fs');

const localEnv = fs.readFileSync('.env.local', 'utf-8');
const stagingEnv = fs.readFileSync('.env.staging', 'utf-8');

const localKeys = localEnv.match(/^[A-Z_]+=/gm).map(k => k.replace('=', ''));
const stagingKeys = stagingEnv.match(/^[A-Z_]+=/gm).map(k => k.replace('=', ''));

const missing = localKeys.filter(k => !stagingKeys.includes(k));
if (missing.length) {
  console.error('❌ Environment variable mismatch:', missing);
  process.exit(1);
}
console.log('✅ Environment variables match');
```

---

## Secret Management

### Best Practices

**OWASP Secure Deployment:**
> "The practice focuses on protecting the privacy and integrity of sensitive data, such as passwords, tokens, and other secrets, required for applications to operate in production environments. In its simplest form, suitable production secrets are moved from repositories and configuration files into adequately managed digital vaults."

**Source:** [OWASP: Secure Deployment](https://owaspsamm.org/model/implementation/secure-deployment/)

### Secret Management Tools

| Environment | Secret Storage |
|-------------|----------------|
| Local | `.env.local` (gitignored) |
| Staging | Vercel/Netlify environment variables |
| Production | Vercel/Netlify environment variables |

**Never Commit Secrets:**

```bash
# .gitignore
.env
.env.local
.env.staging
.env.production
.env*.local
```

**Rotate Secrets Regularly:**

**Stripe Recommendation:**
> "Rotate your API keys on a regular basis, and also rotate them immediately before going live in case they've been saved somewhere outside of your codebase during development."

**Source:** [Stripe Go-Live Checklist](https://stripe.com/docs/development/checklist)

---

### Environment-Specific Secrets

**Pattern: Different Values, Same Keys**

```bash
# All environments have JWT_SECRET
# But values are different

# Local
JWT_SECRET=local-dev-secret

# Staging
JWT_SECRET=staging-secret-abc123

# Production
JWT_SECRET=prod-secret-xyz789-highly-secure
```

**Validation on Startup:**

```typescript
// lib/validate-secrets.ts
const requiredSecrets = [
  'DATABASE_URL',
  'JWT_SECRET',
  'STRIPE_KEY',
];

export function validateSecrets() {
  const missing = requiredSecrets.filter(
    (secret) => !process.env[secret]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required secrets: ${missing.join(', ')}`
    );
  }
}
```

---

## Database Parity

### Schema Parity

**Best Practice:**

✅ **DO:**
- Use migration files (never manual schema changes)
- Test migrations in staging first
- Keep same schema across all environments
- Use same indexes and constraints

❌ **DON'T:**
- Manually create tables in production
- Skip migrations in any environment
- Have different schemas in staging vs. production

**Migration Workflow:**

```bash
# 1. Create migration locally
npm run migration:create add_user_roles

# 2. Test migration locally
npm run migration:up

# 3. Commit migration file
git add migrations/
git commit -m "Add user roles migration"

# 4. Deploy to staging
# CI/CD runs migrations automatically

# 5. Test in staging
# Verify schema changes

# 6. Deploy to production
# CI/CD runs migrations automatically
```

---

### Data Parity (Test Data)

**Best Practice:**

✅ **DO:**
- Use data subsetting (representative sample)
- Anonymize production data for staging
- Use realistic data volumes
- Test with production-scale data

❌ **DON'T:**
- Copy production data to local (privacy violation)
- Use tiny datasets (100 rows vs. 1M rows)
- Use fake data that doesn't represent real usage

**Data Anonymization:**

```sql
-- Create staging data from production
INSERT INTO staging.users (id, email, name, created_at)
SELECT
  id,
  'user_' || id || '@example.com' AS email,
  'Test User ' || id AS name,
  created_at
FROM production.users
WHERE created_at > NOW() - INTERVAL '6 months';
```

**Source:** [Test Data Management Best Practices](https://accelario.com/blog/test-data-management-best-practices/)

---

### Supabase-Specific: Environment Strategy

**Recommended Approach:**

**Option 1: Separate Projects**
- Local: Supabase CLI (local Supabase)
- Staging: Separate Supabase project
- Production: Separate Supabase project

**Option 2: Branching (Recommended)**
- Local: Supabase CLI (local Supabase)
- Staging: Persistent branch on production project
- Production: Production project

**Benefits of Branching:**
> "You can set up a persistent branch as your staging environment, which behaves like a separate project with the benefit that database changes are automatically promoted to production when you merge a PR from staging to prod."

**Source:** [Supabase: Managing Environments](https://supabase.com/docs/guides/deployment/managing-environments)

---

## Testing Environment Parity

### Parity Testing Checklist

**Before Deploying to Production:**

- [ ] Same Node.js version in all environments
- [ ] Same database engine and version
- [ ] Same dependency versions (lock file)
- [ ] Same environment variables (keys, not values)
- [ ] HTTPS configured in staging
- [ ] Same cookie configuration
- [ ] Same CORS policy
- [ ] Same security headers
- [ ] Production build tested in staging
- [ ] Database migrations tested in staging
- [ ] External integrations tested in staging
- [ ] Performance tested with production-scale data
- [ ] Cross-browser testing completed
- [ ] E2E tests pass in staging

---

### Automated Parity Testing

**CI/CD Pipeline:**

```yaml
# .github/workflows/test.yml
name: Test Environment Parity

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: test
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Validate environment variables
        run: node scripts/validate-env.js

      - name: Run tests
        run: npm test

      - name: Build production
        run: npm run build
```

---

## Common Parity Violations

### 1. Database Engine Mismatch

**Violation:**
```
Local: SQLite
Staging: PostgreSQL
Production: PostgreSQL
```

**Impact:**
- Different SQL dialects
- Query behavior differences
- Data type differences
- Performance characteristics

**Solution:**
- Use Docker to run PostgreSQL locally
- Use Supabase CLI for local Supabase

---

### 2. HTTP vs. HTTPS Mismatch

**Violation:**
```
Local: http://localhost:3000
Staging: https://staging.example.com
Production: https://example.com
```

**Impact:**
- Cookie behavior differences
- Service Worker limitations
- Security context differences
- Mixed content issues

**Solution:**
- Use mkcert for local HTTPS
- Test in staging with HTTPS

---

### 3. Environment Variable Mismatch

**Violation:**
```
# Local has variables that staging doesn't
Local: DATABASE_URL, JWT_SECRET, API_KEY, DEBUG_MODE
Staging: DATABASE_URL, JWT_SECRET
```

**Impact:**
- Runtime errors in staging
- Missing configuration
- Silent failures

**Solution:**
- Validate environment variables on startup
- Use same keys in all environments
- Document all required variables

---

### 4. Dependency Version Mismatch

**Violation:**
```
Local: npm install (floating versions)
Staging: npm ci (lock file)
Production: npm ci (different lock file)
```

**Impact:**
- Subtle behavior differences
- Breaking changes in minor versions
- Hard-to-reproduce bugs

**Solution:**
- Always commit lock file
- Use `npm ci` in all environments
- Use exact versions for critical dependencies

---

### 5. Configuration Drift

**Violation:**
- Manual changes to staging environment
- Undocumented configuration changes
- Different security headers
- Different rate limiting

**Impact:**
> "Configuration drift, where staging environments diverge from production setups, can cause testing discrepancies, missed bugs, making production more vulnerable to threats and outages."

**Source:** [Securing Staging Environments Best Practices](https://entro.security/blog/securing-staging-environments-best-practices/)

**Solution:**
- Use infrastructure as code
- Automated drift detection
- Regular audits

---

## Summary

### Parity Principles

1. **Same Tools Everywhere**
   - Same database engine
   - Same caching layer
   - Same runtime environment

2. **Same Configuration Structure**
   - Same environment variables (different values)
   - Same build process
   - Same deployment process

3. **Same Testing Approach**
   - Test migrations in staging
   - Test production build in staging
   - Test external integrations in staging

4. **Different Values, Same Structure**
   - Different secrets
   - Different database URLs
   - Different API keys
   - But same variable names

### The Twelve-Factor App Summary

> "The twelve-factor app's dependencies are explicitly declared and isolated from the surrounding system. Dev/prod parity ensures that developers and operations work together closely, and the gap between development and production is kept small."

**Source:** [The Twelve-Factor App](https://12factor.net/)

---

## Additional Resources

- [The Twelve-Factor App: Dev/Prod Parity](https://12factor.net/dev-prod-parity)
- [OWASP: Configuration and Deployment Management Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/README)
- [Environment Parity Testing - LoadFocus](https://loadfocus.com/templates/environment-testing-for-development-staging-and-production-parity)
- [Supabase: Managing Environments](https://supabase.com/docs/guides/deployment/managing-environments)

---

**Document Prepared:** 2025-12-22
**All sources cited inline with hyperlinks**
