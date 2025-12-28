/**
 * HubSpot Sync Status Component
 *
 * SUBAGENT-4: claude-opus-4-5/SUBAGENT-4/hubspot-integration/2025-12-23T-admin-ui
 * Fortune 50 / World-Class Client Onboarding System
 *
 * Displays HubSpot sync status with one-click manual sync capability.
 */

'use client';

import { useState } from 'react';
import { formatRelativeTime } from '@/lib/utils';

interface HubSpotSyncStatusProps {
  clientId: string;
  hubspotContactId?: string | null;
  hubspotDealId?: string | null;
  lastSyncedAt?: string | null;
  syncStatus?: 'synced' | 'pending' | 'error' | null;
  errorMessage?: string | null;
  compact?: boolean;
}

export default function HubSpotSyncStatus({
  clientId,
  hubspotContactId,
  hubspotDealId,
  lastSyncedAt,
  syncStatus,
  errorMessage,
  compact = false,
}: HubSpotSyncStatusProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [localSyncStatus, setLocalSyncStatus] = useState(syncStatus);
  const [localLastSynced, setLocalLastSynced] = useState(lastSyncedAt);
  const [localError, setLocalError] = useState(errorMessage);

  const isSynced = !!hubspotContactId || localSyncStatus === 'synced';
  const hasError = localSyncStatus === 'error';

  async function handleManualSync() {
    setIsSyncing(true);
    setLocalError(null);

    try {
      const response = await fetch(`/api/admin/clients/${clientId}/hubspot-sync`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sync failed');
      }

      setLocalSyncStatus('synced');
      setLocalLastSynced(new Date().toISOString());
    } catch (error) {
      setLocalSyncStatus('error');
      setLocalError(error instanceof Error ? error.message : 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2">
        {isSynced ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            HubSpot Synced
          </span>
        ) : hasError ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Sync Error
          </span>
        ) : (
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            {isSyncing ? (
              <>
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Syncing...
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sync to HubSpot
              </>
            )}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* HubSpot Logo */}
          <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.164 7.93V5.664a2.248 2.248 0 001.19-1.973 2.247 2.247 0 00-4.493 0c0 .86.483 1.605 1.19 1.973V7.93a6.555 6.555 0 00-3.17 1.47l-7.21-5.6a2.065 2.065 0 00.079-.55 2.073 2.073 0 10-2.073 2.073c.386 0 .743-.11 1.051-.293l7.134 5.54a6.6 6.6 0 00-.67 2.893c0 1.093.268 2.124.74 3.033l-2.376 2.376a2.075 2.075 0 00-.619-.096 2.073 2.073 0 102.073 2.073c0-.22-.035-.432-.097-.632l2.342-2.342a6.58 6.58 0 003.95 1.32 6.598 6.598 0 006.585-6.585 6.587 6.587 0 00-5.626-6.48zm-2.432 9.712a3.25 3.25 0 110-6.5 3.25 3.25 0 010 6.5z" />
            </svg>
          </div>

          <div>
            <h4 className="font-semibold text-orange-900">HubSpot CRM</h4>
            {isSynced ? (
              <p className="text-sm text-orange-700">
                Synced {localLastSynced ? formatRelativeTime(localLastSynced) : 'recently'}
              </p>
            ) : hasError ? (
              <p className="text-sm text-red-600">{localError || 'Sync failed'}</p>
            ) : (
              <p className="text-sm text-gray-500">Not yet synced</p>
            )}
          </div>
        </div>

        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isSynced
              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              : hasError
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          {isSyncing ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Syncing...
            </>
          ) : isSynced ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Re-sync
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Sync Now
            </>
          )}
        </button>
      </div>

      {/* Sync details */}
      {isSynced && (hubspotContactId || hubspotDealId) && (
        <div className="mt-3 pt-3 border-t border-orange-100 grid grid-cols-2 gap-4 text-sm">
          {hubspotContactId && (
            <div>
              <span className="text-orange-600">Contact ID:</span>
              <span className="ml-2 font-mono text-orange-900">{hubspotContactId}</span>
            </div>
          )}
          {hubspotDealId && (
            <div>
              <span className="text-orange-600">Deal ID:</span>
              <span className="ml-2 font-mono text-orange-900">{hubspotDealId}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
