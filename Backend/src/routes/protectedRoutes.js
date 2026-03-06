const express = require("express");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const { ROLES } = require("../constants/roles");
const supabase = require("../config/supabase");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// All routes below require authentication
router.use(authenticate);

// ─── PATIENT-ONLY ROUTES ────────────────────────────────
router.get(
  "/patient/dashboard",
  authorize(ROLES.PATIENT),
  asyncHandler(async (req, res) => {
    res.status(200).json({
      ok: true,
      message: "Welcome to Patient Dashboard",
      user: req.user,
    });
  })
);

// ─── DOCTOR-ONLY ROUTES ─────────────────────────────────
router.get(
  "/doctor/dashboard",
  authorize(ROLES.DOCTOR),
  asyncHandler(async (req, res) => {
    res.status(200).json({
      ok: true,
      message: "Welcome to Doctor Dashboard",
      user: req.user,
    });
  })
);

// Doctors can list their patients (example)
router.get(
  "/doctor/patients",
  authorize(ROLES.DOCTOR),
  asyncHandler(async (req, res) => {
    // Placeholder – expand with actual patient-doctor relationship table
    res.status(200).json({
      ok: true,
      message: "Patient list for doctor",
      patients: [],
    });
  })
);

// ─── CLINIC-ONLY ROUTES ─────────────────────────────────
router.get(
  "/clinic/dashboard",
  authorize(ROLES.CLINIC),
  asyncHandler(async (req, res) => {
    res.status(200).json({
      ok: true,
      message: "Welcome to Clinic Dashboard",
      user: req.user,
    });
  })
);

// Clinics can list their doctors
router.get(
  "/clinic/doctors",
  authorize(ROLES.CLINIC),
  asyncHandler(async (req, res) => {
    const { data: doctors, error } = await supabase
      .from("doctor_profiles")
      .select("*, users!inner(email, full_name, phone)")
      .eq("clinic_id", req.user.id);

    if (error) {
      return res.status(500).json({ ok: false, message: "Failed to fetch doctors" });
    }

    res.status(200).json({
      ok: true,
      doctors: doctors || [],
    });
  })
);

// ─── DOCTOR + CLINIC SHARED ROUTE ───────────────────────
router.get(
  "/appointments",
  authorize(ROLES.DOCTOR, ROLES.CLINIC),
  asyncHandler(async (req, res) => {
    res.status(200).json({
      ok: true,
      message: "Appointments list (placeholder)",
      appointments: [],
    });
  })
);

module.exports = router;
