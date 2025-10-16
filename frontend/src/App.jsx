import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HomePage from "./pages/HomePage";
import GameHub from "./components/GameHub";
import Report from "./components/Report";
import Landing from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { supabase } from "./components/supabaseClient";

function App() {
  const { i18n } = useTranslation();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [language, setLanguage] = useState(i18n.language || "en");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get current user session
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Routes>
        <Route
          path="/"
          element={
            <Landing
              theme={theme}
              setTheme={setTheme}
              language={language}
              setLanguage={setLanguage}
              user={user}
            />
          }
        />
        <Route path="/login" element={<LoginPage user={user} />} />
        <Route path="/signup" element={<SignupPage user={user} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route 
          path="/home" 
          element={<HomePage theme="light" username="Shreyas" user={user} />} 
        />
        <Route 
          path="/games" 
          element={<GameHub user={user} />} 
        />
        <Route 
          path="/reports" 
          element={<Report user={user} />} 
        />
      </Routes>
    </div>
  );
}

export default App;