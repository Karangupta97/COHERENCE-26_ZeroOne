const { Router } = require("express");
const { authenticate, authorize } = require("../middlewares/auth");
const {
  getMyMatches,
  getMatchesByAnonymizedId,
} = require("../controllers/matchingController");

const router = Router();

// All matching routes require authentication
router.use(authenticate);

// ── Patient: get own recommended trials ──────────────────
router.get("/my-matches", authorize("patient"), getMyMatches);

// ── Doctor/Clinic: get matches for a patient (anonymized) ─
router.get(
  "/patient/:anonymizedId",
  authorize("doctor", "clinic"),
  getMatchesByAnonymizedId
);

module.exports = router;
