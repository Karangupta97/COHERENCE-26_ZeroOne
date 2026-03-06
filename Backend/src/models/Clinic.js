const mongoose = require("mongoose");
const buildBaseSchema = require("./_baseSchema");

const clinicSchema = buildBaseSchema(
  {
    // ─── Clinic-specific fields ───────────────────────────
    clinicName: {
      type: String,
      maxlength: [150, "Clinic name must be at most 150 characters"],
    },
    registrationNumber: {
      type: String,
      maxlength: [50, "Registration number must be at most 50 characters"],
    },
    // Structured address
    addressLine1: {
      type: String,
      maxlength: [200, "Address line 1 must be at most 200 characters"],
    },
    addressLine2: {
      type: String,
      maxlength: [200, "Address line 2 must be at most 200 characters"],
    },
    city: {
      type: String,
      maxlength: [100, "City must be at most 100 characters"],
    },
    district: {
      type: String,
      maxlength: [100, "District must be at most 100 characters"],
    },
    state: {
      type: String,
      maxlength: [100, "State must be at most 100 characters"],
    },
    pincode: {
      type: String,
      maxlength: [10, "Pincode must be at most 10 characters"],
    },
    contactEmail: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid clinic contact email"],
      maxlength: [100, "Contact email must be at most 100 characters"],
    },
    operatingHours: {
      type: String,
      maxlength: [100, "Operating hours must be at most 100 characters"],
    },
    specialties: [{ type: String, maxlength: 100 }],
  },
  "clinic" // role value stored on each document
);

// MongoDB collection name: "clinics"
const Clinic = mongoose.model("Clinic", clinicSchema, "clinics");

module.exports = Clinic;
