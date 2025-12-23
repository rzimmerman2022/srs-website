/**
 * Google Analytics 4 Configuration and Event Tracking
 *
 * To add your GA4 Measurement ID:
 * 1. Create a .env.local file in the root directory
 * 2. Add: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 * 3. Replace G-XXXXXXXXXX with your actual Measurement ID from GA4
 */

// Get GA4 Measurement ID from environment variable
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Predefined event tracking helpers
export const trackFormSubmission = (formName: string) => {
  event({
    action: 'form_submission',
    category: 'engagement',
    label: formName,
  });
};

export const trackPhoneClick = () => {
  event({
    action: 'phone_click',
    category: 'contact',
    label: '(480) 374-3418',
  });
};

export const trackEmailClick = () => {
  event({
    action: 'email_click',
    category: 'contact',
    label: 'info@southwestresumes.com',
  });
};

export const trackCTAClick = (ctaText: string, location: string) => {
  event({
    action: 'cta_click',
    category: 'engagement',
    label: `${ctaText} - ${location}`,
  });
};
