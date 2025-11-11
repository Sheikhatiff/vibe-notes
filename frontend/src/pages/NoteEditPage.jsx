import "leaflet/dist/leaflet.css";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import HeartIcon from "../../assets/icons/HeartIcon";
import Recorder from "../ui/Recorder";
import { Mic, PlusCircleIcon, X } from "lucide-react";
import { DetectClick, GetLocation } from "../features/notes/ui/Map";
import { useDispatch } from "react-redux";
import { useNotes } from "../hooks/useNotes";
import { getNoteThunk, updateNoteThunk } from "../features/notes/notesThunks";
import Loader from "../ui/Loader";
import { showError, showSuccess } from "../utils/toast";

const ChangeMapView = React.memo(({ coords }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([coords.lat, coords.lng], 15);
  }, [coords.lat, coords.lng, map]);

  return null;
});

ChangeMapView.displayName = "ChangeMapView";

function NoteEditPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, type } = useParams();
  const { currentNote: note, loading } = useNotes();

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);
  const [fav, setFav] = useState(false);
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 51.505, lng: -0.09 });

  const toggleFav = useCallback(() => {
    setFav((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    if (note) {
      setTitle(note.title || "New Note");
      setDescription(note.note || "");
      setTags(note.tags ? [...note.tags] : []);
      setFav(note.favourite || false);
      setLocation(note.location || "");
      setCoordinates(note.coordinates || { lat: 51.505, lng: -0.09 });
    }
  }, [note]);

  const handleTagAdd = useCallback(() => {
    if (!tag || tags.includes(tag.toLowerCase())) return;
    setTags((prev) => [...prev, tag.toLowerCase()]);
    setTag("");
  }, [tag, tags]);

  const handleTagDelete = useCallback((tagToDelete) => {
    setTags((prev) => prev.filter((t) => t !== tagToDelete));
  }, []);

  useEffect(() => {
    dispatch(getNoteThunk(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (note) {
      setTitle(note.title || "New Note");
      setDescription(note.note || "");
      setTags(note.tags ? [...note.tags] : []);
      setFav(note.favourite || false);
      setLocation(note.location || "");
      setCoordinates(note.coordinates || { lat: 51.505, lng: -0.09 });
      setIsInitialLoad(false);
    }
  }, [note]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      const formData = new FormData(e.target);
      const noteType = formData.get("type");
      const tagsStr = formData.get("tags");
      const tagsList = tagsStr
        ? tagsStr
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const noteData = {
        title: formData.get("title"),
        note: formData.get("description"),
        favorite: formData.get("fav") === "true",
        type: noteType,
        tags: tagsList,
      };

      if (noteType === "smart") {
        noteData.prompt = formData.get("prompt");
      } else if (noteType === "geo") {
        const coords = formData.get("coordinates");
        if (coords) {
          const [lat, lng] = coords.split(",").map(Number);
          noteData.coordinates = { lat, lng };
          noteData.locationName = formData.get("location-name");
        }
      }

      try {
        await dispatch(updateNoteThunk({ id, updates: noteData })).unwrap();
        showSuccess(`${noteType} note updated successfully!`);
        navigate("/notes");
      } catch (error) {
        console.error("Update failed:", error);
        showError(error || "Failed to update note. Please try again.");
        setIsSubmitting(false);
      }
    },
    [dispatch, id, navigate]
  );

  // Memoize map component to prevent unnecessary re-renders
  const mapComponent = useMemo(() => {
    if (note?.type !== "geo") return null;

    return (
      <div className="relative h-60 sm:h-70 mb-6">
        <div className="absolute inset-1 z-0">
          <MapContainer
            center={[coordinates.lat, coordinates.lng]}
            zoom={15}
            className="h-full w-full rounded-xl shadow-lg"
            scrollWheelZoom={false}
          >
            <ChangeMapView coords={coordinates} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {location && (
              <Marker position={[coordinates.lat, coordinates.lng]}>
                <Popup>
                  <span>{location}</span>
                </Popup>
              </Marker>
            )}
            <DetectClick setNewPos={setCoordinates} />
            <GetLocation pos={coordinates} setLocation={setLocation} />
          </MapContainer>
        </div>
      </div>
    );
  }, [note?.type, coordinates, location]);

  if (isInitialLoad && (loading || !note)) {
    return <Loader />;
  }

  if (isSubmitting) {
    return <Loader />;
  }

  if (!note) {
    return <div className="p-5 text-center">Note not found</div>;
  }

  return (
    <div className="p-3 m-3 sm:p-5 sm:m-5">
      {mapComponent}

      <div className="uppercase tracking-wide">
        <h1 className="font-bold text-2xl">{note.type || "simple"} Note</h1>
        <h5 className="text-stone-500 mt-4">
          Edit your {note.type || "simple"} note
        </h5>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="my-4">
          <HeartIcon
            color={fav ? "#059669" : "transparent"}
            size={35}
            handleClick={toggleFav}
            strokeColor="#059669"
            className="ml-1"
          />
          <input type="hidden" name="fav" value={fav ? "true" : "false"} />
        </div>

        <div className="mb-5 mt-2 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-20 uppercase tracking-wide font-medium">
            Title <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            className="w-full rounded-md border border-stone-400 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:outline-none focus:ring focus:ring-emerald-400 md:px-6 md:py-3 sm:ml-6"
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {note.type === "geo" && (
          <div className="mb-5 mt-2 flex gap-2 flex-col sm:flex-row sm:items-center">
            <label className="sm:basis-20 uppercase tracking-wide font-medium">
              Location
            </label>
            <input
              className="w-full rounded-md border border-stone-400 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:outline-none focus:ring focus:ring-emerald-400 md:px-6 md:py-3 sm:ml-6"
              type="text"
              name="location-name"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        )}

        <div className="mb-2 mt-8 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-20 uppercase tracking-wide font-medium">
            Note <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            className="w-full rounded-md border border-stone-400 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:outline-none focus:ring focus:ring-emerald-400 md:px-6 md:py-3 sm:ml-6 resize-none"
            name="description"
            autoFocus
            placeholder="What's on your mind?"
            value={description}
            rows={8}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <Recorder Icon={<Mic />} setContent={setDescription} />

        <div className="mb-5 mt-2 flex gap-2 flex-row items-center">
          <label className="sm:basis-20 uppercase tracking-wide font-medium">
            Tags
          </label>
          <input
            className="w-full rounded-md border border-stone-400 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:outline-none focus:ring focus:ring-emerald-400 md:px-6 md:py-3 sm:ml-6"
            type="text"
            name="tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleTagAdd())
            }
          />
          <button
            type="button"
            className="hover:text-emerald-900 text-stone-700"
            onClick={handleTagAdd}
          >
            <PlusCircleIcon />
          </button>
        </div>

        <div className="flex flex-wrap gap-4 items-center sm:pl-20">
          {tags.map((t) => (
            <div className="flex space-x-2" key={t}>
              <div className="text-sm font-semibold italic text-emerald-600">
                #{t}
              </div>
              <button
                className="text-sm text-red-900"
                type="button"
                onClick={() => handleTagDelete(t)}
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>

        <input type="hidden" name="tags" value={tags.join(",")} />
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="id" value={id} />
        {note.type === "geo" && (
          <input
            type="hidden"
            name="coordinates"
            value={`${coordinates.lat},${coordinates.lng}`}
          />
        )}

        <div className="mb-2 flex flex-col-reverse sm:flex-row mt-12 gap-4 sm:gap-6 justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-80 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-2 px-4 rounded-md uppercase tracking-wide transition-colors duration-300"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="hover:text-emerald-700 hover:font-bold uppercase transition-colors duration-300 border-y border-emerald-600 p-2 px-4 w-30 items-end rounded-md tracking-widest font-semibold"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default NoteEditPage;
