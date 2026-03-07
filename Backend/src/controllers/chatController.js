const Groq = require("groq-sdk");
const Patient = require("../models/Patient");
const ClinicalTrialDetails = require("../models/ClinicalTrialDetails");
const { getMatchedTrials } = require("../services/matchingService");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
 * Body: { message: string, history: [{ role: "user"|"assistant", content: string }] }
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

    // Build messages array for Groq (OpenAI-compatible format)
    const messages = [
      { role: "system", content: SYSTEM_PROMPT + "\n\n" + context },
    ];

    // Append previous conversation turns (limit to last 20)
    if (Array.isArray(history)) {
      const safeHistory = history.slice(-20);
      for (const turn of safeHistory) {
        if ((turn.role === "user" || turn.role === "assistant") && turn.content && turn.content.trim()) {
          messages.push({
            role: turn.role,
            content: String(turn.content).slice(0, 2000),
          });
        }
      }
    }

    // Add current user message
    messages.push({ role: "user", content: message.trim().slice(0, 2000) });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return res.json({ ok: true, reply: responseText });
  } catch (err) {
    console.error("Chat error:", JSON.stringify(err?.error || err?.message || err, null, 2));
    return res.status(502).json({ ok: false, message: "AI service temporarily unavailable. Please try again." });
  }
}

module.exports = { chat };
