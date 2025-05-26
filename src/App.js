import React, { useLayoutEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LaptopUsage from "./pages/LaptopUsage";
import Seating from "./pages/Seating";

const NavBar = () => {
  const location = useLocation();

  const navItems = [
    
    { path: "/", label: "Dashboard", icon: "fa-chart-line" },
    { path: "/laptop", label: "Laptop Usage", icon: "fa-laptop" },
    { path: "/seating", label: "Seating Grid", icon: "fa-chair" },
  ];

  const refs = useRef([]);
  const sliderRef = useRef(null);
  const [sliderStyle, setSliderStyle] = useState({});

  useLayoutEffect(() => {
    const activeIndex = navItems.findIndex((item) => item.path === location.pathname);
    const activeRef = refs.current[activeIndex];

    if (activeRef && sliderRef.current) {
      // Use RAF to ensure it's measured after the browser lays out the DOM
      requestAnimationFrame(() => {
        const { offsetLeft, offsetWidth } = activeRef;
        setSliderStyle({
          left: offsetLeft,
          width: offsetWidth,
        });
      });
    }
  }, [location.pathname]);

  return (
    <nav className="bg-green-900 text-white px-4 py-3 shadow-md">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          <h1>GreenBoard 🌱</h1>
        </Link>
        <div className="flex items-center space-x-8">
        <a
  href="https://greenquery.onrender.com/"
  target="_blank"
  rel="noopener noreferrer"
>
  <button className="bg-black text-white font-semibold px-4 py-2 rounded-md hover:bg-gray-600 transition-all duration-200 shadow">
    <i className="fa-solid fa-robot mr-2"></i>AI Query
  </button>
</a>
        <div className="relative flex space-x-6 items-center">
          {/* Sliding background */}
          
          <div
            ref={sliderRef}
            className="absolute top-1/2 -translate-y-1/2 h-9 bg-white rounded-md transition-all duration-300"
            style={{
              ...sliderStyle
            }}
          />

          {/* Navigation Links */}
          {navItems.map(({ path, label, icon }, idx) => (
            <Link
              key={path}
              to={path}
              ref={(el) => (refs.current[idx] = el)}
              className={`flex items-center gap-2 z-10 px-3 py-1 rounded-md transition-colors duration-200 ${
                location.pathname === path
                  ? "text-green-900 font-semibold"
                  : "hover:text-green-300"
              }`}
            >
              <i className={`fa-solid ${icon}`}></i> {label}
            </Link>
          ))}
        </div>
      </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-green-100 font-sans">
        <NavBar />
        <div className="">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/laptop" element={<LaptopUsage />} />
            <Route path="/seating" element={<Seating />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;