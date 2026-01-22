const RAW_LOGS = [
    '{ "event": "user_input", "data": "Tell me about my legacy.", "source": "n8n_webhook" }',
    '{ "node": "vector_search", "query": "pedro_financial_2024", "matches": 3 }',
    '{ "system": "ollama", "model": "llama3:8b", "status": "streaming", "tokens": 128 }',
    '{ "event": "identity_validation", "method": "biometric", "result": "pass" }',
    '{ "trigger": "memory_sync", "files": ["legal_docs_v1.pdf"], "status": "indexed" }'
];

const INSIGHTS = [
    { label: "IDENTITY SYNC", msg: "HLM Pedro verified via biometric cross-check. Context window locked to sovereign data." },
    { label: "KNOWLEDGE EXTRACTION", msg: "Extracted 3 core legacy patterns from financial vector subset. Relevance score: 0.98." },
    { label: "NEURAL INFERENCE", msg: "Llama-3 processing response within strictly containersied user-enclave. No data leakage detected." },
    { label: "W2I TRANSACTION", msg: "Memory state hash successfully signed by wallet 0x8F2A. Integrity of response guaranteed." },
    { label: "POLICY ENFORCEMENT", msg: "Blocked 1 external API request attempting to leak non-sanitized prompt tokens." }
];

export function initAuditLogs() {
    const rawContainer = document.getElementById('audit-raw');
    const insightContainer = document.getElementById('audit-insight');

    function addAuditEntry() {

        const rawEl = document.createElement('div');
        rawEl.className = 'opacity-0';
        rawEl.innerText = `> ${RAW_LOGS[Math.floor(Math.random() * RAW_LOGS.length)]}`;
        rawContainer.prepend(rawEl);
        gsap.to(rawEl, { opacity: 1, duration: 0.5 });

        if (rawContainer.childNodes.length > 20) rawContainer.lastChild.remove();


        if (Math.random() > 0.4) {
            const insight = INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)];
            const insEl = document.createElement('div');
            insEl.className = 'insight-card';
            insEl.innerHTML = `
                <div class="flex items-center justify-between mb-1">
                    <span class="text-[9px] font-bold text-white/80">[${insight.label}]</span>
                    <span class="text-[8px] text-white/20 font-mono">${new Date().toLocaleTimeString()}</span>
                </div>
                <div class="text-white/70 italic leading-tight">${insight.msg}</div>
            `;
            insightContainer.prepend(insEl);
            
            if (insightContainer.childNodes.length > 10) insightContainer.lastChild.remove();
        }
    }


    for(let i=0; i<5; i++) addAuditEntry();


    setInterval(addAuditEntry, 3000);
}
