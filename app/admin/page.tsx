'use client';

import Link from 'next/link';
import * as React from 'react';
import { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Admin pages must NEVER be indexed by search engines
// These are private admin interfaces accessible only to:
// - Admin team
// - Business owner
// Note: metadata export removed as this is now a client component

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
  description?: string;
}

function StatCard({ title, value, change, icon: Icon, description }: StatCardProps) {
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-bold text-navy">{value}</p>
              {change && (
                <span
                  className={`text-sm font-medium ${
                    change.trend === 'up'
                      ? 'text-green-600'
                      : change.trend === 'down'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  {change.trend === 'up' ? '↑' : change.trend === 'down' ? '↓' : '→'} {Math.abs(change.value)}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <div className="ml-4">
            <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-gold" aria-hidden="true" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityItemProps {
  title: string;
  description: string;
  timestamp: string;
  type: 'questionnaire' | 'client' | 'system';
}

function ActivityItem({ title, description, timestamp, type }: ActivityItemProps) {
  const iconMap = {
    questionnaire: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    client: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    system: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const bgColorMap = {
    questionnaire: 'bg-blue-100 text-blue-600',
    client: 'bg-green-100 text-green-600',
    system: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="flex items-start space-x-4 py-4 border-b border-gray-100 last:border-b-0">
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${bgColorMap[type]}`}>
        {iconMap[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-navy">{title}</p>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <p className="text-xs text-gray-500 mt-1">{timestamp}</p>
      </div>
    </div>
  );
}

interface DashboardStats {
  overview: {
    total_questionnaires: number;
    total_clients: number;
    completed_questionnaires: number;
    in_progress_questionnaires: number;
    completion_rate: number;
    average_progress: number;
  };
  recent_activity: Array<{
    client_id: string;
    questionnaire_id: string;
    action: string;
    timestamp: string;
  }>;
  trends: {
    questionnaires_last_24h: number;
    questionnaires_last_7d: number;
    questionnaires_last_30d: number;
    completions_last_24h: number;
    completions_last_7d: number;
    completions_last_30d: number;
  };
  top_performers: Array<{
    client_id: string;
    total_points: number;
    completed_count: number;
  }>;
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/stats');

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy mb-2">
            Dashboard Overview
          </h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-navy mb-2">Failed to Load Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchDashboardStats} variant="primary" size="md">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // No data state
  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Questionnaires',
      value: stats.overview.total_questionnaires,
      change: stats.trends.questionnaires_last_7d > 0 ? {
        value: Math.round((stats.trends.questionnaires_last_7d / Math.max(stats.overview.total_questionnaires, 1)) * 100),
        trend: 'up' as const
      } : undefined,
      description: 'All time',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Completion Rate',
      value: `${stats.overview.completion_rate}%`,
      change: stats.trends.completions_last_7d > 0 ? {
        value: Math.round((stats.trends.completions_last_7d / Math.max(stats.overview.completed_questionnaires, 1)) * 100),
        trend: 'up' as const
      } : undefined,
      description: 'Overall',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'In Progress',
      value: stats.overview.in_progress_questionnaires,
      description: 'Active sessions',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Total Clients',
      value: stats.overview.total_clients,
      description: 'Unique clients',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  const recentActivity: ActivityItemProps[] = stats.recent_activity.slice(0, 4).map(activity => ({
    title: `Questionnaire ${activity.action.toLowerCase()}`,
    description: `${activity.client_id} - ${activity.questionnaire_id}`,
    timestamp: formatTimeAgo(activity.timestamp),
    type: 'questionnaire' as const,
  }));

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy mb-2">
          Dashboard Overview
        </h2>
        <p className="text-gray-600">
          Welcome back! Here&apos;s what&apos;s happening with your questionnaires.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle as="h3" className="text-xl">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="divide-y divide-gray-100">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <ActivityItem key={index} {...activity} />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No recent activity</p>
                )}
              </div>
              <div className="mt-6">
                <Link
                  href="/admin/activity"
                  className="text-sm font-medium text-gold hover:text-gold-600 transition-colors"
                >
                  View all activity →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle as="h3" className="text-xl">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-3">
                <Button
                  href="/admin/questionnaires"
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View All Questionnaires
                </Button>
                <Button
                  href="/admin/clients"
                  variant="outline"
                  size="md"
                  className="w-full justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  View All Clients
                </Button>
                <Button
                  href="/admin/questionnaires/new"
                  variant="secondary"
                  size="md"
                  className="w-full justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Create Questionnaire
                </Button>
              </div>

              {/* Helpful links */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Helpful Links</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/admin/settings"
                      className="text-sm text-gray-600 hover:text-navy transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/reports"
                      className="text-sm text-gray-600 hover:text-navy transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Reports
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/help"
                      className="text-sm text-gray-600 hover:text-navy transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Help & Documentation
                    </Link>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
