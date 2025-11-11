import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotesThunk } from "../features/notes/notesThunks";

export const useNotes = () => {
  const dispatch = useDispatch();
  const { notes, currentNote, loading, error } = useSelector(
    (state) => state.notes
  );

  useEffect(() => {
    dispatch(getAllNotesThunk());
  }, [dispatch]);

  return { notes, currentNote, loading, error };
};
