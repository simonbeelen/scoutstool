import React from 'react';
import { Lock, Check } from 'lucide-react';
import { styles } from './styles';

// ============================================
// PARTICIPANT VIEW - SIMPLE & CLEAR
// ============================================

export const ParticipantView = ({ sessionCode, questions = [], onButtonClick, userVotes = {} }) => {
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
              {question.buttons.map((button) => {
                const isVoted = userVotes[question.id] === button.id;
                return (
                  <button
                    key={button.id}
                    onClick={() => onButtonClick(question.id, button.id)}
                    style={{
                      ...styles.participantButton,
                      backgroundColor: button.color,
                      border: isVoted ? '3px solid #fff' : 'none',
                      boxShadow: isVoted ? `0 0 0 3px #000, 0 4px 12px rgba(0,0,0,0.3)` : '0 2px 4px rgba(0,0,0,0.1)',
                      transform: isVoted ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={styles.participantButtonContent}>
                      <span style={styles.participantButtonNumber}>{button.id}</span>
                      <span style={styles.participantButtonLabel}>{button.label}</span>
                    </div>
                    {isVoted && <Check size={24} style={{ fontWeight: 'bold', color: '#fff' }} />}
                  </button>
                );
              })}
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