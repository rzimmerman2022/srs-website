# Schema.org Structured Data Implementation Guide
**Southwest Resume Services - SEO Enhancement**
**Date:** December 21, 2025

This guide provides complete implementation instructions for adding Schema.org structured data to improve search engine visibility and rich snippet eligibility.

---

## Overview

Structured data helps search engines understand your content and can result in:
- Rich snippets in search results
- Enhanced local business visibility
- FAQ accordion displays in SERPs
- Service listings with pricing
- Star ratings and review counts

---

## 1. LocalBusiness Schema (Root Layout)

**File:** `/staging/app/layout.tsx`
**Priority:** CRITICAL
**Impact:** Local SEO, rich snippets, Google Business Profile integration

### Implementation

Add this script tag inside the `<head>` section, after the Google Analytics scripts:

```tsx
{/* LocalBusiness Schema */}
<Script
  id="schema-local-business"
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://southwestresumes.com',
      name: 'Southwest Resume Services',
      image: 'https://southwestresumes.com/og-image.jpg',
      description: 'Premium career services and resume optimization based in Arizona. Expert resume writing, LinkedIn optimization, interview coaching, and career strategy to elevate your professional journey.',
      url: 'https://southwestresumes.com',
      telephone: '+14803743418',
      email: 'info@southwestresumes.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Arizona',
        addressRegion: 'AZ',
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        addressCountry: 'US',
      },
      areaServed: [
        {
          '@type': 'State',
          name: 'Arizona',
        },
        {
          '@type': 'Country',
          name: 'United States',
        },
      ],
      priceRange: '$$',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: '3',
        bestRating: '5',
        worstRating: '1',
      },
      sameAs: [
        'https://www.google.com/search?q=Southwest+Resume+Services',
      ],
    }),
  }}
/>
```

### Location in File

Insert after line 126 (after Google Analytics scripts, before closing `</head>`):

```tsx
        )}
      </head>
      <body suppressHydrationWarning>
```

Becomes:

```tsx
        )}
        {/* LocalBusiness Schema */}
        <Script
          id="schema-local-business"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              // ... schema object here
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning>
```

---

## 2. FAQPage Schema

**File:** `/staging/app/faq/page.tsx`
**Priority:** HIGH
**Impact:** FAQ rich snippets in search results

### Implementation

Add the schema script at the component level:

```tsx
export default function FAQPage() {
  // Generate FAQ schema from existing faqItems
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Hero
        title="Frequently Asked Questions"
        subtitle="Get Answers"
        description="Common questions about our services, process, and approach. Don't see your question? Contact us directly."
        primaryCTA={{ text: 'Contact Us', href: '/contact' }}
      />
      {/* Rest of component unchanged */}
    </>
  );
}
```

### Complete Updated File

Replace the entire `export default function FAQPage()` section with:

```tsx
export default function FAQPage() {
  // Generate FAQ schema from existing faqItems
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      {/* FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Hero
        title="Frequently Asked Questions"
        subtitle="Get Answers"
        description="Common questions about our services, process, and approach. Don't see your question? Contact us directly."
        primaryCTA={{ text: 'Contact Us', href: '/contact' }}
      />

      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <FAQ items={faqItems} />
          </div>
        </Container>
      </section>

      {/* Still Have Questions */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4">Still Have Questions?</h2>
            <p className="text-lg text-gray-700 mb-8">
              We&apos;re here to help. Reach out and we&apos;ll provide detailed answers tailored
              to your specific situation.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Get in Touch
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
```

---

## 3. Service Schema

**File:** `/staging/app/services/page.tsx`
**Priority:** HIGH
**Impact:** Service rich snippets with pricing

### Implementation

Add at the beginning of the component:

```tsx
export default function ServicesPage() {
  // Service schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Career Services',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Southwest Resume Services',
      url: 'https://southwestresumes.com',
      telephone: '+14803743418',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Arizona',
        addressRegion: 'AZ',
        addressCountry: 'US',
      },
    },
    areaServed: [
      {
        '@type': 'State',
        name: 'Arizona',
      },
      {
        '@type': 'Country',
        name: 'United States',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Career Services & Packages',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Essentials Package',
            description: 'Professional resume writing and ATS optimization.',
          },
          price: '150',
          priceCurrency: 'USD',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Accelerator Package',
            description: 'Enhanced resume with market research and LinkedIn optimization.',
          },
          price: '300',
          priceCurrency: 'USD',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Career Launch Package',
            description: 'Comprehensive resume, LinkedIn, cover letter, and interview prep.',
          },
          price: '449',
          priceCurrency: 'USD',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Executive Package',
            description: 'White-glove service for senior leaders with personal branding.',
          },
          price: '500',
          priceCurrency: 'USD',
        },
      ],
    },
  };

  return (
    <>
      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero Section */}
      <section className="relative bg-navy overflow-hidden">
        {/* Rest of component unchanged */}
```

---

## 4. BreadcrumbList Schema

**Priority:** MEDIUM
**Impact:** Better navigation breadcrumbs in search results

### Implementation Strategy

Create a reusable breadcrumb schema helper:

**File:** `/staging/lib/schema.ts` (new file)

```typescript
/**
 * Schema.org helper functions
 */

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

### Usage in Pages

**Example for Services page:**

```tsx
import { generateBreadcrumbSchema } from '@/lib/schema';

export default function ServicesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://southwestresumes.com' },
    { name: 'Services', url: 'https://southwestresumes.com/services' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Rest of component */}
    </>
  );
}
```

**Apply to these pages:**
- `/services` - Home > Services
- `/process` - Home > Process
- `/about` - Home > About
- `/results` - Home > Results
- `/faq` - Home > FAQ
- `/contact` - Home > Contact
- `/methodology` - Home > Methodology

---

## 5. Review Schema (Optional Enhancement)

**File:** `/staging/app/page.tsx` (Homepage)
**Priority:** LOW-MEDIUM
**Impact:** Review rich snippets

### Implementation

Add to the "Verified Proof" section where reviews are displayed:

```tsx
const reviewsSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    {
      '@type': 'Review',
      '@id': 'https://southwestresumes.com/#review-1',
      itemReviewed: {
        '@type': 'LocalBusiness',
        name: 'Southwest Resume Services',
        url: 'https://southwestresumes.com',
      },
      author: {
        '@type': 'Person',
        name: 'Lisa W.',
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      reviewBody: 'I was very impressed with the time and effort Ryan at Southwest Resume Services took to revise my current resume. His initial questionnaire helped provide a foundation...',
    },
    {
      '@type': 'Review',
      '@id': 'https://southwestresumes.com/#review-2',
      itemReviewed: {
        '@type': 'LocalBusiness',
        name: 'Southwest Resume Services',
        url: 'https://southwestresumes.com',
      },
      author: {
        '@type': 'Person',
        name: 'Carie L.',
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      reviewBody: 'I am so thankful I found Ryan. He was very helpful and made this process easy for me. He knows the questions to ask and I felt that I was in great hands...',
    },
  ],
};
```

---

## 6. Validation & Testing

### Google Rich Results Test

After implementation, test each page:

1. Go to: https://search.google.com/test/rich-results
2. Enter your page URL or paste the HTML
3. Verify no errors or warnings

**Pages to Test:**
- Homepage (LocalBusiness + Reviews)
- /services (Service schema)
- /faq (FAQPage schema)
- Any page with BreadcrumbList

### Schema Markup Validator

Alternative validator:
- https://validator.schema.org/

### Expected Results

**LocalBusiness:**
- Name, address, phone visible
- Rating/review count displayed
- Business hours (if added)

**FAQPage:**
- Expandable FAQ accordion in search results
- Direct answers to questions

**Service:**
- Service listings with prices
- "Starting at $150" type displays

**BreadcrumbList:**
- Breadcrumb trail in search results
- Home > Services navigation

---

## 7. Monitoring & Maintenance

### Google Search Console

After implementation:
1. Submit sitemap in Google Search Console
2. Monitor "Enhancements" section for rich results
3. Track impressions and clicks on rich snippets

### Update Schedule

**Update schemas when:**
- Pricing changes (Service schema)
- New FAQ added (FAQPage schema)
- Contact info changes (LocalBusiness schema)
- New reviews received (Review schema)
- New services added (Service schema)

### Performance Tracking

Monitor in Google Search Console:
- Rich result impressions
- Click-through rate changes
- Average position improvements
- Core Web Vitals (ensure schemas don't impact performance)

---

## 8. Implementation Checklist

### Critical (Do First)
- [ ] Add LocalBusiness schema to layout.tsx
- [ ] Add FAQPage schema to faq/page.tsx
- [ ] Add Service schema to services/page.tsx
- [ ] Test with Google Rich Results Test

### High Priority
- [ ] Create schema.ts helper file
- [ ] Add BreadcrumbList to all main pages
- [ ] Validate all schemas with schema.org validator

### Optional Enhancements
- [ ] Add Review schema to homepage
- [ ] Add Organization schema
- [ ] Add Article schema for blog posts (if added)

---

## 9. Code Quality Notes

### Best Practices
1. Always use `dangerouslySetInnerHTML` with `JSON.stringify()` for schema
2. Add unique `id` attributes to script tags
3. Keep schema data in sync with actual page content
4. Test in both development and production environments

### Common Pitfalls to Avoid
1. Don't fabricate review data - only use real reviews
2. Don't set incorrect business types (LocalBusiness is correct, not ProfessionalService)
3. Don't forget to escape special characters in text fields
4. Don't use placeholder data in production

---

## 10. Expected Timeline

**Week 1:**
- Implement critical schemas (LocalBusiness, FAQPage, Service)
- Validate with Google Rich Results Test
- Submit updated sitemap to Google Search Console

**Week 2-3:**
- Google begins crawling and indexing schemas
- Initial rich results may appear

**Week 4-8:**
- Rich results stabilize
- Monitor performance improvements
- Add optional enhancements (BreadcrumbList, Reviews)

**Long-term:**
- Quarterly schema audits
- Update data as business evolves
- Monitor Google Search Console for schema errors

---

## 11. Troubleshooting

### Schema Not Appearing in Search Results

**Possible Causes:**
1. Google hasn't re-crawled the page yet (wait 1-2 weeks)
2. Schema has validation errors (check Rich Results Test)
3. Content doesn't meet Google's quality guidelines
4. Page isn't indexed yet (check Google Search Console)

**Solutions:**
1. Request indexing in Google Search Console
2. Fix validation errors
3. Ensure schema matches visible page content
4. Wait for Google to process (can take 2-4 weeks)

### Validation Errors

**Common errors:**
- Missing required fields (name, url, etc.)
- Incorrect data types (string vs number)
- Invalid URLs (missing https://)
- Mismatched quotes in JSON

**How to fix:**
1. Copy error message from Rich Results Test
2. Locate the problematic field
3. Refer to schema.org documentation
4. Test again after fixing

---

## Support Resources

- Schema.org Documentation: https://schema.org/
- Google Search Central: https://developers.google.com/search/docs/appearance/structured-data
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema Markup Validator: https://validator.schema.org/

---

**Implementation Guide Version:** 1.0
**Last Updated:** December 21, 2025
**Next Review:** After implementation complete
