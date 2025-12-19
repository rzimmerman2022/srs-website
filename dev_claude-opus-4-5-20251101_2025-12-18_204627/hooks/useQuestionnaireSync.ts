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
  const pendingUpdatesRef = useRef<Partial<QuestionnaireState> | null>(null);
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

  // Sync to server
  const syncToServer = useCallback(async (data: QuestionnaireState) => {
    if (!clientId) return;

    setIsSyncing(true);
    setError(null);

    try {
      const response = await fetch(`/api/questionnaire/${clientId}`, {
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
      });

      const result = await response.json();

      if (result.fallback) {
        // Supabase not configured, using localStorage only
        console.info('Server sync disabled - using localStorage fallback');
      } else if (result.error) {
        throw new Error(result.error);
      } else {
        setLastSyncedAt(new Date());
        setIsOnline(true);
      }
    } catch (e) {
      console.warn('Server sync failed, data safe in localStorage:', e);
      setError('Sync pending - changes saved locally');
      setIsOnline(false);
    } finally {
      setIsSyncing(false);
    }
  }, [clientId, questionnaireId]);

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
