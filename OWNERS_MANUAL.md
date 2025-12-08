# Southwest Resume Services - Owner's Manual

This guide explains how to manage and update your website content without technical expertise.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Updating Page Content](#updating-page-content)
3. [Adding/Editing Services](#addingediting-services)
4. [Managing FAQs](#managing-faqs)
5. [Customizing Colors & Styles](#customizing-colors--styles)
6. [Adding Team Members](#adding-team-members)
7. [Future Enhancements](#future-enhancements)
8. [Common Tasks](#common-tasks)

## Quick Start

### Making a Simple Text Change

1. Locate the file for the page you want to edit (see [File Locations](#file-locations))
2. Open the file in any text editor (VS Code recommended)
3. Find the text you want to change
4. Edit the text between the quote marks `"like this"`
5. Save the file
6. Run `npm run build` to verify no errors
7. Commit and push to deploy

### File Locations

```
app/page.tsx           → Home page
app/services/page.tsx  → Services page
app/process/page.tsx   → Process page
app/results/page.tsx   → Results page
app/about/page.tsx     → About page
app/faq/page.tsx       → FAQ page
app/contact/page.tsx   → Contact page
```

## Updating Page Content

### Home Page

**File:** `app/page.tsx`

**Key sections to update:**

1. **Hero Section** (lines ~86-92):
   ```typescript
   <Hero
     title="Your Career, Elevated."
     subtitle="Southwest Resume Services"
     description="Premium career services..."
     primaryCTA={{ text: 'Get Started', href: '/contact' }}
   />
   ```

2. **Core Services** (lines ~14-54):
   ```typescript
   const coreServices: Service[] = [
     {
       title: 'Resume Writing & Optimization',
       description: '...',
       icon: '📄',
       features: [
         'Feature 1',
         'Feature 2',
       ],
     },
   ];
   ```

3. **Why SRS Section** (lines ~56-81):
   Edit the reasons in the `whySRS` array

### Services Page

**File:** `app/services/page.tsx`

**To add a new service:**

1. Find the `services` array (line ~14)
2. Add a new service object:
   ```typescript
   {
     title: 'New Service Name',
     description: 'Service description',
     icon: '🎯',  // Choose an emoji icon
     features: [
       'Feature 1',
       'Feature 2',
       'Feature 3',
     ],
     cta: { text: 'Get Started', href: '/contact' },
   },
   ```

**To edit existing service:**
- Find the service in the array
- Edit title, description, or features
- Save and rebuild

### About Page

**File:** `app/about/page.tsx`

**Key areas:**

1. **Philosophy Quote** (line ~34):
   ```typescript
   <p className="text-xl text-center font-semibold text-navy mb-8">
     "Your quote here"
   </p>
   ```

2. **Main Description** (lines ~35-47):
   Edit the paragraphs in the prose section

3. **Founder Information**:
   Add your bio, credentials, and background
   **IMPORTANT:** Only add verified credentials/certifications

### FAQ Page

**File:** `app/faq/page.tsx`

**To add a new FAQ:**

1. Find the `faqItems` array (line ~14)
2. Add a new item:
   ```typescript
   {
     question: 'Your question here?',
     answer: 'Your detailed answer here.',
   },
   ```

**To edit existing FAQ:**
- Locate the question in the array
- Edit the question or answer text
- FAQs display in array order (reorder by moving items)

### Contact Page

**File:** `app/contact/page.tsx`

**To add contact information:**

1. Find the email section (line ~43)
2. Add phone/address if needed:
   ```typescript
   <div>
     <h3 className="text-lg font-semibold text-navy mb-2">Call Us</h3>
     <p className="text-gray-600 mb-2">Phone support available:</p>
     <a href="tel:+15555551234" className="text-gold hover:text-gold-600">
       (555) 555-1234
     </a>
   </div>
   ```

## Adding/Editing Services

### Service Structure

Each service has:
- **Title:** Name of the service
- **Description:** Brief overview (2-3 sentences)
- **Icon:** Emoji representing the service
- **Features:** Bullet list of key benefits
- **CTA:** Call-to-action button

### Example: Adding "Executive Resume Writing"

```typescript
{
  title: 'Executive Resume Writing',
  description: 'Premium resume writing for C-suite and senior executives. Emphasizes leadership value, strategic vision, and board-level competencies.',
  icon: '👔',
  features: [
    'Executive summary and personal branding',
    'Board presentation and leadership narrative',
    'Strategic accomplishment quantification',
    'C-suite language and positioning',
    'Unlimited revisions and white-glove service',
  ],
  cta: { text: 'Learn More', href: '/contact' },
},
```

## Managing FAQs

### FAQ Best Practices

1. **Order by importance:** Most common questions first
2. **Keep answers concise:** 2-4 sentences when possible
3. **Use conversational tone:** Professional but approachable
4. **Link to other pages:** Guide users to relevant content

### Example FAQ Entry

```typescript
{
  question: 'Do you offer rush services?',
  answer: 'Yes, we offer expedited delivery for urgent career transitions. Rush services include a 3-5 business day turnaround with the same rigorous research and ownership transfer process. Additional fees apply. Contact us to discuss your timeline.',
},
```

## Customizing Colors & Styles

### Changing Brand Colors

**File:** `tailwind.config.ts`

**Current colors:**
```typescript
colors: {
  navy: {
    DEFAULT: '#1a2332',
    // ... shades
  },
  gold: {
    DEFAULT: '#d4af37',
    // ... shades
  },
}
```

**To change primary colors:**
1. Update the DEFAULT value
2. Keep shade variations consistent
3. Rebuild to see changes

### Modifying Typography

**File:** `tailwind.config.ts` (fonts) and `app/globals.css` (sizes)

**To change heading size:**
```css
h1 {
  @apply text-4xl md:text-5xl lg:text-6xl;
}
```

## Adding Team Members

### Creating Team Section (About Page)

1. Open `app/about/page.tsx`
2. Add a new section after the philosophy:

```typescript
{/* Team Section */}
<section className="section-padding bg-white">
  <Container>
    <h2 className="text-center mb-12">Meet Our Team</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card>
        <CardHeader>
          <CardTitle as="h3">Your Name</CardTitle>
          <p className="text-sm text-gold">Founder & Lead Resume Strategist</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Brief bio and credentials (only verified information).
          </p>
        </CardContent>
      </Card>
    </div>
  </Container>
</section>
```

## Future Enhancements

### Integrating Form Submissions

**Current:** Form shows success message but doesn't send email

**To connect to email service:**

1. Choose a service:
   - HubSpot (CRM integration)
   - SendGrid (email)
   - Formspree (simple)
   - Netlify Forms

2. Edit `components/sections/ContactForm.tsx`
3. Update `handleSubmit` function to call your API

**Example with Formspree:**
```typescript
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);

  const formData = new FormData(e.currentTarget);

  try {
    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      setIsSuccess(true);
    } else {
      setError('Failed to send message. Please try again.');
    }
  } catch (error) {
    setError('Failed to send message. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

### Adding Google Analytics

1. Get Google Analytics ID (starts with G-)
2. Create `.env.local`:
   ```env
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
3. Add to `app/layout.tsx` (before closing `</head>`):
   ```typescript
   {process.env.NEXT_PUBLIC_GA_ID && (
     <>
       <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
       <script dangerouslySetInnerHTML={{
         __html: `
           window.dataLayer = window.dataLayer || [];
           function gtag(){dataLayer.push(arguments);}
           gtag('js', new Date());
           gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
         `
       }} />
     </>
   )}
   ```

### Adding a Blog

1. Create `app/blog/page.tsx` (blog listing)
2. Create `app/blog/[slug]/page.tsx` (individual posts)
3. Store posts as MDX files or use a CMS
4. See Next.js documentation for MDX setup

## Common Tasks

### Update Contact Email

**File:** `components/layout/Footer.tsx` (line ~85)
```typescript
<a href="mailto:info@southwestresumes.com">
  info@southwestresumes.com
</a>
```

Also update in:
- `app/contact/page.tsx`

### Change Tagline

**Files:**
- `app/layout.tsx` (metadata)
- `app/page.tsx` (hero)
- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`

Search for "Your Career, Elevated" and replace

### Add New Page

1. Create new directory: `app/new-page/`
2. Add `page.tsx`:
   ```typescript
   import Hero from '@/components/sections/Hero';
   import Container from '@/components/layout/Container';
   import type { Metadata } from 'next';

   export const metadata: Metadata = {
     title: 'Page Title',
     description: 'Page description',
   };

   export default function NewPage() {
     return (
       <>
         <Hero
           title="Page Title"
           description="Page description"
         />
         <section className="section-padding bg-white">
           <Container>
             {/* Your content */}
           </Container>
         </section>
       </>
     );
   }
   ```
3. Add to navigation in `components/layout/Header.tsx`
4. Add to sitemap in `app/sitemap.ts`

### Update Meta Descriptions (SEO)

Each page has metadata at the top:

```typescript
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description for search engines (under 160 characters)',
};
```

**Best practices:**
- Title: 50-60 characters
- Description: 150-160 characters
- Include target keywords naturally
- Make it compelling (encourages clicks)

## Testing Changes

### Before Deploying

1. **Type check:**
   ```bash
   npm run type-check
   ```

2. **Lint:**
   ```bash
   npm run lint
   ```

3. **Build:**
   ```bash
   npm run build
   ```

4. **Preview:**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000)

### After Deploying

1. Check all pages load
2. Test forms and links
3. Verify on mobile device
4. Check SEO with [Google Search Console](https://search.google.com/search-console)

## Getting Help

### Common Errors

**"Cannot find module '@/components/...'"**
- Check file path is correct
- Restart dev server: `npm run dev`

**"Property 'X' does not exist"**
- TypeScript type error
- Check prop names match component interface

**"Build failed"**
- Check for syntax errors
- Review terminal output for line numbers

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

### Support

For complex changes or technical issues:
- Review [README.md](./README.md)
- Check [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
- Hire a Next.js developer for major features

---

Remember: Always test locally before deploying to production!
