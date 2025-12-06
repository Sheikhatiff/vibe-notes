import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { showError } from "../../../utils/toast.jsx";

// Fix default marker icons for production
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function Map({ coordinates, setNewPos, setLocation }) {
  const [tempPos, setTempPos] = useState(coordinates);

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={13}
        className="h-full w-full rounded-xl shadow-lg"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coordinates.lat, coordinates.lng]}>
          <Popup>
            <span>hey</span>
          </Popup>
        </Marker>
        {tempPos && (
          <Marker position={[tempPos.lat, tempPos.lng]}>
            <Popup>
              <span>hey</span>
            </Popup>
          </Marker>
        )}
        <DetectClick setPos={setTempPos} setNewPos={setNewPos} />
        <GetLocation pos={tempPos} setLocation={setLocation} />
      </MapContainer>
    </div>
  );
}

export function DetectClick({ setPos, setNewPos }) {
  useMapEvents({
    click: (e) => {
      if (setPos) setPos(e.latlng);
      setNewPos(e.latlng);
    },
  });
}

export function GetLocation({ pos, setLocation }) {
  useEffect(
    function () {
      async function getLocation() {
        try {
          const apiKey = import.meta.env.VITE_REVERSE_GEOCODING_API_KEY;

          if (!apiKey) {
            throw new Error("Reverse geocoding API key is not configured");
          }

          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${pos.lat}%2C+${pos.lng}&key=${apiKey}`,
            { timeout: 10000 } // 10 second timeout
          );

          if (!res.ok) {
            throw new Error(`API returned status ${res.status}`);
          }

          const data = await res.json();

          // Check if we got valid results
          if (!data.results || data.results.length === 0) {
            showError(
              "Unable to find location details. Please enter manually."
            );
            setLocation("");
            return;
          }

          // Check for API errors in response (code 0 means success)
          if (data.status?.code && data.status.code !== 0) {
            const errorMsg = data.status?.message || "Geocoding service error";
            showError(`Location service: ${errorMsg}. Please enter manually.`);
            setLocation("");
            return;
          }

          // Successfully got location
          setLocation(data.results[0].formatted);
        } catch (error) {
          console.error("Reverse Geocoding Error:", error);

          let errorMessage = "Unable to fetch location details";

          if (error?.message?.includes("API key")) {
            errorMessage = "Location service is not configured";
          } else if (error?.message?.includes("quota")) {
            errorMessage = "Location service quota exceeded";
          } else if (
            error?.message?.includes("network") ||
            error?.message?.includes("fetch")
          ) {
            errorMessage = "Network error while fetching location";
          } else if (error?.message?.includes("timeout")) {
            errorMessage = "Location service request timed out";
          }

          showError(`${errorMessage}. Please enter location manually.`);
          setLocation("");
        }
      }

      if (pos) {
        getLocation();
      }
    },
    [pos, setLocation]
  );
}
export default Map;
