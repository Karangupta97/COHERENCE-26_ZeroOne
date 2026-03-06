/**
 * Global error handler middleware.
 * Must be registered last with app.use(errorHandler).
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  // Mongoose duplicate key (e.g. email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({
      ok: false,
      message: `An account with this ${field} already exists`,
    });
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(422).json({ ok: false, message: messages.join(". ") });
  }

  // Mongoose CastError (bad ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({ ok: false, message: "Invalid resource identifier" });
  }

  // JWT errors (should be caught in middleware, but safeguard here)
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ ok: false, message: "Invalid or expired token" });
  }

  // Default: internal server error — never leak stack in production
  const statusCode = err.statusCode || err.status || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "An unexpected error occurred. Please try again later."
      : err.message || "Internal Server Error";

  if (process.env.NODE_ENV !== "production") {
    console.error("[ErrorHandler]", err);
  }

  res.status(statusCode).json({ ok: false, message });
}

module.exports = errorHandler;
