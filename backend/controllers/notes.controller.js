import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import Note from "../models/note.model.js";

export const createNote = catchAsync(async (req, res, next) => {
  const noteData = { ...req.body, user: req.user._id };
  const newNote = await Note.create(noteData);
  res.status(201).json({ status: "success", data: { note: newNote } });
});

export const getAllNotes = catchAsync(async (req, res, next) => {
  const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
  res
    .status(200)
    .json({ status: "success", results: notes.length, data: { notes } });
});

export const getNote = catchAsync(async (req, res, next) => {
  const note = await Note.findOne({ _id: req.params._id, user: req.user._id });
  if (!note) {
    return next(new AppError("Note not found", 404));
  }
  res.status(200).json({ status: "success", data: { note } });
});

export const updateNote = catchAsync(async (req, res, next) => {
  const note = await Note.findOne({
    _id: req.params._id,
    user: req.user._id,
  });

  if (!note) {
    return next(new AppError("Note not found", 404));
  }

  Object.assign(note, req.body);

  await note.save();

  res.status(200).json({ status: "success", data: { note } });
});

export const deleteNote = catchAsync(async (req, res, next) => {
  const note = await Note.findOneAndDelete({
    _id: req.params._id,
    user: req.user._id,
  });
  if (!note) {
    return next(new AppError("Note not found", 404));
  }
  res.status(204).json({ status: "success", data: null });
});
