const { body } = require("express-validator");
const { ROLES } = require("../models/modelMap");

const signupValidation = [
  body("firstName")
    .trim()
    .notEmpty().withMessage("First name is required")
    .isLength({ max: 50 }).withMessage("First name must be at most 50 characters"),

  body("lastName")
    .trim()
    .notEmpty().withMessage("Last name is required")
    .isLength({ max: 50 }).withMessage("Last name must be at most 50 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address")
    .normalizeEmail()
    .isLength({ max: 100 }).withMessage("Email must be at most 100 characters"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/).withMessage("Password must contain at least one special character"),

  body("role")
    .trim()
    .notEmpty().withMessage("Role is required")
    .isIn(ROLES).withMessage(`Role must be one of: ${ROLES.join(", ")}`),

  body("phone")
    .optional()
    .trim()
    .isMobilePhone("any").withMessage("Invalid phone number")
    .isLength({ max: 20 }).withMessage("Phone must be at most 20 characters"),
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),
];

module.exports = { signupValidation, loginValidation };
