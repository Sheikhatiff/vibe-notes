import React from "react";
import CreateNote from "../features/notes/CreateNote";
import NotesType from "../features/notes/NotesType";
import { useLocation } from "react-router-dom";
import AiNote from "../features/notes/CreateAiNote";
import MapNotePage from "../features/notes/MapNotePage";

function CreateNotePage() {
  const path = useLocation().pathname.split("/")[2];

  const getNoteTypeLabel = () => {
    const labels = {
      quick: "Quick Note",
      smart: "Smart Note",
      geo: "Geo Note",
    };
    return labels[path] || "Create Note";
  };

  return (
    <div className="min-h-dvh bg-linear-to-br from-emerald-50 via-stone-50 to-emerald-50 flex flex-col">
      {/* Header */}
      <div className="bg-linear-to-r from-emerald-900 to-emerald-800 text-white px-6 py-4 shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight">
          {getNoteTypeLabel()}
        </h1>
        <p className="text-emerald-100 mt-1 text-sm font-medium">
          {path === "quick" && "Capture quick thoughts and ideas"}
          {path === "smart" && "Let AI help you craft the perfect note"}
          {path === "geo" && "Create location-based memories"}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 bg-emerald-900 shadow-2xl flex-col">
          <NotesType />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {path === "quick" && <CreateNote type={path} />}
            {path === "smart" && <AiNote type={path} />}
            {path === "geo" && <MapNotePage type={path} />}
          </div>
        </div>
      </div>

      {/* Mobile Navigation (visible on small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-emerald-200 shadow-2xl z-40">
        <NotesType />
      </div>
      <div className="md:hidden h-32"></div>
    </div>
  );
}

export default CreateNotePage;
