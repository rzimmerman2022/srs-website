'use client';

import { useState } from 'react';
import { Question } from '@/lib/questionnaire/types';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
  value: unknown;
  onChange: (value: unknown) => void;
  isActive: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionCard({
  question,
  value,
  onChange,
  isActive,
  questionNumber,
  totalQuestions
}: QuestionCardProps) {
  const [showWhyAsking, setShowWhyAsking] = useState(false);

  const renderInput = () => {
    switch (question.type) {
      case 'text':
      case 'date':
        return (
          <input
            type={question.type === 'date' ? 'text' : 'text'}
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            className="w-full px-4 py-3 rounded-xl border-2 border-sand-200 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
          />
        );

      case 'currency':
        return (
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
            <input
              type="number"
              value={(value as number) || ''}
              onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
              placeholder={question.placeholder}
              className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-sand-200 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
            />
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            value={(value as number) || ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
            placeholder={question.placeholder}
            min={question.min}
            max={question.max}
            className="w-full px-4 py-3 rounded-xl border-2 border-sand-200 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border-2 border-sand-200 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg resize-none"
          />
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label
                key={option.value}
                className={cn(
                  'flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group',
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
                  'w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 mr-4 flex items-center justify-center transition-colors',
                  value === option.value ? 'border-gold bg-gold' : 'border-gray-300 group-hover:border-gold/50'
                )}>
                  {value === option.value && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <span className={cn(
                    'font-medium block',
                    value === option.value ? 'text-navy' : 'text-gray-700'
                  )}>
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="text-sm text-gray-500 mt-1 block">
                      {option.description}
                    </span>
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
                    'flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group',
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
                    'w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 mr-4 flex items-center justify-center transition-colors',
                    isSelected ? 'border-gold bg-gold' : 'border-gray-300 group-hover:border-gold/50'
                  )}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className={cn(
                      'font-medium block',
                      isSelected ? 'text-navy' : 'text-gray-700'
                    )}>
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="text-sm text-gray-500 mt-1 block">
                        {option.description}
                      </span>
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
                  <span className="font-medium text-gray-700">{option.label}</span>
                  {option.description && (
                    <span className="text-sm text-gray-500 block">{option.description}</span>
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
                    className="w-20 px-3 py-2 rounded-lg border-2 border-sand-200 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-center"
                  />
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-2 border-t border-sand-200">
              <span className={cn(
                'font-semibold',
                Object.values(percentages).reduce((a, b) => a + b, 0) === 100 ? 'text-green-600' : 'text-amber-600'
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
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            className="w-full px-4 py-3 rounded-xl border-2 border-sand-200 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200 bg-white/80 backdrop-blur-sm text-lg"
          />
        );
    }
  };

  return (
    <div
      className={cn(
        'glass rounded-2xl p-8 md:p-10 shadow-premium transition-all duration-500',
        isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none absolute'
      )}
    >
      {/* Question header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
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
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              Optional
            </span>
          )}
        </div>

        <h2 className="text-2xl md:text-3xl font-serif font-bold text-navy mb-2">
          {question.question}
        </h2>

        {question.subtitle && (
          <p className="text-lg text-gray-600 mb-4">{question.subtitle}</p>
        )}

        {question.whyAsking && (
          <div className="mb-4">
            <button
              onClick={() => setShowWhyAsking(!showWhyAsking)}
              className="text-sm text-gold font-medium flex items-center gap-2 hover:text-gold/80 transition-colors"
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
              <div className="mt-3 p-4 bg-gold/10 rounded-xl border border-gold/20 text-sm text-gray-700">
                {question.whyAsking}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Question input */}
      <div className="mb-6">
        {renderInput()}
      </div>

      {/* Help text */}
      {question.helpText && (
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-blue-700">{question.helpText}</p>
        </div>
      )}
    </div>
  );
}
