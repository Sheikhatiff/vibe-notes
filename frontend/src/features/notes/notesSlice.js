import { createSlice } from "@reduxjs/toolkit";
import {
  createNoteThunk,
  getAllNotesThunk,
  getNoteThunk,
  updateNoteThunk,
  deleteNoteThunk,
} from "./notesThunks";

const initialState = {
  notes: [],
  currentNote: null,
  loading: false,
  error: null,
  totalNotes: 0,
  optimisticUpdates: {},
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentNote: (state) => {
      state.currentNote = null;
    },
    optimisticUpdateNote: (state, action) => {
      const { id, updates } = action.payload;
      const noteIndex = state.notes.findIndex((note) => note._id === id);
      if (noteIndex !== -1) {
        state.notes[noteIndex] = { ...state.notes[noteIndex], ...updates };
        state.optimisticUpdates[id] = true;
      }
    },
    optimisticDeleteNote: (state, action) => {
      state.notes = state.notes.filter((note) => note._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Create Note
    builder
      .addCase(createNoteThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNoteThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.unshift(action.payload.note);
        state.totalNotes += 1;
      })
      .addCase(createNoteThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get All Notes
    builder
      .addCase(getAllNotesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllNotesThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Fix: action.payload is already the data object with notes array
        state.notes = action.payload.notes || [];
        state.totalNotes =
          action.payload.results || action.payload.notes?.length || 0;
      })
      .addCase(getAllNotesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Single Note
    builder
      .addCase(getNoteThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNoteThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Fix: action.payload.data.note (from API response structure)
        state.currentNote = action.payload.data?.note || null;
      })
      .addCase(getNoteThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Note
    builder
      .addCase(updateNoteThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNoteThunk.fulfilled, (state, action) => {
        state.loading = false;
        const noteIndex = state.notes.findIndex(
          (note) => note._id === action.payload.note._id
        );
        if (noteIndex !== -1) {
          state.notes[noteIndex] = action.payload.note;
        }
        if (state.currentNote?._id === action.payload.note._id) {
          state.currentNote = action.payload.note;
        }
        delete state.optimisticUpdates[action.payload.note._id];
      })
      .addCase(updateNoteThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Revert optimistic update if it exists
        const id = action.meta.arg.id;
        if (state.optimisticUpdates[id]) {
          delete state.optimisticUpdates[id];
          // You might want to refetch here
        }
      });

    // Delete Note
    builder
      .addCase(deleteNoteThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNoteThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = state.notes.filter(
          (note) => note._id !== action.meta.arg
        );
        state.totalNotes -= 1;
        if (state.currentNote?._id === action.meta.arg) {
          state.currentNote = null;
        }
      })
      .addCase(deleteNoteThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearCurrentNote,
  optimisticUpdateNote,
  optimisticDeleteNote,
} = notesSlice.actions;

export default notesSlice.reducer;
