/**
 * All Responses List Page
 * Shows all responses for a questionnaire with filtering and export
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { jackieDeleonQuestionnaire } from '@/lib/questionnaire/jackie-deleon';
import type { QuestionnaireResponse } from '@/lib/supabase/types';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

type FilterStatus = 'all' | 'completed' | 'in-progress';

export default function ResponsesPage() {
  const params = useParams();
  const questionnaireId = params?.id as string;

  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<QuestionnaireResponse[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const questionnaire = jackieDeleonQuestionnaire;
  const totalQuestions = questionnaire.modules.reduce(
    (total, module) => total + module.questions.length,
    0
  );

  useEffect(() => {
    async function fetchResponses() {
      try {
        if (!supabase) {
          throw new Error('Supabase not configured');
        }
        const { data, error: fetchError } = await supabase
          .from('questionnaire_responses')
          .select('*')
          .eq('questionnaire_id', questionnaireId)
          .order('updated_at', { ascending: false });

        if (fetchError) throw fetchError;
        setResponses(data || []);
        setFilteredResponses(data || []);
      } catch (err) {
        console.error('Error fetching responses:', err);
        setError('Failed to load responses');
      } finally {
        setLoading(false);
      }
    }

    fetchResponses();
  }, [questionnaireId]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredResponses(responses);
    } else if (filter === 'completed') {
      setFilteredResponses(responses.filter((r) => r.completed));
    } else if (filter === 'in-progress') {
      setFilteredResponses(responses.filter((r) => !r.completed));
    }
  }, [filter, responses]);

  function calculateCompletion(response: QuestionnaireResponse): number {
    const answeredQuestions = Object.keys((response.answers as object) || {}).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  }

  function exportToCSV() {
    // CSV Header
    const headers = [
      'Response ID',
      'Client ID',
      'Status',
      'Completion %',
      'Questions Answered',
      'Points',
      'Created',
      'Last Updated',
    ];

    // CSV Rows
    const rows = filteredResponses.map((response) => {
      const completion = calculateCompletion(response);
      const answeredCount = Object.keys((response.answers as object) || {}).length;
      return [
        response.id,
        response.client_id,
        response.completed ? 'Completed' : 'In Progress',
        `${completion}%`,
        `${answeredCount}/${totalQuestions}`,
        response.points,
        new Date(response.created_at).toLocaleDateString(),
        new Date(response.updated_at).toLocaleDateString(),
      ];
    });

    // Combine
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `questionnaire-responses-${questionnaireId}-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 py-12">
        <div className="container-custom max-w-6xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold mb-4"></div>
              <p className="text-gray-600">Loading responses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-sand-50 py-12">
        <div className="container-custom max-w-6xl">
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-lg text-charcoal">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50 py-12">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/admin/questionnaires/${questionnaireId}`}
            className="text-gold hover:text-gold-600 flex items-center gap-2 mb-4 text-sm font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Questionnaire Overview
          </Link>
          <h1 className="text-4xl font-serif font-semibold text-navy mb-2">
            All Responses
          </h1>
          <p className="text-lg text-gray-600">
            {questionnaire.title} • {responses.length} total responses
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* Filter Tabs */}
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-navy text-white'
                  : 'text-gray-700 hover:text-navy hover:bg-sand-50'
              }`}
            >
              All ({responses.length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === 'completed'
                  ? 'bg-navy text-white'
                  : 'text-gray-700 hover:text-navy hover:bg-sand-50'
              }`}
            >
              Completed ({responses.filter((r) => r.completed).length})
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === 'in-progress'
                  ? 'bg-navy text-white'
                  : 'text-gray-700 hover:text-navy hover:bg-sand-50'
              }`}
            >
              In Progress ({responses.filter((r) => !r.completed).length})
            </button>
          </div>

          {/* Export Button */}
          <Button
            onClick={exportToCSV}
            variant="outline"
            disabled={filteredResponses.length === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Export to CSV
          </Button>
        </div>

        {/* Responses List */}
        {filteredResponses.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-lg text-gray-600">No responses found</p>
                <p className="text-sm text-gray-500 mt-2">
                  {filter !== 'all'
                    ? 'Try changing the filter to see more responses'
                    : 'Responses will appear here once clients start the questionnaire'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredResponses.map((response) => {
              const completion = calculateCompletion(response);
              const answeredCount = Object.keys((response.answers as object) || {}).length;

              return (
                <Link
                  key={response.id}
                  href={`/admin/questionnaires/${questionnaireId}/responses/${response.id}`}
                >
                  <Card className="hover:border-gold transition-colors">
                    <CardContent>
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Left: Status and Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                response.completed
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {response.completed ? 'Completed' : 'In Progress'}
                            </div>
                            <span className="text-sm text-gray-500 font-mono">
                              {response.id.slice(0, 8)}...
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                            <div>
                              <div className="text-xs text-gray-600 mb-1">Client ID</div>
                              <div className="text-sm font-medium text-charcoal">
                                {response.client_id}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600 mb-1">Created</div>
                              <div className="text-sm text-charcoal">
                                {new Date(response.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600 mb-1">Last Updated</div>
                              <div className="text-sm text-charcoal">
                                {new Date(response.updated_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Progress and Stats */}
                        <div className="lg:text-right space-y-3">
                          {/* Progress Bar */}
                          <div>
                            <div className="flex items-center justify-between lg:justify-end gap-2 mb-1">
                              <span className="text-xs text-gray-600">Progress</span>
                              <span className="text-sm font-semibold text-navy">
                                {completion}%
                              </span>
                            </div>
                            <div className="w-full lg:w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gold transition-all duration-300"
                                style={{ width: `${completion}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {answeredCount} of {totalQuestions} questions
                            </div>
                          </div>

                          {/* Gamification Stats */}
                          <div className="flex items-center justify-end gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gold"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="font-medium text-charcoal">
                                {response.points}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-amber-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="font-medium text-charcoal">
                                {response.streak}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
