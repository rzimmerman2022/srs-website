/**
 * Response Timeline Component
 * Displays questionnaire responses in a timeline format with questions and answers
 */

'use client';

import { Questionnaire, Question, QuestionModule } from '@/lib/questionnaire/types';
import { QuestionnaireResponse } from '@/lib/supabase/types';

interface ResponseTimelineProps {
  questionnaire: Questionnaire;
  response: QuestionnaireResponse;
}

interface TimelineItemProps {
  module: QuestionModule;
  moduleIndex: number;
  question: Question;
  answer: unknown;
  isAnswered: boolean;
}

function TimelineItem({
  module,
  moduleIndex,
  question,
  answer,
  isAnswered,
}: TimelineItemProps) {
  function formatAnswer(q: Question, a: unknown): string {
    if (a === null || a === undefined || a === '') {
      return 'Not answered';
    }

    switch (q.type) {
      case 'text':
      case 'textarea':
        return String(a);

      case 'number':
        return `${a}${q.unit ? ` ${q.unit}` : ''}`;

      case 'currency':
        const numValue = typeof a === 'string' ? parseFloat(a) : Number(a);
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(numValue);

      case 'radio':
      case 'select':
        const option = q.options?.find((opt) => opt.value === a);
        return option ? option.label : String(a);

      case 'checkbox':
        if (Array.isArray(a) && a.length > 0) {
          return a
            .map((value) => {
              const opt = q.options?.find((o) => o.value === value);
              return opt ? opt.label : value;
            })
            .join(', ');
        }
        return 'None selected';

      case 'date':
        try {
          return new Date(String(a)).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        } catch {
          return String(a);
        }

      case 'percentage-split':
        if (typeof a === 'object' && a !== null) {
          const entries = Object.entries(a as Record<string, number>);
          if (entries.length === 0) return 'Not answered';
          return entries
            .map(([key, value]) => {
              const opt = q.options?.find((o) => o.value === key);
              const label = opt ? opt.label : key;
              return `${label}: ${value}%`;
            })
            .join(', ');
        }
        return String(a);

      case 'timeline':
        if (typeof a === 'object' && a !== null) {
          const entries = Object.entries(a as Record<string, string>);
          if (entries.length === 0) return 'Not answered';
          return entries.map(([key, value]) => `${key}: ${value}`).join(', ');
        }
        return String(a);

      default:
        if (typeof a === 'object') {
          return JSON.stringify(a, null, 2);
        }
        return String(a);
    }
  }

  const answerText = formatAnswer(question, answer);
  const isUnanswered = !isAnswered || answerText === 'Not answered';

  return (
    <div className="relative flex gap-4 pb-8 last:pb-0 group">
      {/* Timeline line */}
      <div className="absolute left-[15px] top-[30px] bottom-0 w-0.5 bg-gray-200 group-last:hidden" />

      {/* Timeline dot */}
      <div className="relative flex-shrink-0">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            isUnanswered
              ? 'bg-white border-gray-300'
              : question.critical
                ? 'bg-red-50 border-red-500'
                : question.required
                  ? 'bg-amber-50 border-gold'
                  : 'bg-green-50 border-green-500'
          }`}
        >
          {isUnanswered ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${
                question.critical
                  ? 'text-red-600'
                  : question.required
                    ? 'text-gold'
                    : 'text-green-600'
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 print:break-inside-avoid">
        <div
          className={`bg-white border rounded-lg p-4 transition-all ${
            isUnanswered
              ? 'border-gray-200'
              : 'border-l-4 border-l-gold shadow-sm hover:shadow-md'
          }`}
        >
          {/* Module badge (only on first question of each module) */}
          {question.id === module.questions[0].id && (
            <div className="mb-3 flex items-center gap-2">
              {module.icon && (
                <span className="text-lg" role="img" aria-hidden="true">
                  {module.icon}
                </span>
              )}
              <span className="text-xs font-semibold text-navy uppercase tracking-wider">
                Module {moduleIndex + 1}: {module.title}
              </span>
            </div>
          )}

          {/* Question */}
          <div className="mb-3">
            <div className="flex items-start gap-2 mb-1">
              <h3 className="text-base font-semibold text-navy flex-1">
                {question.question}
              </h3>
              {question.critical && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 flex-shrink-0">
                  CRITICAL
                </span>
              )}
            </div>
            {question.subtitle && (
              <p className="text-sm text-gray-600 mb-2">{question.subtitle}</p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-navy-100 text-navy">
                {question.type}
              </span>
              <span className="text-xs text-gray-500 font-mono">{question.id}</span>
            </div>
          </div>

          {/* Answer */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs font-medium text-gray-600 mb-1">Answer:</div>
            <div
              className={`${
                isUnanswered
                  ? 'text-gray-400 italic'
                  : 'text-charcoal font-medium whitespace-pre-wrap'
              }`}
            >
              {answerText}
            </div>
          </div>

          {/* Why asking (expandable for context) */}
          {question.whyAsking && (
            <details className="mt-3 pt-3 border-t border-gray-100">
              <summary className="text-xs font-medium text-gray-600 cursor-pointer hover:text-navy">
                Why we asked this
              </summary>
              <p className="text-xs text-gray-600 mt-2">{question.whyAsking}</p>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResponseTimeline({ questionnaire, response }: ResponseTimelineProps) {
  const answers = (response.answers as Record<string, unknown>) || {};

  return (
    <div className="space-y-6">
      {questionnaire.modules.map((module, moduleIndex) => (
        <div key={module.id}>
          {module.questions.map((question) => {
            const answer = answers[question.id];
            const isAnswered =
              answer !== undefined && answer !== null && answer !== '';

            return (
              <TimelineItem
                key={question.id}
                module={module}
                moduleIndex={moduleIndex}
                question={question}
                answer={answer}
                isAnswered={isAnswered}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
