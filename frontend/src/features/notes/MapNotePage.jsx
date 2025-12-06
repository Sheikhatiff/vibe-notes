// import React, { useState } from "react";
import { useEffect, useState } from "react";
import Loader from "../../ui/Loader.jsx";
import MapNote from "./CreateMapNote";
import Map from "./ui/Map";

function MapNotePage({ type }) {
  const DEFAULT_COORDS = { lat: 33.7299, lng: 73.0372 }; // Faisal Mosque
  const [pos, setPos] = useState(DEFAULT_COORDS);
  const [newPos, setNewPos] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState("");

  useEffect(() => {
    const getCurPos = () => {
      if (!navigator.geolocation) {
        alert("Your browser does not support geolocation");
        return;
      }

      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (p) => {
          const newPos = {
            lat: p.coords.latitude,
            lng: p.coords.longitude,
          };
          setPos(newPos);
          setIsLoading(false);
        },
        (error) => {
          console.error("Location error:", error.message);
          setIsLoading(false);
        }
      );
    };

    getCurPos();
  }, []);

  return (
    <div className="grid grid-rows-[45vh_1fr] md:grid-rows-1 md:grid-cols-2 gap-4 min-h-[calc(100vh-8rem)] bg-white rounded-2xl overflow-hidden shadow-xl">
      {/* Map Section */}
      <div className="bg-linear-to-br from-emerald-100 to-stone-100 relative order-2 md:order-1 rounded-2xl overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <Loader fullScreen={false} size="md" />
          </div>
        )}
        {!isLoading && (
          <Map
            coordinates={pos}
            setNewPos={setNewPos}
            setLocation={setLocation}
          />
        )}
      </div>

      {/* Form Section */}
      <div className="overflow-auto order-1 md:order-2 bg-white">
        <MapNote
          type={type}
          newPos={newPos}
          curPos={pos}
          location={location}
          setLocation={setLocation}
        />
      </div>
    </div>
  );
}

export default MapNotePage;
