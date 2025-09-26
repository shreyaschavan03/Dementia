import React, { useState } from "react";
import StroopGame from "./StroopGame";
import PatternGame from "./PatternGame";
import SentenceGame from "./SentenceGame";

function GameCard({ title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 border border-gray-200
        transform transition duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.7)]
        animate-fadeIn"
    >
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
    </div>
  );
}

export default function GameHub() {
  const [activeGame, setActiveGame] = useState(null);

  const GameContainer = ({ children }) => (
    <div className="p-6 animate-fadeInUp">
      <button
        onClick={() => setActiveGame(null)}
        className="mb-4 px-4 py-2 rounded-lg
          bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold
          shadow-[0_0_10px_rgba(255,255,255,0.9)"
      >
        ← Back
      </button>
      {children}
    </div>
  );

  if (activeGame === "stroop") return <GameContainer><StroopGame /></GameContainer>;
  if (activeGame === "pattern") return <GameContainer><PatternGame /></GameContainer>;
  if (activeGame === "sentence") return <GameContainer><SentenceGame /></GameContainer>;

  // Default: show menu
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <GameCard
        title="Attention & Focus"
        description="Play the Stroop Test"
        onClick={() => setActiveGame("stroop")}
      />
      <GameCard
        title="Problem Solving"
        description="Try Pattern Recognition"
        onClick={() => setActiveGame("pattern")}
      />
      <GameCard
        title="Language & Words"
        description="Do Sentence Completion"
        onClick={() => setActiveGame("sentence")}
      />
    </div>
  );
}
