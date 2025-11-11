import { useState } from "react";

export function useGeolocation(defaultPos = null) {
  const [pos, setPos] = useState(defaultPos);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function getPosition() {
    if (!navigator.geolocation)
      return setError("Your browser does not support geolocation");
    setIsLoading(() => !isLoading);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPos({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
        });
        setIsLoading(() => !isLoading);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }
  return { isLoading, pos, error, getPosition };
}
