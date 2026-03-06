const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const path = require("path");

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY = process.env.R2_ACCESS_KEY;
const SECRET_KEY = process.env.R2_SECRET_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.R2_PUBLIC_URL; // e.g. https://pub-xxx.r2.dev

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

/**
 * Uploads a file buffer to Cloudflare R2.
 *
 * @param {Buffer} buffer        File contents
 * @param {string} originalName  Original filename (used for extension only)
 * @param {string} mimeType      MIME type of the file
 * @returns {Promise<string>}    Public URL of the uploaded object
 */
async function uploadToR2(buffer, originalName, mimeType) {
  const ext = path.extname(originalName).toLowerCase();
  const uniqueKey = `medical-reports/${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: uniqueKey,
    Body: buffer,
    ContentType: mimeType,
    // Keep objects private; serve through PUBLIC_URL or a signed URL setup
  });

  await r2.send(command);

  const fileUrl = `${PUBLIC_URL.replace(/\/$/, "")}/${uniqueKey}`;
  return fileUrl;
}

module.exports = { uploadToR2 };
