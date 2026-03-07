const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const connectDB = require("../config/db");
const Trial = require("../models/Trial");
const clinicData = require("../dataset/clinic/clinic.json");

// ─── Map disease → category ──────────────────────────────
const CATEGORY_MAP = {
  "Duchenne Muscular Dystrophy": "Genetic",
  "Spinal Muscular Atrophy": "Genetic",
  "Fabry Disease": "Metabolic",
  "Pompe Disease": "Metabolic",
  "Huntington's Disease": "Neurology",
  "Wilson Disease": "Metabolic",
  "Marfan Syndrome": "Genetic",
  "Niemann-Pick Disease": "Metabolic",
  "Angelman Syndrome": "Genetic",
  "Gaucher Disease": "Metabolic",
  "Amyloidosis": "Hematology",
  "Alport Syndrome": "Nephrology",
  "Prader-Willi Syndrome": "Genetic",
  "Ehlers-Danlos Syndrome": "Genetic",
  "Tay-Sachs Disease": "Genetic",
  "Myasthenia Gravis": "Neurology",
  "Primary Ciliary Dyskinesia": "Pulmonology",
  "Lesch-Nyhan Syndrome": "Metabolic",
  "Charcot-Marie-Tooth Disease": "Neurology",
  "Addison Disease": "Endocrinology",
  "Friedreich's Ataxia": "Neurology",
  "Lambert-Eaton Myasthenic Syndrome": "Neurology",
  "Gitelman Syndrome": "Nephrology",
  "Multiple Endocrine Neoplasia": "Endocrinology",
  "Hypophosphatasia": "Metabolic",
};

function parseAgeRange(ageStr) {
  if (!ageStr) return { ageMin: null, ageMax: null };
  const parts = ageStr.split("-").map(Number);
  return {
    ageMin: parts[0] || 0,
    ageMax: parts[1] || 150,
  };
}

async function seed() {
  await connectDB();
  console.log("Connected to MongoDB. Starting seed...\n");

  let inserted = 0;
  let skipped = 0;

  for (const item of clinicData) {
    // Skip if trialId already exists
    const exists = await Trial.findOne({ trialId: item.trial_id });
    if (exists) {
      console.log(`  ⏭  ${item.trial_id} already exists — skipping`);
      skipped++;
      continue;
    }

    const { ageMin, ageMax } = parseAgeRange(item.eligibility_age);

    const trial = new Trial({
      trialName: `${item.disease} — ${item.drug}`,
      trialId: item.trial_id,
      phase: item.phase,
      category: CATEGORY_MAP[item.disease] || "Rare Disease",
      ageMin,
      ageMax,
      gender: "All",
      diagnoses: [item.disease],
      exclusions: item.excluded_conditions || [],
      requiredConditions: item.required_conditions || [],
      symptoms: item.symptoms || [],
      drug: item.drug,
      hospital: item.hospital,
      location: item.location,
      status: item.status === "Recruiting" ? "Recruiting" : "Active",
      slots: Math.floor(Math.random() * 40) + 10,
      compensation: "As per ICMR guidelines",
      startDate: new Date(),
      description: `Clinical trial for ${item.disease} using ${item.drug} at ${item.hospital}, ${item.location}. ${item.phase}.`,
    });

    await trial.save();
    console.log(`  ✔  ${item.trial_id} — ${item.disease} (${item.drug})`);
    inserted++;
  }

  console.log(`\nDone! Inserted: ${inserted}, Skipped: ${skipped}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
