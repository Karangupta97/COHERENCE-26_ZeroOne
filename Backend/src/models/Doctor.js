const mongoose = require("mongoose");
const buildBaseSchema = require("./_baseSchema");

const doctorSchema = buildBaseSchema(
  {
    // ─── Doctor-specific fields ───────────────────────────
    specialization: {
      type: String,
      maxlength: [100, "Specialization must be at most 100 characters"],
    },
    licenseNumber: {
      type: String,
      maxlength: [50, "License number must be at most 50 characters"],
    },
    hospitalAffiliation: {
      type: String,
      maxlength: [150, "Hospital affiliation must be at most 150 characters"],
    },
    yearsOfExperience: {
      type: Number,
      min: [0, "Years of experience cannot be negative"],
      max: [70, "Years of experience cannot exceed 70"],
    },
    qualifications: [{ type: String, maxlength: 100 }],
    availableSlots:  [{ type: String }],
  },
  "doctor" // role value stored on each document
);

// MongoDB collection name: "doctors"
const Doctor = mongoose.model("Doctor", doctorSchema, "doctors");

module.exports = Doctor;
