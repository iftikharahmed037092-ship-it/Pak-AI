"use strict";
const API_URL = "https://pak-ai-bzl1.onrender.com/chat";

const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');
const typingIndicator = document.getElementById('typingIndicator');
const newChatBtn = document.getElementById('newChatBtn');
const clearChatBtn = document.getElementById('clearChatBtn');

chatForm.addEventListener('submit', handleSend);
newChatBtn.addEventListener('click', startNewChat);
clearChatBtn.addEventListener('click', clearChat);

function addMessage(text, sender){
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.innerHTML = `<div class="message-bubble">${text}</div>`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleSend(e){
    e.preventDefault();
    const message = messageInput.value.trim();
    if(!message) return;
    
    addMessage(message, 'user');
    messageInput.value = '';
    typingIndicator.classList.remove('hidden');
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try{
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message: message})
        });
        
        const data = await res.json();
        typingIndicator.classList.add('hidden');
        addMessage(data.reply, 'bot');
        
    } catch(err){
        typingIndicator.classList.add('hidden');
        addMessage("Error: Server is sleeping. Please try again in 30 seconds", 'bot');
    }
}

function startNewChat(){
    chatMessages.innerHTML = `
        <section class="welcome-message">
            <div class="welcome-logo">P</div>
            <h2>Welcome! 👋</h2>
            <p>I'm PakAI. Ask me anything and I'll help you out.</p>
        </section>
    `;
}

function clearChat(){
    if(confirm("Are you sure you want to clear the chat?")){
        startNewChat();
    }
}

messageInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && !e.shiftKey){
        e.preventDefault();
        handleSend(e);
    }
});
