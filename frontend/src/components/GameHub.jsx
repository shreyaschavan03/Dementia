import React, { useState, useEffect } from "react";
import StroopGame from "./StroopGame";
import PatternGame from "./PatternGame";
import SentenceGame from "./SentenceGame";
import MemoryMatrix from "./MemoryMatrix";
import ReactionTime from "./ReactionTime";
import NumberSpan from "./NumberSpan";
import { supabase } from './supabaseClient';

// --- Hub Theme (Simplified for the Hub View) ---
const HUB_THEME = {
    background: "bg-amber-50", 
    text: "text-gray-900",
    cardGradient: "from-blue-600 to-indigo-700",
    cardShadow: "hover:shadow-2xl hover:shadow-indigo-400/50",
    backButton: "bg-indigo-700 hover:bg-indigo-800 text-white",
};

// Game configuration with order and metadata
const GAMES_CONFIG = [
    { 
        id: "stroop", 
        component: StroopGame,
        title: "Attention & Focus", 
        description: "Measure selective attention, reaction time, and cognitive interference.",
        icon: "⏱️"
    },
    { 
        id: "pattern", 
        component: PatternGame,
        title: "Executive Function", 
        description: "Test working memory and sequence recall with pattern recognition tasks.",
        icon: "🧩"
    },
    { 
        id: "sentence", 
        component: SentenceGame,
        title: "Verbal Processing", 
        description: "Assess language comprehension and quick sentence validity checks.",
        icon: "💬"
    },
    { 
        id: "memory", 
        component: MemoryMatrix,
        title: "Visual Memory", 
        description: "Test spatial memory and pattern retention capabilities.",
        icon: "🧠"
    },
    { 
        id: "reaction", 
        component: ReactionTime,
        title: "Reaction Speed", 
        description: "Measure your response time and processing speed.",
        icon: "⚡"
    },
    { 
        id: "numbers", 
        component: NumberSpan,
        title: "Working Memory", 
        description: "Challenge your number retention and recall abilities.",
        icon: "🔢"
    }
];

// --- GameCard Component ---
function GameCard({ title, description, icon, onClick, completed, score }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer ${HUB_THEME.cardGradient} bg-gradient-to-br rounded-2xl p-6 border-b-4 border-indigo-400
        transform transition duration-500 ease-out hover:scale-[1.02] ${HUB_THEME.cardShadow}
        flex flex-col items-start text-left text-white animate-fadeIn relative overflow-hidden`}
    >
      {completed && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          Completed ✅
        </div>
      )}
      <span className="text-4xl mb-3">{icon}</span>
      <h3 className="text-xl font-extrabold mb-1">{title}</h3>
      <p className="text-white/80 text-sm font-light mb-2">{description}</p>
      {completed && score && (
        <div className="text-yellow-300 text-sm font-bold">
          Score: {score}
        </div>
      )}
    </div>
  );
}

// --- Main Hub Component ---
export default function GameHub() {
  const [activeGame, setActiveGame] = useState(null);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [completedGames, setCompletedGames] = useState(new Set());
  const [gameResults, setGameResults] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [currentGameState, setCurrentGameState] = useState('playing');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [userId, setUserId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [showReport, setShowReport] = useState(false);

  // Initialize user and session on component mount
  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = () => {
    // Get or create user ID
    let storedUserId = localStorage.getItem('neuroNestUserId');
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('neuroNestUserId', storedUserId);
    }
    setUserId(storedUserId);

    // Create session ID
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);

    // Load previous results if any
    const savedResults = localStorage.getItem(`neuroNestResults_${storedUserId}`);
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        setGameResults(parsedResults);
        
        // Mark games as completed based on saved results
        const completedIds = new Set(parsedResults.map(result => result.game_id || result.gameId));
        setCompletedGames(completedIds);
      } catch (error) {
        console.error('Error loading saved results:', error);
      }
    }
  };

  const handleGameComplete = async (gameData) => {
    const currentGameId = GAMES_CONFIG[currentGameIndex].id;
    
    console.log('Game completed:', currentGameId, gameData);
    
    // Create the game result object
    const gameResult = {
      game_id: currentGameId,
      game_name: GAMES_CONFIG[currentGameIndex].title,
      user_id: userId,
      session_id: sessionId,
      ...gameData,
      completed_at: new Date().toISOString()
    };
    
    // Update completed games
    setCompletedGames(prev => new Set([...prev, currentGameId]));
    
    // Update game results
    setGameResults(prev => {
      const newResults = prev.filter(result => result.game_id !== currentGameId);
      return [...newResults, gameResult];
    });
    
    // Save to localStorage for persistence
    const resultsToSave = [...gameResults.filter(result => result.game_id !== currentGameId), gameResult];
    localStorage.setItem(`neuroNestResults_${userId}`, JSON.stringify(resultsToSave));
    
    // Save to Supabase
    await saveToSupabase(gameResult);
    
    // Set game state to completed
    setCurrentGameState('completed');
  };

  const saveToSupabase = async (gameData) => {
    try {
      const { data, error } = await supabase
        .from('cognitive_assessments')
        .insert([gameData]);
      
      if (error) {
        console.error('Error saving game data to Supabase:', error);
        await saveToLocalBackup(gameData);
      } else {
        console.log('Game data saved successfully to Supabase');
      }
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      await saveToLocalBackup(gameData);
    }
  };

  const saveToLocalBackup = async (gameData) => {
    const backups = JSON.parse(localStorage.getItem('neuroNestBackups') || '[]');
    backups.push({ 
      ...gameData, 
      backup_time: new Date().toISOString()
    });
    localStorage.setItem('neuroNestBackups', JSON.stringify(backups));
  };

  const handleNextGame = () => {
    console.log('Next game clicked');
    
    if (currentGameIndex < GAMES_CONFIG.length - 1) {
      setCurrentGameIndex(prev => prev + 1);
      setActiveGame(GAMES_CONFIG[currentGameIndex + 1].id);
      setCurrentGameState('playing');
    } else {
      // All games completed
      setShowCompletion(true);
      setActiveGame(null);
    }
  };

  const handleGameSelect = (gameId) => {
    const gameIndex = GAMES_CONFIG.findIndex(game => game.id === gameId);
    setCurrentGameIndex(gameIndex);
    setActiveGame(gameId);
    setCurrentGameState('playing');
  };

  const handleBackToHub = () => {
    setActiveGame(null);
    setShowCompletion(false);
    setShowReport(false);
    setCurrentGameState('playing');
  };

  const handleStartNewAssessment = () => {
    resetAllProgress();
    setShowCompletion(false);
  };

  const resetAllProgress = () => {
    setCompletedGames(new Set());
    setGameResults([]);
    setCurrentGameIndex(0);
    setCurrentGameState('playing');
    setShowResetConfirm(false);
    localStorage.removeItem(`neuroNestResults_${userId}`);
    // Create new session
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  };

  const confirmReset = () => {
    setShowResetConfirm(true);
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
  };

  const handleViewReport = () => {
    setShowReport(true);
  };

  const GameContainer = ({ children }) => (
    <div className="w-full h-full min-h-screen">
      <div className="p-8 absolute top-0 left-0 z-50">
        <button
          onClick={handleBackToHub}
          className={`px-5 py-2 rounded-full font-semibold text-sm shadow-xl transition duration-300
            ${HUB_THEME.backButton} transform hover:scale-105 active:scale-95`}
        >
          ← Back to Hub
        </button>
      </div>
      <div className="animate-slideInDown">
        {children}
      </div>
    </div>
  );

  // Reset Confirmation Modal
  const ResetConfirmationModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Reset All Progress?</h3>
        <p className="text-gray-600 mb-6">
          This will delete all your game scores and progress. This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={cancelReset}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg font-semibold text-white transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={resetAllProgress}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold text-white transition duration-300"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );

  // Report Component
  const Report = () => {
    const overallScore = gameResults.length > 0 
      ? gameResults.reduce((sum, result) => sum + (result.total_score || 0), 0) / gameResults.length 
      : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12 pt-8">
            <h1 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Cognitive Assessment Report 🧠
            </h1>
            <p className="text-xl opacity-80">Comprehensive analysis of your cognitive performance</p>
          </header>

          {/* Overall Score */}
          <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 mb-8">
            <h2 className="text-3xl font-bold mb-6">Overall Performance</h2>
            <div className="text-center">
              <div className="text-6xl font-black mb-4 text-yellow-400">
                {overallScore.toFixed(1)}
              </div>
              <div className="text-2xl font-bold text-green-400">
                Average Score
              </div>
              <p className="text-gray-400 mt-4">
                Based on {gameResults.length} cognitive tests
              </p>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold mb-6">Detailed Test Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {GAMES_CONFIG.map((game) => {
                const result = gameResults.find(r => r.game_id === game.id);
                return (
                  <div key={game.id} className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">{game.icon}</span>
                      <h3 className="text-xl font-bold">{game.title}</h3>
                    </div>
                    {result ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Score:</span>
                          <span className="font-bold text-yellow-400">{result.total_score}</span>
                        </div>
                        {result.accuracy && (
                          <div className="flex justify-between">
                            <span>Accuracy:</span>
                            <span className="font-bold text-green-400">{result.accuracy.toFixed(1)}%</span>
                          </div>
                        )}
                        {result.average_time && (
                          <div className="flex justify-between">
                            <span>Avg Time:</span>
                            <span className="font-bold text-blue-400">{result.average_time.toFixed(2)}s</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-red-400">Not completed</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-8">
            <button
              onClick={handleBackToHub}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:scale-105 mx-4"
            >
              Back to Hub
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render active game
  if (activeGame && !showCompletion && !showReport) {
    const CurrentGame = GAMES_CONFIG[currentGameIndex].component;
    const currentGameResult = gameResults.find(result => result.game_id === GAMES_CONFIG[currentGameIndex].id);
    
    console.log('Rendering game:', GAMES_CONFIG[currentGameIndex].id, 'State:', currentGameState);
    
    return (
      <GameContainer>
        <CurrentGame 
          onGameComplete={handleGameComplete}
          onNextGame={handleNextGame}
        />
      </GameContainer>
    );
  }

  // Show report
  if (showReport) {
    return (
      <GameContainer>
        <Report />
      </GameContainer>
    );
  }

  // Show completion screen
  if (showCompletion) {
    return (
      <div className={`min-h-screen flex items-center justify-center relative overflow-hidden ${HUB_THEME.background}`}>
        {showResetConfirm && <ResetConfirmationModal />}
        
        <div className="relative z-10 w-full max-w-2xl p-8 text-center animate-scaleUp">
          <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl font-black mb-4 text-gray-900">
              Assessment Complete!
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              You've completed all cognitive tests. Your results have been saved to the database.
            </p>
            
            {/* Show individual game scores */}
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-bold mb-3 text-gray-800">Your Scores:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {GAMES_CONFIG.map(game => {
                  const result = gameResults.find(r => r.game_id === game.id);
                  return (
                    <div key={game.id} className="flex justify-between">
                      <span className="text-gray-600">{game.title}:</span>
                      <span className="font-bold text-green-600">
                        {result ? result.total_score : 'N/A'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <p className="text-lg text-gray-500 mb-8">
              Completed: {completedGames.size} of {GAMES_CONFIG.length} tests
            </p>
            <div className="flex flex-col gap-4 justify-center items-center">
              <button
                onClick={handleViewReport}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 text-white w-64"
              >
                View Detailed Report 📊
              </button>
              <button
                onClick={handleStartNewAssessment}
                className="px-8 py-4 bg-gray-600 hover:bg-gray-700 rounded-xl font-bold text-lg transition-all duration-300 text-white w-64"
              >
                Start New Assessment 🔄
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: show hub menu
  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden ${HUB_THEME.background}`}>
      {showResetConfirm && <ResetConfirmationModal />}
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
        @keyframes slideInDown { from { opacity: 0; transform: translateY(-50px); } to { transform: translateY(0); } }
        .animate-slideInDown { animation: slideInDown 0.6s ease-out; }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.9); } to { transform: scale(1); } }
        .animate-scaleUp { animation: scaleUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes subtle-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes glowing-blob { 0% { transform: scale(1) translate(0%, 0%); opacity: 0.1; } 33% { transform: scale(1.2) translate(10%, -10%); opacity: 0.15; } 66% { transform: scale(0.9) translate(-10%, 10%); opacity: 0.12; } 100% { transform: scale(1) translate(0%, 0%); opacity: 0.1; } }
        @keyframes glowing-blob-2 { 0% { transform: scale(0.8) translate(0%, 0%); opacity: 0.08; } 40% { transform: scale(1.1) translate(-15%, 5%); opacity: 0.15; } 80% { transform: scale(0.9) translate(5%, -15%); opacity: 0.1; } 100% { transform: scale(0.8) translate(0%, 0%); opacity: 0.08; } }
      `}</style>
      
      {/* Background elements */}
      <div className="absolute inset-0 bg-radial-gradient z-0 opacity-40"
           style={{ 
             backgroundImage: 'radial-gradient(circle at center, rgba(251, 191, 36, 0.15) 0%, rgba(255, 247, 237, 0) 70%)'
           }}
      />

      <div className={`
            absolute inset-0 z-0
            bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10
            rounded-full filter blur-3xl opacity-40
            animate-[glowing-blob_25s_ease-in-out_infinite_alternate]
            `}/>
      <div className={`
            absolute inset-0 z-0
            bg-gradient-to-tl from-yellow-500/10 via-orange-500/10 to-amber-500/10
            rounded-full filter blur-2xl opacity-30
            animate-[glowing-blob-2_30s_ease-in-out_infinite]
            `} style={{ left: '20%', top: '20%', width: '60%', height: '60%' }}/>

      {/* Main Content */}
      <div className={`
            relative z-10 w-full h-full min-h-screen flex items-center justify-center 
            bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 
            bg-[length:200%_200%] animate-[subtle-shift_20s_ease_infinite]
            `}>

        <div className="w-full max-w-6xl p-8 animate-scaleUp">
          
          {/* Progress Indicator */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <span className="text-sm font-semibold text-gray-700">
                Progress: {completedGames.size} of {GAMES_CONFIG.length} tests completed
              </span>
            </div>
          </div>

          {/* Professional Header */}
          <header className="text-center mb-12">
              <h1 className="text-5xl font-black mb-2 text-gray-900">
                  NeuroNest Cognitive Hub 🧠
              </h1>
              <p className="text-lg text-gray-600 font-light mb-4">
                  Complete all assessments for a comprehensive cognitive profile.
              </p>
              
              {/* Action Buttons */}
              <div className="flex gap-3 justify-center items-center flex-wrap">
                {completedGames.size > 0 && (
                  <button
                    onClick={handleViewReport}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105"
                  >
                    View Current Report 📊
                  </button>
                )}
                
                {completedGames.size > 0 && (
                  <button
                    onClick={confirmReset}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105"
                  >
                    Reset All Progress 🗑️
                  </button>
                )}
              </div>
          </header>

          {/* Game Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GAMES_CONFIG.map((game) => {
              const gameResult = gameResults.find(result => result.game_id === game.id);
              return (
                <GameCard
                  key={game.id}
                  title={game.title}
                  description={game.description}
                  icon={game.icon}
                  completed={completedGames.has(game.id)}
                  score={gameResult?.total_score}
                  onClick={() => handleGameSelect(game.id)}
                />
              );
            })}
          </div>

          {/* Start Sequential Assessment Button */}
          {completedGames.size < GAMES_CONFIG.length && (
            <div className="text-center mt-12">
              <button
                onClick={() => {
                  const nextUncompletedIndex = GAMES_CONFIG.findIndex(game => !completedGames.has(game.id));
                  setCurrentGameIndex(nextUncompletedIndex !== -1 ? nextUncompletedIndex : 0);
                  setActiveGame(GAMES_CONFIG[nextUncompletedIndex !== -1 ? nextUncompletedIndex : 0].id);
                }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg text-white shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {completedGames.size === 0 ? 'Start Full Assessment' : 'Continue Assessment'} →
              </button>
            </div>
          )}

          {/* Reset Button for when all games are completed */}
          {completedGames.size === GAMES_CONFIG.length && completedGames.size > 0 && (
            <div className="text-center mt-6">
              <button
                onClick={confirmReset}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105"
              >
                Reset All Progress 🗑️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}