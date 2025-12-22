import { QuestionnaireStatus } from '@/app/admin/questionnaires/page';

interface StatusBadgeProps {
  status: QuestionnaireStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const statusConfig = {
    draft: {
      label: 'Draft',
      className: 'bg-gray-100 text-gray-700 border-gray-300',
      icon: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      ),
    },
    active: {
      label: 'Active',
      className: 'bg-green-100 text-green-700 border-green-300',
      icon: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    completed: {
      label: 'Completed',
      className: 'bg-blue-100 text-blue-700 border-blue-300',
      icon: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    archived: {
      label: 'Archived',
      className: 'bg-charcoal-100 text-charcoal-600 border-charcoal-300',
      icon: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
          <path
            fillRule="evenodd"
            d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  };

  const config = statusConfig[status];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${config.className} ${sizeClasses}`}
      aria-label={`Status: ${config.label}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
