import React, { useState, useEffect, useRef } from "react";

const COLORS = ["red", "blue", "green", "yellow", "purple", "orange"];
const TOTAL_ROUNDS = 12;

const THEMES = {
  DARK: {
    name: "Dark Mode",
    background: "bg-gradient-to-br from-gray-900 to-gray-800",
    text: "text-white",
    card: "bg-gray-800/80 backdrop-blur-lg shadow-2xl border border-gray-700",
    headingGradient: "from-blue-400 to-purple-600",
    buttonBase: "text-white border-0",
    buttonHover: "hover:scale-105 hover:shadow-lg",
    switcherBase: "bg-gray-700 text-yellow-300 hover:bg-gray-600",
    icon: "🌙",
    progressBar: "bg-gradient-to-r from-blue-500 to-purple-600"
  },
  LIGHT: {
    name: "Light Mode",
    background: "bg-gradient-to-br from-blue-50 to-cyan-100",
    text: "text-gray-900",
    card: "bg-white/80 backdrop-blur-lg shadow-xl border border-gray-200",
    headingGradient: "from-blue-600 to-cyan-500",
    buttonBase: "text-gray-800 border border-gray-300",
    buttonHover: "hover:shadow-md",
    switcherBase: "bg-white text-orange-400 border border-gray-300 hover:bg-gray-100",
    icon: "☀️",
    progressBar: "bg-gradient-to-r from-cyan-500 to-blue-600"
  },
};

export default function StroopGame({ onGameComplete, onNextGame }) {
  const [trial, setTrial] = useState(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [lastChoiceCorrect, setLastChoiceCorrect] = useState(null);
  const [theme, setTheme] = useState(THEMES.DARK);
  const [gamePhase, setGamePhase] = useState("instructions"); // "instructions", "playing", "results"

  const timerRef = useRef();
  const trialDataRef = useRef([]);

  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function generateStroopTrial() {
    const word = getRandomElement(COLORS);
    let color = getRandomElement(COLORS);
    
    const isIncongruent = Math.random() < 0.7;
    if (isIncongruent) {
      while (color === word) {
        color = getRandomElement(COLORS);
      }
    }
    
    return { word, color, isIncongruent };
  }

  function nextTrial() {
    if (round >= TOTAL_ROUNDS) {
      endGame();
      return;
    }

    const newTrial = generateStroopTrial();
    setTrial(newTrial);
    setRound((r) => r + 1);
    timerRef.current = Date.now();
    setLastChoiceCorrect(null);
  }

  function endGame() {
    const gameData = {
      game_type: 'stroop',
      total_score: score,
      total_rounds: TOTAL_ROUNDS,
      accuracy: (trialDataRef.current.filter(t => t.isCorrect).length / TOTAL_ROUNDS) * 100,
      average_reaction_time: trialDataRef.current
        .filter(t => t.isCorrect)
        .reduce((sum, t) => sum + t.reactionTime, 0) / Math.max(trialDataRef.current.filter(t => t.isCorrect).length, 1),
      trial_data: trialDataRef.current,
      completed_at: new Date().toISOString()
    };

    if (onGameComplete) {
      onGameComplete(gameData);
    }

    setGamePhase("results");
  }

  // REMOVED the problematic useEffect that was causing auto-play

  function handleChoice(choice) {
    if (gamePhase !== "playing" || !trial) return;

    const rt = (Date.now() - timerRef.current) / 1000;
    const isCorrect = choice === trial.color;
    let points = 0;

    if (isCorrect) {
      const speedBonus = Math.max(1, 8 - rt);
      const difficultyBonus = trial.isIncongruent ? 2 : 1;
      points = speedBonus * difficultyBonus;
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
      color: trial.color,
      isIncongruent: trial.isIncongruent,
      userChoice: choice,
      isCorrect,
      reactionTime: rt,
      points: isCorrect ? points : 0,
    });

    setTimeout(() => {
      if (round < TOTAL_ROUNDS) {
        nextTrial();
      } else {
        endGame();
      }
    }, 600);
  }

  function startGame() {
    setRound(0);
    setScore(0);
    setTrial(null);
    setLastChoiceCorrect(null);
    trialDataRef.current = [];
    setGamePhase("playing");
    // Start the first trial immediately when game begins
    setTimeout(() => nextTrial(), 100);
  }

  function resetGame() {
    setGamePhase("instructions");
    setRound(0);
    setScore(0);
    setTrial(null);
    setLastChoiceCorrect(null);
    trialDataRef.current = [];
  }

  const progress = (round / TOTAL_ROUNDS) * 100;

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

  const renderInstructions = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h2 className={`text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${theme.headingGradient}`}>
          🎯 Stroop Test
        </h2>
        <p className="text-xl opacity-90">
          Identify the <span className="font-bold">COLOR</span> of the word, not the word itself.
        </p>
      </div>

      <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-400 mb-3">How to Play:</h3>
        <div className="text-left space-y-2 text-sm">
          <p>• Click the button that matches the <strong>text color</strong></p>
          <p>• Ignore the actual word meaning</p>
          <p>• Be fast and accurate for more points</p>
          <p>• <span className="text-red-400">Challenge</span> rounds have mismatched colors</p>
        </div>
      </div>

      <button
        onClick={startGame}
        className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 text-white shadow-lg"
      >
        Start Test 🚀
      </button>
    </div>
  );

  const renderGame = () => {
    if (!trial) {
      return (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-xl">Loading...</p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Progress and Score */}
        <div className="space-y-4">
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${theme.progressBar}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="font-mono">Round: {round}/{TOTAL_ROUNDS}</span>
            <span className="font-bold text-yellow-400">Score: {score.toFixed(1)}</span>
          </div>
        </div>

        {/* Word Display */}
        <div className="space-y-6">
          <div
            className={`text-6xl font-black transition-all duration-300 ease-in-out relative
              ${lastChoiceCorrect === true ? "scale-110 text-green-400 drop-shadow-[0_0_30px_rgba(50,250,50,0.8)]" : ""}
              ${lastChoiceCorrect === false ? "shake-effect text-red-400 drop-shadow-[0_0_30px_rgba(250,50,50,0.8)]" : ""}
            `}
            style={{ color: trial.color }}
          >
            {trial.word.toUpperCase()}
            {trial.isIncongruent && (
              <span className="absolute -top-3 -right-3 text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                Challenge
              </span>
            )}
          </div>

          {showScorePopup && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-black text-yellow-300 animate-bounce z-10">
              +{trialDataRef.current[trialDataRef.current.length - 1]?.points.toFixed(1)}! ⚡
            </div>
          )}
        </div>

        {/* Color Buttons */}
        <div className="grid grid-cols-3 gap-3">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => handleChoice(c)}
              className={`p-4 rounded-xl font-bold text-sm shadow-lg transition duration-200 active:scale-95 text-white
                ${c === "red" ? "bg-red-500 hover:bg-red-600" : ""}
                ${c === "blue" ? "bg-blue-500 hover:bg-blue-600" : ""}
                ${c === "green" ? "bg-green-500 hover:bg-green-600" : ""}
                ${c === "yellow" ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900" : ""}
                ${c === "purple" ? "bg-purple-500 hover:bg-purple-600" : ""}
                ${c === "orange" ? "bg-orange-500 hover:bg-orange-600" : ""}
              `}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const trials = trialDataRef.current;
    const correctTrials = trials.filter(t => t.isCorrect);
    const accuracy = (correctTrials.length / TOTAL_ROUNDS) * 100;
    const avgReactionTime = correctTrials.length > 0
      ? correctTrials.reduce((sum, t) => sum + t.reactionTime, 0) / correctTrials.length
      : 0;

    return (
      <div className="text-center space-y-8 animate-fade-in">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-white">
            Test Complete! 🎉
          </h2>
          <p className="text-lg opacity-80">Your cognitive performance results</p>
        </div>

        {/* Big Score Display */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 mx-auto shadow-2xl">
          <div className="text-6xl font-black text-white mb-2">{score.toFixed(1)}</div>
          <div className="text-xl font-bold text-white">Final Score</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-gray-700/80 rounded-xl p-4 border border-gray-600">
            <div className="text-2xl font-bold text-green-400">{accuracy.toFixed(1)}%</div>
            <div className="text-sm text-gray-300 mt-1">Accuracy</div>
          </div>
          <div className="bg-gray-700/80 rounded-xl p-4 border border-gray-600">
            <div className="text-2xl font-bold text-blue-400">{avgReactionTime.toFixed(2)}s</div>
            <div className="text-sm text-gray-300 mt-1">Avg. Time</div>
          </div>
          <div className="bg-gray-700/80 rounded-xl p-4 border border-gray-600">
            <div className="text-2xl font-bold text-purple-400">{correctTrials.length}/{TOTAL_ROUNDS}</div>
            <div className="text-sm text-gray-300 mt-1">Correct</div>
          </div>
          <div className="bg-gray-700/80 rounded-xl p-4 border border-gray-600">
            <div className="text-2xl font-bold text-cyan-400">
              {trials.filter(t => t.isIncongruent && t.isCorrect).length}
            </div>
            <div className="text-sm text-gray-300 mt-1">Challenges</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-4">
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🔄 Play Again
          </button>
          {onNextGame && (
            <button
              onClick={onNextGame}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Next Game →
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen p-4 flex items-center justify-center ${theme.background} ${theme.text}`}>
      <style>{`
        @keyframes shake { 
          0%, 100% { transform: translateX(0); } 
          20%, 60% { transform: translateX(-8px); } 
          40%, 80% { transform: translateX(8px); } 
        }
        .shake-effect { animation: shake 0.4s ease-in-out; }
        @keyframes fade-in { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
      `}</style>
      
      <div className="relative w-full max-w-md">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            NeuroNest 🧠
          </h1>
          <ThemeSelector />
        </div>

        {/* Main Game Card */}
        <div className={`p-8 rounded-2xl ${theme.card} backdrop-blur-lg min-h-[500px] flex items-center justify-center`}>
          {gamePhase === "instructions" && renderInstructions()}
          {gamePhase === "playing" && renderGame()}
          {gamePhase === "results" && renderResults()}
        </div>
      </div>
    </div>
  );
}