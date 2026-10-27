
const { GoogleGenerativeAI } = require("@google/generative-ai");

const getGeminiModel = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });
};

const getEquipmentRecommendation = async ({
  activity,
  crop,
  landSizeAcres,
  location,
  additionalDetails,
}) => {
  if (!activity || typeof activity !== "string") {
    throw new Error("Please provide the agricultural activity");
  }

  const prompt = `
You are AgriNext, an agricultural equipment recommendation assistant.

Recommend suitable types of agricultural equipment based on the
farmer's requirements.

Farmer details:
- Activity: ${activity}
- Crop: ${crop || "Not specified"}
- Land size in acres: ${landSizeAcres ?? "Not specified"}
- Location: ${location || "Not specified"}
- Additional details: ${additionalDetails || "None"}

Instructions:
1. Recommend suitable equipment categories and explain why.
2. Ask concise follow-up questions if important details are missing.
3. Do not invent equipment listings, prices, or availability.
4. Explain that actual listings and availability must be checked
   in the AgriNext database.
5. Provide practical, easy-to-understand advice.

Return a helpful response in plain text.
`;

  const model = getGeminiModel();
  const result = await model.generateContent(prompt);

  return result.response.text();
};

module.exports = {
  getEquipmentRecommendation,
};
