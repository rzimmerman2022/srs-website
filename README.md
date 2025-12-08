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

### Sitemap & Robots.txt

- **Sitemap:** Automatically generated at `/sitemap.xml`
- **Robots.txt:** Configured at `/robots.txt`
- Both update automatically when you add/remove pages

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
