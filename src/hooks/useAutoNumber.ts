import { useMemo } from 'react';
import type { Question, NumberedQuestion } from '../types';
import { numberQuestions } from '../utils/questionHelpers';

/**
 * Custom hook that returns a flat map of question ID → display number
 * for quick lookup in any component without needing full tree traversal.
 */
export function useAutoNumber(questions: Question[]): Map<string, string> {
  return useMemo(() => {
    const map = new Map<string, string>();

    function walk(items: NumberedQuestion[]) {
      for (const q of items) {
        map.set(q.id, q.number);
        walk(q.numberedChildren);
      }
    }

    walk(numberQuestions(questions));
    return map;
  }, [questions]);
}
