'use client';

import { useState, useEffect, useMemo } from 'react';
import QuestionnaireCard from '@/components/admin/QuestionnaireCard';
import QuestionnairesTable from '@/components/admin/QuestionnairesTable';
import Button from '@/components/ui/Button';

// Status type for questionnaires
export type QuestionnaireStatus = 'draft' | 'active' | 'completed' | 'archived';

// Extended questionnaire data for admin view
export interface AdminQuestionnaire {
  id: string;
  title: string;
  clientName: string;
  clientId: string;
  status: QuestionnaireStatus;
  questionsCount: number;
  responsesCount: number;
  completionPercentage: number;
  lastActivity: string; // ISO date string
  createdAt: string; // ISO date string
  packageType?: string;
}

// API response type
interface QuestionnaireApiResponse {
  id: string;
  client_id: string;
  questionnaire_id: string;
  completed: boolean;
  progress_percentage: number;
  total_questions: number;
  answered_questions: number;
  points: number;
  created_at: string;
  updated_at: string;
  last_activity: string;
}

// Helper to convert API response to AdminQuestionnaire format
function convertToAdminQuestionnaire(apiData: QuestionnaireApiResponse): AdminQuestionnaire {
  // Determine status based on completion and progress
  let status: QuestionnaireStatus;
  if (apiData.completed) {
    status = 'completed';
  } else if (apiData.progress_percentage > 0) {
    status = 'active';
  } else {
    status = 'draft';
  }

  return {
    id: apiData.id,
    title: `Questionnaire - ${apiData.questionnaire_id}`,
    clientName: apiData.client_id,
    clientId: apiData.client_id,
    status,
    questionsCount: apiData.total_questions,
    responsesCount: apiData.answered_questions,
    completionPercentage: apiData.progress_percentage,
    lastActivity: apiData.last_activity,
    createdAt: apiData.created_at,
    packageType: 'Discovery Questionnaire',
  };
}

type ViewMode = 'cards' | 'table';

export default function QuestionnairesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuestionnaireStatus | 'all'>('all');
  const [questionnaires, setQuestionnaires] = useState<AdminQuestionnaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch questionnaires on mount
  useEffect(() => {
    fetchQuestionnaires();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchQuestionnaires() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/questionnaires?limit=100');

      if (!response.ok) {
        throw new Error(`Failed to fetch questionnaires: ${response.statusText}`);
      }

      const data = await response.json();
      const converted = data.questionnaires.map(convertToAdminQuestionnaire);
      setQuestionnaires(converted);
    } catch (err) {
      console.error('Error fetching questionnaires:', err);
      setError(err instanceof Error ? err.message : 'Failed to load questionnaires');
    } finally {
      setIsLoading(false);
    }
  }

  // Filter questionnaires based on search and status
  const filteredQuestionnaires = useMemo(() => {
    return questionnaires.filter((q) => {
      const matchesSearch =
        searchQuery === '' ||
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [questionnaires, searchQuery, statusFilter]);

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log('Delete questionnaire:', id);
  };

  const handleViewResponses = (id: string) => {
    // TODO: Navigate to responses page
    console.log('View responses:', id);
  };

  const handleEdit = (id: string) => {
    // TODO: Navigate to edit page
    console.log('Edit questionnaire:', id);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded w-64 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-navy mb-2">
            Questionnaires
          </h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-navy mb-2">Failed to Load Questionnaires</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchQuestionnaires} variant="primary" size="md">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-navy mb-2">
          Questionnaires
        </h1>
        <p className="text-charcoal-500">
          Manage client questionnaires and track progress
        </p>
      </div>

      {/* Filters and View Toggle */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-80">
            <input
              type="text"
              placeholder="Search by title or client name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
              aria-label="Search questionnaires"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as QuestionnaireStatus | 'all')}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all bg-white"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* View Toggle - Desktop Only */}
        <div className="hidden md:flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-4 py-2 rounded-md transition-all ${
              viewMode === 'cards'
                ? 'bg-navy text-white'
                : 'text-charcoal-600 hover:bg-gray-100'
            }`}
            aria-label="Card view"
            aria-pressed={viewMode === 'cards'}
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
              <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-md transition-all ${
              viewMode === 'table'
                ? 'bg-navy text-white'
                : 'text-charcoal-600 hover:bg-gray-100'
            }`}
            aria-label="Table view"
            aria-pressed={viewMode === 'table'}
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
              <path d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-charcoal-600">
        {filteredQuestionnaires.length === questionnaires.length ? (
          <>Showing all {filteredQuestionnaires.length} questionnaires</>
        ) : (
          <>
            Showing {filteredQuestionnaires.length} of {questionnaires.length} questionnaires
          </>
        )}
      </div>

      {/* Content - Cards or Table */}
      {filteredQuestionnaires.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sand-200 mb-4">
            <svg
              className="w-8 h-8 text-charcoal-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-navy mb-2">No questionnaires found</h3>
          <p className="text-charcoal-500 mb-6">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by creating a new questionnaire'}
          </p>
          {searchQuery === '' && statusFilter === 'all' && (
            <Button variant="primary">Create Questionnaire</Button>
          )}
        </div>
      ) : (
        <>
          {/* Cards View - Always shown on mobile, conditionally on desktop */}
          <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ${viewMode === 'table' ? 'md:hidden' : ''}`}>
            {filteredQuestionnaires.map((questionnaire) => (
              <QuestionnaireCard
                key={questionnaire.id}
                questionnaire={questionnaire}
                onDelete={handleDelete}
                onViewResponses={handleViewResponses}
                onEdit={handleEdit}
              />
            ))}
          </div>

          {/* Table View - Desktop only, when table mode selected */}
          <div className={`hidden ${viewMode === 'table' ? 'md:block' : ''}`}>
            <QuestionnairesTable
              questionnaires={filteredQuestionnaires}
              onDelete={handleDelete}
              onViewResponses={handleViewResponses}
              onEdit={handleEdit}
            />
          </div>
        </>
      )}
    </div>
  );
}
