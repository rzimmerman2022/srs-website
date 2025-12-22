/**
 * Single source of truth for Google Reviews
 * All reviews are verbatim from Google Business Profile
 * NEVER edit or fabricate - these must match Google exactly
 */

export interface Review {
  id: string;
  name: string;
  sourceLabel: string;
  excerpt: string;
  eligible: boolean; // Safe to display (no material connection, no outcome claims)
  tags?: string[]; // For categorization: 'method', 'executive', 'process', etc.
}

// Links
export const GOOGLE_REVIEWS_URL = 'https://share.google/5ETFwn3c9dj1TQwve'; // Read reviews
export const LEAVE_REVIEW_URL = 'https://g.page/r/Cd0yeUAKZcz3EAI/review'; // Leave a review

// Rating data
export const RATING = '5.0';
export const REVIEW_COUNT = 5;

// All reviews - verbatim from Google (newest first)
export const reviews: Review[] = [
  {
    id: 'andrew',
    name: 'Andrew Beam',
    sourceLabel: 'Google Review',
    excerpt: 'Changing careers halfway through my life was something I never thought I\'d be doing and Southwest Resume Services helped me find a clear pathway to my goal. The attention to detail they gave my case was out of this world and their process is so straightforward. Highly recommend!',
    eligible: false, // Material connection (intern) - FTC disclosure required
  },
  {
    id: 'douglas',
    name: 'Douglas Holden',
    sourceLabel: 'Google Review',
    excerpt: 'Phenomenal experience. Ryan was beyond thorough and attentive. His commitment to his clients is unmatched. I would recommend Southwest Resume services 10/10 times to friends and colleagues looking to build their executive profile. I cannot say enough about Ryan and the services provided.',
    eligible: true,
    tags: ['executive', 'authority', 'quality'],
  },
  {
    id: 'jordyn',
    name: 'Jordyn G.',
    sourceLabel: 'Google Review',
    excerpt: 'I had an amazing experience! My resume looks flawless and Ryan utilized AI to write a letter to my employer that gave me a raise! Highly recommend.',
    eligible: false, // Material connection (girlfriend) + outcome claim - FTC risk
  },
  {
    id: 'carie',
    name: 'Carie L.',
    sourceLabel: 'Google Review',
    excerpt: 'He knows the questions to ask and I felt that I was in great hands.',
    eligible: true,
    tags: ['method', 'ip', 'trust'],
  },
  {
    id: 'lisa',
    name: 'Lisa W.',
    sourceLabel: 'Google Review',
    excerpt: 'I was very impressed with the time and effort Ryan at Southwest Resume Services took to revise my current resume.',
    eligible: true,
    tags: ['process', 'quality'],
  },
];

// Get eligible reviews only
export const getEligibleReviews = () => {
  return reviews.filter(r => r.eligible);
};

// Get featured review (rotates daily between strongest method signals only)
export const getFeaturedReview = () => {
  const eligible = getEligibleReviews();
  if (eligible.length === 0) throw new Error('No eligible reviews found');

  // Rotate only between Carie (method/IP) and Douglas (executive authority)
  // Exclude Lisa from featured rotation (weaker method signal)
  const strongSignals = eligible.filter(r => r.id === 'carie' || r.id === 'douglas');

  if (strongSignals.length === 0) {
    // Fallback to Carie if filtering fails
    return eligible.find(r => r.id === 'carie') || eligible[0];
  }

  // Rotate based on day of year (deterministic, changes daily)
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const featuredIndex = dayOfYear % strongSignals.length; // 356 % 2 = 0 (Douglas today)
  return strongSignals[featuredIndex];
};

// Get reviews for "Verified Proof" section (exclude featured, return 2)
export const getVerifiedProofReviews = () => {
  const featured = getFeaturedReview();
  const eligible = getEligibleReviews();

  // Return the 2 eligible reviews that are NOT the featured one
  return eligible.filter(r => r.id !== featured.id).slice(0, 2);
};

// Guardrail: Runtime check for duplicates (dev mode)
if (process.env.NODE_ENV === 'development') {
  const featuredReview = getFeaturedReview();
  const proofReviews = getVerifiedProofReviews();

  if (proofReviews.some(r => r.id === featuredReview.id)) {
    console.error('❌ DUPLICATE REVIEW ERROR: Featured review appears in Verified Proof section');
  }

  const eligibleCount = getEligibleReviews().length;
  if (eligibleCount !== 3) {
    console.warn(`⚠️  Expected exactly 3 eligible reviews (Carie, Douglas, Lisa), found ${eligibleCount}`);
  }

  const displayCount = 1 + proofReviews.length; // featured + proof reviews
  if (displayCount !== 3) {
    console.warn(`⚠️  Expected exactly 3 reviews visible per page load, found ${displayCount}`);
  }
}
