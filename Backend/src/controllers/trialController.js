const Trial = require("../models/Trial");

/**
 * POST /api/trials
 * Create a new clinical trial (clinic only).
 */
async function createTrial(req, res, next) {
  try {
    const {
      trialName, trialId, phase, category, duration,
      ageMin, ageMax, gender, diagnoses, exclusions, labValues,
      slots, target, compensation, location,
      startDate, endDate, description,
    } = req.body;

    // Prevent duplicate trialId
    const existing = await Trial.findOne({ trialId });
    if (existing) {
      return res.status(409).json({ ok: false, message: "A trial with this Trial ID already exists." });
    }

    const trial = await Trial.create({
      clinicId: req.user._id,
      trialName,
      trialId,
      phase,
      category,
      duration,
      ageMin: ageMin ? Number(ageMin) : undefined,
      ageMax: ageMax ? Number(ageMax) : undefined,
      gender,
      diagnoses: diagnoses || [],
      exclusions: exclusions || [],
      labValues: (labValues || []).filter((l) => l.labName),
      slots: Number(slots),
      target: target ? Number(target) : undefined,
      compensation,
      location,
      startDate,
      endDate: endDate || undefined,
      description,
    });

    return res.status(201).json({
      ok: true,
      message: "Trial created successfully.",
      data: trial,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/trials/my
 * List all trials belonging to the authenticated clinic, newest first.
 */
async function getMyTrials(req, res, next) {
  try {
    const trials = await Trial.find({ clinicId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ ok: true, count: trials.length, data: trials });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/trials/:id
 * Get a single trial by its MongoDB _id (owner only).
 */
async function getTrialById(req, res, next) {
  try {
    const trial = await Trial.findById(req.params.id).lean();

    if (!trial) {
      return res.status(404).json({ ok: false, message: "Trial not found." });
    }
    if (trial.clinicId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ ok: false, message: "Access denied." });
    }

    return res.json({ ok: true, data: trial });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/trials/:id
 * Update a trial (owner only). Supports partial updates.
 */
async function updateTrial(req, res, next) {
  try {
    const trial = await Trial.findById(req.params.id);

    if (!trial) {
      return res.status(404).json({ ok: false, message: "Trial not found." });
    }
    if (trial.clinicId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ ok: false, message: "Access denied." });
    }

    const allowedFields = [
      "trialName", "phase", "category", "duration",
      "ageMin", "ageMax", "gender", "diagnoses", "exclusions", "labValues",
      "slots", "target", "compensation", "location",
      "startDate", "endDate", "description", "status",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        trial[field] = req.body[field];
      }
    }

    await trial.save();
    return res.json({ ok: true, message: "Trial updated.", data: trial });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/trials/all
 * Public list of all recruiting trials (for patients / doctors).
 */
async function getAllTrials(req, res, next) {
  try {
    const filter = { status: { $in: ["Recruiting", "Active"] } };
    const trials = await Trial.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ ok: true, count: trials.length, data: trials });
  } catch (err) {
    next(err);
  }
}

module.exports = { createTrial, getMyTrials, getTrialById, updateTrial, getAllTrials };
