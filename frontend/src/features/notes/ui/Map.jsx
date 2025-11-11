import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

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
        const res = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${pos.lat}%2C+${
            pos.lng
          }&key=${import.meta.env.VITE_REVERSE_GEOCODING_API_KEY}`
        );
        const data = await res.json();
        setLocation(data.results[0].formatted);
      }
      getLocation();
    },
    [pos, setLocation]
  );
}
export default Map;
