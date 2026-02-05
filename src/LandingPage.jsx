import React, { useState, useEffect } from 'react';
import { Users, Share2 } from 'lucide-react';
import { styles } from './styles';

// ============================================
// LANDING PAGE COMPONENT
// ============================================

export const LandingPage = ({ onStartHost, onJoinSession }) => {
  const [joinCode, setJoinCode] = useState('');

  // Check URL parameters voor automatisch joinen via QR code
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get('code');
    
    if (codeFromUrl && codeFromUrl.length === 6) {
      setJoinCode(codeFromUrl);
      // Automatisch joinen als er een geldige code in de URL staat
      setTimeout(() => {
        onJoinSession(codeFromUrl);
      }, 500);
    }
  }, [onJoinSession]);

  return (
    <div style={styles.container}>
      <div style={styles.landingContent}>
        <img 
          src="https://www.scoutsjuventamerchtem.be/assets/img/logo.png" 
          alt="Scouts Juventa Merchtem"
          style={{ maxWidth: '200px', marginBottom: '20px' }}
        />
        <h1 style={styles.title}>Halfjaarlijkse</h1>
        <p style={styles.subtitle}>Scouts Juventa Merchtem</p>

        <div style={styles.buttonGrid}>
          <div style={styles.card}>
            <Users size={40} style={styles.icon} />
            <h2 style={styles.cardTitle}>Host</h2>
            <p style={styles.cardText}>Start een nieuwe sessie</p>
            <button onClick={onStartHost} style={styles.primaryButton}>
              Start Presentatie
            </button>
          </div>

          <div style={styles.card}>
            <Share2 size={40} style={styles.icon} />
            <h2 style={styles.cardTitle}>Deelnemer</h2>
            <p style={styles.cardText}>Join een bestaande sessie</p>
            <input
              type="text"
              placeholder="CODE"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
              style={styles.input}
            />
            <button
              onClick={() => onJoinSession(joinCode)}
              disabled={joinCode.length !== 6}
              style={{
                ...styles.primaryButton,
                opacity: joinCode.length !== 6 ? 0.5 : 1,
              }}
            >
              Deelnemen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Default export voor compatibiliteit
export default LandingPage;