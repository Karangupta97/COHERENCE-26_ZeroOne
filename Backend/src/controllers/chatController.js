const { GoogleGenerativeAI } = require("@google/generative-ai");
const Patient = require("../models/Patient");
const ClinicalTrialDetails = require("../models/ClinicalTrialDetails");
const { getMatchedTrials } = require("../services/matchingService");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are CuraMatch AI, a helpful and compassionate medical assistant for a clinical trial matching platform called CuraMatchAI.

Your role:
- Help patients understand clinical trials, their eligibility, and the enrollment process.
- Answer questions about the patient's matched trials, medical profile, and application status.
- Provide clear, empathetic, and medically accurate (but non-diagnostic) guidance.
- You do NOT diagnose, prescribe, or provide medical advice. Always recommend consulting their doctor for medical decisions.
- Keep responses concise (2-4 short paragraphs max) and use markdown bold (**text**) for emphasis.
- Be warm, professional, and encouraging.

If the patient asks about something unrelated to clinical trials or health, politely redirect them.`;

function buildPatientContext(patient, clinicalDetails, matches) {
  const parts = ["=== PATIENT CONTEXT ==="];

  if (patient) {
    parts.push(`Name: ${patient.name || "N/A"}`);
    parts.push(`Age: ${patient.age || "N/A"}, Gender: ${patient.gender || "N/A"}`);
    parts.push(`Location: ${patient.location || "N/A"}`);
    parts.push(`Diagnosis: ${patient.diagnosis || "N/A"}`);
    if (patient.medicalHistory?.length) parts.push(`Medical History: ${patient.medicalHistory.join(", ")}`);
    if (patient.medications) parts.push(`Medications: ${patient.medications}`);
  }

  if (clinicalDetails) {
    if (clinicalDetails.primaryDiagnosis) parts.push(`Primary Diagnosis: ${clinicalDetails.primaryDiagnosis}`);
    if (clinicalDetails.secondaryDiagnoses?.length) parts.push(`Secondary Diagnoses: ${clinicalDetails.secondaryDiagnoses.join(", ")}`);
    if (clinicalDetails.allergies?.length) parts.push(`Allergies: ${clinicalDetails.allergies.join(", ")}`);
    if (clinicalDetails.labValues?.hba1c) parts.push(`HbA1c: ${clinicalDetails.labValues.hba1c}`);
    if (clinicalDetails.smokingStatus) parts.push(`Smoking: ${clinicalDetails.smokingStatus}`);
  }

  if (matches?.length) {
    parts.push(`\n=== TOP MATCHED TRIALS (${matches.length} total) ===`);
    matches.slice(0, 5).forEach((m, i) => {
      parts.push(`${i + 1}. ${m.trialName} (${m.trialCode}) — ${m.score}% match, ${m.eligible ? "Eligible" : "Not Eligible"}, Phase ${m.phase}, Location: ${m.location}`);
    });
  }

  return parts.join("\n");
}

/**
 * POST /api/chat
 * Body: { message: string, history: [{ role: "user"|"model", parts: [{ text }] }] }
 */
async function chat(req, res, next) {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ ok: false, message: "Message is required" });
    }

    // Load patient context
    const patient = req.user;
    const clinicalDetails = await ClinicalTrialDetails.findOne({ patientId: patient._id })
      .sort({ createdAt: -1 })
      .lean();

    let matches = [];
    try {
      matches = await getMatchedTrials(patient._id);
    } catch {
      // Non-critical — continue without matches
    }

    const context = buildPatientContext(patient, clinicalDetails, matches);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Build chat history
    const chatHistory = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\n" + context }] },
      { role: "model", parts: [{ text: "Understood. I'm CuraMatch AI, ready to help this patient with clinical trial questions using their profile context." }] },
    ];

    // Append previous conversation turns (limit to last 20 to stay within context)
    if (Array.isArray(history)) {
      const safeHistory = history.slice(-20);
      for (const turn of safeHistory) {
        if (turn.role === "user" || turn.role === "model") {
          chatHistory.push({
            role: turn.role,
            parts: [{ text: String(turn.parts?.[0]?.text || "").slice(0, 2000) }],
          });
        }
      }
    }

    const chatSession = model.startChat({ history: chatHistory });
    const result = await chatSession.sendMessage(message.trim().slice(0, 2000));
    const responseText = result.response.text();

    return res.json({ ok: true, reply: responseText });
  } catch (err) {
    next(err);
  }
}

module.exports = { chat };
