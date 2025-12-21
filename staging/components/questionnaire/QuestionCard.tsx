'use client';

import { useState, memo, useRef, useEffect } from 'react';
import { Question } from '@/lib/questionnaire/types';
import { cn } from '@/lib/utils';
import { isStringValue, isNumberValue, isStringArray, isPercentageRecord } from '@/lib/questionnaire/type-guards';

interface QuestionCardProps {
  question: Question;
  value: unknown;
  onChange: (value: unknown) => void;
  isActive: boolean;
  questionNumber: number;
  totalQuestions: number;
}

// Performance: Memoize component to prevent re-renders on parent state changes
function QuestionCard({
  question,
  value,
  onChange,
  isActive,
  questionNumber,
  totalQuestions
}: QuestionCardProps) {
  const [showWhyAsking, setShowWhyAsking] = useState(false);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);

  // Focus management: Move focus to question heading when question becomes active
  useEffect(() => {
    if (isActive && questionHeadingRef.current) {
      questionHeadingRef.current.focus();
    }
  }, [isActive, question.id]);

  const renderInput = () => {
    switch (question.type) {
      case 'text':
      case 'date':
        return (
          <input
            type={question.type === 'date' ? 'text' : 'text'}
            value={isStringValue(value) ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            aria-label={question.question}
            className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl border-2 border-sand-200 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base sm:text-lg min-h-[44px]"
          />
        );

      case 'currency':
        return (
          <div className="relative">
            <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-600 text-base sm:text-lg" id={`${question.id}-currency-symbol`} aria-hidden="true">$</span>
            <input
              type="number"
              value={isNumberValue(value) ? value : ''}
              onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
              placeholder={question.placeholder}
              aria-label={question.question}
              aria-describedby={`${question.id}-currency-symbol`}
              className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl border-2 border-sand-200 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base sm:text-lg min-h-[44px]"
            />
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            value={isNumberValue(value) ? value : ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
            placeholder={question.placeholder}
            min={question.min}
            max={question.max}
            aria-label={question.question}
            className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl border-2 border-sand-200 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base sm:text-lg min-h-[44px]"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={isStringValue(value) ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            aria-label={question.question}
            className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl border-2 border-sand-200 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base sm:text-lg resize-none"
          />
        );

      case 'radio':
        return (
          <fieldset>
            <legend className="sr-only">{question.question}</legend>
            <div className="space-y-2 sm:space-y-3">
              {question.options?.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    'flex items-start p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-200 group min-h-[44px]',
                    value === option.value
                      ? 'border-gold bg-gold/10 shadow-md'
                      : 'border-sand-200 bg-white/80 hover:border-gold/50 hover:bg-gold/5'
                  )}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={value === option.value}
                    onChange={() => onChange(option.value)}
                    className="sr-only"
                  />
                  <div className={cn(
                    'w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex-shrink-0 mt-0.5 mr-3 sm:mr-4 flex items-center justify-center transition-colors',
                    value === option.value ? 'border-gold bg-gold' : 'border-gray-300 group-hover:border-gold/50'
                  )}>
                    {value === option.value && (
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className={cn(
                      'font-medium block text-sm sm:text-base',
                      value === option.value ? 'text-navy' : 'text-gray-700'
                    )}>
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="text-xs sm:text-sm text-gray-700 mt-1 block">
                        {option.description}
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </fieldset>
        );

      case 'checkbox':
        const selectedValues = isStringArray(value) ? value : [];
        return (
          <fieldset>
            <legend className="sr-only">{question.question}</legend>
            <div className="space-y-2 sm:space-y-3">
              {question.options?.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className={cn(
                      'flex items-start p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-200 group min-h-[44px]',
                      isSelected
                        ? 'border-gold bg-gold/10 shadow-md'
                        : 'border-sand-200 bg-white/80 hover:border-gold/50 hover:bg-gold/5'
                    )}
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onChange([...selectedValues, option.value]);
                        } else {
                          onChange(selectedValues.filter((v) => v !== option.value));
                        }
                      }}
                      className="sr-only"
                    />
                    <div className={cn(
                      'w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 flex-shrink-0 mt-0.5 mr-3 sm:mr-4 flex items-center justify-center transition-colors',
                      isSelected ? 'border-gold bg-gold' : 'border-gray-300 group-hover:border-gold/50'
                    )}>
                      {isSelected && (
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className={cn(
                        'font-medium block text-sm sm:text-base',
                        isSelected ? 'text-navy' : 'text-gray-700'
                      )}>
                        {option.label}
                      </span>
                      {option.description && (
                        <span className="text-xs sm:text-sm text-gray-700 mt-1 block">
                          {option.description}
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>
        );

      case 'percentage-split':
        const percentages = isPercentageRecord(value) ? value : {};
        const total = Object.values(percentages).reduce((a, b) => a + b, 0);
        const isInvalid = total !== 100 && total > 0;
        return (
          <div className="space-y-3 sm:space-y-4">
            {question.options?.map((option) => (
              <div key={option.value} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-2 sm:p-0">
                <div className="flex-1">
                  <span className="font-medium text-gray-700 text-sm sm:text-base">{option.label}</span>
                  {option.description && (
                    <span className="text-xs sm:text-sm text-gray-700 block">{option.description}</span>
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
                      onChange({ ...percentages, [option.value]: newVal });
                    }}
                    aria-label={`${option.label} percentage`}
                    aria-invalid={isInvalid ? "true" : "false"}
                    aria-describedby={isInvalid ? `${question.id}-error` : undefined}
                    className="w-20 sm:w-24 px-3 py-2.5 rounded-lg border-2 border-sand-200 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-center min-h-[44px] text-base"
                  />
                  <span className="text-gray-700 text-sm sm:text-base">%</span>
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-2 border-t border-sand-200">
              <span
                id={`${question.id}-error`}
                className={cn(
                  'font-semibold text-sm sm:text-base',
                  total === 100 ? 'text-green-600' : 'text-amber-600'
                )}
                {...(isInvalid && { role: 'alert' })}
              >
                Total: {total}% {isInvalid && '(must equal 100%)'}
              </span>
            </div>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={isStringValue(value) ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            aria-label={question.question}
            className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl border-2 border-sand-200 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200 bg-white/80 backdrop-blur-sm text-base sm:text-lg min-h-[44px]"
          />
        );
    }
  };

  return (
    <div
      className={cn(
        'glass rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-premium transition-all duration-500',
        isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none absolute'
      )}
    >
      {/* Question header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <span className="text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider">
            Question {questionNumber} of {totalQuestions}
          </span>
          {question.critical && (
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
              CRITICAL
            </span>
          )}
          {question.required && !question.critical && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
              Required
            </span>
          )}
          {!question.required && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              Optional
            </span>
          )}
        </div>

        <h2
          ref={questionHeadingRef}
          tabIndex={-1}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-bold text-navy mb-2 outline-none"
        >
          {question.question}
        </h2>

        {question.subtitle && (
          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4">{question.subtitle}</p>
        )}

        {question.whyAsking && (
          <div className="mb-3 sm:mb-4">
            <button
              type="button"
              onClick={() => setShowWhyAsking(!showWhyAsking)}
              aria-expanded={showWhyAsking ? "true" : "false"}
              className="text-xs sm:text-sm text-gold font-medium flex items-center gap-2 hover:text-gold/80 transition-colors min-h-[44px]"
            >
              <span className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center text-xs">?</span>
              Why are we asking this?
              <svg
                className={cn('w-4 h-4 transition-transform', showWhyAsking && 'rotate-180')}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showWhyAsking && (
              <div className="mt-2 sm:mt-3 p-3 sm:p-4 bg-gold/10 rounded-xl border border-gold/20 text-xs sm:text-sm text-gray-700">
                {question.whyAsking}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Question input */}
      <div className="mb-4 sm:mb-6">
        {renderInput()}
      </div>

      {/* Help text */}
      {question.helpText && (
        <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-100">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs sm:text-sm text-blue-700">{question.helpText}</p>
        </div>
      )}
    </div>
  );
}

export default memo(QuestionCard);
