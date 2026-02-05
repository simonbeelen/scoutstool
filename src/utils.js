// ============================================
// UTILITY FUNCTIONS
// ============================================

import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { getDb } from './firebase';

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
      const sessionData = {
        questions: data.questions,
        results: data.results,
        responses: data.responses,
        timestamp: Date.now(),
      };

      const db = getDb();
      if (db) {
        await setDoc(doc(db, 'sessions', code), sessionData);
        console.log('Session saved (cloud):', code);
        return;
      }

      // Fallback: localStorage (zelfde device)
      localStorage.setItem(`session:${code}`, JSON.stringify(sessionData));
      console.log('Session saved (local):', code);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const loadSession = async (code) => {
    try {
      const db = getDb();
      if (db) {
        const snapshot = await getDoc(doc(db, 'sessions', code));
        if (snapshot.exists()) {
          const data = snapshot.data();
          console.log('Session loaded (cloud):', code, data);
          return data;
        }
        console.log('No session found (cloud) for:', code);
        return null;
      }

      // Fallback: localStorage
      const stored = localStorage.getItem(`session:${code}`);
      if (stored) {
        const data = JSON.parse(stored);
        console.log('Session loaded (local):', code, data);
        return data;
      }
      console.log('No session found (local) for:', code);
    } catch (error) {
      console.error('Error loading session:', error);
    }
    return null;
  };

  const subscribeSession = (code, callback) => {
    const db = getDb();
    if (!db) return null;
    return onSnapshot(doc(db, 'sessions', code), (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data());
      }
    });
  };

  return { saveSession, loadSession, subscribeSession };
};