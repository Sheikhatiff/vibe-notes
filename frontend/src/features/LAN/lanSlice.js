import { createSlice } from "@reduxjs/toolkit";
import { createOrUpdateLanThunk, getLanDataThunk } from "./lanThunks";

const initialState = {
  files: [],
  text: "",
  loading: false,
  error: null,
  updatedAt: null,
};

const lanSlice = createSlice({
  name: "lan",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearData: (state) => {
      state.files = [];
      state.text = "";
      state.loading = false;
      state.error = null;
      state.updatedAt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrUpdateLanThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrUpdateLanThunk.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.files = action.payload.files;
        state.text = action.payload.text;
        state.updatedAt = action.payload.updatedAt;
      })
      .addCase(createOrUpdateLanThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getLanDataThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLanDataThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload?.data?.lan?.files || [];
        state.text = action.payload?.data?.lan?.text || "";
        state.updatedAt = action.payload?.data?.lan?.updatedAt || null;
      })
      .addCase(getLanDataThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default lanSlice.reducer;
