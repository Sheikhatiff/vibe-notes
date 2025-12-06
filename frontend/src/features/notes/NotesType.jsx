import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, MapPin, Lightbulb } from "lucide-react";

function NotesType() {
  const location = useLocation().pathname;

  const notes = [
    {
      path: "/notes/quick/new",
      label: "Quick Note",
      icon: Zap,
      description: "Instant capture",
      gradientFrom: "from-yellow-400",
      gradientTo: "to-orange-500",
    },
    {
      path: "/notes/smart/new",
      label: "Smart Note",
      icon: Lightbulb,
      description: "AI-powered",
      gradientFrom: "from-purple-400",
      gradientTo: "to-pink-500",
    },
    {
      path: "/notes/geo/new",
      label: "Geo Note",
      icon: MapPin,
      description: "Location-based",
      gradientFrom: "from-green-400",
      gradientTo: "to-emerald-500",
    },
  ];

  return (
    <div className="md:h-dvh md:bg-emerald-900 md:text-white flex md:flex-col items-center md:items-stretch justify-between md:justify-start gap-3 p-4 md:p-6">
      {/* Desktop view */}
      <div className="hidden md:flex md:flex-col gap-4 md:mt-8">
        {notes.map((note) => {
          const Icon = note.icon;
          const isActive = location.includes(note.path.split("/")[2]);
          return (
            <Link
              key={note.path}
              to={note.path}
              className={`group relative px-4 py-4 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                isActive
                  ? `bg-linear-to-r ${note.gradientFrom} ${note.gradientTo} text-white shadow-lg scale-105`
                  : "bg-emerald-800 text-emerald-100 hover:bg-emerald-700"
              }`}
            >
              <Icon size={24} />
              <div className="text-left">
                <div className="font-bold text-sm md:text-base">
                  {note.label}
                </div>
                <div className="text-xs opacity-80">{note.description}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Mobile view */}
      <div className="md:hidden flex gap-2 w-full justify-around">
        {notes.map((note) => {
          const Icon = note.icon;
          const isActive = location.includes(note.path.split("/")[2]);
          return (
            <Link
              key={note.path}
              to={note.path}
              className={`flex-1 px-2 py-3 rounded-lg transition-all duration-300 flex flex-col items-center gap-1 text-center ${
                isActive
                  ? `bg-linear-to-r ${note.gradientFrom} ${note.gradientTo} text-white shadow-lg`
                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              }`}
            >
              <Icon size={20} />
              <div className="text-xs font-bold">{note.label}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default NotesType;
