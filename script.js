const MASTER_KEY = "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"; 
let currentModel = "llama-3.3-70b-versatile";
let currentLang = "cs";

const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuBtn = document.getElementById('menuBtn');

menuBtn.onclick = () => { 
    sidebar.classList.add('open'); 
    overlay.style.display = 'block'; 
};

overlay.onclick = () => { 
    sidebar.classList.remove('open'); 
    overlay.style.display = 'none'; 
};

document.getElementById('langCS').onclick = () => switchLang('cs');
document.getElementById('langEN').onclick = () => switchLang('en');

function switchLang(l) {
    currentLang = l;
    document.getElementById('langCS').classList.toggle('active', l === 'cs');
    document.getElementById('langEN').classList.toggle('active', l === 'en');
    
    // Kompletní překlady včetně Sidebaru
    document.getElementById('mainTitle').innerText = l === 'cs' ? "Co dnes vytvoříme?" : "What shall we create?";
    document.getElementById('userInput').placeholder = l === 'cs' ? "Napiš zprávu..." : "Type a message...";
    document.getElementById('histTitle').innerText = l === 'cs' ? "Historie" : "History";
    document.getElementById('newChatBtn').innerText = l === 'cs' ? "+ Nový chat" : "+ New chat";
}

document.querySelectorAll('.model-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentModel = btn.dataset.model;
    };
});

async function sendMessage() {
    const inputField = document.getElementById('userInput');
    const text = inputField.value.trim();
    if (!text) return;

    document.getElementById('welcomeScreen').style.display = 'none';
    addBubble(text, 'user');
    inputField.value = "";
    
    const aiBubble = addBubble(currentLang === 'cs' ? "Nexus přemýšlí..." : "Nexus thinking...", 'ai');
    
    try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${MASTER_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [
                    {role: "system", content: currentLang === 'cs' ? "Stručná odpověď v češtině." : "Short answer in English."},
                    {role: "user", content: text}
                ],
                model: currentModel
            })
        });
        const data = await res.json();
        aiBubble.innerText = data.choices[0].message.content;
        updateHistory(text);
    } catch (e) { aiBubble.innerText = "Error."; }
}

function addBubble(t, type) {
    const win = document.getElementById('chatWindow');
    const div = document.createElement('div');
    div.className = `msg ${type}-msg`;
    div.innerText = t;
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;
    return div;
}

function updateHistory(text) {
    let history = JSON.parse(localStorage.getItem('nexus_v16_hist') || '[]');
    const title = text.substring(0, 20) + "...";
    if (!history.includes(title)) {
        history.unshift(title);
        localStorage.setItem('nexus_v16_hist', JSON.stringify(history.slice(0, 5)));
        renderHistory();
    }
}

function renderHistory() {
    const list = document.getElementById('chatHistoryList');
    const history = JSON.parse(localStorage.getItem('nexus_v16_hist') || '[]');
    list.innerHTML = history.map(h => `<div style="padding:15px 10px; border-bottom:1px solid #f4f4f5; font-size:0.85rem; color:#555;">${h}</div>`).join('');
}

document.getElementById('sendBtn').onclick = sendMessage;
document.getElementById('newChatBtn').onclick = () => location.reload();
renderHistory();
