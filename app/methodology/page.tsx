/**
 * Methodology Explainer Page
 * Date: 2025-12-21
 * Buyer-friendly translation of SRS research methodology
 */

import Link from 'next/link';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Methodology | Southwest Resume Services',
  description:
    'Discover the research-backed methodology that ensures every claim on your resume is authentic, defensible, and strategically positioned.',
};

// SVG Icons - reusing patterns from services page
const IconShield = () => (
  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const IconSearch = () => (
  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const IconScale = () => (
  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
  </svg>
);

const IconPath = () => (
  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const IconCheckCircle = () => (
  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconDatabase = () => (
  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
  </svg>
);

const IconCheck = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);

const IconArrowRight = () => (
  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export default function MethodologyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-navy overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Top Right Gold Glow */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/10 rounded-full blur-[120px] transform translate-x-1/3 -translate-y-1/3 opacity-60" />
          {/* Bottom Left Blue Glow */}
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] transform -translate-x-1/3 translate-y-1/3 opacity-40" />
        </div>

        <Container className="relative z-10 section-padding">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block px-6 py-2 rounded-full bg-white/5 text-gold text-sm font-semibold mb-8 border border-white/10 backdrop-blur-md shadow-lg animate-fade-in-up">
              Our Methodology
            </div>

            <h1 className="mb-8 text-white text-5xl md:text-6xl lg:text-7xl leading-tight font-serif tracking-tight drop-shadow-lg">
              Research-Backed Truth{' '}
              <span className="text-gold">Revelation</span>
            </h1>

            <p className="text-xl md:text-2xl text-sand-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light text-balance opacity-90">
              Every claim validated. Every enhancement defensible. Every word authentically yours.
            </p>

            <p className="text-lg text-sand-200 max-w-2xl mx-auto">
              This is why your investment delivers results that last beyond the first interview.
            </p>
          </div>
        </Container>
      </section>

      {/* Why Methodology Matters */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-6 text-center">Why Methodology Matters</h2>
            <div className="prose prose-lg max-w-none text-charcoal/80">
              <p className="text-xl text-center mb-8">
                Anyone can write compelling bullet points. The question is: Can you defend them under pressure?
              </p>
              <p>
                Our research-backed methodology ensures every enhancement passes four critical tests:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="bg-sand-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-navy mb-2">Can you explain it?</h3>
                  <p className="text-sm text-charcoal/70">
                    You understand the thinking behind every claim.
                  </p>
                </div>
                <div className="bg-sand-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-navy mb-2">Can you provide examples?</h3>
                  <p className="text-sm text-charcoal/70">
                    You have specific stories and evidence ready.
                  </p>
                </div>
                <div className="bg-sand-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-navy mb-2">Does it feel comfortable?</h3>
                  <p className="text-sm text-charcoal/70">
                    You rate your comfort level at 7+ out of 10.
                  </p>
                </div>
                <div className="bg-sand-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-navy mb-2">Can you handle stress?</h3>
                  <p className="text-sm text-charcoal/70">
                    You can defend it even when challenged.
                  </p>
                </div>
              </div>
              <p className="font-semibold text-navy text-center">
                This is the difference between a resume that gets interviews and a resume that gets offers.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Core Methodology Components */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="text-center mb-12">
            <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-4">
              The Foundation
            </p>
            <h2 className="mb-4">How We Validate Every Claim</h2>
            <p className="text-charcoal/70 max-w-2xl mx-auto">
              Our methodology combines rigorous research with psychological insight to create documents you can genuinely own.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Research Authority Index */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold mb-6">
                <IconShield />
              </div>
              <h3 className="text-xl font-serif font-semibold text-navy mb-3">
                Research Authority Index
              </h3>
              <p className="text-charcoal/70 mb-4">
                Every strategic enhancement is validated against authoritative sources and scored for defensibility.
              </p>
              <div className="bg-sand-50 p-4 rounded-lg mb-4">
                <div className="text-sm font-mono text-navy mb-2">
                  Standard Enhancement: Score 7.0+
                </div>
                <div className="text-sm font-mono text-navy">
                  Transformative Reframe: Score 8.0+
                </div>
              </div>
              <p className="text-sm text-charcoal/80">
                This ensures your resume is both compelling and completely defensible.
              </p>
            </div>

            {/* Multi-Source Validation */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold mb-6">
                <IconSearch />
              </div>
              <h3 className="text-xl font-serif font-semibold text-navy mb-3">
                Multi-Source Validation Stack
              </h3>
              <p className="text-charcoal/70 mb-4">
                We don&apos;t rely on a single source. Every claim is cross-validated through multiple authoritative databases.
              </p>
              <ul className="space-y-2 text-sm text-charcoal/70">
                <li className="flex items-start gap-2">
                  <IconCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span><strong>O*NET:</strong> Federal occupational database (10/10 authority)</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span><strong>BLS OEWS:</strong> Bureau of Labor Statistics wage/employment data</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span><strong>Lightcast:</strong> Commercial labor market intelligence</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span><strong>LinkedIn/Indeed:</strong> Real-time market signals</span>
                </li>
              </ul>
            </div>

            {/* Enhancement Scale */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold mb-6">
                <IconScale />
              </div>
              <h3 className="text-xl font-serif font-semibold text-navy mb-3">
                Five-Level Enhancement Scale
              </h3>
              <p className="text-charcoal/70 mb-4">
                A calibration system that ensures strategic positioning without crossing into fiction.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <span className="text-charcoal/80">Level 1-2: Minimal enhancement</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold"></div>
                  <span className="text-navy font-medium">Level 3-4: Optimal zone (target)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-charcoal/80">Level 5: Prohibited (fabrication)</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Five-Level Enhancement Scale - Detailed */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-4">
                The Calibration System
              </p>
              <h2 className="mb-4">Understanding Enhancement Levels</h2>
              <p className="text-charcoal/70 max-w-2xl mx-auto">
                Not all enhancements are created equal. Here&apos;s how we ensure strategic impact while maintaining absolute integrity.
              </p>
            </div>

            <div className="space-y-6">
              {/* Level 1 */}
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border-l-4 border-gray-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-navy mb-2">Level 1: Direct Transcription</h3>
                    <p className="text-charcoal/70 mb-3">
                      Your exact words, minimally formatted. Baseline truth with no strategic positioning.
                    </p>
                    <div className="bg-white p-3 rounded border border-gray-200 text-sm text-charcoal/80 italic">
                      Example: &quot;Answered customer emails and processed orders&quot;
                    </div>
                  </div>
                </div>
              </div>

              {/* Level 2 */}
              <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border-l-4 border-blue-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-navy mb-2">Level 2: Professional Translation</h3>
                    <p className="text-charcoal/70 mb-3">
                      Industry-standard language with basic quantification. Still conservative positioning.
                    </p>
                    <div className="bg-white p-3 rounded border border-blue-200 text-sm text-charcoal/80 italic">
                      Example: &quot;Managed customer communications and order fulfillment (20+ daily interactions)&quot;
                    </div>
                  </div>
                </div>
              </div>

              {/* Level 3 - OPTIMAL */}
              <div className="bg-gradient-to-r from-gold/10 to-white p-6 rounded-xl border-l-4 border-gold shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-navy font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-navy">Level 3: Strategic Enhancement</h3>
                      <span className="px-3 py-1 bg-gold text-navy text-xs font-bold rounded-full">OPTIMAL ZONE</span>
                    </div>
                    <p className="text-charcoal/70 mb-3">
                      Research-validated expansion that reveals true scope and impact. Requires evidence bridge.
                    </p>
                    <div className="bg-white p-3 rounded border border-gold text-sm text-charcoal/80 italic mb-2">
                      Example: &quot;Orchestrated customer experience touchpoints across email, chat, and order management systems, maintaining 95% satisfaction rating&quot;
                    </div>
                    <p className="text-sm text-charcoal/80">
                      Requires Research Authority Index (RAI) 7.0+ for validation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Level 4 - OPTIMAL */}
              <div className="bg-gradient-to-r from-gold/10 to-white p-6 rounded-xl border-l-4 border-gold shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-navy font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-navy">Level 4: Transformative Reframe</h3>
                      <span className="px-3 py-1 bg-gold text-navy text-xs font-bold rounded-full">OPTIMAL ZONE</span>
                    </div>
                    <p className="text-charcoal/70 mb-3">
                      Pattern recognition that reveals broader implications and system-level thinking. Requires strong evidence.
                    </p>
                    <div className="bg-white p-3 rounded border border-gold text-sm text-charcoal/80 italic mb-2">
                      Example: &quot;Designed and implemented customer retention protocol that reduced churn by 23% through proactive engagement strategy&quot;
                    </div>
                    <p className="text-sm text-charcoal/80">
                      Requires Research Authority Index (RAI) 8.0+ and strong ownership transfer.
                    </p>
                  </div>
                </div>
              </div>

              {/* Level 5 - PROHIBITED */}
              <div className="bg-gradient-to-r from-red-50 to-white p-6 rounded-xl border-l-4 border-red-500">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold flex-shrink-0">
                    5
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-navy">Level 5: Fabrication</h3>
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">PROHIBITED</span>
                    </div>
                    <p className="text-charcoal/70 mb-3">
                      Claims that cannot be traced back to genuine experience. We never operate at this level.
                    </p>
                    <div className="bg-red-50 p-3 rounded border border-red-200 text-sm text-red-700 font-medium">
                      This zone represents fabrication and is strictly prohibited in our methodology.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-navy/5 p-6 rounded-xl">
              <p className="text-center text-charcoal/80 font-medium">
                <strong className="text-navy">Our Target:</strong> We operate exclusively in Levels 3-4,
                where strategic enhancement meets complete defensibility.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Truth Bridge Protocol */}
      <section className="section-padding bg-navy text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[80px] transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-4">
                Ownership Transfer
              </p>
              <h2 className="mb-4 text-white">The Truth Bridge Protocol</h2>
              <p className="text-sand-200 max-w-2xl mx-auto">
                Our five-phase process ensures you don&apos;t just read your resume—you genuinely believe and can defend every word.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Phase 1 */}
              <div className="glass-dark p-6 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-gold text-navy flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gold mb-3">Discovery</h3>
                <p className="text-sm text-sand-200">
                  Deep investigation into what you actually did, uncovering the complete truth of your experience.
                </p>
              </div>

              {/* Phase 2 */}
              <div className="glass-dark p-6 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-gold text-navy flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gold mb-3">Articulation</h3>
                <p className="text-sm text-sand-200">
                  Translation into strategic professional language that reveals true scope and impact.
                </p>
              </div>

              {/* Phase 3 */}
              <div className="glass-dark p-6 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-gold text-navy flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gold mb-3">Validation</h3>
                <p className="text-sm text-sand-200">
                  Evidence bridge using authoritative research sources to ensure defensibility.
                </p>
              </div>

              {/* Phase 4 */}
              <div className="glass-dark p-6 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-gold text-navy flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gold mb-3">Integration</h3>
                <p className="text-sm text-sand-200">
                  Practice and internalization through story development and evidence preparation.
                </p>
              </div>

              {/* Phase 5 */}
              <div className="glass-dark p-6 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-gold text-navy flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  5
                </div>
                <h3 className="text-lg font-semibold text-gold mb-3">Ownership</h3>
                <p className="text-sm text-sand-200">
                  Genuine belief and confident defense—you own every word completely.
                </p>
              </div>
            </div>

            <div className="mt-12 bg-white/5 p-8 rounded-xl border border-white/10">
              <h3 className="text-xl font-serif font-semibold text-gold mb-4 text-center">
                The Four Ownership Tests
              </h3>
              <p className="text-sand-200 mb-6 text-center">
                Before any enhancement makes it to your final resume, you must pass all four tests:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center text-gold flex-shrink-0">
                    <IconCheckCircle />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Explanation Test</h4>
                    <p className="text-sm text-sand-300">
                      You can explain the reasoning behind every claim in your own words.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center text-gold flex-shrink-0">
                    <IconCheckCircle />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Example Test</h4>
                    <p className="text-sm text-sand-300">
                      You have specific stories and concrete evidence ready to share.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center text-gold flex-shrink-0">
                    <IconCheckCircle />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Comfort Test</h4>
                    <p className="text-sm text-sand-300">
                      You rate your comfort at 7+ out of 10 when discussing this claim.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center text-gold flex-shrink-0">
                    <IconCheckCircle />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Stress Test</h4>
                    <p className="text-sm text-sand-300">
                      You can defend this claim confidently even when challenged or skeptical.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Research Sources */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-4">
                Data Sources
              </p>
              <h2 className="mb-4">Authoritative Research Foundations</h2>
              <p className="text-charcoal/70 max-w-2xl mx-auto">
                We validate every enhancement against multiple authoritative sources to ensure complete defensibility.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                {
                  name: 'O*NET',
                  description: 'Federal occupational database',
                  score: '10/10 Authority'
                },
                {
                  name: 'BLS OEWS',
                  description: 'Bureau of Labor Statistics',
                  score: 'Government Source'
                },
                {
                  name: 'Lightcast',
                  description: 'Labor market intelligence',
                  score: '76/100 Authority'
                },
                {
                  name: 'LinkedIn',
                  description: 'Economic Graph data',
                  score: 'Real-time Signals'
                },
                {
                  name: 'Indeed',
                  description: 'Job posting analysis',
                  score: 'Market Demand'
                },
                {
                  name: 'CareerOneStop',
                  description: 'DOL portal',
                  score: 'Government Source'
                },
                {
                  name: 'College Scorecard',
                  description: 'Education outcomes',
                  score: 'ROI Analysis'
                },
                {
                  name: 'Credential Engine',
                  description: 'Certification data',
                  score: 'Credential Validation'
                },
              ].map((source, index) => (
                <div
                  key={index}
                  className="glass text-center p-6 rounded-xl hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold">
                    <IconDatabase />
                  </div>
                  <div className="font-semibold text-navy mb-1">{source.name}</div>
                  <div className="text-xs text-charcoal/80 mb-2">{source.description}</div>
                  <div className="text-xs font-mono text-gold">{source.score}</div>
                </div>
              ))}
            </div>

            <div className="bg-sand-50 p-8 rounded-xl">
              <h3 className="text-xl font-serif font-semibold text-navy mb-4 text-center">
                Multi-Source Validation Process
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gold text-navy flex items-center justify-center font-bold text-2xl mx-auto mb-3">
                    1
                  </div>
                  <h4 className="font-semibold text-navy mb-2">Primary Source</h4>
                  <p className="text-sm text-charcoal/70">
                    O*NET or BLS validation of core occupational tasks and skills
                  </p>
                  <div className="text-xs font-mono text-gold mt-2">Weight: 50%</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gold text-navy flex items-center justify-center font-bold text-2xl mx-auto mb-3">
                    2
                  </div>
                  <h4 className="font-semibold text-navy mb-2">Industry Validation</h4>
                  <p className="text-sm text-charcoal/70">
                    Lightcast, LinkedIn, or Indeed confirmation of market relevance
                  </p>
                  <div className="text-xs font-mono text-gold mt-2">Weight: 30%</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gold text-navy flex items-center justify-center font-bold text-2xl mx-auto mb-3">
                    3
                  </div>
                  <h4 className="font-semibold text-navy mb-2">Compliance Check</h4>
                  <p className="text-sm text-charcoal/70">
                    Geographic, temporal, and context-specific validation
                  </p>
                  <div className="text-xs font-mono text-gold mt-2">Weight: 20%</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Why This Investment Is Worth It */}
      <section className="section-padding bg-sand-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">Why This Investment Is Worth It</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold mb-4">
                  <IconPath />
                </div>
                <h3 className="text-xl font-serif font-semibold text-navy mb-3">
                  Beyond the First Interview
                </h3>
                <p className="text-charcoal/70">
                  Other services optimize for ATS and initial screenings. We optimize for the moment when
                  someone looks you in the eye and asks, &quot;Tell me about this project you led.&quot;
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold mb-4">
                  <IconShield />
                </div>
                <h3 className="text-xl font-serif font-semibold text-navy mb-3">
                  Confidence Under Pressure
                </h3>
                <p className="text-charcoal/70">
                  When you genuinely own every enhancement, your confidence shows. Hiring managers
                  can sense the difference between rehearsed answers and authentic expertise.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold mb-4">
                  <IconScale />
                </div>
                <h3 className="text-xl font-serif font-semibold text-navy mb-3">
                  Career-Long Value
                </h3>
                <p className="text-charcoal/70">
                  The ownership transfer process doesn&apos;t just improve your resume—it fundamentally
                  changes how you understand and articulate your professional value.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold mb-4">
                  <IconCheckCircle />
                </div>
                <h3 className="text-xl font-serif font-semibold text-navy mb-3">
                  Zero Regret Risk
                </h3>
                <p className="text-charcoal/70">
                  You&apos;ll never worry about background checks, reference calls, or follow-up questions.
                  Every claim is traceable back to genuine experience.
                </p>
              </div>
            </div>

            <div className="bg-navy p-8 rounded-xl text-center">
              <p className="text-xl text-sand-100 font-serif mb-4">
                &quot;This is the difference between a resume that gets interviews and a resume that gets offers.&quot;
              </p>
              <p className="text-sand-300 text-sm">
                Our methodology ensures you succeed at both.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-gold to-transparent"></div>
        </div>
        <Container>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-white mb-6">Experience Research-Backed Results</h2>
            <p className="text-lg text-sand-200 mb-8">
              Let&apos;s apply our methodology to your career story. Every claim validated. Every word authentically yours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/contact" variant="primary" size="lg" className="group">
                Get Started Today
                <IconArrowRight />
              </Button>
              <Button href="/services" variant="outline" size="lg">
                View Packages
              </Button>
            </div>
            <p className="text-sm text-sand-300 mt-6">
              Not sure which package is right for you?{' '}
              <Link href="/contact" className="text-gold font-medium hover:underline">
                Schedule a free consultation
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
