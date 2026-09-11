import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// =========================================
// PAKAI — GROQ AI CONFIG
// =========================================

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// =========================================
// MIDDLEWARE
// =========================================

app.use(cors());

app.use(
    express.json({
        limit: "2mb"
    })
);

// =========================================
// HEALTH CHECK
// =========================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "PakAI server is running."
    });
});

// =========================================
// CHAT API
// =========================================

app.post("/api/chat", async (req, res) => {
    try {
        const message = req.body?.message;

        // Validate message
        if (
            typeof message !== "string" ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                error: "Message is required."
            });
        }

        // =========================================
        // GROQ AI REQUEST
        // =========================================

        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",

            messages: [
                {
                    role: "system",
                    content:
                        "You are PakAI, a helpful AI assistant made for users in Pakistan. Answer clearly, naturally, and accurately. Support Urdu, English, and mixed Urdu-English. If the user asks in Urdu, answer in Urdu. If the user asks in English, answer in English. Do not unnecessarily mention that you are an AI."
                },
                {
                    role: "user",
                    content: message.trim()
                }
            ]
        });

        // =========================================
        // GET AI ANSWER
        // =========================================

        const answer =
            response?.choices?.[0]?.message?.content;

        if (
            typeof answer !== "string" ||
            !answer.trim()
        ) {
            return res.status(500).json({
                success: false,
                error: "AI نے کوئی جواب واپس نہیں کیا۔"
            });
        }

        // =========================================
        // SEND RESPONSE TO FRONTEND
        // =========================================

        return res.json({
            success: true,
            answer: answer.trim()
        });

    } catch (error) {

        console.error("PakAI AI Error:", error);

        // =========================================
        // GROQ RATE LIMIT
        // =========================================

        if (error?.status === 429) {
            return res.status(429).json({
                success: false,
                error:
                    "AI service کی request limit پوری ہو گئی ہے۔ کچھ دیر بعد دوبارہ کوشش کریں۔"
            });
        }

        // =========================================
        // AUTHENTICATION ERROR
        // =========================================

        if (
            error?.status === 401 ||
            error?.status === 403
        ) {
            return res.status(500).json({
                success: false,
                error:
                    "AI service کی API configuration درست نہیں ہے۔"
            });
        }

        // =========================================
        // GENERAL ERROR
        // =========================================

        return res.status(500).json({
            success: false,
            error:
                "AI service سے رابطہ نہیں ہو سکا۔"
        });
    }
});

// =========================================
// START SERVER
// =========================================

app.listen(PORT, () => {
    console.log(
        `PakAI server running on port ${PORT}`
    );
});
