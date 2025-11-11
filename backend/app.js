import express from "express";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";

import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";
import userRouter from "./routes/users.route.js";
import authRouter from "./routes/auth.route.js";
import notesRouter from "./routes/notes.route.js";
import lanRouter from "./routes/lan.routes.js";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.18.221:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
  })
);

app.enable("trust proxy");

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "http://localhost:3000"],
      },
    },
  })
);

const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.set("trust proxy", 1);
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get("/", (_, res) => {
  res.send("Vibe Notes API is running...");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/lan", lanRouter);

//it was "*" before, after express v5 it is "/*splat"
app.all("/*splat", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/**
 2 steps of global error handling
1, create middleware 
2, create error so that this func caught it
*/
app.use(globalErrorHandler);

export default app;
