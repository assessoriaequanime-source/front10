import { morphToAvatar, triggerActivationPulse } from './neural_atlas.js';
import { addLog } from './terminal.js';

const avatars = {
    pedro: { title: "PEDRO_HLM.model", color: "#D4AF37", type: "Conservative" },
    laura: { title: "LAURA_HLM.model", color: "#007FFF", type: "Creative" },
    leticia: { title: "LETICIA_HLM.model", color: "#D4AF37", type: "Analytical" }
};

export function initStateManager() {
    const buttons = document.querySelectorAll('.avatar-btn');
    const killBtn = document.getElementById('kill-switch');
    const queryBtn = document.getElementById('btn-simulate-query');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const avatarKey = btn.getAttribute('data-avatar');
            if (btn.classList.contains('active')) return;

            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            performOrchestration(avatarKey);
        });
    });

    queryBtn.addEventListener('click', () => {
        addLog("HLM", "QUERY", "Broadcasting vector search into latent space...");
        triggerActivationPulse();
        

        gsap.to(queryBtn, { scale: 1.05, duration: 0.1, yoyo: true, repeat: 1 });
    });

    killBtn.addEventListener('click', () => {
        addLog("CRITICAL", "SYSTEM", "Kill Switch Triggered. Neural Atlas disconnected.");
        addLog("SECURITY", "BLOCKCHAIN", "Locking all wallet operations...");
        gsap.to("body", { backgroundColor: "#1a0505", duration: 0.1, yoyo: true, repeat: 5 });
    });
}

function performOrchestration(key) {
    const avatar = avatars[key];
    const overlay = document.getElementById('purge-overlay');
    const progress = document.getElementById('purge-progress');
    const title = document.getElementById('active-hlm-title');

    addLog("SYSTEM", "ORCHESTRATOR", `Purging previous context. Morphing to ${avatar.type} architecture...`);
    
    gsap.to(overlay, { opacity: 1, duration: 0.4, pointerEvents: "all" });
    gsap.fromTo(progress, { width: "0%" }, { width: "100%", duration: 1.2, ease: "power2.inOut", onComplete: () => {
        
        addLog("HLM", "ATLAS", `Context Morphism complete: ${avatar.title} loaded.`);
        
        title.innerText = avatar.title;
        title.style.color = avatar.color;
        

        morphToAvatar(key);

        gsap.to(overlay, { opacity: 0, duration: 0.6, delay: 0.3, pointerEvents: "none" });
        addLog("SYSTEM", "SUCCESS", `Sovereign state synchronized.`);
        
        updateResourceBars();
    }});
}

function updateResourceBars() {
    const ollama = document.getElementById('bar-ollama');
    const n8n = document.getElementById('bar-n8n');
    
    gsap.to(ollama, { width: `${Math.floor(Math.random() * 40 + 5)}%`, duration: 1 });
    gsap.to(n8n, { width: `${Math.floor(Math.random() * 30 + 60)}%`, duration: 1 });
}
