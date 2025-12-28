'use client';

import { useState, useEffect } from 'react';
import ClientCard, { ClientData } from '@/components/admin/ClientCard';
import Button from '@/components/ui/Button';

// API response type
interface ClientApiResponse {
  client_id: string;
  questionnaire_count: number;
  completed_count: number;
  in_progress_count: number;
  total_points: number;
  first_activity: string;
  last_activity: string;
}

// Helper to convert API response to ClientData format
function convertToClientData(apiData: ClientApiResponse): ClientData {
  return {
    id: apiData.client_id,
    name: apiData.client_id, // In production, this would come from a clients table
    email: `${apiData.client_id}@example.com`, // In production, this would come from a clients table
    questionnaireCount: apiData.questionnaire_count,
    lastActivity: apiData.last_activity,
    completedCount: apiData.completed_count,
  };
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    // Filter clients based on search query
    const filtered = clients.filter((client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchQuery, clients]);

  async function loadClients() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/clients?limit=100');

      if (!response.ok) {
        throw new Error(`Failed to fetch clients: ${response.statusText}`);
      }

      const data = await response.json();
      const converted = data.clients.map(convertToClientData);
      setClients(converted);
    } catch (err) {
      console.error('Error loading clients:', err);
      setError(err instanceof Error ? err.message : 'Failed to load clients');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-navy mb-2">
            Clients
          </h1>
          <p className="text-charcoal-600">
            Manage and view all client questionnaires
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Create New Client Button */}
          <Button
            href="/admin/clients/new"
            variant="primary"
            size="sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Client
          </Button>

          {/* View mode toggle */}
          <div className="flex rounded-lg border border-gray-200 bg-white p-1" role="group" aria-label="View mode">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`
                min-h-[44px] px-4 py-2 rounded-md text-sm font-medium transition-all
                ${viewMode === 'grid'
                  ? 'bg-gold text-navy shadow-sm'
                  : 'text-charcoal-600 hover:text-navy hover:bg-sand-50'
                }
              `}
              aria-pressed={viewMode === 'grid'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="sr-only">Grid view</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`
                min-h-[44px] px-4 py-2 rounded-md text-sm font-medium transition-all
                ${viewMode === 'table'
                  ? 'bg-gold text-navy shadow-sm'
                  : 'text-charcoal-600 hover:text-navy hover:bg-sand-50'
                }
              `}
              aria-pressed={viewMode === 'table'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="sr-only">Table view</span>
            </button>
          </div>

          <Button
            onClick={loadClients}
            variant="outline"
            size="sm"
            aria-label="Refresh client list"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline ml-2">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <label htmlFor="client-search" className="sr-only">
            Search clients by name or email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-charcoal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="client-search"
              type="search"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 min-h-[44px] border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
            />
          </div>
        </div>

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 text-sm text-charcoal-600 hover:text-navy transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-charcoal-500 mb-1">Total Clients</p>
          <p className="text-3xl font-bold text-navy">{clients.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-charcoal-500 mb-1">Active Questionnaires</p>
          <p className="text-3xl font-bold text-navy">
            {clients.reduce((sum, c) => sum + c.questionnaireCount, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-charcoal-500 mb-1">Completed</p>
          <p className="text-3xl font-bold text-navy">
            {clients.reduce((sum, c) => sum + (c.completedCount || 0), 0)}
          </p>
        </div>
      </div>

      {/* Client List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4" aria-hidden="true" />
            <p className="text-charcoal-600">Loading clients...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-navy mb-2">Failed to Load Clients</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadClients} variant="primary" size="md">
            Try Again
          </Button>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-6xl mb-4" aria-hidden="true">{searchQuery ? '🔍' : '👥'}</div>
          <h3 className="text-xl font-semibold text-navy mb-2">
            {searchQuery ? 'No clients found' : 'No clients yet'}
          </h3>
          <p className="text-charcoal-600 mb-6">
            {searchQuery
              ? 'Try adjusting your search query'
              : 'Create your first client to get started'}
          </p>
          {!searchQuery && (
            <Button href="/admin/clients/new" variant="primary">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Client
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sand-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
                    Questionnaires
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
                    Completion
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClients.map((client) => {
                  const completionRate = client.questionnaireCount > 0
                    ? Math.round(((client.completedCount || 0) / client.questionnaireCount) * 100)
                    : 0;

                  return (
                    <tr key={client.id} className="hover:bg-sand-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-navy">{client.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-charcoal-600">{client.questionnaireCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-sand-100 rounded-full h-2">
                            <div
                              className="bg-gold h-2 rounded-full"
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                          <span className="text-sm text-charcoal-600">{completionRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal-600">
                        {new Date(client.lastActivity).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          href={`/admin/clients/${client.id}`}
                          variant="ghost"
                          size="sm"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
