import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard';
import { MoveNotation } from '../components/MoveNotation';
import { PerformanceScore } from '../components/PerformanceScore';
import { useStockfish } from '../hooks/useStockfish';
import { useSound } from '../hooks/useSound';
import { makeMove, getGameStatus, getPerformanceMetrics } from '../utils/chessUtils';
import type { GameSettings, Move, GameState } from '../types/chess';

export const GamePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const settings = location.state?.settings as GameSettings || {
    playerSide: 'white',
    difficulty: 3,
    timeControl: 10,
    soundEnabled: true,
  };

  const [game, setGame] = useState(() => new Chess());
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [gameState, setGameState] = useState<GameState>({
    fen: new Chess().fen(),
    moves: [],
    isGameOver: false,
    result: null,
    turn: 'w',
    check: false,
    checkmate: false,
    stalemate: false,
  });
  const [isThinking, setIsThinking] = useState(false);

  const { getBestMove, isReady: stockfishReady } = useStockfish(settings.difficulty);
  const { initSounds, playMoveSound, playGameEndSound } = useSound(settings.soundEnabled);

  useEffect(() => {
    if (settings.soundEnabled) {
      initSounds();
    }
  }, [settings.soundEnabled, initSounds]);

  const updateGameState = useCallback((chess: Chess) => {
    const status = getGameStatus(chess);
    setGameState({
      fen: chess.fen(),
      moves: moves,
      isGameOver: status.isGameOver,
      result: status.isCheckmate ? (status.turn === 'w' ? 'Black wins' : 'White wins') :
              status.isStalemate ? 'Draw' :
              status.isDraw ? 'Draw' : null,
      turn: status.turn,
      check: status.isCheck,
      checkmate: status.isCheckmate,
      stalemate: status.isStalemate,
    });

    if (status.isGameOver) {
      playGameEndSound();
    }
  }, [moves, playGameEndSound]);

  const handleMove = useCallback(async (from: string, to: string) => {
    const newGame = new Chess(game.fen());
    const move = makeMove(newGame, from, to);
    
    if (!move) return;

    const newMoves = [...moves, move];
    setMoves(newMoves);
    setCurrentMoveIndex(newMoves.length - 1);
    setGame(newGame);
    updateGameState(newGame);

    // Play sound effect
    const isCapture = newGame.history({ verbose: true }).slice(-1)[0]?.captured !== undefined;
    const isCheck = newGame.inCheck();
    const isCastle = move.san.includes('O-O');
    playMoveSound(isCapture, isCheck, isCastle);

    // If playing against engine and it's engine's turn
    if (settings.playerSide !== 'both' && stockfishReady && !newGame.isGameOver()) {
      const shouldEngineMove = 
        (settings.playerSide === 'white' && newGame.turn() === 'b') ||
        (settings.playerSide === 'black' && newGame.turn() === 'w');

      if (shouldEngineMove) {
        setIsThinking(true);
        try {
          const bestMove = await getBestMove(newGame.fen());
          if (bestMove) {
            setTimeout(() => {
              const engineGame = new Chess(newGame.fen());
              try {
                // Use SAN notation directly since our mock engine returns SAN
                const engineMove = engineGame.move(bestMove);
                if (engineMove) {
                  const engineMoveObj: Move = {
                    from: engineMove.from,
                    to: engineMove.to,
                    san: engineMove.san,
                    fen: engineGame.fen(),
                    timestamp: Date.now()
                  };
                  
                  const updatedMoves = [...newMoves, engineMoveObj];
                  setMoves(updatedMoves);
                  setCurrentMoveIndex(updatedMoves.length - 1);
                  setGame(engineGame);
                  updateGameState(engineGame);
                  
                  const engineIsCapture = engineMove.captured !== undefined;
                  const engineIsCheck = engineGame.inCheck();
                  const engineIsCastle = engineMove.san.includes('O-O');
                  playMoveSound(engineIsCapture, engineIsCheck, engineIsCastle);
                }
              } catch (error) {
                console.error('Engine move error:', error);
              }
              setIsThinking(false);
            }, 300); // Small delay for better UX
          } else {
            setIsThinking(false);
          }
        } catch (error) {
          console.error('Failed to get engine move:', error);
          setIsThinking(false);
        }
      }
    }
  }, [game, moves, settings.playerSide, stockfishReady, getBestMove, updateGameState, playMoveSound]);

  const handleMoveClick = useCallback((index: number) => {
    if (index === currentMoveIndex) return;
    
    setCurrentMoveIndex(index);
    
    // Reconstruct game state up to selected move
    const newGame = new Chess();
    for (let i = 0; i <= index; i++) {
      if (moves[i]) {
        newGame.move(moves[i].san);
      }
    }
    setGame(newGame);
  }, [currentMoveIndex, moves]);

  const handleNewGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setMoves([]);
    setCurrentMoveIndex(-1);
    updateGameState(newGame);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const metrics = getPerformanceMetrics(moves);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '1rem',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
      background: 'white',
      padding: '1rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold' as const,
      color: '#333',
      margin: 0,
    },
    status: {
      fontSize: '1rem',
      color: gameState.isGameOver ? '#F44336' : 
             gameState.check ? '#FF9800' : '#4CAF50',
      fontWeight: '600' as const,
    },
    buttons: {
      display: 'flex',
      gap: '0.5rem',
    },
    button: {
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600' as const,
      transition: 'background-color 0.2s',
    },
    primaryButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
    },
    secondaryButton: {
      backgroundColor: '#2196F3',
      color: 'white',
    },
    gameArea: {
      display: 'grid',
      gridTemplateColumns: '1fr 300px',
      gap: '1rem',
      alignItems: 'start',
    },
    boardContainer: {
      background: 'white',
      padding: '1rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      position: 'relative' as const,
    },
    thinkingOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      zIndex: 10,
    },
    thinkingText: {
      color: 'white',
      fontSize: '1.2rem',
      fontWeight: 'bold' as const,
    },
    sidePanel: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem',
    },
  };

  const getGameStatusText = () => {
    if (isThinking) return 'Engine is thinking...';
    if (gameState.isGameOver) return gameState.result || 'Game Over';
    if (gameState.check) return 'Check!';
    return gameState.turn === 'w' ? "White's turn" : "Black's turn";
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Chess Game</h1>
        <div style={styles.status}>{getGameStatusText()}</div>
        <div style={styles.buttons}>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={handleNewGame}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
          >
            New Game
          </button>
          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={handleBackToHome}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
          >
            Back to Home
          </button>
        </div>
      </div>

      <div style={styles.gameArea}>
        <div style={styles.boardContainer}>
          {isThinking && (
            <div style={styles.thinkingOverlay}>
              <div style={styles.thinkingText}>Engine is thinking...</div>
            </div>
          )}
          <ChessBoard
            game={game}
            onMove={handleMove}
            playerSide={settings.playerSide}
            disabled={isThinking || gameState.isGameOver}
          />
        </div>

        <div style={styles.sidePanel}>
          <MoveNotation
            moves={moves}
            currentMoveIndex={currentMoveIndex}
            onMoveClick={handleMoveClick}
          />
          <PerformanceScore
            metrics={metrics}
            isGameActive={moves.length > 0}
          />
        </div>
      </div>
    </div>
  );
};
