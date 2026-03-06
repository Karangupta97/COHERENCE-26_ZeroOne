const express = require("express");
const { signup, login, getMe } = require("../controllers/authController");
const authenticate = require("../middlewares/authenticate");
const authLimiter = require("../middlewares/rateLimiter");

const router = express.Router();

// Public routes (rate-limited)
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);

// Protected route
router.get("/me", authenticate, getMe);

module.exports = router;
