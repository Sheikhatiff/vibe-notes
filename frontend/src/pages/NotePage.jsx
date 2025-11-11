import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";

import { useParams } from "react-router-dom";
import Tag from "../ui/Tag";
import LinkButton from "../ui/LinkButton";
import { Download, MoveLeft } from "lucide-react";
import HeartIcon from "../../assets/icons/HeartIcon";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useDispatch } from "react-redux";
import { getNoteThunk } from "../features/notes/notesThunks";
import Loader from "../ui/Loader";
import { useNotes } from "../hooks/useNotes";
import { formatDate } from "../utils/formatDate";
import { handleDownloadNotePDF } from "../utils/noteToPdf";
function NotePage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentNote: note, loading } = useNotes();
  useEffect(
    function () {
      dispatch(getNoteThunk(id));
    },
    [dispatch, id]
  );

  return (
    <>
      {loading && !note && <Loader />}
      <div className=" p-2 m-2 sm:p-4 sm:m-4 ">
        {note ? (
          <div className="  italic">
            {note?.coordinates && (
              <div className="relative h-60 sm:h-70">
                <div className="absolute inset-1 z-0">
                  <MapContainer
                    center={[note?.coordinates.lat, note?.coordinates.lng]}
                    zoom={15}
                    className="h-full w-full rounded-xl shadow-lg"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[note?.coordinates.lat, note?.coordinates.lng]}
                    >
                      <Popup>
                        <span>{note?.location}</span>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}
            <div className="bg-emerald-300 my-4 border border-emerald-300 rounded-2xl  p-4 m-2  flex items-center justify-between sm:pr-8 sm:px-4">
              <h1 autoFocus className="text-2xl sm:text-4xl font-bold ">
                {note.title}
              </h1>

              <LinkButton
                css="flex gap-2"
                onClick={() => handleDownloadNotePDF(note)}
              >
                <Download /> 📃
              </LinkButton>

              <LinkButton type="link" to={-1} css="text-emerald-950">
                <MoveLeft size={30} />
              </LinkButton>
            </div>
            <div className=" px-4 m-2  flex items-center justify-around sm:pr-8 sm:px-4">
              <span className="text-sm sm:text-[16px] font-medium bg-emerald-100">
                #{note.type} Note.
              </span>
              {note?.favorite && <HeartIcon size={30} />}
            </div>
            <div className=" p-4 flex items-center justify-between sm:pr-8">
              <p className="text-xs sm:text-[16px]">
                <span className="font-medium">created at:</span>{" "}
                <span className="italic">{formatDate(note.createdAt)}</span>
              </p>
              {note?.updatedAt && note.updatedAt !== note.createdAt && (
                <p className="text-xs sm:text-[16px]">
                  <span className="font-medium">updated at:</span>{" "}
                  <span className="italic">{formatDate(note.updatedAt)}</span>
                </p>
              )}
            </div>
            {note?.locationName && (
              <div className="bg-emerald-200 border border-emerald-200 rounded-md p-4 sm:text-xl font-bold sm:px-8">
                LOCATION:{" "}
                <span className="italic"> "{note?.locationName}..."</span>
              </div>
            )}
            {note?.prompt && (
              <div className="bg-emerald-200 border border-emerald-200 rounded-md p-4 sm:text-xl font-bold sm:px-8">
                PROMPT: <span className="italic"> "{note?.prompt}..."</span>
              </div>
            )}
            <div className="bg-emerald-100 border-b border-emerald-100 rounded-2xl">
              <p className=" p-4 sm:text-xl sm:px-8">{note.note}</p>
            </div>
            <div className=" my-4 p-4 sm:text-xl sm:px-8 flex flex-wrap space-x-2 sm:space-x-4">
              {note.tags.map((tag, i) => (
                <Tag tag={tag} css={"text-[16px]"} key={i} />
              ))}
            </div>
          </div>
        ) : (
          <p>No Notes available of this id</p>
        )}
      </div>
    </>
  );
}

export default NotePage;
