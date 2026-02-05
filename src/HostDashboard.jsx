import React, { useState } from 'react';
import { Lock, Unlock, Copy, Check, QrCode, X } from 'lucide-react';
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
// HOST DASHBOARD COMPONENT
// ============================================

export const HostDashboard = ({ sessionCode, buttons, onToggleButton }) => {
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

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>Host Dashboard</h1>
            <p style={styles.pageSubtitle}>Beheer je knoppen</p>
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

        {/* Button Controls */}
        <div style={styles.buttonGrid}>
          {buttons.map((button) => (
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