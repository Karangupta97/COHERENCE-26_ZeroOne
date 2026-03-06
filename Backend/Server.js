require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// Routes
const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const protectedRoutes = require("./src/routes/protectedRoutes");

// Middleware
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// ─── GLOBAL MIDDLEWARE ──────────────────────────────────
app.use(helmet()); // security headers
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(express.json({ limit: "10kb" })); // body parser with size limit
app.use(express.urlencoded({ extended: false }));

// Handle malformed JSON
app.use((err, _req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ ok: false, message: "Invalid JSON in request body" });
  }
  next(err);
});

// ─── HEALTH CHECK ───────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ ok: true, message: "API server is running" });
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    status: "healthy",
    uptime: Number(process.uptime().toFixed(2)),
    timestamp: new Date().toISOString(),
  });
});

// ─── API ROUTES ─────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/v1", protectedRoutes);

// ─── 404 HANDLER ────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ ok: false, message: "Route not found" });
});

// ─── ERROR HANDLER ──────────────────────────────────────
app.use(errorHandler);

// ─── START SERVER ───────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown
function shutdown(signal) {
  console.log(`${signal} received. Closing server...`);
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown.bind(null, "SIGINT"));
process.on("SIGTERM", shutdown.bind(null, "SIGTERM"));

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

module.exports = server;
