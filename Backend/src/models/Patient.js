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
    dateOfBirth: obj.dateOfBirth,
    bloodGroup: obj.bloodGroup,
    medicalHistory: obj.medicalHistory,
    isActive: obj.isActive,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

// MongoDB collection name: "patients"
const Patient = mongoose.model("Patient", patientSchema, "patients");

module.exports = Patient;
