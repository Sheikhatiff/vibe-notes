import api from "../api";

export const notesApi = {
  createNote: async (noteData) => {
    const response = await api.post("/notes", noteData);
    return response.data;
  },

  getAllNotes: async (params = {}) => {
    const response = await api.get("/notes", { params });
    return response.data;
  },

  getNote: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  updateNote: async (id, noteData) => {
    const response = await api.patch(`/notes/${id}`, noteData);
    return response.data;
  },

  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
};
