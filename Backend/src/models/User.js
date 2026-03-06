const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const ROLES = ["patient", "doctor", "clinic"];

// ─── Sub-schemas (role-specific profile data) ───────────

const patientProfileSchema = new mongoose.Schema(
  {
    dateOfBirth: { type: Date },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    address: { type: String, maxlength: 300 },
    emergencyContact: {
      name: { type: String, maxlength: 100 },
      phone: { type: String, maxlength: 20 },
      relation: { type: String, maxlength: 50 },
    },
    medicalHistory: [{ type: String, maxlength: 200 }],
  },
  { _id: false }
);

const doctorProfileSchema = new mongoose.Schema(
  {
    specialization: { type: String, maxlength: 100 },
    licenseNumber: { type: String, maxlength: 50 },
    hospitalAffiliation: { type: String, maxlength: 150 },
    yearsOfExperience: { type: Number, min: 0 },
    qualifications: [{ type: String, maxlength: 100 }],
    availableSlots: [{ type: String }],
  },
  { _id: false }
);

const clinicProfileSchema = new mongoose.Schema(
  {
    clinicName: { type: String, maxlength: 150 },
    registrationNumber: { type: String, maxlength: 50 },
    address: { type: String, maxlength: 300 },
    contactEmail: {
      type: String,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid contact email"],
      maxlength: 100,
    },
    operatingHours: { type: String, maxlength: 100 },
    specialties: [{ type: String, maxlength: 100 }],
  },
  { _id: false }
);

// ─── Main User Schema ────────────────────────────────────

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name must be at most 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name must be at most 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
      maxlength: [100, "Email must be at most 100 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // never return password by default
    },
    role: {
      type: String,
      enum: { values: ROLES, message: "Role must be patient, doctor, or clinic" },
      required: [true, "Role is required"],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, "Phone must be at most 20 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Role-specific embedded profiles
    patientProfile: {
      type: patientProfileSchema,
      default: undefined,
    },
    doctorProfile: {
      type: doctorProfileSchema,
      default: undefined,
    },
    clinicProfile: {
      type: clinicProfileSchema,
      default: undefined,
    },
    lastLoginAt: { type: Date },
    passwordChangedAt: { type: Date },
  },
  {
    timestamps: true, // createdAt, updatedAt
    versionKey: false,
  }
);

// ─── Indexes ─────────────────────────────────────────────
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

// ─── Pre-save: hash password ─────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
  if (!this.isNew) {
    this.passwordChangedAt = new Date();
  }
  next();
});

// ─── Instance method: compare password ───────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Instance method: safe public object ─────────────────
userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.passwordChangedAt;
  delete obj.__v;
  return obj;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
module.exports.ROLES = ROLES;
