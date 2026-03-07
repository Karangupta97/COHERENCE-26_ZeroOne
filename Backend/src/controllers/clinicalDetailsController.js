const ClinicalTrialDetails = require("../models/ClinicalTrialDetails");
const Patient = require("../models/Patient");

// ──────────────────────────────────────────────────────────
//  POST /api/clinical-details
//  Doctor submits clinical trial details for a patient
// ──────────────────────────────────────────────────────────
exports.createDetails = async (req, res, next) => {
  try {
    const { anonymizedId, ...formData } = req.body;

    // 1. Find patient by anonymized ID
    const patient = await Patient.findOne({ anonymizedId, isActive: true });
    if (!patient) {
      return res.status(404).json({
        ok: false,
        message: "No active patient found with that anonymized ID.",
      });
    }

    // 2. Create record linked to patient + doctor
    const details = await ClinicalTrialDetails.create({
      ...formData,
      patientId: patient._id,
      anonymizedId: patient.anonymizedId,
      doctorId: req.user._id,
    });

    return res.status(201).json({
      ok: true,
      message: "Clinical trial details submitted successfully.",
      data: details,
    });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────────────────────────────────
//  GET /api/clinical-details/patient/:anonymizedId
//  Doctor looks up all records for a patient (anonymized)
// ──────────────────────────────────────────────────────────
exports.getByAnonymizedId = async (req, res, next) => {
  try {
    const { anonymizedId } = req.params;

    const records = await ClinicalTrialDetails.find({ anonymizedId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ ok: true, data: records });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────────────────────────────────
//  GET /api/clinical-details/verify/:anonymizedId
//  Doctor verifies a patient exists before filling form
// ──────────────────────────────────────────────────────────
exports.verifyPatient = async (req, res, next) => {
  try {
    const { anonymizedId } = req.params;

    const patient = await Patient.findOne({
      anonymizedId,
      isActive: true,
    });

    if (!patient) {
      return res.status(404).json({
        ok: false,
        message: "No active patient found with that anonymized ID.",
      });
    }

    // Return ONLY anonymized + non-PII clinical data
    return res.json({
      ok: true,
      data: patient.toAnonymizedJSON(),
    });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────────────────────────────────
//  GET /api/clinical-details/my
//  Patient views their own clinical trial details (read-only)
// ──────────────────────────────────────────────────────────
exports.getMyDetails = async (req, res, next) => {
  try {
    const records = await ClinicalTrialDetails.find({
      patientId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("doctorId", "firstName lastName specialization hospitalAffiliation")
      .lean();

    // Strip doctor PII down to initials + specialization for patient view
    const sanitized = records.map((r) => ({
      ...r,
      doctorInfo: r.doctorId
        ? {
            name: `Dr. ${r.doctorId.firstName} ${r.doctorId.lastName}`,
            specialization: r.doctorId.specialization,
            hospital: r.doctorId.hospitalAffiliation,
          }
        : null,
      doctorId: undefined,
    }));

    return res.json({ ok: true, data: sanitized });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────────────────────────────────
//  GET /api/clinical-details/doctor/my
//  Doctor views all records they have submitted
// ──────────────────────────────────────────────────────────
exports.getDoctorRecords = async (req, res, next) => {
  try {
    const records = await ClinicalTrialDetails.find({
      doctorId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ ok: true, data: records });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────────────────────────────────
//  GET /api/clinical-details/:id
//  Get a single record by ID
// ──────────────────────────────────────────────────────────
exports.getById = async (req, res, next) => {
  try {
    const record = await ClinicalTrialDetails.findById(req.params.id).lean();
    if (!record) {
      return res.status(404).json({ ok: false, message: "Record not found." });
    }

    // Patients can only see their own, doctors can see their own submissions
    const userId = req.user._id.toString();
    const isOwnerPatient = record.patientId.toString() === userId;
    const isOwnerDoctor = record.doctorId.toString() === userId;

    if (!isOwnerPatient && !isOwnerDoctor) {
      return res.status(403).json({
        ok: false,
        message: "You do not have access to this record.",
      });
    }

    return res.json({ ok: true, data: record });
  } catch (err) {
    next(err);
  }
};
