import React from "react";
import { Link } from "react-router-dom";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Zones data (seats occupied true/false)
const zones = {
  "Zone 1": [false, true, false, false, false, false, false, false, false, false],
  "Zone 2": [true, true, false, false, true, false, false, false, false, false],
  "Zone 3": [false, false, false, false, false, false, false, false, false, false],
  "Zone 4": [true, false, false, true, false, false, false, false, false, false],
};

// Helper: Color for heatmap zone based on occupancy ratio
const getHeatColor = (ratio) => {
  const red = Math.min(255, Math.floor(255 * ratio));
  const green = Math.min(255, Math.floor(255 * (1 - ratio)));
  return `rgb(${red}, ${green}, 0)`;
};

// Dummy daily data for charts (24 hours format)
const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

// Dummy data for Laptop Active / Inactive time (in hours)
const laptopActivityData = {
  active: [2, 3, 4, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2],
  inactive: [1, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 1],
};

// Dummy energy saved per hour (kWh)
const energySaved = [0.2, 0.3, 0.5, 0.7, 0.6, 0.4, 0.3, 0.2, 0.1, 0, 0, 0, 0, 0, 0.1, 0.3, 0.5, 0.8, 1.0, 0.9, 0.7, 0.5, 0.3, 0.2];

// Dummy dark mode vs light mode usage per hour (in minutes)
const darkModeUsage = [50, 55, 60, 58, 57, 60, 62, 63, 45, 30, 25, 20, 15, 10, 15, 40, 50, 60, 65, 70, 60, 55, 50, 45];
const lightModeUsage = darkModeUsage.map(d => 60 - d);

// Dummy CO2 emission saved per hour (kg)
const co2EmissionSaved = [0.05, 0.06, 0.1, 0.15, 0.13, 0.1, 0.08, 0.06, 0.03, 0, 0, 0, 0, 0, 0.02, 0.05, 0.09, 0.12, 0.15, 0.18, 0.16, 0.12, 0.07, 0.04];

const Dashboard = () => {
  // Seating zone occupancy ratios
  const zoneOccupancy = Object.entries(zones).map(([zone, seats]) => {
    const occupiedCount = seats.filter(Boolean).length;
    const ratio = occupiedCount / seats.length;
    return { zone, ratio, occupiedCount, totalSeats: seats.length };
  });

  // Most active zone for summary
  const mostActiveZone = zoneOccupancy.reduce((prev, curr) =>
    curr.ratio > prev.ratio ? curr : prev
  );

  // Count inactive zones (0% occupancy)
  const inactiveZonesCount = zoneOccupancy.filter(z => z.ratio === 0).length;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 bg-gray-900 gap-8 text-gray-200">
      <h1 className="text-5xl font-bold text-green-400 mt-6">🌱 GreenBoard</h1>
      <p className="text-lg text-gray-400">Your Eco-Friendly Office Companion</p>

      {/* Awe Points Counter */}
      <div className="bg-gray-800 rounded-xl px-6 py-4 shadow-md text-center">
        <h2 className="text-2xl font-semibold text-green-400">🌟 Awe Points</h2>
        <p className="text-3xl font-bold text-green-300 mt-2">124</p>
        <p className="text-sm text-gray-500">Earned by sustainable actions</p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        
        <Link to="/laptop">
          <button className="px-6 py-3 text-xl text-gray-900 bg-green-400 rounded-xl hover:bg-green-500 shadow-md">
            Laptop Usage Tracker
          </button>
        </Link>
        <Link to="/seating">
          <button className="px-6 py-3 text-gray-900 text-xl bg-white rounded-xl hover:bg-gray-200 shadow-md">
            Seating Proximity Map
          </button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 w-full max-w-4xl">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-green-400 mb-2">🖥️ Laptop Usage</h3>
          <p className="text-gray-300">
            Dark Mode Usage:{" "}
            <span className="font-bold text-green-300">
              {Math.round((darkModeUsage.reduce((a, b) => a + b, 0) /
                (darkModeUsage.reduce((a, b) => a + b, 0) + lightModeUsage.reduce((a, b) => a + b, 0))) *
                100)}
              %
            </span>
          </p>
          <p className="text-gray-300">
            Total Active Time:{" "}
            <span className="font-bold">
              {laptopActivityData.active.reduce((a, b) => a + b, 0)}h
            </span>
          </p>
          <p className="text-gray-300">
            Total Inactive Time:{" "}
            <span className="font-bold">
              {laptopActivityData.inactive.reduce((a, b) => a + b, 0)}h
            </span>
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-green-400 mb-2">📍 Seating Stats</h3>
          <p className="text-gray-300">
            Most Active Zone:{" "}
            <span className="font-bold text-blue-400">{mostActiveZone.zone}</span>
          </p>
          <p className="text-gray-300">
            Inactive Zones Turned Off:{" "}
            <span className="font-bold">{inactiveZonesCount}</span>
          </p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="mt-10 w-full max-w-6xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">📊 Daily Analytics</h2>

        {/* Seating Heatmap */}
        <div className="p-4 bg-gray-700 rounded-md mb-10">
          <h3 className="text-2xl font-semibold text-green-400 mb-4">🔥 Seating Heatmap</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
            {zoneOccupancy.map(({ zone, ratio, occupiedCount, totalSeats }) => (
              <div
                key={zone}
                className="rounded-lg p-6 text-white text-center shadow-md"
                style={{ backgroundColor: getHeatColor(ratio) }}
              >
                <h4 className="text-xl font-bold">{zone}</h4>
                <p>{`${occupiedCount} / ${totalSeats} seats occupied`}</p>
                <p>{(ratio * 100).toFixed(0)}% occupied</p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Laptop Active vs Inactive Time (Bar Chart) */}
          <div className="p-4 bg-gray-700 rounded-md">
            <h3 className="text-xl font-semibold mb-3 text-green-400">💻 Laptop Active vs Inactive Time (hours)</h3>
            <Bar
              data={{
                labels: hours,
                datasets: [
                  {
                    label: "Active",
                    data: laptopActivityData.active,
                    backgroundColor: "rgba(34,197,94,0.7)", // green
                  },
                  {
                    label: "Inactive",
                    data: laptopActivityData.inactive,
                    backgroundColor: "rgba(156,163,175,0.7)", // gray
                  },
                ],
              }}
              options={{ responsive: true, plugins: { legend: { position: "top" } } }}
            />
          </div>

          {/* Energy Saved (Line Chart) */}
          <div className="p-4 bg-gray-700 rounded-md">
            <h3 className="text-xl font-semibold mb-3 text-green-400">⚡ Energy Saved (kWh)</h3>
            <Line
              data={{
                labels: hours,
                datasets: [
                  {
                    label: "Energy Saved",
                    data: energySaved,
                    borderColor: "rgba(34,197,94,1)",
                    backgroundColor: "rgba(34,197,94,0.3)",
                    
                    fill: true,
                    tension: 0.3,
                  },
                ],
              }}
              options={{ responsive: true, plugins: { legend: { display: true } } }}
            />
          </div>

          {/* Dark Mode vs Light Mode Usage (Pie Chart) */}
          <div className="p-4 bg-gray-700 rounded-md">
            <h3 className="text-xl font-semibold mb-3 text-green-400">🌙 Dark Mode vs Light Mode (minutes)</h3>
            <div className="mx-auto" style={{ width: "250px", height: "250px" }}>
              <Pie
                data={{
                  labels: ["Dark Mode", "Light Mode"],
                  datasets: [
                    {
                      data: [
                        darkModeUsage.reduce((a, b) => a + b, 0),
                        lightModeUsage.reduce((a, b) => a + b, 0),
                      ],
                      backgroundColor: ["#22c55e", "#94a3b8"],
                      hoverOffset: 15,
                    },
                  ],
                }}
              />
            </div>
          </div>

          {/* CO2 Emission Saved (Line Chart) */}
          <div className="bg-gray-800 dark:bg-gray-700 p-4 rounded-lg shadow-md text-gray-200 dark:text-white">
            <h3 className="text-xl font-semibold mb-3 text-green-400">🌍 CO₂ Emission Saved (kg)</h3>
            <Line
              data={{
                labels: hours,
                datasets: [
                  {
                    label: "CO₂ Saved",
                    data: co2EmissionSaved,
                    borderColor: "rgba(34,197,94,1)",
                    backgroundColor: "rgba(34,197,94,0.3)",
                    fill: true,
                    tension: 0.3,
                  },
                ],
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;