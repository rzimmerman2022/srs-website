import Container from '@/components/layout/Container';
import TrustBadge, { MetricBadge } from '@/components/ui/TrustBadge';

// Icons
const IconStar = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const IconChart = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const IconDatabase = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

const IconMapPin = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconShield = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const IconCheckCircle = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconUsers = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const IconClock = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconDocument = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default function TrustSection() {
  return (
    <section className="py-10 md:py-12 bg-white border-b border-sand-100">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-navy mb-2">
            Why Clients Trust Us
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Research-backed methodology, verified reviews, and Arizona-based expertise
          </p>
        </div>

        {/* Trust Badges Row */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10">
          {/* Google Reviews */}
          <TrustBadge
            icon={<IconStar />}
            label="5.0 on Google"
            sublabel="Verified Reviews"
            variant="review"
            href="https://www.google.com/search?q=Southwest+Resume+Services"
          />

          {/* Research Validated */}
          <TrustBadge
            icon={<IconChart />}
            label="Research Validated"
            sublabel="RAI ≥7.0 Standard"
            variant="methodology"
          />

          {/* O*NET Data */}
          <TrustBadge
            icon={<IconDatabase />}
            label="O*NET + BLS Data"
            sublabel="Federal Sources"
            variant="methodology"
          />

          {/* Arizona Local */}
          <TrustBadge
            icon={<IconMapPin />}
            label="Arizona Local"
            sublabel="Phoenix Metro"
            variant="local"
          />

          {/* Ownership Verified */}
          <TrustBadge
            icon={<IconShield />}
            label="Ownership Verified"
            sublabel="Truth Bridge Protocol"
            variant="methodology"
          />
        </div>

        {/* Metrics Row */}
        <div className="bg-sand-50 rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <MetricBadge
              icon={<IconDocument />}
              value="200+"
              label="Job Postings Analyzed Per Client"
            />
            <MetricBadge
              icon={<IconDatabase />}
              value="8+"
              label="Research Sources Used"
            />
            <MetricBadge
              icon={<IconCheckCircle />}
              value="100%"
              label="Ownership Guarantee"
            />
            <MetricBadge
              icon={<IconUsers />}
              value="Arizona"
              label="Based & Operated"
            />
          </div>
        </div>

        {/* Additional credibility note */}
        <p className="text-center text-xs text-gray-500 mt-6 max-w-xl mx-auto">
          All enhancements validated against O*NET occupational standards and BLS labor market data.
          We never fabricate credentials or exaggerate claims.
        </p>
      </Container>
    </section>
  );
}
