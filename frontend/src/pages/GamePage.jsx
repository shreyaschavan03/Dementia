import React, { useState } from "react";
import "./GamePage.css";

export default function GamePage() {
  const [score, setScore] = useState(0);

  const handleClick = () => {
    setScore(score + 1);
    alert("Score increased!");
  };

  return (
    <div className="game-container">
      <h2>Reaction Game</h2>
      <p>Click the button as fast as you can!</p>
      <button className="game-button" onClick={handleClick}>Click Me!</button>
      <h3>Score: {score}</h3>
    </div>
  );
}
