const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const EXTRACTION_PROMPT = `You are a medical data extraction system.
Analyze the medical report and extract structured patient medical information.

Return JSON in the following format:

{
  "age": "",
  "gender": "",
  "diagnosis": [],
  "symptoms": [],
  "lab_results": {
    "hba1c": "",
    "blood_pressure": "",
    "cholesterol": ""
  },
  "medications": [],
  "medical_history": [],
  "recommended_specialist": ""
}

If any field is missing, return null.
Return ONLY valid JSON — no markdown, no explanation, no code fences.`;

/**
 * Sends a medical report file to Groq Vision and returns structured extracted data.
 *
 * Supports JPG and PNG via the vision model. PDFs are sent as image.
 *
 * @param {Buffer} fileBuffer   Raw file bytes
 * @param {string} mimeType     MIME type: "application/pdf" | "image/jpeg" | "image/png"
 * @returns {Promise<Object>}   Parsed extraction result matching the schema
 */
async function extractMedicalData(fileBuffer, mimeType) {
  const base64Data = fileBuffer.toString("base64");

  // For PDFs, use image/png as a fallback mime for the vision model
  const imageMime = mimeType === "application/pdf" ? "image/png" : mimeType;

  const completion = await groq.chat.completions.create({
    model: "llama-3.2-90b-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: EXTRACTION_PROMPT },
          {
            type: "image_url",
            image_url: {
              url: `data:${imageMime};base64,${base64Data}`,
            },
          },
        ],
      },
    ],
    temperature: 0.1,
    max_tokens: 1024,
  });

  const rawText = (completion.choices[0]?.message?.content || "").trim();

  // Strip optional markdown code fences
  const jsonText = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error(`Groq returned non-JSON response: ${rawText.slice(0, 200)}`);
  }

  return parsed;
}

module.exports = { extractMedicalData };
