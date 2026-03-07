const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const result = await model.generateContent("Say hello");
    const response = await result.response;

    console.log("Gemini Response:");
    console.log(response.text());

  } catch (error) {
    console.error("Gemini Error:", error.message);
  }
}

testGemini();