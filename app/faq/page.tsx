import Link from 'next/link';
import Script from 'next/script';
import Hero from '@/components/sections/Hero';
import FAQ, { FAQItem } from '@/components/sections/FAQ';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Southwest Resume Services',
  description:
    'Common questions about our career services, process, timelines, pricing, and approach. Get answers to your questions about Southwest Resume Services.',
  openGraph: {
    title: 'FAQ | Southwest Resume Services',
    description:
      'Common questions about resume writing, career coaching, timelines, pricing, and our research-backed approach.',
    url: 'https://southwestresumes.com/faq',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Southwest Resume Services - Frequently Asked Questions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ | Southwest Resume Services',
    description:
      'Common questions about resume writing, career coaching, timelines, and pricing.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://southwestresumes.com/faq',
  },
};

const faqItems: FAQItem[] = [
  {
    question: 'What makes Southwest Resume Services different from other resume writers?',
    answer:
      'We combine rigorous research methodology with deep psychological insight. Every enhancement is validated through authoritative sources (O*NET, BLS, Lightcast) and measured using our Research Authority Index (RAI). More importantly, we don\'t just write resumes—we help you genuinely own every word through our Truth Bridge Protocol, ensuring you can confidently defend your document in any interview.',
  },
  {
    question: 'What is the Client Truth Principle?',
    answer:
      '"A resume you can\'t own performs like fiction when it matters most." This foundational principle means we don\'t just create technically accurate documents. We ensure every enhancement feels authentically true to you and that you can defend it confidently when it matters most—in an interview. Our role is straightforward: we bring outside perspective and research methodology. You bring lived experience. Together, we build a narrative you genuinely own.',
  },
  {
    question: 'How long does the process take?',
    answer:
      'The timeline varies based on the service package and complexity of your situation. For standard resume writing, expect 2-3 weeks from initial consultation to final delivery. Complex career transitions requiring Level 4 enhancement and intensive ownership transfer may take 4-6 weeks. We prioritize quality and genuine ownership over speed.',
  },
  {
    question: 'How much do your services cost?',
    answer:
      'Pricing varies based on your specific needs, career level, and the complexity of your situation. Career transitions, non-traditional backgrounds, and situations requiring extensive market research are priced differently than straightforward resume updates. Contact us for a personalized quote based on your unique situation.',
  },
  {
    question: 'Do you guarantee interview results or job placements?',
    answer:
      'We cannot ethically guarantee interviews or job placements, as these outcomes depend on many factors beyond our control (market conditions, competition, employer decisions, interview performance). What we commit to providing is rigorous research methodology, authentic enhancement grounded in your real experience, and comprehensive ownership transfer so you can confidently present yourself.',
  },
  {
    question: 'What is the Research Authority Index (RAI)?',
    answer:
      'RAI is our proprietary validation system that ensures every enhancement is grounded in authoritative sources. It combines Primary Source Score (O*NET, BLS), Industry Validation (LinkedIn, Indeed, Lightcast), and Compliance Checks. We require RAI ≥ 7.0 for Level 3 enhancements and RAI ≥ 8.0 for Level 4 (transformative reframing).',
  },
  {
    question: 'What are enhancement levels?',
    answer:
      'We use a five-level enhancement scale. Level 1 is direct transfer (underselling). Level 2 is conservative professional polish. Levels 3-4 are our optimal zone—strategic expansion and transformative reframing that reveal true value while remaining defensible. Level 5 is prohibited (fabrication). We target 60-70% of enhancements at Levels 3-4 for maximum impact.',
  },
  {
    question: 'Do you work with career changers and non-traditional backgrounds?',
    answer:
      'Yes, this is one of our specialties. Career transitions often require Level 4 enhancement (transformative reframing) and intensive ownership transfer. We use our Three-Context Framework to bridge from your source context to target roles, and our comprehensive market research identifies optimal pathways and required credentials.',
  },
  {
    question: 'How do you handle employment gaps?',
    answer:
      'We use our Skills Maintenance Framework and Gap Narrative Mastery system (3-version framework: Elevator Pitch, Standard Response, Deep Dive). We help you reframe gaps as periods of valuable development and create defensible narratives that highlight maintained or developed skills during the gap period.',
  },
  {
    question: 'Are your resumes ATS-compatible?',
    answer:
      'Yes. ATS parseability is a core requirement of our Ten-Dimensional Quality Framework. We optimize formatting, keyword density (targeting 80%+ match rate for must-have terms), and structure for maximum parseability across major ATS platforms. We also ensure human readability—documents must work for both systems and humans.',
  },
  {
    question: 'Do you write federal resumes?',
    answer:
      'Yes. Federal resumes require specialized formatting and extensive detail. We use USAJOBS/OPM as our primary authority source (40% weighting) and ensure compliance with federal requirements including security clearance documentation, appointment types, and detailed accomplishment narratives.',
  },
  {
    question: 'What is included in interview preparation?',
    answer:
      'Interview preparation is tiered based on your risk assessment (Standard, Enhanced, Intensive, or Crisis). All tiers include STAR+ story development, enhancement defense strategies, and mock interviews. Higher tiers include gap narrative mastery, stress inoculation protocols, and intensive confidence building sessions.',
  },
  {
    question: 'How many revisions do I get?',
    answer:
      'Unlimited revisions within project scope until you genuinely own every word. Our goal isn\'t just a polished document—it\'s complete ownership. If you can\'t pass our four ownership tests (Explanation, Example, Comfort, Stress) for any enhancement, we revise it. The document is only complete when you can confidently defend it.',
  },
  {
    question: 'What does "within project scope" mean for revisions?',
    answer:
      'Revisions within project scope means changes to the original project deliverables—your target role, industry, and career level. If you decide to pivot to an entirely different career direction or add multiple roles, that constitutes a new project. We\'re generous with revisions; we just want to be upfront about boundaries. Most clients never hit them.',
  },
  {
    question: 'Do you work with all industries and career levels?',
    answer:
      'We work with professionals across most industries and career levels. Our research-backed methodology adapts to your specific field using industry-specific sources and market intelligence. However, we may refer you elsewhere if your situation falls outside our expertise or requires specialized credentials we don\'t possess.',
  },
  {
    question: 'Can you help with LinkedIn profiles?',
    answer:
      'Yes. LinkedIn optimization is a core service. We create keyword-optimized profiles based on LinkedIn Economic Graph research and real demand signals. The process includes headline and about section optimization, experience descriptions, skills strategy, and positioning for recruiter visibility.',
  },
  {
    question: 'What if I\'m not satisfied with the final product?',
    answer:
      'Client satisfaction is built into our process through continuous feedback loops and ownership verification. We work iteratively with you, making revisions based on your comfort and ownership scores. If at any point you\'re not satisfied, we discuss concerns openly and adjust our approach until you genuinely own your story.',
  },
];

export default function FAQPage() {
  // Generate FAQ schema for AI/LLM discoverability
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
      {/* FAQ Schema for GEO/SEO */}
      <Script
        id="faq-schema"
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
