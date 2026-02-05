import React, { useState } from 'react';
import { Lock, Check } from 'lucide-react';
import { styles } from './styles';

// ============================================
// PARTICIPANT VIEW - ALL QUESTION TYPES
// ============================================

export const ParticipantView = ({ sessionCode, participantName = '', questions = [], onButtonClick, userVotes = {}, onLogout }) => {
  // Safety check
  if (!Array.isArray(questions)) {
    questions = [];
  }

  const [currentRanking, setCurrentRanking] = useState({});

  // Filter alleen actieve vragen
  const activeQuestions = questions.filter(q => q && q.active);
  const closedQuestions = questions.filter(q => q && !q.active);

  // Ranking state per question
  const initRankingState = (question) => {
    if (!currentRanking[question.id]) {
      setCurrentRanking(prev => ({
        ...prev,
        [question.id]: [...(question.items || [])],
      }));
    }
  };

  const handleRankMove = (questionId, fromIndex, toIndex) => {
    const ranking = currentRanking[questionId] || [];
    const newRanking = [...ranking];
    const [movedItem] = newRanking.splice(fromIndex, 1);
    newRanking.splice(toIndex, 0, movedItem);
    setCurrentRanking(prev => ({
      ...prev,
      [questionId]: newRanking,
    }));
  };

  const handleRankingSubmit = (questionId) => {
    const ranking = currentRanking[questionId] || [];
    onButtonClick(questionId, 'ranking', ranking);
  };

  return (
    <div style={styles.participantContainer}>
      <div style={styles.participantContent}>
        {/* Header */}
        <div style={styles.participantHeaderSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div>
              <div style={styles.sessionBadgeParticipant}>
                <div style={styles.statusDotParticipant}></div>
                <span>Sessie: {sessionCode} • {participantName}</span>
              </div>
              <h1 style={styles.participantMainTitle}>Beantwoord de vragen</h1>
              {activeQuestions.length === 0 && (
                <p style={styles.waitingText}>
                  Wachten op vragen van de presentator...
                </p>
              )}
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  height: 'fit-content',
                }}
              >
                Terug
              </button>
            )}
          </div>
        </div>

        {/* Active Questions */}
        {activeQuestions.map((question) => {
          const type = question.type || 'multipleChoice';

          return (
            <div key={question.id} style={styles.participantQuestionCard}>
              {/* Question Header */}
              <div style={styles.participantQuestionHeader}>
                <span style={styles.participantQuestionNumber}>Vraag {question.id}</span>
                <h2 style={styles.participantQuestionTitle}>{question.question}</h2>
              </div>

              {/* Multiple Choice & True/False */}
              {(type === 'multipleChoice' || type === 'trueFalse') && (
                <div style={styles.participantButtonsGrid}>
                  {(question.buttons || []).map((button) => {
                    const isVoted = userVotes[question.id] === button.id;
                    const hasAlreadyVoted = userVotes[question.id] !== undefined && !isVoted;
                    return (
                      <button
                        key={button.id}
                        onClick={() => onButtonClick(question.id, button.id)}
                        disabled={hasAlreadyVoted}
                        style={{
                          ...styles.participantButton,
                          backgroundColor: button.color,
                          border: isVoted ? '3px solid #fff' : 'none',
                          boxShadow: isVoted ? `0 0 0 3px #000, 0 4px 12px rgba(0,0,0,0.3)` : '0 2px 4px rgba(0,0,0,0.1)',
                          transform: isVoted ? 'scale(1.05)' : 'scale(1)',
                          transition: 'all 0.2s',
                          opacity: hasAlreadyVoted ? 0.5 : 1,
                          cursor: hasAlreadyVoted ? 'not-allowed' : 'pointer',
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
              )}

              {/* Ranking */}
              {type === 'ranking' && (
                <div style={{ marginTop: '12px' }}>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 12px 0' }}>
                    Sleep de items in de juiste volgorde
                  </p>
                  {(() => {
                    initRankingState(question);
                    const ranking = currentRanking[question.id] || [];
                    return (
                      <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                          {ranking.map((item, index) => (
                            <div
                              key={`${item}-${index}`}
                              style={{
                                padding: '12px',
                                backgroundColor: '#f3f4f6',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <span style={{ fontWeight: '600' }}>#{index + 1}: {item}</span>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                {index > 0 && (
                                  <button
                                    onClick={() => handleRankMove(question.id, index, index - 1)}
                                    style={{
                                      padding: '4px 8px',
                                      backgroundColor: '#3b82f6',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                    }}
                                  >
                                    ↑
                                  </button>
                                )}
                                {index < ranking.length - 1 && (
                                  <button
                                    onClick={() => handleRankMove(question.id, index, index + 1)}
                                    style={{
                                      padding: '4px 8px',
                                      backgroundColor: '#3b82f6',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                    }}
                                  >
                                    ↓
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => handleRankingSubmit(question.id)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          Rangschikking opslaan
                        </button>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          );
        })}

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