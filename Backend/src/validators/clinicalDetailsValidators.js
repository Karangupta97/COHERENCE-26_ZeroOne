const { body, param } = require("express-validator");

exports.createDetailsValidation = [
  body("anonymizedId")
    .trim()
    .notEmpty()
    .withMessage("Anonymized patient ID is required.")
    .matches(/^ANON-[A-F0-9]{8}$/i)
    .withMessage("Invalid anonymized ID format. Expected ANON-XXXXXXXX."),

  body("primaryDiagnosis")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Primary diagnosis must be at most 300 chars."),

  body("age")
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage("Age must be between 0 and 150."),

  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be Male, Female, or Other."),

  body("ecogPerformanceStatus")
    .optional()
    .isInt({ min: 0, max: 5 })
    .withMessage("ECOG status must be between 0 and 5."),

  body("inclusionNotes")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Inclusion notes must be at most 1000 chars."),

  body("exclusionNotes")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Exclusion notes must be at most 1000 chars."),

  body("doctorRemarks")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Doctor remarks must be at most 1000 chars."),
];

exports.anonymizedIdParam = [
  param("anonymizedId")
    .trim()
    .matches(/^ANON-[A-F0-9]{8}$/i)
    .withMessage("Invalid anonymized ID format. Expected ANON-XXXXXXXX."),
];
