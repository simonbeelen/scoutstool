// ============================================
// UTILITY FUNCTIONS
// ============================================

export const generateCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const useSessionStorage = () => {
  const saveSession = async (code, data) => {
    try {
      // Gebruik localStorage (werkt in alle browsers)
      const sessionData = {
        questions: data.questions,
        results: data.results,
        timestamp: Date.now()
      };
      localStorage.setItem(`session:${code}`, JSON.stringify(sessionData));
      console.log('Session saved:', code, sessionData);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const loadSession = async (code) => {
    try {
      // Laad van localStorage
      const stored = localStorage.getItem(`session:${code}`);
      if (stored) {
        const data = JSON.parse(stored);
        console.log('Session loaded:', code, data);
        return data;
      }
      console.log('No session found for:', code);
    } catch (error) {
      console.error('Error loading session:', error);
    }
    return null;
  };

  return { saveSession, loadSession };
};