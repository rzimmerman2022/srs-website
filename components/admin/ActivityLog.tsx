import { formatRelativeTime } from '@/lib/utils';

export interface ActivityEvent {
  id: string;
  type: 'questionnaire_started' | 'questionnaire_updated' | 'questionnaire_completed' | 'milestone_achieved';
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    questionnaireId?: string;
    questionnaireName?: string;
    progress?: number;
    points?: number;
  };
}

interface ActivityLogProps {
  activities: ActivityEvent[];
  maxItems?: number;
  className?: string;
}

const activityIcons: Record<ActivityEvent['type'], string> = {
  questionnaire_started: '🚀',
  questionnaire_updated: '✏️',
  questionnaire_completed: '🎉',
  milestone_achieved: '🏆',
};

const activityColors: Record<ActivityEvent['type'], string> = {
  questionnaire_started: 'border-blue-500 bg-blue-50',
  questionnaire_updated: 'border-gold bg-gold/10',
  questionnaire_completed: 'border-green-500 bg-green-50',
  milestone_achieved: 'border-purple-500 bg-purple-50',
};

export default function ActivityLog({
  activities,
  maxItems,
  className = '',
}: ActivityLogProps) {
  const displayedActivities = maxItems ? activities.slice(0, maxItems) : activities;

  if (activities.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4" aria-hidden="true">📋</div>
        <p className="text-charcoal-500">No activity yet</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`} role="list" aria-label="Activity timeline">
      {displayedActivities.map((activity, index) => (
        <div
          key={activity.id}
          className="relative"
          role="listitem"
        >
          {/* Timeline connector line */}
          {index < displayedActivities.length - 1 && (
            <div
              className="absolute left-6 top-14 bottom-0 w-0.5 bg-gradient-to-b from-gold/30 to-transparent"
              aria-hidden="true"
            />
          )}

          {/* Activity item */}
          <div className="flex gap-4">
            {/* Icon */}
            <div
              className={`
                flex-shrink-0 w-12 h-12 rounded-full
                border-2 ${activityColors[activity.type]}
                flex items-center justify-center
                shadow-sm z-10
              `}
              aria-hidden="true"
            >
              <span className="text-xl">
                {activityIcons[activity.type]}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-navy text-base mb-1">
                    {activity.title}
                  </h4>
                  <p className="text-sm text-charcoal-600 mb-2">
                    {activity.description}
                  </p>

                  {/* Metadata */}
                  {activity.metadata && (
                    <div className="flex flex-wrap gap-3 text-xs text-charcoal-500">
                      {activity.metadata.questionnaireName && (
                        <span className="inline-flex items-center gap-1">
                          <span className="font-medium">Questionnaire:</span>
                          <span>{activity.metadata.questionnaireName}</span>
                        </span>
                      )}
                      {activity.metadata.progress !== undefined && (
                        <span className="inline-flex items-center gap-1">
                          <span className="font-medium">Progress:</span>
                          <span>{activity.metadata.progress}%</span>
                        </span>
                      )}
                      {activity.metadata.points !== undefined && (
                        <span className="inline-flex items-center gap-1">
                          <span className="font-medium">Points:</span>
                          <span className="text-gold font-semibold">
                            {activity.metadata.points}
                          </span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <time
                  dateTime={activity.timestamp}
                  className="text-xs text-charcoal-400 whitespace-nowrap flex-shrink-0"
                >
                  {formatRelativeTime(activity.timestamp)}
                </time>
              </div>
            </div>
          </div>
        </div>
      ))}

      {maxItems && activities.length > maxItems && (
        <div className="text-center pt-4">
          <p className="text-sm text-charcoal-500">
            Showing {maxItems} of {activities.length} activities
          </p>
        </div>
      )}
    </div>
  );
}
