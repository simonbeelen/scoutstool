import React, { useState } from 'react';
import { Lock, Unlock, Copy, Check, QrCode, X, RotateCcw, BarChart3, Users } from 'lucide-react';
import { styles } from './styles';

// ============================================
// QUESTION CARD WITH RESULTS
// ============================================

export const QuestionCard = ({ question, results, responses, onToggle, onReset, onToggleShowVoters }) => {
  // Safety check
  if (!question) return null;
  if (!results) results = {};
  if (!responses) responses = {};

  const type = question.type || 'multipleChoice';
  
  // Bereken totaal aantal stemmen voor deze vraag
  let totalVotes = 0;
  if (type === 'multipleChoice' || type === 'trueFalse') {
    totalVotes = (question.buttons || []).reduce((sum, btn) => {
      const key = `${question.id}-${btn.id}`;
      return sum + (results[key] || 0);
    }, 0);
  } else if (type === 'dragDrop' || type === 'ranking') {
    totalVotes = responses[question.id] ? Object.values(responses[question.id]).flat().length : 0;
  }

  return (
    <div style={styles.questionCard}>
      {/* Header */}
      <div style={styles.questionCardHeader}>
        <div style={styles.questionCardTitleSection}>
          <span style={styles.questionCardNumber}>Vraag {question.id}</span>
          <h3 style={styles.questionCardTitle}>{question.question}</h3>
          <span style={{
            fontSize: '12px',
            color: '#6b7280',
            backgroundColor: '#f3f4f6',
            padding: '4px 8px',
            borderRadius: '4px',
            marginLeft: '8px',
          }}>
            {type === 'multipleChoice' && 'Meerkeuze'}
            {type === 'dragDrop' && 'Sleep & Drop'}
            {type === 'trueFalse' && 'Waar/Onwaar'}
            {type === 'ranking' && 'Rangschikken'}
          </span>
        </div>
        <div style={styles.questionCardActions}>
          <button
            onClick={() => onToggleShowVoters(question.id)}
            style={{
              ...styles.showVotersButton,
              backgroundColor: question.showVoters ? '#2563eb' : '#e5e7eb',
              color: question.showVoters ? 'white' : '#374151',
            }}
            title="Toon/verberg namen"
          >
            <Users size={16} />
            <span>{question.showVoters ? 'Namen aan' : 'Namen uit'}</span>
          </button>
          <button
            onClick={() => onToggle(question.id)}
            style={{
              ...styles.toggleQuestionButton,
              backgroundColor: question.active ? '#10b981' : '#ef4444',
            }}
          >
            {question.active ? (
              <>
                <Unlock size={18} />
                <span>Open</span>
              </>
            ) : (
              <>
                <Lock size={18} />
                <span>Gesloten</span>
              </>
            )}
          </button>
          {totalVotes > 0 && (
            <button
              onClick={() => onReset(question.id)}
              style={styles.resetButton}
              title="Reset resultaten"
            >
              <RotateCcw size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div style={styles.resultsSection}>
        <div style={styles.resultsSummary}>
          <BarChart3 size={20} style={{ color: '#666' }} />
          <span style={styles.totalVotesText}>Totaal: {totalVotes} stemmen</span>
        </div>

        {/* Multiple Choice & True/False */}
        {(type === 'multipleChoice' || type === 'trueFalse') && (
          <div style={styles.resultsGrid}>
            {(question.buttons || []).map((button) => {
              const key = `${question.id}-${button.id}`;
              const votes = results[key] || 0;
              const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
              const names = (responses[question.id] && responses[question.id][button.id]) || [];

              return (
                <div key={button.id} style={styles.resultItem}>
                  <div style={styles.resultItemHeader}>
                    <div style={styles.resultItemLabel}>
                      <div 
                        style={{
                          ...styles.colorDot,
                          backgroundColor: button.color,
                        }}
                      />
                      <span style={styles.resultItemText}>{button.label}</span>
                    </div>
                    <span style={styles.resultItemCount}>{votes} ({percentage}%)</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${percentage}%`,
                        backgroundColor: button.color,
                      }}
                    />
                  </div>
                  {question.showVoters && names.length > 0 && (
                    <div style={styles.resultVoters}>
                      {names.map((name, index) => (
                        <span key={`${button.id}-${index}`} style={styles.voterTag}>
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Drag & Drop Results */}
        {type === 'dragDrop' && (
          <div style={{ padding: '12px 0' }}>
            {totalVotes === 0 ? (
              <div style={{ color: '#9ca3af', fontSize: '14px' }}>Nog geen antwoorden</div>
            ) : (
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Correct: {question.correctAnswer}
                </div>
                {question.items.map((item) => {
                  const names = (responses[question.id] && responses[question.id][item]) || [];
                  const isCorrect = item === question.correctAnswer;
                  return (
                    <div key={item} style={{
                      padding: '10px',
                      marginBottom: '8px',
                      backgroundColor: isCorrect ? '#d1fae5' : '#fee2e2',
                      borderLeft: `4px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
                      borderRadius: '4px',
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        {item} {isCorrect && '✓'}
                      </div>
                      {question.showVoters && names.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {names.map((name, index) => (
                            <span key={`${item}-${index}`} style={styles.voterTag}>
                              {name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Ranking Results */}
        {type === 'ranking' && (
          <div style={{ padding: '12px 0' }}>
            {totalVotes === 0 ? (
              <div style={{ color: '#9ca3af', fontSize: '14px' }}>Nog geen antwoorden</div>
            ) : (
              <div>
                {question.items.map((item, idx) => {
                  const names = (responses[question.id] && responses[question.id][`rank-${idx}`]) || [];
                  return (
                    <div key={`rank-${idx}`} style={{
                      padding: '10px',
                      marginBottom: '8px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '4px',
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        #{idx + 1}: {item} ({names.length})
                      </div>
                      {question.showVoters && names.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {names.map((name, index) => (
                            <span key={`${item}-${index}`} style={styles.voterTag}>
                              {name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Badge */}
      {question.active && (
        <div style={styles.activeBadge}>
          <div style={styles.pulseDot}></div>
          <span>Deelnemers kunnen nu antwoorden</span>
        </div>
      )}
    </div>
  );
};

// ============================================
// HOST DASHBOARD COMPONENT
// ============================================

export const HostDashboard = ({ 
  sessionCode, 
  questions = [], 
  results = {},
  responses = {},
  onToggleQuestion,
  onResetResults,
  onAddQuestion,
  onSetAllQuestionsActive,
  onToggleShowVoters 
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [formTouched, setFormTouched] = useState(false);
  const [openOnAdd, setOpenOnAdd] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [questionType, setQuestionType] = useState('multipleChoice');
  const [dragDropCorrect, setDragDropCorrect] = useState('');
  const [dragDropWrong, setDragDropWrong] = useState(['', '', '']);
  const [trueFalseAnswer, setTrueFalseAnswer] = useState('true');
  const [rankingItems, setRankingItems] = useState(['', '', '', '']);

  const copyCode = () => {
    navigator.clipboard.writeText(sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const joinUrl = `${window.location.origin}${window.location.pathname}?code=${sessionCode}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(joinUrl)}`;

  // Totaal aantal stemmen over alle vragen (safe)
  const totalAllVotes = results ? Object.values(results).reduce((sum, count) => sum + count, 0) : 0;
  const anyActive = questions.some((q) => q && q.active);
  const anyClosed = questions.some((q) => q && !q.active);

  const handleOptionChange = (index, value) => {
    setNewOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)));
  };

  const addOptionField = () => {
    setNewOptions((prev) => [...prev, '']);
  };

  const removeOptionField = (index) => {
    if (newOptions.length > 2) {
      setNewOptions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const canAddQuestion = () => {
    const hasQuestion = newQuestionText.trim().length > 0;
    
    if (questionType === 'multipleChoice') {
      const validOptions = newOptions.filter((opt) => opt.trim().length > 0);
      return hasQuestion && validOptions.length >= 2;
    } else if (questionType === 'dragDrop') {
      const validWrong = dragDropWrong.filter((opt) => opt.trim().length > 0);
      return hasQuestion && dragDropCorrect.trim().length > 0 && validWrong.length >= 1;
    } else if (questionType === 'trueFalse') {
      return hasQuestion;
    } else if (questionType === 'ranking') {
      const validItems = rankingItems.filter((opt) => opt.trim().length > 0);
      return hasQuestion && validItems.length >= 2;
    }
    return false;
  };

  const handleAddQuestion = () => {
    setFormTouched(true);
    if (!canAddQuestion()) return;
    if (onAddQuestion) {
      onAddQuestion(newQuestionText, newOptions, openOnAdd, {
        type: questionType,
        dragDropCorrect,
        dragDropWrong,
        trueFalseAnswer,
        rankingItems,
      });
    }
    setNewQuestionText('');
    setNewOptions(['', '', '', '']);
    setQuestionType('multipleChoice');
    setDragDropCorrect('');
    setDragDropWrong(['', '', '']);
    setTrueFalseAnswer('true');
    setRankingItems(['', '', '', '']);
    setFormTouched(false);
  };

  const buildParticipantSummary = () => {
    const participants = {};
    
    // Iterate through responses object directly
    Object.keys(responses).forEach((questionId) => {
      const questionIdNum = parseInt(questionId);
      const question = questions.find(q => q.id === questionIdNum);
      if (!question) return;
      
      const type = question.type || 'multipleChoice';
      const buttonResponses = responses[questionId];
      
      // For multipleChoice and trueFalse - look up button labels
      if (type === 'multipleChoice' || type === 'trueFalse') {
        if (!question.buttons) return; // Safety check
        
        Object.keys(buttonResponses).forEach((buttonId) => {
          const buttonIdNum = parseInt(buttonId);
          const button = question.buttons.find(b => b.id === buttonIdNum);
          if (!button) return;
          
          const names = buttonResponses[buttonId] || [];
          names.forEach((name) => {
            if (!participants[name]) {
              participants[name] = [];
            }
            participants[name].push({
              questionId: questionIdNum,
              questionText: question.question,
              answerLabel: button.label,
            });
          });
        });
      } 
      // For dragDrop - answerLabel is the item name
      else if (type === 'dragDrop') {
        Object.keys(buttonResponses).forEach((itemName) => {
          const names = buttonResponses[itemName] || [];
          names.forEach((name) => {
            if (!participants[name]) {
              participants[name] = [];
            }
            participants[name].push({
              questionId: questionIdNum,
              questionText: question.question,
              answerLabel: itemName,
            });
          });
        });
      }
      // For ranking - show items in order with rank numbers
      else if (type === 'ranking') {
        // Get unique participant names who participated in this ranking
        const rankingParticipants = new Set();
        const participantRankings = {};
        
        Object.keys(buttonResponses).forEach((rankKey) => {
          // rankKey format: "itemName__rank1", "itemName__rank2", etc
          const match = rankKey.match(/^(.+)__rank(\d+)$/);
          if (match) {
            const itemName = match[1];
            const rankNum = match[2];
            const names = buttonResponses[rankKey] || [];
            
            names.forEach((name) => {
              rankingParticipants.add(name);
              if (!participantRankings[name]) {
                participantRankings[name] = {};
              }
              participantRankings[name][rankNum] = itemName;
            });
          }
        });
        
        rankingParticipants.forEach((name) => {
          if (!participants[name]) {
            participants[name] = [];
          }
          
          // Build ranking string like "1. item A, 2. item B, 3. item C"
          const rankings = participantRankings[name];
          const rankingItems = [];
          const sortedRanks = Object.keys(rankings).sort((a, b) => parseInt(a) - parseInt(b));
          
          sortedRanks.forEach((rank) => {
            rankingItems.push(`${rank}. ${rankings[rank]}`);
          });
          
          participants[name].push({
            questionId: questionIdNum,
            questionText: question.question,
            answerLabel: rankingItems.join(', '),
          });
        });
      }
    });
    
    return participants;
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.hostHeader}>
          <div style={styles.hostHeaderLeft}>
            <h1 style={styles.hostTitle}>Live Resultaten</h1>
            <p style={styles.hostSubtitle}>Beheer vragen en bekijk antwoorden live</p>
          </div>
          <div style={styles.hostHeaderRight}>
            <div style={styles.bulkActions}>
              <button
                onClick={() => onSetAllQuestionsActive && onSetAllQuestionsActive(true)}
                style={{
                  ...styles.bulkActionButton,
                  backgroundColor: '#10b981',
                  opacity: anyClosed ? 1 : 0.6,
                }}
                disabled={!anyClosed}
              >
                Open alle vragen
              </button>
              <button
                onClick={() => onSetAllQuestionsActive && onSetAllQuestionsActive(false)}
                style={{
                  ...styles.bulkActionButton,
                  backgroundColor: '#ef4444',
                  opacity: anyActive ? 1 : 0.6,
                }}
                disabled={!anyActive}
              >
                Sluit alle vragen
              </button>
            </div>
            <div style={styles.statsBox}>
              <span style={styles.statsLabel}>Totaal stemmen</span>
              <span style={styles.statsNumber}>{totalAllVotes}</span>
            </div>
            <div style={styles.codeBox}>
              <span style={styles.codeLabel}>Sessie Code</span>
              <div style={styles.codeDisplay}>
                <span style={styles.codeText}>{sessionCode}</span>
                <button onClick={copyCode} style={styles.iconButton}>
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
                <button onClick={() => setShowQR(true)} style={styles.iconButton}>
                  <QrCode size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Questions with Results */}
        <div style={styles.questionsContainer}>
          {/* New Question Form */}
          <div style={styles.newQuestionCard}>
            <div style={styles.newQuestionHeader}>
              <h2 style={styles.newQuestionTitle}>Nieuwe vraag opstellen</h2>
              <p style={styles.newQuestionSubtitle}>Kies het vraagtype en vul de details in</p>
            </div>

            {/* Vraagtype selector */}
            <div style={styles.formRow}>
              <label style={styles.formLabel}>Vraagtype</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                style={{
                  ...styles.textInput,
                  padding: '10px 12px',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                <option value="multipleChoice">Meerkeuze</option>
                <option value="dragDrop">Sleep & Drop</option>
                <option value="trueFalse">Waar/Onwaar</option>
                <option value="ranking">Rangschikken</option>
              </select>
            </div>

            {/* Vraag */}
            <div style={styles.formRow}>
              <label style={styles.formLabel}>Vraag</label>
              <input
                type="text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Voer je vraag in..."
                style={styles.textInput}
              />
            </div>

            {/* Meerkeuze */}
            {questionType === 'multipleChoice' && (
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Antwoordopties</label>
                <div style={styles.optionsGrid}>
                  {newOptions.map((option, index) => (
                    <div key={`option-${index}`} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Optie ${index + 1}`}
                        style={{ flex: 1, ...styles.smallInput }}
                      />
                      {newOptions.length > 2 && (
                        <button
                          onClick={() => removeOptionField(index)}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          Verwijder
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addOptionField}
                  style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  + Optie toevoegen
                </button>
                {formTouched && !canAddQuestion() && (
                  <span style={styles.helperText}>Voer minstens 2 opties in.</span>
                )}
              </div>
            )}

            {/* Sleep & Drop */}
            {questionType === 'dragDrop' && (
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Correct antwoord</label>
                <input
                  type="text"
                  value={dragDropCorrect}
                  onChange={(e) => setDragDropCorrect(e.target.value)}
                  placeholder="Bijv. Correct antwoord"
                  style={styles.textInput}
                />
                <label style={{ ...styles.formLabel, marginTop: '12px' }}>Foute antwoorden</label>
                <div style={styles.optionsGrid}>
                  {dragDropWrong.map((wrong, index) => (
                    <input
                      key={`wrong-${index}`}
                      type="text"
                      value={wrong}
                      onChange={(e) => setDragDropWrong((prev) => prev.map((w, i) => (i === index ? e.target.value : w)))}
                      placeholder={`Fout antwoord ${index + 1}`}
                      style={styles.smallInput}
                    />
                  ))}
                </div>
                {formTouched && !canAddQuestion() && (
                  <span style={styles.helperText}>Voer het correcte antwoord en minstens 1 fout antwoord in.</span>
                )}
              </div>
            )}

            {/* Waar/Onwaar */}
            {questionType === 'trueFalse' && (
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Correct antwoord</label>
                <select
                  value={trueFalseAnswer}
                  onChange={(e) => setTrueFalseAnswer(e.target.value)}
                  style={{
                    ...styles.textInput,
                    padding: '10px 12px',
                    fontSize: '14px',
                  }}
                >
                  <option value="true">Waar</option>
                  <option value="false">Onwaar</option>
                </select>
              </div>
            )}

            {/* Rangschikken */}
            {questionType === 'ranking' && (
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Items om te rangschikken</label>
                <div style={styles.optionsGrid}>
                  {rankingItems.map((item, index) => (
                    <input
                      key={`ranking-${index}`}
                      type="text"
                      value={item}
                      onChange={(e) => setRankingItems((prev) => prev.map((it, i) => (i === index ? e.target.value : it)))}
                      placeholder={`Item ${index + 1}`}
                      style={styles.smallInput}
                    />
                  ))}
                </div>
                {formTouched && !canAddQuestion() && (
                  <span style={styles.helperText}>Voer minstens 2 items in.</span>
                )}
              </div>
            )}

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={openOnAdd}
                onChange={(e) => setOpenOnAdd(e.target.checked)}
              />
              <span>Open vraag meteen voor deelnemers</span>
            </label>
            <button
              onClick={handleAddQuestion}
              style={{
                ...styles.addButton,
                opacity: canAddQuestion() ? 1 : 0.6,
              }}
            >
              Vraag toevoegen
            </button>
          </div>
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              results={results}
              responses={responses}
              onToggle={onToggleQuestion}
              onReset={onResetResults}
              onToggleShowVoters={onToggleShowVoters}
            />
          ))}

          {/* Post-presentation summary */}
          <div style={styles.summaryCard}>
            <div style={styles.summaryHeader}>
              <h2 style={styles.summaryTitle}>Overzicht na presentatie</h2>
              <button
                onClick={() => setShowSummary((prev) => !prev)}
                style={styles.summaryToggle}
              >
                {showSummary ? 'Verberg overzicht' : 'Toon overzicht'}
              </button>
            </div>
            {showSummary && (
              <div style={styles.summaryContent}>
                {Object.entries(buildParticipantSummary()).length === 0 && (
                  <div style={styles.summaryEmpty}>Nog geen stemmen binnen.</div>
                )}
                {Object.entries(buildParticipantSummary()).map(([name, votes]) => (
                  <div key={`summary-${name}`} style={styles.summaryQuestion}>
                    <div style={styles.summaryQuestionTitle}>{name}</div>
                    <div style={styles.summaryAnswers}>
                      {votes.map((vote, index) => (
                        <div key={`${name}-${index}`} style={styles.summaryAnswerRow}>
                          <span style={styles.summaryAnswerLabel}>
                            Vraag {vote.questionId}: {vote.questionText}
                          </span>
                          <div style={styles.summaryAnswerNames}>
                            <span style={styles.voterTag}>{vote.answerLabel}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div style={styles.modal} onClick={() => setShowQR(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Scan QR Code</h2>
              <button onClick={() => setShowQR(false)} style={styles.closeButton}>
                <X size={24} />
              </button>
            </div>
            <div style={styles.qrContainer}>
              <img src={qrCodeUrl} alt="QR Code" style={styles.qrImage} />
              <p style={styles.qrText}>Scan om automatisch te joinen</p>
              <div style={styles.qrCodeBox}>
                <span style={styles.qrCodeText}>{sessionCode}</span>
              </div>
              <p style={styles.qrSubText}>Of voer de code handmatig in</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Default export voor compatibiliteit
export default HostDashboard;