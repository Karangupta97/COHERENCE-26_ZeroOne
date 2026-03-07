const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");

/**
 * Extract text from an image buffer using Tesseract.js OCR.
 *
 * @param {Buffer} imageBuffer  Raw image bytes (JPG/PNG)
 * @returns {Promise<string>}   Extracted text
 */
async function extractTextFromImage(imageBuffer) {
  const {
    data: { text },
  } = await Tesseract.recognize(imageBuffer, "eng", {
    logger: () => {},          // silence progress logs
  });
  return text.trim();
}

/**
 * Extract text from a PDF buffer using pdf-parse.
 *
 * @param {Buffer} pdfBuffer  Raw PDF bytes
 * @returns {Promise<string>} Extracted text
 */
async function extractTextFromPDF(pdfBuffer) {
  const data = await pdfParse(pdfBuffer);
  return (data.text || "").trim();
}

/**
 * Unified OCR entry-point: picks the right strategy based on MIME type.
 *
 * @param {Buffer} fileBuffer  Raw file bytes
 * @param {string} mimeType    "application/pdf" | "image/jpeg" | "image/png"
 * @returns {Promise<string>}  Extracted plain text
 */
async function extractTextFromFile(fileBuffer, mimeType) {
  if (mimeType === "application/pdf") {
    return extractTextFromPDF(fileBuffer);
  }
  // image/jpeg | image/png → Tesseract OCR
  return extractTextFromImage(fileBuffer);
}

module.exports = { extractTextFromFile, extractTextFromImage, extractTextFromPDF };
