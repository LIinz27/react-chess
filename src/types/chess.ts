export interface GameSettings {
  playerSide: 'white' | 'black' | 'both';
  difficulty: 1 | 2 | 3 | 4 | 5;
  timeControl: number; // dalam menit
  soundEnabled: boolean;
}

export interface Move {
  from: string;
  to: string;
  san: string;
  fen: string;
  timestamp: number;
}

export interface GameState {
  fen: string;
  moves: Move[];
  isGameOver: boolean;
  result: string | null;
  turn: 'w' | 'b';
  check: boolean;
  checkmate: boolean;
  stalemate: boolean;
}

export interface PerformanceMetrics {
  accuracy: number;
  averageTime: number;
  bestMove: number;
  blunders: number;
  mistakes: number;
  inaccuracies: number;
}
