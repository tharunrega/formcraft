import { useSortable } from '@dnd-kit/sortable';
import styles from './DragHandle.module.css';

interface DragHandleProps {
  id: string;
}

export function DragHandle({ id }: DragHandleProps) {
  const { attributes, listeners } = useSortable({ id });

  return (
    <button
      className={styles.handle}
      {...attributes}
      {...listeners}
      aria-label="Drag to reorder"
      title="Drag to reorder"
      type="button"
    >
      <span className={styles.dots}>
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
