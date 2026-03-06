const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/authController");
const { signupValidation, loginValidation } = require("../validators/authValidators");
const validate = require("../middlewares/validate");
const { authLimiter } = require("../middlewares/rateLimiter");

// POST /api/auth/signup
router.post("/signup", authLimiter, signupValidation, validate, signup);

// POST /api/auth/login
router.post("/login", authLimiter, loginValidation, validate, login);

module.exports = router;
