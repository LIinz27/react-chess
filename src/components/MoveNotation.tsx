import React from 'react';
import type { Move } from '../types/chess';

interface MoveNotationProps {
  moves: Move[];
  currentMoveIndex: number;
  onMoveClick: (index: number) => void;
}

export const MoveNotation: React.FC<MoveNotationProps> = ({
  moves,
  currentMoveIndex,
  onMoveClick
}) => {
  const formatMoveNumber = (index: number): string => {
    return Math.ceil((index + 1) / 2).toString();
  };

  const isWhiteMove = (index: number): boolean => {
    return index % 2 === 0;
  };

  const styles = {
    moveNotation: {
      background: 'white',
      borderRadius: '8px',
      padding: '1rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      height: '400px',
      overflow: 'hidden' as const,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    title: {
      margin: '0 0 1rem 0',
      color: '#333',
      fontSize: '1.1rem',
    },
    movesContainer: {
      flex: 1,
      overflowY: 'auto' as const,
    },
    noMoves: {
      color: '#666',
      fontStyle: 'italic' as const,
      textAlign: 'center' as const,
      marginTop: '2rem',
    },
    movesList: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '0.25rem',
    },
    moveItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      minWidth: 'fit-content',
    },
    moveItemHover: {
      backgroundColor: '#f0f0f0',
    },
    moveItemCurrent: {
      backgroundColor: '#4CAF50',
      color: 'white',
    },
    moveNumber: {
      fontWeight: 'bold' as const,
      color: '#666',
      marginRight: '0.25rem',
    },
    moveNumberCurrent: {
      color: 'white',
    },
    moveSan: {
      fontFamily: "'Courier New', monospace",
      fontSize: '0.9rem',
    },
    whiteMove: {
      color: '#333',
    },
    blackMove: {
      color: '#666',
    },
    currentMove: {
      color: 'white',
    },
  };

  return (
    <div style={styles.moveNotation}>
      <h3 style={styles.title}>Move History</h3>
      <div style={styles.movesContainer}>
        {moves.length === 0 ? (
          <p style={styles.noMoves}>No moves yet</p>
        ) : (
          <div style={styles.movesList}>
            {moves.map((move, index) => (
              <div
                key={index}
                style={{
                  ...styles.moveItem,
                  ...(index === currentMoveIndex ? styles.moveItemCurrent : {}),
                }}
                onClick={() => onMoveClick(index)}
                onMouseEnter={(e) => {
                  if (index !== currentMoveIndex) {
                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== currentMoveIndex) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {isWhiteMove(index) && (
                  <span style={{
                    ...styles.moveNumber,
                    ...(index === currentMoveIndex ? styles.moveNumberCurrent : {}),
                  }}>
                    {formatMoveNumber(index)}.
                  </span>
                )}
                <span style={{
                  ...styles.moveSan,
                  ...(isWhiteMove(index) ? styles.whiteMove : styles.blackMove),
                  ...(index === currentMoveIndex ? styles.currentMove : {}),
                }}>
                  {move.san}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
