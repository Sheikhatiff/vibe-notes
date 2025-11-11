import React from "react";
import CreateNote from "../features/notes/CreateNote";
import NotesType from "../features/notes/NotesType";
import { useLocation } from "react-router-dom";
import AiNote from "../features/notes/CreateAiNote";
import MapNotePage from "../features/notes/MapNotePage";

function CreateNotePage() {
  const path = useLocation().pathname.split("/")[2];
  return (
    <div className="grid grid-rows-12 md:grid-rows-1 md:grid-cols-12 max-h-30 sm:min-h-dvh">
      <NotesType />
      <div className="row-span-10 md:col-span-10 md:h-dvh m-4 px-4 py-6 md:overflow-auto">
        {path === "quick" && <CreateNote type={path} />}
        {path === "smart" && <AiNote type={path} />}
        {path === "geo" && <MapNotePage type={path} />}
      </div>
    </div>
  );
}

export default CreateNotePage;
