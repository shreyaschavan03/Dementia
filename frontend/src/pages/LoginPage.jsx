import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import LightRays from "../components/LightRays";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials!");
      } else {
        localStorage.setItem("token", data.token || "dummy-jwt-token");
        navigate("/home");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      console.error(err);
    }
  };

  const raysColor = useMemo(
    () => ["#ffffff", "#ff6ec7", "#a78bfa", "#7dd3fc"],
    []
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1c2c] via-[#3c1f4d] via-[#4b2e83] via-[#6a1e72] to-[#ff6ec7]">
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

      {/* 💳 Login Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 20px 60px rgba(128, 0, 255, 0.4)",
        }}
        whileTap={{ scale: 0.98 }}
        className="relative z-10 w-full max-w-md p-8 bg-white rounded-2xl flex flex-col gap-4"
      >
        <h2 className="text-3xl font-extrabold text-center text-purple-700">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-500 text-center font-medium">{error}</p>
        )}

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="relative z-10 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
          required
        />

        <div className="relative mt-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="relative z-10 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
            required
          />
          <span
            onClick={togglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 z-20"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-purple-600 text-white rounded-lg shadow-lg hover:scale-105 transform transition-transform"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-700 mt-2">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-purple-600 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>

        <p
          onClick={() => navigate("/forgot-password")}
          className="text-center text-sm text-purple-600 cursor-pointer hover:underline mt-1"
        >
          Forgot Password?
        </p>
      </motion.form>
    </div>
  );
}
