import express from "express";

import {
  createNote,
  deleteNote,
  getAllNotes,
  getNote,
  updateNote,
} from "../controllers/notes.controller.js";
import { verifyToken } from "../controllers/auth.controller.js";

const notesRouter = express.Router();

notesRouter.use(verifyToken);

notesRouter.post("/", createNote);
notesRouter.get("/", getAllNotes);
notesRouter.get("/:_id", getNote);
notesRouter.patch("/:_id", updateNote);
notesRouter.delete("/:_id", deleteNote);

export default notesRouter;
