import React, { useState, useEffect } from 'react';
import { LandingPage } from './LandingPage';
import { HostDashboard } from './HostDashboard';
import { ParticipantView } from './ParticipantView';
import { generateCode, useSessionStorage } from './utils';

// ============================================
// MAIN APP COMPONENT
// ============================================

const InteractivePresentationApp = () => {
  const [mode, setMode] = useState(null);
  const [sessionCode, setSessionCode] = useState('');
  const [buttons, setButtons] = useState([
    { id: 1, label: 'Ja, blijf leiding', unlocked: false, color: '#10b981' },
    { id: 2, label: 'Nee, stop ermee', unlocked: false, color: '#ef4444' },
    { id: 3, label: 'Misschien/Twijfel', unlocked: false, color: '#f59e0b' },
  ]);
  const [clickCounts, setClickCounts] = useState({});

  const { saveSession, loadSession } = useSessionStorage();

  const startAsHost = async () => {
    const code = generateCode();
    setSessionCode(code);
    setMode('host');
    await saveSession(code, buttons);
  };

  const joinAsParticipant = async (code) => {
    if (code.length === 6) {
      setSessionCode(code);
      setMode('participant');
      const data = await loadSession(code);
      if (data) {
        setButtons(data.buttons);
      }
    }
  };

  const toggleButton = async (buttonId) => {
    const updatedButtons = buttons.map((btn) =>
      btn.id === buttonId ? { ...btn, unlocked: !btn.unlocked } : btn
    );
    setButtons(updatedButtons);
    await saveSession(sessionCode, updatedButtons);
  };

  const handleButtonClick = (buttonId) => {
    const button = buttons.find((b) => b.id === buttonId);
    if (button && button.unlocked) {
      setClickCounts((prev) => ({
        ...prev,
        [buttonId]: (prev[buttonId] || 0) + 1,
      }));
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (mode === 'participant' && sessionCode) {
      const interval = setInterval(async () => {
        const data = await loadSession(sessionCode);
        if (data) {
          setButtons(data.buttons);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [mode, sessionCode]);

  if (!mode) {
    return (
      <LandingPage 
        onStartHost={startAsHost} 
        onJoinSession={joinAsParticipant} 
      />
    );
  }

  if (mode === 'host') {
    return (
      <HostDashboard
        sessionCode={sessionCode}
        buttons={buttons}
        onToggleButton={toggleButton}
      />
    );
  }

  return (
    <ParticipantView
      sessionCode={sessionCode}
      buttons={buttons}
      onButtonClick={handleButtonClick}
      clickCounts={clickCounts}
    />
  );
};

export default InteractivePresentationApp;