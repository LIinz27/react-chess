import React, { useState, useCallback } from 'react';
import { Chess } from 'chess.js';

interface ChessBoardProps {
  game: Chess;
  onMove: (from: string, to: string) => void;
  playerSide: 'white' | 'black' | 'both';
  disabled?: boolean;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  game,
  onMove,
  playerSide,
  disabled = false
}) => {
  const [moveFrom, setMoveFrom] = useState<string | null>(null);

  const renderBoard = () => {
    const board = game.board();
    const isFlipped = playerSide === 'black';
    
    const squares = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    
    const displayRanks = isFlipped ? ['1', '2', '3', '4', '5', '6', '7', '8'] : ranks;
    const displayFiles = isFlipped ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : files;

    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const square = displayFiles[file] + displayRanks[rank];
        const piece = board[isFlipped ? 7 - rank : rank]?.[isFlipped ? 7 - file : file];
        const isLight = (rank + file) % 2 === 0;
        const isSelected = moveFrom === square;
        
        squares.push(
          <div
            key={square}
            className={`chess-square ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''}`}
            onClick={() => handleSquareClick(square)}
            style={{
              width: '12.5%',
              height: '12.5%',
              backgroundColor: isSelected ? '#FFFF99' : isLight ? '#F0D9B5' : '#B58863',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: disabled ? 'default' : 'pointer',
              fontSize: '2rem',
              fontWeight: 'bold',
              userSelect: 'none',
              border: isSelected ? '2px solid #FFD700' : 'none',
            }}
          >
            {piece && getPieceSymbol(piece)}
          </div>
        );
      }
    }

    return squares;
  };

  const getPieceSymbol = (piece: any) => {
    const symbols = {
      'wP': '♙', 'wR': '♖', 'wN': '♘', 'wB': '♗', 'wQ': '♕', 'wK': '♔',
      'bP': '♟', 'bR': '♜', 'bN': '♞', 'bB': '♝', 'bQ': '♛', 'bK': '♚'
    };
    return symbols[piece.color + piece.type.toUpperCase() as keyof typeof symbols] || '';
  };

  const handleSquareClick = useCallback((square: string) => {
    if (disabled) return;

    // Check if it's the player's turn
    if (playerSide !== 'both') {
      const isWhiteTurn = game.turn() === 'w';
      if ((playerSide === 'white' && !isWhiteTurn) || (playerSide === 'black' && isWhiteTurn)) {
        return;
      }
    }

    if (!moveFrom) {
      // Check if the square has a piece that can move
      const piece = game.get(square as any);
      if (piece && piece.color === game.turn()) {
        setMoveFrom(square);
      }
      return;
    }

    if (moveFrom === square) {
      setMoveFrom(null);
      return;
    }

    // Try to make the move
    try {
      const move = game.move({ from: moveFrom, to: square });
      if (move) {
        game.undo(); // Undo the move first
        onMove(moveFrom, square);
        setMoveFrom(null);
      }
    } catch {
      // Invalid move, try selecting the new square
      const piece = game.get(square as any);
      if (piece && piece.color === game.turn()) {
        setMoveFrom(square);
      } else {
        setMoveFrom(null);
      }
    }
  }, [disabled, playerSide, game, moveFrom, onMove]);

  return (
    <div className="chess-board-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          width: '100%',
          aspectRatio: '1',
          border: '2px solid #8B4513',
          borderRadius: '4px',
          backgroundColor: '#DEB887'
        }}
      >
        {renderBoard()}
      </div>
      <div style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
        {disabled && <p>Game paused</p>}
        {!disabled && (
          <p>
            {game.turn() === 'w' ? "White's turn" : "Black's turn"}
            {moveFrom && ` - Selected: ${moveFrom}`}
          </p>
        )}
      </div>
    </div>
  );
};
