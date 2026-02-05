import React, { useState } from 'react';
import { Lock, Unlock, Copy, Check, QrCode, X, RotateCcw, BarChart3 } from 'lucide-react';
import { styles } from './styles';

// ============================================
// QUESTION CARD WITH RESULTS
// ============================================

export const QuestionCard = ({ question, results, onToggle, onReset }) => {
  // Bereken totaal aantal stemmen voor deze vraag
  const totalVotes = question.buttons.reduce((sum, btn) => {
    const key = `${question.id}-${btn.id}`;
    return sum + (results[key] || 0);
  }, 0);

  return (
    <div style={styles.questionCard}>
      {/* Header */}
      <div style={styles.questionCardHeader}>
        <div style={styles.questionCardTitleSection}>
          <span style={styles.questionCardNumber}>Vraag {question.id}</span>
          <h3 style={styles.questionCardTitle}>{question.question}</h3>
        </div>
        <div style={styles.questionCardActions}>
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

        <div style={styles.resultsGrid}>
          {question.buttons.map((button) => {
            const key = `${question.id}-${button.id}`;
            const votes = results[key] || 0;
            const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

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
              </div>
            );
          })}
        </div>
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
  questions, 
  results,
  onToggleQuestion,
  onResetResults 
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const joinUrl = `${window.location.origin}${window.location.pathname}?code=${sessionCode}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(joinUrl)}`;

  // Totaal aantal stemmen over alle vragen
  const totalAllVotes = Object.values(results).reduce((sum, count) => sum + count, 0);

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
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              results={results}
              onToggle={onToggleQuestion}
              onReset={onResetResults}
            />
          ))}
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