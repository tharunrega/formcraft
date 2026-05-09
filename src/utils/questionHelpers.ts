import { v4 as uuidv4 } from 'uuid';
import type { Question, FormState, NumberedQuestion } from '../types';

/** Creates a fresh question with default values */
export function createQuestion(): Question {
  return {
    id: uuidv4(),
    text: '',
    type: 'short-answer',
    answer: '',
    children: [],
  };
}

/** Recursively adds a new child question under the given parentId */
export function addChildQuestion(questions: Question[], parentId: string): Question[] {
  return questions.map((q) => {
    if (q.id === parentId) {
      return { ...q, children: [...q.children, createQuestion()] };
    }
    return { ...q, children: addChildQuestion(q.children, parentId) };
  });
}

/** Recursively deletes a question and all its descendants */
export function deleteQuestion(questions: Question[], id: string): Question[] {
  return questions
    .filter((q) => q.id !== id)
    .map((q) => ({ ...q, children: deleteQuestion(q.children, id) }));
}

/** Recursively updates a field on a specific question */
export function updateQuestion(
  questions: Question[],
  id: string,
  field: 'text' | 'type' | 'answer',
  value: string
): Question[] {
  return questions.map((q) => {
    if (q.id === id) {
      const updated = { ...q, [field]: value };
      // Reset answer and children when switching away from true-false
      if (field === 'type' && value !== 'true-false') {
        updated.answer = '';
        updated.children = [];
      }
      // Remove children when answer changes away from 'true'
      if (field === 'answer' && value !== 'true') {
        updated.children = [];
      }
      return updated;
    }
    return { ...q, children: updateQuestion(q.children, id, field, value) };
  });
}

/** Reorders top-level questions using active/over IDs from dnd-kit */
export function reorderQuestions(
  questions: Question[],
  activeId: string,
  overId: string
): Question[] {
  const oldIndex = questions.findIndex((q) => q.id === activeId);
  const newIndex = questions.findIndex((q) => q.id === overId);
  if (oldIndex === -1 || newIndex === -1) return questions;

  const result = [...questions];
  const [moved] = result.splice(oldIndex, 1);
  result.splice(newIndex, 0, moved);
  return result;
}

/** Recursively annotates questions with hierarchical numbering (Q1, Q1.1, etc.) */
export function numberQuestions(
  questions: Question[],
  prefix = ''
): NumberedQuestion[] {
  return questions.map((q, index) => {
    const num = prefix ? `${prefix}.${index + 1}` : `Q${index + 1}`;
    return {
      ...q,
      number: num,
      numberedChildren: numberQuestions(q.children, num),
    };
  });
}

/** Counts the total number of questions recursively */
export function countQuestions(questions: Question[]): number {
  return questions.reduce(
    (acc, q) => acc + 1 + countQuestions(q.children),
    0
  );
}

/** Serializes form state for localStorage */
export function serializeState(state: FormState): string {
  return JSON.stringify(state);
}

/** Deserializes form state from localStorage */
export function deserializeState(raw: string): FormState | null {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.questions)) return parsed as FormState;
    return null;
  } catch {
    return null;
  }
}
