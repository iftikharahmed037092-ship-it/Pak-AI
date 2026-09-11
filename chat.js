/* =========================================
   PAKAI — BASIC CHAT SYSTEM
   FEATURE: Chat Interaction
   ========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const chatForm = document.getElementById("chatForm");
    const messageInput = document.getElementById("messageInput");
    const chatMessages = document.getElementById("chatMessages");
    const typingIndicator = document.getElementById("typingIndicator");

    const newChatBtn = document.getElementById("newChatBtn");
    const clearChatBtn = document.getElementById("clearChatBtn");
    const attachBtn = document.getElementById("attachBtn");


    /* =========================================
       ADD MESSAGE
       ========================================= */

    function addMessage(type, text) {

        const message = document.createElement("div");

        message.className = `message ${type}`;

        const content = document.createElement("div");

        content.className = "message-content";

        content.textContent = text;

        message.appendChild(content);

        chatMessages.appendChild(message);

        scrollToBottom();
    }


    /* =========================================
       SCROLL TO BOTTOM
       ========================================= */

    function scrollToBottom() {

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    }


    /* =========================================
       TYPING INDICATOR
       ========================================= */

    function showTyping() {
        typingIndicator.classList.remove("hidden");
    }

    function hideTyping() {
        typingIndicator.classList.add("hidden");
    }


    /* =========================================
       DEMO AI RESPONSE
       ========================================= */

    function getDemoResponse(message) {

        const text = message.toLowerCase();

        if (text.includes("html")) {
            return "HTML ویب پیج کا بنیادی structure بنانے کے لیے استعمال ہوتی ہے۔";
        }

        if (text.includes("css")) {
            return "CSS ویب سائٹ کے design، colors، spacing اور layout کو control کرتی ہے۔";
        }

        if (
            text.includes("السلام") ||
            text.includes("hello") ||
            text.includes("hi")
        ) {
            return "وعلیکم السلام 👋 میں PakAI ہوں۔ آپ مجھ سے کوئی بھی سوال پوچھ سکتے ہیں۔";
        }

        return "میں نے آپ کا سوال وصول کر لیا ہے۔ ابھی یہ PakAI کا بنیادی Demo Chat ہے۔ اگلے مرحلے میں ہم اسے حقیقی AI سے connect کریں گے۔";
    }


    /* =========================================
       SEND MESSAGE
       ========================================= */

    chatForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const message = messageInput.value.trim();

        if (!message) {
            return;
        }

        addMessage("user", message);

        messageInput.value = "";

        messageInput.style.height = "auto";

        showTyping();

        setTimeout(() => {

            hideTyping();

            const response = getDemoResponse(message);

            addMessage("ai", response);

        }, 700);
    });


    /* =========================================
       AUTO RESIZE TEXTAREA
       ========================================= */

    messageInput.addEventListener("input", () => {

        messageInput.style.height = "auto";

        messageInput.style.height =
            Math.min(messageInput.scrollHeight, 150) + "px";
    });


    /* =========================================
       ENTER TO SEND
       ========================================= */

    messageInput.addEventListener("keydown", (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            chatForm.requestSubmit();
        }
    });


    /* =========================================
       NEW CHAT
       ========================================= */

    newChatBtn.addEventListener("click", () => {

        const confirmed = confirm(
            "نئی Chat شروع کریں؟"
        );

        if (!confirmed) {
            return;
        }

        resetChat();
    });


    /* =========================================
       CLEAR CHAT
       ========================================= */

    clearChatBtn.addEventListener("click", () => {

        const confirmed = confirm(
            "کیا آپ تمام messages صاف کرنا چاہتے ہیں؟"
        );

        if (!confirmed) {
            return;
        }

        resetChat();
    });


    /* =========================================
       RESET CHAT
       ========================================= */

    function resetChat() {

        chatMessages.innerHTML = `
            <section class="welcome-message">

                <div class="welcome-logo">
                    P
                </div>

                <h2>السلام علیکم 👋</h2>

                <p>
                    میں PakAI ہوں۔ آپ مجھ سے کوئی بھی سوال پوچھ سکتے ہیں۔
                </p>

            </section>
        `;

        hideTyping();

        messageInput.value = "";

        messageInput.style.height = "auto";
    }


    /* =========================================
       ATTACH BUTTON
       ========================================= */

    attachBtn.addEventListener("click", () => {

        alert(
            "File attachment feature اگلے مرحلے میں شامل کیا جائے گا۔"
        );
    });

});



