const jwt = require("jsonwebtoken");

/**
 * Signs a JWT containing the user's id and role.
 * @param {Object} payload - { id, role }
 * @returns {string} signed token
 */
function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    algorithm: "HS256",
  });
}

module.exports = generateToken;
