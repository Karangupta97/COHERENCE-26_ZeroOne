const rateLimit = require("express-rate-limit");

/**
 * Strict limiter for auth endpoints (login / signup).
 * Allows 15 requests per 15 minutes per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
  skipSuccessfulRequests: false,
});

/**
 * General API limiter — 100 requests per 15 minutes per IP.
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "Too many requests. Please slow down.",
  },
});

module.exports = { authLimiter, generalLimiter };
