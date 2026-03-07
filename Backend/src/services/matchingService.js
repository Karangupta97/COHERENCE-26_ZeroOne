const ClinicalTrialDetails = require("../models/ClinicalTrialDetails");
const Patient = require("../models/Patient");
const Trial = require("../models/Trial");

// ─── Scoring weights ──────────────────────────────────────
const SCORE_WEIGHTS = {
  condition: 40,
  age: 25,
  biomarker: 20,
  location: 15,
};

/**
 * Core matching function: scores a single patient against a single trial.
 * Returns { score, eligible, reasons[], exclusionHit }
 */
function matchPatientToTrial(patient, trial) {
  let score = 0;
  const reasons = [];
  let exclusionHit = false;

  // ─── 1. Exclusion Criteria (hard disqualifier) ──────────
  if (trial.exclusions && trial.exclusions.length > 0) {
    const patientConditions = gatherPatientConditions(patient);
    for (const exclusion of trial.exclusions) {
      const exLower = exclusion.toLowerCase();
      for (const cond of patientConditions) {
        if (cond.toLowerCase().includes(exLower) || exLower.includes(cond.toLowerCase())) {
          exclusionHit = true;
          reasons.push({
            type: "exclusion",
            passed: false,
            text: `Excluded: patient has "${cond}" which matches exclusion "${exclusion}"`,
          });
          break;
        }
      }
      if (exclusionHit) break;
    }
  }

  if (exclusionHit) {
    return {
      score: 0,
      eligible: "Not Eligible",
      reasons,
      exclusionHit: true,
    };
  }

  // ─── 2. Condition Matching (40 pts) ─────────────────────
  const patientConditions = gatherPatientConditions(patient);
  const allTrialDiagnoses = [
    ...(trial.diagnoses || []),
    ...(trial.requiredConditions || []),
    ...(trial.symptoms || []),
  ];

  if (allTrialDiagnoses.length > 0) {
    let conditionMatched = false;
    let symptomMatches = 0;

    // Check diagnosis match
    if (trial.diagnoses && trial.diagnoses.length > 0) {
      for (const reqDiag of trial.diagnoses) {
        const reqLower = reqDiag.toLowerCase();
        for (const cond of patientConditions) {
          if (
            cond.toLowerCase().includes(reqLower) ||
            reqLower.includes(cond.toLowerCase())
          ) {
            conditionMatched = true;
            break;
          }
        }
        if (conditionMatched) break;
      }
    }

    // Check symptom overlap (adds partial score even without exact diagnosis)
    if (trial.symptoms && trial.symptoms.length > 0) {
      for (const symptom of trial.symptoms) {
        const symLower = symptom.toLowerCase();
        for (const cond of patientConditions) {
          if (
            cond.toLowerCase().includes(symLower) ||
            symLower.includes(cond.toLowerCase())
          ) {
            symptomMatches++;
            break;
          }
        }
      }
    }

    if (conditionMatched) {
      score += SCORE_WEIGHTS.condition;
      reasons.push({
        type: "condition",
        passed: true,
        text: "Diagnosis confirmed — matches trial requirement",
      });
    } else if (symptomMatches > 0) {
      // Partial condition score based on symptom overlap
      const symptomRatio = symptomMatches / trial.symptoms.length;
      const partialScore = Math.round(symptomRatio * SCORE_WEIGHTS.condition);
      score += partialScore;
      reasons.push({
        type: "condition",
        passed: symptomRatio >= 0.5,
        text: `${symptomMatches}/${trial.symptoms.length} symptoms match (partial score: ${partialScore}/${SCORE_WEIGHTS.condition})`,
      });
    } else {
      reasons.push({
        type: "condition",
        passed: false,
        text: "Primary diagnosis does not match trial conditions",
      });
    }
  } else {
    // No specific diagnosis required → full points
    score += SCORE_WEIGHTS.condition;
    reasons.push({
      type: "condition",
      passed: true,
      text: "No specific diagnosis required",
    });
  }

  // ─── 3. Age Matching (25 pts) ───────────────────────────
  const patientAge = patient.age;
  if (patientAge != null && (trial.ageMin != null || trial.ageMax != null)) {
    const minOk = trial.ageMin == null || patientAge >= trial.ageMin;
    const maxOk = trial.ageMax == null || patientAge <= trial.ageMax;

    if (minOk && maxOk) {
      score += SCORE_WEIGHTS.age;
      reasons.push({
        type: "age",
        passed: true,
        text: `Age ${patientAge} is within range ${trial.ageMin ?? "any"}–${trial.ageMax ?? "any"}`,
      });
    } else {
      reasons.push({
        type: "age",
        passed: false,
        text: `Age ${patientAge} is outside range ${trial.ageMin ?? "any"}–${trial.ageMax ?? "any"}`,
      });
    }
  } else if (patientAge != null) {
    // No age criteria on trial → full points
    score += SCORE_WEIGHTS.age;
    reasons.push({ type: "age", passed: true, text: "No age restriction" });
  } else {
    reasons.push({ type: "age", passed: false, text: "Patient age not available" });
  }

  // ─── 4. Biomarker Matching (20 pts) ─────────────────────
  if (trial.labValues && trial.labValues.length > 0) {
    const patientLabs = gatherPatientLabs(patient);
    let labsChecked = 0;
    let labsPassed = 0;

    for (const reqLab of trial.labValues) {
      if (!reqLab.labName) continue;
      labsChecked++;

      const labKey = reqLab.labName.toLowerCase().replace(/[\s-_]/g, "");
      const patientVal = findLabValue(patientLabs, labKey);

      if (patientVal !== null) {
        const numVal = parseFloat(patientVal);
        const threshold = parseFloat(reqLab.value);

        if (!isNaN(numVal) && !isNaN(threshold)) {
          const passed = evaluateOperator(numVal, reqLab.operator, threshold);
          if (passed) {
            labsPassed++;
            reasons.push({
              type: "biomarker",
              passed: true,
              text: `${reqLab.labName}: ${numVal} ${reqLab.operator} ${threshold} ${reqLab.unit || ""} ✓`,
            });
          } else {
            reasons.push({
              type: "biomarker",
              passed: false,
              text: `${reqLab.labName}: ${numVal} does not satisfy ${reqLab.operator} ${threshold} ${reqLab.unit || ""}`,
            });
          }
        } else {
          reasons.push({
            type: "biomarker",
            passed: false,
            text: `${reqLab.labName}: value not numeric`,
          });
        }
      } else {
        reasons.push({
          type: "biomarker",
          passed: false,
          text: `${reqLab.labName}: value not available`,
        });
      }
    }

    if (labsChecked > 0) {
      const labScore = Math.round(
        (labsPassed / labsChecked) * SCORE_WEIGHTS.biomarker
      );
      score += labScore;
    }
  } else {
    // No biomarker requirements → full points
    score += SCORE_WEIGHTS.biomarker;
    reasons.push({
      type: "biomarker",
      passed: true,
      text: "No biomarker requirements",
    });
  }

  // ─── 5. Location Matching (15 pts) ──────────────────────
  const patientLocation = (patient.location || "").toLowerCase().trim();
  const trialLocation = (trial.location || "").toLowerCase().trim();

  if (patientLocation && trialLocation) {
    // Fuzzy: check if one contains the other (e.g. "Mumbai" in "Mumbai, Maharashtra")
    if (
      patientLocation.includes(trialLocation) ||
      trialLocation.includes(patientLocation)
    ) {
      score += SCORE_WEIGHTS.location;
      reasons.push({
        type: "location",
        passed: true,
        text: `Location match: "${patient.location}" ≈ "${trial.location}"`,
      });
    } else {
      reasons.push({
        type: "location",
        passed: false,
        text: `Location mismatch: "${patient.location}" vs "${trial.location}"`,
      });
    }
  } else if (!patientLocation) {
    reasons.push({
      type: "location",
      passed: false,
      text: "Patient location not available",
    });
  } else {
    score += SCORE_WEIGHTS.location;
    reasons.push({
      type: "location",
      passed: true,
      text: "No location restriction",
    });
  }

  // ─── Eligibility determination ──────────────────────────
  let eligible;
  if (score >= 60) {
    eligible = "Eligible";
  } else if (score >= 40) {
    eligible = "Partially Eligible";
  } else {
    eligible = "Not Eligible";
  }

  return { score, eligible, reasons, exclusionHit: false };
}

// ═══════════════════════════════════════════════════════════
//  Main orchestrator: fetch patient data, all trials, match
// ═══════════════════════════════════════════════════════════

/**
 * Get ranked trial matches for a patient.
 * @param {string} patientId  – MongoDB ObjectId of the patient
 * @returns {Array} sorted matches (highest score first)
 */
async function getMatchedTrials(patientId) {
  // 1. Fetch patient base record
  const patient = await Patient.findById(patientId).lean();
  if (!patient) throw new Error("Patient not found");

  // 2. Fetch most recent clinical details (submitted by doctor)
  const clinicalDetails = await ClinicalTrialDetails.findOne({
    patientId,
    status: { $in: ["submitted", "reviewed"] },
  })
    .sort({ createdAt: -1 })
    .lean();

  // 3. Merge patient + clinical details into unified profile
  const patientProfile = buildPatientProfile(patient, clinicalDetails);

  // 4. Fetch all recruiting/active trials
  const trials = await Trial.find({
    status: { $in: ["Recruiting", "Active"] },
  }).lean();

  // 5. Run matching for each trial
  const matches = trials.map((trial) => {
    const result = matchPatientToTrial(patientProfile, trial);
    return {
      trialId: trial._id,
      trialName: trial.trialName,
      trialCode: trial.trialId,
      phase: trial.phase,
      category: trial.category,
      location: trial.location,
      compensation: trial.compensation,
      slots: trial.slots,
      enrolled: trial.enrolled,
      startDate: trial.startDate,
      endDate: trial.endDate,
      description: trial.description,
      status: trial.status,
      drug: trial.drug || null,
      hospital: trial.hospital || null,
      symptoms: trial.symptoms || [],
      requiredConditions: trial.requiredConditions || [],
      score: result.score,
      eligible: result.eligible,
      reasons: result.reasons,
      exclusionHit: result.exclusionHit,
    };
  });

  // 6. Sort by score descending
  matches.sort((a, b) => b.score - a.score);

  return matches;
}

// ═══════════════════════════════════════════════════════════
//  Helper functions
// ═══════════════════════════════════════════════════════════

/**
 * Merge Patient model data with ClinicalTrialDetails into a single profile.
 */
function buildPatientProfile(patient, clinicalDetails) {
  const profile = {
    anonymizedId: patient.anonymizedId,
    age: patient.age,
    gender: patient.gender,
    location: patient.location,
    diagnosis: patient.diagnosis,
    medications: patient.medications,
    allergies: patient.allergies,
    medicalHistory: patient.medicalHistory || [],
    hba1c: patient.hba1c,
    bmi: patient.bmi,
    bloodGroup: patient.bloodGroup,
  };

  // Override with richer clinical details when available
  if (clinicalDetails) {
    if (clinicalDetails.age) profile.age = clinicalDetails.age;
    if (clinicalDetails.gender) profile.gender = clinicalDetails.gender;
    if (clinicalDetails.primaryDiagnosis)
      profile.primaryDiagnosis = clinicalDetails.primaryDiagnosis;
    if (clinicalDetails.secondaryDiagnoses)
      profile.secondaryDiagnoses = clinicalDetails.secondaryDiagnoses;
    if (clinicalDetails.medicalHistory && clinicalDetails.medicalHistory.length)
      profile.medicalHistory = clinicalDetails.medicalHistory;
    if (clinicalDetails.allergies)
      profile.clinicalAllergies = clinicalDetails.allergies;
    if (clinicalDetails.labValues) profile.labValues = clinicalDetails.labValues;
    if (clinicalDetails.vitals) profile.vitals = clinicalDetails.vitals;
    if (clinicalDetails.currentMedications)
      profile.currentMedications = clinicalDetails.currentMedications;
    if (clinicalDetails.smokingStatus)
      profile.smokingStatus = clinicalDetails.smokingStatus;
    if (clinicalDetails.exclusionNotes)
      profile.exclusionNotes = clinicalDetails.exclusionNotes;
  }

  return profile;
}

/**
 * Gather all conditions/diagnoses from the patient profile.
 */
function gatherPatientConditions(patient) {
  const conditions = [];
  if (patient.diagnosis) conditions.push(patient.diagnosis);
  if (patient.primaryDiagnosis) conditions.push(patient.primaryDiagnosis);
  if (patient.secondaryDiagnoses) {
    conditions.push(...patient.secondaryDiagnoses);
  }
  if (patient.medicalHistory) {
    conditions.push(...patient.medicalHistory);
  }
  return conditions.filter(Boolean);
}

/**
 * Gather all lab values from the patient profile into a flat map.
 */
function gatherPatientLabs(patient) {
  const labs = {};

  // From ClinicalTrialDetails labValues object
  if (patient.labValues) {
    for (const [key, val] of Object.entries(patient.labValues)) {
      if (val != null && val !== "") {
        labs[key.toLowerCase().replace(/[\s-_]/g, "")] = val;
      }
    }
  }

  // From Patient model direct fields
  if (patient.hba1c) labs["hba1c"] = patient.hba1c;
  if (patient.bmi) labs["bmi"] = patient.bmi;

  // From vitals
  if (patient.vitals) {
    if (patient.vitals.bmi) labs["bmi"] = String(patient.vitals.bmi);
    if (patient.vitals.weight) labs["weight"] = String(patient.vitals.weight);
    if (patient.vitals.height) labs["height"] = String(patient.vitals.height);
    if (patient.vitals.heartRate)
      labs["heartrate"] = String(patient.vitals.heartRate);
    if (patient.vitals.bloodPressureSystolic)
      labs["bloodpressuresystolic"] = String(
        patient.vitals.bloodPressureSystolic
      );
    if (patient.vitals.bloodPressureDiastolic)
      labs["bloodpressurediastolic"] = String(
        patient.vitals.bloodPressureDiastolic
      );
  }

  return labs;
}

/**
 * Find a lab value by normalized key.
 */
function findLabValue(labs, normalizedKey) {
  if (labs[normalizedKey] !== undefined) return labs[normalizedKey];

  // Fuzzy match: HbA1c → hba1c, Creatinine → creatinine, etc.
  for (const [key, val] of Object.entries(labs)) {
    if (key.includes(normalizedKey) || normalizedKey.includes(key)) {
      return val;
    }
  }
  return null;
}

/**
 * Evaluate a comparison operator.
 */
function evaluateOperator(patientVal, operator, threshold) {
  switch (operator) {
    case ">":
      return patientVal > threshold;
    case "<":
      return patientVal < threshold;
    case ">=":
      return patientVal >= threshold;
    case "<=":
      return patientVal <= threshold;
    case "=":
      return patientVal === threshold;
    case "!=":
      return patientVal !== threshold;
    default:
      return false;
  }
}

module.exports = {
  matchPatientToTrial,
  getMatchedTrials,
  SCORE_WEIGHTS,
};
