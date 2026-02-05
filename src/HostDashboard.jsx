import React, { useState } from 'react';
import { Lock, Unlock, Copy, Check, QrCode, X, ChevronRight } from 'lucide-react';
import { styles } from './styles';

// ============================================
// BUTTON CONTROL COMPONENT
// ============================================

export const ButtonControl = ({ button, onToggle }) => {
  return (
    <div style={styles.buttonControl}>
      <div style={styles.buttonControlHeader}>
        <h3 style={styles.buttonLabel}>{button.label}</h3>
        {button.unlocked ? (
          <Unlock size={20} style={{ color: button.color }} />
        ) : (
          <Lock size={20} style={{ color: '#999' }} />
        )}
      </div>
      <button
        onClick={onToggle}
        style={{
          ...styles.toggleButton,
          backgroundColor: button.unlocked ? button.color : '#ccc',
        }}
      >
        {button.unlocked ? 'Vergrendelen' : 'Ontgrendelen'}
      </button>
    </div>
  );
};

// ============================================
// QUESTION SELECTOR COMPONENT
// ============================================

export const QuestionSelector = ({ questions, activeQuestionId, onSelectQuestion }) => {
  return (
    <div style={styles.questionSelector}>
      <h3 style={styles.selectorTitle}>Selecteer Vraag:</h3>
      <div style={styles.questionList}>
        {questions.map((question) => (
          <button
            key={question.id}
            onClick={() => onSelectQuestion(question.id)}
            style={{
              ...styles.questionButton,
              backgroundColor: question.id === activeQuestionId ? '#2563eb' : 'white',
              color: question.id === activeQuestionId ? 'white' : '#333',
              border: question.id === activeQuestionId ? '2px solid #2563eb' : '2px solid #ddd',
            }}
          >
            <div style={styles.questionButtonContent}>
              <span style={styles.questionNumber}>Vraag {question.id}</span>
              <span style={styles.questionText}>{question.question}</span>
            </div>
            {question.id === activeQuestionId && (
              <ChevronRight size={20} style={{ marginLeft: '10px' }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================
// HOST DASHBOARD COMPONENT
// ============================================

export const HostDashboard = ({ 
  sessionCode, 
  questions, 
  activeQuestionId, 
  onSelectQuestion,
  onToggleButton 
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Genereer QR code URL met volledige join link
  const joinUrl = `${window.location.origin}${window.location.pathname}?code=${sessionCode}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(joinUrl)}`;

  // Haal actieve vraag op
  const activeQuestion = questions.find(q => q.id === activeQuestionId);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>Host Dashboard</h1>
            <p style={styles.pageSubtitle}>Beheer je vragen en knoppen</p>
          </div>
          <div style={styles.codeContainer}>
            <span style={styles.label}>Sessie Code:</span>
            <div style={styles.codeDisplay}>
              <span style={styles.code}>{sessionCode}</span>
              <button onClick={copyCode} style={styles.iconButton}>
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
              <button onClick={() => setShowQR(true)} style={styles.iconButton} title="Toon QR Code">
                <QrCode size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Question Selector */}
        <QuestionSelector 
          questions={questions}
          activeQuestionId={activeQuestionId}
          onSelectQuestion={onSelectQuestion}
        />

        {/* Active Question Display */}
        <div style={styles.activeQuestionCard}>
          <h2 style={styles.activeQuestionTitle}>
            Actieve Vraag: {activeQuestion.question}
          </h2>
          <p style={styles.activeQuestionSubtitle}>
            Deelnemers zien nu deze vraag en opties
          </p>
        </div>

        {/* Button Controls for Active Question */}
        <div style={styles.buttonGrid}>
          {activeQuestion.buttons.map((button) => (
            <ButtonControl
              key={button.id}
              button={button}
              onToggle={() => onToggleButton(button.id)}
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