import express from "express";
import {
  getLAN,
  setIP,
  updateOrCreateLAN,
  upload,
  uploadFiles,
} from "../controllers/lan.controller.js";

const lanRouter = express.Router();

// Apply IP middleware to all routes
lanRouter.use(setIP);

// Route 1: GET - Retrieve data or download file
// Usage: GET / -> returns JSON with text and file list
//        GET /?filename=example.pdf -> downloads the file
lanRouter.get("/", getLAN);

// Route 2: PUT - Create or Update (text and/or files)
// Usage: PUT / with body { text: "...", files: [...] }
lanRouter.put(
  "/",
  upload.array("files"),
  (req, res, next) => {
    console.log("Files received:", req.files?.length);
    next();
  },
  uploadFiles,
  updateOrCreateLAN
);

export default lanRouter;
