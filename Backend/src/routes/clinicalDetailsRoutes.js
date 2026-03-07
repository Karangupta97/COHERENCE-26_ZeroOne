const { Router } = require("express");
const { authenticate, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const ctrl = require("../controllers/clinicalDetailsController");
const {
  createDetailsValidation,
  anonymizedIdParam,
} = require("../validators/clinicalDetailsValidators");

const router = Router();

// All routes require authentication
router.use(authenticate);

// ── Doctor routes ────────────────────────────────────────
// Verify patient exists by anonymized ID (doctor only)
router.get(
  "/verify/:anonymizedId",
  authorize("doctor"),
  anonymizedIdParam,
  validate,
  ctrl.verifyPatient
);

// Submit clinical trial details (doctor only)
router.post(
  "/",
  authorize("doctor"),
  createDetailsValidation,
  validate,
  ctrl.createDetails
);

// Doctor's own submitted records
router.get("/doctor/my", authorize("doctor"), ctrl.getDoctorRecords);

// Lookup records for a patient by anonymized ID (doctor only)
router.get(
  "/patient/:anonymizedId",
  authorize("doctor"),
  anonymizedIdParam,
  validate,
  ctrl.getByAnonymizedId
);

// ── Patient routes ───────────────────────────────────────
// Patient views their own clinical trial details (read-only)
router.get("/my", authorize("patient"), ctrl.getMyDetails);

// ── Shared: single record by ID ──────────────────────────
router.get("/:id", ctrl.getById);

module.exports = router;
