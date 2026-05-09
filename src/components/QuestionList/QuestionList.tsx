import { useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';

import { useFormContext } from '../../context/FormContext';
import { QuestionCard } from '../QuestionCard/QuestionCard';
import { EmptyState } from '../EmptyState/EmptyState';
import styles from './QuestionList.module.css';

export function QuestionList() {
  const { state, dispatch, numberedQuestions } = useFormContext();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        dispatch({
          type: 'REORDER_QUESTIONS',
          activeId: String(active.id),
          overId: String(over.id),
        });
      }
    },
    [dispatch]
  );

  const handleAddQuestion = useCallback(() => {
    dispatch({ type: 'ADD_QUESTION' });
  }, [dispatch]);

  if (state.questions.length === 0) {
    return <EmptyState onAdd={handleAddQuestion} />;
  }

  const topLevelIds = state.questions.map((q) => q.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={topLevelIds} strategy={verticalListSortingStrategy}>
        <div className={styles.list}>
          {numberedQuestions.map((q) => (
            <QuestionCard key={q.id} question={q} depth={0} sortable />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
