const mongoose = require("mongoose");

const labValueSchema = new mongoose.Schema(
  {
    labName:  { type: String, trim: true, maxlength: 100 },
    operator: { type: String, enum: [">", "<", ">=", "<=", "=", "!="] },
    value:    { type: String, trim: true, maxlength: 50 },
    unit:     { type: String, trim: true, maxlength: 50 },
  },
  { _id: false }
);

const trialSchema = new mongoose.Schema(
  {
    // ─── Owner (clinic that posted the trial) ─────────────
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      index: true,
    },

    // ─── Basic Info (Step 1) ──────────────────────────────
    trialName: {
      type: String,
      required: [true, "Trial name is required"],
      trim: true,
      maxlength: [200, "Trial name must be at most 200 characters"],
    },
    trialId: {
      type: String,
      required: [true, "Trial ID is required"],
      trim: true,
      unique: true,
      maxlength: [50, "Trial ID must be at most 50 characters"],
    },
    phase: {
      type: String,
      required: [true, "Phase is required"],
      enum: ["Phase I", "Phase II", "Phase III", "Phase IV"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Endocrinology", "Cardiology", "Oncology", "Neurology",
        "Metabolic", "Nephrology", "Pulmonology", "Rheumatology",
        "Genetic", "Rare Disease", "Hematology", "Immunology",
        "Gastroenterology", "Dermatology", "Orthopedics", "Other",
      ],
    },
    duration: {
      type: String,
      trim: true,
      maxlength: [100, "Duration must be at most 100 characters"],
    },

    // ─── Eligibility (Step 2) ─────────────────────────────
    ageMin: { type: Number, min: 0, max: 150 },
    ageMax: { type: Number, min: 0, max: 150 },
    gender: {
      type: String,
      enum: ["All", "M", "F"],
      default: "All",
    },
    diagnoses:  [{ type: String, trim: true, maxlength: 200 }],
    exclusions: [{ type: String, trim: true, maxlength: 200 }],
    labValues:  [labValueSchema],
    symptoms:   [{ type: String, trim: true, maxlength: 200 }],
    requiredConditions: [{ type: String, trim: true, maxlength: 200 }],
    drug:     { type: String, trim: true, maxlength: 200 },
    hospital: { type: String, trim: true, maxlength: 200 },

    // ─── Logistics (Step 3) ───────────────────────────────
    slots: {
      type: Number,
      required: [true, "Number of slots is required"],
      min: [1, "At least 1 slot is required"],
    },
    target:       { type: Number, min: 0 },
    compensation: {
      type: String,
      required: [true, "Compensation is required"],
      trim: true,
      maxlength: [100, "Compensation must be at most 100 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [200, "Location must be at most 200 characters"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: { type: Date },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description must be at most 2000 characters"],
    },

    // ─── Status ───────────────────────────────────────────
    status: {
      type: String,
      enum: ["Recruiting", "Active", "Paused", "Closed"],
      default: "Recruiting",
    },
    enrolled: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for clinic-level queries
trialSchema.index({ clinicId: 1, status: 1 });

const Trial = mongoose.model("Trial", trialSchema, "trials");

module.exports = Trial;
