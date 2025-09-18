import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import DarkVeil from "../components/DarkVeil";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Validation checks
    if (!email || !password || !confirmPassword) {
      alert("Please fill in all fields!");
      setError("Please fill in all fields!");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address!");
      setError("Please enter a valid email address!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed!");
        setError(data.message || "Signup failed");
      } else {
        localStorage.setItem("token", data.token || "demoToken123");
        alert("Signup successful! Redirecting...");
        navigate("/home");
      }
    } catch (err) {
      alert("Server error. Please try again later.");
      setError("Server error. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1c2c] via-[#3c1f4d] via-[#4b2e83] via-[#6a1e72] to-[#ff6ec7]">
      {/* 🌌 Background Animation */}
      <div className="absolute inset-0 z-0">
        <DarkVeil
          hueShift={30}
          noiseIntensity={0.05}
          scanlineIntensity={0.1}
          speed={0.5}
          scanlineFrequency={10}
          warpAmount={0.05}
          resolutionScale={1}
        />
      </div>

      {/* 💳 Signup Form */}
      <motion.form
        onSubmit={handleSignup}
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 25px 50px rgba(128, 0, 255, 0.25)",
        }}
        whileTap={{ scale: 0.98 }}
        className="relative z-10 w-full max-w-md p-10 bg-white/70 backdrop-blur-xl rounded-3xl flex flex-col gap-6 shadow-xl border border-purple-200"
      >
        <h2 className="text-3xl font-extrabold text-center text-purple-700">
          Create Your Account
        </h2>
        <p className="text-center text-purple-500 mb-4">
          Sign up to start exploring NeuroNest.
        </p>

        {error && (
          <p className="text-red-500 text-center font-medium">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-5 py-3 rounded-xl border border-purple-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-300 text-purple-700 font-medium"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 rounded-xl border border-purple-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-300 text-purple-700 font-medium"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-purple-400 hover:text-purple-700 transition-colors"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-5 py-3 rounded-xl border border-purple-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-300 text-purple-700 font-medium"
            required
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-purple-400 hover:text-purple-700 transition-colors"
          >
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-purple-400/40 transform transition-all"
        >
          Sign Up & Login
        </button>

        <p className="text-center text-purple-500 mt-2 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-purple-700 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </motion.form>
    </div>
  );
}
