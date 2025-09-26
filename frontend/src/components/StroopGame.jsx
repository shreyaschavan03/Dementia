import React, { useState, useEffect, useRef, useMemo } from "react";

const COLORS = ["red", "blue", "green", "yellow", "purple", "orange"];
const TOTAL_ROUNDS = 12; 
const STROOP_ROUNDS = 4; 

// --- UPDATED THEME DEFINITIONS ---
const THEMES = {
  DARK: {
    name: "Dark Mode",
    background: "bg-gray-900",
    text: "text-white",
    card: "bg-gray-800 shadow-2xl",
    headingGradient: "from-pink-500 to-yellow-500",
    buttonBase: "text-white",
    buttonHover: "hover:scale-105",
    switcherBase: "bg-gray-700 text-yellow-300 hover:bg-gray-600",
    icon: "🌙"
  },
  LIGHT: {
    name: "Light Mode",
    background: "bg-gray-100",
    text: "text-gray-900",
    card: "bg-white shadow-xl border border-gray-200",
    headingGradient: "from-blue-600 to-cyan-500",
    buttonBase: "text-gray-800 border border-gray-300",
    buttonHover: "hover:shadow-md",
    switcherBase: "bg-white text-orange-400 border border-gray-300 hover:bg-gray-100",
    icon: "☀️"
  },
};

export default function StroopGame() {
  // --- State Variables ---
  const [trial, setTrial] = useState(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [isGameActive, setIsGameActive] = useState(true);
  const [lastChoiceCorrect, setLastChoiceCorrect] = useState(null);
  const [theme, setTheme] = useState(THEMES.DARK); 

  // --- Refs & Data ---
  const timerRef = useRef();
  const trialDataRef = useRef([]); 

  // --- Helper Functions ---
  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function nextTrial() {
    if (round >= TOTAL_ROUNDS) {
      setIsGameActive(false);
      return;
    }

    const word = getRandomElement(COLORS);
    const color = getRandomElement(COLORS);
    setTrial({ word, color });
    setRound((r) => r + 1);
    timerRef.current = Date.now();
    setLastChoiceCorrect(null);
  }

  // --- Effects ---
  useEffect(() => { nextTrial(); }, []);

  // --- Handlers ---
  function handleChoice(choice) {
    if (!isGameActive || !trial) return;

    const rt = (Date.now() - timerRef.current) / 1000;
    const isCorrect = choice === trial.color;
    let points = 0;

    if (isCorrect) {
      points = Math.max(1, 5 - rt);
      setScore((s) => s + points);
      setLastChoiceCorrect(true);
      setShowScorePopup(true);
      setTimeout(() => setShowScorePopup(false), 500);
    } else {
      setLastChoiceCorrect(false);
    }

    trialDataRef.current.push({
      round,
      word: trial.word,
      points: isCorrect ? points : 0,
      // ... other data
    });

    // Short delay before moving to the next trial to allow VFX to show
    setTimeout(() => nextTrial(), 500);
  }

  // --- Calculated Values ---
  const currentSet = Math.ceil(round / STROOP_ROUNDS);
  const totalSets = Math.ceil(TOTAL_ROUNDS / STROOP_ROUNDS);

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

  // --- Render Functions ---

  const renderGame = () => (
    <>
      <div className={`text-xl font-mono mb-4 ${theme.text}/70`}>
        Set: **{currentSet}** / {totalSets} | Round: **{round}** / {TOTAL_ROUNDS}
      </div>

      {/* Word Display with Smoke Effect on Correct Answer */}
      <div
        className={`text-6xl font-extrabold mb-10 transition-all duration-300 ease-in-out relative
          ${lastChoiceCorrect === true ? "scale-110 shadow-green-500/80 drop-shadow-[0_0_30px_rgba(50,250,50,0.8)] animate-pulse" : ""}
          ${lastChoiceCorrect === false ? "shake-effect shadow-red-500/80 drop-shadow-[0_0_30px_rgba(250,50,50,0.8)]" : ""}
          ${theme.text}
          `}
        style={{ color: trial.color, animation: lastChoiceCorrect === null ? "flash 1.5s infinite" : "none" }}
      >
        {trial.word.toUpperCase()}

        {/* --- SMOKE EFFECT ELEMENT (NEW) --- */}
        {lastChoiceCorrect === true && (
             <span 
                className="absolute inset-0 z-0 animate-smoke"
                // The pseudo-element used in CSS will create the visual smoke/mist effect
                aria-hidden="true" 
             />
        )}
      </div>

      {/* VFX for Correct Answer Pop-up */}
      {showScorePopup && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-black text-yellow-300 drop-shadow-[0_0_15px_rgba(255,255,0,1)] animate-pop-up z-10">
          +{(Math.max(1, 5 - (Date.now() - timerRef.current) / 1000)).toFixed(1)}! ⚡
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 justify-center flex-wrap">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => handleChoice(c)}
            className={`px-6 py-4 rounded-xl font-bold text-xl shadow-lg transition duration-200 active:scale-95 ${theme.buttonBase} ${theme.buttonHover}
              ${c === "red" ? "bg-red-500 hover:bg-red-600" : ""}
              ${c === "blue" ? "bg-blue-500 hover:bg-blue-600" : ""}
              ${c === "green" ? "bg-green-500 hover:bg-green-600" : ""}
              ${c === "yellow" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
              ${c === "purple" ? "bg-purple-500 hover:bg-purple-600" : ""}
              ${c === "orange" ? "bg-orange-500 hover:bg-orange-600" : ""}
            `}
          >
            {c.toUpperCase()}
          </button>
        ))}
      </div>
    </>
  );

  const renderFinalScore = () => {
    const correctTrials = trialDataRef.current.filter(t => t.isCorrect);
    const avgReactionTime = correctTrials.length > 0
      ? correctTrials.reduce((sum, t) => sum + t.reactionTime, 0) / correctTrials.length
      : 0;

    return (
      <div className={`text-center p-8 rounded-xl ${theme.card} animate-fade-in`}>
        <h2 className="text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
          🎉 Test Complete! 🎉
        </h2>
        <p className={`text-5xl font-extrabold mb-4 ${theme.text}`}>
          Total Score: <span className="text-yellow-400">{score.toFixed(1)}</span>
        </p>
        <p className={`text-2xl font-mono ${theme.text}/80`}>
          Correct Responses: **{correctTrials.length}** / {TOTAL_ROUNDS}
        </p>
        <p className={`text-2xl font-mono ${theme.text}/80 mb-8`}>
          Average Reaction Time: **{avgReactionTime.toFixed(3)}s**
        </p>
        <button
          onClick={() => {
            setRound(0); setScore(0); setIsGameActive(true); trialDataRef.current = []; nextTrial();
          }}
          className="px-8 py-3 mt-4 text-xl font-bold rounded-full bg-green-500 hover:bg-green-600 transition duration-300 text-white shadow-lg transform hover:scale-105"
        >
          Start New Test 🔄
        </button>
      </div>
    );
  };

  // --- Main Render ---

  if (!trial && isGameActive) return null;

  return (
    <div className={`min-h-screen p-8 flex items-center justify-center ${theme.background}`}>
      {/* --- SMOKE EFFECT CSS (NEW) --- */}
      <style>{`
        /* Existing Keyframes */
        @keyframes pop-up { 0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); } 50% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); } 100% { opacity: 0; transform: translate(-50%, -50%) scale(2); } }
        .animate-pop-up { animation: pop-up 0.5s ease-out forwards; }
        @keyframes flash { 0%, 100% { opacity: 1; } 50% { opacity: 0.9; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-10px); } 40%, 80% { transform: translateX(10px); } }
        .shake-effect { animation: shake 0.4s ease-in-out; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }

        /* --- SMOKE/MIST KEYFRAMES (NEW) --- */
        @keyframes smoke-puff {
            0% { 
                opacity: 0; 
                transform: translateY(0) scale(1); 
                filter: blur(0);
            }
            25% { 
                opacity: 0.8; 
                filter: blur(2px);
            }
            100% { 
                opacity: 0; 
                transform: translateY(-50px) scale(1.5); 
                filter: blur(5px);
            }
        }
        
        .animate-smoke::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.4); /* White mist color */
            border-radius: 50%; /* Shape the smoke */
            z-index: -1;
            animation: smoke-puff 0.8s ease-out forwards;
            pointer-events: none; /* Ensure it doesn't block clicks */
        }
      `}</style>
      
      <div className="relative w-full max-w-xl">
        <div className="flex justify-end mb-4">
            <ThemeSelector />
        </div>

        <div className={`p-8 rounded-xl ${theme.card} text-center`}>
            
            {/* Heading */}
            <h2 className={`text-4xl font-extrabold mb-6 animate-bounce
            text-transparent bg-clip-text bg-gradient-to-r ${theme.headingGradient}
            drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]`}>
            🧠 Professional Stroop Assessment
            </h2>

            {/* Content Switcher */}
            {isGameActive ? renderGame() : renderFinalScore()}
        </div>
      </div>
    </div>
  );
}