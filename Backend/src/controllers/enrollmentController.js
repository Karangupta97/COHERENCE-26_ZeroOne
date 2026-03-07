const TrialEnrollment = require("../models/TrialEnrollment");
const Trial = require("../models/Trial");
const Patient = require("../models/Patient");

/**
 * POST /api/enrollments
 * Doctor refers a patient to a trial.
 */
async function referPatient(req, res, next) {
  try {
    const { trialId, patientId, referralNotes, matchScore } = req.body;

    // Verify trial exists and is open
    const trial = await Trial.findById(trialId);
    if (!trial) {
      return res.status(404).json({ ok: false, message: "Trial not found." });
    }
    if (!["Recruiting", "Active"].includes(trial.status)) {
      return res.status(400).json({ ok: false, message: "Trial is not currently accepting patients." });
    }

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ ok: false, message: "Patient not found." });
    }

    // Check for duplicate enrollment
    const existing = await TrialEnrollment.findOne({ trialId, patientId });
    if (existing) {
      return res.status(409).json({
        ok: false,
        message: "This patient has already been referred to this trial.",
      });
    }

    const enrollment = await TrialEnrollment.create({
      trialId,
      patientId,
      doctorId: req.user._id,
      referralNotes,
      matchScore: matchScore ? Number(matchScore) : undefined,
    });

    return res.status(201).json({
      ok: true,
      message: "Patient referred to trial successfully.",
      data: enrollment,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/enrollments/my
 * List all enrollments created by the authenticated doctor.
 */
async function getMyEnrollments(req, res, next) {
  try {
    const enrollments = await TrialEnrollment.find({ doctorId: req.user._id })
      .populate("trialId", "trialName trialId phase category location status")
      .populate("patientId", "firstName lastName anonymizedId age gender diagnosis location")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ ok: true, count: enrollments.length, data: enrollments });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/enrollments/trial/:trialId
 * List all enrollments for a specific trial (doctor or clinic).
 */
async function getTrialEnrollments(req, res, next) {
  try {
    const enrollments = await TrialEnrollment.find({ trialId: req.params.trialId })
      .populate("patientId", "firstName lastName anonymizedId age gender diagnosis location")
      .populate("doctorId", "firstName lastName specialization")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ ok: true, count: enrollments.length, data: enrollments });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/enrollments/:id/status
 * Update enrollment status (clinic can approve/reject, doctor can withdraw).
 */
async function updateEnrollmentStatus(req, res, next) {
  try {
    const { status } = req.body;
    const enrollment = await TrialEnrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ ok: false, message: "Enrollment not found." });
    }

    const allowed = ["referred", "approved", "screening", "enrolled", "completed", "withdrawn", "rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ ok: false, message: `Invalid status. Must be one of: ${allowed.join(", ")}` });
    }

    enrollment.status = status;

    // Track date changes
    if (status === "approved") enrollment.approvedAt = new Date();
    if (status === "enrolled") enrollment.enrolledAt = new Date();
    if (status === "completed") enrollment.completedAt = new Date();

    await enrollment.save();

    return res.json({ ok: true, message: "Enrollment status updated.", data: enrollment });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/enrollments/patients
 * Get list of all patients (anonymized) for doctors to search/select.
 */
async function getPatientsList(req, res, next) {
  try {
    const patients = await Patient.find({ isActive: true })
      .select("anonymizedId firstName lastName age gender diagnosis location")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ ok: true, count: patients.length, data: patients });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/enrollments/apply
 * Patient self-applies to a trial from AI match results.
 */
async function patientApply(req, res, next) {
  try {
    const { trialId, matchScore } = req.body;

    const trial = await Trial.findById(trialId);
    if (!trial) {
      return res.status(404).json({ ok: false, message: "Trial not found." });
    }
    if (!["Recruiting", "Active"].includes(trial.status)) {
      return res.status(400).json({ ok: false, message: "Trial is not currently accepting applications." });
    }

    // Find the patient record linked to this user
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(404).json({ ok: false, message: "Patient profile not found. Please complete your profile first." });
    }

    // Check for duplicate application
    const existing = await TrialEnrollment.findOne({ trialId, patientId: patient._id });
    if (existing) {
      return res.status(409).json({
        ok: false,
        message: "You have already applied to this trial.",
        data: existing,
      });
    }

    const enrollment = await TrialEnrollment.create({
      trialId,
      patientId: patient._id,
      doctorId: req.user._id,
      status: "referred",
      referralNotes: "Patient self-application via AI Trial Match",
      matchScore: matchScore ? Number(matchScore) : undefined,
    });

    return res.status(201).json({
      ok: true,
      message: "Application submitted successfully.",
      data: enrollment,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/enrollments/my-applications
 * Patient views their own trial applications.
 */
async function getMyApplications(req, res, next) {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.json({ ok: true, count: 0, data: [] });
    }

    const enrollments = await TrialEnrollment.find({ patientId: patient._id })
      .populate("trialId", "trialName trialId phase category location status hospital drug")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ ok: true, count: enrollments.length, data: enrollments });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  referPatient,
  getMyEnrollments,
  getTrialEnrollments,
  updateEnrollmentStatus,
  getPatientsList,
  patientApply,
  getMyApplications,
};
