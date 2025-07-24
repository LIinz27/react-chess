import React, { useState, useCallback, useEffect } from 'react';
import { Chess } from 'chess.js';
import styles from './ChessBoard.module.css';

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
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);

  // Clear selection and possible moves when game changes
  useEffect(() => {
    setMoveFrom(null);
    setPossibleMoves([]);
  }, [game.fen()]);

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
        const isPossibleMove = possibleMoves.includes(square);
        
        squares.push(
          <div
            key={square}
            className={`${styles.square} ${isLight ? styles.light : styles.dark} 
              ${isSelected ? styles.selected : ''} 
              ${isPossibleMove && piece ? styles.possibleCapture : ''} 
              ${isPossibleMove && !piece ? styles.possibleMove : ''}`}
            onClick={() => handleSquareClick(square)}
            style={{ cursor: disabled ? 'default' : 'pointer' }}
          >
            <div className={styles.highlightBorder} />
            {piece && (
              <span className={`${styles.piece} ${piece.color === 'b' ? styles.darkPiece : ''}`}>
                {getPieceSymbol(piece)}
              </span>
            )}
            {isPossibleMove && !piece && (
              <div className={styles.moveIndicator} />
            )}
          </div>
        );
      }
    }

    return squares;
  };

  const getPieceSymbol = (piece: any) => {
    // Unicode chess symbols with fallback
    const symbols = {
      'wP': '♙', 'wR': '♖', 'wN': '♘', 'wB': '♗', 'wQ': '♕', 'wK': '♔',
      'bP': '♟', 'bR': '♜', 'bN': '♞', 'bB': '♝', 'bQ': '♛', 'bK': '♚'
    };
    
    // Fallback text symbols if Unicode not supported
    const fallbackSymbols = {
      'wP': 'P', 'wR': 'R', 'wN': 'N', 'wB': 'B', 'wQ': 'Q', 'wK': 'K',
      'bP': 'p', 'bR': 'r', 'bN': 'n', 'bB': 'b', 'bQ': 'q', 'bK': 'k'
    };
    
    const pieceKey = piece.color + piece.type.toUpperCase() as keyof typeof symbols;
    
    // Try Unicode first, fallback to text if needed
    return symbols[pieceKey] || fallbackSymbols[pieceKey] || '?';
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
        // Get possible moves for the selected piece
        const moves = game.moves({ square: square as any, verbose: true });
        const moveTargets = moves.map(move => move.to);
        setPossibleMoves(moveTargets);
      }
      return;
    }

    if (moveFrom === square) {
      setMoveFrom(null);
      setPossibleMoves([]);
      return;
    }

    // Try to make the move
    try {
      const move = game.move({ from: moveFrom, to: square });
      if (move) {
        game.undo(); // Undo the move first
        onMove(moveFrom, square);
        setMoveFrom(null);
        setPossibleMoves([]);
      }
    } catch {
      // Invalid move, try selecting the new square
      const piece = game.get(square as any);
      if (piece && piece.color === game.turn()) {
        setMoveFrom(square);
        // Get possible moves for the new selected piece
        const moves = game.moves({ square: square as any, verbose: true });
        const moveTargets = moves.map(move => move.to);
        setPossibleMoves(moveTargets);
      } else {
        setMoveFrom(null);
        setPossibleMoves([]);
      }
    }
  }, [disabled, playerSide, game, moveFrom, onMove]);

  const renderCoordinates = () => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const isFlipped = playerSide === 'black';
    
    const displayFiles = isFlipped ? [...files].reverse() : files;
    const displayRanks = isFlipped ? ranks : [...ranks].reverse();
    
    return (
      <>
        {/* Rank coordinates (numbers) */}
        {displayRanks.map(rank => (
          <div key={`rank_${rank}`} className={`${styles.coordinate} ${styles.rankCoordinate} ${styles['r' + (isFlipped ? 9 - parseInt(rank) : rank)]}`}>
            {rank}
          </div>
        ))}
        
        {/* File coordinates (letters) */}
        {displayFiles.map(file => (
          <div key={`file_${file}`} className={`${styles.coordinate} ${styles.fileCoordinate} ${styles['f' + file]}`}>
            {file}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className={styles.boardContainer}>
      <div className={styles.chessBoardWrapper}>
        {renderCoordinates()}
        <div className={styles.chessBoard}>
          {renderBoard()}
        </div>
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
