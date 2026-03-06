const express = require("express");

const { authenticate, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { createTrialValidation } = require("../validators/trialValidators");
const {
  createTrial,
  getMyTrials,
  getTrialById,
  updateTrial,
  getAllTrials,
} = require("../controllers/trialController");

const router = express.Router();

// All trial routes require authentication
router.use(authenticate);

// Public-ish: any authenticated user can browse recruiting trials
router.get("/all", getAllTrials);

// Clinic-only routes
router.post("/", authorize("clinic"), createTrialValidation, validate, createTrial);
router.get("/my", authorize("clinic"), getMyTrials);
router.get("/:id", getTrialById);
router.patch("/:id", authorize("clinic"), updateTrial);

module.exports = router;
