const Patient = require("./Patient");
const Doctor  = require("./Doctor");
const Clinic  = require("./Clinic");

const ROLES = ["patient", "doctor", "clinic"];

const modelMap = {
  patient: Patient,
  doctor:  Doctor,
  clinic:  Clinic,
};

/**
 * Returns the Mongoose model for a given role string.
 * Throws if the role is unrecognised.
 */
function getModel(role) {
  const Model = modelMap[role];
  if (!Model) throw new Error(`Unknown role: ${role}`);
  return Model;
}

/**
 * Searches all three collections for a document with the given email.
 * Returns the first match (with password selected) or null.
 * Used during login when the role is not known up-front.
 */
async function findByEmail(email, selectPassword = false) {
  const projection = selectPassword ? "+password" : "-password";
  const [patient, doctor, clinic] = await Promise.all([
    Patient.findOne({ email }).select(projection),
    Doctor.findOne({ email }).select(projection),
    Clinic.findOne({ email }).select(projection),
  ]);
  return patient || doctor || clinic || null;
}

/**
 * Checks if an email already exists in ANY of the three collections.
 * Used during signup to enforce global email uniqueness.
 */
async function emailExists(email) {
  const [p, d, c] = await Promise.all([
    Patient.exists({ email }),
    Doctor.exists({ email }),
    Clinic.exists({ email }),
  ]);
  return !!(p || d || c);
}

module.exports = { modelMap, getModel, findByEmail, emailExists, ROLES };
