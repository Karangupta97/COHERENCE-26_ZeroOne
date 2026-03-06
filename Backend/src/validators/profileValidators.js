const { body } = require("express-validator");

const updateProfileValidation = [
  body("firstName")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage("First name must be 1–50 characters"),

  body("lastName")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage("Last name must be 1–50 characters"),

  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .isMobilePhone("any").withMessage("Invalid phone number"),

  // Patient profile
  body("patientProfile.bloodGroup")
    .optional({ values: "falsy" })
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .withMessage("Invalid blood group"),

  body("patientProfile.dateOfBirth")
    .optional()
    .isISO8601().withMessage("Date of birth must be a valid ISO date"),

  body("patientProfile.age")
    .optional()
    .isInt({ min: 0, max: 150 }).withMessage("Age must be between 0 and 150"),

  body("patientProfile.gender")
    .optional({ values: "falsy" })
    .isIn(["Male", "Female", "Other"]).withMessage("Gender must be Male, Female, or Other"),

  body("patientProfile.location")
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage("Location must be at most 100 characters"),

  body("patientProfile.diagnosis")
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage("Diagnosis must be at most 200 characters"),

  body("patientProfile.medications")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("Medications must be at most 300 characters"),

  body("patientProfile.hba1c")
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage("HbA1c value must be at most 20 characters"),

  body("patientProfile.bmi")
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage("BMI value must be at most 20 characters"),

  body("patientProfile.allergies")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("Allergies must be at most 300 characters"),

  body("patientProfile.address")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("Address must be at most 300 characters"),

  // Doctor profile
  body("doctorProfile.yearsOfExperience")
    .optional()
    .isInt({ min: 0, max: 70 }).withMessage("Years of experience must be between 0 and 70"),

  body("doctorProfile.licenseNumber")
    .optional()
    .isLength({ max: 50 }).withMessage("License number must be at most 50 characters"),

  // Clinic profile
  body("clinicProfile.contactEmail")
    .optional()
    .isEmail().withMessage("Invalid clinic contact email")
    .normalizeEmail(),
];

const changePasswordValidation = [
  body("currentPassword")
    .notEmpty().withMessage("Current password is required"),

  body("newPassword")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 8 }).withMessage("New password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("New password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("New password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("New password must contain at least one number")
    .matches(/[^A-Za-z0-9]/).withMessage("New password must contain at least one special character"),
];

module.exports = { updateProfileValidation, changePasswordValidation };
