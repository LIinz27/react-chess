# ♔ Chess Master - React Chess Game with Stockfish

A modern, web-based chess game built with React, TypeScript, and integrated with the powerful Stockfish chess engine. Features a beautiful UI, move notation, performance analysis, and sound effects.

## ✨ Features

- **🎯 Play Against Stockfish Engine**: Choose from 5 difficulty levels (Beginner to Expert)
- **🎮 Multiple Game Modes**: Play as White, Black, or Analysis Mode
- **📝 Move Notation**: Complete game history with algebraic notation
- **📊 Performance Analysis**: Real-time accuracy scoring and move quality analysis
- **🔊 Sound Effects**: Audio feedback for moves, captures, checks, and game endings
- **⏱️ Time Control**: Customizable time limits
- **📱 Responsive Design**: Works on desktop and mobile devices
- **🎨 Modern UI**: Clean, intuitive interface with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js (v20.19.0 or higher recommended)
- npm or yarn

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🎮 How to Play

1. **Home Page**: Configure your game settings
   - Choose your side (White/Black/Both)
   - Select difficulty level (1-5)
   - Set time control
   - Enable/disable sound effects

2. **Game Page**: 
   - Click on pieces to move them
   - View move history in the notation panel
   - Monitor your performance metrics in real-time

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ChessBoard.tsx   # Interactive chess board
│   ├── MoveNotation.tsx # Move history display
│   └── PerformanceScore.tsx # Performance metrics
├── pages/              # Main application pages
│   ├── HomePage.tsx    # Game setup page
│   └── GamePage.tsx    # Main game interface
├── hooks/              # Custom React hooks
│   ├── useStockfish.ts # Stockfish engine integration
│   └── useSound.ts     # Sound effects management
├── utils/              # Utility functions
│   └── chessUtils.ts   # Chess game logic helpers
├── types/              # TypeScript type definitions
│   └── chess.ts        # Game-related types
└── App.tsx             # Main application component
```

## 🔧 Technologies Used

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Chess Logic**: chess.js
- **Chess UI**: Custom chess board component
- **Chess Engine**: Stockfish (simplified implementation)
- **Sound**: Howler.js
- **Routing**: React Router DOM

## 🎵 Sound Effects

The game supports sound effects for:
- Regular moves
- Piece captures
- Check notifications
- Castling moves
- Game end events

To add sound files, place them in `public/sounds/` directory:
- `move.mp3`
- `capture.mp3`
- `check.mp3`
- `castle.mp3`
- `game-end.mp3`

## 🎯 Performance Metrics

The game tracks several performance indicators:
- **Accuracy**: Percentage of moves matching engine recommendations
- **Average Time**: Time taken per move
- **Best Moves**: Number of optimal moves played
- **Mistakes & Blunders**: Move quality analysis

## 🔄 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### VS Code Tasks

The project includes VS Code tasks for:
- **Start Development Server** - Run the dev server
- **Build for Production** - Create production build
- **Preview Production Build** - Preview the built app
- **Install Dependencies** - Install npm packages
- **Lint Code** - Run ESLint

Access these via `Ctrl+Shift+P` > "Tasks: Run Task"

### Future Enhancements

- [ ] Real Stockfish integration with Web Workers
- [ ] Opening book database
- [ ] Game analysis with engine evaluation
- [ ] Multiplayer support
- [ ] Tournament mode
- [ ] Puzzle solver
- [ ] Database of famous games

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Known Issues

- Stockfish integration is simplified (uses mock responses)
- Sound files need to be manually added
- Performance metrics use placeholder calculations

## 📧 Support

If you encounter any issues or have questions, please open an issue in the repository.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
