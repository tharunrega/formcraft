import { useState, useCallback, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { NumberedQuestion } from '../../types';
import { useFormContext } from '../../context/FormContext';
import { DragHandle } from '../DragHandle/DragHandle';
import styles from './QuestionCard.module.css';

const DEPTH_COLORS = ['level1', 'level2', 'level3', 'level4'] as const;

interface QuestionCardProps {
  question: NumberedQuestion;
  depth: number;
  /** Only top-level cards are sortable via dnd-kit */
  sortable?: boolean;
}

/**
 * Renders a single question card with its input controls and recursively
 * renders any child questions below it.
 */
export function QuestionCard({ question, depth, sortable = false }: QuestionCardProps) {
  const { dispatch } = useFormContext();
  const [collapsed, setCollapsed] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const depthClass = DEPTH_COLORS[Math.min(depth, DEPTH_COLORS.length - 1)];

  const sortableProps = useSortable({
    id: question.id,
    disabled: !sortable,
  });

  const style = sortable
    ? {
        transform: CSS.Transform.toString(sortableProps.transform),
        transition: sortableProps.transition,
        zIndex: sortableProps.isDragging ? 100 : undefined,
        opacity: sortableProps.isDragging ? 0.4 : 1,
      }
    : {};

  // Animate-in when first rendered
  useEffect(() => {
    setJustAdded(true);
    const t = setTimeout(() => setJustAdded(false), 400);
    return () => clearTimeout(t);
  }, []);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: 'UPDATE_QUESTION', id: question.id, field: 'text', value: e.target.value });
    },
    [dispatch, question.id]
  );

  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch({ type: 'UPDATE_QUESTION', id: question.id, field: 'type', value: e.target.value });
    },
    [dispatch, question.id]
  );

  const handleAnswerChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch({ type: 'UPDATE_QUESTION', id: question.id, field: 'answer', value: e.target.value });
    },
    [dispatch, question.id]
  );

  const handleDelete = useCallback(() => {
    dispatch({ type: 'DELETE_QUESTION', id: question.id });
  }, [dispatch, question.id]);

  const handleAddChild = useCallback(() => {
    dispatch({ type: 'ADD_QUESTION', parentId: question.id });
    setCollapsed(false);
  }, [dispatch, question.id]);

  const showAddSubQuestion =
    question.type === 'true-false' && question.answer === 'true';

  const hasChildren = question.numberedChildren.length > 0;

  return (
    <div
      ref={sortable ? sortableProps.setNodeRef : undefined}
      style={style}
      className={`${styles.wrapper} ${justAdded ? styles.entering : ''}`}
      data-depth={depth}
    >
      <div className={`${styles.card} ${styles[depthClass]}`}>
        {/* Left colored depth indicator */}
        <div className={styles.depthBar} />

        <div className={styles.cardInner}>
          {/* Header row */}
          <div className={styles.header}>
            {sortable && <DragHandle id={question.id} />}

            <span className={styles.number}>{question.number}</span>

            <input
              ref={inputRef}
              className={styles.textInput}
              type="text"
              placeholder="Enter your question..."
              value={question.text}
              onChange={handleTextChange}
              aria-label={`Question ${question.number} text`}
            />

            <select
              className={styles.typeSelect}
              value={question.type}
              onChange={handleTypeChange}
              aria-label={`Question ${question.number} type`}
            >
              <option value="short-answer">Short Answer</option>
              <option value="true-false">True / False</option>
            </select>

            {/* Collapse toggle when children exist */}
            {hasChildren && (
              <button
                className={`${styles.iconBtn} ${styles.collapseBtn} ${collapsed ? styles.collapsedRotate : ''}`}
                onClick={() => setCollapsed((c) => !c)}
                type="button"
                aria-label={collapsed ? 'Expand children' : 'Collapse children'}
                title={collapsed ? 'Expand' : 'Collapse'}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            <button
              className={`${styles.iconBtn} ${styles.deleteBtn}`}
              onClick={handleDelete}
              type="button"
              aria-label={`Delete question ${question.number}`}
              title="Delete question"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 3.5h10M5.5 3.5V2.5h3v1M5.5 6v4.5M8.5 6v4.5M3 3.5l.75 8h6.5l.75-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Answer row for true/false */}
          {question.type === 'true-false' && (
            <div className={styles.answerRow}>
              <label className={styles.answerLabel} htmlFor={`answer-${question.id}`}>
                Expected Answer:
              </label>
              <select
                id={`answer-${question.id}`}
                className={`${styles.typeSelect} ${styles.answerSelect}`}
                value={question.answer}
                onChange={handleAnswerChange}
              >
                <option value="">— Select —</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>

              {showAddSubQuestion && (
                <button
                  className={styles.addSubBtn}
                  onClick={handleAddChild}
                  type="button"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <line x1="6" y1="1" x2="6" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Add Sub-question
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Nested children */}
      {hasChildren && (
        <div
          className={`${styles.children} ${collapsed ? styles.childrenCollapsed : styles.childrenExpanded}`}
          aria-hidden={collapsed}
        >
          <div className={styles.childrenLine} />
          <div className={styles.childrenList}>
            {question.numberedChildren.map((child) => (
              <QuestionCard
                key={child.id}
                question={child}
                depth={depth + 1}
                sortable={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
