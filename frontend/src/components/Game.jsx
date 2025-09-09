import React, { useState } from "react";

export default function Game() {
  const [score, setScore] = useState(0);

  const handleClick = () => setScore(score + 1);

  return (
    <div>
      <h3>Score: {score}</h3>
      <button onClick={handleClick}>Click Me!</button>
    </div>
  );
}
