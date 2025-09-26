import React from "react";

export default function GameTheme({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <div className="p-8 rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.2)] bg-gradient-to-tl from-gray-900 via-black to-gray-800 w-full max-w-3xl">
        {children}
      </div>
    </div>
  );
}
