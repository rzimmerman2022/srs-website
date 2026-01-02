'use client';

// TODO (P3-LOW): Refactor large component (760+ lines) into smaller composable units
// This component handles too many responsibilities and would benefit from decomposition:
//
// Suggested breakdown:
// 1. useQuestionnaireState.ts - Custom hook for state management (lines 44-62)
//    - Consolidate all useState calls into a single useReducer
//    - Extract responses, navigation state, gamification state
//
// 2. useQuestionnaireProgress.ts - Progress calculation logic (lines 106-158)
//    - Extract allQuestions, requiredQuestions, progress calculations
//    - Move milestone detection logic here
//
// 3. useQuestionnaireNavigation.ts - Navigation handlers (lines 286-329)
//    - Extract goToNextQuestion, goToPreviousQuestion, handleModuleSelect
//    - Includes keyboard navigation logic
//
// 4. useQuestionnaireGamification.ts - Points, streak, combo logic (lines 216-258)
//    - Extract handleResponseChange points calculation
//    - Consolidate encouragement message generation
//
// 5. QuestionnaireIntro.tsx - Intro screen component (lines 416-496)
//    - Extract to separate component for better testability
//
// 6. QuestionnaireHeader.tsx - Top progress bar (lines 502-620)
//    - Already has QuestionnaireHeader component, could use it better
//
// Benefits: Improved testability, easier maintenance, better code reuse, clearer separation of concerns

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Questionnaire, Milestone, DEFAULT_MILESTONES } from '@/lib/questionnaire/types';
import { cn } from '@/lib/utils';
import { isValidAnswer } from '@/lib/questionnaire/utils';
import { useQuestionnaireSync } from '@/hooks/useQuestionnaireSync';
import ProgressRing from './ProgressRing';
import QuestionCard from './QuestionCard';
import ModuleNav from './ModuleNav';
import MilestoneModal from './MilestoneModal';
import PointsPopup from './PointsPopup';

interface QuestionnaireContainerProps {
  questionnaire: Questionnaire;
  clientId?: string; // Client ID for server-side sync
  onComplete?: (responses: Record<string, unknown>) => void;
  prefersReducedMotion?: boolean; // User's motion preference
}

export default function QuestionnaireContainer({
  questionnaire,
  clientId,
  onComplete,
  prefersReducedMotion = false
}: QuestionnaireContainerProps) {
  // Server-side sync hook (when clientId is provided)
  const {
    state: syncState,
    isLoading: isSyncLoading,
    isOnline,
    isSyncing,
    lastSyncedAt,
    updateState: updateSyncState,
    forceSync,
  } = useQuestionnaireSync({
    clientId: clientId || questionnaire.clientId || 'anonymous',
    questionnaireId: questionnaire.id,
    debounceMs: 2000,
  });

  // State
  const [responses, setResponses] = useState<Record<string, unknown>>({});
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [showMilestone, setShowMilestone] = useState<Milestone | null>(null);
  const [shownMilestones, setShownMilestones] = useState<number[]>([]); // Track which milestones have been shown
  const [milestones] = useState<Milestone[]>(DEFAULT_MILESTONES);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [streak, setStreak] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Track if localStorage data has been loaded
  const [showPointsPopup, setShowPointsPopup] = useState(false);
  const [popupPoints, setPopupPoints] = useState(5); // Points shown in popup (can vary with multiplier)
  const awardedQuestions = useRef<Set<string>>(new Set()); // Track which questions have awarded points
  const [combo, setCombo] = useState(0); // Combo counter for consecutive answers
  const [lastAnswerTime, setLastAnswerTime] = useState<number | null>(null);
  const [showEncouragement, setShowEncouragement] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const comboTimeWindow = 15000; // 15 seconds to maintain combo

  // Initialize from sync state when it loads
  // NOTE: React 18+ automatically batches setState calls in effects and event handlers
  // These multiple setState calls are already batched into a single render cycle
  // However, for future scalability consider useReducer for atomic state management
  //
  // TODO (P3-LOW): Consider refactoring to useReducer for better state management
  // Benefits: atomic updates, easier testing, better TypeScript inference
  // See: https://react.dev/reference/react/useReducer
  //
  // TODO (P3-LOW): Consider separating sync state from UI state to reduce re-render cascade
  // Current architecture mixes sync state (answers, progress) with UI state (modals, animations)
  // This causes unnecessary re-renders when sync state changes but UI doesn't need updates
  // Potential implementation:
  // 1. Create separate contexts: SyncContext (answers, progress) and UIContext (modals, popups)
  // 2. Use React.memo() on components that only need sync data
  // 3. Consider moving animation state to refs where possible (e.g., showPointsPopup)
  // 4. This would reduce re-render cascade from ~15 state updates to ~5 critical path updates
  // See: https://react.dev/learn/passing-data-deeply-with-context
  useEffect(() => {
    if (syncState && !isDataLoaded) {
      // React 18 automatic batching: all setState calls batched into single render
      setResponses(syncState.answers as Record<string, unknown> || {});
      setCurrentModuleIndex(syncState.currentModuleIndex || 0);
      setCurrentQuestionIndex(syncState.currentQuestionIndex || 0);
      setStreak(syncState.points || 0);
      setCombo(syncState.combo || 0);
      setShownMilestones(syncState.shownMilestones || []);
      setIsCompleted(syncState.completed || false);
      if (Object.keys(syncState.answers || {}).length > 0) {
        setShowIntro(false);
      }
      setIsDataLoaded(true);
    }
  }, [syncState, isDataLoaded]);

  // Ref to hold latest state for debounced sync (avoids stale closures)
  const syncStateRef = useRef({
    responses,
    currentQuestionIndex,
    currentModuleIndex,
    streak,
    combo,
    shownMilestones,
    isCompleted,
  });

  // Keep ref updated with latest values
  useEffect(() => {
    syncStateRef.current = {
      responses,
      currentQuestionIndex,
      currentModuleIndex,
      streak,
      combo,
      shownMilestones,
      isCompleted,
    };
  }, [responses, currentQuestionIndex, currentModuleIndex, streak, combo, shownMilestones, isCompleted]);

  // Debounced sync timer ref
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state changes to server (debounced at 300ms to reduce per-keystroke churn)
  // Gamification remains instant - only the server/localStorage sync is debounced
  useEffect(() => {
    if (!isDataLoaded || !updateSyncState) return;

    // Clear any pending sync
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
    }

    // Debounce the sync by 300ms
    syncTimerRef.current = setTimeout(() => {
      const state = syncStateRef.current;
      updateSyncState({
        answers: state.responses as Record<string, string | string[]>,
        currentQuestionIndex: state.currentQuestionIndex,
        currentModuleIndex: state.currentModuleIndex,
        points: state.streak,
        streak: state.streak,
        combo: state.combo,
        shownMilestones: state.shownMilestones,
        completed: state.isCompleted,
      });
      setLastSaved(new Date());
    }, 300);

    // Cleanup on unmount
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
    };
  }, [responses, currentQuestionIndex, currentModuleIndex, streak, combo, shownMilestones, isCompleted, isDataLoaded, updateSyncState]);

  // Derived state
  const currentModule = questionnaire.modules[currentModuleIndex];
  const currentQuestion = currentModule?.questions[currentQuestionIndex];

  // Get all questions flattened for progress calculation
  const allQuestions = useMemo(() => {
    return questionnaire.modules.flatMap(m => m.questions);
  }, [questionnaire.modules]);

  const requiredQuestions = useMemo(() => {
    // Count questions that are either explicitly required OR in a required module
    const required: typeof questionnaire.modules[0]['questions'] = [];
    for (const mod of questionnaire.modules) {
      for (const question of mod.questions) {
        if (question.required || mod.required) {
          required.push(question);
        }
      }
    }
    return required;
  }, [questionnaire.modules]);

  // Calculate progress
  const answeredCount = useMemo(() => {
    return allQuestions.filter(q => isValidAnswer(responses[q.id])).length;
  }, [allQuestions, responses]);

  const progress = useMemo(() => {
    // Guard against division by zero if questionnaire has no questions
    return allQuestions.length > 0
      ? Math.round((answeredCount / allQuestions.length) * 100)
      : 0;
  }, [answeredCount, allQuestions.length]);

  // Required progress calculation - available for future use
  // const requiredProgress = useMemo(() => {
  //   const answered = requiredQuestions.filter(q => isValidAnswer(responses[q.id])).length;
  //   // Guard against division by zero if there are no required questions
  //   return requiredQuestions.length > 0
  //     ? Math.round((answered / requiredQuestions.length) * 100)
  //     : 0;
  // }, [requiredQuestions, responses]);

  // Estimated time remaining
  const estimatedMinutesRemaining = useMemo(() => {
    const remainingModules = questionnaire.modules.slice(currentModuleIndex);
    // Guard against division by zero if module has no questions
    const currentModuleRemaining = currentModule && currentModule.questions.length > 0
      ? (currentModule.estimatedMinutes / currentModule.questions.length) * (currentModule.questions.length - currentQuestionIndex)
      : 0;
    const futureModules = remainingModules.slice(1).reduce((acc, m) => acc + m.estimatedMinutes, 0);
    return Math.ceil(currentModuleRemaining + futureModules);
  }, [questionnaire.modules, currentModuleIndex, currentModule, currentQuestionIndex]);

  // Get question number within current context
  const getQuestionNumber = useCallback(() => {
    let count = 0;
    for (let i = 0; i < currentModuleIndex; i++) {
      count += questionnaire.modules[i].questions.length;
    }
    return count + currentQuestionIndex + 1;
  }, [currentModuleIndex, currentQuestionIndex, questionnaire.modules]);

  // Check for milestone achievements (only after localStorage data is loaded)
  useEffect(() => {
    // Don't trigger milestones until localStorage data is loaded
    if (!isDataLoaded) return;

    // Find the first milestone that should be triggered but hasn't been shown yet
    const milestoneToShow = milestones.find(m =>
      progress >= m.threshold && !shownMilestones.includes(m.threshold)
    );

    if (milestoneToShow && !showMilestone) {
      setShowMilestone({ ...milestoneToShow, unlocked: true });
      setShownMilestones(prev => [...prev, milestoneToShow.threshold]);
    }
  }, [progress, milestones, shownMilestones, showMilestone, isDataLoaded]);

  // Note: localStorage load/save is now handled by useQuestionnaireSync hook
  // which provides automatic local + server sync with offline support

  // Get encouragement message based on progress
  const getEncouragementMessage = useCallback(() => {
    const messages = {
      start: [
        "Great start! Let's build your career story together",
        "Every detail you share helps us craft your perfect resume",
        "You're off to a great start!"
      ],
      quarter: [
        "You're doing great! Keep this momentum going",
        "25% done - the foundation is coming together",
        "Love the detail you're providing!"
      ],
      halfway: [
        "Halfway there! You're unstoppable",
        "Amazing progress! We're building something special",
        "This is exactly the insight we need!"
      ],
      threequarter: [
        "Almost there! You're crushing this",
        "Final stretch - we can see the finish line!",
        "Your attention to detail is impressive!"
      ],
      nearEnd: [
        "Just a few more questions! You've got this",
        "So close! Let's bring it home strong",
        "One last push - this is going to be incredible!"
      ]
    };

    let category: keyof typeof messages;
    if (progress < 15) category = 'start';
    else if (progress < 40) category = 'quarter';
    else if (progress < 65) category = 'halfway';
    else if (progress < 90) category = 'threequarter';
    else category = 'nearEnd';

    const options = messages[category];
    return options[Math.floor(Math.random() * options.length)];
  }, [progress]);

  // Handle response change - show points popup on first valid answer with combo system
  const handleResponseChange = useCallback((value: unknown) => {
    if (currentQuestion) {
      setResponses(prev => ({
        ...prev,
        [currentQuestion.id]: value
      }));

      // Check if this is a newly valid answer (first time completing this question)
      if (isValidAnswer(value) && !awardedQuestions.current.has(currentQuestion.id)) {
        const now = Date.now();
        const timeSinceLastAnswer = lastAnswerTime ? now - lastAnswerTime : Infinity;

        // Calculate combo
        let newCombo = combo;
        if (timeSinceLastAnswer < comboTimeWindow) {
          newCombo = combo + 1;
        } else {
          newCombo = 1;
        }
        setCombo(newCombo);

        // Calculate points with multiplier (max 3x at combo 9+)
        const basePoints = 5;
        const multiplier = Math.min(Math.floor(newCombo / 3) + 1, 3);
        const pointsAwarded = basePoints * multiplier;

        awardedQuestions.current.add(currentQuestion.id);
        setStreak(prev => prev + pointsAwarded);
        setLastAnswerTime(now);
        setPopupPoints(pointsAwarded);
        setShowPointsPopup(true);

        // Show encouragement every 5 questions
        const newAnsweredCount = awardedQuestions.current.size;
        if (newAnsweredCount > 0 && newAnsweredCount % 5 === 0) {
          setTimeout(() => {
            setShowEncouragement(getEncouragementMessage());
            setTimeout(() => setShowEncouragement(null), 3000);
          }, 1500); // Show after points popup
        }
      }
    }
  }, [currentQuestion, combo, lastAnswerTime, comboTimeWindow, getEncouragementMessage]);

  // Check if current question is answered
  const isCurrentQuestionAnswered = useMemo(() => {
    if (!currentQuestion) return false;
    return isValidAnswer(responses[currentQuestion.id]);
  }, [currentQuestion, responses]);

  const finalizeSubmission = useCallback(() => {
    setIsCompleted(true);
    if (updateSyncState) {
      updateSyncState({
        answers: responses as Record<string, string | string[]>,
        currentQuestionIndex,
        currentModuleIndex,
        points: streak,
        streak,
        combo,
        shownMilestones,
        completed: true,
      });
    }
    forceSync().catch((err) => {
      console.warn('Failed to sync submitted state:', err);
    });
    onComplete?.(responses);
  }, [combo, currentModuleIndex, currentQuestionIndex, forceSync, onComplete, responses, shownMilestones, streak, updateSyncState]);

  const handleSubmit = useCallback(() => {
    setShowSubmitConfirm(false);
    finalizeSubmission();
  }, [finalizeSubmission]);

  // Module completion check - available for future use
  // const isCurrentModuleComplete = useMemo(() => {
  //   if (!currentModule) return false;
  //   return currentModule.questions.every(q => !q.required || isValidAnswer(responses[q.id]));
  // }, [currentModule, responses]);

  // Navigation
  const goToNextQuestion = useCallback(() => {
    if (!currentModule) return;

    // Reset streak counter if skipping a question without answering
    // Note: Don't clear awardedQuestions - users keep points for questions they already answered
    if (!isCurrentQuestionAnswered) {
      setStreak(0);
    }

    if (currentQuestionIndex < currentModule.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentModuleIndex < questionnaire.modules.length - 1) {
      // Complete current module and move to next
      if (!completedModules.includes(currentModule.id)) {
        setCompletedModules(prev => [...prev, currentModule.id]);
      }
      setCurrentModuleIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      // All done
      if (!completedModules.includes(currentModule.id)) {
        setCompletedModules(prev => [...prev, currentModule.id]);
      }
      finalizeSubmission();
    }

    // Scroll to top when navigating to next question
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [currentModule, currentModuleIndex, currentQuestionIndex, questionnaire.modules.length, completedModules, finalizeSubmission, isCurrentQuestionAnswered, prefersReducedMotion]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentModuleIndex > 0) {
      const prevModule = questionnaire.modules[currentModuleIndex - 1];
      setCurrentModuleIndex(prev => prev - 1);
      setCurrentQuestionIndex(prevModule.questions.length - 1);
    }

    // Scroll to top when navigating to previous question
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [currentQuestionIndex, currentModuleIndex, questionnaire.modules, prefersReducedMotion]);

  const handleModuleSelect = useCallback((index: number) => {
    setCurrentModuleIndex(index);
    setCurrentQuestionIndex(0);

    // Scroll to top when selecting a module
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [prefersReducedMotion]);

  // Skip question (for optional questions)
  const skipQuestion = useCallback(() => {
    if (currentQuestion && !currentQuestion.required) {
      goToNextQuestion();
    }
  }, [currentQuestion, goToNextQuestion]);

  // Memoized callback for milestone close to prevent memory leaks
  const handleMilestoneClose = useCallback(() => {
    setShowMilestone(null);
  }, []);

  // Memoized callback for points popup to prevent memory leaks
  const handlePointsPopupComplete = useCallback(() => {
    setShowPointsPopup(false);
  }, []);

  // Keyboard navigation - Enter key to continue
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Enter' && (isCurrentQuestionAnswered || !currentQuestion?.required)) {
        goToNextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isCurrentQuestionAnswered, currentQuestion?.required, goToNextQuestion]);

  // Combo decay timer - reset combo if no answer within time window
  useEffect(() => {
    if (lastAnswerTime && combo > 0) {
      const timer = setTimeout(() => {
        setCombo(0);
      }, comboTimeWindow);
      return () => clearTimeout(timer);
    }
  }, [lastAnswerTime, combo, comboTimeWindow]);

  // Helper to get streak visual size (growing fire effect)
  const getStreakDisplay = useCallback(() => {
    if (streak < 25) return { fire: '🔥', size: 'text-lg' };
    if (streak < 50) return { fire: '🔥🔥', size: 'text-xl' };
    if (streak < 100) return { fire: '🔥🔥🔥', size: 'text-2xl' };
    return { fire: '🔥🔥🔥🔥', size: 'text-2xl', pulse: true };
  }, [streak]);

  // Get current multiplier
  const currentMultiplier = useMemo(() => {
    return Math.min(Math.floor(combo / 3) + 1, 3);
  }, [combo]);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Reset confirmation state
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Reset questionnaire handler
  const handleReset = useCallback(() => {
    // Clear localStorage for this questionnaire
    const localStorageKey = `questionnaire_${questionnaire.id}_${clientId || questionnaire.clientId || 'anonymous'}`;
    try {
      localStorage.removeItem(localStorageKey);
    } catch (e) {
      console.warn('Failed to clear localStorage:', e);
    }

    // Reset all state
    setResponses({});
    setCurrentModuleIndex(0);
    setCurrentQuestionIndex(0);
    setCompletedModules([]);
    setShowIntro(true);
    setStreak(0);
    setCombo(0);
    setShownMilestones([]);
    setLastSaved(null);
    setIsCompleted(false);
    awardedQuestions.current.clear();

    // Reset sync state (this will also clear server-side data)
    if (updateSyncState) {
      updateSyncState({
        answers: {},
        currentQuestionIndex: 0,
        currentModuleIndex: 0,
        points: 0,
        streak: 0,
        combo: 0,
        shownMilestones: [],
        completed: false,
      });
    }

    setShowResetConfirm(false);
    setShowSubmitConfirm(false);
    setIsMobileMenuOpen(false);

    // Force immediate sync to server to prevent data resurrection on reload
    // This ensures empty state is persisted even if user closes tab immediately
    forceSync().catch((err) => {
      console.warn('Failed to sync reset state:', err);
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [questionnaire.id, clientId, questionnaire.clientId, updateSyncState, forceSync, prefersReducedMotion]);


  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentModuleIndex]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Loading state
  if (isSyncLoading && !isDataLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sand-50 via-white to-sand-100 flex items-center justify-center">
        {/* Screen reader announcement for loading state */}
        <div className="sr-only" aria-live="assertive" aria-atomic="true">
          Loading your progress. Please wait.
        </div>
        <div className="glass rounded-3xl p-12 shadow-premium text-center" aria-busy="true">
          <div
            className={prefersReducedMotion ? "w-12 h-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-6" : "animate-spin w-12 h-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-6"}
            role="status"
            aria-label="Loading your progress"
          />
          <h2 className="text-xl font-semibold text-navy mb-2">Loading your progress...</h2>
          <p className="text-gray-700">Syncing with cloud storage</p>
        </div>
      </div>
    );
  }

  // Intro screen
  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sand-50 via-white to-sand-100 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="glass rounded-3xl p-8 md:p-12 shadow-premium">
            {/* Header */}
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-1 bg-gold/10 text-gold text-sm font-semibold rounded-full mb-4">
                {questionnaire.packageType}
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-2">
                {questionnaire.title}
              </h1>
              <p className="text-lg text-gray-600">
                {questionnaire.clientName}
              </p>
            </div>

            {/* Read this first */}
            {questionnaire.readFirstContent && (
              <div className="glass-dark rounded-2xl p-6 md:p-8 mb-8">
                <h2 className="text-lg font-semibold text-gold mb-4 flex items-center gap-2">
                  <span className="text-2xl">📖</span> Read This First
                </h2>
                <p className="text-sand-100 whitespace-pre-line leading-relaxed">
                  {questionnaire.readFirstContent}
                </p>
              </div>
            )}

            {/* Intro text */}
            {questionnaire.introText && (
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                {questionnaire.introText}
              </p>
            )}

            {/* Time estimate */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-sand-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-navy">{allQuestions.length}</div>
                <div className="text-sm text-gray-700">Total Questions</div>
              </div>
              <div className="bg-sand-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-navy">{requiredQuestions.length}</div>
                <div className="text-sm text-gray-700">Required</div>
              </div>
              <div className="bg-sand-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-navy">{questionnaire.modules.length}</div>
                <div className="text-sm text-gray-700">Sections</div>
              </div>
              <div className="bg-sand-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-navy">~{questionnaire.modules.reduce((acc, m) => acc + m.estimatedMinutes, 0)}</div>
                <div className="text-sm text-gray-700">Minutes</div>
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={() => {
                setShowIntro(false);
                window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
              }}
              className="w-full py-4 bg-navy text-white font-semibold rounded-xl hover:bg-navy/90 transition-colors text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              Begin Questionnaire
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            {/* Note */}
            <p className="text-center text-sm text-gray-700 mt-6">
              Your progress is automatically saved to the cloud. You can leave and return anytime from any device.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 via-white to-sand-100">
      {/* Top progress bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-sand-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Progress info with hamburger menu */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Hamburger menu button - mobile/tablet only */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-11 h-11 rounded-lg hover:bg-sand-100 transition-colors"
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen ? "true" : "false"}
              >
                <svg className="w-6 h-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              <ProgressRing progress={progress} size={40} strokeWidth={4} className="sm:hidden" />
              <ProgressRing progress={progress} size={50} strokeWidth={4} className="hidden sm:block" />
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-navy" aria-label={`${answeredCount} of ${allQuestions.length} questions answered`}>
                  {answeredCount} of {allQuestions.length} answered
                </div>
                <div className="text-xs text-gray-600" aria-label={`Estimated ${estimatedMinutesRemaining} minutes remaining`}>
                  ~{estimatedMinutesRemaining} min remaining
                </div>
              </div>
              {/* Screen reader-only live region for progress updates */}
              <div className="sr-only" aria-live="polite" aria-atomic="true">
                {answeredCount} of {allQuestions.length} questions completed. {progress}% complete.
              </div>
            </div>

            {/* Center: Current module */}
            <div className="flex-1 text-center hidden lg:block">
              <span className="text-2xl mr-2" aria-hidden="true">{currentModule?.icon}</span>
              <span className="font-semibold text-navy">{currentModule?.title}</span>
            </div>

            {/* Right: Streak & save status */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
              {streak > 0 && (
                <div className={cn(
                  "relative flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-sm font-medium transition-all duration-300",
                  "bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 border border-amber-200",
                  !prefersReducedMotion && getStreakDisplay().pulse && "animate-progress-pulse"
                )}>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className={cn("text-base sm:text-lg md:text-xl", !prefersReducedMotion && "animate-float-bounce")}>
                      🔥
                    </span>
                    <div className="flex flex-col items-start">
                      <span className="text-sm sm:text-base md:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                        {streak}
                      </span>
                      <span className="hidden sm:inline text-xs text-amber-700 font-semibold uppercase tracking-wide">
                        streak
                      </span>
                    </div>
                  </div>
                  {/* Combo multiplier indicator */}
                  {currentMultiplier > 1 && (
                    <div className="px-1.5 sm:px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                      <span className="text-white text-xs font-bold">
                        {currentMultiplier}x
                      </span>
                    </div>
                  )}
                </div>
              )}
              {/* Mobile sync status - icon only */}
              <div className="sm:hidden flex items-center">
                {isSyncing && (
                  <div className={cn("w-2 h-2 bg-blue-500 rounded-full", !prefersReducedMotion && "animate-pulse")} title="Syncing..." aria-label="Syncing..." />
                )}
                {!isOnline && (
                  <div className="w-2 h-2 bg-amber-500 rounded-full" title="Offline" aria-label="Offline" />
                )}
                {lastSyncedAt && isOnline && !isSyncing && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" title="Synced" aria-label="Synced to cloud" />
                )}
              </div>
              {/* Desktop sync status - with text */}
              <div className="hidden sm:flex items-center gap-2">
                {isSyncing && (
                  <div className="flex items-center gap-1 text-xs text-blue-500">
                    <div className={cn("w-2 h-2 bg-blue-500 rounded-full", !prefersReducedMotion && "animate-pulse")} aria-label="Syncing..." />
                    Syncing...
                  </div>
                )}
                {!isOnline && (
                  <div className="flex items-center gap-1 text-xs text-amber-500">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" aria-label="Offline" />
                    Offline
                  </div>
                )}
                {lastSyncedAt && isOnline && !isSyncing && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full" aria-label="Synced to cloud" />
                    Synced
                  </div>
                )}
                {lastSaved && (
                  <div className="text-xs text-gray-600">
                    {lastSaved.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress bar - enhanced with shimmer effect */}
          <div className="mt-2 sm:mt-3 h-2 sm:h-2.5 bg-sand-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full relative overflow-hidden transition-all duration-300"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Questionnaire progress: ${progress}% complete`}
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #C9A962 0%, #D4AF37 50%, #F59E0B 100%)',
                backgroundSize: '200% 100%',
                animation: progress > 0 ? 'shimmer 3s ease-in-out infinite' : 'none',
                boxShadow: '0 0 10px rgba(201, 169, 98, 0.5)',
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl lg:hidden overflow-y-auto">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-navy">Navigation</h2>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-sand-100 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Module navigation */}
              <ModuleNav
                modules={questionnaire.modules}
                currentModuleIndex={currentModuleIndex}
                completedModules={completedModules}
                onModuleSelect={(index) => {
                  handleModuleSelect(index);
                  setIsMobileMenuOpen(false);
                }}
              />

              {/* Reset button */}
              <div className="mt-6 pt-6 border-t border-sand-200">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Start Over
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main content - pb-20 for floating save bar clearance */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar - Module nav (desktop only) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28">
              <ModuleNav
                modules={questionnaire.modules}
                currentModuleIndex={currentModuleIndex}
                completedModules={completedModules}
                onModuleSelect={handleModuleSelect}
              />

              {/* Reset button */}
              <div className="mt-6 pt-6 border-t border-sand-200">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Start Over
                </button>
              </div>
            </div>
          </div>

          {/* Main question area */}
          <div className="lg:col-span-3">
            {/* Module header (mobile/tablet) */}
            <div className="lg:hidden mb-4 sm:mb-6 glass rounded-xl p-3 sm:p-4 flex items-center gap-3">
              <span className="text-xl sm:text-2xl">{currentModule?.icon}</span>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-navy text-sm sm:text-base truncate">{currentModule?.title}</h2>
                <p className="text-xs sm:text-sm text-gray-700 truncate">{currentModule?.subtitle}</p>
              </div>
            </div>

            {/* Question card */}
            <div className="relative min-h-[300px] sm:min-h-[400px]">
              {currentQuestion && (
                <QuestionCard
                  key={currentQuestion.id}
                  question={currentQuestion}
                  value={responses[currentQuestion.id]}
                  onChange={handleResponseChange}
                  isActive={true}
                  questionNumber={getQuestionNumber()}
                  totalQuestions={allQuestions.length}
                />
              )}
            </div>

            {/* Navigation buttons */}
            <div className="mt-6 sm:mt-8 flex items-center justify-between gap-2 sm:gap-3">
              <button
                type="button"
                onClick={goToPreviousQuestion}
                disabled={currentModuleIndex === 0 && currentQuestionIndex === 0}
                aria-label="Go to previous question"
                className={cn(
                  'flex items-center justify-center gap-2 px-3 sm:px-4 md:px-6 py-3 rounded-xl font-medium transition-all min-h-[44px] min-w-[44px]',
                  currentModuleIndex === 0 && currentQuestionIndex === 0
                    ? 'opacity-50 cursor-not-allowed text-gray-600'
                    : 'text-gray-700 hover:text-navy hover:bg-sand-100'
                )}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </button>

              <div className="flex items-center gap-2 sm:gap-3">
                {currentQuestion && !currentQuestion.required && (
                  <button
                    type="button"
                    onClick={skipQuestion}
                    aria-label="Skip this optional question"
                    className="px-3 sm:px-4 md:px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors min-h-[44px] text-sm sm:text-base"
                  >
                    Skip
                  </button>
                )}

                <button
                  type="button"
                  onClick={goToNextQuestion}
                  disabled={currentQuestion?.required && !isCurrentQuestionAnswered}
                  aria-label={currentModuleIndex === questionnaire.modules.length - 1 && currentQuestionIndex === currentModule?.questions.length - 1 ? 'Complete questionnaire' : 'Continue to next question'}
                  className={cn(
                    'flex items-center justify-center gap-2 px-4 sm:px-6 md:px-8 py-3 rounded-xl font-semibold transition-all shadow-lg min-h-[44px] min-w-[44px] text-sm sm:text-base',
                    currentQuestion?.required && !isCurrentQuestionAnswered
                      ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                      : 'bg-navy text-white hover:bg-navy/90 hover:shadow-xl'
                  )}
                >
                  <span className="hidden sm:inline">
                    {currentModuleIndex === questionnaire.modules.length - 1 &&
                     currentQuestionIndex === currentModule?.questions.length - 1
                      ? 'Complete'
                      : 'Continue'}
                  </span>
                  <span className="sm:hidden">
                    {currentModuleIndex === questionnaire.modules.length - 1 &&
                     currentQuestionIndex === currentModule?.questions.length - 1
                      ? 'Done'
                      : 'Next'}
                  </span>
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Milestone celebration modal */}
      <MilestoneModal
        milestone={showMilestone}
        onClose={handleMilestoneClose}
      />

      {/* Points popup animation - uses dynamic points based on combo multiplier */}
      <PointsPopup
        points={popupPoints}
        show={showPointsPopup}
        onComplete={handlePointsPopupComplete}
      />

      {/* Encouragement toast */}
      {showEncouragement && (
        <div className={cn("fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 max-w-md w-full", !prefersReducedMotion && "animate-slide-up")}>
          <div className="bg-navy text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 sm:gap-3 border border-gold/20">
            <span className="text-xl sm:text-2xl flex-shrink-0">💬</span>
            <span className="font-medium text-sm sm:text-base">{showEncouragement}</span>
          </div>
        </div>
      )}

      {/* Floating save status bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-sand-200 shadow-lg z-30 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Save status - aria-live for screen reader announcements */}
          <div className="flex items-center gap-3" role="status" aria-live="polite" aria-atomic="true">
            {isSyncing ? (
              <div className="flex items-center gap-2">
                <div className={cn("w-3 h-3 bg-blue-500 rounded-full", !prefersReducedMotion && "animate-pulse")} />
                <span className="text-sm text-blue-600 font-medium">Saving...</span>
              </div>
            ) : !isOnline ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full" />
                <span className="text-sm text-amber-600 font-medium">Offline - saved locally</span>
              </div>
            ) : lastSyncedAt ? (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-green-600 font-medium">
                  Saved <span className="hidden sm:inline">at {lastSyncedAt.toLocaleTimeString()}</span>
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
                <span className="text-sm text-gray-500">Auto-save enabled</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Progress indicator */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{Math.round(progress)}%</span>
              <span className="text-gray-400">complete</span>
            </div>

            {/* Manual Save button */}
            <button
              type="button"
              onClick={() => forceSync()}
              disabled={isSyncing}
              aria-label="Save progress now"
              title="Save Now"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px]",
                isSyncing
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-navy/10 text-navy hover:bg-navy/20"
              )}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="hidden sm:inline">Save Now</span>
            </button>

            {/* Submit button - Final submission */}
            <button
              type="button"
              onClick={() => setShowSubmitConfirm(true)}
              aria-label={`Submit questionnaire (${Math.round(progress)}% complete)`}
              title="Submit Questionnaire"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gold text-navy hover:bg-gold/90 transition-colors min-h-[44px] shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Submit</span>
            </button>

            {/* Reset button */}
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              aria-label="Start over and clear all answers"
              title="Start Over"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors min-h-[44px]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Start Over</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50"
            onClick={() => setShowResetConfirm(false)}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8"
              role="dialog"
              aria-modal="true"
              aria-labelledby="reset-modal-title"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 id="reset-modal-title" className="text-xl font-bold text-navy mb-2">
                  Start Over?
                </h3>
                <p className="text-gray-600">
                  This will clear all your answers and reset your progress to the beginning. This action cannot be undone.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-colors"
                >
                  Yes, Start Over
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Submit confirmation modal */}
      {showSubmitConfirm && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50"
            onClick={() => setShowSubmitConfirm(false)}
            aria-hidden="true"
          />
          {/* Modal */}
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-modal-title"
          >
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 id="submit-modal-title" className="text-xl font-bold text-navy mb-2">
                  Submit Questionnaire?
                </h3>
                <p className="text-gray-600 mb-2">
                  You have completed <span className="font-bold text-navy">{Math.round(progress)}%</span> of the questionnaire.
                </p>
                {progress < 100 && (
                  <p className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                    You can still go back and answer more questions if you&apos;d like.
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  Keep Editing
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 text-navy bg-gold hover:bg-gold/90 rounded-xl font-medium transition-colors shadow-sm"
                >
                  Submit Now
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
