import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pool } from "./src/db/index.js";
import { routes } from "./src/routes/index.js";
const app = express();
const PORT = process.env.PORT || 3000;
import "./src/utils/bullmqWorker.js";

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.get("/api/health", async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is live",
  });
});

routes.forEach(({ path, router }) => {
  app.use(`/api${path}`, router);
});

async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully");
    connection.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database:", error.message);
    process.exit(1); // stop the app if DB isn't reachable
  }
}

startServer();
