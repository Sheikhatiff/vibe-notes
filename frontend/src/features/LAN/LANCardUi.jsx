import React from "react";
import { useNavigate } from "react-router-dom";

function LANCardUi() {
  const navigate = useNavigate();
  function handleClick() {
    navigate("/lan");
  }
  return (
    <svg
      viewBox="0 0 400 280"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", maxWidth: "100%" }}
      onClick={handleClick}
    >
      <defs>
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d1fae5" stopOpacity="1" />
          <stop offset="100%" stopColor="#a7f3d0" stopOpacity="1" />
        </linearGradient>

        {/* Gradient for devices */}
        <linearGradient id="deviceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
          <stop offset="100%" stopColor="#059669" stopOpacity="1" />
        </linearGradient>

        {/* Animations */}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
          
          @keyframes transfer {
            0% { offset-distance: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { offset-distance: 100%; opacity: 0; }
          }
          
          .wifi-ring-1 { animation: pulse 2s ease-in-out infinite; }
          .wifi-ring-2 { animation: pulse 2s ease-in-out 0.3s infinite; }
          .wifi-ring-3 { animation: pulse 2s ease-in-out 0.6s infinite; }
          
          .device { animation: float 3s ease-in-out infinite; }
          .device-2 { animation: float 3s ease-in-out 0.5s infinite; }
          .device-3 { animation: float 3s ease-in-out 1s infinite; }
          
          .file-transfer { 
            animation: transfer 3s ease-in-out infinite;
            offset-path: path('M 120 140 Q 200 100 280 140');
          }
          
          .file-transfer-2 { 
            animation: transfer 3s ease-in-out 1s infinite;
            offset-path: path('M 280 140 Q 200 180 120 140');
          }
        `}</style>
      </defs>

      {/* Card Background */}
      <rect
        x="10"
        y="10"
        width="380"
        height="260"
        rx="20"
        fill="#000"
        opacity="0.1"
      />
      <rect
        x="10"
        y="5"
        width="380"
        height="260"
        rx="20"
        fill="url(#cardGradient)"
        stroke="#10b981"
        strokeWidth="3"
      />

      {/* Title */}
      <rect
        x="30"
        y="25"
        width="340"
        height="50"
        rx="10"
        fill="#ffffff"
        opacity="0.7"
      />
      <text
        x="200"
        y="48"
        fontFamily="Arial, sans-serif"
        fontSize="18"
        fontWeight="bold"
        fill="#059669"
        textAnchor="middle"
      >
        Share Across Devices
      </text>
      <text
        x="200"
        y="65"
        fontFamily="Arial, sans-serif"
        fontSize="12"
        fill="#047857"
        textAnchor="middle"
      >
        Same WiFi • Any Device • Instant Transfer
      </text>

      {/* WiFi Router */}
      <g transform="translate(200, 160)">
        <circle
          className="wifi-ring-3"
          cx="0"
          cy="0"
          r="60"
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          opacity="0.3"
        />
        <circle
          className="wifi-ring-2"
          cx="0"
          cy="0"
          r="45"
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          opacity="0.5"
        />
        <circle
          className="wifi-ring-1"
          cx="0"
          cy="0"
          r="30"
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          opacity="0.7"
        />

        <rect
          x="-15"
          y="-8"
          width="30"
          height="16"
          rx="3"
          fill="url(#deviceGradient)"
        />
        <circle cx="-8" cy="0" r="2" fill="#d1fae5" />
        <circle cx="0" cy="0" r="2" fill="#d1fae5" />
        <circle cx="8" cy="0" r="2" fill="#d1fae5" />
        <rect
          x="-3"
          y="-15"
          width="6"
          height="7"
          rx="1"
          fill="url(#deviceGradient)"
        />
      </g>

      {/* Device 1 - Laptop */}
      <g className="device" transform="translate(80, 140)">
        <rect
          x="-20"
          y="-12"
          width="40"
          height="24"
          rx="2"
          fill="url(#deviceGradient)"
          stroke="#047857"
          strokeWidth="1.5"
        />
        <rect x="-18" y="-10" width="36" height="18" rx="1" fill="#d1fae5" />
        <rect x="-25" y="12" width="50" height="3" rx="1.5" fill="#059669" />
        <path
          d="M -5 -3 L 5 -3 L 5 3 L -5 3 Z M -3 0 L 3 0"
          stroke="#10b981"
          strokeWidth="1.5"
          fill="none"
        />
      </g>

      {/* Device 2 - Phone */}
      <g className="device-2" transform="translate(320, 140)">
        <rect
          x="-12"
          y="-18"
          width="24"
          height="36"
          rx="3"
          fill="url(#deviceGradient)"
          stroke="#047857"
          strokeWidth="1.5"
        />
        <rect x="-10" y="-15" width="20" height="28" rx="1" fill="#d1fae5" />
        <circle cx="0" cy="15" r="2" fill="#d1fae5" />
      </g>

      {/* Device 3 - Tablet */}
      <g className="device-3" transform="translate(200, 230)">
        <rect
          x="-18"
          y="-14"
          width="36"
          height="28"
          rx="2"
          fill="url(#deviceGradient)"
          stroke="#047857"
          strokeWidth="1.5"
        />
        <rect x="-16" y="-12" width="32" height="22" rx="1" fill="#d1fae5" />
        <circle cx="0" cy="12" r="1.5" fill="#d1fae5" />
      </g>

      {/* File Transfers */}
      <g className="file-transfer">
        <rect
          x="-6"
          y="-8"
          width="12"
          height="10"
          rx="1"
          fill="#fbbf24"
          stroke="#f59e0b"
          strokeWidth="1"
        />
        <path
          d="M -2 -8 L -2 -11 L 4 -11 L 4 -5 L 2 -5"
          fill="#fbbf24"
          stroke="#f59e0b"
          strokeWidth="1"
        />
      </g>

      <g className="file-transfer-2">
        <rect
          x="-6"
          y="-8"
          width="12"
          height="10"
          rx="1"
          fill="#60a5fa"
          stroke="#3b82f6"
          strokeWidth="1"
        />
        <path
          d="M -2 -8 L -2 -11 L 4 -11 L 4 -5 L 2 -5"
          fill="#60a5fa"
          stroke="#3b82f6"
          strokeWidth="1"
        />
      </g>

      {/* Status Indicator */}
      <circle cx="380" cy="25" r="6" fill="#10b981">
        <animate
          attributeName="opacity"
          values="1;0.3;1"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

export default LANCardUi;
