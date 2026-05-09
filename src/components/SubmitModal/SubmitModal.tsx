import { useEffect, useRef, useCallback } from 'react';
import type { NumberedQuestion } from '../../types';
import styles from './SubmitModal.module.css';

interface SubmitModalProps {
  questions: NumberedQuestion[];
  onClose: () => void;
}

/**
 * Full-screen modal that displays a hierarchical tree view of all questions
 * with connecting lines between parent/child nodes.
 */
export function SubmitModal({ questions, onClose }: SubmitModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose]
  );

  const totalCount = countAll(questions);

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Form submission preview"
    >
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 5h12M3 9h8M3 13h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h2 className={styles.title}>Form Preview</h2>
              <p className={styles.subtitle}>
                {totalCount} question{totalCount !== 1 ? 's' : ''} across{' '}
                {questions.length} top-level entr{questions.length !== 1 ? 'ies' : 'y'}
              </p>
            </div>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close preview"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable tree body */}
        <div className={styles.body}>
          {questions.length === 0 ? (
            <div className={styles.empty}>
              <p>No questions to display.</p>
            </div>
          ) : (
            <ul className={styles.tree} role="tree">
              {questions.map((q) => (
                <TreeNode
                  key={q.id}
                  question={q}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.footerNote}>Press Esc or click outside to close</span>
          <button className={styles.doneBtn} onClick={onClose} type="button">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

interface TreeNodeProps {
  question: NumberedQuestion;
  depth?: number;
}

function TreeNode({ question, depth = 0 }: TreeNodeProps) {
  const hasChildren = question.numberedChildren.length > 0;

  return (
    <li className={styles.treeNode} role="treeitem" aria-expanded={hasChildren}>
      <div className={styles.nodeRow}>
        {/* Connector lines handled via CSS pseudo-elements on .treeNode */}
        <div className={styles.nodeContent}>
          <span className={styles.nodeNumber}>{question.number}</span>
          <span className={styles.nodeText}>
            {question.text || <em className={styles.emptyText}>Untitled question</em>}
          </span>
          <span className={`${styles.typeBadge} ${styles[`type_${question.type.replace('-', '_')}`]}`}>
            {question.type === 'true-false' ? 'True/False' : 'Short Answer'}
          </span>
          {question.type === 'true-false' && question.answer && (
            <span className={`${styles.answerBadge} ${question.answer === 'true' ? styles.answerTrue : styles.answerFalse}`}>
              {question.answer === 'true' ? '✓ True' : '✗ False'}
            </span>
          )}
        </div>
      </div>

      {hasChildren && (
        <ul className={styles.subtree} role="group">
          {question.numberedChildren.map((child) => (
            <TreeNode
              key={child.id}
              question={child}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function countAll(questions: NumberedQuestion[]): number {
  return questions.reduce(
    (sum, q) => sum + 1 + countAll(q.numberedChildren),
    0
  );
}
