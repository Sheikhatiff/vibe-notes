import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../services/endpoints/authApi";

export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authApi.signup(userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authApi.login(credentials);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authApi.logout();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

export const checkAuthThunk = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authApi.checkAuth();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Auth check failed"
      );
    }
  }
);
export const updateThunk = createAsyncThunk(
  "users/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      console.log(id, updates);
      const data = await authApi.updateUser(id, updates);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update note"
      );
    }
  }
);
export const updateImageThunk = createAsyncThunk(
  "users/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      console.log(id, updates);
      const data = await authApi.updateImage(id, updates);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update note"
      );
    }
  }
);
