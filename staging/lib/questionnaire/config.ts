/**
 * Questionnaire Configuration
 *
 * Centralized configuration for timing, animations, and UI behavior
 * (Q-CQ-05: Avoid hardcoded timeout values)
 */

// ============================================================================
// UI Timing Configuration (Q-CQ-05)
// ============================================================================
// All timeout and delay values centralized here for easy maintenance
// ============================================================================

export const UI_TIMING = {
  // Points popup animation timings (in milliseconds)
  POINTS_POPUP: {
    FLOAT_DELAY: 200,      // Delay before float animation starts
    FADE_DELAY: 600,       // Delay before fade animation starts
    COMPLETE_DELAY: 1200,  // Total duration before popup completes
  },

  // Milestone modal timings (in milliseconds)
  MILESTONE_MODAL: {
    FOCUS_DELAY: 100,      // Delay before focusing close button
    AUTO_CLOSE_DELAY: 3000, // Auto-close after 3 seconds
    CLOSE_FADE_DELAY: 300,  // Fade out duration when closing
  },

  // Encouragement message timings (in milliseconds)
  ENCOURAGEMENT: {
    SHOW_DELAY: 1500,      // Show after points popup
    HIDE_DELAY: 3000,      // Hide after 3 seconds
  },

  // Combo timing (in milliseconds)
  COMBO: {
    TIME_WINDOW: 15000,    // 15 seconds to maintain combo
  },

  // Sync configuration (in milliseconds)
  SYNC: {
    DEBOUNCE_MS: 2000,           // Debounce delay for sync
    LOCALSTORAGE_DEBOUNCE_MS: 500, // Debounce for localStorage writes
  },
} as const;

// ============================================================================
// Gamification Configuration
// ============================================================================

export const GAMIFICATION = {
  // Points system
  POINTS: {
    BASE_POINTS: 5,           // Base points per question
    MAX_MULTIPLIER: 3,        // Maximum combo multiplier
    COMBO_THRESHOLD: 3,       // Answers needed for combo increment
  },

  // Encouragement frequency
  ENCOURAGEMENT_FREQUENCY: 5, // Show encouragement every N questions
} as const;

// ============================================================================
// Rate Limiting Configuration (for API)
// ============================================================================

export const RATE_LIMITING = {
  MAX_REQUESTS: 100,          // Maximum requests per window
  WINDOW_MS: 60 * 60 * 1000, // 1 hour in milliseconds
  CLEANUP_INTERVAL_MS: 10 * 60 * 1000, // Cleanup every 10 minutes
  DEDUPLICATION_WINDOW_MS: 5000, // 5 seconds for deduplication
  DEDUPLICATION_CLEANUP_MS: 60 * 1000, // Cleanup every minute
} as const;

// Type exports for better type safety
export type UITiming = typeof UI_TIMING;
export type GamificationConfig = typeof GAMIFICATION;
export type RateLimitingConfig = typeof RATE_LIMITING;
