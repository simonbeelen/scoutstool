import React from 'react';
import { Lock, Check } from 'lucide-react';
import { styles } from './styles';

// ============================================
// PARTICIPANT VIEW - SIMPLE & CLEAR
// ============================================

export const ParticipantView = ({ sessionCode, questions = [], onButtonClick }) => {
  // Safety check
  if (!Array.isArray(questions)) {
    questions = [];
  }
  
  // Filter alleen actieve vragen
  const activeQuestions = questions.filter(q => q && q.active);
  const closedQuestions = questions.filter(q => q && !q.active);

  return (
    <div style={styles.participantContainer}>
      <div style={styles.participantContent}>
        {/* Header */}
        <div style={styles.participantHeaderSection}>
          <div style={styles.sessionBadgeParticipant}>
            <div style={styles.statusDotParticipant}></div>
            <span>Sessie: {sessionCode}</span>
          </div>
          <h1 style={styles.participantMainTitle}>Beantwoord de vragen</h1>
          {activeQuestions.length === 0 && (
            <p style={styles.waitingText}>
              Wachten op vragen van de presentator...
            </p>
          )}
        </div>

        {/* Active Questions */}
        {activeQuestions.map((question) => (
          <div key={question.id} style={styles.participantQuestionCard}>
            {/* Question Header */}
            <div style={styles.participantQuestionHeader}>
              <span style={styles.participantQuestionNumber}>Vraag {question.id}</span>
              <h2 style={styles.participantQuestionTitle}>{question.question}</h2>
            </div>

            {/* Answer Options */}
            <div style={styles.participantButtonsGrid}>
              {question.buttons.map((button) => (
                <button
                  key={button.id}
                  onClick={() => onButtonClick(question.id, button.id)}
                  style={{
                    ...styles.participantButton,
                    backgroundColor: button.color,
                  }}
                >
                  <div style={styles.participantButtonContent}>
                    <span style={styles.participantButtonNumber}>{button.id}</span>
                    <span style={styles.participantButtonLabel}>{button.label}</span>
                  </div>
                  <Check size={24} style={{ opacity: 0.8 }} />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Closed Questions Preview */}
        {closedQuestions.length > 0 && (
          <div style={styles.closedQuestionsSection}>
            <h3 style={styles.closedQuestionsTitle}>
              <Lock size={18} />
              Gesloten vragen
            </h3>
            <div style={styles.closedQuestionsList}>
              {closedQuestions.map((question) => (
                <div key={question.id} style={styles.closedQuestionItem}>
                  <span style={styles.closedQuestionNumber}>Vraag {question.id}</span>
                  <span style={styles.closedQuestionText}>{question.question}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Default export voor compatibiliteit
export default ParticipantView;