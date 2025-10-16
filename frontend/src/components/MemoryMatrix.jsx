import React, { useState, useEffect, useCallback } from "react";

const GRID_SIZE = 4;
const TOTAL_ROUNDS = 8;

const THEMES = {
  DARK: {
    name: "Dark Mode",
    background: "bg-gradient-to-br from-gray-900 to-gray-800",
    text: "text-white",
    card: "bg-gray-800/80 backdrop-blur-lg shadow-2xl border border-gray-700",
    headingGradient: "from-green-400 to-blue-500",
    buttonBase: "text-white",
    switcherBase: "bg-gray-700 text-yellow-300 hover:bg-gray-600",
    icon: "🌙"
  },
  LIGHT: {
    name: "Light Mode",
    background: "bg-gradient-to-br from-blue-50 to-cyan-100",
    text: "text-gray-900",
    card: "bg-white/80 backdrop-blur-lg shadow-xl border border-gray-200",
    headingGradient: "from-teal-500 to-green-600",
    buttonBase: "text-gray-800 border border-gray-300",
    switcherBase: "bg-white text-orange-400 border border-gray-300 hover:bg-gray-100",
    icon: "☀️"
  },
};

export default function MemoryMatrix({ onGameComplete, onNextGame }) {
  const [grid, setGrid] = useState([]);
  const [activeCells, setActiveCells] = useState([]);
  const [userSelections, setUserSelections] = useState([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('memorize');
  const [theme, setTheme] = useState(THEMES.DARK);

  const generatePattern = useCallback((level) => {
    const numCells = Math.min(level + 1, GRID_SIZE * GRID_SIZE - 2);
    const cells = [];
    
    while (cells.length < numCells) {
      const randomCell = Math.floor(Math.random() * GRID_SIZE * GRID_SIZE);
      if (!cells.includes(randomCell)) {
        cells.push(randomCell);
      }
    }
    
    return cells;
  }, []);

  const startRound = useCallback(() => {
    const pattern = generatePattern(round);
    setActiveCells(pattern);
    setUserSelections([]);
    setGameState('memorize');
    
    setTimeout(() => {
      setGameState('recall');
    }, 2000 + (round * 500));
  }, [round, generatePattern]);

  useEffect(() => {
    if (round <= TOTAL_ROUNDS) {
      startRound();
    } else {
      endGame();
    }
  }, [round, startRound]);

  const handleCellClick = (cellIndex) => {
    if (gameState !== 'recall') return;
    
    const newSelections = [...userSelections, cellIndex];
    setUserSelections(newSelections);
    
    const isCorrect = activeCells.includes(cellIndex);
    
    if (!isCorrect || newSelections.length === activeCells.length) {
      setTimeout(() => {
        const correctSelections = newSelections.filter(cell => activeCells.includes(cell));
        const roundScore = correctSelections.length * 10;
        setScore(prev => prev + roundScore);
        
        if (round < TOTAL_ROUNDS) {
          setRound(prev => prev + 1);
        } else {
          endGame();
        }
      }, 1000);
    }
  };

  const endGame = () => {
    const gameData = {
      game_type: 'memory_matrix',
      total_score: score,
      total_rounds: TOTAL_ROUNDS,
      completed_at: new Date().toISOString()
    };
    
    if (onGameComplete) {
      onGameComplete(gameData);
    }
    setGameState('completed');
  };

  const ThemeSelector = () => {
    const nextTheme = theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    return (
      <button
        onClick={() => setTheme(nextTheme)}
        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-300 transform active:scale-90 shadow-md ${theme.switcherBase}`}
      >
        {nextTheme.icon}
      </button>
    );
  };

  const renderGrid = () => {
    return (
      <div className="grid grid-cols-4 gap-2 mb-6">
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const isActive = activeCells.includes(index);
          const isSelected = userSelections.includes(index);
          const isCorrect = activeCells.includes(index);
          
          let cellClass = "w-16 h-16 rounded-lg transition-all duration-300 ";
          
          if (gameState === 'memorize' && isActive) {
            cellClass += "bg-yellow-400 scale-110 shadow-lg";
          } else if (gameState === 'recall') {
            if (isSelected) {
              cellClass += isCorrect ? "bg-green-500 scale-105" : "bg-red-500 scale-105";
            } else {
              cellClass += "bg-gray-600 hover:bg-gray-500 cursor-pointer";
            }
          } else {
            cellClass += "bg-gray-600";
          }
          
          return (
            <div
              key={index}
              className={cellClass}
              onClick={() => handleCellClick(index)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className={`min-h-screen p-4 flex items-center justify-center ${theme.background} ${theme.text}`}>
      <div className="relative w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            NeuroNest 🧠
          </h1>
          <ThemeSelector />
        </div>

        <div className={`p-8 rounded-2xl ${theme.card} backdrop-blur-lg text-center`}>
          <h2 className={`text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r ${theme.headingGradient}`}>
            🧩 Memory Matrix
          </h2>

          {gameState === 'completed' ? (
            <div className="space-y-6">
              <h3 className="text-4xl font-black">Game Complete! 🏆</h3>
              <p className="text-2xl font-bold">Final Score: <span className="text-yellow-400">{score}</span></p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-bold transition-all duration-300 text-white"
                >
                  Play Again
                </button>
                {onNextGame && (
                  <button
                    onClick={onNextGame}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl font-bold transition-all duration-300 text-white"
                  >
                    Next Game →
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {renderGrid()}
              <div className="text-xl font-mono mb-4">
                Round: {round}/{TOTAL_ROUNDS} | Score: <span className="text-yellow-400">{score}</span>
              </div>
              <p className="text-lg opacity-80">
                {gameState === 'memorize' ? 'Memorize the pattern...' : 'Click the cells you remember...'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}