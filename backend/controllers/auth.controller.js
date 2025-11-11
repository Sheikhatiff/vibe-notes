import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_TOKEN_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOption.secure = true;

  res.cookie("jwt", token, cookieOption);
  user.password = undefined;
  res.status(statusCode).json({ status: "success", token, user });
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("please provide email & password", 400));

  const user = await User.findOneAndUpdate(
    { email },
    { $push: { lastLogin: { $each: [Date.now()], $position: 0 } } },
    { new: true }
  ).select("+password");

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Invalid email or password", 401));

  createSendToken(user, 200, res);
});

export const logout = catchAsync(async (req, res, next) => {
  res.clearCookie("jwt");
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully!" });
});

export const checkAuth = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError("user not found", 400));

  res.status(200).json({ success: true, user });
});

export const verifyToken = catchAsync(async (req, res, next) => {
  let token = req.cookies?.jwt;

  // check Authorization header if no cookie
  if (!token && req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
    return next(
      new AppError(`you're not logged in, please log in to get Access...!`, 401)
    );

  //verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  //check if user still exists
  const user = await User.findById(decoded.id);
  if (!user)
    return next(
      new AppError(
        `the user belonging to this token does no longer exist!`,
        401
      )
    );

  //check if user changed the password after the token was issued
  if (user.passwordChangedAfter(decoded.iat))
    return next(
      new AppError(`User recently changed password, please login again !`, 401)
    );
  //Grant Access to protected routes
  req.user = user;
  next();
});
