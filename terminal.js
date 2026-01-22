const terminal = document.getElementById('audit-raw'); // Mapping old terminal concept to audit raw

const mockEvents = [
    { type: "SEC", source: "GUARD", msg: "Memory Transaction signed (W2I)." },
    { type: "DATA", source: "HLM", msg: "Neural buffer synchronized with Ollama." },
    { type: "SYS", source: "ORCH", msg: "n8n workflow heartbeat detected." },
    { type: "IA", source: "CORE", msg: "Context window purge completed." }
];

export function initTerminal() {

    console.log("Terminal initialized as Raw Stream");
}

export function addLog(type, source, msg) {
    const rawContainer = document.getElementById('audit-raw');
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const div = document.createElement('div');
    div.className = "text-[10px] flex gap-2 border-l border-white/5 pl-2 mb-1";
    
    let color = "text-white/40";
    if (type === "CRITICAL") color = "text-red-500 font-bold";
    if (type === "SUCCESS") color = "text-green-500 font-bold";

    div.innerHTML = `
        <span class="text-white/10">[${time}]</span>
        <span class="${color}">${type}:</span>
        <span>${msg}</span>
    `;

    rawContainer.prepend(div);
}
