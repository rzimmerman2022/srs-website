/**
 * Strategic Placement Diagnostic - Questionnaire Type System
 * Modern, gamified questionnaire infrastructure
 */

export type QuestionType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'currency'
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'date'
  | 'percentage-split'  // For questions like "breakdown by %"
  | 'timeline';         // For employment dates

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
  followUp?: string;  // ID of follow-up question to show if selected
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  subtitle?: string;
  whyAsking?: string;        // Expandable "why we're asking" section
  helpText?: string;         // Inline help text
  placeholder?: string;
  required: boolean;
  critical?: boolean;        // Shows 🔴 CRITICAL badge
  options?: QuestionOption[];
  min?: number;
  max?: number;
  unit?: string;             // e.g., "$", "%", "cases/day"
  validation?: {
    pattern?: string;
    message?: string;
    minLength?: number;
    maxLength?: number;
  };
  conditionalOn?: {          // Only show if another question has specific value
    questionId: string;
    values: string[];
  };
  subQuestions?: Question[]; // For compound questions
}

export interface QuestionModule {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;             // Emoji or icon name
  estimatedMinutes: number;
  questions: Question[];
  required: boolean;         // Mandatory vs Optional module
}

export interface Questionnaire {
  id: string;
  clientName: string;
  clientId: string;
  title: string;
  subtitle?: string;
  packageType: string;       // e.g., "Elite Protocol Package"
  introText?: string;
  readFirstContent?: string; // The "READ THIS FIRST" section
  modules: QuestionModule[];
  createdAt: string;
  dueDate?: string;
}

export interface QuestionnaireResponse {
  questionnaireId: string;
  clientId: string;
  responses: Record<string, unknown>;
  currentModuleIndex: number;
  currentQuestionIndex: number;
  startedAt: string;
  lastSavedAt: string;
  completedAt?: string;
  completedModules: string[];
}

// Progress tracking
export interface ProgressState {
  totalQuestions: number;
  answeredQuestions: number;
  currentModule: number;
  totalModules: number;
  percentComplete: number;
  estimatedMinutesRemaining: number;
  streak: number;           // Consecutive questions answered
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  threshold: number;        // % complete to unlock
  unlocked: boolean;
  celebrationEmoji: string;
}

// Default milestones for gamification
export const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 'started',
    title: 'Journey Begun',
    description: 'You\'ve started your career transformation',
    threshold: 0,
    unlocked: false,
    celebrationEmoji: '🚀'
  },
  {
    id: 'quarter',
    title: 'Making Progress',
    description: '25% complete - you\'re building momentum',
    threshold: 25,
    unlocked: false,
    celebrationEmoji: '💪'
  },
  {
    id: 'halfway',
    title: 'Halfway Hero',
    description: '50% complete - the foundation is set',
    threshold: 50,
    unlocked: false,
    celebrationEmoji: '⭐'
  },
  {
    id: 'mandatory-complete',
    title: 'Core Complete',
    description: 'Mandatory section finished - we can proceed!',
    threshold: 75,
    unlocked: false,
    celebrationEmoji: '🎯'
  },
  {
    id: 'complete',
    title: 'Mission Accomplished',
    description: '100% complete - maximum positioning power',
    threshold: 100,
    unlocked: false,
    celebrationEmoji: '🏆'
  }
];
