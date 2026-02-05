import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import HostDashboard from './HostDashboard';
import ParticipantView from './ParticipantView';
import NameInputForm from './NameInputForm';
import { generateCode, useSessionStorage } from './utils';

// ============================================
// MAIN APP - LIVE RESULTS SYSTEM
// ============================================

const InteractivePresentationApp = () => {
  const [mode, setMode] = useState(null);
  const [sessionCode, setSessionCode] = useState('');
  const optionColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];
  
  // ALLE VRAGEN MET HUN OPTIES
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: 'Blijf je leiding?',
      active: false, // Is deze vraag open voor antwoorden?
      showVoters: false,
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
      showVoters: false,
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
      showVoters: false,
      buttons: [
        { id: 1, label: '0-2 jaar', color: '#10b981' },
        { id: 2, label: '3-5 jaar', color: '#3b82f6' },
        { id: 3, label: '6-10 jaar', color: '#f59e0b' },
        { id: 4, label: '10+ jaar', color: '#ef4444' },
      ]
    },
  ]);
  
  const [results, setResults] = useState({}); // Live resultaten per vraag/button
  const [responses, setResponses] = useState({}); // Namen per vraag/antwoord
  const [userVotes, setUserVotes] = useState({}); // Track deelnemer's votes: { questionId: buttonId }
  const [participantName, setParticipantName] = useState(''); // Deelnemers naam

  const { saveSession, loadSession, subscribeSession } = useSessionStorage();

  // Restore session on app load
  useEffect(() => {
    const savedCode = localStorage.getItem('scoutstool_sessionCode');
    const savedMode = localStorage.getItem('scoutstool_mode');
    
    if (savedCode && savedMode) {
      setSessionCode(savedCode);
      setMode(savedMode);
      
      // Load data from that session
      if (savedMode === 'host') {
        loadSession(savedCode).then(data => {
          if (data) {
            setQuestions(data.questions || []);
            setResults(data.results || {});
            setResponses(data.responses || {});
          }
        });
      }
    }
  }, []);

  const startAsHost = async () => {
    const code = generateCode();
    setSessionCode(code);
    setMode('host');
    localStorage.setItem('scoutstool_sessionCode', code);
    localStorage.setItem('scoutstool_mode', 'host');
    await saveSession(code, { questions, results, responses });
  };

  const joinAsParticipant = async (code) => {
    if (code.length === 6) {
      setSessionCode(code);
      setMode('participant');
      localStorage.setItem('scoutstool_sessionCode', code);
      localStorage.setItem('scoutstool_mode', 'participant');
      const data = await loadSession(code);
      if (data) {
        setQuestions(data.questions);
        setResults(data.results || {});
        setResponses(data.responses || {});
      }
    }
  };

  // Logout - go back to landing page
  const logout = () => {
    localStorage.removeItem('scoutstool_sessionCode');
    localStorage.removeItem('scoutstool_mode');
    setMode(null);
    setSessionCode('');
    setParticipantName('');
    setUserVotes({});
  };

  // Toggle vraag actief/inactief
  const toggleQuestion = async (questionId) => {
    try {
      const updatedQuestions = questions.map((q) =>
        q.id === questionId ? { ...q, active: !q.active } : q
      );
      console.log('Toggling question:', questionId, 'New state:', updatedQuestions);
      setQuestions(updatedQuestions);
      await saveSession(sessionCode, { questions: updatedQuestions, results, responses });
    } catch (error) {
      console.error('Error toggling question:', error);
    }
  };

  // Open/sluit alle bestaande vragen
  const setAllQuestionsActive = async (active) => {
    try {
      const updatedQuestions = questions.map((q) => ({ ...q, active }));
      setQuestions(updatedQuestions);
      await saveSession(sessionCode, { questions: updatedQuestions, results, responses });
    } catch (error) {
      console.error('Error toggling all questions:', error);
    }
  };

  // Toon/verberg namen per vraag
  const toggleShowVoters = async (questionId) => {
    try {
      const updatedQuestions = questions.map((q) =>
        q.id === questionId ? { ...q, showVoters: !q.showVoters } : q
      );
      setQuestions(updatedQuestions);
      await saveSession(sessionCode, { questions: updatedQuestions, results, responses });
    } catch (error) {
      console.error('Error toggling voters visibility:', error);
    }
  };

  // Add new question (host)
  const addQuestion = async (questionText, optionLabels, openImmediately = true, typeConfig = {}) => {
    try {
      const trimmedQuestion = (questionText || '').trim();
      if (!trimmedQuestion) return;

      const nextId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
      const type = typeConfig.type || 'multipleChoice';

      let newQuestion;

      if (type === 'multipleChoice') {
        const cleanOptions = (optionLabels || [])
          .map((label) => (label || '').trim())
          .filter((label) => label.length > 0);
        if (cleanOptions.length < 2) return;

        newQuestion = {
          id: nextId,
          question: trimmedQuestion,
          type: 'multipleChoice',
          active: !!openImmediately,
          showVoters: false,
          buttons: cleanOptions.map((label, index) => ({
            id: index + 1,
            label,
            color: optionColors[index % optionColors.length],
          })),
        };
      } else if (type === 'dragDrop') {
        const { dragDropCorrect, dragDropWrong } = typeConfig;
        const cleanWrong = (dragDropWrong || [])
          .map((label) => (label || '').trim())
          .filter((label) => label.length > 0);
        
        if (!dragDropCorrect?.trim() || cleanWrong.length < 1) return;

        const allAnswers = [dragDropCorrect.trim(), ...cleanWrong];
        newQuestion = {
          id: nextId,
          question: trimmedQuestion,
          type: 'dragDrop',
          active: !!openImmediately,
          showVoters: false,
          correctAnswer: dragDropCorrect.trim(),
          wrongAnswers: cleanWrong,
          items: allAnswers.sort(() => Math.random() - 0.5), // Shuffle
        };
      } else if (type === 'trueFalse') {
        const { trueFalseAnswer } = typeConfig;
        newQuestion = {
          id: nextId,
          question: trimmedQuestion,
          type: 'trueFalse',
          active: !!openImmediately,
          showVoters: false,
          correctAnswer: trueFalseAnswer === 'true',
          buttons: [
            { id: 1, label: 'Waar', color: '#10b981' },
            { id: 2, label: 'Onwaar', color: '#ef4444' },
          ],
        };
      } else if (type === 'ranking') {
        const { rankingItems } = typeConfig;
        const cleanItems = (rankingItems || [])
          .map((label) => (label || '').trim())
          .filter((label) => label.length > 0);
        if (cleanItems.length < 2) return;

        newQuestion = {
          id: nextId,
          question: trimmedQuestion,
          type: 'ranking',
          active: !!openImmediately,
          showVoters: false,
          items: cleanItems,
          correctOrder: [...cleanItems], // Original order is correct
        };
      }

      if (newQuestion) {
        const updatedQuestions = [...questions, newQuestion];
        setQuestions(updatedQuestions);
        await saveSession(sessionCode, { questions: updatedQuestions, results, responses });
      }
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  // Handle button click (participant) - update results
  const handleButtonClick = async (questionId, buttonId, additionalData = null) => {
    const question = questions.find(q => q.id === questionId);
    if (!question || !question.active) return;

    const name = participantName.trim();
    if (!name) return;

    const type = question.type || 'multipleChoice';
    const newResults = { ...results };
    const questionResponses = { ...(responses[questionId] || {}) };
    const hasVoted = userVotes[questionId];

    if (type === 'multipleChoice' || type === 'trueFalse') {
      // Als je al hebt gestemd en je klikt op dezelfde knop → stem verwijderen
      if (hasVoted === buttonId) {
        const key = `${questionId}-${buttonId}`;
        newResults[key] = Math.max(0, (newResults[key] || 1) - 1);
        const updatedNames = (questionResponses[buttonId] || []).filter((n) => n !== name);
        if (updatedNames.length > 0) {
          questionResponses[buttonId] = updatedNames;
        } else {
          delete questionResponses[buttonId];
        }
        setUserVotes((prev) => {
          const updated = { ...prev };
          delete updated[questionId];
          return updated;
        });
      } else if (hasVoted) {
        // Je hebt al gestemd op een ander antwoord → kan niet veranderen
        return;
      } else {
        // Je hebt nog niet gestemd → stem toevoegen
        const key = `${questionId}-${buttonId}`;
        newResults[key] = (newResults[key] || 0) + 1;
        const existingNames = questionResponses[buttonId] || [];
        if (!existingNames.includes(name)) {
          questionResponses[buttonId] = [...existingNames, name];
        }
        setUserVotes((prev) => ({ ...prev, [questionId]: buttonId }));
      }
    } else if (type === 'ranking' && additionalData) {
      // Ranking: additionalData is the sorted array of items
      // Store each item with its rank position
      additionalData.forEach((item, index) => {
        const rankKey = `${item}__rank${index + 1}`;
        questionResponses[rankKey] = [name];
      });
      setUserVotes((prev) => ({ ...prev, [questionId]: 'submitted' }));
    }

    const updatedResponses = { ...responses, [questionId]: questionResponses };
    if (Object.keys(questionResponses).length === 0) {
      delete updatedResponses[questionId];
    }

    setResponses(updatedResponses);
    setResults(newResults);
    await saveSession(sessionCode, { questions, results: newResults, responses: updatedResponses });
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
      const newResponses = { ...responses };
      delete newResponses[questionId];
      
      setResults(newResults);
      setResponses(newResponses);
      await saveSession(sessionCode, { questions, results: newResults, responses: newResponses });
    } catch (error) {
      console.error('Error resetting results:', error);
    }
  };

  // Sync for participants AND host (voor live updates)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (sessionCode && mode) {
      console.log(`🔄 Starting sync for ${mode} with code: ${sessionCode}`);

      const unsubscribe = subscribeSession
        ? subscribeSession(sessionCode, (data) => {
            if (data && data.questions && Array.isArray(data.questions)) {
              console.log('📥 Synced (realtime) - Active questions:', data.questions.filter(q => q.active).length);
              setQuestions(data.questions);
              setResults(data.results || {});
              setResponses(data.responses || {});
            }
          })
        : null;

      if (unsubscribe) {
        return () => {
          console.log('🛑 Stopping realtime sync');
          unsubscribe();
        };
      }

      const interval = setInterval(async () => {
        try {
          const data = await loadSession(sessionCode);
          if (data && data.questions && Array.isArray(data.questions)) {
            console.log('📥 Synced - Active questions:', data.questions.filter(q => q.active).length);
            setQuestions(data.questions);
            setResults(data.results || {});
            setResponses(data.responses || {});
          }
        } catch (error) {
          console.error('❌ Error syncing:', error);
        }
      }, 1000); // Snellere sync: elke 1 seconde

      return () => {
        console.log('🛑 Stopping sync');
        clearInterval(interval);
      };
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
        responses={responses}
        onToggleQuestion={toggleQuestion}
        onResetResults={resetQuestionResults}
        onAddQuestion={addQuestion}
        onSetAllQuestionsActive={setAllQuestionsActive}
        onToggleShowVoters={toggleShowVoters}
        onLogout={logout}
      />
    );
  }

  // Participant moet eerst naam invullen
  if (!participantName) {
    return (
      <NameInputForm
        sessionCode={sessionCode}
        onNameSubmit={(name) => setParticipantName(name)}
      />
    );
  }

  return (
    <ParticipantView
      sessionCode={sessionCode}
      participantName={participantName}
      questions={questions}
      onButtonClick={handleButtonClick}
      userVotes={userVotes}
      onLogout={logout}
    />
  );
};

export default InteractivePresentationApp;