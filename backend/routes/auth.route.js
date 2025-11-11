import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  verifyToken,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/check-auth", verifyToken, checkAuth);

export default authRouter;
