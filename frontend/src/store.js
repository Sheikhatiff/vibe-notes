import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/auth/authSlice.js";
import notesReducer from "./features/notes/notesSlice.js";
import lanReducer from "./features/LAN/lanSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
    lan: lanReducer,
  },
});

export default store;
