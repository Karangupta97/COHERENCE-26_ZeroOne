const express = require("express");
const multer = require("multer");

const { authenticate } = require("../middlewares/auth");
const { uploadReport, getMyReports, getReportById } = require("../controllers/reportController");

const router = express.Router();

// ── Multer: store file in memory so we can pass the Buffer to R2 & Gemini ──
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB — enforced again in controller
    files: 1,
  },
  fileFilter(_req, file, cb) {
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, JPG, and PNG files are accepted."));
    }
  },
});

// Handle multer errors (wrong type / too large) and forward as 4xx responses
function multerErrorHandler(err, _req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ ok: false, message: "File too large. Maximum allowed size is 10 MB." });
    }
    return res.status(400).json({ ok: false, message: err.message });
  }
  if (err) {
    return res.status(415).json({ ok: false, message: err.message });
  }
  next();
}

// All report routes require a valid JWT
router.use(authenticate);

// POST /api/reports/upload  — upload + extract
router.post(
  "/upload",
  upload.single("report"),
  multerErrorHandler,
  uploadReport
);

// GET /api/reports/my  — list caller's reports
router.get("/my", getMyReports);

// GET /api/reports/:id  — single report (owner only)
router.get("/:id", getReportById);

module.exports = router;
