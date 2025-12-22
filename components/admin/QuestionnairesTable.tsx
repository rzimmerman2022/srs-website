import { useState } from 'react';
import { AdminQuestionnaire } from '@/app/admin/questionnaires/page';
import StatusBadge from './StatusBadge';
import { formatDistanceToNow, format } from 'date-fns';

interface QuestionnairesTableProps {
  questionnaires: AdminQuestionnaire[];
  onDelete: (id: string) => void;
  onViewResponses: (id: string) => void;
  onEdit: (id: string) => void;
}

type SortField = 'title' | 'clientName' | 'status' | 'completionPercentage' | 'lastActivity';
type SortDirection = 'asc' | 'desc';

export default function QuestionnairesTable({
  questionnaires,
  onDelete,
  onViewResponses,
  onEdit,
}: QuestionnairesTableProps) {
  const [sortField, setSortField] = useState<SortField>('lastActivity');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Handle column sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort questionnaires
  const sortedQuestionnaires = [...questionnaires].sort((a, b) => {
    let aValue: string | number = a[sortField];
    let bValue: string | number = b[sortField];

    // Handle special cases
    if (sortField === 'lastActivity') {
      aValue = new Date(a.lastActivity).getTime();
      bValue = new Date(b.lastActivity).getTime();
    }

    // Compare values
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Sort icon component
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-charcoal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-sand-100 border-b border-gray-200">
            <tr>
              {/* Title */}
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center gap-2 font-semibold text-sm text-navy hover:text-gold transition-colors group"
                >
                  Title
                  <SortIcon field="title" />
                </button>
              </th>

              {/* Client Name */}
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('clientName')}
                  className="flex items-center gap-2 font-semibold text-sm text-navy hover:text-gold transition-colors group"
                >
                  Client
                  <SortIcon field="clientName" />
                </button>
              </th>

              {/* Status */}
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-2 font-semibold text-sm text-navy hover:text-gold transition-colors group"
                >
                  Status
                  <SortIcon field="status" />
                </button>
              </th>

              {/* Progress */}
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('completionPercentage')}
                  className="flex items-center gap-2 font-semibold text-sm text-navy hover:text-gold transition-colors group"
                >
                  Progress
                  <SortIcon field="completionPercentage" />
                </button>
              </th>

              {/* Questions */}
              <th className="px-6 py-4 text-left">
                <span className="font-semibold text-sm text-navy">Questions</span>
              </th>

              {/* Last Activity */}
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('lastActivity')}
                  className="flex items-center gap-2 font-semibold text-sm text-navy hover:text-gold transition-colors group"
                >
                  Last Activity
                  <SortIcon field="lastActivity" />
                </button>
              </th>

              {/* Actions */}
              <th className="px-6 py-4 text-right">
                <span className="font-semibold text-sm text-navy">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {sortedQuestionnaires.map((questionnaire) => {
              const { id, title, clientName, status, questionsCount, responsesCount, completionPercentage, lastActivity, packageType } = questionnaire;
              const lastActivityText = formatDistanceToNow(new Date(lastActivity), { addSuffix: true });

              return (
                <tr
                  key={id}
                  className="hover:bg-sand-50 transition-colors group"
                >
                  {/* Title */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-navy group-hover:text-gold transition-colors">
                        {title}
                      </p>
                      {packageType && (
                        <p className="text-xs text-charcoal-500 mt-0.5">
                          {packageType}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Client Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gold text-navy flex items-center justify-center font-semibold text-sm">
                        {clientName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <span className="text-sm text-charcoal-700">{clientName}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={status} size="sm" />
                  </td>

                  {/* Progress */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[120px]">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-gold to-gold-600 transition-all duration-500 rounded-full"
                            style={{ width: `${completionPercentage}%` }}
                            role="progressbar"
                            aria-valuenow={completionPercentage}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-charcoal-700 whitespace-nowrap">
                        {completionPercentage}%
                      </span>
                    </div>
                  </td>

                  {/* Questions */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-charcoal-700">
                      {responsesCount} / {questionsCount}
                    </span>
                  </td>

                  {/* Last Activity */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-charcoal-700">{lastActivityText}</p>
                      <p className="text-xs text-charcoal-500 mt-0.5">
                        {format(new Date(lastActivity), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* View Responses Button */}
                      <button
                        onClick={() => onViewResponses(id)}
                        className="p-2 rounded-lg text-charcoal-600 hover:text-navy hover:bg-sand-100 transition-colors"
                        aria-label="View responses"
                        title="View responses"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(id)}
                        className="p-2 rounded-lg text-charcoal-600 hover:text-navy hover:bg-sand-100 transition-colors"
                        aria-label="Edit questionnaire"
                        title="Edit questionnaire"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      {/* More Actions Menu */}
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === id ? null : id)}
                          className="p-2 rounded-lg text-charcoal-600 hover:text-navy hover:bg-sand-100 transition-colors"
                          aria-label="More actions"
                          aria-expanded={openMenuId === id}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {openMenuId === id && (
                          <>
                            {/* Backdrop to close menu */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                              <button
                                onClick={() => {
                                  onViewResponses(id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-charcoal-700 hover:bg-sand-100 transition-colors flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                View Responses
                              </button>
                              <button
                                onClick={() => {
                                  onEdit(id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-charcoal-700 hover:bg-sand-100 transition-colors flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  // TODO: Implement duplicate
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-charcoal-700 hover:bg-sand-100 transition-colors flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Duplicate
                              </button>
                              <div className="border-t border-gray-200 my-1" />
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${title}"?`)) {
                                    onDelete(id);
                                    setOpenMenuId(null);
                                  }
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {sortedQuestionnaires.length === 0 && (
        <div className="text-center py-12">
          <p className="text-charcoal-500">No questionnaires found</p>
        </div>
      )}
    </div>
  );
}
