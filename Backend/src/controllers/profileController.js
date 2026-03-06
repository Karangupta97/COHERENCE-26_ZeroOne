const { getModel } = require("../models/modelMap");

// ─── GET /api/profile/me ─────────────────────────────────
async function getMe(req, res, next) {
  try {
    // req.user is already attached by authenticate middleware
    return res.status(200).json({ ok: true, user: req.user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
}

// ─── PUT /api/profile/me ─────────────────────────────────
// Role-specific fields are stored directly on the document (not nested).
// The API still accepts them under patientProfile / doctorProfile / clinicProfile
// keys in the request body so the frontend contract is unchanged.
async function updateMe(req, res, next) {
  try {
    const Model = getModel(req.user.role);
    const user = await Model.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    // Common fields
    const allowedCommon = ["firstName", "lastName", "phone"];
    for (const field of allowedCommon) {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    }

    // Patient-specific (fields are top-level on the Patient document)
    if (user.role === "patient" && req.body.patientProfile) {
      const allowed = ["dateOfBirth", "bloodGroup", "address", "emergencyContact", "medicalHistory"];
      for (const field of allowed) {
        if (req.body.patientProfile[field] !== undefined) {
          user[field] = req.body.patientProfile[field];
        }
      }
    }

    // Doctor-specific
    if (user.role === "doctor" && req.body.doctorProfile) {
      const allowed = ["specialization", "licenseNumber", "hospitalAffiliation", "yearsOfExperience", "qualifications", "availableSlots"];
      for (const field of allowed) {
        if (req.body.doctorProfile[field] !== undefined) {
          user[field] = req.body.doctorProfile[field];
        }
      }
    }

    // Clinic-specific
    if (user.role === "clinic" && req.body.clinicProfile) {
      const allowed = ["clinicName", "registrationNumber", "address", "contactEmail", "operatingHours", "specialties"];
      for (const field of allowed) {
        if (req.body.clinicProfile[field] !== undefined) {
          user[field] = req.body.clinicProfile[field];
        }
      }
    }

    await user.save();

    return res.status(200).json({
      ok: true,
      message: "Profile updated successfully",
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// ─── PUT /api/profile/change-password ────────────────────
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    const Model = getModel(req.user.role);
    const user = await Model.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ ok: false, message: "Current password is incorrect" });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ ok: false, message: "New password must differ from the current password" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ ok: true, message: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMe, updateMe, changePassword };
