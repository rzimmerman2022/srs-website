# Southwest Resume Services - Website

Premium marketing website for Southwest Resume Services, LLC built with Next.js, TypeScript, and Tailwind CSS.

## Overview

This is a modern, high-performance marketing website designed to convert visitors into clients. The site emphasizes trust, authenticity, and the research-backed methodology that sets Southwest Resume Services apart from competitors.

**Live Site:** [southwestresumes.com](https://southwestresumes.com)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Fonts:** Inter (sans-serif) + Playfair Display (serif)
- **Deployment:** Vercel
- **Package Manager:** npm

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm 9.0 or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rzimmerman2022/srs-website.git
   cd "SRS - Website"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server (with Turbopack)
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Header/Footer
│   ├── page.tsx           # Home page
│   ├── services/          # Services page
│   ├── process/           # Process page
│   ├── results/           # Results/portfolio page
│   ├── about/             # About page
│   ├── faq/               # FAQ page
│   ├── contact/           # Contact page
│   ├── robots.ts          # robots.txt configuration
│   ├── sitemap.ts         # sitemap.xml configuration
│   └── globals.css        # Global styles + Tailwind
├── components/
│   ├── layout/            # Header, Footer, Container
│   ├── ui/                # Button, Input, Card primitives
│   └── sections/          # Hero, ServiceGrid, FAQ, etc.
├── lib/                   # Utility functions (future)
├── public/
│   └── assets/            # Images, logos
├── IMPLEMENTATION_PLAN.md # Detailed implementation plan
├── OWNERS_MANUAL.md       # Content management guide
└── README.md              # This file
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Import your repository on [Vercel](https://vercel.com):
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js and configure build settings
   - Click "Deploy"

3. Configure custom domain:
   - Go to Project Settings → Domains
   - Add `southwestresumes.com`
   - Add `www.southwestresumes.com` and configure redirect to non-www
   - Follow DNS configuration instructions from Vercel

### Domain Configuration

**DNS Records (configure at your domain registrar):**

For Vercel deployment:
```
A Record:  @ → 76.76.21.21
CNAME:     www → cname.vercel-dns.com
```

**Redirect Configuration:**
- www.southwestresumes.com → southwestresumes.com (301 redirect)
- This is configured automatically in Vercel when you set up both domains

### Environment Variables

Currently, no environment variables are required. For future integrations:

```env
# Future: Form submissions
NEXT_PUBLIC_FORM_ENDPOINT=

# Future: Analytics
NEXT_PUBLIC_GA_ID=

# Future: CRM Integration (HubSpot, etc.)
HUBSPOT_API_KEY=
```

Add environment variables in:
- **Local:** Create `.env.local` file (never commit this!)
- **Vercel:** Project Settings → Environment Variables

## Brand Guidelines

### Colors

- **Navy:** `#1a2332` - Primary brand color, headers, backgrounds
- **Gold:** `#d4af37` - Primary accent, CTAs, highlights
- **Sand:** `#f5e6d3` - Soft backgrounds, sections
- **Charcoal:** `#2d2d2d` - Body text

### Typography

- **Headings:** Playfair Display (serif) - Elegant, professional
- **Body:** Inter (sans-serif) - Clean, readable
- **Tagline:** "Your Career, Elevated."

### Logo

The logo combines:
- Navy circular background
- Gold border (circular)
- Feather icon (Southwest heritage)
- Fountain pen nib (professional writing)

## SEO Optimization

### Metadata

Each page has unique:
- Title tag (< 60 characters)
- Meta description (< 160 characters)
- OpenGraph tags (for social sharing)
- Twitter Card tags
- Canonical URLs

### Structured Data (Schema.org)

The site includes comprehensive structured data for rich search results:

| Schema Type | Location | Purpose |
|-------------|----------|---------|
| LocalBusiness/ProfessionalService | `app/layout.tsx` | Business info, NAP, service areas |
| BreadcrumbList | `app/layout.tsx` | Site navigation structure |
| Organization | `app/about/page.tsx` | Knowledge Graph presence |
| Person (2x) | `app/about/page.tsx` | Team member profiles |
| ContactPage | `app/contact/page.tsx` | Contact info, hours |
| Service (6x) | `app/services/page.tsx` | Individual service definitions |
| HowTo | `app/process/page.tsx` | Process methodology |
| FAQPage | `app/faq/page.tsx` | FAQ rich results |

### Local SEO

Geographic meta tags are included site-wide:
- `geo.region`: US-AZ
- `geo.placename`: Chandler
- `geo.position`: 33.3062;-111.8413

### Sitemap & Robots.txt

- **Sitemap:** Automatically generated at `/sitemap.xml`
- **Robots.txt:** Configured at `/robots.txt` (blocks /admin, /q routes)
- Both update automatically when you add/remove pages

### SEO Documentation

See [SEO-GEO-LOCAL-SOP.md](./SEO-GEO-LOCAL-SOP.md) for complete SEO guidelines including:
- NAP consistency standards
- Schema implementation details
- Local SEO optimization
- GEO (Generative Engine Optimization) strategies
- Citation building protocols

### Performance

Target metrics (Lighthouse):
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## Accessibility (WCAG 2.2 AA)

- Color contrast ratios meet AA standards
- Keyboard navigation support
- Focus indicators on all interactive elements
- Proper heading hierarchy
- Alt text for all images
- ARIA labels where needed
- Skip to main content link

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android)

## Discovery Questionnaire System

The Strategic Placement Diagnostic Questionnaire is a secure client intake system built with Supabase. This section explains how to view and export the questionnaire data that clients enter.

### Client Access

Clients access their personalized questionnaire at:
```
https://southwestresumes.com/discovery/{clientId}
```

Example: `/discovery/jdeleon` for Jackie DeLeon's questionnaire.

### Step 1: Access the Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Log in with your account credentials
3. Select the "SRS-Questionnaire" project
4. You'll see the project dashboard

### Step 2: Navigate to the Table Editor

1. In the left sidebar, click **"Table Editor"**
2. You'll see two tables:
   - `questionnaire_responses` - Current data from clients
   - `response_history` - Audit trail of all changes

### Understanding the Data Structure

#### Table: `questionnaire_responses`

This table contains the current state of each client's questionnaire. One row per client per questionnaire.

| Column Name | What It Means | Example Value |
|-------------|---------------|---------------|
| `id` | Unique record identifier | `550e8400-e29b-41d4-a716-446655440000` |
| `client_id` | Client identifier from URL | `jdeleon` or `test-client` |
| `questionnaire_id` | Which questionnaire | `discovery` |
| `answers` | Client's responses in JSON format | See below |
| `current_question_index` | Where they stopped | `15` (they're on question 16) |
| `current_module_index` | Which section they're in | `2` (they're in Module 3) |
| `points` | Gamification score | `75` |
| `completed` | Finished or still working? | `false` (in progress) or `true` (done) |
| `created_at` | When they first started | `2025-12-19 14:30:00` |
| `updated_at` | Last time they saved an answer | `2025-12-19 15:45:00` |

#### Understanding the `answers` Field

The `answers` column stores client responses in JSON format:

```json
{
  "q1-salary-floor": "55000",
  "q2-salary-target": "70000",
  "q3-remote-tolerance": "remote-preferred",
  "q4-primary-lane": "ur-um",
  "q5-criteria-tools": ["interqual", "mcg"]
}
```

### SQL Queries (Copy & Paste Ready)

Click **"SQL Editor"** in the left sidebar to run these queries.

#### 1. View All Questionnaire Responses

```sql
SELECT
  client_id,
  questionnaire_id,
  completed,
  current_module_index,
  current_question_index,
  points,
  created_at,
  updated_at
FROM questionnaire_responses
ORDER BY updated_at DESC;
```

#### 2. View Responses for a Specific Client

```sql
SELECT
  client_id,
  questionnaire_id,
  answers,
  completed,
  created_at,
  updated_at
FROM questionnaire_responses
WHERE client_id = 'jdeleon';
```

#### 3. See Completed vs In-Progress Questionnaires

```sql
SELECT
  completed,
  COUNT(*) as count
FROM questionnaire_responses
GROUP BY completed;
```

#### 4. View Most Recent Activity

```sql
SELECT
  client_id,
  questionnaire_id,
  completed,
  updated_at
FROM questionnaire_responses
ORDER BY updated_at DESC
LIMIT 10;
```

#### 5. Extract Specific Answer Fields

```sql
SELECT
  client_id,
  answers->>'q1-salary-floor' as salary_floor,
  answers->>'q2-salary-target' as salary_target,
  answers->>'q3-remote-tolerance' as remote_preference,
  completed
FROM questionnaire_responses
ORDER BY updated_at DESC;
```

#### 6. View Complete Answer History for a Client

```sql
SELECT
  rh.created_at,
  rh.snapshot
FROM response_history rh
JOIN questionnaire_responses qr ON rh.response_id = qr.id
WHERE qr.client_id = 'jdeleon'
ORDER BY rh.created_at DESC;
```

### How to Export Data

#### Method 1: Export from Table Editor (Simple)

1. Click "Table Editor" in the left sidebar
2. Select the `questionnaire_responses` table
3. Click the **"Export"** button (top right)
4. Choose format:
   - **CSV** - Opens in Excel/Google Sheets
   - **JSON** - Raw data format

#### Method 2: Export from SQL Editor (Custom)

1. Run any SQL query (see examples above)
2. After the results appear, click **"Download CSV"** button below the results
3. This exports only the columns in your query, making it cleaner

#### Method 3: Export All Data with Readable Answers

Run this query, then download as CSV:

```sql
SELECT
  client_id,
  questionnaire_id,
  answers->>'q1-salary-floor' as "Minimum Salary",
  answers->>'q2-salary-target' as "Target Salary",
  answers->>'q3-remote-tolerance' as "Remote Preference",
  completed as "Completed?",
  created_at as "Started At",
  updated_at as "Last Updated"
FROM questionnaire_responses
ORDER BY updated_at DESC;
```

### Common Tasks

#### "How do I see what a client answered for salary requirements?"

```sql
SELECT
  client_id,
  answers->>'q1-salary-floor' as minimum_salary,
  answers->>'q2-salary-target' as target_salary,
  updated_at
FROM questionnaire_responses
WHERE client_id = 'jdeleon';
```

#### "How do I see all completed questionnaires this week?"

```sql
SELECT
  client_id,
  completed,
  updated_at
FROM questionnaire_responses
WHERE completed = true
  AND updated_at >= NOW() - INTERVAL '7 days'
ORDER BY updated_at DESC;
```

#### "How do I recover data if a client accidentally resets their answers?"

```sql
SELECT
  created_at,
  snapshot
FROM response_history rh
JOIN questionnaire_responses qr ON rh.response_id = qr.id
WHERE qr.client_id = 'jdeleon'
ORDER BY created_at DESC
LIMIT 10;
```

The `snapshot` field contains their complete answers at that point in time.

### Data Protection

- **Dual-layer persistence:** localStorage (immediate) + Supabase (permanent)
- **Auto-save:** Every answer syncs within 2 seconds
- **Offline support:** Answers saved locally, synced when online
- **No data loss:** Multiple redundancy layers protect client work
- **SSL encryption:** All database connections are encrypted
- **Row Level Security:** RLS policies enabled on all tables

### Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Adding New Clients

1. Create questionnaire data in `lib/questionnaire/`
2. Add client ID mapping in `app/discovery/[clientId]/page.tsx`
3. Share URL: `/discovery/{newClientId}`

---

## Content Management

See [OWNERS_MANUAL.md](./OWNERS_MANUAL.md) for detailed instructions on:
- Updating page content
- Adding new services
- Managing FAQ entries
- Customizing colors and styles
- Adding blog posts (future)

## Troubleshooting

### Build Errors

1. **CSS/Tailwind errors:**
   ```bash
   npm run build
   ```
   Check for invalid Tailwind classes in your components

2. **TypeScript errors:**
   ```bash
   npm run type-check
   ```
   Fix type errors before deploying

3. **Clear cache:**
   ```bash
   rm -rf .next
   npm run build
   ```

### Common Issues

- **Port already in use:** Kill process on port 3000 or use different port:
  ```bash
  npm run dev -- -p 3001
  ```

- **Module not found:** Reinstall dependencies:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

## Support

For technical support or questions:
- Review [OWNERS_MANUAL.md](./OWNERS_MANUAL.md) for content updates
- Check [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for architecture details
- Create an issue on GitHub for bugs or feature requests

## License

Copyright © 2025 Southwest Resume Services, LLC. All rights reserved.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
