const { body } = require("express-validator");

const updateProfileValidation = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage("First name must be 1–50 characters"),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage("Last name must be 1–50 characters"),

  body("phone")
    .optional()
    .trim()
    .isMobilePhone("any").withMessage("Invalid phone number"),

  // Patient profile
  body("patientProfile.bloodGroup")
    .optional()
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .withMessage("Invalid blood group"),

  body("patientProfile.dateOfBirth")
    .optional()
    .isISO8601().withMessage("Date of birth must be a valid ISO date"),

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
