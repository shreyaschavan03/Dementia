import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import brainImg from "../assets/brain.png";

export default function Landing({ theme, setTheme, language, setLanguage }) {
  const { t, i18n } = useTranslation();

  // Change language dynamically
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <div
      className={`min-h-screen flex flex-col scroll-smooth transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 text-gray-900"
      }`}
    >
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className={`flex justify-between items-center px-10 py-6 backdrop-blur-md shadow-sm sticky top-0 z-50 ${
          theme === "dark"
            ? "bg-gray-800/50 text-white"
            : "bg-white/30 text-gray-700"
        }`}
      >
        <h1 className="text-3xl font-extrabold text-purple-700">
          🧠 NeuroNest
        </h1>

        <div className="flex gap-8 font-medium">
          <a href="#home" className="hover:text-purple-600 transition">
            {t("Home")}
          </a>
          <a href="#games" className="hover:text-purple-600 transition">
            {t("Games")}
          </a>
          <a href="#community" className="hover:text-purple-600 transition">
            {t("Community")}
          </a>
          <a href="#reports" className="hover:text-purple-600 transition">
            {t("Reports")}
          </a>
          <a href="#contact" className="hover:text-purple-600 transition">
            {t("Contact")}
          </a>
        </div>

        <div className="flex gap-4 items-center">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2 py-1 rounded-md border border-purple-400 bg-transparent text-sm"
          >
            <option value="en">English</option>
            <option value="mr">Marathi</option>
            <option value="hi">Hindi</option>
          </select>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="px-3 py-2 rounded-full border border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-gray-700 transition text-sm"
          >
            {theme === "dark" ? "☀ Light" : "🌙 Dark"}
          </button>

          {/* Auth Buttons */}
          <button className="px-4 py-2 rounded-full border border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-gray-700 transition">
            {t("Log In")}
          </button>
          <button className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition">
            {t("Sign Up")}
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section
        id="home"
        className="flex flex-1 items-center justify-between px-16 pt-10 scroll-mt-24"
      >
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="max-w-xl"
        >
          <h2 className="text-5xl font-bold leading-tight">
            {t("Healthy Mind, Happy Life")}
          </h2>
          <p className="mt-6 text-lg opacity-80">
            {t(
              "Detect dementia early with fun cognitive games and AI-based monitoring."
            )}
          </p>
          <div className="mt-8 flex gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-3 rounded-full bg-purple-600 text-white text-lg shadow-lg hover:bg-purple-700 transition"
            >
              {t("Start Now")}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-3 rounded-full border-2 border-purple-600 text-purple-700 dark:text-purple-300 text-lg hover:bg-purple-50 dark:hover:bg-gray-700 transition"
            >
              ▶ {t("Watch Demo")}
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <motion.img
            src={brainImg}
            alt="Brain"
            className="w-[400px] drop-shadow-2xl"
            animate={{ y: [0, -40, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <div className="absolute inset-0 blur-3xl bg-purple-300/20 rounded-full -z-10" />
        </motion.div>
      </section>

      {/* Scroll Sections */}
      <div className="mt-32 space-y-32 px-20 pb-32">
        {/* Games */}
        <section id="games" className="scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 flex gap-10 items-center hover:shadow-2xl transition"
          >
            <div className="text-5xl">🧩</div>
            <div>
              <h3 className="text-3xl font-bold">{t("Fun Cognitive Games")}</h3>
              <p className="mt-2">
                {t(
                  "Challenge your memory, focus and problem-solving with brain-friendly games."
                )}
              </p>
            </div>
          </motion.div>
        </section>

        {/* Community */}
        <section id="community" className="scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 flex gap-10 items-center hover:shadow-2xl transition"
          >
            <div className="text-5xl">👥</div>
            <div>
              <h3 className="text-3xl font-bold">
                {t("Supportive Community")}
              </h3>
              <p className="mt-2">
                {t(
                  "Connect with families, doctors, and friends to track and support progress together."
                )}
              </p>
            </div>
          </motion.div>
        </section>

        {/* Reports */}
        <section id="reports" className="scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 flex gap-10 items-center hover:shadow-2xl transition"
          >
            <div className="text-5xl">📊</div>
            <div>
              <h3 className="text-3xl font-bold">{t("AI Health Reports")}</h3>
              <p className="mt-2">
                {t(
                  "Track cognitive performance and get AI-based dementia risk predictions."
                )}
              </p>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Footer */}
      <section id="contact" className="scroll-mt-24">
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="bg-purple-800 text-white mt-32"
        >
          <div className="max-w-6xl mx-auto px-10 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h2 className="text-2xl font-bold mb-4">🧠 NeuroNest</h2>
              <p className="text-purple-200">
                {t(
                  "Empowering healthy minds with AI-powered early dementia detection and engaging cognitive games."
                )}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">{t("Contact")}</h3>
              <ul className="space-y-2 text-purple-200">
                <li>📍 Mumbai, India</li>
                <li>📧 support@neuronest.com</li>
                <li>📞 +91 98765 43210</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">{t("Follow Us")}</h3>
              <div className="flex gap-5 text-2xl text-purple-200">
                <a href="#" className="hover:text-white transition">
                  🌐
                </a>
                <a href="#" className="hover:text-white transition">
                  🐦
                </a>
                <a href="#" className="hover:text-white transition">
                  📸
                </a>
                <a href="#" className="hover:text-white transition">
                  💼
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-purple-700 mt-10 py-6 text-center text-sm text-purple-300">
            © {new Date().getFullYear()} NeuroNest. {t("All rights reserved.")}.
          </div>
        </motion.footer>
      </section>
    </div>
  );
}
