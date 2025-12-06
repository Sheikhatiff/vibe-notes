import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

function ExpirationTimer({ updatedAt }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!updatedAt) return;

      // Parse the updatedAt timestamp
      const updateTime = new Date(updatedAt).getTime();
      const expirationTime = updateTime + 24 * 60 * 60 * 1000; // 24 hours from update
      const now = new Date().getTime();
      const difference = expirationTime - now;

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        // Timer expired
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [updatedAt]);

  const isExpiringSoon = timeLeft.hours === 0 && timeLeft.minutes < 60;
  const isExpired =
    timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 font-semibold transition-all duration-300 ${
        isExpired
          ? "bg-red-50 border-red-300 text-red-700"
          : isExpiringSoon
          ? "bg-orange-50 border-orange-300 text-orange-700"
          : "bg-emerald-50 border-emerald-300 text-emerald-700"
      }`}
    >
      <Clock size={24} className="shrink-0" />
      <div className="flex flex-col">
        <span className="text-xs opacity-75">Data expires in:</span>
        <span className="text-lg font-bold">
          {String(timeLeft.hours).padStart(2, "0")}:
          {String(timeLeft.minutes).padStart(2, "0")}:
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
      </div>
      {isExpired && <span className="ml-auto text-sm font-bold">Expired</span>}
      {isExpiringSoon && !isExpired && (
        <span className="ml-auto text-sm font-bold animate-pulse">
          Expiring!
        </span>
      )}
    </div>
  );
}

export default ExpirationTimer;
