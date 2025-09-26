import React, { useState } from "react";
import StroopGame from "./StroopGame";
import PatternGame from "./PatternGame";
import SentenceGame from "./SentenceGame";

// --- Hub Theme (Simplified for the Hub View) ---
const HUB_THEME = {
    // UPDATED: Soft, light beige color (bg-amber-50 is a very pale yellow/cream)
    background: "bg-amber-50", 
    text: "text-gray-900", // Dark text for high contrast
    cardGradient: "from-blue-600 to-indigo-700",
    cardShadow: "hover:shadow-2xl hover:shadow-indigo-400/50",
    backButton: "bg-indigo-700 hover:bg-indigo-800 text-white", // Changed button color for better contrast on the light background
};

// --- GameCard Component ---
function GameCard({ title, description, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer ${HUB_THEME.cardGradient} bg-gradient-to-br rounded-2xl p-6 border-b-4 border-indigo-400
        transform transition duration-500 ease-out hover:scale-[1.02] ${HUB_THEME.cardShadow}
        flex flex-col items-start text-left text-white animate-fadeIn`}
    >
      <span className="text-4xl mb-3">{icon}</span>
      <h3 className="text-xl font-extrabold mb-1">{title}</h3>
      <p className="text-white/80 text-sm font-light">{description}</p>
    </div>
  );
}

// --- Main Hub Component ---
export default function GameHub() {
  const [activeGame, setActiveGame] = useState(null);

  const GameContainer = ({ children }) => (
    // The main container for an active game
    <div className="w-full h-full min-h-screen">
      <div className="p-8 absolute top-0 left-0 z-50">
        <button
          onClick={() => setActiveGame(null)}
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

  if (activeGame === "stroop") return <GameContainer><StroopGame /></GameContainer>;
  if (activeGame === "pattern") return <GameContainer><PatternGame /></GameContainer>;
  if (activeGame === "sentence") return <GameContainer><SentenceGame /></GameContainer>;

  // Default: show menu
  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden ${HUB_THEME.background}`}>
      
      {/* --- CSS KEYFRAMES --- */}
      <style>{`
        /* Existing Hub Animations */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
        @keyframes slideInDown { from { opacity: 0; transform: translateY(-50px); } to { transform: translateY(0); } }
        .animate-slideInDown { animation: slideInDown 0.6s ease-out; }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.9); } to { transform: scale(1); } }
        .animate-scaleUp { animation: scaleUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

        /* Subtle Background Gradient Shift (Updated for light colors) */
        @keyframes subtle-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        /* Light Overlay Animation Keyframes (Updated for light colors) */
        @keyframes glowing-blob {
            0% { transform: scale(1) translate(0%, 0%); opacity: 0.1; }
            33% { transform: scale(1.2) translate(10%, -10%); opacity: 0.15; }
            66% { transform: scale(0.9) translate(-10%, 10%); opacity: 0.12; }
            100% { transform: scale(1) translate(0%, 0%); opacity: 0.1; }
        }
        @keyframes glowing-blob-2 {
            0% { transform: scale(0.8) translate(0%, 0%); opacity: 0.08; }
            40% { transform: scale(1.1) translate(-15%, 5%); opacity: 0.15; }
            80% { transform: scale(0.9) translate(5%, -15%); opacity: 0.1; }
            100% { transform: scale(0.8) translate(0%, 0%); opacity: 0.08; }
        }
      `}</style>
      
      {/* --- STATIC RADIAL GRADIENT LAYER (Subtle Center Light/Warmth) --- */}
      <div className="absolute inset-0 bg-radial-gradient z-0 opacity-40"
           style={{ 
             // Warm, subtle glow that fades into the amber-50 base
             backgroundImage: 'radial-gradient(circle at center, rgba(251, 191, 36, 0.15) 0%, rgba(255, 247, 237, 0) 70%)'
           }}
      />

      {/* --- LIGHT ANIMATION OVERLAY ELEMENTS --- */}
      {/* Opacity greatly reduced and colors softened to appear as subtle shifts of light on the beige base */}
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


      {/* Main Content Container (higher z-index) */}
      <div className={`
            relative z-10 w-full h-full min-h-screen flex items-center justify-center 
            /* Subtle shift uses neighboring beige tones (amber-50, amber-100) */
            bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 
            bg-[length:200%_200%] animate-[subtle-shift_20s_ease_infinite]
            `}>

        <div className="w-full max-w-4xl p-8 animate-scaleUp">
          
          {/* Professional Header */}
          <header className="text-center mb-12">
              {/* Text color is now dark for contrast */}
              <h1 className="text-5xl font-black mb-2 text-gray-900">
                  Cognitive Performance Hub 🧠
              </h1>
              <p className="text-lg text-gray-600 font-light">
                  Select a test to measure different aspects of your brain's function.
              </p>
          </header>

          {/* Game Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GameCard
              title="Attention & Focus"
              description="Measure selective attention, reaction time, and cognitive interference."
              icon="⏱️"
              onClick={() => setActiveGame("stroop")}
            />
            <GameCard
              title="Executive Function"
              description="Test working memory and sequence recall with pattern recognition tasks."
              icon="🧩"
              onClick={() => setActiveGame("pattern")}
            />
            <GameCard
              title="Verbal Processing"
              description="Assess language comprehension and quick sentence validity checks."
              icon="💬"
              onClick={() => setActiveGame("sentence")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}