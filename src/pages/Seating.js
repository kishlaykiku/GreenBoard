import React, { useState } from "react";
import { Link } from "react-router-dom";

const zones = {
  "Zone 1": [false, true, false, false, false, false, false, false, false, false],
  "Zone 2": [true, true, false, false, true, false, false, false, false, false],
  "Zone 3": [false, false, false, false, false, false, false, false, false, false],
  "Zone 4": [true, false, false, true, false, false, false, false, false, false],
};

const Seating = () => {
  const [selectedSeat, setSelectedSeat] = useState({ zone: null, index: null });

  const handleSeatClick = (zone, index) => {
    setSelectedSeat({ zone, index });
  };

  const isFarFromOthers = (zone, index) => {
    const allSeats = Object.entries(zones)
      .flatMap(([z, seats]) => seats.map((occupied, i) => ({ zone: z, index: i, occupied })));
    const otherOccupiedSeats = allSeats.filter(
      s => s.occupied && (s.zone !== zone || s.index !== index)
    );
    return otherOccupiedSeats.every(s => s.zone !== zone);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-900 p-6">
      <div className="flex justify-between mb-4 w-full max-w-6xl px-4 gap-5">
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-green-400">🪑 Seating Proximity Awareness</h2>
          <p className="text-center text-gray-400 mb-4">Select your seat. Group up. Save energy.</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-md text-sm text-gray-300 w-60">
          <h4 className="font-semibold mb-2">Seat Info</h4>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 bg-gray-500 rounded"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 bg-green-600 rounded"></div>
            <span>Unoccupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-600 rounded"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl px-4">
        {Object.entries(zones).map(([zoneName, seats]) => {
          const isZoneActive = seats.some((occupied) => occupied);
          return (
            <div key={zoneName} className="p-6 rounded-lg shadow-md bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-200 mb-2">{zoneName}</h3>
              <p className={`text-sm mb-4 ${isZoneActive ? "text-green-400" : "text-red-400"}`}>
                {isZoneActive ? "💡 Lights & AC ON" : "🔌 Lights & AC OFF"}
              </p>
              <div className="grid grid-cols-5 gap-3">
                {seats.map((occupied, i) => {
                  const isSelected = selectedSeat.zone === zoneName && selectedSeat.index === i;
                  return (
                    <button
                      key={i}
                      disabled={occupied}
                      onClick={() => handleSeatClick(zoneName, i)}
                      className={`w-12 h-12 rounded ${
                        occupied
                          ? "bg-gray-600 cursor-not-allowed"
                          : isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {selectedSeat.zone && isFarFromOthers(selectedSeat.zone, selectedSeat.index) && (
        <div className="mt-6 bg-yellow-900 border-l-4 border-yellow-500 p-4 rounded w-full max-w-lg text-sm text-yellow-300">
          ⚠️ You're seated away from others. Consider moving to a more populated zone to save energy!
        </div>
      )}

      <Link to="/">
        <button className="mt-6 px-5 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 shadow">
          ← Back to Dashboard
        </button>
      </Link>
    </div>
  );
};

export default Seating;