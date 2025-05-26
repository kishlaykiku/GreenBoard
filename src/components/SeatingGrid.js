import React, { useState } from 'react';

const zones = ["Zone 1", "Zone 2", "Zone 3", "Zone 4"];
const zoneSize = 4;

const generateSeats = () => {
  return Array.from({ length: zoneSize * zoneSize }, (_, index) => ({
    id: index,
    occupied: false,
  }));
};

export default function SeatingGrid() {
  const [userSeat, setUserSeat] = useState(null);
  const [zoneData, setZoneData] = useState(
    zones.map((zone) => ({
      name: zone,
      seats: generateSeats(),
    }))
  );

  const handleSeatClick = (zoneIndex, seatIndex) => {
    const updatedZones = zoneData.map((zone, zIdx) => {
      const updatedSeats = zone.seats.map((seat, sIdx) => ({
        ...seat,
        occupied: zIdx === zoneIndex && sIdx === seatIndex,
      }));
      return {
        ...zone,
        seats: updatedSeats,
      };
    });
    setZoneData(updatedZones);
    setUserSeat({ zone: zoneData[zoneIndex].name, seat: seatIndex });
  };

  const getSuggestion = () => {
    const population = zoneData.map((zone) =>
      zone.seats.filter((seat) => seat.occupied).length
    );
    const userZoneIndex = zones.findIndex((z) => z === userSeat?.zone);
    const userPop = population[userZoneIndex];
    const maxPop = Math.max(...population);
    const maxPopZoneIndex = population.findIndex((p) => p === maxPop);

    if (userPop < maxPop && userZoneIndex !== maxPopZoneIndex) {
      return `Try moving to ${zones[maxPopZoneIndex]} for better energy efficiency 🌱`;
    }
    return null;
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-center">Seating Zones</h2>
      {zoneData.map((zone, zIdx) => (
        <div key={zone.name} className="border rounded-xl p-4 bg-white shadow-md">
          <h3 className="text-xl font-semibold mb-2">{zone.name}</h3>
          <div className="grid grid-cols-4 gap-2">
            {zone.seats.map((seat, sIdx) => (
              <div
                key={sIdx}
                className={`w-10 h-10 rounded flex items-center justify-center cursor-pointer transition-colors duration-200 
                  ${seat.occupied ? 'bg-green-600 text-white' : 'bg-green-200 hover:bg-green-300'}`}
                onClick={() => handleSeatClick(zIdx, sIdx)}
              >
                {sIdx + 1}
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm">
            {zone.seats.some((seat) => seat.occupied)
              ? 'AC/Light On'
              : 'AC/Light Off'}
          </p>
        </div>
      ))}

      {userSeat && (
        <div className="bg-yellow-100 p-4 rounded shadow text-center text-sm">
          <p>
            You are seated at <strong>{userSeat.zone}</strong>, Seat #{userSeat.seat + 1}
          </p>
          {getSuggestion() && <p className="mt-1 text-red-600">{getSuggestion()}</p>}
        </div>
      )}
    </div>
  );
}