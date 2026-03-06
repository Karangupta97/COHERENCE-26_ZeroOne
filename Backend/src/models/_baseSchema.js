const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * Factory that returns a new Mongoose Schema pre-loaded with all shared
 * auth fields, indexes, pre-save password hashing, and instance methods.
 *
 * @param {Object} roleSpecificFields  Extra Mongoose schema field definitions
 * @param {string} roleValue           The role string stored on every document
 */
function buildBaseSchema(roleSpecificFields, roleValue) {
  const schema = new mongoose.Schema(
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
        select: false,
      },
      // Immutable role — stored so queries on the document carry the role value
      role: {
        type: String,
        default: roleValue,
        immutable: true,
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
      lastLoginAt: { type: Date },
      passwordChangedAt: { type: Date },

      // Spread role-specific fields at the top level
      ...roleSpecificFields,
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

  // ─── Pre-save: hash password ─────────────────────────────
  schema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    if (!this.isNew) {
      this.passwordChangedAt = new Date();
    }
    next();
  });

  // ─── Instance method: compare password ───────────────────
  schema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  // ─── Instance method: safe public object ─────────────────
  schema.methods.toPublicJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.passwordChangedAt;
    return obj;
  };

  return schema;
}

module.exports = buildBaseSchema;
