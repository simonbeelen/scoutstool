import React, { useState } from 'react';
import { styles } from './styles';

export const NameInputForm = ({ sessionCode, onNameSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length > 0) {
      localStorage.setItem('scoutstool_participantName', trimmedName);
      onNameSubmit(trimmedName);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.participantContent}>
        <div style={styles.nameFormContainer}>
          <div style={styles.nameFormContent}>
            <h1 style={styles.nameFormTitle}>Welkom!</h1>
            <p style={styles.nameFormSubtitle}>
              Je bent verbonden met sessie: <strong>{sessionCode}</strong>
            </p>

            <form onSubmit={handleSubmit} style={styles.nameForm}>
              <label style={styles.nameFormLabel}>Wat is jouw naam?</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Voer je naam in..."
                style={styles.nameFormInput}
                autoFocus
              />
              <button
                type="submit"
                disabled={name.trim().length === 0}
                style={{
                  ...styles.nameFormButton,
                  opacity: name.trim().length === 0 ? 0.6 : 1,
                }}
              >
                Starten
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameInputForm;
