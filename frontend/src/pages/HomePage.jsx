import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Homepage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            entry.target.classList.add("animate-fadeInUp");
        });
      },
      { threshold: 0.1 }
    );
    document
      .querySelectorAll(".fade-section")
      .forEach((sec) => observer.observe(sec));
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add real API integration if needed
    console.log("Message sent:", formData);
    setSent(true);
    setFormData({ name: "", email: "", message: "" });

    // Auto-hide success message after 3 seconds
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white min-h-screen font-sans transition-colors duration-500">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 sticky top-0 backdrop-blur-md bg-black/40 z-50">
        <h1 className="text-3xl font-extrabold text-purple-300 tracking-widest">
          NeuroNest
        </h1>
        <div className="space-x-8 font-medium">
          <button
            onClick={() => scrollToSection("features")}
            className="hover:text-purple-300"
          >
            Games
          </button>
          <button
            onClick={() => scrollToSection("features")}
            className="hover:text-purple-300"
          >
            Reports
          </button>
          <button
            onClick={() => scrollToSection("features")}
            className="hover:text-purple-300"
          >
            Community
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="hover:text-purple-300"
          >
            FAQ
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="hover:text-purple-300"
          >
            Contact
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="hover:text-purple-300"
          >
            Profile
          </button>
          <button
            onClick={() => navigate("/login")}
            className="hover:text-red-400"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center py-32 px-6 fade-section">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl font-extrabold mb-6 text-purple-300"
        >
          NeuroNest: Track Your Brain, Stay Ahead of Dementia
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-gray-300 max-w-2xl leading-relaxed"
        >
          A community-based platform combining cognitive games, behavior
          analysis, and early dementia detection to support mental wellness.
        </motion.p>
      </section>

      {/* Triangle Divider */}
      <div className="w-full overflow-hidden">
        <svg viewBox="0 0 1440 320" className="w-full h-32">
          <path
            fill="#6b21a8"
            fillOpacity="1"
            d="M0,64L1440,320L1440,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Features Cards */}
      <section id="features" className="py-24 px-6 bg-purple-950 fade-section">
        <h2 className="text-center text-4xl font-bold text-purple-300 mb-16">
          Our Features
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              title: "Cognitive Games",
              route: "/games",
              description:
                "Engaging games designed to stimulate your brain, improve memory, and track mental agility over time.",
            },
            {
              title: "Personalised Reports",
              route: "/reports",
              description:
                "Detailed reports analyzing your game performance and behavior to help you understand your cognitive health.",
            },
            {
              title: "Supportive Community",
              route: "/community",
              description:
                "A safe and supportive space to connect, share experiences, and learn from others focused on mental wellness.",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              onClick={() => navigate(card.route)}
              className="bg-gradient-to-br from-purple-800 to-purple-900 text-white rounded-2xl shadow-lg cursor-pointer hover:shadow-purple-500/30 p-8"
            >
              <h3 className="text-2xl font-semibold mb-4">{card.title}</h3>
              <p className="text-gray-300">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modern FAQ Section */}
      <section
        id="faq"
        className="py-24 px-6 bg-gradient-to-br from-gray-900 via-purple-900 to-black fade-section"
      >
        <h2 className="text-center text-4xl font-bold text-purple-300 mb-16">
          Frequently Asked Questions
        </h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {[
            {
              question: "What is NeuroNest?",
              answer:
                "NeuroNest is a community-based platform for cognitive games, behavior analysis, and early dementia detection.",
            },
            {
              question: "How can I track my cognitive health?",
              answer:
                "By playing the cognitive games and reviewing your personalized reports, you can monitor your mental wellness over time.",
            },
            {
              question: "Is my data secure?",
              answer:
                "Yes, we use industry-standard encryption to ensure your data is safe and private.",
            },
            {
              question: "Can I access NeuroNest on mobile?",
              answer:
                "Yes, NeuroNest is fully responsive and can be accessed on any device, including smartphones and tablets.",
            },
            {
              question: "Do I need a subscription?",
              answer:
                "NeuroNest offers both free and premium features. You can start using basic features for free and upgrade anytime.",
            },
          ].map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="bg-gray-800/60 backdrop-blur-md p-6 rounded-xl cursor-pointer hover:bg-purple-950 transition-colors"
            >
              <details className="group">
                <summary className="flex justify-between items-center font-semibold text-lg text-white cursor-pointer">
                  {faq.question}
                  <span className="transition-transform duration-300 group-open:rotate-180 text-purple-400">
                    ▼
                  </span>
                </summary>
                <p className="mt-2 text-gray-300">{faq.answer}</p>
              </details>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-24 px-6 bg-gradient-to-br from-gray-800 to-gray-900 fade-section"
      >
        <h2 className="text-center text-4xl font-bold text-purple-300 mb-12">
          Contact Us
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            // Validate fields
            if (!formData.name || !formData.email || !formData.message) {
              alert("Please fill in all fields before sending the message!");
              return;
            }

            // Optional: validate email format
            const emailRegex = /\S+@\S+\.\S+/;
            if (!emailRegex.test(formData.email)) {
              alert("Please enter a valid email address!");
              return;
            }

            // If validation passes, show success
            console.log("Message sent:", formData);
            setSent(true);
            setFormData({ name: "", email: "", message: "" });

            // Auto-hide success message after 3 seconds
            setTimeout(() => setSent(false), 3000);
          }}
          className="max-w-3xl mx-auto grid gap-6"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="p-4 rounded-lg bg-gray-700 text-white focus:outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="p-4 rounded-lg bg-gray-700 text-white focus:outline-none"
          />
          <textarea
            rows="4"
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className="p-4 rounded-lg bg-gray-700 text-white focus:outline-none"
          ></textarea>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Send Message
          </button>
          {sent && (
            <p className="text-green-400 text-center mt-2 animate-fadeInUp">
              ✅ Message sent successfully!
            </p>
          )}
        </form>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm bg-black/60">
        © 2025 NeuroNest. All rights reserved.
      </footer>
    </div>
  );
}
