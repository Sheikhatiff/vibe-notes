import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  updateUser,
  uploadImage,
  uploadUserPhoto,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/create", createUser);
userRouter.patch("/update/:id", updateUser);
userRouter.get("/:_id", getUserById);
userRouter.delete("/delete/:_id", deleteUser);
userRouter.patch("/updateImage/:_id", uploadUserPhoto, uploadImage);

export default userRouter;
