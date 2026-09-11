/* =========================================
   PAKAI — BASIC CHAT SYSTEM
   FEATURE: Global App + API Connection
   ========================================= */

"use strict";

// RENDER BACKEND URL
const API_URL = "https://pak-ai-bzl1.onrender.com/chat";

document.addEventListener("DOMContentLoaded", () => {
    console.log("PakAI initialized.");
    
    // صرف chat.html پر ہی یہ چلے گا
    const chatBox = document.getElementById('chat');
    const input = document.getElementById('q');
    const sendBtn = document.getElementById('sendBtn');
    
    if(sendBtn){
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if(input){
        input.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') sendMessage();
        });
    }
});

async function sendMessage(){
    const input = document.getElementById('q');
    const chatBox = document.getElementById('chat');
    let q = input.value.trim();
    if(!q) return;
    
    // User message دکھاؤ
    chat
