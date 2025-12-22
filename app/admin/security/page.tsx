'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { formatRelativeTime, formatDate } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================
interface SecurityEvent {
  id: string;
  event_type: string;
  action: string;
  success: boolean;
  error_message?: string;
  user_id?: string;
  user_type: string;
  ip_address: string;
  user_agent?: string;
  resource_type?: string;
  resource_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

interface EventTypeCount {
  event_type: string;
  count: number;
}

// ============================================================================
// Supabase Client
// ============================================================================
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
};

// ============================================================================
// Main Component
// ============================================================================
export default function SecurityDashboardPage() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('24h');
  const [successFilter, setSuccessFilter] = useState<string>('all');

  // Stats
  const [totalEvents, setTotalEvents] = useState(0);
  const [failedEvents, setFailedEvents] = useState(0);
  const [eventTypeCounts, setEventTypeCounts] = useState<EventTypeCount[]>([]);

  // Fetch security events
  useEffect(() => {
    const fetchSecurityEvents = async () => {
      setLoading(true);
      setError(null);

      const supabase = getSupabaseClient();
      if (!supabase) {
        setError('Supabase not configured');
        setLoading(false);
        return;
      }

      try {
        // Calculate time threshold based on filter
        const timeThreshold = new Date();
        switch (timeFilter) {
          case '1h':
            timeThreshold.setHours(timeThreshold.getHours() - 1);
            break;
          case '24h':
            timeThreshold.setHours(timeThreshold.getHours() - 24);
            break;
          case '7d':
            timeThreshold.setDate(timeThreshold.getDate() - 7);
            break;
          case '30d':
            timeThreshold.setDate(timeThreshold.getDate() - 30);
            break;
          default:
            timeThreshold.setHours(timeThreshold.getHours() - 24);
        }

        // Fetch events
        const query = supabase
          .from('security_audit_log')
          .select('*')
          .gte('created_at', timeThreshold.toISOString())
          .order('created_at', { ascending: false })
          .limit(500);

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        setEvents(data || []);
        setTotalEvents(data?.length || 0);
        setFailedEvents(data?.filter(e => !e.success).length || 0);

        // Calculate event type counts
        const counts = new Map<string, number>();
        data?.forEach(event => {
          counts.set(event.event_type, (counts.get(event.event_type) || 0) + 1);
        });
        const countArray = Array.from(counts.entries())
          .map(([event_type, count]) => ({ event_type, count }))
          .sort((a, b) => b.count - a.count);
        setEventTypeCounts(countArray);

      } catch (err) {
        console.error('Failed to fetch security events:', err);
        setError('Failed to load security events');
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityEvents();
  }, [timeFilter]);

  // Apply filters
  useEffect(() => {
    let filtered = [...events];

    // Filter by event type
    if (eventTypeFilter !== 'all') {
      filtered = filtered.filter(e => e.event_type === eventTypeFilter);
    }

    // Filter by success
    if (successFilter === 'failed') {
      filtered = filtered.filter(e => !e.success);
    } else if (successFilter === 'success') {
      filtered = filtered.filter(e => e.success);
    }

    setFilteredEvents(filtered);
  }, [events, eventTypeFilter, successFilter]);

  // ============================================================================
  // Render
  // ============================================================================
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-serif font-semibold text-navy">
          Security Audit Log
        </h1>
        <p className="mt-2 text-gray-600">
          Monitor security events, failed login attempts, and unauthorized access
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Total Events
          </div>
          <div className="mt-2 text-3xl font-semibold text-navy">
            {loading ? '...' : totalEvents.toLocaleString()}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            Last {timeFilter === '1h' ? 'hour' : timeFilter === '24h' ? '24 hours' : timeFilter === '7d' ? '7 days' : '30 days'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Failed Events
          </div>
          <div className="mt-2 text-3xl font-semibold text-red-600">
            {loading ? '...' : failedEvents.toLocaleString()}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            Security incidents
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Success Rate
          </div>
          <div className="mt-2 text-3xl font-semibold text-green-600">
            {loading ? '...' : totalEvents > 0 ? `${Math.round(((totalEvents - failedEvents) / totalEvents) * 100)}%` : '100%'}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            Successful operations
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-navy mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Time Filter */}
          <div>
            <label htmlFor="time-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Time Range
            </label>
            <select
              id="time-filter"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {/* Event Type Filter */}
          <div>
            <label htmlFor="event-type-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Event Type
            </label>
            <select
              id="event-type-filter"
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            >
              <option value="all">All Events</option>
              <option value="login_success">Login Success</option>
              <option value="login_failure">Login Failure</option>
              <option value="logout">Logout</option>
              <option value="access_denied">Access Denied</option>
              <option value="csrf_violation">CSRF Violation</option>
              <option value="rate_limit_exceeded">Rate Limit Exceeded</option>
              <option value="token_invalid">Invalid Token</option>
              <option value="token_expired">Expired Token</option>
              <option value="data_view">Data View</option>
              <option value="data_export">Data Export</option>
              <option value="data_delete">Data Delete</option>
            </select>
          </div>

          {/* Success Filter */}
          <div>
            <label htmlFor="success-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="success-filter"
              value={successFilter}
              onChange={(e) => setSuccessFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="success">Success Only</option>
              <option value="failed">Failed Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Event Type Distribution */}
      {eventTypeCounts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4">Event Distribution</h2>
          <div className="space-y-3">
            {eventTypeCounts.slice(0, 10).map(({ event_type, count }) => (
              <div key={event_type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-sm font-medium text-gray-700 min-w-[200px]">
                    {event_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gold h-2 rounded-full"
                      style={{ width: `${(count / totalEvents) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-600 ml-4">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-navy">
            Recent Security Events ({filteredEvents.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading security events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No security events found for the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sand-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Event Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className={!event.success ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{formatRelativeTime(event.created_at)}</div>
                      <div className="text-xs text-gray-500">{formatDate(event.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {event.event_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {event.success ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>{event.user_type}</div>
                      {event.user_id && (
                        <div className="text-xs text-gray-500 truncate max-w-[150px]">
                          {event.user_id}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                      {event.ip_address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {event.resource_type && (
                        <div>
                          <div>{event.resource_type}</div>
                          {event.resource_id && (
                            <div className="text-xs text-gray-500 truncate max-w-[150px]">
                              {event.resource_id}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {event.error_message && (
                        <div className="text-red-600 text-xs max-w-[200px] truncate" title={event.error_message}>
                          {event.error_message}
                        </div>
                      )}
                      {event.metadata && Object.keys(event.metadata).length > 0 && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-gold hover:text-gold-600">
                            View metadata
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                            {JSON.stringify(event.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
