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
  const saveSession = async (code, buttonState) => {
    try {
      const data = { buttons: buttonState, timestamp: Date.now() };
      // Gebruik localStorage in plaats van window.storage
      localStorage.setItem(`session:${code}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const loadSession = async (code) => {
    try {
      // Gebruik localStorage in plaats van window.storage
      const result = localStorage.getItem(`session:${code}`);
      if (result) {
        return JSON.parse(result);
      }
    } catch (error) {
      console.error('Error loading:', error);
    }
    return null;
  };

  return { saveSession, loadSession };
};