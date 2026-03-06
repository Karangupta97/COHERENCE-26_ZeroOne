const jwt = require("jsonwebtoken");
const { getModel } = require("../models/modelMap");

/**
 * Verifies the JWT from Authorization header and attaches user to req.
 * Uses the role embedded in the token to query only the relevant collection
 * (patients / doctors / clinics).
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ ok: false, message: "Authentication token required" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ ok: false, message: "Authentication token required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ ok: false, message: "Token has expired. Please log in again." });
      }
      return res.status(401).json({ ok: false, message: "Invalid token" });
    }

    // Resolve model from role stored in token → queries only one collection
    let Model;
    try {
      Model = getModel(decoded.role);
    } catch {
      return res.status(401).json({ ok: false, message: "Invalid token payload" });
    }

    const user = await Model.findById(decoded.id).select("-password");
    if (!user || !user.isActive) {
      return res.status(401).json({ ok: false, message: "User not found or account inactive" });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Restricts access to specified roles.
 * Usage: authorize("doctor", "clinic")
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, message: "Not authenticated" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        ok: false,
        message: `Access denied. This resource is restricted to: ${roles.join(", ")}`,
      });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
