import { useEffect, useRef } from 'react';
import type { FormState } from '../types';
import { serializeState, deserializeState } from '../utils/questionHelpers';

const STORAGE_KEY = 'form-builder-state';

/**
 * Custom hook that handles localStorage persistence for form state.
 * Returns a loader function to retrieve previously saved state.
 */
export function useFormPersistence(state: FormState) {
  const isFirstMount = useRef(true);

  useEffect(() => {
    // Skip persisting the initial empty state on first mount
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    localStorage.setItem(STORAGE_KEY, serializeState(state));
  }, [state]);
}

/** Loads persisted state from localStorage (call once on mount) */
export function loadPersistedState(): FormState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return deserializeState(raw);
}

/** Clears persisted state from localStorage */
export function clearPersistedState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
