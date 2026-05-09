export type QuestionType = 'short-answer' | 'true-false';
export type TrueFalseAnswer = 'true' | 'false' | '';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  answer: TrueFalseAnswer;
  children: Question[];
}

export interface FormState {
  questions: Question[];
  version: number;
}

export type FormAction =
  | { type: 'ADD_QUESTION'; parentId?: string }
  | { type: 'DELETE_QUESTION'; id: string }
  | { type: 'UPDATE_QUESTION'; id: string; field: 'text' | 'type' | 'answer'; value: string }
  | { type: 'REORDER_QUESTIONS'; activeId: string; overId: string }
  | { type: 'LOAD_STATE'; state: FormState }
  | { type: 'CLEAR_STATE' };

export interface NumberedQuestion extends Question {
  number: string;
  numberedChildren: NumberedQuestion[];
}
