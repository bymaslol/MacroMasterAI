// this is a backlog for chat history
let history = [];

// i change this depending if im testing or not
// let api_url = 'http://127.0.0.1:5000/v1/chat/completions';

const cloudflare_url = 'https://sync-diamonds-morrison-assist.trycloudflare.com';
const api_url = `${cloudflare_url}/v1/chat/completions`;
// user context info
const userHeight = "5'9";
const userGender = "Male";
const userPhase = "cutting";
const userWeight = "180";
const userAllergies = "peanuts, soy";
const userDailyGoal = "1800";
const userCurrentCal = "600";
const userBodyFat = "22%";

// this is the AI context string for the user
const userContext = `This is the health context of the user, you don't have to respond to this message, just acknowledge it for future chats: The user is ${userGender}, ${userHeight} tall, ${userWeight} pounds and is ${userPhase}, with the following allergies: ${userAllergies}. User has eaten ${userCurrentCal} calories today, out of his goal of ${userDailyGoal}. The user's body fat percentage is ${userBodyFat}. Make sure the user stays on track with their goals, and doesn't go over or under their goal by too much! Try to make most answers brief, but informative and professional. Also, make sure you watch out and make sure the user doesn't consume or get suggested anything they are allergic to, if you see them try to use or consume an ingredient they are allergic to, warn them and advise against it, and suggest a substitute.`;
history.push({"role": "user", "content": userContext});

function updateChatBox(message, from) {
    const chatBox = document.getElementById('chat-box');
    const messageContainer = document.createElement('div');
    const senderName = document.createElement('div');
    const messageContent = document.createElement('div');

    senderName.textContent = from.toUpperCase();
    senderName.className = 'sender-name';

    messageContent.textContent = message;
    messageContent.className = 'message-content';

    if (from === 'user') {
        messageContainer.className = 'user-message-container';
    } else {
        messageContainer.className = 'assistant-message-container';
    }

    messageContainer.appendChild(senderName);
    messageContainer.appendChild(messageContent);
    chatBox.appendChild(messageContainer);

    setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 0);
}


function sendMessage() {
    const userInput = document.getElementById('user-input');
    const userMessage = userInput.value;
    userInput.value = ''; 
    if (userMessage.trim() === '') return; // preventing empty msgs
    updateChatBox(userMessage, 'user');
    showLoading(true);
    
    history.push({"role": "user", "content": userMessage});
    
    fetch(api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "mode": "chat",
            "character": "MacroMaster",
            "messages": history
        }),
    }).then(response => response.json())
    .then(data => {
        const assistantMessage = data.choices[0]['message']['content'];
        updateChatBox(assistantMessage, 'MacroMaster');
        history.push({"role": "assistant", "content": assistantMessage});
        showLoading(false);
    }).catch(error => {
        console.error('Error:', error);
        showLoading(false);
    });
}

function showLoading(display) {
    const loader = document.getElementById('loading');
    loader.style.display = display ? 'block' : 'none';
}


document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
