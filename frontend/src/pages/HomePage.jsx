import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home-container">
      <h1>Welcome to NeuroNest</h1>
      <p>Use the navigation below to go to Camera, Game, or Report pages.</p>
      <div className="nav-links">
        <Link className="nav-button" to="/camera">Camera</Link>
        <Link className="nav-button" to="/game">Game</Link>
        <Link className="nav-button" to="/report">Report</Link>
      </div>
    </div>
  );
}
