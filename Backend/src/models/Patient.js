const mongoose = require("mongoose");
const buildBaseSchema = require("./_baseSchema");

const patientSchema = buildBaseSchema(
  {
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

// MongoDB collection name: "patients"
const Patient = mongoose.model("Patient", patientSchema, "patients");

module.exports = Patient;
