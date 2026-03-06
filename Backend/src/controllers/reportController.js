const MedicalReport = require("../models/MedicalReport");
const { uploadToR2, getObjectSize } = require("../utils/r2Storage");
const { extractMedicalData } = require("../utils/geminiExtract");

// Allowed MIME types for medical reports
const ALLOWED_MIME_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);

/**
 * POST /api/reports/upload
 *
 * 1. Validates the uploaded file type.
 * 2. Uploads the file buffer to Cloudflare R2.
 * 3. Sends the file to Gemini for medical data extraction.
 * 4. Persists the record (URL + extracted data) in MongoDB.
 * 5. Returns the saved record.
 */
async function uploadReport(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, message: "No file uploaded. Use field name 'report'." });
    }

    const { mimetype, buffer, originalname, size } = req.file;

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(mimetype)) {
      return res.status(415).json({
        ok: false,
        message: "Unsupported file type. Only PDF, JPG, and PNG are allowed.",
      });
    }

    // Guard: reject oversized files (10 MB)
    const MAX_BYTES = 10 * 1024 * 1024;
    if (size > MAX_BYTES) {
      return res.status(413).json({ ok: false, message: "File too large. Maximum allowed size is 10 MB." });
    }

    // ── 1. Upload to R2 ───────────────────────────────────────────────────────
    let reportUrl;
    try {
      reportUrl = await uploadToR2(buffer, originalname, mimetype);
    } catch (uploadErr) {
      console.error("[R2 Upload Error]", uploadErr);
      return res.status(502).json({
        ok: false,
        message: "Failed to upload file to storage. Please try again.",
      });
    }

    // ── 2. Create initial DB record (capture URL immediately) ─────────────────
    const report = await MedicalReport.create({
      userId: req.user._id,
      reportUrl,
      originalFileName: originalname,
      mimeType: mimetype,
      fileSize: size,
      extractionStatus: "pending",
    });

    // ── 3. Extract medical data via Gemini ────────────────────────────────────
    let extractedData;
    try {
      extractedData = await extractMedicalData(buffer, mimetype);
      report.extractedData = extractedData;
      report.extractionStatus = "success";
    } catch (geminiErr) {
      console.error("[Gemini Extraction Error]", geminiErr);
      report.extractionStatus = "failed";
      report.extractionError = geminiErr.message || "Extraction failed";
    }

    await report.save();

    return res.status(201).json({
      ok: true,
      message: report.extractionStatus === "success"
        ? "Report uploaded and medical data extracted successfully."
        : "Report uploaded. Medical data extraction failed; it can be retried.",
      data: report,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/reports/my
 *
 * Returns all medical reports belonging to the authenticated user,
 * newest first, without the file buffer.
 */
async function getMyReports(req, res, next) {
  try {
    const reports = await MedicalReport.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Lazy-backfill fileSize for reports uploaded before the field existed
    const needSize = reports.filter((r) => !r.fileSize && r.reportUrl);
    if (needSize.length) {
      await Promise.all(
        needSize.map(async (r) => {
          const size = await getObjectSize(r.reportUrl);
          if (size) {
            r.fileSize = size;
            await MedicalReport.updateOne({ _id: r._id }, { fileSize: size });
          }
        })
      );
    }

    return res.json({ ok: true, count: reports.length, data: reports });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/reports/:id
 *
 * Returns a single medical report. Only the owning user may view it.
 */
async function getReportById(req, res, next) {
  try {
    const report = await MedicalReport.findById(req.params.id).lean();

    if (!report) {
      return res.status(404).json({ ok: false, message: "Report not found." });
    }

    // Ownership check — prevent horizontal privilege escalation
    if (report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ ok: false, message: "Access denied." });
    }

    return res.json({ ok: true, data: report });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadReport, getMyReports, getReportById };
