import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pool } from "./src/db/index.js";
import { routes } from "./src/routes/index.js";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
routes.forEach(({ path, router }) => {
  app.use(`/api${path}`, router);
});

async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully");
    connection.release(); // release it back to the pool

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database:", error.message);
    process.exit(1); // stop the app if DB isn't reachable
  }
}

startServer();
