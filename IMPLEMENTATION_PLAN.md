# Southwest Resume Services - Implementation Plan

## Project Overview
Building a world-class marketing website for Southwest Resume Services (SRS) that significantly outperforms the current Wix Studio site.

**Domain:** southwestresumes.com
**Tagline:** "Your Career, Elevated."
**Core Values:** Warm, human, Arizona-inspired, professional, detail-obsessed, "white glove" career services

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Fonts:** Inter (sans-serif) + Playfair Display (serif headings)
- **Deployment:** Vercel
- **Package Manager:** npm

## Brand Identity (From Logo Analysis)

### Color Palette
- **Navy:** `#1a2332` (primary background, headers)
- **Gold:** `#d4af37` (primary accent, CTAs)
- **Sand:** `#f5e6d3` (soft backgrounds, sections)
- **Charcoal:** `#2d2d2d` (body text)

### Visual Elements
- Feather icon (Southwest heritage, lightness, elevation)
- Fountain pen nib (professional writing, precision)
- Circular gold border (completeness, premium quality)
- Elegant serif typography for headings
- Clean sans-serif for body text

## Implementation Phases

### Phase 1: Foundation ✅
**Status:** COMPLETE
- [x] Initialize git repository
- [x] Connect to GitHub remote
- [x] Scaffold Next.js + TypeScript + Tailwind
- [x] Configure base tooling (ESLint, TypeScript)
- [x] Set up color palette and typography system
- [x] Create base layout with SEO metadata

### Phase 2: Design System & Shared Components
**Target:** Core reusable components and layout structure

#### Components to Build
1. **Layout Components**
   - [ ] Header/Navbar (sticky, mobile-responsive)
   - [ ] Footer (contact info, links, social)
   - [ ] Container/Section wrappers
   - [ ] Skip to main content (a11y)

2. **UI Primitives**
   - [ ] Button (primary, secondary, outline, ghost)
   - [ ] Input (text, email, textarea, select)
   - [ ] Card component
   - [ ] Feature block component
   - [ ] Icon system setup

3. **Page-Specific Components**
   - [ ] Hero section (with gradient/image support)
   - [ ] Service card grid
   - [ ] Process timeline/stepper
   - [ ] Testimonial block
   - [ ] FAQ accordion
   - [ ] Contact form

**Acceptance Criteria:**
- All components have proper TypeScript types
- Accessible (keyboard navigation, ARIA labels, focus states)
- Responsive (mobile-first design)
- Consistent with brand colors and typography
- Loading and error states where applicable

### Phase 3: Core Pages (High Priority)
**Target:** Essential conversion-focused pages

#### 3.1 Home Page (`/`)
**Key Elements:**
- Hero: Clear value proposition + CTA
- 3-4 key benefits/outcomes (no fabricated metrics)
- Trust indicators (process snapshot, "Why SRS")
- Services overview (brief)
- Social proof section (with placeholders if needed)
- Clear CTAs to contact/consultation

**Content Source:** SOP Section 1 (Philosophy), Section 3.1 (Enhancement Scale as value prop)

#### 3.2 Services Page (`/services`)
**Services to Highlight (from SOP):**
- Resume Writing & Optimization
- LinkedIn Profile Optimization
- Cover Letter Writing
- Career Strategy Consultation
- Interview Preparation & Coaching
- Service Bundles (Career Transition Package, etc.)

**Structure:**
- Overview of service philosophy (Client Truth Principle)
- Individual service cards with descriptions
- Process teaser (links to `/process`)
- Pricing approach (without specific numbers if not provided)
- CTA to contact

**Content Source:** SOP Section 2 (Client Journey), Section 9 (Service Packages)

#### 3.3 Process Page (`/process`)
**Content:**
Step-by-step client journey:
1. Intake & Assessment
2. Market Research & Discovery
3. Enhancement & Translation
4. Research Validation
5. Ownership Transfer
6. Interview Preparation
7. Quality Assurance
8. Delivery & Follow-Through

**Presentation:**
- Timeline/stepper visual
- Each step with brief description
- Emphasis on research-backed approach (RAI, O*NET, etc.)
- Quality commitment

**Content Source:** SOP Section 2 (Client Journey Map), Section 4 (Operational Procedures)

**Acceptance Criteria (Phase 3):**
- All pages have unique, descriptive `<title>` and meta descriptions
- OpenGraph and Twitter Card metadata
- Semantic HTML (header, main, nav, footer, sections)
- No invented credentials, metrics, or testimonials
- Clear CTAs on every page
- Mobile-responsive
- WCAG 2.2 AA compliant (color contrast, focus states)

### Phase 4: Supporting Pages
**Target:** Additional information and authority-building content

#### 4.1 Results/Portfolio Page (`/results`)
**Content:**
- Anonymized case studies (if available)
- Before/after examples (qualitative)
- Success indicators (process-focused, not fabricated metrics)
- Placeholder sections for future client stories

**Note:** Use conservative, SOP-aligned examples only.

#### 4.2 About Page (`/about`)
**Content:**
- Founder profile (based on real information provided)
- SRS philosophy (Client Truth Principle)
- Arizona/Southwest connection
- No invented credentials or years in business
- Team values and approach

#### 4.3 FAQ Page (`/faq`)
**Content Categories:**
- Process & timeline questions
- Revision policy
- Service scope
- Pricing approach
- Interview preparation details

**Implementation:**
- Accessible accordion components
- Structured data (FAQ schema) for SEO

#### 4.4 Blog/Resources Setup (`/blog`)
**Scope:**
- Template structure only
- Sample post layout
- Category/tag system preparation
- SEO optimization for content marketing

#### 4.5 Contact Page (`/contact`)
**Elements:**
- Contact form (name, email, phone optional, message)
- Clear expectation-setting (response times, next steps)
- Form validation (client-side + preparation for server-side)
- Success/error states
- Placeholder submit handler (wire for future CRM integration)

**Acceptance Criteria (Phase 4):**
- All content verified against SOP
- Clear TODOs for missing information
- Accessible forms and interactive elements
- Proper error handling and validation

### Phase 5: SEO, Performance & Polish
**Target:** Technical excellence and optimization

#### SEO Implementation
- [x] `robots.txt` configuration
- [x] `sitemap.xml` generation
- [x] Canonical URL tags
- [ ] 301 redirect: www.southwestresumes.com → southwestresumes.com (Vercel config)
- [x] Structured data (Organization, LocalBusiness, FAQPage, ContactPage, Person, HowTo, Service)
- [x] Per-page metadata optimization (OG/Twitter cards, geographic meta tags)

#### SEO Gap Resolution (From 2025-12-26 Audit)

**Current Score: 4.83/10 - Target: 7.5/10 by Q1 2026**

**P0 - Immediate (Critical Gaps):**
- [ ] Submit to data aggregators (Data Axle, Localeze, Factual, Acxiom)
- [ ] Create Yelp business listing
- [ ] Claim Bing Places for Business
- [ ] Claim Apple Maps Connect listing
- [ ] Request 10 client reviews on GBP

**P1 - Short-Term (Content & Local):**
- [ ] Create Phoenix landing page (1,500+ words, keyword optimized)
- [ ] Create Scottsdale landing page
- [ ] Create Mesa/Tempe landing pages
- [ ] Launch blog with 4 initial posts targeting commercial keywords
- [ ] Join Chandler Chamber of Commerce

**P2 - Medium-Term (Authority Building):**
- [ ] Build 10 quality backlinks (chambers, industry directories)
- [ ] Submit to 20+ business directories
- [ ] HARO signup for media mentions
- [ ] Create 2 anonymized case studies
- [ ] Guest post outreach (5 targets)

**Audit Reference:** See `docs/audits/SEO-GEO-METRICS-MATRIX_claude-opus-4-5-20251101_2025-12-26.md`

#### Performance Optimization
- [ ] Image optimization (use `next/image`)
- [ ] Font optimization (use `next/font`)
- [ ] Code splitting verification
- [ ] Lighthouse audit (target: 90+ scores)
- [ ] Core Web Vitals check

#### Accessibility Audit
- [ ] Keyboard navigation testing
- [ ] Screen reader testing (NVDA/JAWS)
- [ ] Color contrast verification (WCAG 2.2 AA)
- [ ] Focus indicator visibility
- [ ] Form label associations
- [ ] Heading hierarchy
- [ ] Alt text for all images
- [ ] ARIA labels where needed

**Acceptance Criteria:**
- Lighthouse scores: 90+ (Performance, Accessibility, Best Practices, SEO)
- No WCAG 2.2 AA violations
- Fast initial load (<2s on 3G)
- All images have appropriate alt text

### Phase 6: Documentation & Deployment
**Target:** Production-ready deployment with comprehensive documentation

#### Documentation
- [ ] README.md (setup, scripts, deployment, domain config)
- [ ] OWNERS_MANUAL.md (content editing, adding services/FAQs/blog posts, design customization)
- [ ] Environment variable documentation
- [ ] Component documentation (if needed)

#### Deployment Preparation
- [ ] Vercel project setup
- [ ] Environment variables configuration
- [ ] Domain configuration instructions
- [ ] www → non-www redirect setup
- [ ] SSL/HTTPS verification
- [ ] Analytics preparation (placeholder for future)

**Acceptance Criteria:**
- Site deployed to Vercel
- Custom domain configured (instructions provided)
- All documentation complete and tested
- Backup/recovery process documented

## Content Guidelines (CRITICAL)

### What We CAN Use
- Information from the SOP document
- Philosophy and methodology descriptions
- Service descriptions based on SOP sections
- Process steps from Client Journey Map
- General industry best practices

### What We CANNOT Fabricate
- ❌ Specific credentials (CPRW, NRWA, etc.)
- ❌ Years in business
- ❌ Client testimonials
- ❌ Specific success metrics ("95% success rate", etc.)
- ❌ Client logos (universities, companies)
- ❌ Outcome statistics without verification

### Placeholder Strategy
When information is missing:
- Add clear TODO comments: `{/* TODO: Insert verified credential here */}`
- Use conservative, factual language
- Design layout to accommodate future content
- Document what's needed in OWNERS_MANUAL.md

## Technical Requirements

### SEO
- Unique title and meta description per page
- OpenGraph and Twitter Card tags
- Canonical URLs
- Sitemap and robots.txt
- Structured data (JSON-LD)
- Semantic HTML

### Performance
- Use `next/image` for all images
- Use `next/font` for web fonts
- Code splitting (automatic with Next.js App Router)
- Lazy loading for below-fold content
- Optimized bundle size

### Accessibility (WCAG 2.2 AA)
- Color contrast ≥ 4.5:1 (body text), ≥ 3:1 (large text)
- Keyboard navigation support
- Focus indicators on all interactive elements
- Proper heading hierarchy (h1 → h2 → h3, etc.)
- Form labels and ARIA attributes
- Skip to main content link
- Alt text for images
- No auto-playing media

### Code Quality
- TypeScript strict mode
- ESLint + Prettier
- No `any` types (use proper types)
- Consistent component structure
- Error boundaries where appropriate
- Loading states for async operations

## Testing Checklist

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Responsive Testing
- [ ] Mobile (320px - 480px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1280px+)
- [ ] Large Desktop (1920px+)

### Accessibility Testing
- [ ] Keyboard-only navigation
- [ ] Screen reader (NVDA/JAWS)
- [ ] Color contrast analyzer
- [ ] Lighthouse accessibility audit

### Performance Testing
- [ ] Lighthouse (all pages)
- [ ] WebPageTest
- [ ] Real 3G throttling test
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

## File Structure
```
/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles + Tailwind
│   ├── services/
│   │   └── page.tsx
│   ├── process/
│   │   └── page.tsx
│   ├── results/
│   │   └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── faq/
│   │   └── page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── robots.ts           # robots.txt config
│   └── sitemap.ts          # sitemap.xml config
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   └── sections/
│       ├── Hero.tsx
│       ├── ServiceGrid.tsx
│       ├── ProcessTimeline.tsx
│       ├── Testimonials.tsx
│       ├── FAQ.tsx
│       └── ContactForm.tsx
├── lib/
│   ├── seo.ts             # SEO helpers
│   ├── analytics.ts       # Analytics setup (future)
│   └── utils.ts           # General utilities
├── public/
│   ├── assets/
│   │   ├── logos/
│   │   └── images/
│   ├── favicon.ico
│   └── og-image.jpg
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── README.md
├── OWNERS_MANUAL.md
└── IMPLEMENTATION_PLAN.md
```

## Success Criteria

### Must Have (MVP)
- ✅ All required pages implemented (Home, Services, Process, Results, About, FAQ, Contact)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ WCAG 2.2 AA compliant
- ✅ SEO optimized (metadata, sitemap, robots.txt)
- ✅ Fast performance (Lighthouse 90+)
- ✅ No fabricated content (all SOP-aligned)
- ✅ Clear CTAs and conversion paths
- ✅ Professional, trust-building design
- ✅ Comprehensive documentation

### Should Have
- Blog/resources template structure
- Structured data (JSON-LD)
- Advanced accessibility features
- Performance budget monitoring
- Error boundaries

### Nice to Have (Future)
- CRM integration (HubSpot)
- Payment processing (Stripe)
- Client portal
- Automated email sequences
- Advanced analytics

## Next Steps
1. Complete Phase 2: Design System & Shared Components
2. Implement Phase 3: Core Pages (Home, Services, Process)
3. Continue through remaining phases sequentially
4. Test, audit, and polish
5. Document and deploy

## Notes
- All content must be verified against SOP
- Use conservative, factual language
- Prioritize trust and authenticity over marketing hype
- Mobile-first approach
- Accessibility is not optional
- Performance matters for SEO and UX
