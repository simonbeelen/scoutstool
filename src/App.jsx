import React, { useState, useEffect } from 'react';
import { LandingPage } from './LandingPage';
import { HostDashboard } from './HostDashboard';
import { ParticipantView } from './ParticipantView';
import { generateCode, useSessionStorage } from './utils';

// ============================================
// MAIN APP COMPONENT - MULTI QUESTION SYSTEM
// ============================================

const InteractivePresentationApp = () => {
  const [mode, setMode] = useState(null);
  const [sessionCode, setSessionCode] = useState('');
  
  // ALLE VRAGEN MET HUN OPTIES
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: 'Blijf je leiding?',
      buttons: [
        { id: 1, label: 'Ja, blijf leiding', unlocked: false, color: '#10b981' },
        { id: 2, label: 'Nee, stop ermee', unlocked: false, color: '#ef4444' },
        { id: 3, label: 'Misschien/Twijfel', unlocked: false, color: '#f59e0b' },
      ]
    },
    {
      id: 2,
      question: 'Welk kamp verkies je?',
      buttons: [
        { id: 1, label: 'Zomerkamp', unlocked: false, color: '#f59e0b' },
        { id: 2, label: 'Winterkamp', unlocked: false, color: '#3b82f6' },
        { id: 3, label: 'Beide', unlocked: false, color: '#8b5cf6' },
        { id: 4, label: 'Geen van beide', unlocked: false, color: '#6b7280' },
      ]
    },
    {
      id: 3,
      question: 'Hoeveel jaar ben je al leiding?',
      buttons: [
        { id: 1, label: '0-2 jaar', unlocked: false, color: '#10b981' },
        { id: 2, label: '3-5 jaar', unlocked: false, color: '#3b82f6' },
        { id: 3, label: '6-10 jaar', unlocked: false, color: '#f59e0b' },
        { id: 4, label: '10+ jaar', unlocked: false, color: '#ef4444' },
      ]
    },
  ]);
  
  const [activeQuestionId, setActiveQuestionId] = useState(1); // Welke vraag is actief
  const [clickCounts, setClickCounts] = useState({});

  const { saveSession, loadSession } = useSessionStorage();

  // Haal de actieve vraag op
  const activeQuestion = questions.find(q => q.id === activeQuestionId);

  const startAsHost = async () => {
    const code = generateCode();
    setSessionCode(code);
    setMode('host');
    await saveSession(code, { questions, activeQuestionId });
  };

  const joinAsParticipant = async (code) => {
    if (code.length === 6) {
      setSessionCode(code);
      setMode('participant');
      const data = await loadSession(code);
      if (data) {
        setQuestions(data.questions);
        setActiveQuestionId(data.activeQuestionId);
      }
    }
  };

  // Host selecteert welke vraag actief is
  const selectQuestion = async (questionId) => {
    setActiveQuestionId(questionId);
    await saveSession(sessionCode, { questions, activeQuestionId: questionId });
  };

  // Toggle button lock voor de ACTIEVE vraag
  const toggleButton = async (buttonId) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === activeQuestionId) {
        return {
          ...q,
          buttons: q.buttons.map((btn) =>
            btn.id === buttonId ? { ...btn, unlocked: !btn.unlocked } : btn
          )
        };
      }
      return q;
    });
    
    setQuestions(updatedQuestions);
    await saveSession(sessionCode, { questions: updatedQuestions, activeQuestionId });
  };

  // Handle button click (participant)
  const handleButtonClick = (buttonId) => {
    const button = activeQuestion.buttons.find((b) => b.id === buttonId);
    if (button && button.unlocked) {
      const key = `${activeQuestionId}-${buttonId}`;
      setClickCounts((prev) => ({
        ...prev,
        [key]: (prev[key] || 0) + 1,
      }));
    }
  };

  // Sync for participants
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (mode === 'participant' && sessionCode) {
      const interval = setInterval(async () => {
        const data = await loadSession(sessionCode);
        if (data) {
          setQuestions(data.questions);
          setActiveQuestionId(data.activeQuestionId);
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
        questions={questions}
        activeQuestionId={activeQuestionId}
        onSelectQuestion={selectQuestion}
        onToggleButton={toggleButton}
      />
    );
  }

  return (
    <ParticipantView
      sessionCode={sessionCode}
      question={activeQuestion}
      onButtonClick={handleButtonClick}
      clickCounts={clickCounts}
    />
  );
};

export default InteractivePresentationApp;