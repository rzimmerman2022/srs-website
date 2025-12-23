'use client';

import { useState } from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

// Generate stable ID from question text
function generateStableId(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

export default function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const stableKey = generateStableId(item.question);
        const itemId = `faq-${stableKey}`;

        return (
          <div
            key={stableKey}
            className={`border rounded-xl overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen
                ? 'border-gold bg-white shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            {/* Header/Question Button */}
            <button
              type="button"
              id={`${itemId}-button`}
              className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded-xl"
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen ? 'true' : 'false'}
              aria-controls={`${itemId}-content`}
            >
              <span className="font-semibold text-navy text-base leading-relaxed">
                {item.question}
              </span>
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isOpen
                    ? 'bg-gold text-white rotate-180'
                    : 'bg-sand-100 text-gold'
                }`}
                aria-hidden="true"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>

            {/* Content/Answer Panel */}
            <div
              id={`${itemId}-content`}
              role="region"
              aria-labelledby={`${itemId}-button`}
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-6 pt-2 pb-6 text-gray-700 leading-relaxed text-base border-t border-gray-100">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
