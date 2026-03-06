const rateLimit = require("express-rate-limit");

/**
 * Rate limiter for auth endpoints – prevents brute-force attacks.
 * 15 requests per 15-minute window per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
});

module.exports = authLimiter;
