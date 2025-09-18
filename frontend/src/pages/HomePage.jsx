import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HomePage() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Fetch username from localStorage or API
    const user = localStorage.getItem("username") || "User";
    setUsername(user);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 dark:bg-gray-900 transition-colors duration-300">
    
    </div>
  );
}
