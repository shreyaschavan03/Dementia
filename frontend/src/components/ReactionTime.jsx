import React, { useState, useEffect, useCallback, useRef } from "react";

const THEMES = {
  DARK: {
    name: "Dark Mode",
    background: "bg-gradient-to-br from-gray-900 to-gray-800",
    text: "text-white",
    card: "bg-gray-800/80 backdrop-blur-lg shadow-2xl border border-gray-700",
    headingGradient: "from-cyan-400 to-blue-500",
    buttonBase: "text-white",
    switcherBase: "bg-gray-700 text-yellow-300 hover:bg-gray-600",
    icon: "🌙"
  },
  LIGHT: {
    name: "Light Mode",
    background: "bg-gradient-to-br from-blue-50 to-cyan-100",
    text: "text-gray-900",
    card: "bg-white/80 backdrop-blur-lg shadow-xl border border-gray-200",
    headingGradient: "from-cyan-500 to-blue-600",
    buttonBase: "text-gray-800 border border-gray-300",
    switcherBase: "bg-white text-orange-400 border border-gray-300 hover:bg-gray-100",
    icon: "☀️"
  },
};

export default function ReactionTime({ onGameComplete, onNextGame }) {
  const [gameState, setGameState] = useState('IDLE');
  const [reactionTimes, setReactionTimes] = useState([]);
  const [currentReaction, setCurrentReaction] = useState(null);
  const [round, setRound] = useState(1);
  const [theme, setTheme] = useState(THEMES.DARK);
  const [score, setScore] = useState(0);
  
  const startTimeRef = useRef();
  const timeoutRef = useRef();
  const TOTAL_ROUNDS = 5;

  const startRound = useCallback(() => {
    setGameState('WAITING');
    setCurrentReaction(null);
    
    const randomDelay = 1000 + Math.random() * 3000;
    
    timeoutRef.current = setTimeout(() => {
      setGameState('READY');
      startTimeRef.current = Date.now();
    }, randomDelay);
  }, []);

  const endGame = () => {
    const avgTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    const bestTime = Math.min(...reactionTimes);
    
    // Calculate score based on average reaction time (faster = higher score)
    const calculatedScore = Math.max(0, 1000 - avgTime) * 10;
    setScore(calculatedScore);

    const gameData = {
      game_type: 'reaction_time',
      total_score: Math.round(calculatedScore),
      average_time: avgTime,
      best_time: bestTime,
      reaction_times: reactionTimes,
      rounds_completed: TOTAL_ROUNDS,
      completed_at: new Date().toISOString()
    };

    if (onGameComplete) {
      onGameComplete(gameData);
    }
    setGameState('COMPLETED');
  };

  const handleScreenClick = () => {
    if (gameState === 'IDLE') {
      startRound();
      return;
    }

    if (gameState === 'WAITING') {
      clearTimeout(timeoutRef.current);
      setGameState('TOO_SOON');
      setTimeout(() => startRound(), 2000);
      return;
    }
    
    if (gameState === 'READY') {
      const reactionTime = Date.now() - startTimeRef.current;
      setReactionTimes(prev => [...prev, reactionTime]);
      setCurrentReaction(reactionTime);
      setGameState('RESULT');
      
      setTimeout(() => {
        if (round < TOTAL_ROUNDS) {
          setRound(prev => prev + 1);
          startRound();
        } else {
          endGame();
        }
      }, 1500);
    }

    if (gameState === 'RESULT' || gameState === 'TOO_SOON') {
      // Continue to next round
      if (round < TOTAL_ROUNDS) {
        setRound(prev => prev + 1);
        startRound();
      }
    }
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

  const getScreenContent = () => {
    switch (gameState) {
      case 'IDLE':
        return {
          text: 'Click anywhere to start',
          bgColor: 'bg-gradient-to-br from-blue-500 to-purple-600',
          textColor: 'text-white',
          animation: ''
        };
      case 'WAITING':
        return {
          text: 'Wait for the screen to turn green...',
          bgColor: 'bg-gradient-to-br from-red-500 to-orange-500',
          textColor: 'text-white',
          animation: 'animate-pulse'
        };
      case 'READY':
        return {
          text: 'CLICK NOW!',
          bgColor: 'bg-gradient-to-br from-green-500 to-emerald-600',
          textColor: 'text-white',
          animation: 'animate-pulse-fast'
        };
      case 'TOO_SOON':
        return {
          text: 'Too soon! Wait for green.\nClick to continue...',
          bgColor: 'bg-gradient-to-br from-yellow-500 to-amber-500',
          textColor: 'text-gray-900',
          animation: 'animate-shake'
        };
      case 'RESULT':
        return {
          text: `${currentReaction}ms\nClick to continue...`,
          bgColor: 'bg-gradient-to-br from-blue-400 to-cyan-500',
          textColor: 'text-white',
          animation: ''
        };
      case 'COMPLETED':
        return {
          text: 'Test Complete!',
          bgColor: 'bg-gradient-to-br from-purple-500 to-pink-600',
          textColor: 'text-white',
          animation: ''
        };
      default:
        return {
          text: 'Click to start',
          bgColor: 'bg-gray-500',
          textColor: 'text-white',
          animation: ''
        };
    }
  };

  const screenContent = getScreenContent();

  if (gameState === 'COMPLETED') {
    const avgTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    const bestTime = Math.min(...reactionTimes);

    return (
      <div className={`min-h-screen p-4 flex items-center justify-center ${theme.background}`}>
        <div className="relative w-full max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              NeuroNest 🧠
            </h1>
            <ThemeSelector />
          </div>

          <div className={`p-8 rounded-2xl ${theme.card} backdrop-blur-lg text-center`}>
            <h2 className={`text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r ${theme.headingGradient}`}>
              ⚡ Reaction Time Test
            </h2>

            <div className="space-y-6">
              <h3 className="text-4xl font-black mb-4">Test Complete! 🏆</h3>
              
              {/* Score Display */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 mb-6">
                <div className="text-5xl font-black text-white mb-2">{Math.round(score)}</div>
                <div className="text-xl font-bold text-white">Final Score</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center mb-6">
                <div className="p-4 bg-gray-700/50 rounded-xl">
                  <div className="text-2xl font-bold text-green-400">{avgTime.toFixed(0)}ms</div>
                  <div className="text-sm opacity-80">Average Time</div>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-400">{bestTime}ms</div>
                  <div className="text-sm opacity-80">Best Time</div>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-400">{TOTAL_ROUNDS}</div>
                  <div className="text-sm opacity-80">Rounds Completed</div>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-xl">
                  <div className="text-2xl font-bold text-cyan-400">
                    {reactionTimes.filter(time => time < 300).length}
                  </div>
                  <div className="text-sm opacity-80">Fast Responses</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setReactionTimes([]);
                    setRound(1);
                    setScore(0);
                    setGameState('IDLE');
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen flex items-center justify-center transition-all duration-300 ${screenContent.bgColor} ${screenContent.animation} cursor-pointer`}
      onClick={handleScreenClick}
    >
      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        @keyframes pulse-fast { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .animate-pulse-fast { animation: pulse-fast 0.5s infinite; }
      `}</style>

      <div className="text-center">
        <div className="mb-8">
          <ThemeSelector />
        </div>

        <div className={`text-6xl font-bold mb-4 ${screenContent.textColor} whitespace-pre-line`}>
          {screenContent.text}
        </div>

        {(gameState === 'WAITING' || gameState === 'READY' || gameState === 'RESULT' || gameState === 'TOO_SOON') && (
          <div className="text-xl font-mono text-white/80">
            Round: {round}/{TOTAL_ROUNDS}
            {reactionTimes.length > 0 && (
              <div className="mt-2">
                Last: {reactionTimes[reactionTimes.length - 1]}ms
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}