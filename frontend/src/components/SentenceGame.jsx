import React, { useState, useEffect, useCallback } from "react";

// --- THEME DEFINITIONS ---
const THEMES = {
  DARK: {
    name: "Dark Mode",
    background: "bg-gray-900",
    text: "text-white", 
    card: "bg-gray-800 shadow-2xl",
    headingGradient: "from-yellow-400 to-red-500",
    buttonBase: "text-white",
    switcherBase: "bg-gray-700 text-yellow-300 hover:bg-gray-600",
    icon: "🌙"
  },
  LIGHT: {
    name: "Light Mode",
    background: "bg-gray-100",
    text: "text-gray-900", // Dark text for light backgrounds
    card: "bg-white shadow-xl border border-gray-200",
    headingGradient: "from-blue-600 to-indigo-700",
    buttonBase: "text-gray-800 border border-gray-300",
    switcherBase: "bg-white text-orange-400 border border-gray-300 hover:bg-gray-100",
    icon: "☀️"
  },
};

// --- EXPANDED QUESTION BANK ---
const ALL_SENTENCES = [
  { id: 1, question: "The Earth is flat.", options: ["True", "False"], answer: "False" },
  { id: 2, question: "A decade is 10 years.", options: ["True", "False"], answer: "True" },
  { id: 3, question: "A square has five sides.", options: ["True", "False"], answer: "False" },
  { id: 4, question: "The boiling point of water is 100°C.", options: ["True", "False"], answer: "True" },
  { id: 5, question: "All birds can fly.", options: ["True", "False"], answer: "False" },
  { id: 6, question: "Red and blue make purple.", options: ["True", "False"], answer: "True" },
  { id: 7, question: "The currency of Japan is the Euro.", options: ["True", "False"], answer: "False" },
  { id: 8, question: "Spiders are insects.", options: ["True", "False"], answer: "False" },
  { id: 9, question: "Mount Everest is the tallest mountain in the world.", options: ["True", "False"], answer: "True" },
  { id: 10, question: "Cold water freezes faster than hot water.", options: ["True", "False"], answer: "False" },
];

const TOTAL_QUESTIONS = 5;
const POINTS_PER_CORRECT = 100;

export default function SentenceGame() {
  // --- State Variables ---
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('PLAYING');
  const [feedback, setFeedback] = useState(null);
  const [theme, setTheme] = useState(THEMES.DARK);

  // --- Helper: Prepare Random Questions ---
  const initializeGame = useCallback(() => {
    const shuffled = ALL_SENTENCES.sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, TOTAL_QUESTIONS));
    setCurrent(0);
    setScore(0);
    setGameState('PLAYING');
    setFeedback(null);
  }, []);

  // --- Effects ---
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // --- Handlers ---
  function handleChoice(choice) {
    if (gameState !== 'PLAYING' || feedback !== null) return;

    const currentQuestion = questions[current];
    const isCorrect = choice === currentQuestion.answer;

    if (isCorrect) {
      setScore(s => s + POINTS_PER_CORRECT);
      setFeedback('CORRECT');
    } else {
      setFeedback('INCORRECT');
    }

    // Delay move to next question to show feedback
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
        setFeedback(null);
      } else {
        setGameState('GAME_OVER');
      }
    }, 800);
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


  // --- Render Functions ---

  const renderGameContent = () => {
    const currentQuestion = questions[current];
    
    // Dynamic classes based on feedback and theme
    const baseQuestionStyle = theme === THEMES.DARK 
      ? 'bg-gray-700/60 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]'
      : 'bg-gray-200/60 shadow-md border border-gray-300';

    // FIX 1: Removed explicit theme.text from questionClass because it's applied on the parent container now.
    const questionClass = `text-3xl mb-10 font-medium transition-all duration-300 p-4 rounded-lg 
      ${feedback === 'CORRECT' ? 'bg-green-600/80 shadow-green-400 drop-shadow-[0_0_20px_rgba(50,250,50,0.8)] animate-pulse' : ''}
      ${feedback === 'INCORRECT' ? 'bg-red-600/80 shadow-red-400 drop-shadow-[0_0_20px_rgba(250,50,50,0.8)] animate-shake' : ''}
      ${feedback === null ? baseQuestionStyle : ''}`;

    return (
      <>
        {/* Question Display */}
        <div className={questionClass}>
          {currentQuestion.question}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          {currentQuestion.options.map(opt => (
            <button
              key={opt}
              onClick={() => handleChoice(opt)}
              disabled={feedback !== null}
              className={`px-8 py-4 rounded-full font-bold text-xl shadow-lg
                bg-gradient-to-r from-blue-500 to-indigo-600 ${theme.buttonBase}
                transform transition duration-200 active:scale-95
                ${feedback !== null ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-[0_0_20px_rgba(100,100,255,0.8)]'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </>
    );
  };

  const renderScoreDisplay = () => {
    // FIX 2: Removed dynamic color application, relying on parent container for base text color.
    // Use opacity to control lightness/darkness in neutral state.
    const baseColor = feedback === 'CORRECT' ? "text-green-400 drop-shadow-[0_0_20px_rgba(50,255,50,0.9)]" :
                      feedback === 'INCORRECT' ? "text-red-500" :
                      "opacity-90"; // Base opacity (inherits correct theme color from parent)

    const animationClass = feedback === 'CORRECT' ? "scale-110 animate-bounce" :
                           feedback === 'INCORRECT' ? "scale-100" :
                           "scale-100";

    return (
        <p className={`mt-8 text-3xl font-mono transition-transform duration-300 ${baseColor} ${animationClass}`}>
            ⭐ Score: 
            <span className="text-yellow-400 font-extrabold mx-1">
                {score}
            </span>
            | Question: {current + 1}/{questions.length}
        </p>
    );
  };

  const renderGameOver = () => (
    // FIX 3: Removed explicit theme.text from here as well.
    <div className={`animate-fade-in p-6 rounded-xl opacity-90`}>
      <h3 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
        Test Complete! 🏆
      </h3>
      {/* The final score line needs the explicit theme color because it's often overridden */}
      <p className={`text-4xl font-extrabold mb-6 ${theme.text}`}> 
        Final Score: <span className="text-yellow-400">{score}</span>
      </p>
      <button
        onClick={initializeGame}
        className="px-8 py-3 mt-4 text-xl font-bold rounded-full bg-blue-500 hover:bg-blue-600 transition duration-300 text-white shadow-lg transform hover:scale-105"
      >
        Play Again
      </button>
    </div>
  );
  
  if (questions.length === 0) return null;

  return (
    <div className={`min-h-screen p-8 flex items-center justify-center ${theme.background}`}>
      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-10px); } 40%, 80% { transform: translateX(10px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
      `}</style>

      <div className="relative text-center w-full max-w-lg">
        {/* Theme Selector Positioned Above the Card */}
        <div className="flex justify-end mb-4">
            <ThemeSelector />
        </div>

        {/* THIS IS THE CRITICAL FIX: Applying theme.text to the main card container */}
        <div className={`p-6 rounded-xl ${theme.card} shadow-2xl ${theme.text}`}>
          
          {/* Heading with Dynamic Gradient */}
          <h2 className={`text-4xl font-extrabold mb-8 animate-bounce
            text-transparent bg-clip-text bg-gradient-to-r ${theme.headingGradient}
            drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]`}>
            🧠 Truth or Lie Challenge
          </h2>

          {/* Game Content */}
          {gameState === 'PLAYING' && current < questions.length ? (
            <>
              {renderGameContent()}
              {renderScoreDisplay()}
            </>
          ) : (
            renderGameOver()
          )}
        </div>
      </div>
    </div>
  );
}