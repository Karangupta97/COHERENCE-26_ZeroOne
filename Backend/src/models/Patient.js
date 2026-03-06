const mongoose = require("mongoose");
const crypto = require("crypto");
const buildBaseSchema = require("./_baseSchema");

/**
 * Generates a unique anonymized patient ID.
 * Format: ANON-XXXXXXXX (8 hex chars from crypto.randomBytes)
 */
function generateAnonymizedId() {
  return "ANON-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

const patientSchema = buildBaseSchema(
  {
    // ─── Anonymization ────────────────────────────────────
    anonymizedId: {
      type: String,
      unique: true,
      index: true,
      default: generateAnonymizedId,
    },

    // ─── Patient-specific fields ──────────────────────────
    dateOfBirth: {
      type: Date,
    },
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
      max: [150, "Age seems invalid"],
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Gender must be Male, Female, or Other",
      },
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location must be at most 100 characters"],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        message: "Invalid blood group",
      },
    },
    address: {
      type: String,
      maxlength: [300, "Address must be at most 300 characters"],
    },
    emergencyContact: {
      name:     { type: String, maxlength: 100 },
      phone:    { type: String, maxlength: 20 },
      relation: { type: String, maxlength: 50 },
    },
    medicalHistory: [{ type: String, maxlength: 200 }],
    diagnosis: {
      type: String,
      trim: true,
      maxlength: [200, "Diagnosis must be at most 200 characters"],
    },
    medications: {
      type: String,
      trim: true,
      maxlength: [300, "Medications must be at most 300 characters"],
    },
    hba1c: {
      type: String,
      trim: true,
      maxlength: [20, "HbA1c value must be at most 20 characters"],
    },
    bmi: {
      type: String,
      trim: true,
      maxlength: [20, "BMI value must be at most 20 characters"],
    },
    allergies: {
      type: String,
      trim: true,
      maxlength: [300, "Allergies must be at most 300 characters"],
    },
  },
  "patient" // role value stored on each document
);

// ─── Instance method: anonymized public object ─────────────
// Strips PII (name, email, phone, address, emergencyContact)
// Returns only anonymizedId + medical data for doctor/clinic consumption
patientSchema.methods.toAnonymizedJSON = function () {
  const obj = this.toObject();
  return {
    anonymizedId: obj.anonymizedId,
    role: obj.role,
    age: obj.age,
    gender: obj.gender,
    location: obj.location,
    dateOfBirth: obj.dateOfBirth,
    bloodGroup: obj.bloodGroup,
    medicalHistory: obj.medicalHistory,
    diagnosis: obj.diagnosis,
    medications: obj.medications,
    hba1c: obj.hba1c,
    bmi: obj.bmi,
    allergies: obj.allergies,
    isActive: obj.isActive,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

// MongoDB collection name: "patients"
const Patient = mongoose.model("Patient", patientSchema, "patients");

module.exports = Patient;
