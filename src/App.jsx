import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import HostDashboard from './HostDashboard';
import ParticipantView from './ParticipantView';
import { generateCode, useSessionStorage } from './utils';

// ============================================
// MAIN APP - LIVE RESULTS SYSTEM
// ============================================

const InteractivePresentationApp = () => {
  const [mode, setMode] = useState(null);
  const [sessionCode, setSessionCode] = useState('');
  
  // ALLE VRAGEN MET HUN OPTIES
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: 'Blijf je leiding?',
      active: false, // Is deze vraag open voor antwoorden?
      buttons: [
        { id: 1, label: 'Ja, blijf leiding', color: '#10b981' },
        { id: 2, label: 'Nee, stop ermee', color: '#ef4444' },
        { id: 3, label: 'Misschien/Twijfel', color: '#f59e0b' },
      ]
    },
    {
      id: 2,
      question: 'Welk kamp verkies je?',
      active: false,
      buttons: [
        { id: 1, label: 'Zomerkamp', color: '#f59e0b' },
        { id: 2, label: 'Winterkamp', color: '#3b82f6' },
        { id: 3, label: 'Beide', color: '#8b5cf6' },
        { id: 4, label: 'Geen van beide', color: '#6b7280' },
      ]
    },
    {
      id: 3,
      question: 'Hoeveel jaar ben je al leiding?',
      active: false,
      buttons: [
        { id: 1, label: '0-2 jaar', color: '#10b981' },
        { id: 2, label: '3-5 jaar', color: '#3b82f6' },
        { id: 3, label: '6-10 jaar', color: '#f59e0b' },
        { id: 4, label: '10+ jaar', color: '#ef4444' },
      ]
    },
  ]);
  
  const [results, setResults] = useState({}); // Live resultaten per vraag/button

  const { saveSession, loadSession } = useSessionStorage();

  const startAsHost = async () => {
    const code = generateCode();
    setSessionCode(code);
    setMode('host');
    await saveSession(code, { questions, results });
  };

  const joinAsParticipant = async (code) => {
    if (code.length === 6) {
      setSessionCode(code);
      setMode('participant');
      const data = await loadSession(code);
      if (data) {
        setQuestions(data.questions);
        setResults(data.results || {});
      }
    }
  };

  // Toggle vraag actief/inactief
  const toggleQuestion = async (questionId) => {
    try {
      const updatedQuestions = questions.map((q) =>
        q.id === questionId ? { ...q, active: !q.active } : q
      );
      console.log('Toggling question:', questionId, 'New state:', updatedQuestions);
      setQuestions(updatedQuestions);
      await saveSession(sessionCode, { questions: updatedQuestions, results });
    } catch (error) {
      console.error('Error toggling question:', error);
    }
  };

  // Handle button click (participant) - update results
  const handleButtonClick = async (questionId, buttonId) => {
    const question = questions.find(q => q.id === questionId);
    if (!question || !question.active) return;

    const key = `${questionId}-${buttonId}`;
    const newResults = {
      ...results,
      [key]: (results[key] || 0) + 1,
    };
    
    setResults(newResults);
    
    // Save to storage for host to see
    await saveSession(sessionCode, { questions, results: newResults });
  };

  // Reset results voor een specifieke vraag
  const resetQuestionResults = async (questionId) => {
    try {
      const question = questions.find(q => q.id === questionId);
      if (!question) return;

      const newResults = { ...results };
      question.buttons.forEach(btn => {
        const key = `${questionId}-${btn.id}`;
        delete newResults[key];
      });
      
      setResults(newResults);
      await saveSession(sessionCode, { questions, results: newResults });
    } catch (error) {
      console.error('Error resetting results:', error);
    }
  };

  // Sync for participants AND host (voor live updates)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (sessionCode && mode) {
      const interval = setInterval(async () => {
        try {
          const data = await loadSession(sessionCode);
          if (data && data.questions && Array.isArray(data.questions)) {
            setQuestions(data.questions);
            setResults(data.results || {});
          }
        } catch (error) {
          console.error('Error syncing:', error);
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
        results={results}
        onToggleQuestion={toggleQuestion}
        onResetResults={resetQuestionResults}
      />
    );
  }

  return (
    <ParticipantView
      sessionCode={sessionCode}
      questions={questions}
      onButtonClick={handleButtonClick}
    />
  );
};

export default InteractivePresentationApp;