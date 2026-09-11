/* =========================================
   PAKAI — AI BACKEND
   FEATURE: Real AI Connection
   ========================================= */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();


/* =========================================
   APP CONFIGURATION
   ========================================= */

const app = express();

const PORT = process.env.PORT || 3000;


/* =========================================
   OPENAI CONFIGURATION
   ========================================= */

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {

    console.error(
        "ERROR: OPENAI_API_KEY is not configured."
    );

}


const openai = new OpenAI({
    apiKey: apiKey
});


/* =========================================
   MIDDLEWARE
   ========================================= */

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type"]
    })
);


app.use(
    express.json({
        limit: "2mb"
    })
);


/* =========================================
   BASIC HEALTH CHECK
   FEATURE: Server Status
   ========================================= */

app.get("/", (req, res) => {

    res.status(200).json({

        success: true,

        message: "PakAI server is running.",

        service: "PakAI AI Backend"

    });

});


/* =========================================
   HEALTH API
   FEATURE: Backend Monitoring
   ========================================= */

app.get("/api/health", (req, res) => {

    res.status(200).json({

        success: true,

        server: "online",

        aiConfigured: Boolean(apiKey),

        message: "PakAI backend is healthy."

    });

});


/* =========================================
   AI CHAT
   FEATURE: Real AI Connection
   ========================================= */

app.post("/api/chat", async (req, res) => {

    try {

        /* =========================================
           CHECK API KEY
           ========================================= */

        if (!apiKey) {

            console.error(
                "PakAI Error: OPENAI_API_KEY is missing."
            );

            return res.status(500).json({

                success: false,

                error:
                    "AI backend configuration is incomplete."

            });

        }


        /* =========================================
           GET USER MESSAGE
           ========================================= */

        const message =
            req.body?.message;


        /* =========================================
           VALIDATE MESSAGE
           ========================================= */

        if (
            typeof message !== "string" ||
            !message.trim()
        ) {

            return res.status(400).json({

                success: false,

                error:
                    "Message is required."

            });

        }


        const cleanMessage =
            message.trim();


        /* =========================================
           REQUEST AI RESPONSE
           ========================================= */

        console.log(
            "PakAI request received."
        );


        const response =
            await openai.responses.create({

                model: "gpt-4o-mini",

                input: [

                    {
                        role: "system",

                        content:
                            "You are PakAI, a helpful AI assistant. Answer clearly and naturally. Support Urdu, English, and mixed Urdu-English. Do not claim to have searched the internet unless web search is actually enabled."
                    },

                    {
                        role: "user",

                        content:
                            cleanMessage
                    }

                ]

            });


        /* =========================================
           GET AI ANSWER
           ========================================= */

        const answer =
            response?.output_text;


        /* =========================================
           VALIDATE AI ANSWER
           ========================================= */

        if (
            typeof answer !== "string" ||
            !answer.trim()
        ) {

            console.error(
                "PakAI Error: Empty AI response."
            );

            return res.status(502).json({

                success: false,

                error:
                    "AI نے کوئی جواب واپس نہیں کیا۔"

            });

        }


        /* =========================================
           SEND SUCCESS RESPONSE
           ========================================= */

        console.log(
            "PakAI response generated successfully."
        );


        return res.status(200).json({

            success: true,

            answer:
                answer.trim()

        });


    } catch (error) {

        /* =========================================
           SERVER ERROR LOG
           ========================================= */

        console.error(
            "PakAI AI Error:",
            error
        );


        /* =========================================
           OPENAI ERROR INFORMATION
           ========================================= */

        let errorMessage =
            "AI service سے رابطہ نہیں ہو سکا۔";


        if (
            error?.status
        ) {

            console.error(
                "OpenAI Status:",
                error.status
            );

        }


        if (
            error?.message
        ) {

            console.error(
                "OpenAI Message:",
                error.message
            );

        }


        /* =========================================
           COMMON ERROR TYPES
           ========================================= */

        if (
            error?.status === 401
        ) {

            errorMessage =
                "OpenAI API key درست نہیں ہے۔";

        } else if (
            error?.status === 429
        ) {

            errorMessage =
                "AI service کی request limit پوری ہو گئی ہے۔";

        } else if (
            error?.status === 500 ||
            error?.status === 502 ||
            error?.status === 503
        ) {

            errorMessage =
                "AI service اس وقت دستیاب نہیں ہے۔";

        } else if (
            error?.message
        ) {

            errorMessage =
                error.message;

        }


        /* =========================================
           SEND ERROR TO FRONTEND
           ========================================= */

        return res.status(500).json({

            success: false,

            error:
                errorMessage

        });

    }

});


/* =========================================
   UNKNOWN API ROUTE
   ========================================= */

app.use("/api", (req, res) => {

    res.status(404).json({

        success: false,

        error:
            "API endpoint not found."

    });

});


/* =========================================
   GLOBAL ERROR HANDLER
   ========================================= */

app.use((error, req, res, next) => {

    console.error(
        "PakAI Server Error:",
        error
    );


    res.status(500).json({

        success: false,

        error:
            "Internal server error."

    });

});


/* =========================================
   START SERVER
   ========================================= */

app.listen(
    PORT,
    () => {

        console.log(
            `PakAI server running on port ${PORT}`
        );

    }
);
