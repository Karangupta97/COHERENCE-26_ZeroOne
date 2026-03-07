const { getMatchedTrials } = require("../services/matchingService");

/**
 * GET /api/matching/my-matches
 * Patient fetches their ranked trial matches.
 * Uses only the authenticated patient's ID — no PII exposed.
 */
exports.getMyMatches = async (req, res, next) => {
  try {
    const matches = await getMatchedTrials(req.user._id);

    return res.json({
      ok: true,
      count: matches.length,
      data: matches,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/matching/patient/:anonymizedId
 * Doctor/Clinic fetches trial matches for a patient by anonymizedId.
 * Returns only anonymized match data — no PII.
 */
exports.getMatchesByAnonymizedId = async (req, res, next) => {
  try {
    const Patient = require("../models/Patient");
    const { anonymizedId } = req.params;

    const patient = await Patient.findOne({
      anonymizedId,
      isActive: true,
    });

    if (!patient) {
      return res.status(404).json({
        ok: false,
        message: "No active patient found with that anonymized ID.",
      });
    }

    const matches = await getMatchedTrials(patient._id);

    return res.json({
      ok: true,
      anonymizedId,
      count: matches.length,
      data: matches,
    });
  } catch (err) {
    next(err);
  }
};
