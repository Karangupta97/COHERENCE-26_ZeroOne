const mongoose = require("mongoose");

const labResultsSchema = new mongoose.Schema(
  {
    hba1c: { type: String, default: null },
    blood_pressure: { type: String, default: null },
    cholesterol: { type: String, default: null },
  },
  { _id: false }
);

const extractedDataSchema = new mongoose.Schema(
  {
    age: { type: String, default: null },
    gender: { type: String, default: null },
    diagnosis: { type: [String], default: [] },
    symptoms: { type: [String], default: [] },
    lab_results: { type: labResultsSchema, default: () => ({}) },
    medications: { type: [String], default: [] },
    medical_history: { type: [String], default: [] },
    recommended_specialist: { type: String, default: null },
  },
  { _id: false }
);

const medicalReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "userId is required"],
      index: true,
    },
    reportUrl: {
      type: String,
      required: [true, "reportUrl is required"],
      trim: true,
    },
    originalFileName: {
      type: String,
      trim: true,
    },
    mimeType: {
      type: String,
      trim: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    extractedData: {
      type: extractedDataSchema,
      default: null,
    },
    extractionStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    extractionError: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("MedicalReport", medicalReportSchema);
