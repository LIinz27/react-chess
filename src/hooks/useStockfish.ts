import { useState, useEffect, useRef } from 'react';

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
    
    // Simulate engine analysis (in real implementation, this would call actual Stockfish)
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock response based on difficulty and position
        const mockMoves = ['e2e4', 'Nf3', 'd2d4', 'Nc3', 'Bb5'];
        const randomMove = mockMoves[Math.floor(Math.random() * mockMoves.length)];
        
        // Simple evaluation based on FEN position
        const pieceCount = fen.split(' ')[0].replace(/[^a-zA-Z]/g, '').length;
        const evaluation = (pieceCount - 32) * 0.1; // Rough material evaluation
        
        const result: StockfishMove = {
          bestMove: randomMove,
          evaluation,
          depth: difficulty * 2 + 8 // Depth based on difficulty
        };
        
        setBestMove(result);
        setIsAnalyzing(false);
        resolve(result);
      }, 1000 + (difficulty * 500)); // Analysis time based on difficulty
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
