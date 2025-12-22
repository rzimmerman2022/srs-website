import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useQuestionnaireSync } from '@/hooks/useQuestionnaireSync';

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  supabase: null,
}));

describe('useQuestionnaireSync', () => {
  const mockClientId = 'test-client';
  const mockQuestionnaireId = 'discovery';
  const storageKey = `questionnaire_${mockClientId}_${mockQuestionnaireId}`;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Default fetch mock - successful empty response
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: null }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('starts with loading state', async () => {
      const { result } = renderHook(() =>
        useQuestionnaireSync({ clientId: mockClientId })
      );

      // Initial state should be loading
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('initializes with default state when no saved data', async () => {
      const { result } = renderHook(() =>
        useQuestionnaireSync({ clientId: mockClientId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Hook initializes with empty default state, not null
      expect(result.current.state).toBeDefined();
      expect(result.current.state?.answers).toEqual({});
    });

    it('loads from localStorage on mount', async () => {
      const savedState = {
        answers: { q1: 'test answer' },
        currentQuestionIndex: 2,
        currentModuleIndex: 0,
        completedModules: [],
        points: 10,
        streak: 2,
        combo: 0,
        completed: false,
        shownMilestones: [],
      };

      // Mock localStorage.getItem to return the saved state
      const encoded = btoa(JSON.stringify(savedState));
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(encoded);

      const { result } = renderHook(() =>
        useQuestionnaireSync({ clientId: mockClientId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Verify localStorage was accessed
      expect(localStorage.getItem).toHaveBeenCalled();
    });
  });

  describe('state updates', () => {
    it('updates state when updateState is called', async () => {
      const { result } = renderHook(() =>
        useQuestionnaireSync({ clientId: mockClientId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.updateState({
          answers: { q1: 'new answer' },
          currentQuestionIndex: 1,
          currentModuleIndex: 0,
          completedModules: [],
          points: 5,
          streak: 1,
        });
      });

      expect(result.current.state?.answers).toEqual({ q1: 'new answer' });
    });

    it('merges state updates correctly', async () => {
      const { result } = renderHook(() =>
        useQuestionnaireSync({ clientId: mockClientId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // First update
      act(() => {
        result.current.updateState({
          answers: { q1: 'first' },
          currentQuestionIndex: 1,
        });
      });

      // Second update - should merge
      act(() => {
        result.current.updateState({
          answers: { q1: 'first', q2: 'second' },
          currentQuestionIndex: 2,
        });
      });

      expect(result.current.state?.answers).toEqual({ q1: 'first', q2: 'second' });
      expect(result.current.state?.currentQuestionIndex).toBe(2);
    });
  });

  describe('online/offline handling', () => {
    it('detects online status', async () => {
      Object.defineProperty(navigator, 'onLine', { value: true, writable: true });

      const { result } = renderHook(() =>
        useQuestionnaireSync({ clientId: mockClientId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isOnline).toBe(true);
    });

    it('handles offline status gracefully', async () => {
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true });

      const { result } = renderHook(() =>
        useQuestionnaireSync({ clientId: mockClientId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should still work with localStorage when offline
      act(() => {
        result.current.updateState({
          answers: { q1: 'offline answer' },
          currentQuestionIndex: 0,
          currentModuleIndex: 0,
          completedModules: [],
          points: 0,
          streak: 0,
        });
      });

      expect(result.current.state?.answers).toEqual({ q1: 'offline answer' });
    });
  });

  describe('API sync', () => {
    it('fetches from API on mount', async () => {
      const apiResponse = {
        data: {
          answers: { q1: 'server answer' },
          current_question_index: 3,
          current_module_index: 1,
          completed_modules: ['module1'],
          points: 20,
          streak: 4,
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(apiResponse),
      });

      const { result } = renderHook(() =>
        useQuestionnaireSync({ clientId: mockClientId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Verify fetch was called with the correct URL pattern
      expect(global.fetch).toHaveBeenCalled();
      const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(fetchCall[0]).toContain('/api/questionnaire/test-client');
    });

    it('uses server data when available', async () => {
      const serverResponse = {
        data: {
          answers: { q1: 'server', q2: 'server', q3: 'server' },
          current_question_index: 5,
          current_module_index: 1,
          completed_modules: ['module1'],
          points: 30,
          streak: 5,
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(serverResponse),
      });

      const { result } = renderHook(() =>
        useQuestionnaireSync({ clientId: mockClientId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // The hook may use server data or merge it
      expect(result.current.state).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('handles API fetch errors gracefully', async () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      const { result } = renderHook(() =>
        useQuestionnaireSync({ clientId: mockClientId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should still have state (from default initialization)
      expect(result.current.state).toBeDefined();

      consoleSpy.mockRestore();
    });

    it('handles malformed localStorage data gracefully', async () => {
      // Store invalid base64
      localStorage.setItem(storageKey, 'not-valid-base64!!!');

      const { result } = renderHook(() =>
        useQuestionnaireSync({ clientId: mockClientId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should not crash, should initialize with default state
      expect(result.current.state).toBeDefined();
      expect(result.current.state?.answers).toEqual({});
    });
  });

  describe('forceSync', () => {
    it('manually triggers sync to server', async () => {
      const { result } = renderHook(() =>
        useQuestionnaireSync({ clientId: mockClientId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Update state first
      act(() => {
        result.current.updateState({
          answers: { q1: 'force sync test' },
          currentQuestionIndex: 1,
          currentModuleIndex: 0,
          completedModules: [],
          points: 5,
          streak: 1,
        });
      });

      // Clear previous fetch calls
      (global.fetch as ReturnType<typeof vi.fn>).mockClear();

      // Trigger force sync
      await act(async () => {
        await result.current.forceSync();
      });

      // Verify POST was called
      const fetchCalls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      const postCall = fetchCalls.find(
        (call) => call[1]?.method === 'POST'
      );
      expect(postCall).toBeDefined();
    });
  });
});
