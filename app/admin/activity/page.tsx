import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Server-side data fetching
async function getActivityData() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { activities: [], error: 'Supabase not configured' };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get recent questionnaire activity
  const { data: responses, error } = await supabase
    .from('questionnaire_responses')
    .select('id, client_id, questionnaire_id, updated_at, created_at, completed, points')
    .order('updated_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching activity:', error);
    return { activities: [], error: error.message };
  }

  // Transform into activity format
  const activities = (responses || []).map((r) => ({
    id: r.id,
    type: r.completed ? 'completed' : 'updated',
    clientId: r.client_id,
    description: r.completed
      ? `Completed questionnaire`
      : `Updated questionnaire`,
    timestamp: r.updated_at,
    metadata: {
      points: r.points,
      questionnaireId: r.questionnaire_id,
    },
  }));

  return { activities, error: null };
}

export default async function ActivityPage() {
  const { activities, error } = await getActivityData();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-navy">Activity Log</h1>
          <p className="text-gray-600 mt-1">Recent activity across all questionnaires</p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 text-sm font-medium text-navy hover:text-gold transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Activity list */}
      <div className="bg-white rounded-2xl shadow-premium border border-gray-100 overflow-hidden">
        {activities.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">No activity yet</h3>
            <p className="text-gray-500 mt-1">Activity will appear here as clients interact with questionnaires</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {activities.map((activity) => (
              <li key={activity.id} className="p-4 hover:bg-sand-50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Activity icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {activity.type === 'completed' ? (
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    )}
                  </div>

                  {/* Activity content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy">
                      {activity.clientId}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.description}
                      {activity.metadata.points > 0 && (
                        <span className="ml-2 text-gold font-medium">
                          +{activity.metadata.points} points
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
