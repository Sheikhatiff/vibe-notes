import { createAsyncThunk } from "@reduxjs/toolkit";
import { lanApi } from "../../services/endpoints/lanApi";

export const createOrUpdateLanThunk = createAsyncThunk(
  "lan/createOrUpdate",
  async (lanData, { rejectWithValue }) => {
    try {
      const data = await lanApi.createOrUpdateLan(lanData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create note"
      );
    }
  }
);

export const getLanDataThunk = createAsyncThunk(
  "lan/get",
  async (params, { rejectWithValue }) => {
    try {
      const response = await lanApi.getLanData(params);
      console.log("Lan Response:", response);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch lan Data"
      );
    }
  }
);
