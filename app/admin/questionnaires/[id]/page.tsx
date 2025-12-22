/**
 * Single Questionnaire Overview Page
 * Shows questionnaire metadata, stats, and structure preview
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import type { QuestionnaireResponse } from '@/lib/supabase/types';
import { jackieDeleonQuestionnaire } from '@/lib/questionnaire/jackie-deleon';
import type { Questionnaire } from '@/lib/questionnaire/types';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getQuestionnaireData(id: string) {
  // For now, we only support the Jackie DeLeon questionnaire
  // In production, this would fetch from a database
  const questionnaire: Questionnaire = jackieDeleonQuestionnaire;

  if (questionnaire.id !== id) {
    return null;
  }

  // Get responses from Supabase
  const { data: responses, error } = supabase
    ? await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('questionnaire_id', id)
        .order('created_at', { ascending: false })
    : { data: null, error: null };

  if (error) {
    console.error('Error fetching responses:', error);
  }

  // Calculate stats
  const validResponses: QuestionnaireResponse[] = responses || [];
  const totalResponses = validResponses.length;
  const completedResponses = validResponses.filter((r) => r.completed).length;
  const inProgressResponses = totalResponses - completedResponses;
  const avgCompletion =
    totalResponses > 0
      ? validResponses.reduce((sum, r) => {
          const totalQuestions = questionnaire.modules.reduce(
            (total, module) => total + module.questions.length,
            0
          );
          const answeredQuestions = Object.keys(r.answers as object).length;
          return sum + (answeredQuestions / totalQuestions) * 100;
        }, 0) / totalResponses
      : 0;

  // Calculate total questions
  const totalQuestions = questionnaire.modules.reduce(
    (total, module) => total + module.questions.length,
    0
  );

  const requiredModules = questionnaire.modules.filter((m) => m.required).length;
  const optionalModules = questionnaire.modules.length - requiredModules;

  return {
    questionnaire,
    responses: responses || [],
    stats: {
      totalResponses,
      completedResponses,
      inProgressResponses,
      avgCompletion,
      totalQuestions,
      requiredModules,
      optionalModules,
    },
  };
}

export default async function QuestionnairePage({ params }: PageProps) {
  const { id } = await params;
  const data = await getQuestionnaireData(id);

  if (!data) {
    notFound();
  }

  const { questionnaire, stats } = data;

  return (
    <div className="min-h-screen bg-sand-50 py-12">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/questionnaires"
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
            Back to All Questionnaires
          </Link>
          <h1 className="text-4xl font-serif font-semibold text-navy mb-2">
            {questionnaire.title}
          </h1>
          <p className="text-lg text-gray-600">
            {questionnaire.clientName} • {questionnaire.packageType}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card hover={false}>
            <CardContent>
              <div className="text-sm text-gray-600 mb-1">Total Responses</div>
              <div className="text-3xl font-bold text-navy">{stats.totalResponses}</div>
            </CardContent>
          </Card>

          <Card hover={false}>
            <CardContent>
              <div className="text-sm text-gray-600 mb-1">Completed</div>
              <div className="text-3xl font-bold text-green-600">
                {stats.completedResponses}
              </div>
            </CardContent>
          </Card>

          <Card hover={false}>
            <CardContent>
              <div className="text-sm text-gray-600 mb-1">In Progress</div>
              <div className="text-3xl font-bold text-amber-600">
                {stats.inProgressResponses}
              </div>
            </CardContent>
          </Card>

          <Card hover={false}>
            <CardContent>
              <div className="text-sm text-gray-600 mb-1">Avg. Completion</div>
              <div className="text-3xl font-bold text-navy">
                {stats.avgCompletion.toFixed(0)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metadata Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle as="h2">Questionnaire Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-600">Questionnaire ID</dt>
                <dd className="mt-1 text-sm text-charcoal font-mono">{questionnaire.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600">Client ID</dt>
                <dd className="mt-1 text-sm text-charcoal font-mono">
                  {questionnaire.clientId}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600">Created Date</dt>
                <dd className="mt-1 text-sm text-charcoal">
                  {new Date(questionnaire.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600">Total Questions</dt>
                <dd className="mt-1 text-sm text-charcoal">{stats.totalQuestions}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600">Required Modules</dt>
                <dd className="mt-1 text-sm text-charcoal">{stats.requiredModules}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600">Optional Modules</dt>
                <dd className="mt-1 text-sm text-charcoal">{stats.optionalModules}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button href={`/admin/questionnaires/${id}/responses`} variant="primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
            View All Responses ({stats.totalResponses})
          </Button>

          <Button href={`/discovery/${questionnaire.clientId}`} variant="outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            Preview Questionnaire
          </Button>
        </div>

        {/* Questionnaire Structure */}
        <Card>
          <CardHeader>
            <CardTitle as="h2">Questionnaire Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {questionnaire.modules.map((module, idx) => (
                <div
                  key={module.id}
                  className="border-l-4 border-gold pl-6 pb-6 last:pb-0"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {module.icon && (
                          <span className="text-2xl" role="img" aria-hidden="true">
                            {module.icon}
                          </span>
                        )}
                        <h3 className="text-xl font-serif font-semibold text-navy">
                          Module {idx + 1}: {module.title}
                        </h3>
                        {module.required && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
                            REQUIRED
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{module.subtitle}</p>
                      {module.description && (
                        <p className="text-sm text-gray-700 mb-2">{module.description}</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm text-gray-600">
                        {module.questions.length} questions
                      </div>
                      <div className="text-sm text-gray-600">
                        ~{module.estimatedMinutes} min
                      </div>
                    </div>
                  </div>

                  {/* Question List */}
                  <div className="mt-4 space-y-2">
                    {module.questions.map((question) => (
                      <div
                        key={question.id}
                        className="flex items-start gap-3 p-3 bg-sand-50 rounded-lg"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {question.critical && (
                            <span
                              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs"
                              title="Critical Question"
                            >
                              !
                            </span>
                          )}
                          {!question.critical && question.required && (
                            <span
                              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white text-xs"
                              title="Required Question"
                            >
                              *
                            </span>
                          )}
                          {!question.required && (
                            <span
                              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-300 text-gray-600 text-xs"
                              title="Optional Question"
                            >
                              -
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-charcoal mb-1">
                            {question.question}
                          </div>
                          {question.subtitle && (
                            <div className="text-xs text-gray-600 mb-1">
                              {question.subtitle}
                            </div>
                          )}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-navy-100 text-navy">
                              {question.type}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                              {question.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
