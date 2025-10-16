import React, { useState, useEffect, useCallback } from "react";

const SYMBOLS = ["🔵", "🔴", "🟢", "🟡", "🟣"];
const MAX_ROUNDS = 10;
const REVEAL_DURATION = 500;
const PAUSE_DURATION = 200;

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

export default function PatternGame({ onGameComplete, onNextGame }) {
  const [pattern, setPattern] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameState, setGameState] = useState('IDLE');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [feedback, setFeedback] = useState(null);
  const [theme, setTheme] = useState(THEMES.DARK);

  const generatePattern = useCallback((currentRound) => {
    const patternLength = Math.min(currentRound + 2, 8); 
    let newPattern = [];
    for (let i = 0; i < patternLength; i++) {
      newPattern.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    }
    return newPattern;
  }, []);

  const startReveal = useCallback(() => {
    setGameState('REVEAL');
    setUserInput([]);
    setFeedback(null);

    const currentPattern = generatePattern(round);
    setPattern(currentPattern);

    let i = 0;
    const revealTimer = setInterval(() => {
      if (i < currentPattern.length) {
        setHighlightedIndex(i);
        setTimeout(() => {
          setHighlightedIndex(-1);
        }, REVEAL_DURATION);
        i++;
      } else {
        clearInterval(revealTimer);
        setTimeout(() => {
          setGameState('INPUT');
        }, PAUSE_DURATION);
      }
    }, REVEAL_DURATION + PAUSE_DURATION);
  }, [round, generatePattern]);

  const endGame = (isSuccess = true) => {
    const gameData = {
      game_type: 'pattern_memory',
      total_score: score,
      max_round: isSuccess ? MAX_ROUNDS : round,
      rounds_completed: isSuccess ? MAX_ROUNDS : round - 1,
      completed_at: new Date().toISOString()
    };

    if (onGameComplete) {
      onGameComplete(gameData);
    }
    setGameState('GAME_OVER');
  };

  // Start the reveal sequence when round changes
  useEffect(() => {
    if (round > 0 && round <= MAX_ROUNDS && gameState === 'IDLE') {
      startReveal();
    } else if (round > MAX_ROUNDS) {
      endGame(true);
    }
  }, [round, gameState, startReveal]);

  function handleSymbolClick(symbol) {
    if (gameState !== 'INPUT') return;

    const nextInput = [...userInput, symbol];
    setUserInput(nextInput);

    const currentIndex = nextInput.length - 1;
    const correct = symbol === pattern[currentIndex];

    if (!correct) {
      setFeedback('INCORRECT');
      setTimeout(() => {
        endGame(false);
      }, 1000);
      return;
    }

    if (nextInput.length === pattern.length) {
      setFeedback('CORRECT');
      const points = pattern.length * 5;
      setScore(s => s + points);
      
      setHighlightedIndex(-2);
      setTimeout(() => setHighlightedIndex(-1), 500);

      setTimeout(() => {
        if (round < MAX_ROUNDS) {
          setRound(r => r + 1);
          setGameState('IDLE');
        } else {
          endGame(true);
        }
      }, 1000);
    }
  }

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

  const renderPatternDisplay = () => (
    <div className={`text-5xl mb-8 flex justify-center h-16 transition-all duration-300 ${gameState === 'INPUT' ? 'opacity-30 blur-sm' : 'opacity-100'}`}>
      {pattern.map((s, i) => (
        <span
          key={i}
          className={`mx-2 p-2 rounded-lg transition-all duration-${REVEAL_DURATION} ease-in-out
            ${highlightedIndex === i ? 'scale-125 shadow-xl bg-white/50 drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]' : 'scale-100'}
            ${highlightedIndex === -2 ? 'animate-pop-up' : ''}
            `}
        >
          {s}
        </span>
      ))}
    </div>
  );
  
  const renderUserInputDisplay = () => (
    <div className="text-4xl mb-8 h-10 flex justify-center font-mono">
      {gameState === 'INPUT' 
        ? <span className="opacity-70">Click the symbols in order...</span>
        : <span className="opacity-70">Wait for the pattern...</span>
      }
    </div>
  );
  
  const renderInputButtons = () => (
    <div className="flex gap-4 justify-center flex-wrap">
      {SYMBOLS.map(s => (
        <button
          key={s}
          onClick={() => handleSymbolClick(s)}
          disabled={gameState !== 'INPUT'}
          className={`px-8 py-5 rounded-3xl font-bold text-3xl shadow-xl transition duration-200 
            bg-gradient-to-br from-indigo-500 to-purple-600 ${theme.buttonBase}
            transform active:scale-95 
            ${gameState === 'INPUT' ? 'hover:scale-110 animate-pulse-slow' : 'opacity-50 cursor-not-allowed'}
            `}
        >
          {s}
        </button>
      ))}
    </div>
  );

  const renderFeedback = () => {
    let message = `Round ${round} of ${MAX_ROUNDS}`;
    let style = "opacity-80";

    if (feedback === 'CORRECT') {
      message = `✅ PERFECT! +${pattern.length * 5} points!`;
      style = "text-green-400 scale-110 drop-shadow-[0_0_10px_rgba(50,255,50,0.8)] animate-bounce";
    } else if (feedback === 'INCORRECT') {
      message = `❌ MISTAKE! Pattern: ${pattern.join('')}`;
      style = "text-red-500 scale-125 drop-shadow-[0_0_10px_rgba(255,50,50,0.8)] animate-shake";
    }

    return (
      <p className={`mt-6 text-3xl font-mono transition-transform duration-300 ${style}`}>
        {message}
      </p>
    );
  };

  const renderGameOver = () => {
    const maxPossibleScore = Array.from({length: MAX_ROUNDS}, (_, i) => (i + 3) * 5).reduce((a, b) => a + b, 0);
    const percentage = (score / maxPossibleScore) * 100;
    const isSuccess = round > MAX_ROUNDS;

    return (
      <div className="animate-fade-in opacity-90">
        <h3 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
          {isSuccess ? 'Challenge Complete!' : 'Game Over!'}
        </h3>
        
        {/* Score Display */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 mb-6">
          <div className="text-5xl font-black text-center text-white">
            Final Score: {score}
          </div>
          <div className="text-lg text-white/80 text-center mt-2">
            {isSuccess ? 'All rounds completed!' : `Reached Round ${round}`}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center mb-6">
          <div className="p-4 bg-gray-700/50 rounded-xl">
            <div className="text-2xl font-bold text-green-400">{percentage.toFixed(1)}%</div>
            <div className="text-sm opacity-80">Performance</div>
          </div>
          <div className="p-4 bg-gray-700/50 rounded-xl">
            <div className="text-2xl font-bold text-blue-400">
              {isSuccess ? MAX_ROUNDS : round}
            </div>
            <div className="text-sm opacity-80">Rounds Completed</div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => {
              setScore(0);
              setRound(1);
              setGameState('IDLE');
              setFeedback(null);
            }}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-bold transition-all duration-300 text-white transform hover:scale-105"
          >
            🔄 Play Again
          </button>
          {onNextGame && (
            <button
              onClick={onNextGame}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl font-bold transition-all duration-300 text-white transform hover:scale-105"
            >
              Next Game →
            </button>
          )}
        </div>
      </div>
    );
  };

  if (gameState === 'IDLE' && round === 1) {
    return (
      <div className={`min-h-screen p-8 flex items-center justify-center ${theme.background}`}>
        <div className="relative w-full max-w-xl">
          <div className="flex justify-end mb-4">
            <ThemeSelector />
          </div>
          <div className={`p-8 rounded-xl ${theme.card} text-center ${theme.text}`}>
            <h2 className={`text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r ${theme.headingGradient}`}>
              🧠 Sequence Recall Test
            </h2>
            <p className="text-xl mb-6">Memorize and repeat the pattern of symbols</p>
            <button
              onClick={() => startReveal()}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:scale-105"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-8 flex items-center justify-center ${theme.background}`}>
      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-10px); } 40%, 80% { transform: translateX(10px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
        .animate-pulse-slow { animation: pulse-slow 2s infinite; }
        @keyframes pop-up { 0% { transform: scale(1); } 50% { transform: scale(1.3) rotate(5deg); } 100% { transform: scale(1); } }
        .animate-pop-up { animation: pop-up 0.5s ease-out; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
      `}</style>

      <div className="relative w-full max-w-xl">
        <div className="flex justify-end mb-4">
          <ThemeSelector />
        </div>

        <div className={`p-8 rounded-xl ${theme.card} text-center ${theme.text}`}>
          <h2 className={`text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r ${theme.headingGradient}`}>
            🧠 Sequence Recall Test
          </h2>

          {gameState === 'GAME_OVER' ? (
            renderGameOver()
          ) : (
            <>
              {renderPatternDisplay()}
              {renderUserInputDisplay()}
              {renderInputButtons()}
              <p className="mt-6 text-3xl font-mono">
                ⭐ Score: {score} | Round: {round}/{MAX_ROUNDS}
              </p>
              {renderFeedback()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}