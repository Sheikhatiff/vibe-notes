import { redirect } from "react-router-dom";
import store from "../../../store";
import { createNoteThunk } from "../notesThunks";
import { showError, showSuccess } from "../../../utils/toast";
export async function createNoteAction({ request }) {
  const formData = await request.formData();
  const type = formData.get("type");
  const tagsStr = formData.get("tags");
  const tags = tagsStr
    ? tagsStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const noteData = {
    title: formData.get("title"),
    note: formData.get("description"),
    favorite: formData.get("fav"),
    type,
    tags,
  };

  if (type === "smart") {
    noteData.prompt = formData.get("prompt");
  } else if (type === "geo") {
    const coordinates = formData.get("coordinates");
    if (!coordinates) return { error: "Coordinates required" };
    const [lat, lng] = coordinates.split(",").map(Number);
    noteData.coordinates = { lat, lng };
    noteData.locationName = formData.get("location-name");
  }

  try {
    await store.dispatch(createNoteThunk(noteData)).unwrap();
    showSuccess(`${type} note created successfully !`);
    return redirect("/notes");
  } catch (error) {
    showError("Error at creating note!");
    return { error: error.message || "Note creation failed" };
  }
}
