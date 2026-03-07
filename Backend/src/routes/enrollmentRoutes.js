const express = require("express");

const { authenticate, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { referPatientValidation, updateStatusValidation } = require("../validators/enrollmentValidators");
const {
  referPatient,
  getMyEnrollments,
  getTrialEnrollments,
  updateEnrollmentStatus,
  getPatientsList,
  patientApply,
  getMyApplications,
} = require("../controllers/enrollmentController");

const router = express.Router();

// All enrollment routes require authentication
router.use(authenticate);

// Doctor refers a patient to a trial
router.post("/", authorize("doctor"), referPatientValidation, validate, referPatient);

// Doctor's own referrals
router.get("/my", authorize("doctor"), getMyEnrollments);

// Get patients list for doctor to select from
router.get("/patients", authorize("doctor"), getPatientsList);

// Get enrollments for a specific trial (doctor or clinic)
router.get("/trial/:trialId", authorize("doctor", "clinic"), getTrialEnrollments);

// Update enrollment status (doctor or clinic)
router.patch("/:id/status", authorize("doctor", "clinic"), updateStatusValidation, validate, updateEnrollmentStatus);

// Patient self-applies to a trial
router.post("/apply", authorize("patient"), patientApply);

// Patient views their own applications
router.get("/my-applications", authorize("patient"), getMyApplications);

module.exports = router;
