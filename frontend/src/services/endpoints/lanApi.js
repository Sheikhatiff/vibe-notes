import api from "../api";

export const lanApi = {
  createOrUpdateLan: async (formData) => {
    const response = await api.put("/lan", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getLanData: async (params = {}) => {
    const response = await api.get("/lan", { params });
    return response.data;
  },
};
