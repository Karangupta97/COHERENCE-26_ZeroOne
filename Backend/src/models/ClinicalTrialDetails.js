const mongoose = require("mongoose");

const clinicalTrialDetailsSchema = new mongoose.Schema(
  {
    // ─── Links ────────────────────────────────────────────
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient reference is required"],
      index: true,
    },
    anonymizedId: {
      type: String,
      required: [true, "Anonymized patient ID is required"],
      index: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor reference is required"],
      index: true,
    },

    // ─── Demographics (non-PII, clinical only) ───────────
    age: { type: Number, min: 0, max: 150 },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    ethnicity: { type: String, trim: true, maxlength: 80 },

    // ─── Medical History ─────────────────────────────────
    primaryDiagnosis: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    secondaryDiagnoses: [{ type: String, trim: true, maxlength: 200 }],
    diagnosisDate: { type: Date },

    medicalHistory: [{ type: String, trim: true, maxlength: 200 }],
    surgicalHistory: [{ type: String, trim: true, maxlength: 200 }],
    familyHistory: [{ type: String, trim: true, maxlength: 200 }],

    // ─── Current Medications ─────────────────────────────
    currentMedications: [
      {
        name: { type: String, trim: true, maxlength: 150 },
        dosage: { type: String, trim: true, maxlength: 80 },
        frequency: { type: String, trim: true, maxlength: 80 },
      },
    ],

    // ─── Allergies ───────────────────────────────────────
    allergies: [{ type: String, trim: true, maxlength: 150 }],

    // ─── Vitals & Lab Values ─────────────────────────────
    vitals: {
      bloodPressureSystolic: { type: Number },
      bloodPressureDiastolic: { type: Number },
      heartRate: { type: Number },
      weight: { type: Number },
      height: { type: Number },
      bmi: { type: Number },
    },
    labValues: {
      hba1c: { type: String, trim: true, maxlength: 20 },
      creatinine: { type: String, trim: true, maxlength: 20 },
      alt: { type: String, trim: true, maxlength: 20 },
      ast: { type: String, trim: true, maxlength: 20 },
      hemoglobin: { type: String, trim: true, maxlength: 20 },
      plateletCount: { type: String, trim: true, maxlength: 20 },
      wbc: { type: String, trim: true, maxlength: 20 },
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""],
    },

    // ─── Lifestyle ───────────────────────────────────────
    smokingStatus: {
      type: String,
      enum: ["Never", "Former", "Current", ""],
    },
    alcoholUse: {
      type: String,
      enum: ["None", "Occasional", "Moderate", "Heavy", ""],
    },

    // ─── Eligibility Criteria ────────────────────────────
    ecogPerformanceStatus: {
      type: Number,
      min: 0,
      max: 5,
    },
    hasAdequateOrganFunction: { type: Boolean },
    isPregnantOrNursing: { type: Boolean },
    hasInformedConsent: { type: Boolean },

    // ─── Trial-specific Notes ────────────────────────────
    inclusionNotes: { type: String, trim: true, maxlength: 1000 },
    exclusionNotes: { type: String, trim: true, maxlength: 1000 },
    doctorRemarks: { type: String, trim: true, maxlength: 1000 },

    // ─── Status ──────────────────────────────────────────
    status: {
      type: String,
      enum: ["draft", "submitted", "reviewed"],
      default: "submitted",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index: one active record per patient-doctor pair
clinicalTrialDetailsSchema.index({ patientId: 1, doctorId: 1 });

const ClinicalTrialDetails = mongoose.model(
  "ClinicalTrialDetails",
  clinicalTrialDetailsSchema,
  "clinicalTrialDetails"
);

module.exports = ClinicalTrialDetails;
