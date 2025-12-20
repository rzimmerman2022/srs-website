'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface QuestionnaireState {
  answers: Record<string, string | string[]>;
  currentQuestionIndex: number;
  currentModuleIndex: number;
  points: number;
  streak: number;
  combo: number;
  shownMilestones: number[];
  completed: boolean;
}

interface UseQuestionnaireSyncOptions {
  clientId: string;
  questionnaireId?: string;
  debounceMs?: number;
}

interface UseQuestionnaireSyncReturn {
  state: QuestionnaireState | null;
  isLoading: boolean;
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  error: string | null;
  updateState: (updates: Partial<QuestionnaireState>) => void;
  forceSync: () => Promise<void>;
}

const DEFAULT_STATE: QuestionnaireState = {
  answers: {},
  currentQuestionIndex: 0,
  currentModuleIndex: 0,
  points: 0,
  streak: 0,
  combo: 0,
  shownMilestones: [],
  completed: false,
};

// Configuration for retry logic
const SYNC_CONFIG = {
  FETCH_TIMEOUT_MS: 10000,        // 10 second timeout for fetch requests
  MAX_RETRIES: 3,                  // Max retry attempts before showing offline
  RETRY_DELAYS: [1000, 2000, 4000], // Exponential backoff delays
  CONSECUTIVE_FAILURES_FOR_OFFLINE: 2, // Show offline after this many consecutive failures
};

export function useQuestionnaireSync({
  clientId,
  questionnaireId = 'discovery',
  debounceMs = 2000,
}: UseQuestionnaireSyncOptions): UseQuestionnaireSyncReturn {
  const [state, setState] = useState<QuestionnaireState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const consecutiveFailuresRef = useRef(0);
  const isInitializedRef = useRef(false);

  const localStorageKey = `questionnaire_${questionnaireId}_${clientId}`;

  // Load from localStorage
  const loadFromLocalStorage = useCallback((): QuestionnaireState | null => {
    try {
      const stored = localStorage.getItem(localStorageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load from localStorage:', e);
    }
    return null;
  }, [localStorageKey]);

  // Save to localStorage
  const saveToLocalStorage = useCallback((data: QuestionnaireState) => {
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [localStorageKey]);

  // Fetch with timeout helper
  const fetchWithTimeout = useCallback(async (
    url: string,
    options: RequestInit,
    timeoutMs: number = SYNC_CONFIG.FETCH_TIMEOUT_MS
  ): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }, []);

  // Sync to server with retry logic
  const syncToServer = useCallback(async (data: QuestionnaireState, retryCount = 0): Promise<boolean> => {
    if (!clientId) return false;

    setIsSyncing(true);
    setError(null);

    try {
      const response = await fetchWithTimeout(
        `/api/questionnaire/${clientId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionnaireId,
            answers: data.answers,
            currentQuestionIndex: data.currentQuestionIndex,
            currentModuleIndex: data.currentModuleIndex,
            points: data.points,
            streak: data.streak,
            combo: data.combo,
            shownMilestones: data.shownMilestones,
            completed: data.completed,
          }),
        }
      );

      // Validate HTTP status code
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.fallback) {
        // Supabase not configured, using localStorage only - this is still "online"
        console.info('Server sync disabled - using localStorage fallback');
        setIsOnline(true); // FIX: Set online even in fallback mode
        consecutiveFailuresRef.current = 0;
      } else if (result.error) {
        throw new Error(result.error);
      } else {
        setLastSyncedAt(new Date());
        setIsOnline(true);
        consecutiveFailuresRef.current = 0;
      }

      setIsSyncing(false);
      return true;
    } catch (e) {
      const isAbortError = e instanceof Error && e.name === 'AbortError';
      const errorMessage = isAbortError ? 'Request timed out' : (e instanceof Error ? e.message : 'Unknown error');

      console.warn(`Sync attempt ${retryCount + 1} failed:`, errorMessage);

      // Retry logic with exponential backoff
      if (retryCount < SYNC_CONFIG.MAX_RETRIES - 1) {
        const delay = SYNC_CONFIG.RETRY_DELAYS[retryCount] || 4000;
        console.info(`Retrying in ${delay}ms...`);

        await new Promise(resolve => setTimeout(resolve, delay));
        setIsSyncing(false);
        return syncToServer(data, retryCount + 1);
      }

      // All retries exhausted
      consecutiveFailuresRef.current += 1;

      // Only show offline after multiple consecutive failures
      if (consecutiveFailuresRef.current >= SYNC_CONFIG.CONSECUTIVE_FAILURES_FOR_OFFLINE) {
        setError('Sync pending - changes saved locally');
        setIsOnline(false);
      } else {
        // Transient failure - keep showing online but log warning
        console.warn('Transient sync failure, keeping online status');
        setError(null);
      }

      setIsSyncing(false);
      return false;
    }
  }, [clientId, questionnaireId, fetchWithTimeout]);

  // Debounced sync
  const debouncedSync = useCallback((data: QuestionnaireState) => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(() => {
      syncToServer(data);
    }, debounceMs);
  }, [syncToServer, debounceMs]);

  // Load initial data
  useEffect(() => {
    if (isInitializedRef.current || !clientId) return;

    const loadData = async () => {
      setIsLoading(true);

      // First, try to load from localStorage for immediate display
      const localData = loadFromLocalStorage();
      if (localData) {
        setState(localData);
      }

      // Then try to fetch from server
      try {
        const response = await fetch(
          `/api/questionnaire/${clientId}?questionnaireId=${questionnaireId}`
        );
        const result = await response.json();

        if (result.data) {
          // Server data exists - use it (it's the source of truth)
          const serverState: QuestionnaireState = {
            answers: result.data.answers || {},
            currentQuestionIndex: result.data.current_question_index || 0,
            currentModuleIndex: result.data.current_module_index || 0,
            points: result.data.points || 0,
            streak: result.data.streak || 0,
            combo: result.data.combo || 0,
            shownMilestones: result.data.shown_milestones || [],
            completed: result.data.completed || false,
          };

          // Merge: prefer server data, but if local has more progress, use local
          const mergedState = mergeStates(localData, serverState);
          setState(mergedState);
          saveToLocalStorage(mergedState);

          // Sync merged state back to server if different
          if (localData && hasMoreProgress(localData, serverState)) {
            syncToServer(mergedState);
          }

          setIsOnline(true);
          setLastSyncedAt(new Date());
        } else if (result.fallback) {
          // Supabase not configured - use localStorage only
          setIsOnline(true); // FIX: Fallback mode is still "online"
          if (localData) {
            setState(localData);
          } else {
            setState(DEFAULT_STATE);
          }
        } else if (!localData) {
          // No server data and no local data - start fresh
          setState(DEFAULT_STATE);
        }
      } catch (e) {
        console.warn('Failed to fetch from server:', e);
        setIsOnline(false);
        // Use local data or default
        if (!localData) {
          setState(DEFAULT_STATE);
        }
      } finally {
        setIsLoading(false);
        isInitializedRef.current = true;
      }
    };

    loadData();
  }, [clientId, questionnaireId, loadFromLocalStorage, saveToLocalStorage, syncToServer]);

  // Update state handler
  const updateState = useCallback((updates: Partial<QuestionnaireState>) => {
    setState(prev => {
      if (!prev) return prev;

      const newState = { ...prev, ...updates };

      // Immediately save to localStorage
      saveToLocalStorage(newState);

      // Debounced sync to server
      debouncedSync(newState);

      return newState;
    });
  }, [saveToLocalStorage, debouncedSync]);

  // Force immediate sync
  const forceSync = useCallback(async () => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    if (state) {
      await syncToServer(state);
    }
  }, [state, syncToServer]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (state) {
        syncToServer(state);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [state, syncToServer]);

  // Sync before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (state && syncTimeoutRef.current) {
        // Cancel debounce and sync immediately (best effort)
        clearTimeout(syncTimeoutRef.current);
        navigator.sendBeacon?.(
          `/api/questionnaire/${clientId}`,
          JSON.stringify({
            questionnaireId,
            ...state,
          })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state, clientId, questionnaireId]);

  return {
    state,
    isLoading,
    isOnline,
    isSyncing,
    lastSyncedAt,
    error,
    updateState,
    forceSync,
  };
}

// Helper: Merge states, preferring the one with more progress
function mergeStates(
  local: QuestionnaireState | null,
  server: QuestionnaireState
): QuestionnaireState {
  if (!local) return server;

  // Use whichever has more answers
  const localAnswerCount = Object.keys(local.answers).length;
  const serverAnswerCount = Object.keys(server.answers).length;

  if (localAnswerCount > serverAnswerCount) {
    return local;
  } else if (serverAnswerCount > localAnswerCount) {
    return server;
  }

  // Same answer count - prefer higher points/progress
  if (local.points > server.points || local.currentQuestionIndex > server.currentQuestionIndex) {
    return local;
  }

  return server;
}

// Helper: Check if local has more progress than server
function hasMoreProgress(local: QuestionnaireState, server: QuestionnaireState): boolean {
  const localAnswerCount = Object.keys(local.answers).length;
  const serverAnswerCount = Object.keys(server.answers).length;

  return (
    localAnswerCount > serverAnswerCount ||
    local.points > server.points ||
    local.currentQuestionIndex > server.currentQuestionIndex
  );
}

export default useQuestionnaireSync;
