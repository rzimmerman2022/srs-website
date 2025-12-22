import { AdminQuestionnaire } from '@/app/admin/questionnaires/page';
import StatusBadge from './StatusBadge';
import { formatDistanceToNow } from 'date-fns';

interface QuestionnaireCardProps {
  questionnaire: AdminQuestionnaire;
  onDelete: (id: string) => void;
  onViewResponses: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function QuestionnaireCard({
  questionnaire,
  onDelete,
  onViewResponses,
  onEdit,
}: QuestionnaireCardProps) {
  const {
    id,
    title,
    clientName,
    status,
    questionsCount,
    responsesCount,
    completionPercentage,
    lastActivity,
    packageType,
  } = questionnaire;

  // Format last activity timestamp
  const lastActivityText = formatDistanceToNow(new Date(lastActivity), { addSuffix: true });

  return (
    <div className="card group relative">
      {/* Status Badge */}
      <div className="flex items-start justify-between mb-4">
        <StatusBadge status={status} />

        {/* Actions Menu Dropdown */}
        <div className="relative">
          <button
            className="p-2 rounded-lg text-charcoal-400 hover:text-navy hover:bg-sand-100 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="More actions"
            onClick={(e) => {
              e.currentTarget.nextElementSibling?.classList.toggle('hidden');
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <div className="hidden absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
            <button
              onClick={() => onViewResponses(id)}
              className="w-full text-left px-4 py-2 text-sm text-charcoal-700 hover:bg-sand-100 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Responses
            </button>
            <button
              onClick={() => onEdit(id)}
              className="w-full text-left px-4 py-2 text-sm text-charcoal-700 hover:bg-sand-100 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <div className="border-t border-gray-200 my-1" />
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete "${title}"?`)) {
                  onDelete(id);
                }
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Title and Client */}
      <div className="mb-4">
        <h3 className="font-serif font-semibold text-lg text-navy mb-1 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-charcoal-600 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {clientName}
        </p>
        {packageType && (
          <p className="text-xs text-charcoal-500 mt-1">
            {packageType}
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-charcoal-700">
            {completionPercentage}% Complete
          </span>
          <span className="text-xs text-charcoal-500">
            {responsesCount} / {questionsCount} answered
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold to-gold-600 transition-all duration-500 rounded-full"
            style={{ width: `${completionPercentage}%` }}
            role="progressbar"
            aria-valuenow={completionPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${completionPercentage}% complete`}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
        <div>
          <p className="text-xs text-charcoal-500 mb-1">Questions</p>
          <p className="text-lg font-semibold text-navy">{questionsCount}</p>
        </div>
        <div>
          <p className="text-xs text-charcoal-500 mb-1">Responses</p>
          <p className="text-lg font-semibold text-navy">{responsesCount}</p>
        </div>
      </div>

      {/* Last Activity */}
      <div className="flex items-center justify-between text-xs text-charcoal-500">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Last activity
        </span>
        <span className="font-medium">{lastActivityText}</span>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onViewResponses(id)}
          className="flex-1 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-600 transition-all font-medium text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          View Responses
        </button>
        <button
          onClick={() => onEdit(id)}
          className="px-4 py-2 border-2 border-navy text-navy rounded-lg hover:bg-navy hover:text-white transition-all font-medium text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
