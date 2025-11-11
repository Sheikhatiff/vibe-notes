import api from "../api";

export const authApi = {
  signup: async (userData) => {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.get("/auth/logout");
    return response.data;
  },

  checkAuth: async () => {
    const response = await api.get("/auth/check-auth");
    return response.data;
  },

  //exceptional cases for updating user, can't create separate for user, at this moment.
  updateUser: async (id, userData) => {
    console.log(
      "userData passing before calling req from frontend :",
      userData
    );
    const response = await api.patch(`/users/update/${id}`, userData);
    return response.data;
  },
  updateImage: async (id, userData) => {
    console.log(
      "userData passing before calling req from frontend :",
      userData
    );
    const response = await api.patch(`/users/updateImage/${id}`, userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  },
};
