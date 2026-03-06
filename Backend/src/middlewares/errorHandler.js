/**
 * Global error-handling middleware.
 * Must be registered LAST in the middleware chain.
 */
function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${err.message}`, err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    ok: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
}

module.exports = errorHandler;
