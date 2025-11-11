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
    <div className="grid grid-rows-[40vh_1fr] min-h-screen">
      <div className="bg-emerald-200 relative">
        {isLoading && <Loader />}
        {!isLoading && (
          <Map
            coordinates={pos}
            setNewPos={setNewPos}
            setLocation={setLocation}
          />
        )}{" "}
      </div>
      <div className="overflow-auto">
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
