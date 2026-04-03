"use client";

import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-5 right-5 z-50 
      bg-white dark:bg-[#1e293b]
      text-black dark:text-white
      p-3 rounded-full shadow-md 
      hover:scale-110 transition-all duration-300"
    >
      <div className="relative w-5 h-5">
        <FiSun
          className={`absolute transition-all duration-300 ${
            dark ? "opacity-0 rotate-90" : "opacity-100"
          }`}
        />
        <FiMoon
          className={`absolute transition-all duration-300 ${
            dark ? "opacity-100" : "opacity-0 -rotate-90"
          }`}
        />
      </div>
    </button>
  );
}