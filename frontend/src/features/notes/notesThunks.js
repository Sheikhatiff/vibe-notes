import { createAsyncThunk } from "@reduxjs/toolkit";
import { notesApi } from "../../services/endpoints/notesApi";

export const createNoteThunk = createAsyncThunk(
  "notes/create",
  async (noteData, { rejectWithValue }) => {
    try {
      const data = await notesApi.createNote(noteData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create note"
      );
    }
  }
);

export const getAllNotesThunk = createAsyncThunk(
  "notes/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await notesApi.getAllNotes(params);
      // Return response.data (which contains { notes: [...], results: 5 })
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notes"
      );
    }
  }
);

export const getNoteThunk = createAsyncThunk(
  "notes/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await notesApi.getNote(id);
      console.log("Single Note Response:", response);
      // Return the full response (which has { status, data: { note: {...} } })
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch note"
      );
    }
  }
);

export const updateNoteThunk = createAsyncThunk(
  "notes/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const data = await notesApi.updateNote(id, updates);
      return data.data.note;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update note"
      );
    }
  }
);

export const deleteNoteThunk = createAsyncThunk(
  "notes/delete",
  async (id, { rejectWithValue }) => {
    try {
      await notesApi.deleteNote(id);
      return { id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete note"
      );
    }
  }
);
