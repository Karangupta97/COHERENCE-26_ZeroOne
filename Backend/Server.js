require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");

// DB
const connectDB = require("./src/config/db");

// Routes
const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const protectedRoutes = require("./src/routes/protectedRoutes");
const reportRoutes = require("./src/routes/reportRoutes");

// Middleware
const errorHandler = require("./src/middlewares/errorHandler");
const { generalLimiter } = require("./src/middlewares/rateLimiter");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// ─── GLOBAL MIDDLEWARE ──────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(generalLimiter);

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
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: Number(process.uptime().toFixed(2)),
    timestamp: new Date().toISOString(),
  });
});

// ─── API ROUTES ─────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/v1", protectedRoutes);
app.use("/api/reports", reportRoutes);

// ─── 404 HANDLER ────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ ok: false, message: "Route not found" });
});

// ─── ERROR HANDLER ──────────────────────────────────────
app.use(errorHandler);

// ─── BOOT ────────────────────────────────────────────────
async function boot() {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Environment : ${process.env.NODE_ENV || "development"}`);
  });

  function shutdown(signal) {
    console.log(`\n${signal} received. Closing server...`);
    server.close(async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  }

  process.on("SIGINT",  () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  return server;
}

boot();

module.exports = app;
