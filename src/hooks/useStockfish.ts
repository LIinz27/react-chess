import { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';

interface StockfishMove {
  bestMove: string;
  evaluation: number;
  depth: number;
}

export const useStockfish = (difficulty: number = 3) => {
  const [isReady, setIsReady] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const stockfishRef = useRef<Worker | null>(null);
  const [bestMove, setBestMove] = useState<StockfishMove | null>(null);

  useEffect(() => {
    // Initialize Stockfish worker
    const initStockfish = async () => {
      try {
        // We'll use a simplified approach since Stockfish in browser can be complex
        // In a real implementation, you'd use stockfish.js or similar
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize Stockfish:', error);
      }
    };

    initStockfish();

    return () => {
      if (stockfishRef.current) {
        stockfishRef.current.terminate();
      }
    };
  }, []);

  const analyzePosition = async (fen: string): Promise<StockfishMove | null> => {
    if (!isReady) return null;

    setIsAnalyzing(true);
    
    // Simulate engine analysis with valid moves for current position
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create a temporary chess instance to get valid moves
        try {
          const tempChess = new Chess(fen);
          const legalMoves = tempChess.moves({ verbose: true });
          
          if (legalMoves.length === 0) {
            setIsAnalyzing(false);
            resolve(null);
            return;
          }
          
          // Pick a random legal move (in real implementation, this would be engine analysis)
          const randomIndex = Math.floor(Math.random() * legalMoves.length);
          const selectedMove = legalMoves[randomIndex];
          
          // Simple evaluation based on move type and difficulty
          let evaluation = Math.random() * 0.5 - 0.25; // Base random evaluation
          if (selectedMove.captured) evaluation += 0.3; // Favor captures
          if (selectedMove.san.includes('+')) evaluation += 0.2; // Favor checks
          
          const result: StockfishMove = {
            bestMove: selectedMove.san, // Use SAN notation instead of UCI
            evaluation,
            depth: difficulty * 2 + 8
          };
          
          setBestMove(result);
          setIsAnalyzing(false);
          resolve(result);
        } catch (error) {
          console.error('Error analyzing position:', error);
          setIsAnalyzing(false);
          resolve(null);
        }
      }, 500 + (difficulty * 300)); // Analysis time based on difficulty
    });
  };

  const getBestMove = async (fen: string): Promise<string | null> => {
    const analysis = await analyzePosition(fen);
    return analysis ? analysis.bestMove : null;
  };

  const setDifficulty = (newDifficulty: number) => {
    // In real implementation, this would send UCI commands to engine
    console.log(`Setting difficulty to ${newDifficulty}`);
  };

  return {
    isReady,
    isAnalyzing,
    bestMove,
    analyzePosition,
    getBestMove,
    setDifficulty
  };
};
