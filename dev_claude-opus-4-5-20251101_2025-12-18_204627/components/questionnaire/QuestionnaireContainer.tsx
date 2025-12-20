'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Questionnaire, Question, Milestone, DEFAULT_MILESTONES } from '@/lib/questionnaire/types';
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
}

export default function QuestionnaireContainer({
  questionnaire,
  clientId,
  onComplete
}: QuestionnaireContainerProps) {
  // Server-side sync hook (when clientId is provided)
  const {
    state: syncState,
    isLoading: isSyncLoading,
    isOnline,
    isSyncing,
    lastSyncedAt,
    error: syncError,
    updateState: updateSyncState,
    forceSync,
  } = useQuestionnaireSync({
    clientId: clientId || questionnaire.clientName || 'anonymous',
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
  const [sessionStartTime] = useState(Date.now());
  const comboTimeWindow = 15000; // 15 seconds to maintain combo

  // Initialize from sync state when it loads
  // TODO: Consider refactoring to useReducer for atomic state updates
  // Multiple setState calls here could cause race conditions under heavy load or rapid state changes
  // useReducer would ensure all state updates happen atomically in a single render cycle
  // See: https://react.dev/reference/react/useReducer
  useEffect(() => {
    if (syncState && !isDataLoaded) {
      setResponses(syncState.answers as Record<string, unknown> || {});
      setCurrentModuleIndex(syncState.currentModuleIndex || 0);
      setCurrentQuestionIndex(syncState.currentQuestionIndex || 0);
      setStreak(syncState.points || 0);
      setCombo(syncState.combo || 0);
      setShownMilestones(syncState.shownMilestones || []);
      if (Object.keys(syncState.answers || {}).length > 0) {
        setShowIntro(false);
      }
      setIsDataLoaded(true);
    }
  }, [syncState, isDataLoaded]);

  // Sync state changes to server (debounced)
  useEffect(() => {
    if (!isDataLoaded || !updateSyncState) return;

    updateSyncState({
      answers: responses as Record<string, string | string[]>,
      currentQuestionIndex,
      currentModuleIndex,
      points: streak,
      streak: streak,
      combo,
      shownMilestones,
      completed: false,
    });
    setLastSaved(new Date());
  }, [responses, currentQuestionIndex, currentModuleIndex, streak, combo, shownMilestones, isDataLoaded, updateSyncState]);

  // Derived state
  const currentModule = questionnaire.modules[currentModuleIndex];
  const currentQuestion = currentModule?.questions[currentQuestionIndex];

  // Get all questions flattened for progress calculation
  const allQuestions = useMemo(() => {
    return questionnaire.modules.flatMap(m => m.questions);
  }, [questionnaire.modules]);

  const requiredQuestions = useMemo(() => {
    return questionnaire.modules
      .filter(m => m.required)
      .flatMap(m => m.questions.filter(q => q.required));
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

  const requiredProgress = useMemo(() => {
    const answered = requiredQuestions.filter(q => isValidAnswer(responses[q.id])).length;
    // Guard against division by zero if there are no required questions
    return requiredQuestions.length > 0
      ? Math.round((answered / requiredQuestions.length) * 100)
      : 0;
  }, [requiredQuestions, responses]);

  // Estimated time remaining
  const estimatedMinutesRemaining = useMemo(() => {
    const remainingModules = questionnaire.modules.slice(currentModuleIndex);
    const currentModuleRemaining = currentModule
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
  }, [currentQuestion, isValidAnswer, combo, lastAnswerTime, comboTimeWindow, getEncouragementMessage]);

  // Check if current question is answered
  const isCurrentQuestionAnswered = useMemo(() => {
    if (!currentQuestion) return false;
    return isValidAnswer(responses[currentQuestion.id]);
  }, [currentQuestion, responses]);

  // Check if current module is complete
  const isCurrentModuleComplete = useMemo(() => {
    if (!currentModule) return false;
    return currentModule.questions.every(q => !q.required || isValidAnswer(responses[q.id]));
  }, [currentModule, responses]);

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
      onComplete?.(responses);
    }
  }, [currentModule, currentModuleIndex, currentQuestionIndex, questionnaire.modules.length, completedModules, responses, onComplete, isCurrentQuestionAnswered]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentModuleIndex > 0) {
      const prevModule = questionnaire.modules[currentModuleIndex - 1];
      setCurrentModuleIndex(prev => prev - 1);
      setCurrentQuestionIndex(prevModule.questions.length - 1);
    }
  }, [currentQuestionIndex, currentModuleIndex, questionnaire.modules]);

  const handleModuleSelect = useCallback((index: number) => {
    setCurrentModuleIndex(index);
    setCurrentQuestionIndex(0);
  }, []);

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

  // Loading state
  if (isSyncLoading && !isDataLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sand-50 via-white to-sand-100 flex items-center justify-center">
        <div className="glass rounded-3xl p-12 shadow-premium text-center">
          <div className="animate-spin w-12 h-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-6" role="status" aria-label="Loading your progress" />
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
              onClick={() => setShowIntro(false)}
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
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Progress info */}
            <div className="flex items-center gap-4">
              <ProgressRing progress={progress} size={50} strokeWidth={4} />
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-navy" aria-label={`${answeredCount} of ${allQuestions.length} questions answered`}>
                  {answeredCount} of {allQuestions.length} answered
                </div>
                <div className="text-xs text-gray-700" aria-label={`Estimated ${estimatedMinutesRemaining} minutes remaining`}>
                  ~{estimatedMinutesRemaining} min remaining
                </div>
              </div>
            </div>

            {/* Center: Current module */}
            <div className="flex-1 text-center hidden md:block">
              <span className="text-2xl mr-2" aria-hidden="true">{currentModule?.icon}</span>
              <span className="font-semibold text-navy">{currentModule?.title}</span>
            </div>

            {/* Right: Streak & save status */}
            <div className="flex items-center gap-2 sm:gap-4">
              {streak > 0 && (
                <div className={cn(
                  "relative flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300",
                  "bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 border border-amber-200",
                  getStreakDisplay().pulse && "animate-progress-pulse"
                )}>
                  <div className="flex items-center gap-2">
                    <span className={cn(getStreakDisplay().size, "animate-float-bounce")}>
                      {getStreakDisplay().fire}
                    </span>
                    <div className="flex flex-col items-start">
                      <span className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                        {streak}
                      </span>
                      <span className="text-xs text-amber-700 font-semibold uppercase tracking-wide">
                        streak
                      </span>
                    </div>
                  </div>
                  {/* Combo multiplier indicator */}
                  {currentMultiplier > 1 && (
                    <div className="mt-1 sm:mt-0 px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                      <span className="text-white text-xs font-bold">
                        {currentMultiplier}x COMBO
                      </span>
                    </div>
                  )}
                </div>
              )}
              {/* Mobile sync status - icon only */}
              <div className="sm:hidden flex items-center">
                {isSyncing && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" title="Syncing..." aria-label="Syncing..." />
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
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" aria-label="Syncing..." />
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
                  <div className="text-xs text-gray-400">
                    {lastSaved.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress bar - enhanced with shimmer effect */}
          <div className="mt-3 h-2.5 bg-sand-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full relative overflow-hidden transition-all duration-700"
              role="progressbar"
              aria-valuenow={progress}
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

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Module nav */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32">
              <ModuleNav
                modules={questionnaire.modules}
                currentModuleIndex={currentModuleIndex}
                completedModules={completedModules}
                onModuleSelect={handleModuleSelect}
              />
            </div>
          </div>

          {/* Main question area */}
          <div className="lg:col-span-3">
            {/* Module header (mobile) */}
            <div className="lg:hidden mb-6 glass rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">{currentModule?.icon}</span>
              <div>
                <h2 className="font-semibold text-navy">{currentModule?.title}</h2>
                <p className="text-sm text-gray-700">{currentModule?.subtitle}</p>
              </div>
            </div>

            {/* Question card */}
            <div className="relative min-h-[400px]">
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
            <div className="mt-8 flex items-center justify-between gap-3 sm:gap-4">
              <button
                type="button"
                onClick={goToPreviousQuestion}
                disabled={currentModuleIndex === 0 && currentQuestionIndex === 0}
                aria-label="Go to previous question"
                className={cn(
                  'flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-medium transition-all min-h-[44px] min-w-[44px]',
                  currentModuleIndex === 0 && currentQuestionIndex === 0
                    ? 'opacity-50 cursor-not-allowed text-gray-400'
                    : 'text-gray-600 hover:text-navy hover:bg-sand-100'
                )}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
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
                    className="px-4 sm:px-6 py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors min-h-[44px]"
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
                    'flex items-center gap-2 px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all shadow-lg min-h-[44px] min-w-[44px]',
                    currentQuestion?.required && !isCurrentQuestionAnswered
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-navy text-white hover:bg-navy/90 hover:shadow-xl'
                  )}
                >
                  {currentModuleIndex === questionnaire.modules.length - 1 &&
                   currentQuestionIndex === currentModule?.questions.length - 1
                    ? 'Complete'
                    : 'Continue'}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Keyboard hint */}
            <p className="text-center text-sm text-gray-400 mt-6">
              Press <kbd className="px-2 py-1 bg-sand-100 rounded text-gray-600 font-mono text-xs">Enter</kbd> to continue
            </p>
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
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-navy text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-gold/20">
            <span className="text-2xl">💬</span>
            <span className="font-medium">{showEncouragement}</span>
          </div>
        </div>
      )}
    </div>
  );
}
