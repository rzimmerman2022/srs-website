# SEO, GEO & Local SEO Standard Operating Procedure

**Southwest Resume Services**
**Version:** 1.1
**Last Updated:** 2025-12-23
**Document Owner:** Ryan Zimmerman

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [NAP Consistency Standards](#2-nap-consistency-standards)
3. [Technical SEO Requirements](#3-technical-seo-requirements)
4. [On-Page SEO Standards](#4-on-page-seo-standards)
5. [Schema.org Structured Data](#5-schemaorg-structured-data)
6. [Local SEO Optimization](#6-local-seo-optimization)
7. [GEO (Generative Engine Optimization)](#7-geo-generative-engine-optimization)
8. [Citation Building Protocol](#8-citation-building-protocol)
9. [Google Business Profile Management](#9-google-business-profile-management)
10. [Testing & Verification Procedures](#10-testing--verification-procedures)
11. [Maintenance Schedule](#11-maintenance-schedule)
12. [Appendices](#12-appendices)

---

## 1. Executive Summary

### Purpose

This SOP establishes standards for Search Engine Optimization (SEO), Generative Engine Optimization (GEO), and Local SEO for Southwest Resume Services. It ensures consistent implementation across all digital properties and maximizes discoverability in both traditional search engines and AI-powered search systems.

### Scope

- Website: southwestresumes.com
- Google Business Profile
- Citation directories (40+)
- AI/LLM discoverability (ChatGPT, Claude, Perplexity, Google AI Overviews)

### Key Metrics

| Metric | Baseline | Current | Target |
|--------|----------|---------|--------|
| SEO Score | 62 | 85 | 90+ |
| GEO Score | 62 | 82 | 90+ |
| Local SEO | Moderate | Strong | Excellent |
| NAP Consistency | Variable | 100% | 100% |

### Research Sources

This SOP is based on:
- [SEO.ai - NAP Consistency Tips](https://seo.ai/blog/nap-consistency-seo)
- [Local Falcon - NAP in Local SEO](https://www.localfalcon.com/blog/what-is-nap-consistency-in-local-seo)
- [Google Business Profile Guidelines](https://support.google.com/business/answer/3038177)
- Princeton/Georgia Tech GEO Research (2024)
- BrightLocal Local SEO Studies
- Google Search Central Documentation

---

## 2. NAP Consistency Standards

### 2.1 Canonical NAP Format

**CRITICAL:** Use this exact format everywhere. No variations.

| Field | Canonical Value |
|-------|-----------------|
| **Business Name** | Southwest Resume Services |
| **Street Address** | 1111 N Mission Park Blvd #2016 |
| **City, State ZIP** | Chandler, AZ 85224 |
| **Phone (Display)** | (480) 374-3418 |
| **Phone (Schema/tel:)** | +1-480-374-3418 |
| **Email** | info@southwestresumes.com |
| **Website** | https://southwestresumes.com |

### 2.2 Formatting Rules

#### Business Name
- Always: `Southwest Resume Services`
- Never: `SRS`, `Southwest Resumes`, `S.R.S.`, `Southwest Resume Service` (singular)
- Legal entity: `Southwest Resume Services, LLC` (only in legal contexts)

#### Address Components
| Component | Correct | Incorrect |
|-----------|---------|-----------|
| Direction | `N` | `North`, `No.` |
| Street Type | `Blvd` | `Boulevard`, `Blv` |
| Suite | `#2016` | `Suite 2016`, `Ste 2016`, `Unit 2016` |
| State | `AZ` | `Arizona`, `Az` |
| ZIP | `85224` | Must always include |

#### Phone Number Formats
| Context | Format | Example |
|---------|--------|---------|
| Website display | US parentheses | (480) 374-3418 |
| HTML `tel:` href | E.164 with dashes | +1-480-374-3418 |
| Schema.org markup | E.164 with dashes | +1-480-374-3418 |
| Citation directories | US parentheses | (480) 374-3418 |
| International contexts | Full E.164 | +14803743418 |

### 2.3 Why NAP Consistency Matters

Per BrightLocal research:
- Businesses with consistent NAP are **40% more likely** to appear in local pack
- Inconsistent NAP creates duplicate listings, splitting ranking signals
- Search engines use NAP as a trust signal for entity verification
- AI/LLM systems aggregate NAP from multiple sources—consistency increases citation confidence

### 2.4 NAP Audit Checklist

Before any citation submission:

- [ ] Business name matches exactly: `Southwest Resume Services`
- [ ] Street uses correct abbreviations: `N`, `Blvd`, `#2016`
- [ ] City/State/ZIP correct: `Chandler, AZ 85224`
- [ ] Phone uses parentheses format: `(480) 374-3418`
- [ ] No extra spaces, punctuation, or formatting
- [ ] Website URL is `https://southwestresumes.com` (not `www.`)

---

## 3. Technical SEO Requirements

### 3.1 Site Architecture

```
southwestresumes.com/
├── / (homepage)
├── /services
├── /process
├── /methodology
├── /about
├── /results
├── /faq
├── /contact
├── /privacy
├── /terms
├── /sitemap.xml
├── /robots.txt
└── /llms.txt
```

### 3.2 Required Technical Files

#### robots.txt
```
# robots.txt for Southwest Resume Services
User-agent: *
Allow: /

# Block private client content
Disallow: /discovery/
Disallow: /api/

# Sitemap location
Sitemap: https://southwestresumes.com/sitemap.xml
```

#### sitemap.xml
- Dynamic generation via Next.js `app/sitemap.ts`
- Includes all public pages with priorities and lastModified dates
- Submitted to Google Search Console and Bing Webmaster Tools

#### llms.txt
- AI crawler information file (see Section 7.3)
- Contains complete business information, methodology, pricing
- Located at `/public/llms.txt`

### 3.3 Performance Requirements

| Metric | Target | Measurement Tool |
|--------|--------|------------------|
| LCP (Largest Contentful Paint) | ≤2.5s | Google PageSpeed Insights |
| INP (Interaction to Next Paint) | ≤200ms | Chrome DevTools |
| CLS (Cumulative Layout Shift) | ≤0.1 | Lighthouse |
| Mobile Score | 90+ | PageSpeed Insights |
| Desktop Score | 95+ | PageSpeed Insights |

### 3.4 Image Optimization

| Image Type | Max Size | Format | Dimensions |
|------------|----------|--------|------------|
| Hero images | 200KB | WebP/AVIF | 2x retina |
| Content images | 100KB | WebP | 2x retina |
| Team photos | 50KB | WebP | 300x300px |
| Logo | 60KB | PNG | Multiple sizes |
| OG Image | 300KB | JPG | 1200x630px |

### 3.5 Security & HTTPS

- All pages served over HTTPS
- HSTS headers enabled
- Secure cookies for any session data
- CSP headers configured

---

## 4. On-Page SEO Standards

### 4.1 Title Tag Formula

**Format:** `Primary Keyword | Secondary Keyword | Brand`

| Page | Title |
|------|-------|
| Home | Phoenix Resume Writing Services \| Arizona Career Coach \| Southwest Resume Services |
| Services | Services & Pricing \| Phoenix Resume Writing \| Arizona Career Coaching |
| About | About Us \| Phoenix Resume Writers \| Southwest Resume Services |
| Contact | Contact Us \| Phoenix Resume Writing Services \| Arizona Career Coach |
| FAQ | FAQ \| Resume Writing Questions \| Southwest Resume Services |
| Process | Our Process \| Research-Backed Methodology \| Southwest Resume Services |

**Rules:**
- 50-60 characters maximum
- Primary keyword first
- Include location (Phoenix/Arizona) where relevant
- Brand name last

### 4.2 Meta Description Formula

**Format:** Action-oriented summary with location + value proposition + CTA

**Example:**
```
Professional resume writing services in Phoenix, AZ. Expert career coaching
serving Scottsdale, Mesa, Tempe, and the Phoenix metro area. Research-backed
career documents that help you own your professional story.
```

**Rules:**
- 150-160 characters maximum
- Include primary keyword naturally
- Include location for local pages
- End with implied or explicit CTA

### 4.3 Heading Hierarchy

```html
<h1>One per page - Primary topic</h1>
  <h2>Section headings</h2>
    <h3>Subsection headings</h3>
      <h4>Detailed points</h4>
```

**Rules:**
- Only ONE `<h1>` per page
- Logical hierarchy (never skip levels)
- Include keywords naturally
- Use semantic HTML

### 4.4 Content Requirements

| Element | Requirement |
|---------|-------------|
| Word count | 500-2000 words per page minimum |
| Keyword density | 1-2% for primary keyword |
| Internal links | 3-5 per page to related content |
| External links | 1-2 to authoritative sources (if relevant) |
| Images | Alt text with keywords, descriptive filenames |
| Lists | Use for scannable content |
| Headers | Break content every 300-400 words |

### 4.5 Local Keyword Integration

Include these terms naturally throughout content:

**Primary (High Priority):**
- Phoenix resume writing
- Arizona career coach
- Phoenix resume services
- Resume writer Phoenix AZ

**Secondary (Medium Priority):**
- Scottsdale resume services
- Mesa career coaching
- Tempe resume writer
- Chandler career services
- Phoenix metro resume

**Long-tail:**
- Professional resume writing services Phoenix Arizona
- Executive resume writer Phoenix AZ
- Career transition coach Scottsdale
- LinkedIn optimization Phoenix

---

## 5. Schema.org Structured Data

### 5.1 Required Schema Types

| Schema Type | Location | Purpose |
|-------------|----------|---------|
| LocalBusiness/ProfessionalService | layout.tsx | Site-wide business info |
| BreadcrumbList | layout.tsx | Site navigation structure |
| Service (6 instances) | services/page.tsx | Individual service offerings |
| HowTo | process/page.tsx | 10-step process |
| FAQPage | faq/page.tsx | FAQ content |

### 5.2 LocalBusiness Schema Template

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Southwest Resume Services",
  "alternateName": "Southwest Resume Services, LLC",
  "description": "Professional resume writing, LinkedIn optimization, and career coaching services in Arizona.",
  "url": "https://southwestresumes.com",
  "telephone": "+1-480-374-3418",
  "email": "info@southwestresumes.com",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1111 N Mission Park Blvd #2016",
    "addressLocality": "Chandler",
    "addressRegion": "AZ",
    "postalCode": "85224",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 33.3062,
    "longitude": -111.8413
  },
  "areaServed": [
    {"@type": "City", "name": "Phoenix"},
    {"@type": "City", "name": "Scottsdale"},
    {"@type": "City", "name": "Mesa"},
    {"@type": "City", "name": "Tempe"},
    {"@type": "City", "name": "Chandler"},
    {"@type": "State", "name": "Arizona"},
    {"@type": "Country", "name": "United States"}
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "3",
    "bestRating": "5",
    "worstRating": "1"
  },
  "founder": {
    "@type": "Person",
    "name": "Ryan Zimmerman",
    "jobTitle": "Founder & Principal Consultant"
  }
}
```

### 5.3 Service Schema Template

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Resume Writing Services",
  "description": "Professional resume writing with in-depth discovery, market research, and ATS optimization.",
  "provider": {
    "@type": "ProfessionalService",
    "name": "Southwest Resume Services",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1111 N Mission Park Blvd #2016",
      "addressLocality": "Chandler",
      "addressRegion": "AZ",
      "postalCode": "85224",
      "addressCountry": "US"
    },
    "telephone": "+1-480-374-3418"
  },
  "areaServed": [
    {"@type": "City", "name": "Phoenix"},
    {"@type": "City", "name": "Scottsdale"},
    {"@type": "City", "name": "Mesa"},
    {"@type": "City", "name": "Tempe"},
    {"@type": "City", "name": "Chandler"},
    {"@type": "State", "name": "Arizona"}
  ],
  "offers": {
    "@type": "Offer",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "minPrice": "150",
      "maxPrice": "500",
      "priceCurrency": "USD"
    }
  }
}
```

### 5.4 Schema Validation

**Tools:**
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

**Validation Checklist:**
- [ ] All required properties present
- [ ] No errors in Rich Results Test
- [ ] Address matches canonical NAP exactly
- [ ] Phone in E.164 format with dashes
- [ ] Valid JSON-LD syntax

---

## 6. Local SEO Optimization

### 6.1 Service Area Definition

**Headquarters:** Chandler, AZ 85224

**Primary Service Areas:**
| City | Priority | Distance |
|------|----------|----------|
| Chandler | HQ | 0 mi |
| Phoenix | Primary | 20 mi |
| Scottsdale | Primary | 15 mi |
| Mesa | Primary | 10 mi |
| Tempe | Primary | 8 mi |
| Gilbert | Secondary | 12 mi |
| Glendale | Secondary | 30 mi |

**Service Radius:** 50 miles (Phoenix metro) + Nationwide (remote services)

### 6.2 Geographic Coordinates

| Location | Latitude | Longitude |
|----------|----------|-----------|
| Business Address | 33.3062 | -111.8413 |
| Phoenix Metro Center | 33.4484 | -112.0740 |

### 6.3 Local Content Strategy

Each page should include where appropriate:
- City/region mentions in first 100 words
- Arizona industry context (tech sector, healthcare, etc.)
- Local landmarks or cultural references
- "Serving [City List]" statements

**Example Integration:**
> "Based in Chandler, Arizona, Southwest Resume Services brings Southwest values of authenticity and straight talk to career services. We serve professionals throughout the Phoenix metro area, including Scottsdale, Mesa, Tempe, and the greater Arizona region."

### 6.4 Local Link Building Opportunities

| Type | Examples | Priority |
|------|----------|----------|
| Chambers of Commerce | Chandler, Phoenix, Scottsdale | High |
| Business Associations | Arizona Small Business Association | High |
| Local Directories | AZ Central, Phoenix Business Journal | Medium |
| Industry Associations | PARW/CC, NRWA | High |
| University Career Centers | ASU, GCU, U of A | Medium |

---

## 7. GEO (Generative Engine Optimization)

### 7.1 What is GEO?

**Generative Engine Optimization (GEO)** is the practice of optimizing content for AI-powered search systems that generate responses rather than just listing links.

**Affected Platforms:**
- ChatGPT (OpenAI)
- Claude (Anthropic)
- Perplexity AI
- Google AI Overviews (SGE)
- Bing Copilot
- Apple Intelligence

### 7.2 GEO Optimization Strategies

Based on Princeton/Georgia Tech research (2024):

| Strategy | Visibility Improvement | Priority |
|----------|------------------------|----------|
| Cite authoritative sources | +40% | Critical |
| Add statistics/data | +30% | High |
| Include quotations | +25% | High |
| Use clear structure | +20% | High |
| Define unique concepts | +15% | Medium |
| Answer questions directly | +15% | Medium |

### 7.3 llms.txt Implementation

Located at: `staging/public/llms.txt`

**Purpose:** Provide structured information for AI crawlers (similar to robots.txt)

**Required Sections:**
1. About the business
2. Core differentiators (Client Truth Principle, RAI, etc.)
3. Services and pricing
4. Methodology (10-phase process)
5. Team information
6. Contact information with full NAP
7. Common questions answered (FAQ format)
8. Unique frameworks and concepts
9. SEO/GEO keywords

### 7.4 E-E-A-T Signals for GEO

**Experience:**
- Case studies with real client outcomes
- Specific methodology details (200+ postings analyzed)
- Process documentation

**Expertise:**
- Founder credentials and background
- Industry certifications (PARW/CC, NRWA)
- Research methodology references (O*NET, BLS)

**Authoritativeness:**
- Citations from authoritative sources
- Client testimonials with specific outcomes
- Industry awards or recognition

**Trustworthiness:**
- Clear contact information
- Privacy policy and terms
- Professional presentation
- Consistent NAP across all platforms

### 7.5 GEO-Optimized Content Patterns

**Pattern 1: Question-Answer Format**
```
### What is the Client Truth Principle?
"A resume you can't own performs like fiction when it matters most."
This means we ensure every enhancement feels authentically true to you
and that you can defend it confidently in interviews.
```

**Pattern 2: Statistic Integration**
```
Our Accelerator package analyzes 200+ job postings per engagement,
validating every claim against O*NET (rated 10/10 for authority)
and BLS data for salary benchmarking.
```

**Pattern 3: Source Citation**
```
According to O*NET (the federal occupational database maintained by
the Department of Labor), this role requires...
```

### 7.6 GEO Testing Queries

Weekly test these queries to measure AI citation visibility:

**Branded Queries:**
1. "What is Southwest Resume Services?"
2. "Who is Ryan Zimmerman resume writer?"
3. "What is the Client Truth Principle?"

**Local Intent:**
4. "Best resume writer in Phoenix Arizona"
5. "Career coach Chandler AZ"
6. "Resume services near Scottsdale"

**Industry Queries:**
7. "What makes a professional resume service worth it?"
8. "How to choose a resume writing service"
9. "Research-backed resume writing methodology"

**Comparison Queries:**
10. "Southwest Resume Services vs TopResume"

---

## 8. Citation Building Protocol

### 8.1 Citation Priority Tiers

#### Tier 1: Data Aggregators (Submit First)
These feed data to hundreds of downstream sites:

| Aggregator | URL | Priority |
|------------|-----|----------|
| Data Axle (Infogroup) | dataaxle.com | Critical |
| Localeze (Neustar) | neustarlocaleze.biz | Critical |
| Factual (Foursquare) | foursquare.com/products/places | Critical |
| Acxiom | acxiom.com | High |

#### Tier 2: Major Platforms
| Platform | URL | Type |
|----------|-----|------|
| Google Business Profile | business.google.com | Local |
| Bing Places | bingplaces.com | Local |
| Apple Maps | mapsconnect.apple.com | Local |
| Yelp | biz.yelp.com | Reviews |
| Facebook Business | facebook.com/business | Social |
| LinkedIn Company | linkedin.com/company | Professional |

#### Tier 3: Business Directories
| Directory | URL | Focus |
|-----------|-----|-------|
| BBB | bbb.org | Trust |
| Angi (Angie's List) | angi.com | Services |
| Thumbtack | thumbtack.com | Services |
| Manta | manta.com | Business |
| Yellow Pages | yellowpages.com | Directory |
| Superpages | superpages.com | Directory |
| CitySearch | citysearch.com | Local |
| Hotfrog | hotfrog.com | Business |

#### Tier 4: Industry-Specific
| Directory | URL | Relevance |
|-----------|-----|-----------|
| Career Directors International | careerdirectors.com | Industry |
| PARW/CC | parwcc.com | Certification |
| NRWA | thenrwa.org | Association |
| CareerOneStop | careeronestop.org | Federal |
| Glassdoor | glassdoor.com | Employment |
| Indeed Company | indeed.com/companies | Employment |

#### Tier 5: Arizona Local
| Directory | URL | Location |
|-----------|-----|----------|
| Arizona Commerce Authority | azcommerce.com | State |
| Chandler Chamber of Commerce | chandlerchamber.com | City |
| Phoenix Chamber | phoenixchamber.com | City |
| Scottsdale Chamber | scottsdalechamber.com | City |
| Mesa Chamber | mesachamber.org | City |
| AZ Central Business | azcentral.com | Media |
| Phoenix Business Journal | bizjournals.com/phoenix | Media |

### 8.2 Citation Submission Process

**Step 1: Prepare Materials**
- Canonical NAP (from Section 2.1)
- Business description (150 words, 300 words, 500 words)
- Logo in multiple sizes (PNG, square format)
- Photos (office, team, work samples if applicable)
- Categories: Resume Service, Career Counselor, Business Consultant
- Hours of operation
- Payment methods accepted
- Services list

**Step 2: Submit to Data Aggregators**
- Submit to all Tier 1 aggregators
- Wait 4-6 weeks for propagation
- Verify downstream citations

**Step 3: Claim Major Platforms**
- Claim and verify GBP (highest priority)
- Claim Bing Places, Apple Maps
- Create/claim Yelp, Facebook, LinkedIn

**Step 4: Build Directory Citations**
- Submit to Tier 3-5 directories
- Use exact canonical NAP
- Add consistent business description
- Upload same logo/photos

**Step 5: Monitor and Correct**
- Use Moz Local or BrightLocal for monitoring
- Fix any NAP inconsistencies immediately
- Respond to reviews on all platforms

### 8.3 Citation Tracking Spreadsheet

| Directory | URL | Status | Date | NAP Verified | Notes |
|-----------|-----|--------|------|--------------|-------|
| GBP | business.google.com | Claimed | YYYY-MM-DD | Yes | Primary listing |
| Yelp | yelp.com/biz/... | Pending | | | Awaiting verification |
| ... | ... | ... | ... | ... | ... |

---

## 9. Google Business Profile Management

### 9.1 GBP Setup Checklist

**Basic Information:**
- [ ] Business name: `Southwest Resume Services`
- [ ] Address: `1111 N Mission Park Blvd #2016, Chandler, AZ 85224`
- [ ] Phone: `(480) 374-3418`
- [ ] Website: `https://southwestresumes.com`
- [ ] Hours: Set accurate business hours
- [ ] Category (Primary): `Resume Service`
- [ ] Categories (Additional): `Career Counselor`, `Business Consultant`

**Media:**
- [ ] Profile photo (logo)
- [ ] Cover photo
- [ ] Interior/office photos (if applicable)
- [ ] Team photos

**Description:**
- [ ] Business description (750 characters max)
- [ ] Include keywords naturally
- [ ] Mention service areas

**Services:**
- [ ] Resume Writing
- [ ] LinkedIn Optimization
- [ ] Interview Coaching
- [ ] Career Strategy Consulting
- [ ] Cover Letter Writing

**Attributes:**
- [ ] Online appointments
- [ ] Free estimates/consultations
- [ ] Languages spoken
- [ ] Payment methods

### 9.2 GBP Optimization Best Practices

**Posts (Weekly):**
- Share tips, insights, success stories
- Use images with each post
- Include CTA (Call, Visit Website, etc.)
- Link to relevant website pages

**Reviews:**
- Respond to ALL reviews within 24-48 hours
- Thank positive reviewers specifically
- Address concerns in negative reviews professionally
- Request reviews from satisfied clients

**Q&A:**
- Seed common questions with answers
- Monitor for new questions weekly
- Answer professionally and completely

**Photos:**
- Add new photos monthly
- Use descriptive filenames
- Add captions when possible

### 9.3 GBP Performance Tracking

| Metric | Measurement | Goal |
|--------|-------------|------|
| Search Impressions | Monthly via Insights | Increase 10% MoM |
| Direct Searches | Monthly via Insights | Track brand awareness |
| Discovery Searches | Monthly via Insights | Track category visibility |
| Website Clicks | Monthly via Insights | Increase 5% MoM |
| Direction Requests | Monthly via Insights | Track local interest |
| Phone Calls | Monthly via Insights | Primary conversion metric |
| Review Count | Weekly | 1+ per month |
| Review Rating | Weekly | Maintain 4.5+ |

---

## 10. Testing & Verification Procedures

### 10.1 SEO Testing Tools

| Tool | Purpose | Frequency |
|------|---------|-----------|
| Google Search Console | Indexing, errors, performance | Weekly |
| Bing Webmaster Tools | Bing-specific insights | Monthly |
| Google PageSpeed Insights | Core Web Vitals | After changes |
| Lighthouse | Comprehensive audit | Monthly |
| Screaming Frog | Technical SEO crawl | Quarterly |
| Ahrefs/SEMrush | Rankings, backlinks | Monthly |

### 10.2 Schema Validation

**Before Deployment:**
1. Run page through [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Verify all schemas show as valid
3. Check for warnings (not just errors)
4. Confirm NAP matches canonical format

**Monthly:**
1. Re-validate all pages with schema
2. Check Search Console for structured data errors
3. Update schema if business info changes

### 10.3 NAP Consistency Audit

**Tools:**
- Moz Local
- BrightLocal
- Yext (paid)
- Manual spot-checking

**Process:**
1. Search for business name across platforms
2. Compare each listing to canonical NAP
3. Document discrepancies
4. Submit corrections
5. Re-verify after 4-6 weeks

### 10.4 GEO Testing Protocol

**Weekly Testing:**

1. Open ChatGPT, Claude, and Perplexity
2. Ask each test query (from Section 7.6)
3. Score response on 0-10 scale:
   - 10: Cited with accurate info and recommendation
   - 7-9: Mentioned with mostly accurate info
   - 4-6: Mentioned briefly or partially accurate
   - 1-3: Not mentioned but category acknowledged
   - 0: Not mentioned at all

4. Track scores in spreadsheet over time
5. Identify gaps and optimize content accordingly

**Example Tracking:**

| Query | ChatGPT | Claude | Perplexity | Week |
|-------|---------|--------|------------|------|
| "Best resume writer Phoenix" | 4 | 6 | 5 | 12/21 |
| "Client Truth Principle" | 7 | 8 | 6 | 12/21 |
| ... | ... | ... | ... | ... |

---

## 11. Maintenance Schedule

### 11.1 Weekly Tasks

| Task | Owner | Time |
|------|-------|------|
| Check Search Console for errors | Owner | 15 min |
| Respond to new reviews | Owner | 15 min |
| Post to GBP | Owner | 20 min |
| Run GEO test queries (sample) | Owner | 30 min |

### 11.2 Monthly Tasks

| Task | Owner | Time |
|------|-------|------|
| Full Search Console review | Owner | 30 min |
| GBP Insights review | Owner | 20 min |
| Citation spot-check (10 listings) | Owner | 30 min |
| Schema validation | Owner | 20 min |
| Lighthouse audit | Owner | 30 min |
| Content freshness review | Owner | 1 hour |
| Update llms.txt if needed | Owner | 15 min |

### 11.3 Quarterly Tasks

| Task | Owner | Time |
|------|-------|------|
| Full NAP consistency audit | Owner | 2 hours |
| Competitor analysis | Owner | 2 hours |
| Keyword ranking report | Owner | 1 hour |
| Technical SEO audit (Screaming Frog) | Owner | 2 hours |
| Schema review and update | Owner | 1 hour |
| Local link building outreach | Owner | 3 hours |

### 11.4 Annual Tasks

| Task | Owner | Time |
|------|-------|------|
| Complete SEO strategy review | Owner | 4 hours |
| GEO strategy update (platform changes) | Owner | 2 hours |
| Citation cleanup and expansion | Owner | 4 hours |
| Competitive positioning review | Owner | 3 hours |
| Content audit and refresh | Owner | 8 hours |

---

## 12. Appendices

### Appendix A: Files Reference

| File | Location | Purpose |
|------|----------|---------|
| robots.txt | staging/public/robots.txt | Crawler instructions |
| sitemap.ts | staging/app/sitemap.ts | Dynamic XML sitemap |
| llms.txt | staging/public/llms.txt | AI crawler info |
| layout.tsx | staging/app/layout.tsx | Site-wide schema |
| NAP-CANONICAL-FORMAT.md | staging/NAP-CANONICAL-FORMAT.md | NAP reference |

### Appendix B: Schema Locations

| Schema Type | File | Line Reference |
|-------------|------|----------------|
| LocalBusiness/ProfessionalService | app/layout.tsx | Lines 158-292 |
| BreadcrumbList | app/layout.tsx | Lines 102-155 |
| Organization | app/about/page.tsx | Lines 44-90 |
| Person (Ryan Zimmerman) | app/about/page.tsx | Lines 92-118 |
| Person (Jordyn Ginsberg) | app/about/page.tsx | Lines 120-139 |
| ContactPage | app/contact/page.tsx | Lines 42-93 |
| Service (6x) | app/services/page.tsx | Lines 222-532 |
| HowTo | app/process/page.tsx | Added |
| FAQPage | app/faq/page.tsx | Added |

### Appendix B.1: Geographic Meta Tags

**Location:** app/layout.tsx (Lines 91-96)

```typescript
other: {
  'geo.region': 'US-AZ',
  'geo.placename': 'Chandler',
  'geo.position': '33.3062;-111.8413',
  'ICBM': '33.3062, -111.8413',
}
```

### Appendix B.2: Page-Specific OG/Twitter Metadata

All public pages now have unique Open Graph and Twitter Card metadata:

| Page | File | Canonical URL |
|------|------|---------------|
| Homepage | app/page.tsx | https://southwestresumes.com |
| About | app/about/page.tsx | https://southwestresumes.com/about |
| Contact | app/contact/page.tsx | https://southwestresumes.com/contact |
| Services | app/services/page.tsx | https://southwestresumes.com/services |
| FAQ | app/faq/page.tsx | https://southwestresumes.com/faq |
| Process | app/process/page.tsx | https://southwestresumes.com/process |

### Appendix C: Keyword Targeting Matrix

| Keyword | Page | Volume | Difficulty | Status |
|---------|------|--------|------------|--------|
| resume writing services Phoenix | Home, Services | Medium | Medium | Optimized |
| Phoenix resume writer | Home, About | Medium | Medium | Optimized |
| Arizona career coach | Home, Services | Low | Low | Optimized |
| Chandler resume services | Contact, Footer | Low | Low | Optimized |
| Client Truth Principle | Methodology, About | Very Low | Very Low | Owned |
| research-backed resume | Services, Process | Very Low | Very Low | Owned |

### Appendix D: Competitor Tracking

| Competitor | GBP Rating | Reviews | Key Differentiator |
|------------|------------|---------|-------------------|
| [Competitor 1] | X.X | XX | |
| [Competitor 2] | X.X | XX | |
| [Competitor 3] | X.X | XX | |

*To be completed during competitive analysis*

### Appendix E: Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-21 | Initial SOP creation | Claude |
| 2025-12-23 | Phase 1 SEO Implementation: Added Organization + Person schemas to About page, ContactPage schema to Contact page, geographic meta tags to root layout, page-specific OG/Twitter metadata to all public pages. Updated version to 1.1. | Claude |
| 2025-12-26 | GSC Verification: Added DNS TXT record via Spaceship API, added HTML meta verification tag to layout.tsx, verified domain ownership in Google Search Console. Sitemap submitted for indexing. | Claude |
| 2025-12-26 | Comprehensive SEO/GEO Visibility Audit: Created exhaustive metrics matrix (4.83/10 overall). Identified critical gaps in keyword visibility (2.0/10), citations (3.0/10), and backlinks (2.5/10). Technical SEO excellent (9.8/10). Created 90-day action plan with priority matrix. Document: docs/audits/SEO-GEO-METRICS-MATRIX_claude-opus-4-5-20251101_2025-12-26.md | Claude |

---

## Document Control

**Classification:** Internal Use
**Review Cycle:** Quarterly
**Next Review:** 2025-03-21
**Approval:** Ryan Zimmerman, Founder

---

*This SOP consolidates research and implementation from the SRS Website SEO/GEO audit sessions conducted December 2025.*
