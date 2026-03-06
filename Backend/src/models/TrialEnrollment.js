const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    // ─── References ───────────────────────────────────────
    trialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trial",
      required: [true, "Trial ID is required"],
      index: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient ID is required"],
      index: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor ID is required"],
      index: true,
    },

    // ─── Status flow ──────────────────────────────────────
    status: {
      type: String,
      enum: [
        "referred",       // Doctor referred the patient
        "approved",       // Clinic approved
        "screening",      // Undergoing screening
        "enrolled",       // Actively enrolled
        "completed",      // Trial completed
        "withdrawn",      // Patient withdrew
        "rejected",       // Clinic rejected
      ],
      default: "referred",
    },

    // ─── Doctor notes ─────────────────────────────────────
    referralNotes: {
      type: String,
      trim: true,
      maxlength: [2000, "Referral notes must be at most 2000 characters"],
    },

    // ─── Match info ───────────────────────────────────────
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    // ─── Dates ────────────────────────────────────────────
    referredAt:  { type: Date, default: Date.now },
    approvedAt:  { type: Date },
    enrolledAt:  { type: Date },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Prevent duplicate enrollment: one patient per trial
enrollmentSchema.index({ trialId: 1, patientId: 1 }, { unique: true });

const TrialEnrollment = mongoose.model("TrialEnrollment", enrollmentSchema, "trial_enrollments");

module.exports = TrialEnrollment;
