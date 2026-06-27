import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Log, setToken } from "affordmed-logging-middleware";
import { initDB } from "./db/init.js";
import notificationRoutes from "./routes/notifications.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
setToken(process.env.AUTH_TOKEN);
app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  await Log("backend", "info", "middleware", req.method + " " + req.path);
  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/notifications", notificationRoutes);

async function start() {
  try {
    await initDB();
    await Log("backend", "info", "config", "db initialized");
    app.listen(PORT, async () => {
      await Log("backend", "info", "config", "server started on " + PORT);
    });
  } catch (err) {
    await Log("backend", "fatal", "config", "startup failed");
    process.exit(1);
  }
}

start();