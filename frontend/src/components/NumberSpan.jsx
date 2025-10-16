import React, { useState, useEffect, useCallback } from "react";

const THEMES = {
  DARK: {
    name: "Dark Mode",
    background: "bg-gradient-to-br from-gray-900 to-gray-800",
    text: "text-white",
    card: "bg-gray-800/80 backdrop-blur-lg shadow-2xl border border-gray-700",
    headingGradient: "from-purple-400 to-pink-500",
    buttonBase: "text-white",
    switcherBase: "bg-gray-700 text-yellow-300 hover:bg-gray-600",
    icon: "🌙"
  },
  LIGHT: {
    name: "Light Mode",
    background: "bg-gradient-to-br from-blue-50 to-cyan-100",
    text: "text-gray-900",
    card: "bg-white/80 backdrop-blur-lg shadow-xl border border-gray-200",
    headingGradient: "from-purple-500 to-pink-600",
    buttonBase: "text-gray-800 border border-gray-300",
    switcherBase: "bg-white text-orange-400 border border-gray-300 hover:bg-gray-100",
    icon: "☀️"
  },
};

export default function NumberSpan({ onGameComplete, onNextGame }) {
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [gameState, setGameState] = useState('memorize');
  const [level, setLevel] = useState(3);
  const [score, setScore] = useState(0);
  const [theme, setTheme] = useState(THEMES.DARK);
  const [maxLevel, setMaxLevel] = useState(3);

  const generateSequence = useCallback((length) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
  }, []);

  const startRound = useCallback(() => {
    const newSequence = generateSequence(level);
    setSequence(newSequence);
    setUserInput([]);
    setGameState('memorize');
    
    setTimeout(() => {
      setGameState('recall');
    }, 2000 + (level * 500));
  }, [level, generateSequence]);

  useEffect(() => {
    startRound();
  }, [startRound]);

  const handleNumberClick = (number) => {
    if (gameState !== 'recall') return;
    
    const newInput = [...userInput, number];
    setUserInput(newInput);
    
    if (newInput.length === sequence.length) {
      const isCorrect = newInput.every((num, index) => num === sequence[index]);
      
      setTimeout(() => {
        if (isCorrect) {
          const roundScore = level * 10;
          setScore(prev => prev + roundScore);
          setLevel(prev => prev + 1);
          setMaxLevel(prev => Math.max(prev, level + 1));
        } else {
          endGame();
        }
      }, 1000);
    }
  };

  const endGame = () => {
    const gameData = {
      game_type: 'number_span',
      max_level: maxLevel,
      total_score: score,
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

  return (
    <div className={`min-h-screen p-4 flex items-center justify-center ${theme.background} ${theme.text}`}>
      <div className="relative w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            NeuroNest 🧠
          </h1>
          <ThemeSelector />
        </div>

        <div className={`p-8 rounded-2xl ${theme.card} backdrop-blur-lg text-center`}>
          <h2 className={`text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r ${theme.headingGradient}`}>
            🔢 Number Span
          </h2>

          {gameState === 'completed' ? (
            <div className="space-y-6">
              <h3 className="text-4xl font-black">Game Complete! 🏆</h3>
              <div className="space-y-4">
                <p className="text-2xl font-bold">
                  Max Level: <span className="text-yellow-400">{maxLevel}</span>
                </p>
                <p className="text-2xl font-bold">
                  Score: <span className="text-yellow-400">{score}</span>
                </p>
              </div>
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
              <div className="mb-8">
                <p className="text-xl font-mono mb-4">
                  Level: {level} | Score: <span className="text-yellow-400">{score}</span>
                </p>
                
                {gameState === 'memorize' && (
                  <div className="text-6xl font-bold space-x-4 mb-4">
                    {sequence.map((num, index) => (
                      <span key={index} className="animate-pulse">{num}</span>
                    ))}
                  </div>
                )}
                
                {gameState === 'recall' && (
                  <div className="text-2xl mb-4">
                    <p>Recall the sequence:</p>
                    <div className="text-4xl font-mono mt-2">
                      {userInput.join(' ')}
                    </div>
                  </div>
                )}
              </div>

              {gameState === 'recall' && (
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                      key={num}
                      onClick={() => handleNumberClick(num)}
                      className="p-4 text-2xl font-bold bg-gray-600 hover:bg-gray-500 rounded-xl transition-all duration-200 transform hover:scale-105"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}

              <p className="mt-6 text-lg opacity-80">
                {gameState === 'memorize' ? 'Memorize the numbers...' : 'Click the numbers in order...'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}