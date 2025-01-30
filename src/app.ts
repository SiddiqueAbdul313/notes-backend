import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import notesRoutes from "./routes/notesRoutes";
import userRoutes from "./routes/users";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import cors from "cors";
// import { requiresAuth } from "./middleware/auth";

const app = express();

// ✅ Enable CORS
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());

// ✅ Session configuration
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 6 * 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECTION_STRING,
    }),
  })
);

// ✅ Add a root API response
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀", status: "success" });
});

app.use("/api/users", userRoutes);
app.use("/api/notes", notesRoutes);

// Handle 404 errors
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found!"));
});

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Server Error:", error);
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
