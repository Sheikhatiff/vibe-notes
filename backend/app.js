import express from "express";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import globalErrorHandler from "./controllers/errorController.js";
import userRouter from "./routes/users.route.js";
import authRouter from "./routes/auth.route.js";
import notesRouter from "./routes/notes.route.js";
import lanRouter from "./routes/lan.routes.js";

const app = express();

// --------------------
// CORS
// --------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.18.221:5173",
  process.env.PROD_URL, // Add production frontend URL from env
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
  })
);

// --------------------
// Security Headers
// --------------------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "connect-src": [
          "'self'",
          "https://api.opencagedata.com",
          "https://*.tile.openstreetmap.org",
          process.env.PROD_URL, // add your deployed backend URL here
        ],
        "img-src": [
          "'self'",
          "data:",
          "blob:",
          "https://*.tile.openstreetmap.org",
          "https://unpkg.com",
        ],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://unpkg.com",
          "https://fonts.googleapis.com",
        ],
        "font-src": ["'self'", "https://fonts.gstatic.com"],
        "script-src": ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      },
    },
  })
);

// --------------------
// Rate Limiting
// --------------------
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// --------------------
// Parsing & Static
// --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/userImg", express.static(path.join(__dirname, "public", "userImg")));

app.use(cookieParser());
app.enable("trust proxy");

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// --------------------
// API Routes
// --------------------
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/lan", lanRouter);

// --------------------
// Global Error Handler
// --------------------
app.use(globalErrorHandler);

export default app;
