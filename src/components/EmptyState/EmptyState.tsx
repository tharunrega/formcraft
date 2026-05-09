import styles from './EmptyState.module.css';

interface EmptyStateProps {
  onAdd: () => void;
}

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.illustration}>
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            x="10"
            y="20"
            width="100"
            height="14"
            rx="7"
            fill="var(--color-accent)"
            opacity="0.15"
          />
          <rect
            x="10"
            y="44"
            width="70"
            height="10"
            rx="5"
            fill="var(--color-accent)"
            opacity="0.1"
          />
          <rect
            x="10"
            y="64"
            width="85"
            height="10"
            rx="5"
            fill="var(--color-accent)"
            opacity="0.1"
          />
          <rect
            x="30"
            y="84"
            width="60"
            height="10"
            rx="5"
            fill="var(--color-level-2)"
            opacity="0.1"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="var(--color-accent)"
            strokeWidth="1"
            opacity="0.08"
            strokeDasharray="6 4"
          />
          <circle cx="60" cy="60" r="38" fill="var(--color-surface-raised)" />
          <path
            d="M50 55 L60 45 L70 55"
            stroke="var(--color-accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="60"
            y1="45"
            x2="60"
            y2="75"
            stroke="var(--color-accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h2 className={styles.title}>No questions yet</h2>
      <p className={styles.description}>
        Start building your form by adding your first question.
        <br />
        You can nest sub-questions, reorder, and preview the result.
      </p>
      <button className={styles.cta} onClick={onAdd} type="button">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <line
            x1="8"
            y1="2"
            x2="8"
            y2="14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="2"
            y1="8"
            x2="14"
            y2="8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Add First Question
      </button>
    </div>
  );
}
