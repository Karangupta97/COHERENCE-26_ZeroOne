// ============================================================
//  TrialMatchAI — Extended Mock Data for Doctor Portal
// ============================================================

import { PATIENTS, TRIALS } from '../../../theme';

// Re-export the shared data
export { PATIENTS, TRIALS };

// Trial criteria mapped by trial id
export const TRIAL_CRITERIA = {
  "T-001": [
    { label: "Age 40–65", pass: true },
    { label: "Type 2 Diabetes", pass: true },
    { label: "HbA1c 7.5–10%", pass: true },
    { label: "Not on insulin", pass: true },
    { label: "No kidney disease", pass: true },
    { label: "No ACE inhibitors", pass: false },
  ],
  "T-002": [
    { label: "Age 40–70", pass: true },
    { label: "Hypertension Stage 1–2", pass: true },
    { label: "Diabetes comorbidity", pass: true },
    { label: "No recent MI", pass: true },
    { label: "eGFR > 45", pass: null },
    { label: "No ACE inhibitors", pass: false },
  ],
  "T-003": [
    { label: "Age 35–65", pass: true },
    { label: "BMI 25–35", pass: true },
    { label: "Metabolic syndrome", pass: true },
    { label: "HbA1c < 9%", pass: false },
    { label: "No bariatric surgery", pass: true },
    { label: "Stable weight 3 months", pass: null },
  ],
  "T-004": [
    { label: "Age 30–60", pass: true },
    { label: "Neurological condition", pass: null },
    { label: "No seizure history", pass: true },
    { label: "Stable medications", pass: true },
    { label: "No pregnancy", pass: true },
    { label: "MRI compatible", pass: null },
  ],
  "T-005": [
    { label: "Age 35–70", pass: true },
    { label: "Stage 2+ Cancer", pass: true },
    { label: "ECOG score 0–2", pass: true },
    { label: "No prior immunotherapy", pass: null },
    { label: "Adequate organ function", pass: true },
    { label: "No autoimmune disease", pass: true },
  ],
};

// Patient → trial match mapping
export const PATIENT_TRIAL_MATCHES = {
  "ANON-7F3A2B1C": ["T-001", "T-003", "T-002"],
  "ANON-4D8E9C2F": ["T-002"],
  "ANON-1B5C8D3E": ["T-005", "T-004"],
  "ANON-6A2F4E7B": ["T-001", "T-003"],
  "ANON-9C1D3F8A": ["T-001", "T-002", "T-003", "T-004"],
  "ANON-2E7B5A4D": ["T-002"],
};

// Match scores per patient-trial pair
export const MATCH_SCORES = {
  "ANON-7F3A2B1C": { "T-001": 94, "T-003": 73, "T-002": 81 },
  "ANON-4D8E9C2F": { "T-002": 81 },
  "ANON-1B5C8D3E": { "T-005": 88, "T-004": 68 },
  "ANON-6A2F4E7B": { "T-001": 91, "T-003": 76 },
  "ANON-9C1D3F8A": { "T-001": 89, "T-002": 85, "T-003": 78, "T-004": 65 },
  "ANON-2E7B5A4D": { "T-002": 72 },
};

// Mock chat data
export const CHAT_MESSAGES = {
  "ANON-7F3A2B1C": [
    { sender: "patient", text: "Should I join the GLYCO-ADVANCE trial? I'm a little nervous", time: "10:24 AM" },
    { sender: "doctor", text: "I've reviewed your profile. It's a strong match at 94%. The trial is Phase III — well tested.", time: "10:28 AM" },
    { sender: "patient", text: "How many visits would I need?", time: "10:30 AM" },
    { sender: "doctor", text: "Around 6 visits over 3 months. Compensation is ₹5,000 per visit. I'll approve your referral now.", time: "10:33 AM" },
  ],
  "ANON-4D8E9C2F": [
    { sender: "patient", text: "Doctor, I saw there's a cardiology trial available. Is it suitable for me?", time: "11:05 AM" },
    { sender: "doctor", text: "Yes, CARDIO-PROTECT is an 81% match. It's Phase II by AstraZeneca.", time: "11:08 AM" },
    { sender: "patient", text: "What are the potential side effects?", time: "11:12 AM" },
  ],
  "ANON-1B5C8D3E": [
    { sender: "patient", text: "I'm interested in the ONCO-TARGET trial. Can you tell me more?", time: "09:15 AM" },
    { sender: "doctor", text: "ONCO-TARGET is a Phase III trial at Tata Memorial. It's an 88% match for your profile.", time: "09:20 AM" },
  ],
  "ANON-6A2F4E7B": [
    { sender: "patient", text: "Any new diabetes trials available?", time: "02:40 PM" },
    { sender: "doctor", text: "GLYCO-ADVANCE is a 91% match for you. Shall I walk you through the details?", time: "02:45 PM" },
  ],
  "ANON-9C1D3F8A": [
    { sender: "patient", text: "I have both hypertension and diabetes. Are there combined trials?", time: "03:20 PM" },
    { sender: "doctor", text: "I've found 4 matches for your profile. The best match is GLYCO-ADVANCE at 89%.", time: "03:25 PM" },
    { sender: "patient", text: "That sounds promising. What's the process?", time: "03:28 PM" },
  ],
  "ANON-2E7B5A4D": [
    { sender: "patient", text: "Doctor, is there anything for kidney disease?", time: "04:10 PM" },
    { sender: "doctor", text: "We have one match currently — CARDIO-PROTECT at 72%. I'll look for more options.", time: "04:15 PM" },
  ],
};

// Trial match alerts
export const ALERTS = [
  {
    id: "A-001",
    trialId: "T-001",
    trialName: "GLYCO-ADVANCE",
    phase: "Phase III",
    sponsor: "Novo Nordisk",
    patientId: "ANON-7F3A2B1C",
    score: 94,
    urgency: "urgent",
    closesIn: 8,
    slots: 12,
  },
  {
    id: "A-002",
    trialId: "T-005",
    trialName: "ONCO-TARGET",
    phase: "Phase III",
    sponsor: "Tata Memorial",
    patientId: "ANON-1B5C8D3E",
    score: 88,
    urgency: "urgent",
    closesIn: 5,
    slots: 3,
  },
  {
    id: "A-003",
    trialId: "T-002",
    trialName: "CARDIO-PROTECT",
    phase: "Phase II",
    sponsor: "AstraZeneca",
    patientId: "ANON-9C1D3F8A",
    score: 85,
    urgency: "normal",
    closesIn: 14,
    slots: 6,
  },
  {
    id: "A-004",
    trialId: "T-003",
    trialName: "META-RESET",
    phase: "Phase II",
    sponsor: "Sun Pharma",
    patientId: "ANON-6A2F4E7B",
    score: 76,
    urgency: "normal",
    closesIn: 21,
    slots: 20,
  },
  {
    id: "A-005",
    trialId: "T-004",
    trialName: "NEURO-SHIELD",
    phase: "Phase I",
    sponsor: "Cipla Research",
    patientId: "ANON-9C1D3F8A",
    score: 65,
    urgency: "urgent",
    closesIn: 3,
    slots: 8,
  },
];

// Rejection reasons
export const REJECTION_REASONS = [
  "Patient preference",
  "Medical concern",
  "Poor timing",
  "Other",
];
