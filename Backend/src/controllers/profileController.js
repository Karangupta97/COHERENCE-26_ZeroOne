const supabase = require("../config/supabase");
const asyncHandler = require("../utils/asyncHandler");

// ─── GET OWN PROFILE ───────────────────────────────────
const getProfile = asyncHandler(async (req, res) => {
  const { role, id } = req.user;
  const profileTable = `${role}_profiles`;

  const { data: profile, error } = await supabase
    .from(profileTable)
    .select("*")
    .eq("user_id", id)
    .single();

  if (error || !profile) {
    return res.status(404).json({ ok: false, message: "Profile not found" });
  }

  res.status(200).json({ ok: true, profile });
});

// ─── UPDATE OWN PROFILE ────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const { role, id } = req.user;
  const profileTable = `${role}_profiles`;

  // Only allow role-appropriate fields
  const allowedFields = getAllowedFields(role);
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ ok: false, message: "No valid fields to update" });
  }

  updates.updated_at = new Date().toISOString();

  const { data: profile, error } = await supabase
    .from(profileTable)
    .update(updates)
    .eq("user_id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ ok: false, message: "Failed to update profile" });
  }

  res.status(200).json({ ok: true, message: "Profile updated", profile });
});

function getAllowedFields(role) {
  switch (role) {
    case "patient":
      return ["date_of_birth", "gender", "blood_group", "address"];
    case "doctor":
      return ["specialization", "license_number", "experience_years", "clinic_id"];
    case "clinic":
      return ["clinic_name", "address", "license_number"];
    default:
      return [];
  }
}

module.exports = { getProfile, updateProfile };
