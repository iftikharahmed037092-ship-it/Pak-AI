"use strict";

/* =========================================
   PAKAI — CHAT FRONTEND
   FEATURE: Real AI Backend Connection
   ========================================= */


/* =========================================
   BACKEND API
   ========================================= */

const API_URL = "https://pak-ai-bzl1.onrender.com/api/chat";


/* =========================================
   DOM ELEMENTS
   ========================================= */

const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const chatMessages = document.getElementById("chatMessages");
const typingIndicator = document.getElementById("typingIndicator");
const newChatBtn = document.getElementById("newChatBtn");
const clearChatBtn = document.getElementById("clearChatBtn");


/* =========================================
   EVENT LISTENERS
   ========================================= */

if (chatForm) {
    chatForm.addEventListener("submit", handleSend);
}

if (newChatBtn) {
    newChatBtn.addEventListener("click", startNewChat);
}

if (clearChatBtn) {
    clearChatBtn.addEventListener("click", clearChat);
}


/* =========================================
   ADD MESSAGE
   FEATURE: Chat Message Display
   ========================================= */

function addMessage(text, sender) {

    const msgDiv = document.createElement("div");

    msgDiv.className = `message ${sender}`;


    const messageBubble = document.createElement("div");

    messageBubble.className = "message-bubble";


    /*
     * Use textContent instead of innerHTML.
     * This prevents returned/user text from being
     * interpreted as HTML or JavaScript.
     */

    messageBubble.textContent = text;


    msgDiv.appendChild(messageBubble);

    chatMessages.appendChild(msgDiv);


    /* Scroll to latest message */

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


/* =========================================
   SHOW TYPING INDICATOR
   ========================================= */

function showTyping() {

    if (!typingIndicator) return;

    typingIndicator.classList.remove("hidden");

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


/* =========================================
   HIDE TYPING INDICATOR
   ========================================= */

function hideTyping() {

    if (!typingIndicator) return;

    typingIndicator.classList.add("hidden");
}


/* =========================================
   SEND MESSAGE
   FEATURE: Real AI Connection
   ========================================= */

async function handleSend(e) {

    e.preventDefault();


    /* Get user message */

    const message = messageInput.value.trim();


    /* Ignore empty messages */

    if (!message) {
        return;
    }


    /* =========================================
       DISPLAY USER MESSAGE
       ========================================= */

    addMessage(
        message,
        "user"
    );


    /* Clear input */

    messageInput.value = "";


    /* Show typing */

    showTyping();


    try {

        /* =========================================
           SEND REQUEST TO PAKAI BACKEND
           ========================================= */

        const response = await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })
            }
        );


        /* =========================================
           CHECK HTTP RESPONSE
           ========================================= */

        if (!response.ok) {

            let serverError =
                `Server error (${response.status}).`;


            /*
             * Try to read backend JSON error.
             */

            try {

                const errorData =
                    await response.json();


                if (
                    errorData &&
                    typeof errorData.error === "string" &&
                    errorData.error.trim()
                ) {

                    serverError =
                        errorData.error;

                }

            } catch (jsonError) {

                /*
                 * Response was not valid JSON.
                 * Keep the HTTP status error.
                 */

            }


            throw new Error(
                serverError
            );
        }


        /* =========================================
           READ BACKEND RESPONSE
           ========================================= */

        const data =
            await response.json();


        /* =========================================
           CHECK BACKEND SUCCESS
           ========================================= */

        if (
            !data ||
            data.success !== true
        ) {

            throw new Error(
                data?.error ||
                "AI service سے جواب نہیں ملا۔"
            );
        }


        /* =========================================
           CHECK AI ANSWER
           ========================================= */

        if (
            typeof data.answer !== "string" ||
            !data.answer.trim()
        ) {

            throw new Error(
                "AI نے کوئی جواب واپس نہیں کیا۔"
            );
        }


        /* =========================================
           DISPLAY AI RESPONSE
           ========================================= */

        addMessage(
            data.answer,
            "bot"
        );


    } catch (error) {

        /* =========================================
           LOG REAL ERROR
           ========================================= */

        console.error(
            "PakAI Chat Error:",
            error
        );


        /* =========================================
           ERROR MESSAGE
           ========================================= */

        let errorMessage =
            "معذرت، اس وقت AI سے رابطہ نہیں ہو سکا۔";


        if (
            error &&
            typeof error.message === "string" &&
            error.message.trim()
        ) {

            errorMessage =
                `Error: ${error.message}`;

        }


        /* Display actual error */

        addMessage(
            errorMessage,
            "bot"
        );


    } finally {

        /* =========================================
           ALWAYS HIDE TYPING INDICATOR
           ========================================= */

        hideTyping();

    }

}


/* =========================================
   NEW CHAT
   FEATURE: Start New Conversation
   ========================================= */

function startNewChat() {

    chatMessages.innerHTML = `
        <section class="welcome-message">
            <div class="welcome-logo">P</div>

            <h2>Welcome! 👋</h2>

            <p>
                I'm PakAI. Ask me anything and I'll help you out.
            </p>
        </section>
    `;

}


/* =========================================
   CLEAR CHAT
   FEATURE: Clear Conversation
   ========================================= */

function clearChat() {

    if (
        confirm(
            "Are you sure you want to clear the chat?"
        )
    ) {

        startNewChat();

    }

}


/* =========================================
   ENTER KEY
   FEATURE: Send Message With Enter
   ========================================= */

if (messageInput) {

    messageInput.addEventListener(
        "keydown",
        (e) => {

            /*
             * Enter = Send
             * Shift + Enter = New line
             */

            if (
                e.key === "Enter" &&
                !e.shiftKey
            ) {

                e.preventDefault();

                /*
                 * Use form submit when available.
                 */

                if (chatForm) {

                    chatForm.requestSubmit();

                } else {

                    handleSend(e);

                }

            }

        }
    );

}
