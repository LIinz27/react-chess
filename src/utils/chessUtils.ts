import { Chess } from 'chess.js';
import type { Move, PerformanceMetrics } from '../types/chess';

export const createNewGame = (): Chess => {
  return new Chess();
};

export const isValidMove = (chess: Chess, from: string, to: string): boolean => {
  try {
    const move = chess.move({ from, to });
    if (move) {
      chess.undo(); // Undo the move to keep the original state
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const makeMove = (chess: Chess, from: string, to: string): Move | null => {
  try {
    const move = chess.move({ from, to });
    if (move) {
      return {
        from: move.from,
        to: move.to,
        san: move.san,
        fen: chess.fen(),
        timestamp: Date.now()
      };
    }
    return null;
  } catch {
    return null;
  }
};

export const getMoveHistory = (chess: Chess): string[] => {
  return chess.history();
};

export const getGameStatus = (chess: Chess) => {
  return {
    isGameOver: chess.isGameOver(),
    isCheck: chess.inCheck(),
    isCheckmate: chess.isCheckmate(),
    isStalemate: chess.isStalemate(),
    isDraw: chess.isDraw(),
    turn: chess.turn()
  };
};

export const formatMoveTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${remainingSeconds}s`;
};

export const calculateAccuracy = (moves: Move[], engineMoves: string[]): number => {
  if (moves.length === 0) return 100;
  
  let matchingMoves = 0;
  moves.forEach((move, index) => {
    if (engineMoves[index] && move.san === engineMoves[index]) {
      matchingMoves++;
    }
  });
  
  return Math.round((matchingMoves / moves.length) * 100);
};

export const getPerformanceMetrics = (moves: Move[]): PerformanceMetrics => {
  if (moves.length === 0) {
    return {
      accuracy: 100,
      averageTime: 0,
      bestMove: 0,
      blunders: 0,
      mistakes: 0,
      inaccuracies: 0
    };
  }

  const times = moves.map((move, index) => 
    index > 0 ? move.timestamp - moves[index - 1].timestamp : 0
  );
  
  const averageTime = times.reduce((a, b) => a + b, 0) / times.length;

  return {
    accuracy: 85, // Placeholder - akan dihitung dengan analisis engine
    averageTime,
    bestMove: Math.floor(moves.length * 0.3), // Placeholder
    blunders: Math.floor(moves.length * 0.05), // Placeholder
    mistakes: Math.floor(moves.length * 0.1), // Placeholder
    inaccuracies: Math.floor(moves.length * 0.15) // Placeholder
  };
};
