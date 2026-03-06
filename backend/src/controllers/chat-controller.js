import { GoogleGenerativeAI } from "@google/generative-ai";

// NOTE: genAI is initialized lazily inside the handler so
// dotenv.config() has already run and GEMINI_API_KEY is available.

// About Orato project (strict system prompt).
const SYSTEM_PROMPT = `You are an AI assistant for Orato, an English language learning app.

STRICT RULES you MUST follow:
1. ONLY answer questions related to:
   - Orato app (features, how to use it, what it does)
   - English language learning (grammar, vocabulary, pronunciation tips, idioms, reading)
   - Speaking and communication skills improvement
   
2. If someone asks about ANYTHING else (politics, coding, cooking, sports, news, etc.), respond EXACTLY with:
   "I'm sorry, I can only help with questions about Orato and English language learning. Please ask me something related to those topics!"

3. If you are NOT SURE about something related to Orato or English learning, respond:
   "I'm not sure about that. I don't have enough information to answer confidently."

4. NEVER make up facts or features about Orato that you are not certain about.

About Orato:
- Orato is an AI-powered English language learning platform
- It helps users improve vocabulary, grammar, reading, and speaking skills
- It has an assessment feature to determine the user's skill level (beginner, intermediate, advanced)
- It offers daily challenges, progress tracking, and personalized learning
- Users can track their learning progress through the dashboard
- The app uses AI technology to personalize the learning experience

Always be friendly, encouraging, and helpful within these boundaries.`;

export const sendChatMessage = async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Message cannot be empty",
            });
        }

        // Check API key at request time (after dotenv has loaded)
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("❌ GEMINI_API_KEY is not set in .env file!");
            return res.status(500).json({
                success: false,
                message: "AI service is not configured. Please contact admin.",
            });
        }

        // Initialize Gemini lazily (ensures dotenv has already run)
        const genAI = new GoogleGenerativeAI(apiKey);

        // Initialize the Gemini model.
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: SYSTEM_PROMPT,
        });

        // Format chat history (Gemini format).
        const formattedHistory = history.map((msg) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        }));

        // Start a chat session.
        const chat = model.startChat({
            history: formattedHistory,
        });

        // Send a message and get a reply.
        const result = await chat.sendMessage(message.trim());
        const reply = result.response.text();

        console.log(`💬 Chat: "${message.substring(0, 50)}..." → replied`);

        res.status(200).json({
            success: true,
            reply,
        });

    } catch (error) {
        // Log detailed error info to diagnose the problem
        console.error("❌ Chat error name:", error?.name);
        console.error("❌ Chat error message:", error?.message);
        console.error("❌ Chat error status:", error?.status);
        console.error("❌ Chat error statusText:", error?.statusText);
        console.error("❌ Full error:", JSON.stringify(error, null, 2));

        let userMessage = "Failed to get AI response. Please try again.";

        if (error?.status === 400) {
            userMessage = "Invalid API key. Please check GEMINI_API_KEY in .env";
        } else if (error?.status === 403) {
            userMessage = "API key not authorized. Please enable Gemini API in Google Cloud Console.";
        } else if (error?.status === 429) {
            userMessage = "Too many requests. Please wait and try again.";
        } else if (error?.message?.includes("fetch")) {
            userMessage = "Cannot reach Google AI servers. Check your internet connection.";
        }

        res.status(500).json({
            success: false,
            message: userMessage,
        });
    }
};
