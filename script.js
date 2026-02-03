let currentModel = "llama-3.3-70b-versatile";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MASTER_KEY = "TVŮJ_KLÍČ_ZDE"; // Vlož svůj Groq klíč

// Přepínání modelů
document.querySelectorAll('.model-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentModel = btn.dataset.model;
    };
});

document.getElementById('sendBtn').onclick = async () => {
    const input = document.getElementById('userInput').value;
    const responseArea = document.getElementById('responseArea');
    
    if (!input) return;

    responseArea.innerHTML = "<p style='opacity:0.5'>Nexus přemýšlí...</p>";
    
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${MASTER_KEY}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                messages: [{role: "user", content: input}],
                model: currentModel
            })
        });

        const data = await res.json();
        const text = data.choices[0].message.content;
        
        // Jednoduché formátování odstavců
        responseArea.innerHTML = text.split('\n').map(p => `<p>${p}</p>`).join('');
        
    } catch (e) {
        responseArea.innerHTML = "<p style='color:red'>Chyba spojení.</p>";
    }
};
