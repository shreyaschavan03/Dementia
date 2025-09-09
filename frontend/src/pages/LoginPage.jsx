import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import "./LoginPage.css";

function LoginPage() {
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
        // Save token from backend (replace with real JWT later)
        localStorage.setItem("token", data.token || "dummy-jwt-token");
        navigate("/home");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      console.error(err);
    }
  };

  const handleSignup = () => navigate("/signup");
  const handleForgotPassword = () => navigate("/forgot-password");

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2 className="login-title">Welcome to NeuroNest</h2>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <FiMail className="input-icon" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="input-container">
            <FiLock className="input-icon" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
            <div className="password-toggle" onClick={togglePassword}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </div>
          </div>

          <button type="submit" className="btn-login">
            Login
          </button>
        </form>

        <div className="extra-options">
          <button
            type="button"
            onClick={handleSignup}
            className="btn-secondary"
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="btn-link"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
