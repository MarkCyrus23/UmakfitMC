const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.getGeminiRecommendation = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Must be logged in.");
    }

    const { testName, result, score, timerValue } = data;

    // Gamit ang functions.config() — na-set na natin kanina
    const genAI = new GoogleGenerativeAI(functions.config().gemini.key);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a professional fitness coach. A student completed a ${testName} test.
- Result: ${result}
- Score: ${score}/100
- Timer: ${timerValue || 'N/A'}

Provide a 2-3 sentence personalized recommendation to help them improve. Be encouraging. No markdown.`;

    const geminiResult = await model.generateContent(prompt);
    return { recommendation: geminiResult.response.text() };
});