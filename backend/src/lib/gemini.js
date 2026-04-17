const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('⚠️  GEMINI_API_KEY not found. AI Chat will not work.');
}

const genAI = new GoogleGenerativeAI(apiKey || 'placeholder-key');

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-pro',
  generationConfig: {
    temperature: 0.7,
    topP: 0.9,
    maxOutputTokens: 2048,
  },
});

module.exports = { model };
