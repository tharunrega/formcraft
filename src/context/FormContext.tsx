import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { FormState, FormAction, Question } from '../types';
import {
  createQuestion,
  addChildQuestion,
  deleteQuestion,
  updateQuestion,
  reorderQuestions,
  numberQuestions,
  serializeState,
  deserializeState,
} from '../utils/questionHelpers';

const STORAGE_KEY = 'form-builder-state';

const initialState: FormState = { questions: [], version: 1 };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'ADD_QUESTION':
      if (action.parentId) {
        return {
          ...state,
          questions: addChildQuestion(state.questions, action.parentId),
        };
      }
      return {
        ...state,
        questions: [...state.questions, createQuestion()],
      };

    case 'DELETE_QUESTION':
      return {
        ...state,
        questions: deleteQuestion(state.questions, action.id),
      };

    case 'UPDATE_QUESTION':
      return {
        ...state,
        questions: updateQuestion(
          state.questions,
          action.id,
          action.field,
          action.value
        ),
      };

    case 'REORDER_QUESTIONS':
      return {
        ...state,
        questions: reorderQuestions(
          state.questions,
          action.activeId,
          action.overId
        ),
      };

    case 'LOAD_STATE':
      return action.state;

    case 'CLEAR_STATE':
      return initialState;

    default:
      return state;
  }
}

interface FormContextValue {
  state: FormState;
  dispatch: Dispatch<FormAction>;
  numberedQuestions: ReturnType<typeof numberQuestions>;
  restoredFromStorage: boolean;
  dismissRestoreBanner: () => void;
  clearSavedData: () => void;
}

const FormContext = createContext<FormContextValue | null>(null);

export function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [restoredFromStorage, setRestoredFromStorage] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = deserializeState(raw);
      if (saved && saved.questions.length > 0) {
        dispatch({ type: 'LOAD_STATE', state: saved });
        setRestoredFromStorage(true);
      }
    }
  }, []);

  // Persist to localStorage on every state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, serializeState(state));
  }, [state]);

  const dismissRestoreBanner = useCallback(() => {
    setRestoredFromStorage(false);
  }, []);

  const clearSavedData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'CLEAR_STATE' });
    setRestoredFromStorage(false);
  }, []);

  const numberedQuestions = useMemo(
    () => numberQuestions(state.questions),
    [state.questions]
  );

  const value = useMemo(
    () => ({
      state,
      dispatch,
      numberedQuestions,
      restoredFromStorage,
      dismissRestoreBanner,
      clearSavedData,
    }),
    [state, numberedQuestions, restoredFromStorage, dismissRestoreBanner, clearSavedData]
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useFormContext(): FormContextValue {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error('useFormContext must be used inside FormProvider');
  return ctx;
}

/** Finds a question by ID anywhere in the tree (used by child components) */
export function findQuestion(questions: Question[], id: string): Question | null {
  for (const q of questions) {
    if (q.id === id) return q;
    const found = findQuestion(q.children, id);
    if (found) return found;
  }
  return null;
}
