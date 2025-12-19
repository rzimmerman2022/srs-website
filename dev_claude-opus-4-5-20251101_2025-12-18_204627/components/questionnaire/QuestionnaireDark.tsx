'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Questionnaire, Question, Milestone, DEFAULT_MILESTONES } from '@/lib/questionnaire/types';
import { cn } from '@/lib/utils';
import QuestionnaireHeader from './QuestionnaireHeader';
import MilestoneModal from './MilestoneModal';

interface QuestionnaireDarkProps {
  questionnaire: Questionnaire;
  onComplete?: (responses: Record<string, unknown>) => void;
}

export default function QuestionnaireDark({
  questionnaire,
  onComplete
}: QuestionnaireDarkProps) {
  // State
  const [responses, setResponses] = useState<Record<string, unknown>>({});
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [showMilestone, setShowMilestone] = useState<Milestone | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>(DEFAULT_MILESTONES);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Get all questions flattened
  const allQuestions = useMemo(() => {
    return questionnaire.modules.flatMap(m => m.questions);
  }, [questionnaire.modules]);

  // Calculate progress
  const answeredCount = useMemo(() => {
    return allQuestions.filter(q => {
      const response = responses[q.id];
      if (response === undefined || response === null || response === '') return false;
      if (Array.isArray(response) && response.length === 0) return false;
      if (typeof response === 'object' && Object.keys(response as object).length === 0) return false;
      return true;
    }).length;
  }, [allQuestions, responses]);

  const progress = useMemo(() => {
    return Math.round((answeredCount / allQuestions.length) * 100);
  }, [answeredCount, allQuestions.length]);

  // Track which milestones have been shown to prevent duplicate displays
  const [shownMilestones, setShownMilestones] = useState<number[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Check for milestone achievements - fixed to prevent infinite loop
  useEffect(() => {
    if (!isDataLoaded) return;

    // Find the first milestone that should be triggered but hasn't been shown yet
    const milestoneToShow = milestones.find(m =>
      progress >= m.threshold && !shownMilestones.includes(m.threshold)
    );

    if (milestoneToShow && !showMilestone) {
      setShowMilestone({ ...milestoneToShow, unlocked: true });
      setShownMilestones(prev => [...prev, milestoneToShow.threshold]);
    }
  }, [progress, showMilestone, isDataLoaded]); // Removed milestones and shownMilestones to prevent loop

  // Auto-save to localStorage - only after data is loaded to prevent race condition
  useEffect(() => {
    if (!isDataLoaded) return; // Don't save until localStorage data is loaded

    const key = `questionnaire-${questionnaire.id}`;
    const data = {
      responses,
      currentModuleIndex,
      completedModules,
      shownMilestones,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(data));
    setLastSaved(new Date());
  }, [responses, currentModuleIndex, completedModules, shownMilestones, questionnaire.id, isDataLoaded]);

  // Load from localStorage on mount
  useEffect(() => {
    const key = `questionnaire-${questionnaire.id}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const data = JSON.parse(saved);
        setResponses(data.responses || {});
        setCurrentModuleIndex(data.currentModuleIndex || 0);
        setCompletedModules(data.completedModules || []);
        setShownMilestones(data.shownMilestones || []);
        if (data.responses && Object.keys(data.responses).length > 0) {
          setShowIntro(false);
        }
      }
    } catch (e) {
      console.error('Failed to load saved responses', e);
    }
    // Mark data as loaded so milestones can now trigger
    setIsDataLoaded(true);
  }, [questionnaire.id]);

  // Handle response change
  const handleResponseChange = useCallback((questionId: string, value: unknown) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  }, []);

  // Save progress manually
  const handleSaveProgress = useCallback(() => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Progress saved! You can safely close this page and return later.');
    }, 500);
  }, []);

  // Submit assessment
  const handleSubmit = useCallback(() => {
    const unansweredRequired = allQuestions.filter(q => {
      if (!q.required) return false;
      const response = responses[q.id];
      if (response === undefined || response === null || response === '') return true;
      if (Array.isArray(response) && response.length === 0) return true;
      return false;
    });

    if (unansweredRequired.length > 0) {
      alert(`Please complete all required questions. ${unansweredRequired.length} required questions remaining.`);
      return;
    }

    onComplete?.(responses);
  }, [allQuestions, responses, onComplete]);

  // Render question input based on type
  const renderQuestionInput = (question: Question) => {
    const value = responses[question.id];

    switch (question.type) {
      case 'text':
      case 'date':
        return (
          <input
            type="text"
            value={(value as string) || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full px-4 py-3 rounded-lg bg-[#1a2a4a] border border-[#2a3a5a] text-white placeholder-gray-500 focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all"
          />
        );

      case 'currency':
        return (
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="text"
              value={(value as string) || ''}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              className="w-full pl-8 pr-4 py-3 rounded-lg bg-[#1a2a4a] border border-[#2a3a5a] text-white placeholder-gray-500 focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all"
            />
          </div>
        );

      case 'textarea':
        return (
          <textarea
            value={(value as string) || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-[#1a2a4a] border border-[#2a3a5a] text-white placeholder-gray-500 focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all resize-none"
          />
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label
                key={option.value}
                className={cn(
                  'flex items-start p-4 rounded-lg cursor-pointer transition-all duration-200 group border',
                  value === option.value
                    ? 'bg-gold/10 border-gold'
                    : 'bg-[#1a2a4a] border-[#2a3a5a] hover:border-gold/50'
                )}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => handleResponseChange(question.id, option.value)}
                  className="sr-only"
                />
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 mr-4 flex items-center justify-center transition-colors',
                  value === option.value ? 'border-gold bg-gold' : 'border-gray-500'
                )}>
                  {value === option.value && (
                    <div className="w-2 h-2 rounded-full bg-[#0a1628]" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-medium text-white block">{option.label}</span>
                  {option.description && (
                    <span className="text-sm text-gray-400 mt-1 block">{option.description}</span>
                  )}
                </div>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        const selectedValues = (value as string[]) || [];
        return (
          <div className="space-y-3">
            {question.options?.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <label
                  key={option.value}
                  className={cn(
                    'flex items-start p-4 rounded-lg cursor-pointer transition-all duration-200 group border',
                    isSelected
                      ? 'bg-gold/10 border-gold'
                      : 'bg-[#1a2a4a] border-[#2a3a5a] hover:border-gold/50'
                  )}
                >
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleResponseChange(question.id, [...selectedValues, option.value]);
                      } else {
                        handleResponseChange(question.id, selectedValues.filter((v) => v !== option.value));
                      }
                    }}
                    className="sr-only"
                  />
                  <div className={cn(
                    'w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 mr-4 flex items-center justify-center transition-colors',
                    isSelected ? 'border-gold bg-gold' : 'border-gray-500'
                  )}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-[#0a1628]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-white block">{option.label}</span>
                    {option.description && (
                      <span className="text-sm text-gray-400 mt-1 block">{option.description}</span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        );

      case 'percentage-split':
        const percentages = (value as Record<string, number>) || {};
        return (
          <div className="space-y-4">
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center gap-4">
                <div className="flex-1">
                  <span className="font-medium text-white">{option.label}</span>
                  {option.description && (
                    <span className="text-sm text-gray-400 block">{option.description}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={percentages[option.value] || ''}
                    onChange={(e) => {
                      const newVal = e.target.value ? Number(e.target.value) : 0;
                      handleResponseChange(question.id, { ...percentages, [option.value]: newVal });
                    }}
                    className="w-20 px-3 py-2 rounded-lg bg-[#1a2a4a] border border-[#2a3a5a] text-white text-center focus:border-gold focus:ring-1 focus:ring-gold/50"
                  />
                  <span className="text-gray-400">%</span>
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-2 border-t border-[#2a3a5a]">
              <span className={cn(
                'font-semibold',
                Object.values(percentages).reduce((a, b) => a + b, 0) === 100 ? 'text-green-400' : 'text-amber-400'
              )}>
                Total: {Object.values(percentages).reduce((a, b) => a + b, 0)}%
              </span>
            </div>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={(value as string) || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full px-4 py-3 rounded-lg bg-[#1a2a4a] border border-[#2a3a5a] text-white placeholder-gray-500 focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all"
          />
        );
    }
  };

  // Intro screen
  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628]">
        <QuestionnaireHeader
          title="Strategic Placement Diagnostic"
          packageType={questionnaire.packageType}
          clientName={questionnaire.clientName}
        />

        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Intro Card */}
          <div className="bg-[#0d1f3c] border border-[#1a3a5a] rounded-2xl p-8 md:p-12 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-serif text-gold mb-6">
              YOUR STRATEGIC PLACEMENT DIAGNOSTIC
            </h2>

            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Thank you for choosing Southwest Resume Services. I'm looking forward to working with you.
              </p>

              {questionnaire.introText && (
                <p>{questionnaire.introText}</p>
              )}

              <p className="font-medium text-white">
                Keep your answers concise—short phrases and quick notes work perfectly. No need for full sentences unless you prefer them.
                {' '}Ranges are fine. No sensitive details needed. If you're unsure, estimates are fine—we'll validate later.
                {' '}If you don't know an answer or aren't sure, write "N/A" or "unclear"—that helps us identify where additional research will strengthen your materials.
              </p>

              <p className="text-gold/80 italic">Let's begin.</p>

              <div className="pt-6 border-t border-[#1a3a5a] mt-6">
                <p className="font-semibold text-white">Ryan Zimmerman</p>
                <p className="text-gray-400">Founder & CEO</p>
                <p className="text-gray-400">Southwest Resume Services</p>
              </div>
            </div>

            <button
              onClick={() => setShowIntro(false)}
              className="mt-8 w-full py-4 bg-gradient-to-r from-gold to-gold/80 text-[#0a1628] font-bold rounded-xl hover:from-gold/90 hover:to-gold/70 transition-all text-lg shadow-lg"
            >
              Begin Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628]">
      <QuestionnaireHeader
        title="Strategic Placement Diagnostic"
        packageType={questionnaire.packageType}
        clientName={questionnaire.clientName}
      />

      {/* Progress Bar */}
      <div className="sticky top-0 z-40 bg-[#0a1628]/95 backdrop-blur-sm border-b border-[#1a3a5a] py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-2 bg-[#1a2a4a] rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-gold to-gold/70 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gold font-medium">{progress}% Complete</span>
            <span className="text-gray-400">{answeredCount} of {allQuestions.length} Questions</span>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {questionnaire.modules.map((module, moduleIndex) => (
          <div key={module.id} className="mb-12">
            {/* Module Header */}
            <div className="flex items-center gap-4 mb-8">
              <span className="w-12 h-12 bg-gold/20 border border-gold/40 rounded-lg flex items-center justify-center text-gold font-bold text-xl">
                {moduleIndex + 1}
              </span>
              <div>
                <h2 className="text-2xl font-serif text-gold uppercase tracking-wide">
                  {module.title}
                </h2>
                {module.subtitle && (
                  <p className="text-gray-400 text-sm">{module.subtitle}</p>
                )}
              </div>
              {module.required && (
                <span className="ml-auto px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                  Required
                </span>
              )}
            </div>

            {/* Module Description */}
            {module.description && (
              <p className="text-gray-400 mb-8 pl-16">{module.description}</p>
            )}

            {/* Questions */}
            <div className="space-y-8 pl-16">
              {module.questions.map((question, questionIndex) => {
                // Calculate global question number
                let globalIndex = 0;
                for (let i = 0; i < moduleIndex; i++) {
                  globalIndex += questionnaire.modules[i].questions.length;
                }
                globalIndex += questionIndex + 1;

                return (
                  <div
                    key={question.id}
                    className="bg-[#0d1f3c] border border-[#1a3a5a] rounded-xl p-6 md:p-8"
                  >
                    {/* Question Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-gold font-bold text-sm uppercase tracking-wider">
                        Question {globalIndex}:
                      </span>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg">
                          {question.question}
                          {question.required && <span className="text-red-400 ml-1">*</span>}
                        </h3>
                        {question.critical && (
                          <span className="inline-block mt-2 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-medium rounded">
                            CRITICAL
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Subtitle / Helper Text */}
                    {question.subtitle && (
                      <p className="text-gray-400 italic text-sm mb-4 ml-[85px]">
                        {question.subtitle}
                      </p>
                    )}

                    {/* Why Asking */}
                    {question.whyAsking && (
                      <details className="mb-4 ml-[85px]">
                        <summary className="text-gold/80 text-sm cursor-pointer hover:text-gold transition-colors">
                          Why are we asking this?
                        </summary>
                        <p className="mt-2 text-gray-400 text-sm pl-4 border-l-2 border-gold/30">
                          {question.whyAsking}
                        </p>
                      </details>
                    )}

                    {/* Input */}
                    <div className="ml-[85px]">
                      {renderQuestionInput(question)}
                    </div>

                    {/* Help Text */}
                    {question.helpText && (
                      <p className="mt-4 text-gray-500 text-sm italic ml-[85px]">
                        💡 {question.helpText}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Thank You / Submit Section */}
        <div className="bg-[#0d1f3c] border border-[#1a3a5a] rounded-2xl p-8 md:p-12 mt-12">
          <h2 className="text-2xl md:text-3xl font-serif text-gold mb-6">
            THANK YOU, {questionnaire.clientName.split(' ')[0].toUpperCase()}
          </h2>

          <div className="space-y-4 text-gray-300 leading-relaxed mb-8">
            <p>
              Thank you for completing this questionnaire. Your responses give us exactly what we need to create powerful positioning materials that will serve you well in the interview process.
            </p>
            <p>
              When you're ready to submit, click the "Submit Assessment" button below. You'll have the option to copy your responses to your clipboard or send them directly via email to ryan.zimmerman@southwestresumes.com.
            </p>
            <p className="text-gray-400 text-sm">
              We'll review your responses promptly and follow up with next steps.
            </p>

            <div className="pt-6 border-t border-[#1a3a5a] mt-6">
              <p className="font-semibold text-white">Ryan Zimmerman</p>
              <p className="text-gray-400">Founder & CEO</p>
              <p className="text-gray-400">Southwest Resume Services</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSaveProgress}
              disabled={isSaving}
              className="flex-1 py-4 px-6 bg-[#1a2a4a] border border-[#2a3a5a] text-white font-medium rounded-xl hover:bg-[#1a3a5a] transition-all flex items-center justify-center gap-2"
            >
              <span>💾</span>
              {isSaving ? 'Saving...' : 'Save Progress'}
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-gold to-gold/80 text-[#0a1628] font-bold rounded-xl hover:from-gold/90 hover:to-gold/70 transition-all flex items-center justify-center gap-2"
            >
              <span>🚀</span>
              Submit Assessment
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 mt-8 border-t border-[#1a3a5a]">
          <p className="text-gray-500 text-sm">
            © 2025 Southwest Resume Services | Strategic Placement Diagnostic™
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Document Version: v1.2 | Client: {questionnaire.clientName} | Package: {questionnaire.packageType}
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Contact: ryan.zimmerman@southwestresumes.com
          </p>
        </footer>
      </div>

      {/* Milestone Modal */}
      <MilestoneModal
        milestone={showMilestone}
        onClose={() => setShowMilestone(null)}
      />
    </div>
  );
}
