/**
 * Single Response Detail Page
 * Shows complete timeline view of a single questionnaire response
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { jackieDeleonQuestionnaire } from '@/lib/questionnaire/jackie-deleon';
import { eliteDiscoveryQuestionnaire } from '@/lib/questionnaire/elite-discovery';
import type { Questionnaire } from '@/lib/questionnaire/types';
import type { QuestionnaireResponse } from '@/lib/supabase/types';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ResponseTimeline from '@/components/admin/ResponseTimeline';

// Questionnaire registry
const QUESTIONNAIRES: Record<string, Questionnaire> = {
  'elite-discovery': eliteDiscoveryQuestionnaire,
  'jdeleon': jackieDeleonQuestionnaire,
  'jackie-deleon-dec-2025': jackieDeleonQuestionnaire,
};

export default function ResponseDetailPage() {
  const params = useParams();
  const questionnaireId = params?.id as string;
  const responseId = params?.responseId as string;

  const [response, setResponse] = useState<QuestionnaireResponse | null>(null);
  const [allResponses, setAllResponses] = useState<QuestionnaireResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const questionnaire = QUESTIONNAIRES[questionnaireId] || eliteDiscoveryQuestionnaire;

  useEffect(() => {
    async function fetchResponse() {
      try {
        if (!supabase) {
          throw new Error('Supabase not configured');
        }

        // Fetch this response
        const { data: responseData, error: responseError } = await supabase
          .from('questionnaire_responses')
          .select('*')
          .eq('id', responseId)
          .single();

        if (responseError) throw responseError;
        setResponse(responseData);

        // Fetch all responses for navigation
        const { data: allData, error: allError } = await supabase
          .from('questionnaire_responses')
          .select('id, client_id, completed, updated_at')
          .eq('questionnaire_id', questionnaireId)
          .order('updated_at', { ascending: false });

        if (allError) throw allError;
        setAllResponses(allData || []);
      } catch (err) {
        console.error('Error fetching response:', err);
        setError('Failed to load response');
      } finally {
        setLoading(false);
      }
    }

    fetchResponse();
  }, [questionnaireId, responseId]);

  function handlePrint() {
    window.print();
  }

  function calculateCompletion(): number {
    if (!response) return 0;
    const totalQuestions = questionnaire.modules.reduce(
      (total, module) => total + module.questions.length,
      0
    );
    const answeredQuestions = Object.keys((response.answers as object) || {}).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  }

  function calculateTimeSpent(): string {
    if (!response) return '0 minutes';
    const created = new Date(response.created_at).getTime();
    const updated = new Date(response.updated_at).getTime();
    const diffMs = updated - created;
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins} minutes`;
    }
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  }

  function getNavigationLinks() {
    const currentIndex = allResponses.findIndex((r) => r.id === responseId);
    const prevResponse = currentIndex > 0 ? allResponses[currentIndex - 1] : null;
    const nextResponse =
      currentIndex < allResponses.length - 1 ? allResponses[currentIndex + 1] : null;

    return { prevResponse, nextResponse, currentIndex, total: allResponses.length };
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 py-12">
        <div className="container-custom max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold mb-4"></div>
              <p className="text-gray-600">Loading response...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !response) {
    return (
      <div className="min-h-screen bg-sand-50 py-12">
        <div className="container-custom max-w-4xl">
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
                <p className="text-lg text-charcoal">
                  {error || 'Response not found'}
                </p>
                <div className="mt-6">
                  <Button
                    href={`/admin/questionnaires/${questionnaireId}/responses`}
                    variant="primary"
                  >
                    Back to Responses
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const completion = calculateCompletion();
  const timeSpent = calculateTimeSpent();
  const totalQuestions = questionnaire.modules.reduce(
    (total, module) => total + module.questions.length,
    0
  );
  const answeredQuestions = Object.keys((response.answers as object) || {}).length;
  const nav = getNavigationLinks();

  return (
    <div className="min-h-screen bg-sand-50 py-12 print:bg-white print:py-0">
      <div className="container-custom max-w-4xl">
        {/* Header - Hidden when printing */}
        <div className="mb-8 print:hidden">
          <Link
            href={`/admin/questionnaires/${questionnaireId}/responses`}
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
            Back to All Responses
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-serif font-semibold text-navy mb-2">
                Response Details
              </h1>
              <p className="text-lg text-gray-600">
                {questionnaire.clientName} • {questionnaire.title}
              </p>
            </div>
            <Button onClick={handlePrint} variant="outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                  clipRule="evenodd"
                />
              </svg>
              Print
            </Button>
          </div>
        </div>

        {/* Print-only header */}
        <div className="hidden print:block mb-8">
          <div className="border-b-2 border-navy pb-4 mb-4">
            <h1 className="text-3xl font-serif font-semibold text-navy mb-2">
              {questionnaire.title}
            </h1>
            <p className="text-lg text-gray-700">
              Client: {questionnaire.clientName} • Response ID: {response.id.slice(0, 16)}...
            </p>
          </div>
        </div>

        {/* Metadata Card */}
        <Card className="mb-8 print:shadow-none print:border print:border-gray-300">
          <CardHeader>
            <CardTitle as="h2">Response Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-600">Response ID</div>
                <div className="mt-1 text-sm text-charcoal font-mono break-all">
                  {response.id}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Client ID</div>
                <div className="mt-1 text-sm text-charcoal">{response.client_id}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Status</div>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      response.completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {response.completed ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Completion</div>
                <div className="mt-1 text-sm text-charcoal">
                  {completion}% ({answeredQuestions} of {totalQuestions} questions)
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Created</div>
                <div className="mt-1 text-sm text-charcoal">
                  {new Date(response.created_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Last Updated</div>
                <div className="mt-1 text-sm text-charcoal">
                  {new Date(response.updated_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Time Spent</div>
                <div className="mt-1 text-sm text-charcoal">{timeSpent}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Points Earned</div>
                <div className="mt-1 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gold"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold text-charcoal">
                    {response.points}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation - Hidden when printing */}
        {nav.total > 1 && (
          <div className="flex items-center justify-between mb-8 print:hidden">
            <div>
              {nav.prevResponse ? (
                <Link
                  href={`/admin/questionnaires/${questionnaireId}/responses/${nav.prevResponse.id}`}
                >
                  <Button variant="outline" size="sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Previous Response
                  </Button>
                </Link>
              ) : (
                <div />
              )}
            </div>

            <div className="text-sm text-gray-600">
              Response {nav.currentIndex + 1} of {nav.total}
            </div>

            <div>
              {nav.nextResponse ? (
                <Link
                  href={`/admin/questionnaires/${questionnaireId}/responses/${nav.nextResponse.id}`}
                >
                  <Button variant="outline" size="sm">
                    Next Response
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        )}

        {/* Response Timeline */}
        <Card className="print:shadow-none print:border print:border-gray-300">
          <CardHeader className="print:pb-4">
            <CardTitle as="h2">Questionnaire Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponseTimeline questionnaire={questionnaire} response={response} />
          </CardContent>
        </Card>

        {/* Print footer */}
        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-sm text-gray-600">
          <p>
            Generated: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </p>
          <p className="mt-1">
            Strategic Resume Specialists • Questionnaire Response Report
          </p>
        </div>
      </div>
    </div>
  );
}
