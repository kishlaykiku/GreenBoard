import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const LaptopUsage = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTime, setActiveTime] = useState(0); // in seconds
  const [inactiveTime, setInactiveTime] = useState(0); // in seconds
  const [awePoints, setAwePoints] = useState(0);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());

  const timerRef = useRef(null);

  // Start/Stop Timer Based on Mode
  useEffect(() => {
    if (isDarkMode) {
      setLastActivityTime(Date.now());
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const isInactive = now - lastActivityTime > 60000;
        if (isInactive) {
          setInactiveTime((prev) => prev + 1);
        } else {
          setActiveTime((prev) => prev + 1);
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isDarkMode, lastActivityTime]);

  // Awe Points every 30s of active time
  useEffect(() => {
    if (activeTime !== 0 && activeTime % 30 === 0) {
      const darkTimeRatio = isDarkMode ? 1 : 0.5;
      setAwePoints((prev) => prev + Math.floor(5 * darkTimeRatio));
    }
  }, [activeTime, isDarkMode]);

  // Update body class on dark mode toggle
  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleModeToggle = () => {
    setIsDarkMode((prev) => {
      const nextMode = !prev;
      if (nextMode) {
        setLastActivityTime(Date.now()); // Reset when entering dark mode
      }
      return nextMode;
    });
  };

  const formatTime = (secs) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min}m ${sec}s`;
  };

  return (
    <div  className={`min-h-screen ${
      isDarkMode ? "bg-gray-900 text-gray-100" : "bg-green-100 text-gray-900"
    } flex flex-col items-center justify-start p-8 gap-6`}>

      <h1 className={`text-3xl font-bold text-gray-100 ${
        isDarkMode ? "text-green-400" : "text-green-700"
      }`}>💻 Laptop Usage Tracker</h1>

      {/* Mode Toggle */}
      <div className="flex items-center gap-4">
        <label className="text-lg font-medium text-gray-400">Mode:</label>
        <button
          className={`px-4 py-2 rounded-md shadow-md text-white transition ${
            isDarkMode ? "bg-gray-800" : "bg-yellow-500"
          }`}
          onClick={handleModeToggle}
        >
          {isDarkMode ? "Dark Mode" : "Light Mode"}
        </button>
      </div>

      {/* Time Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 w-full max-w-2xl">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-green-800 mb-2">🟢 Active Time</h3>
          <p className="text-gray-700 text-lg">{formatTime(activeTime)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-green-800 mb-2">⚪ Inactive Time</h3>
          <p className="text-gray-700 text-lg">{formatTime(inactiveTime)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md col-span-full">
          <h3 className="text-xl font-semibold text-green-800 mb-2">🌟 Awe Points</h3>
          <p className="text-green-900 text-2xl font-bold">{awePoints}</p>
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 w-full max-w-2xl mt-6 rounded">
        {isDarkMode ? (
          <p>✅ You're using Dark Mode. Good job conserving energy!</p>
        ) : (
          <p>⚠️ Try switching to Dark Mode to reduce energy consumption.</p>
        )}
        {/* {inactiveTime > 30 && (
          <p className="mt-2">💡 Laptop seems inactive. Consider turning it off!</p>
        )} */}
      </div>

      {/* Energy Stats (Dummy) */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h3 className="text-lg font-semibold text-green-800">Estimated Energy Use</h3>
        <p className="text-gray-700 mt-2">Light Mode consumes ~20% more power.</p>
        <p className="text-gray-700">Estimated saved energy: <strong>{isDarkMode ? "12%" : "0%"}</strong></p>
      </div>

      <Link to="/">
        <button className="mt-6 px-5 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-800 shadow">
          ← Back to Dashboard
        </button>
      </Link>
    </div>
  );
};

export default LaptopUsage;