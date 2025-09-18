import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LightRays from "../components/LightRays";

export default function HomePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User"); // Replace with real username from backend or context
  const [theme, setTheme] = useState("light");

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Background rays colors
  const raysColor = ["#ffffff", "#ff6ec7", "#a78bfa", "#7dd3fc"];

  return (
    <div
      className={`relative min-h-screen flex flex-col ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 text-gray-900"
      }`}
    >
      {/* 🌟 Light Rays Background */}
      <LightRays
        raysOrigin="top-center"
        raysColor={raysColor}
        raysSpeed={1.2}
        lightSpread={1.3}
        rayLength={2}
        pulsating={true}
        fadeDistance={1.0}
        saturation={1.3}
        followMouse={true}
        mouseInfluence={0.2}
      />

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`flex justify-between items-center px-10 py-6 backdrop-blur-md shadow-sm sticky top-0 z-50 ${
          theme === "dark"
            ? "bg-gray-800/50 text-white"
            : "bg-white/30 text-gray-700"
        }`}
      >
        <h1 className="text-3xl font-extrabold text-purple-700">🧠 NeuroNest</h1>
        <div className="flex gap-6 items-center">
          <span className="font-semibold text-lg">Hi, {username}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </motion.nav>

      {/* Hero / Dashboard */}
      <section className="px-16 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex gap-6 flex-wrap"
        >
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-64 hover:shadow-2xl transition cursor-default">
            <h3 className="text-2xl font-bold">🧠 Memory</h3>
            <p className="mt-2">75% completed today</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-64 hover:shadow-2xl transition cursor-default">
            <h3 className="text-2xl font-bold">🧩 Puzzle</h3>
            <p className="mt-2">90% completed today</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-64 hover:shadow-2xl transition cursor-default">
            <h3 className="text-2xl font-bold">📊 Risk Score</h3>
            <p className="mt-2">Low</p>
          </div>
        </motion.div>
      </section>

      {/* Games Section */}
      <section className="mt-20 px-16">
        <h2 className="text-4xl font-bold mb-8">🎮 Play Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { name: "Memory Game", route: "/games/memory", emoji: "🧠" },
            { name: "Puzzle Game", route: "/games/puzzle", emoji: "🧩" },
            { name: "Focus Game", route: "/games/focus", emoji: "🎯" },
          ].map((game) => (
            <motion.div
              key={game.name}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              onClick={() => navigate(game.route)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-2xl transition"
            >
              <span className="text-5xl">{game.emoji}</span>
              <h3 className="text-2xl font-bold mt-4">{game.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
