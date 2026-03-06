const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
 * Sends a medical report file to Gemini and returns structured extracted data.
 *
 * Supports PDF, JPG, and PNG via the inline-data parts API.
 *
 * @param {Buffer} fileBuffer   Raw file bytes
 * @param {string} mimeType     MIME type: "application/pdf" | "image/jpeg" | "image/png"
 * @returns {Promise<Object>}   Parsed extraction result matching the schema
 */
async function extractMedicalData(fileBuffer, mimeType) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const filePart = {
    inlineData: {
      data: fileBuffer.toString("base64"),
      mimeType,
    },
  };

  const result = await model.generateContent([EXTRACTION_PROMPT, filePart]);
  const rawText = result.response.text().trim();

  // Strip optional markdown code fences that Gemini sometimes adds
  const jsonText = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error(`Gemini returned non-JSON response: ${rawText.slice(0, 200)}`);
  }

  return parsed;
}

module.exports = { extractMedicalData };
