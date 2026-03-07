const { Router } = require("express");
const { authenticate, authorize } = require("../middlewares/auth");
const { chat } = require("../controllers/chatController");

const router = Router();

// POST /api/chat — patient-only Gemini AI chatbot
router.post("/", authenticate, authorize("patient"), chat);

module.exports = router;
