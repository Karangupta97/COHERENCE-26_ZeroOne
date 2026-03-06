const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profileController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

// All profile routes require authentication
router.use(authenticate);

router.get("/", getProfile);
router.put("/", updateProfile);

module.exports = router;
