import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPasswordPage.css";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Call backend API
      const response = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // e.g., "Password reset link sent"
      } else {
        setMessage(data.message || "Something went wrong!");
      }
    } catch (err) {
      setMessage("Server error. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-wrapper">
      <form onSubmit={handleReset} className="forgot-box">
        <h2 className="forgot-title">Forgot Password</h2>

        {message && <p className="forgot-message">{message}</p>}

        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="forgot-input"
          required
        />

        <button type="submit" className="btn-reset" disabled={loading}>
          {loading ? "Sending..." : "Reset Password"}
        </button>

        <p className="forgot-footer">
          Back to{" "}
          <span className="forgot-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
