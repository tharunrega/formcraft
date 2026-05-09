import { useState, useCallback } from 'react';
import { FormProvider, useFormContext } from './context/FormContext';
import { QuestionList } from './components/QuestionList/QuestionList';
import { SubmitModal } from './components/SubmitModal/SubmitModal';
import styles from './App.module.css';

function AppInner() {
  const {
    state,
    dispatch,
    numberedQuestions,
    restoredFromStorage,
    dismissRestoreBanner,
    clearSavedData,
  } = useFormContext();

  const [showModal, setShowModal] = useState(false);

  const handleAddQuestion = useCallback(() => {
    dispatch({ type: 'ADD_QUESTION' });
  }, [dispatch]);

  const questionCount = state.questions.length;

  return (
    <div className={styles.app}>
      {restoredFromStorage && (
        <div className={styles.banner} role="status">
          <span className={styles.bannerIcon} aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 4v3.5l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className={styles.bannerText}>Restored your previous session</span>
          <button className={styles.bannerClear} onClick={clearSavedData} type="button">
            Clear saved data
          </button>
          <button
            className={styles.bannerDismiss}
            onClick={dismissRestoreBanner}
            aria-label="Dismiss"
            type="button"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.brand}>
            <div className={styles.brandLogo} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="3" width="16" height="3" rx="1.5" fill="currentColor" opacity="0.9" />
                <rect x="2" y="8.5" width="11" height="3" rx="1.5" fill="currentColor" opacity="0.6" />
                <rect x="2" y="14" width="13" height="3" rx="1.5" fill="currentColor" opacity="0.4" />
              </svg>
            </div>
            <div>
              <h1 className={styles.title}>FormCraft</h1>
              <p className={styles.tagline}>Dynamic nested form builder</p>
            </div>
          </div>

          <div className={styles.headerActions}>
            {questionCount > 0 && (
              <span className={styles.questionCount}>
                {questionCount} question{questionCount !== 1 ? 's' : ''}
              </span>
            )}
            <button className={styles.addBtn} onClick={handleAddQuestion} type="button">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Add Question
            </button>
            {questionCount > 0 && (
              <button className={styles.submitBtn} onClick={() => setShowModal(true)} type="button">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Preview &amp; Submit
              </button>
            )}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <QuestionList />
      </main>

      <footer className={styles.footer}>
        <span>FormCraft — built with React + Vite + dnd-kit</span>
        {questionCount > 0 && (
          <button className={styles.clearBtn} onClick={clearSavedData} type="button">
            Clear all
          </button>
        )}
      </footer>

      {showModal && (
        <SubmitModal
          questions={numberedQuestions}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <FormProvider>
      <AppInner />
    </FormProvider>
  );
}
