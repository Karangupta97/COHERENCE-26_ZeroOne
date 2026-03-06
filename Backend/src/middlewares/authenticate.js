const { verifyToken } = require("../utils/jwt");

/**
 * Authenticate requests via Bearer token.
 * Attaches decoded user to req.user on success.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      ok: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      ok: false,
      message: "Invalid or expired token.",
    });
  }
}

module.exports = authenticate;
