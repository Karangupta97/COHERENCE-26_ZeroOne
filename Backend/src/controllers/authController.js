const { getModel, findByEmail, emailExists } = require("../models/modelMap");
const generateToken = require("../utils/generateToken");

// ─── SIGNUP ──────────────────────────────────────────────
// Saves the new user into the role-specific collection:
//   patients  →  role="patient"
//   doctors   →  role="doctor"
//   clinics   →  role="clinic"
async function signup(req, res, next) {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;

    // Enforce global email uniqueness across all three collections
    const exists = await emailExists(email);
    if (exists) {
      return res.status(409).json({ ok: false, message: "An account with this email already exists" });
    }

    const Model = getModel(role);
    const user = new Model({ firstName, lastName, email, password, phone });
    await user.save();

    const token = generateToken({ id: user._id, role: user.role });

    return res.status(201).json({
      ok: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ─── LOGIN ───────────────────────────────────────────────
// Searches all three collections by email so the user does not
// need to specify their role when logging in.
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // findByEmail queries patients, doctors, clinics in parallel
    const user = await findByEmail(email, true); // true = include password field
    if (!user || !user.isActive) {
      return res.status(401).json({ ok: false, message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ ok: false, message: "Invalid email or password" });
    }

    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken({ id: user._id, role: user.role });

    return res.status(200).json({
      ok: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login };
