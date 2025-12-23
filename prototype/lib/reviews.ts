/**
 * Reviews - Single Source of Truth
 *
 * CRITICAL: Store ONLY approved excerpts (NOT full review text)
 * This prevents accidental display of outcome claims or FTC violations
 *
 * All excerpts are verbatim from Google Business Profile
 * NEVER edit, fabricate, or embellish
 */

export interface Review {
  id: string;
  name: string;
  title?: string; // Optional job title for context
  excerpt: string; // APPROVED excerpt only (NOT full review)
  eligible: boolean; // Safe to display (no material connection, no outcome claims)
  useCase: 'hero' | 'proof' | 'never'; // Strategic placement
}

// Links
export const GOOGLE_REVIEWS_URL = 'https://www.google.com/maps/place/Southwest+Resume+Services/@33.4152623,-112.0408062,17z/data=!4m8!3m7!1s0x872b0708795042e1:0xf7cc65402679323d!8m2!3d33.4152623!4d-112.0382313!9m1!1b1!16s%2Fg%2F11ggz1y0qy';
export const LEAVE_REVIEW_URL = 'https://g.page/r/Cd0yeUAKZcz3EAI/review';

// Dynamic rating data (fetched from API)
export const RATING = '5.0'; // Current Google rating
export const REVIEW_COUNT = 6; // Current review count
export const RATING_FALLBACK = '5.0'; // Used if API fails
export const REVIEW_COUNT_FALLBACK = 6; // Conservative count for fallback

// Approved reviews - Excerpts ONLY
export const reviews: Review[] = [
  // HERO ROTATION (Jerome + Carie only)
  {
    id: 'jerome',
    name: 'Jerome C.',
    title: 'CFO',
    excerpt: 'I had no shortage of accomplishments, but my resume simply wasn\'t telling the right story.',
    eligible: true,
    useCase: 'hero',
  },
  {
    id: 'carie',
    name: 'Carie Learn',
    excerpt: 'He knows the questions to ask and I felt that I was in great hands.',
    eligible: true,
    useCase: 'hero',
  },

  // VERIFIED PROOF POOL
  {
    id: 'douglas',
    name: 'Douglas Holden',
    excerpt: 'I would recommend Southwest Resume Services 10/10 times to friends and colleagues looking to build their executive profile.',
    eligible: true,
    useCase: 'proof',
  },
  {
    id: 'lisa',
    name: 'Lisa Weaver',
    excerpt: 'His initial questionnaire helped provide a foundation to build a stronger resume in the medical field.',
    eligible: true,
    useCase: 'proof',
  },

  // EXCLUDED (Material connections - NEVER display)
  {
    id: 'jordyn',
    name: 'Jordyn Ginsberg',
    excerpt: '', // Intentionally empty - should never be displayed
    eligible: false,
    useCase: 'never',
  },
  {
    id: 'andrew',
    name: 'Andrew Beam',
    excerpt: '', // Intentionally empty - should never be displayed
    eligible: false,
    useCase: 'never',
  },
];

/**
 * Get hero reviews (manual toggle between Jerome and Carie)
 */
export const getHeroReviews = () => {
  return reviews.filter(r => r.useCase === 'hero' && r.eligible);
};

/**
 * Get proof reviews (excludes current hero selection)
 * Returns exactly 2 reviews for Verified Proof section
 *
 * @param excludeId - ID of review currently shown in hero
 */
export const getProofReviews = (excludeId?: string) => {
  const eligible = reviews.filter(r => r.eligible && r.id !== excludeId);

  // Priority order: Always show Douglas first, then others
  const douglas = eligible.find(r => r.id === 'douglas');
  const others = eligible.filter(r => r.id !== 'douglas');

  const proof = douglas ? [douglas, ...others] : others;

  return proof.slice(0, 2); // Always return exactly 2
};

/**
 * Get all eligible reviews (for dedicated Reviews page)
 */
export const getEligibleReviews = () => {
  return reviews.filter(r => r.eligible);
};

/**
 * Runtime validation (development only)
 */
if (process.env.NODE_ENV === 'development') {
  const heroReviews = getHeroReviews();
  const eligibleReviews = getEligibleReviews();

  if (heroReviews.length !== 2) {
    console.error(`❌ Expected exactly 2 hero reviews (Jerome + Carie), found ${heroReviews.length}`);
  }

  if (eligibleReviews.length !== 4) {
    console.warn(`⚠️  Expected exactly 4 eligible reviews, found ${eligibleReviews.length}`);
  }

  // Verify no outcome claims in excerpts
  const outcomeKeywords = ['raise', 'promotion', 'hired', 'interviews scheduled', 'obtained employment'];
  eligibleReviews.forEach(review => {
    const hasOutcomeClaim = outcomeKeywords.some(keyword =>
      review.excerpt.toLowerCase().includes(keyword)
    );
    if (hasOutcomeClaim) {
      console.error(`❌ OUTCOME CLAIM DETECTED in ${review.id}: "${review.excerpt}"`);
    }
  });

  // Verify excluded reviews have empty excerpts
  const excluded = reviews.filter(r => !r.eligible);
  excluded.forEach(review => {
    if (review.excerpt.length > 0) {
      console.warn(`⚠️  Excluded review ${review.id} has non-empty excerpt (should be empty string)`);
    }
  });
}
