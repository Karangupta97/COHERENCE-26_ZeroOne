const ROLES = Object.freeze({
  PATIENT: "patient",
  DOCTOR: "doctor",
  CLINIC: "clinic",
});

const ALL_ROLES = Object.values(ROLES);

module.exports = { ROLES, ALL_ROLES };
