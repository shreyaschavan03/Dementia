import React, { useState, useEffect } from "react";
import StroopGame from "./StroopGame";
import SentenceGame from "./SentenceGame";
import PatternGame from "./PatternGame";
import MemoryMatrix from "./MemoryMatrix";
import ReactionTime from "./ReactionTime";
import NumberSpan from "./NumberSpan";
import { supabase } from './supabaseClient';

const GAMES = [
  { id: 'stroop', name: 'Stroop Test', component: StroopGame },
  { id: 'sentence', name: 'Truth or Lie', component: SentenceGame },
  { id: 'pattern', name: 'Pattern Memory', component: PatternGame },
  { id: 'memory', name: 'Memory Matrix', component: MemoryMatrix },
  { id: 'reaction', name: 'Reaction Time', component: ReactionTime },
  { id: 'numbers', name: 'Number Span', component: NumberSpan },
];

export default function GameFlow() {
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [gameResults, setGameResults] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [currentGameState, setCurrentGameState] = useState('playing');
  const [userId, setUserId] = useState(null);
  const [sessionId, setSessionId] = useState(null);

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
      setGameResults(JSON.parse(savedResults));
    }
  };

  const handleGameComplete = async (gameData) => {
    const currentGameId = GAMES[currentGameIndex].id;
    
    const gameResult = {
      game_id: currentGameId,
      game_name: GAMES[currentGameIndex].name,
      user_id: userId,
      session_id: sessionId,
      ...gameData,
      completed_at: new Date().toISOString()
    };

    // Update local state
    const newResults = [...gameResults, gameResult];
    setGameResults(newResults);
    setCurrentGameState('completed');
    
    // Save to localStorage
    localStorage.setItem(`neuroNestResults_${userId}`, JSON.stringify(newResults));
    
    // Save to Supabase
    await saveToSupabase(gameResult);
  };

  const saveToSupabase = async (gameData) => {
    try {
      const { data, error } = await supabase
        .from('cognitive_assessments')
        .insert([gameData]);
      
      if (error) {
        console.error('Error saving game data to Supabase:', error);
        // Save to backup for later sync
        await saveToLocalBackup(gameData);
      } else {
        console.log('Game data saved successfully to Supabase:', data);
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
      backup_time: new Date().toISOString(),
      sync_attempted: false 
    });
    localStorage.setItem('neuroNestBackups', JSON.stringify(backups));
  };

  const syncBackupData = async () => {
    const backups = JSON.parse(localStorage.getItem('neuroNestBackups') || '[]');
    if (backups.length > 0) {
      try {
        const { data, error } = await supabase
          .from('cognitive_assessments')
          .insert(backups);
        
        if (!error) {
          console.log('Backup data synced successfully to Supabase');
          localStorage.removeItem('neuroNestBackups');
        } else {
          console.error('Error syncing backup data:', error);
        }
      } catch (error) {
        console.error('Error syncing backup data:', error);
      }
    }
  };

  // Sync backup data on component mount
  useEffect(() => {
    if (userId) {
      syncBackupData();
    }
  }, [userId]);

  const handleNextGame = () => {
    if (currentGameIndex < GAMES.length - 1) {
      setCurrentGameIndex(prev => prev + 1);
      setCurrentGameState('playing');
    } else {
      setShowCompletion(true);
    }
  };

  const handleBackToMenu = () => {
    setCurrentGameIndex(-1);
    setCurrentGameState('playing');
  };

  const handleStartNewAssessment = () => {
    // Create new session for fresh assessment
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    setGameResults([]);
    setCurrentGameIndex(0);
    setShowCompletion(false);
    setCurrentGameState('playing');
  };

  // Show game selection menu
  if (currentGameIndex === -1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center text-white p-4">
        <div className="text-center max-w-4xl w-full">
          <h1 className="text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            🧠 NeuroNest Cognitive Assessment
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {GAMES.map((game, index) => {
              const gameResult = gameResults.find(r => r.game_id === game.id);
              return (
                <div
                  key={game.id}
                  className="p-6 rounded-2xl bg-gray-800/80 border-2 border-gray-600 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:border-blue-500"
                  onClick={() => {
                    setCurrentGameIndex(index);
                    setCurrentGameState('playing');
                  }}
                >
                  <h3 className="text-xl font-bold mb-2">{game.name}</h3>
                  {gameResult ? (
                    <div className="text-left space-y-1 text-sm">
                      <p className="text-green-400">✅ Completed</p>
                      <p>Score: <span className="text-yellow-400 font-bold">{gameResult.total_score}</span></p>
                      {gameResult.accuracy && (
                        <p>Accuracy: <span className="text-green-400">{gameResult.accuracy.toFixed(1)}%</span></p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400">Click to play</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                const firstIncomplete = GAMES.findIndex(game => !gameResults.find(r => r.game_id === game.id));
                setCurrentGameIndex(firstIncomplete !== -1 ? firstIncomplete : 0);
                setCurrentGameState('playing');
              }}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 text-white"
            >
              {gameResults.length === 0 ? 'Start Full Assessment' : 'Continue Assessment'}
            </button>
            
            {gameResults.length > 0 && (
              <button
                onClick={() => setShowCompletion(true)}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold text-lg transition-all duration-300 text-white"
              >
                View Final Report ({gameResults.length}/{GAMES.length} completed)
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center text-white p-4">
        <div className="text-center max-w-4xl w-full bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 p-8">
          <h1 className="text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            🎉 Assessment Complete!
          </h1>
          
          <div className="mb-8">
            <p className="text-xl mb-4">
              You've completed all cognitive tests! Your results have been saved to the database.
            </p>
            <div className="bg-green-500/20 border border-green-500 rounded-xl p-4 inline-block">
              <span className="text-2xl font-bold text-green-400">
                {gameResults.length}/{GAMES.length} Games Completed
              </span>
            </div>
          </div>

          {/* Individual Game Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-h-96 overflow-y-auto">
            {GAMES.map((game) => {
              const result = gameResults.find(r => r.game_id === game.id);
              return (
                <div
                  key={game.id}
                  className={`p-4 rounded-xl border-2 ${
                    result ? 'bg-gray-700/50 border-green-500' : 'bg-gray-800/30 border-red-500'
                  }`}
                >
                  <h3 className="text-lg font-bold mb-2">{game.name}</h3>
                  {result ? (
                    <div className="text-left space-y-1 text-sm">
                      <p>Score: <span className="text-yellow-400 font-bold">{result.total_score}</span></p>
                      {result.accuracy && <p>Accuracy: <span className="text-green-400">{result.accuracy.toFixed(1)}%</span></p>}
                      {result.average_time && <p>Avg Time: <span className="text-blue-400">{result.average_time.toFixed(2)}s</span></p>}
                      {result.max_level && <p>Max Level: <span className="text-purple-400">{result.max_level}</span></p>}
                    </div>
                  ) : (
                    <p className="text-red-400">Not completed</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <button
              onClick={() => window.location.href = '/report'}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 text-white w-full max-w-md"
            >
              View Detailed Analysis Report
            </button>
            <button
              onClick={handleStartNewAssessment}
              className="px-8 py-4 bg-gray-600 hover:bg-gray-700 rounded-xl font-bold text-lg transition-all duration-300 text-white"
            >
              Start New Assessment
            </button>
          </div>

          {/* Database Status */}
          <div className="mt-6 p-3 bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-300">
              📊 All results stored in database • Session: {sessionId?.substring(0, 8)}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show current game with completion state
  const CurrentGame = GAMES[currentGameIndex].component;
  const currentGameResult = gameResults.find(r => r.game_id === GAMES[currentGameIndex].id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      {/* Header with navigation */}
      <div className="p-4 absolute top-0 left-0 right-0 z-50">
        <div className="flex justify-between items-center">
          <button
            onClick={handleBackToMenu}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-white transition-all duration-300"
          >
            ← Back to Menu
          </button>
          <div className="text-white font-semibold">
            Game {currentGameIndex + 1} of {GAMES.length}: {GAMES[currentGameIndex].name}
          </div>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>
      </div>

      {/* Game Container */}
      <div className="pt-20">
        <CurrentGame 
          onGameComplete={handleGameComplete}
          onNextGame={handleNextGame}
        />
      </div>

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs">
          <div>Game State: {currentGameState}</div>
          <div>Current Game: {GAMES[currentGameIndex].name}</div>
          <div>Results: {gameResults.length}</div>
          <div>User ID: {userId?.substring(0, 8)}...</div>
          <div>Session ID: {sessionId?.substring(0, 8)}...</div>
        </div>
      )}
    </div>
  );
}