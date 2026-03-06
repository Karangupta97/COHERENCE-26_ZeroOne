const { ALL_ROLES } = require("../constants/roles");

/**
 * Validate signup request body. Returns an error message or null.
 */
function validateSignup({ email, password, full_name, role, phone }) {
  if (!email || !password || !full_name || !role) {
    return "email, password, full_name, and role are required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }

  if (!ALL_ROLES.includes(role)) {
    return `Invalid role. Must be one of: ${ALL_ROLES.join(", ")}`;
  }

  if (full_name.trim().length < 2) {
    return "Full name must be at least 2 characters";
  }

  return null;
}

/**
 * Validate login request body. Returns an error message or null.
 */
function validateLogin({ email, password }) {
  if (!email || !password) {
    return "email and password are required";
  }
  return null;
}

module.exports = { validateSignup, validateLogin };
