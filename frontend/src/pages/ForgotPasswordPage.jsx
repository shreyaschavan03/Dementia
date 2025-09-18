import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message || (response.ok ? "Reset link sent!" : "Something went wrong!"));
    } catch (err) {
      setMessage("Server error. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      {/* Subtle Background Shapes */}
      <motion.div
        className="absolute w-72 h-72 bg-gradient-to-tr from-purple-400 to-indigo-400 rounded-full opacity-20 top-16 left-10"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-gradient-to-br from-pink-400 to-red-400 rounded-full opacity-15 bottom-12 right-12"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      {/* Form Card */}
      <motion.form
        onSubmit={handleReset}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl flex flex-col gap-6"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 text-sm">
          Enter your registered email address below. We’ll send you a link to reset your password.
        </p>

        {message && (
          <p className={`text-center text-sm font-medium ${message.includes("sent") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}

        <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-300 transition bg-white">
          <FiMail className="text-gray-400 mr-3 text-lg" />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm"
            required
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(99, 102, 241, 0.4)" }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-md text-sm transition-all"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </motion.button>

        <p className="text-center text-gray-500 text-sm mt-2">
          Remembered your password?{" "}
          <span
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </motion.form>
    </div>
  );
}
