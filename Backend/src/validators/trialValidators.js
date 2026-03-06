const { body } = require("express-validator");

const createTrialValidation = [
  body("trialName")
    .trim()
    .notEmpty().withMessage("Trial name is required")
    .isLength({ max: 200 }).withMessage("Trial name must be at most 200 characters"),

  body("trialId")
    .trim()
    .notEmpty().withMessage("Trial ID is required")
    .isLength({ max: 50 }).withMessage("Trial ID must be at most 50 characters"),

  body("phase")
    .trim()
    .notEmpty().withMessage("Phase is required")
    .isIn(["Phase I", "Phase II", "Phase III", "Phase IV"])
    .withMessage("Phase must be one of: Phase I, Phase II, Phase III, Phase IV"),

  body("category")
    .trim()
    .notEmpty().withMessage("Category is required")
    .isIn(["Endocrinology", "Cardiology", "Oncology", "Neurology", "Metabolic", "Nephrology", "Pulmonology", "Rheumatology"])
    .withMessage("Invalid category"),

  body("duration")
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage("Duration must be at most 100 characters"),

  body("ageMin")
    .optional()
    .isInt({ min: 0, max: 150 }).withMessage("Min age must be between 0 and 150"),

  body("ageMax")
    .optional()
    .isInt({ min: 0, max: 150 }).withMessage("Max age must be between 0 and 150"),

  body("gender")
    .optional()
    .isIn(["All", "M", "F"]).withMessage("Gender must be All, M, or F"),

  body("diagnoses")
    .optional()
    .isArray().withMessage("Diagnoses must be an array"),

  body("exclusions")
    .optional()
    .isArray().withMessage("Exclusions must be an array"),

  body("labValues")
    .optional()
    .isArray().withMessage("Lab values must be an array"),

  body("slots")
    .notEmpty().withMessage("Number of slots is required")
    .isInt({ min: 1 }).withMessage("At least 1 slot is required"),

  body("target")
    .optional()
    .isInt({ min: 0 }).withMessage("Target must be a positive number"),

  body("compensation")
    .trim()
    .notEmpty().withMessage("Compensation is required")
    .isLength({ max: 100 }).withMessage("Compensation must be at most 100 characters"),

  body("location")
    .trim()
    .notEmpty().withMessage("Location is required")
    .isLength({ max: 200 }).withMessage("Location must be at most 200 characters"),

  body("startDate")
    .notEmpty().withMessage("Start date is required")
    .isISO8601().withMessage("Start date must be a valid date"),

  body("endDate")
    .optional()
    .isISO8601().withMessage("End date must be a valid date"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage("Description must be at most 2000 characters"),
];

module.exports = { createTrialValidation };
