export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  details?: string[];
}

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

export default function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-gold-400 to-gold hidden md:block"
        aria-hidden="true"
      />

      <div className="space-y-12">
        {steps.map((step, index) => (
          <div key={index} className="relative flex flex-col md:flex-row gap-6">
            {/* Step number */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center border-4 border-white shadow-lg relative z-10">
                <span className="text-2xl font-bold text-navy">{step.number}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <h3 className="text-2xl font-serif font-semibold text-navy mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>

              {step.details && step.details.length > 0 && (
                <ul className="space-y-2">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-gold mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
