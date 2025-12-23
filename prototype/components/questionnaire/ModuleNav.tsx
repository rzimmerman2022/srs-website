'use client';

import { QuestionModule } from '@/lib/questionnaire/types';
import { cn } from '@/lib/utils';

interface ModuleNavProps {
  modules: QuestionModule[];
  currentModuleIndex: number;
  completedModules: string[];
  onModuleSelect: (index: number) => void;
}

export default function ModuleNav({
  modules,
  currentModuleIndex,
  completedModules,
  onModuleSelect
}: ModuleNavProps) {
  return (
    <nav
      className="glass rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-premium"
      role="navigation"
      aria-label="Questionnaire navigation"
    >
      <div className="flex items-center justify-between mb-3 lg:mb-4 px-2">
        <h3 className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">
          Sections
        </h3>
        {/* Step count - visually hidden but available to screen readers */}
        <span className="sr-only">
          Module {currentModuleIndex + 1} of {modules.length}
        </span>
        {/* Visible step count for all users */}
        <span className="text-xs font-medium text-gray-700" aria-hidden="true">
          {currentModuleIndex + 1}/{modules.length}
        </span>
      </div>
      <div className="space-y-1.5 lg:space-y-2">
        {modules.map((module, index) => {
          const isCompleted = completedModules.includes(module.id);
          const isCurrent = currentModuleIndex === index;
          const isAccessible = index === 0 || completedModules.includes(modules[index - 1]?.id) || index <= currentModuleIndex;

          return (
            <button
              key={module.id}
              onClick={() => isAccessible && onModuleSelect(index)}
              disabled={!isAccessible}
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={`Go to module ${index + 1} of ${modules.length}: ${module.title}${isCompleted ? ' (completed)' : ''}${isCurrent ? ' (current)' : ''}${!isAccessible ? ' (locked)' : ''}`}
              className={cn(
                'w-full text-left px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl transition-all duration-200 flex items-center gap-2 lg:gap-3 group min-h-[44px]',
                isCurrent && 'bg-navy text-white shadow-lg',
                !isCurrent && isCompleted && 'bg-green-50 text-green-700 hover:bg-green-100',
                !isCurrent && !isCompleted && isAccessible && 'hover:bg-sand-50 text-gray-700',
                !isAccessible && 'opacity-50 cursor-not-allowed text-gray-600'
              )}
            >
              {/* Status indicator */}
              <span className={cn(
                'w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold flex-shrink-0 transition-colors',
                isCurrent && 'bg-gold text-navy',
                !isCurrent && isCompleted && 'bg-green-500 text-white',
                !isCurrent && !isCompleted && 'bg-gray-200 text-gray-700'
              )}>
                {isCompleted ? (
                  <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{module.icon || index + 1}</span>
                )}
              </span>

              {/* Module info */}
              <div className="flex-1 min-w-0">
                <span className="font-medium block text-wrap leading-tight text-sm lg:text-base">{module.title}</span>
                <span className={cn(
                  'text-xs',
                  isCurrent ? 'text-sand-200' : 'text-gray-700'
                )}
                aria-label={`Estimated ${module.estimatedMinutes} minutes${!module.required ? ', optional' : ''}`}
                >
                  ~{module.estimatedMinutes} min
                  {!module.required && ' · Optional'}
                </span>
              </div>

              {/* Required badge */}
              {module.required && !isCompleted && (
                <span className={cn(
                  'px-1.5 lg:px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap',
                  isCurrent ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
                )}>
                  Required
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
