import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

const port = env.PORT || 5000; // Ensure fallback to port 5000

mongoose
  .connect(env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("✅ Mongoose connected to MongoDB");

    app.listen(port, () => {
      const serverURL =
        process.env.NODE_ENV === "production"
          ? env.API_BASE_URL // Use API base URL in production
          : `http://localhost:${port}`; // Use localhost in development

      console.log(`🚀 Server running at: ${serverURL}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit process if DB connection fails
  });
