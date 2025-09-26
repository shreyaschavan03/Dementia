import React, { useState, useEffect, useCallback, useMemo } from "react";

// Constants for game settings
const SYMBOLS = ["🔵", "🔴", "🟢", "🟡", "🟣"];
const MAX_ROUNDS = 10;
const REVEAL_DURATION = 500; // ms to show each symbol
const PAUSE_DURATION = 200; // ms pause between symbols

// --- THEME DEFINITIONS ---
const THEMES = {
  DARK: {
    name: "Dark Mode",
    background: "bg-gray-900",
    text: "text-white", // Text color for Dark Mode
    card: "bg-gray-800 shadow-2xl",
    headingGradient: "from-green-400 to-blue-500",
    buttonBase: "text-white",
    switcherBase: "bg-gray-700 text-yellow-300 hover:bg-gray-600",
    icon: "🌙"
  },
  LIGHT: {
    name: "Light Mode",
    background: "bg-gray-100",
    text: "text-gray-900", // Text color for Light Mode (Dark text)
    card: "bg-white shadow-xl border border-gray-200",
    headingGradient: "from-teal-500 to-green-600",
    buttonBase: "text-gray-800 border border-gray-300",
    switcherBase: "bg-white text-orange-400 border border-gray-300 hover:bg-gray-100",
    icon: "☀️"
  },
};

export default function PatternGame() {
  // --- State Variables ---
  const [pattern, setPattern] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [gameState, setGameState] = useState('IDLE'); // IDLE, REVEAL, INPUT, GAME_OVER
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // For reveal animation
  const [feedback, setFeedback] = useState(null); // 'CORRECT', 'INCORRECT'
  const [theme, setTheme] = useState(THEMES.DARK); // NEW THEME STATE

  // --- Helper: Dynamic Pattern Generation ---
  const generatePattern = useCallback((currentRound) => {
    const patternLength = Math.min(currentRound + 2, 8); 
    let newPattern = [];
    for (let i = 0; i < patternLength; i++) {
      newPattern.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    }
    return newPattern;
  }, []);

  // --- Core Game Logic: Pattern Reveal ---
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

  // --- Effects ---

  // Start the game on mount
  useEffect(() => {
    if (gameState === 'IDLE' && round === 0) {
      setRound(1);
    }
  }, [gameState, round]);

  // Start the reveal sequence whenever the round state changes
  useEffect(() => {
    if (round > 0 && round <= MAX_ROUNDS) {
      startReveal();
    } else if (round > MAX_ROUNDS) {
      setGameState('GAME_OVER');
    }
  }, [round, startReveal]);


  // --- Handlers ---

  function handleSymbolClick(symbol) {
    if (gameState !== 'INPUT') return;

    const nextInput = [...userInput, symbol];
    setUserInput(nextInput);

    const currentIndex = nextInput.length - 1;
    const correct = symbol === pattern[currentIndex];

    if (!correct) {
      // 1. Incorrect: End the game immediately
      setFeedback('INCORRECT');
      setGameState('GAME_OVER');
      return;
    }

    // 2. Correct so far: Check if pattern is complete
    if (nextInput.length === pattern.length) {
      setFeedback('CORRECT');
      
      const points = pattern.length * 5; 
      setScore(s => s + points);
      
      setHighlightedIndex(-2); // Special value for 'Perfect' flash
      setTimeout(() => setHighlightedIndex(-1), 500);

      // Move to the next round after a brief celebration
      setTimeout(() => {
        setRound(r => r + 1);
      }, 1000);
    }
  }

  // --- Theme Toggler Component ---
  const ThemeSelector = () => {
    const nextTheme = theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    return (
      <button
        onClick={() => setTheme(nextTheme)}
        title={`Switch to ${nextTheme.name}`}
        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-300 transform active:scale-90 shadow-md
          ${theme.switcherBase}
        `}
      >
        {nextTheme.icon}
      </button>
    );
  };

  // --- RENDER COMPONENTS ---

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
      {/* FIX: Remove theme.text from here and rely on the parent container */}
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
    
    // FIX: Remove theme.text from the base style and rely on the parent container
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

  const renderGameOver = () => (
    // FIX: Removed theme.text/90 from here
    <div className="animate-fade-in opacity-90">
      <h3 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
        {feedback === 'INCORRECT' ? 'Game Over!' : 'Challenge Complete!'}
      </h3>
      {/* FIX: Removed explicit theme.text from this line as well. */}
      <p className="text-4xl font-extrabold mb-6">
        Final Score: <span className="text-yellow-400">{score}</span>
      </p>
      <button
        onClick={() => {
          setScore(0);
          setRound(1);
          setGameState('IDLE');
          setFeedback(null);
        }}
        className="px-8 py-3 mt-4 text-xl font-bold rounded-full bg-blue-500 hover:bg-blue-600 transition duration-300 text-white shadow-lg transform hover:scale-105"
      >
        Play Again
      </button>
    </div>
  );

  // --- Main Render ---

  if (gameState === 'IDLE' && round === 0) return null;

  return (
    <div className={`min-h-screen p-8 flex items-center justify-center ${theme.background}`}>
      {/* CSS Keyframes */}
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
        {/* Theme Selector Positioned Above the Card */}
        <div className="flex justify-end mb-4">
            <ThemeSelector />
        </div>

        {/* CRITICAL FIX: Applying theme.text to the main card container */}
        <div className={`p-8 rounded-xl ${theme.card} text-center ${theme.text}`}>
          
          {/* Heading with Dynamic Gradient */}
          <h2 className={`text-4xl font-extrabold mb-6 animate-bounce
            text-transparent bg-clip-text bg-gradient-to-r ${theme.headingGradient}
            drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]`}>
            🧠 Sequence Recall Test
          </h2>

          {/* Game Content */}
          {gameState === 'GAME_OVER' ? (
            renderGameOver()
          ) : (
            <>
              {renderPatternDisplay()}
              {renderUserInputDisplay()}
              {renderInputButtons()}

              {/* FIX: Removed explicit theme.text from here, relying on parent inheritance */}
              <p className="mt-6 text-3xl font-mono">
                ⭐ Score: {score} | Input: {userInput.length} / {pattern.length}
              </p>
              {renderFeedback()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}