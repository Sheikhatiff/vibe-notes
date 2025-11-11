import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import store from "./store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    <Toaster
      position="top-center"
      gutter={12}
      containerStyle={{
        top: "50%",
        transform: "translateY(-50%)",
      }}
      toastOptions={{
        duration: 3500,
        style: {
          background: "#1f2937",
          color: "#fff",
          borderRadius: "16px",
          textAlign: "center",
          width: "clamp(260px, 60%, 480px)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          padding: "1rem 1.5rem",
        },
      }}
    />
  </StrictMode>
);
