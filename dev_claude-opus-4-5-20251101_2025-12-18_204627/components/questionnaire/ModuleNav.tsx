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
    <nav className="glass rounded-2xl p-4 shadow-premium" aria-label="Questionnaire sections">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 px-2">
        Sections
      </h3>
      <div className="space-y-2">
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
              className={cn(
                'w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 group min-h-[44px]',
                isCurrent && 'bg-navy text-white shadow-lg',
                !isCurrent && isCompleted && 'bg-green-50 text-green-700 hover:bg-green-100',
                !isCurrent && !isCompleted && isAccessible && 'hover:bg-sand-50 text-gray-600',
                !isAccessible && 'opacity-50 cursor-not-allowed text-gray-400'
              )}
            >
              {/* Status indicator */}
              <span className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors',
                isCurrent && 'bg-gold text-navy',
                !isCurrent && isCompleted && 'bg-green-500 text-white',
                !isCurrent && !isCompleted && 'bg-gray-200 text-gray-500'
              )}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{module.icon || index + 1}</span>
                )}
              </span>

              {/* Module info */}
              <div className="flex-1 min-w-0">
                <span className="font-medium block text-wrap leading-tight">{module.title}</span>
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
                  'px-2 py-0.5 text-xs font-medium rounded-full',
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
