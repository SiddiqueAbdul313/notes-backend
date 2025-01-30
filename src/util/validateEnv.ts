import { cleanEnv, port, str, url } from "envalid";

export default cleanEnv(process.env, {
  MONGO_CONNECTION_STRING: str({ desc: "MongoDB connection string" }),
  PORT: port({ default: 5000, desc: "Port the server runs on" }),
  SESSION_SECRET: str({ desc: "Session secret key" }),
  FRONTEND_URL: url({ desc: "Frontend deployment URL (Vercel)" }),
  API_BASE_URL: url({ desc: "Backend API base URL (Render)" }),
  NODE_ENV: str({
    choices: ["development", "production"],
    default: "development",
    desc: "App environment",
  }),
});
