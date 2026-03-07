const Groq = require("groq-sdk");
const { extractTextFromFile } = require("./ocrExtract");

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

const OCR_TEXT_PROMPT = `You are a medical data extraction system.
Below is the OCR-extracted text from a medical report. Analyze this text and extract structured patient medical information.

--- BEGIN OCR TEXT ---
{OCR_TEXT}
--- END OCR TEXT ---

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

// Minimum characters of OCR text to consider it useful
const MIN_OCR_TEXT_LENGTH = 30;

/**
 * Parse the Groq response text into a JSON object.
 */
function parseGroqResponse(rawText) {
  const jsonText = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    return JSON.parse(jsonText);
  } catch {
    throw new Error(`Groq returned non-JSON response: ${rawText.slice(0, 200)}`);
  }
}

/**
 * Extract medical data from OCR text using Groq LLM (text-only, no vision).
 *
 * @param {string} ocrText  Plain text extracted via OCR
 * @returns {Promise<Object>} Parsed extraction result
 */
async function extractFromOCRText(ocrText) {
  const prompt = OCR_TEXT_PROMPT.replace("{OCR_TEXT}", ocrText);

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
    max_tokens: 1024,
  });

  const rawText = (completion.choices[0]?.message?.content || "").trim();
  return parseGroqResponse(rawText);
}

/**
 * Extract medical data using the vision model (image-based).
 *
 * @param {Buffer} fileBuffer   Raw file bytes
 * @param {string} mimeType     MIME type
 * @returns {Promise<Object>}   Parsed extraction result
 */
async function extractFromVision(fileBuffer, mimeType) {
  const base64Data = fileBuffer.toString("base64");
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
  return parseGroqResponse(rawText);
}

/**
 * Main extraction pipeline:
 *  1. Run OCR to get raw text from the file.
 *  2. If OCR yields enough text, send it to a fast text LLM for structured extraction.
 *  3. Otherwise, fall back to the vision model.
 *
 * @param {Buffer} fileBuffer   Raw file bytes
 * @param {string} mimeType     "application/pdf" | "image/jpeg" | "image/png"
 * @returns {Promise<{ extractedData: Object, ocrText: string }>}
 */
async function extractMedicalData(fileBuffer, mimeType) {
  // Step 1 — OCR text extraction
  let ocrText = "";
  try {
    ocrText = await extractTextFromFile(fileBuffer, mimeType);
  } catch (ocrErr) {
    console.warn("[OCR Warning] Text extraction failed, falling back to vision:", ocrErr.message);
  }

  // Step 2 — Choose extraction strategy
  let extractedData;
  if (ocrText.length >= MIN_OCR_TEXT_LENGTH) {
    // OCR produced usable text → fast text-based analysis
    extractedData = await extractFromOCRText(ocrText);
  } else {
    // OCR text too short (scanned image with little text, or OCR failed) → vision model
    extractedData = await extractFromVision(fileBuffer, mimeType);
  }

  return { extractedData, ocrText };
}

module.exports = { extractMedicalData, extractFromOCRText, extractFromVision };
