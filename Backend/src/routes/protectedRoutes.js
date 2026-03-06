const express = require("express");
const router = express.Router();

const { authenticate, authorize } = require("../middlewares/auth");
const Patient = require("../models/Patient");

// All protected routes require a valid JWT
router.use(authenticate);

// ─── PATIENT dashboard ───────────────────────────────────
// GET /api/v1/patient/dashboard
router.get("/patient/dashboard", authorize("patient"), (req, res) => {
  res.json({
    ok: true,
    message: "Welcome to your Patient Dashboard",
    data: {
      user: {
        id: req.user._id,
        name: `${req.user.firstName} ${req.user.lastName}`,
        role: req.user.role,
      },
      links: [
        { label: "My Profile",       path: "/api/profile/me" },
        { label: "Appointments",     path: "/api/v1/patient/appointments" },
        { label: "Medical Records",  path: "/api/v1/patient/records" },
      ],
    },
  });
});

// GET /api/v1/patient/appointments  (stub — extend as needed)
router.get("/patient/appointments", authorize("patient"), (req, res) => {
  res.json({ ok: true, message: "Patient appointments endpoint", data: [] });
});

// GET /api/v1/patient/records  (stub)
router.get("/patient/records", authorize("patient"), (req, res) => {
  res.json({ ok: true, message: "Patient medical records endpoint", data: [] });
});

// ─── DOCTOR dashboard ────────────────────────────────────
// GET /api/v1/doctor/dashboard
router.get("/doctor/dashboard", authorize("doctor"), (req, res) => {
  res.json({
    ok: true,
    message: "Welcome to your Doctor Dashboard",
    data: {
      user: {
        id: req.user._id,
        name: `${req.user.firstName} ${req.user.lastName}`,
        role: req.user.role,
        specialization: req.user.doctorProfile?.specialization || null,
      },
      links: [
        { label: "My Profile",       path: "/api/profile/me" },
        { label: "My Patients",      path: "/api/v1/doctor/patients" },
        { label: "Schedule",         path: "/api/v1/doctor/schedule" },
      ],
    },
  });
});

// GET /api/v1/doctor/patients  (stub)
router.get("/doctor/patients", authorize("doctor"), (req, res) => {
  res.json({ ok: true, message: "Doctor patients list endpoint", data: [] });
});

// GET /api/v1/doctor/schedule  (stub)
router.get("/doctor/schedule", authorize("doctor"), (req, res) => {
  res.json({ ok: true, message: "Doctor schedule endpoint", data: [] });
});

// ─── CLINIC dashboard ────────────────────────────────────
// GET /api/v1/clinic/dashboard
router.get("/clinic/dashboard", authorize("clinic"), (req, res) => {
  res.json({
    ok: true,
    message: "Welcome to your Clinic Dashboard",
    data: {
      user: {
        id: req.user._id,
        name: `${req.user.firstName} ${req.user.lastName}`,
        role: req.user.role,
        clinicName: req.user.clinicProfile?.clinicName || null,
      },
      links: [
        { label: "My Profile",    path: "/api/profile/me" },
        { label: "Doctors",       path: "/api/v1/clinic/doctors" },
        { label: "Appointments",  path: "/api/v1/clinic/appointments" },
      ],
    },
  });
});

// GET /api/v1/clinic/doctors  (stub)
router.get("/clinic/doctors", authorize("clinic"), (req, res) => {
  res.json({ ok: true, message: "Clinic doctors list endpoint", data: [] });
});

// GET /api/v1/clinic/appointments  (stub)
router.get("/clinic/appointments", authorize("clinic"), (req, res) => {
  res.json({ ok: true, message: "Clinic appointments endpoint", data: [] });
});

// ─── SHARED route accessible by all authenticated roles ──
// GET /api/v1/me/role-info
router.get("/me/role-info", (req, res) => {
  res.json({
    ok: true,
    role: req.user.role,
    dashboardPath: `/api/v1/${req.user.role}/dashboard`,
  });
});

// ─── Anonymized Patient Data (for doctors & clinics) ─────
// GET /api/v1/patients/anonymized
// Returns all patients with PII stripped — only anonymizedId + medical data
router.get("/patients/anonymized", authorize("doctor", "clinic"), async (req, res, next) => {
  try {
    const patients = await Patient.find({ isActive: true })
      .select("anonymizedId dateOfBirth bloodGroup medicalHistory role createdAt updatedAt")
      .lean();

    const anonymized = patients.map((p) => ({
      anonymizedId: p.anonymizedId,
      dateOfBirth: p.dateOfBirth,
      bloodGroup: p.bloodGroup,
      medicalHistory: p.medicalHistory,
      createdAt: p.createdAt,
    }));

    return res.json({ ok: true, count: anonymized.length, data: anonymized });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/patients/anonymized/:anonymizedId
// Returns a single patient's anonymized data
router.get("/patients/anonymized/:anonymizedId", authorize("doctor", "clinic"), async (req, res, next) => {
  try {
    const patient = await Patient.findOne({
      anonymizedId: req.params.anonymizedId,
      isActive: true,
    }).select("anonymizedId dateOfBirth bloodGroup medicalHistory role createdAt updatedAt");

    if (!patient) {
      return res.status(404).json({ ok: false, message: "Patient not found" });
    }

    return res.json({ ok: true, data: patient.toAnonymizedJSON() });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
