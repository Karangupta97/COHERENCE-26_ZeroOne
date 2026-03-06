const express = require("express");
const router = express.Router();

const { getMe, updateMe, changePassword } = require("../controllers/profileController");
const { updateProfileValidation, changePasswordValidation } = require("../validators/profileValidators");
const { authenticate } = require("../middlewares/auth");
const validate = require("../middlewares/validate");

// All profile routes require authentication
router.use(authenticate);

// GET  /api/profile/me
router.get("/me", getMe);

// PUT  /api/profile/me
router.put("/me", updateProfileValidation, validate, updateMe);

// PUT  /api/profile/change-password
router.put("/change-password", changePasswordValidation, validate, changePassword);

module.exports = router;
