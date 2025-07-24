# Copilot Instructions untuk Chess Game

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Konteks Proyek
Ini adalah aplikasi web permainan catur yang dibangun dengan:
- **Frontend**: React + TypeScript + Vite
- **Chess Engine**: Stockfish
- **Chess Logic**: chess.js
- **UI Board**: react-chessboard
- **Sound**: howler.js
- **Routing**: react-router-dom

## Struktur Aplikasi
- `src/pages/HomePage.tsx` - Halaman utama untuk setup permainan
- `src/pages/GamePage.tsx` - Halaman permainan utama
- `src/components/ChessBoard.tsx` - Komponen papan catur
- `src/components/MoveNotation.tsx` - Komponen pencatatan langkah
- `src/components/PerformanceScore.tsx` - Komponen skor performa
- `src/hooks/useStockfish.ts` - Hook untuk integrasi Stockfish
- `src/hooks/useSound.ts` - Hook untuk sound effects
- `src/utils/chessUtils.ts` - Utilitas untuk logika catur

## Pedoman Pengembangan
1. Gunakan TypeScript untuk type safety
2. Implementasikan proper error handling
3. Optimalkan performance untuk real-time chess gameplay
4. Pastikan responsive design untuk berbagai device
5. Gunakan React hooks untuk state management
6. Implementasikan proper chess notation (PGN/SAN format)
7. Integrasikan Stockfish engine dengan web workers untuk performance
8. Sediakan sound feedback untuk user interactions
