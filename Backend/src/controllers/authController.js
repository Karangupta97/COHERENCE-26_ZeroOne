const bcrypt = require("bcrypt");
const supabase = require("../config/supabase");
const { generateToken } = require("../utils/jwt");
const { validateSignup, validateLogin } = require("../utils/validators");
const asyncHandler = require("../utils/asyncHandler");

const SALT_ROUNDS = 12;

// ─── SIGNUP ─────────────────────────────────────────────
const signup = asyncHandler(async (req, res) => {
  const { email, password, full_name, role, phone } = req.body;

  // Validate input
  const error = validateSignup({ email, password, full_name, role, phone });
  if (error) {
    return res.status(400).json({ ok: false, message: error });
  }

  // Check if email already exists
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email.toLowerCase().trim())
    .single();

  if (existing) {
    return res.status(409).json({ ok: false, message: "Email already registered" });
  }

  // Hash the password
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  // Insert user
  const { data: user, error: insertError } = await supabase
    .from("users")
    .insert({
      email: email.toLowerCase().trim(),
      password_hash,
      role,
      full_name: full_name.trim(),
      phone: phone?.trim() || null,
    })
    .select("id, email, role, full_name, phone, created_at")
    .single();

  if (insertError) {
    console.error("Supabase insert error:", insertError);
    return res.status(500).json({ ok: false, message: "Failed to create user" });
  }

  // Create role-specific profile
  const profileTable = `${role}_profiles`;
  const profilePayload = { user_id: user.id };

  if (role === "clinic") {
    profilePayload.clinic_name = full_name.trim();
  }

  const { error: profileError } = await supabase
    .from(profileTable)
    .insert(profilePayload);

  if (profileError) {
    console.error("Profile creation error:", profileError);
    // User was created, profile failed – log but don't block signup
  }

  // Generate JWT
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  res.status(201).json({
    ok: true,
    message: "Account created successfully",
    token,
    user,
  });
});

// ─── LOGIN ──────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  const error = validateLogin({ email, password });
  if (error) {
    return res.status(400).json({ ok: false, message: error });
  }

  // Fetch user by email
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("id, email, password_hash, role, full_name, phone, is_active, created_at")
    .eq("email", email.toLowerCase().trim())
    .single();

  if (fetchError || !user) {
    return res.status(401).json({ ok: false, message: "Invalid email or password" });
  }

  // Check account status
  if (!user.is_active) {
    return res.status(403).json({ ok: false, message: "Account is deactivated. Contact support." });
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ ok: false, message: "Invalid email or password" });
  }

  // Generate JWT
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // Strip password_hash before responding
  const { password_hash, ...safeUser } = user;

  res.status(200).json({
    ok: true,
    message: "Logged in successfully",
    token,
    user: safeUser,
  });
});

// ─── GET CURRENT USER (ME) ─────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, role, full_name, phone, is_active, created_at, updated_at")
    .eq("id", req.user.id)
    .single();

  if (error || !user) {
    return res.status(404).json({ ok: false, message: "User not found" });
  }

  // Fetch role-specific profile
  const profileTable = `${user.role}_profiles`;
  const { data: profile } = await supabase
    .from(profileTable)
    .select("*")
    .eq("user_id", user.id)
    .single();

  res.status(200).json({
    ok: true,
    user,
    profile: profile || null,
  });
});

module.exports = { signup, login, getMe };
