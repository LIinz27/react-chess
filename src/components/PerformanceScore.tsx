import React from 'react';
import type { PerformanceMetrics } from '../types/chess';
import { formatMoveTime } from '../utils/chessUtils';

interface PerformanceScoreProps {
  metrics: PerformanceMetrics;
  isGameActive: boolean;
}

export const PerformanceScore: React.FC<PerformanceScoreProps> = ({
  metrics,
  isGameActive
}) => {
  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy >= 90) return '#4CAF50'; // Green
    if (accuracy >= 80) return '#FFC107'; // Yellow
    if (accuracy >= 70) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const styles = {
    container: {
      background: 'white',
      borderRadius: '8px',
      padding: '1rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      minHeight: '200px',
    },
    title: {
      margin: '0 0 1rem 0',
      color: '#333',
      fontSize: '1.1rem',
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
    },
    metricItem: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      padding: '0.75rem',
      borderRadius: '6px',
      backgroundColor: '#f8f9fa',
    },
    metricValue: {
      fontSize: '1.5rem',
      fontWeight: 'bold' as const,
      margin: '0.25rem 0',
    },
    metricLabel: {
      fontSize: '0.85rem',
      color: '#666',
      textAlign: 'center' as const,
    },
    accuracyCircle: {
      position: 'relative' as const,
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0.5rem 0',
    },
    accuracyText: {
      fontSize: '0.9rem',
      fontWeight: 'bold' as const,
      color: 'white',
    },
    summarySection: {
      marginTop: '1rem',
      padding: '0.75rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '6px',
    },
    summaryTitle: {
      fontSize: '0.9rem',
      fontWeight: 'bold' as const,
      color: '#333',
      marginBottom: '0.5rem',
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '0.5rem',
      fontSize: '0.8rem',
    },
    summaryItem: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
    },
    summaryValue: {
      fontWeight: 'bold' as const,
      color: '#333',
    },
    summaryLabel: {
      color: '#666',
      fontSize: '0.7rem',
    },
    inactive: {
      opacity: 0.6,
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Performance Score</h3>
      
      {!isGameActive && metrics.accuracy === 100 ? (
        <div style={styles.inactive}>
          <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
            Start playing to see your performance metrics
          </p>
        </div>
      ) : (
        <>
          <div style={styles.metricsGrid}>
            <div style={styles.metricItem}>
              <div 
                style={{
                  ...styles.accuracyCircle,
                  backgroundColor: getAccuracyColor(metrics.accuracy),
                }}
              >
                <span style={styles.accuracyText}>{metrics.accuracy}%</span>
              </div>
              <span style={styles.metricLabel}>Accuracy</span>
            </div>
            
            <div style={styles.metricItem}>
              <span style={{ ...styles.metricValue, color: '#2196F3' }}>
                {formatMoveTime(metrics.averageTime)}
              </span>
              <span style={styles.metricLabel}>Avg. Time</span>
            </div>
            
            <div style={styles.metricItem}>
              <span style={{ ...styles.metricValue, color: '#4CAF50' }}>
                {metrics.bestMove}
              </span>
              <span style={styles.metricLabel}>Best Moves</span>
            </div>
            
            <div style={styles.metricItem}>
              <span style={{ ...styles.metricValue, color: '#FF5722' }}>
                {metrics.blunders}
              </span>
              <span style={styles.metricLabel}>Blunders</span>
            </div>
          </div>

          <div style={styles.summarySection}>
            <div style={styles.summaryTitle}>Move Quality</div>
            <div style={styles.summaryGrid}>
              <div style={styles.summaryItem}>
                <span style={{ ...styles.summaryValue, color: '#4CAF50' }}>
                  {metrics.bestMove}
                </span>
                <span style={styles.summaryLabel}>BEST</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={{ ...styles.summaryValue, color: '#FF9800' }}>
                  {metrics.inaccuracies}
                </span>
                <span style={styles.summaryLabel}>INACCURACIES</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={{ ...styles.summaryValue, color: '#F44336' }}>
                  {metrics.mistakes}
                </span>
                <span style={styles.summaryLabel}>MISTAKES</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
