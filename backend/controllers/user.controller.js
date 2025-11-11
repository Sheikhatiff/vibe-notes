import multer from "multer";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import User from "../models/user.model.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/userImg");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const userId = req.params._id || req.user?._id || "unknown";
    cb(null, `user-${userId}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Please upload only images", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadUserPhoto = upload.single("photo");

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

export const getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params._id);
  if (!user) return next(new AppError("No user found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
export const createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});
export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params._id);
  if (!user) return next(new AppError("No user found with that ID", 404));
  await User.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
export const updateUser = catchAsync(async (req, res, next) => {
  console.log("Incoming PATCH:", req.params.id, req.body);

  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("No user found with that ID", 404));
  if (req.body.password || req.body.passwordConfirm) {
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
  }
  if (req.body.name) user.name = req.body.name;
  const saveOptions =
    req.body.password || req.body.passwordConfirm
      ? {}
      : { validateBeforeSave: false };
  const updatedUser = await user.save(saveOptions);
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

export const uploadImage = catchAsync(async (req, res, next) => {
  const { _id } = req.params;

  if (!req.file) {
    return next(new AppError("No file uploaded", 400));
  }

  const photo = req.file.filename;
  console.log("Uploaded file:", photo);

  const oldUser = await User.findById(_id);
  if (!oldUser) {
    return next(new AppError("User not found", 404));
  }

  const oldPhoto = oldUser.photo;

  const user = await User.findByIdAndUpdate(
    _id,
    { photo },
    { new: true, runValidators: true }
  );

  if (oldPhoto && oldPhoto !== "default.jpg") {
    const oldPhotoPath = path.join(
      __dirname,
      "..",
      "public",
      "userImg",
      oldPhoto
    );

    try {
      await fs.unlink(oldPhotoPath);
      console.log("Deleted old photo:", oldPhoto);
    } catch (err) {
      console.log("Could not delete old photo:", err.message);
    }
  }

  return res.status(200).json({
    status: "success",
    message: "Image Updated Successfully",
    data: {
      user,
    },
  });
});
