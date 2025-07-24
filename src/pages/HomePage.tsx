import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GameSettings } from '../types/chess';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<GameSettings>({
    playerSide: 'white',
    difficulty: 3,
    timeControl: 10,
    soundEnabled: true,
  });

  const handleStartGame = () => {
    // Pass settings to game page via navigation state
    navigate('/game', { state: { settings } });
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      maxWidth: '500px',
      width: '100%',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold' as const,
      color: '#333',
      textAlign: 'center' as const,
      marginBottom: '0.5rem',
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#666',
      textAlign: 'center' as const,
      marginBottom: '2rem',
    },
    section: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      fontSize: '1rem',
      fontWeight: '600' as const,
      color: '#333',
      marginBottom: '0.5rem',
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'border-color 0.2s',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: 'white',
      transition: 'border-color 0.2s',
    },
    rangeContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    range: {
      flex: 1,
      height: '6px',
      borderRadius: '3px',
      background: '#e1e5e9',
      outline: 'none',
      cursor: 'pointer',
    },
    rangeValue: {
      fontSize: '1rem',
      fontWeight: 'bold' as const,
      color: '#667eea',
      minWidth: '60px',
      textAlign: 'center' as const,
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    checkbox: {
      width: '20px',
      height: '20px',
      cursor: 'pointer',
    },
    startButton: {
      width: '100%',
      padding: '1rem',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.2rem',
      fontWeight: 'bold' as const,
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      marginTop: '1rem',
    },
    startButtonHover: {
      backgroundColor: '#45a049',
    },
    difficultyLabels: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.8rem',
      color: '#666',
      marginTop: '0.25rem',
    },
  };

  const getDifficultyLabel = (level: number): string => {
    const labels = ['', 'Beginner', 'Easy', 'Medium', 'Hard', 'Expert'];
    return labels[level] || 'Medium';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>♔ Chess Master</h1>
        <p style={styles.subtitle}>Play against the powerful Stockfish engine</p>

        <div style={styles.section}>
          <label style={styles.label}>Play as:</label>
          <select
            style={styles.select}
            value={settings.playerSide}
            onChange={(e) => setSettings({
              ...settings,
              playerSide: e.target.value as 'white' | 'black' | 'both'
            })}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          >
            <option value="white">White</option>
            <option value="black">Black</option>
            <option value="both">Both (Analysis Mode)</option>
          </select>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>
            Difficulty: {getDifficultyLabel(settings.difficulty)}
          </label>
          <div style={styles.rangeContainer}>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={settings.difficulty}
              onChange={(e) => setSettings({
                ...settings,
                difficulty: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5
              })}
              style={styles.range}
            />
            <span style={styles.rangeValue}>{settings.difficulty}/5</span>
          </div>
          <div style={styles.difficultyLabels}>
            <span>Beginner</span>
            <span>Expert</span>
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Time Control (minutes):</label>
          <input
            type="number"
            min="1"
            max="60"
            value={settings.timeControl}
            onChange={(e) => setSettings({
              ...settings,
              timeControl: parseInt(e.target.value) || 10
            })}
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />
        </div>

        <div style={styles.section}>
          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="sound"
              checked={settings.soundEnabled}
              onChange={(e) => setSettings({
                ...settings,
                soundEnabled: e.target.checked
              })}
              style={styles.checkbox}
            />
            <label htmlFor="sound" style={{ ...styles.label, margin: 0 }}>
              Enable Sound Effects
            </label>
          </div>
        </div>

        <button
          style={styles.startButton}
          onClick={handleStartGame}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};
