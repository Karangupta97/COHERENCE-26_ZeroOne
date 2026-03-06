const { body } = require("express-validator");

const referPatientValidation = [
  body("trialId")
    .notEmpty().withMessage("Trial ID is required")
    .isMongoId().withMessage("Invalid trial ID"),

  body("patientId")
    .notEmpty().withMessage("Patient ID is required")
    .isMongoId().withMessage("Invalid patient ID"),

  body("referralNotes")
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage("Referral notes must be at most 2000 characters"),

  body("matchScore")
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage("Match score must be between 0 and 100"),
];

const updateStatusValidation = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["referred", "approved", "screening", "enrolled", "completed", "withdrawn", "rejected"])
    .withMessage("Invalid status value"),
];

module.exports = { referPatientValidation, updateStatusValidation };
