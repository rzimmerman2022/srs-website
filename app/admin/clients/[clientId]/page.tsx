'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ActivityLog, { ActivityEvent } from '@/components/admin/ActivityLog';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { maskEmail, formatDate, formatRelativeTime } from '@/lib/utils';

interface AccessToken {
  id: string;
  token: string;
  questionnaire_id: string;
  link: string;
  isActive: boolean;
  isExpired: boolean;
  access_count: number;
  created_at: string;
  expires_at: string;
  accessed_at: string | null;
}

interface ClientProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  questionnaireCount: number;
  completedCount: number;
  totalPoints: number;
  averageProgress: number;
}

interface QuestionnaireData {
  id: string;
  name: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  points: number;
  lastUpdated: string;
  createdAt: string;
}

export default function ClientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;

  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireData[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Token/link generation state
  const [accessTokens, setAccessTokens] = useState<AccessToken[]>([]);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  useEffect(() => {
    loadClientData();
    loadAccessTokens();
  }, [clientId]);

  // Load existing access tokens for this client
  async function loadAccessTokens() {
    try {
      const response = await fetch(`/api/admin/clients/${clientId}/generate-link`);
      if (response.ok) {
        const data = await response.json();
        setAccessTokens(data.tokens || []);
      }
    } catch (err) {
      console.error('Error loading access tokens:', err);
    }
  }

  // Generate a new questionnaire link
  const generateQuestionnaireLink = useCallback(async (questionnaireId: string) => {
    setIsGeneratingLink(true);
    setLinkError(null);
    setGeneratedLink(null);
    setLinkCopied(false);

    try {
      const response = await fetch(`/api/admin/clients/${clientId}/generate-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionnaireId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate link');
      }

      const data = await response.json();
      setGeneratedLink(data.link);

      // Refresh tokens list
      loadAccessTokens();
    } catch (err) {
      console.error('Error generating link:', err);
      setLinkError(err instanceof Error ? err.message : 'Failed to generate link');
    } finally {
      setIsGeneratingLink(false);
    }
  }, [clientId]);

  // Copy link to clipboard
  const copyLinkToClipboard = useCallback(async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    }
  }, []);

  async function loadClientData() {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch data from API endpoint
      const response = await fetch(`/api/admin/clients/${clientId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Client not found');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else {
          throw new Error('Failed to load client data');
        }
      }

      const data = await response.json();
      const clientDetail = data.client;

      // Transform API response to profile format
      setProfile({
        id: clientDetail.client_id,
        name: clientDetail.client_id, // Use client_id as name until we have a clients table
        email: `${clientDetail.client_id}@example.com`, // Placeholder until we have real email
        createdAt: clientDetail.summary.first_activity,
        questionnaireCount: clientDetail.summary.total_questionnaires,
        completedCount: clientDetail.summary.completed_questionnaires,
        totalPoints: clientDetail.summary.total_points,
        averageProgress: clientDetail.questionnaires.length > 0
          ? Math.round(
              clientDetail.questionnaires.reduce((sum: number, q: any) => sum + q.progress_percentage, 0) /
              clientDetail.questionnaires.length
            )
          : 0,
      });

      // Transform questionnaires data
      const questionnaireData: QuestionnaireData[] = clientDetail.questionnaires.map((q: any) => ({
        id: q.id,
        name: q.questionnaire_id,
        status: q.completed ? 'completed' : 'in_progress',
        progress: q.progress_percentage,
        points: q.points,
        lastUpdated: q.updated_at,
        createdAt: q.created_at,
      }));
      setQuestionnaires(questionnaireData);

      // Transform activity history to ActivityEvent format
      const activityList: ActivityEvent[] = clientDetail.activity_history.map((event: any) => {
        let title = '';
        let description = '';
        let type: ActivityEvent['type'] = 'questionnaire_updated';

        switch (event.event_type) {
          case 'created':
            type = 'questionnaire_started';
            title = 'Questionnaire Started';
            description = `Started ${event.questionnaire_id}`;
            break;
          case 'updated':
            type = 'questionnaire_updated';
            title = 'Questionnaire Updated';
            description = `Progress on ${event.questionnaire_id}`;
            break;
          case 'completed':
            type = 'questionnaire_completed';
            title = 'Questionnaire Completed';
            description = `Completed ${event.questionnaire_id}`;
            break;
        }

        return {
          id: event.id,
          type,
          title,
          description,
          timestamp: event.timestamp,
          metadata: {
            questionnaireName: event.questionnaire_id,
          },
        };
      });
      setActivities(activityList);
    } catch (err) {
      console.error('Error loading client data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load client data');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4" aria-hidden="true" />
          <p className="text-charcoal-600">Loading client profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4" aria-hidden="true">⚠️</div>
        <h2 className="text-2xl font-semibold text-navy mb-2">Error Loading Profile</h2>
        <p className="text-charcoal-600 mb-6">{error || 'Client not found'}</p>
        <Button href="/admin/clients" variant="primary">
          Back to Clients
        </Button>
      </div>
    );
  }

  const statusColors = {
    not_started: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="sm"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-semibold text-navy">
              {profile.name}
            </h1>
            <p className="text-charcoal-600 mt-1" aria-label={`Email: ${profile.email}`}>
              {maskEmail(profile.email)}
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={loadClientData}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-navy to-navy-800 text-white border-0">
          <CardContent className="pt-6">
            <p className="text-sand-300 text-sm mb-2">Total Points</p>
            <p className="text-4xl font-bold text-gold">{profile.totalPoints}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-charcoal-500 text-sm mb-2">Questionnaires</p>
            <p className="text-4xl font-bold text-navy">{profile.questionnaireCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-charcoal-500 text-sm mb-2">Completed</p>
            <p className="text-4xl font-bold text-green-600">{profile.completedCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-charcoal-500 text-sm mb-2">Avg Progress</p>
            <p className="text-4xl font-bold text-navy">{profile.averageProgress}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Client Info */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-charcoal-500 mb-1">Client ID</dt>
              <dd className="text-base text-navy font-mono">{profile.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-charcoal-500 mb-1">Member Since</dt>
              <dd className="text-base text-navy">{formatDate(profile.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-charcoal-500 mb-1">Last Activity</dt>
              <dd className="text-base text-navy">
                {activities.length > 0 ? formatRelativeTime(activities[0].timestamp) : 'No activity'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-charcoal-500 mb-1">Status</dt>
              <dd>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  Active
                </span>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Generate Questionnaire Link */}
      <Card className="border-2 border-gold/30 bg-gradient-to-br from-white to-sand-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Generate Questionnaire Link
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-charcoal-600 mb-4">
            Generate a secure, one-click link to send to your client. No login required - they just click and start.
          </p>

          {/* Generate button for each questionnaire */}
          {questionnaires.length > 0 ? (
            <div className="space-y-3">
              {questionnaires.map((q) => (
                <div key={q.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-navy">{q.name}</p>
                    <p className="text-xs text-charcoal-500">{q.progress}% complete</p>
                  </div>
                  <Button
                    onClick={() => generateQuestionnaireLink(q.name)}
                    variant="primary"
                    size="sm"
                    disabled={isGeneratingLink}
                  >
                    {isGeneratingLink ? (
                      <>
                        <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Generate Link
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-charcoal-500 mb-3">No questionnaires assigned yet.</p>
              <Button
                onClick={() => generateQuestionnaireLink('jackie-deleon-dec-2025')}
                variant="primary"
                disabled={isGeneratingLink}
              >
                {isGeneratingLink ? 'Generating...' : 'Generate Link for Discovery Questionnaire'}
              </Button>
            </div>
          )}

          {/* Error message */}
          {linkError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{linkError}</p>
            </div>
          )}

          {/* Generated link display */}
          {generatedLink && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-green-800">Link Generated Successfully!</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={generatedLink}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm bg-white border border-green-300 rounded-lg font-mono text-charcoal-700"
                />
                <Button
                  onClick={() => copyLinkToClipboard(generatedLink)}
                  variant={linkCopied ? 'primary' : 'outline'}
                  size="sm"
                >
                  {linkCopied ? (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-green-700 mt-2">
                This link expires in 30 days. Send it to your client via email or text.
              </p>
            </div>
          )}

          {/* Existing active tokens */}
          {accessTokens.filter(t => t.isActive).length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-navy mb-3">Active Links</h4>
              <div className="space-y-2">
                {accessTokens.filter(t => t.isActive).map((token) => (
                  <div key={token.id} className="flex items-center justify-between p-2 bg-sand-50 rounded-lg text-sm">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-charcoal-700 truncate font-mono text-xs">{token.link}</p>
                      <p className="text-charcoal-500 text-xs">
                        Created {formatRelativeTime(token.created_at)} •
                        {token.access_count > 0 ? ` Accessed ${token.access_count}x` : ' Not yet accessed'}
                      </p>
                    </div>
                    <Button
                      onClick={() => copyLinkToClipboard(token.link)}
                      variant="ghost"
                      size="sm"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questionnaires */}
      <Card>
        <CardHeader>
          <CardTitle>Questionnaires</CardTitle>
        </CardHeader>
        <CardContent>
          {questionnaires.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-charcoal-500">No questionnaires yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questionnaires.map((q) => (
                <div
                  key={q.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gold/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-navy text-base mb-1">{q.name}</h4>
                      <p className="text-sm text-charcoal-600">
                        Started {formatDate(q.createdAt)} • Last updated {formatRelativeTime(q.lastUpdated)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColors[q.status]}`}>
                      {q.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-charcoal-600">Progress</span>
                      <span className="font-semibold text-navy">{q.progress}%</span>
                    </div>
                    <div className="w-full bg-sand-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-gold to-gold-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${q.progress}%` }}
                        role="progressbar"
                        aria-valuenow={q.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${q.progress}% complete`}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-charcoal-600">Points:</span>
                      <span className="font-semibold text-gold">{q.points}</span>
                    </div>
                    <Button
                      href={`/discovery/${clientId}`}
                      variant="ghost"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityLog activities={activities} maxItems={10} />
        </CardContent>
      </Card>
    </div>
  );
}
