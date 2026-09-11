/* =========================================
   PAKAI — AI BACKEND
   FEATURE: Real AI Connection
   ========================================= */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


/* =========================================
   MIDDLEWARE
   ========================================= */

app.use(cors());

app.use(express.json({
    limit: "2mb"
}));


/* =========================================
   BASIC HEALTH CHECK
   ========================================= */

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "PakAI server is running."
    });

});


/* =========================================
   AI CHAT
   ========================================= */

app.post("/api/chat", async (req, res) => {

    try {

        const message = req.body?.message;

        if (
            typeof message !== "string" ||
            !message.trim()
        ) {

            return res.status(400).json({
                success: false,
                error: "Message is required."
            });

        }


        const response = await openai.responses.create({

            model: "gpt-5.6-luna",

            input: [
                {
                    role: "system",
                    content:
                        "You are PakAI, a helpful AI assistant. Answer clearly and naturally. Support Urdu, English, and mixed Urdu-English. Do not claim to have searched the internet unless web search is actually enabled."
                },
                {
                    role: "user",
                    content: message.trim()
                }
            ]

        });


        const answer =
            response.output_text ||
            "معذرت، اس وقت مجھے جواب نہیں مل سکا۔";


        return res.json({

            success: true,

            answer: answer

        });

    } catch (error) {

        console.error(
            "PakAI AI Error:",
            error
        );


        return res.status(500).json({

            success: false,

            error:
                "AI service سے رابطہ نہیں ہو سکا۔"

        });

    }

});


/* =========================================
   START SERVER
   ========================================= */

app.listen(PORT, () => {

    console.log(
        `PakAI server running on port ${PORT}`
    );

});
