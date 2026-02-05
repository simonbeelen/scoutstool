import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { styles } from './styles';

// ============================================
// INTERACTIVE BUTTON COMPONENT
// ============================================

export const InteractiveButton = ({ button, onClick, clickCount, questionId }) => {
  return (
    <button
      onClick={onClick}
      disabled={!button.unlocked}
      style={{
        ...styles.interactiveButton,
        backgroundColor: button.unlocked ? button.color : '#e0e0e0',
        cursor: button.unlocked ? 'pointer' : 'not-allowed',
        opacity: button.unlocked ? 1 : 0.5,
      }}
    >
      <div style={styles.buttonIcon}>
        {button.unlocked ? <Unlock size={24} /> : <Lock size={24} />}
      </div>
      <div style={styles.buttonNumber}>{button.id}</div>
      <div style={styles.buttonText}>{button.label}</div>
      {clickCount > 0 && (
        <div style={styles.clickBadge}>{clickCount}x geklikt</div>
      )}
    </button>
  );
};

// ============================================
// PARTICIPANT VIEW COMPONENT
// ============================================

export const ParticipantView = ({ sessionCode, question, onButtonClick, clickCounts }) => {
  if (!question) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.participantHeader}>
            <div style={styles.sessionBadge}>
              <div style={styles.statusDot}></div>
              <span>Sessie: {sessionCode}</span>
            </div>
            <h1 style={styles.participantTitle}>Wachten op vraag...</h1>
            <p style={styles.participantSubtitle}>
              De host heeft nog geen vraag geselecteerd
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.participantHeader}>
          <div style={styles.sessionBadge}>
            <div style={styles.statusDot}></div>
            <span>Sessie: {sessionCode}</span>
          </div>
          
          {/* Vraag Titel */}
          <div style={styles.questionTitleCard}>
            <span style={styles.questionLabel}>Vraag {question.id}</span>
            <h1 style={styles.participantTitle}>{question.question}</h1>
          </div>
          
          <p style={styles.participantSubtitle}>
            Klik op een ontgrendelde knop om te antwoorden
          </p>
        </div>

        {/* Interactive Buttons */}
        <div style={styles.buttonGrid}>
          {question.buttons.map((button) => (
            <InteractiveButton
              key={button.id}
              button={button}
              questionId={question.id}
              onClick={() => onButtonClick(button.id)}
              clickCount={clickCounts[`${question.id}-${button.id}`] || 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};