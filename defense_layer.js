import { addLog } from './terminal.js';
import { updateSovereigntyMode } from './sovereignty_audit.js';

export function initDefenseLayer() {
    const btnSimulate = document.getElementById('btn-simulate-governance');
    const btnKill = document.getElementById('btn-emergency-kill');
    const modeHeadless = document.getElementById('mode-headless');
    const modeSovereign = document.getElementById('mode-sovereign');
    
    const headlessAlerts = document.getElementById('headless-alerts');
    const sovereignStatus = document.getElementById('sovereign-status');
    const walletBox = document.getElementById('wallet-signature-box');
    const alertOverlay = document.getElementById('security-alert');
    const stressContainer = document.getElementById('stress-packet-container');
    const indicatorRed = document.getElementById('status-indicator-red');
    const indicatorGold = document.getElementById('status-indicator-gold');
    
    const cryptoOverlay = document.getElementById('crypto-lock-overlay');

    let currentMode = 'sovereign'; // 'headless' or 'sovereign'
    let isRunning = false;

    modeHeadless.addEventListener('click', () => {
        if (isRunning) return;
        currentMode = 'headless';
        updateUI();
        updateSovereigntyMode('headless');
    });

    modeSovereign.addEventListener('click', () => {
        if (isRunning) return;
        currentMode = 'sovereign';
        updateUI();
        updateSovereigntyMode('sovereign');
    });

    function updateUI() {
        if (currentMode === 'headless') {
            modeHeadless.classList.add('bg-red-500/20', 'text-red-400', 'border', 'border-red-500/30');
            modeHeadless.classList.remove('text-white/40');
            modeSovereign.classList.remove('bg-[#D4AF37]/20', 'text-[#D4AF37]', 'border', 'border-[#D4AF37]/30');
            modeSovereign.classList.add('text-white/40');
            
            headlessAlerts.classList.remove('hidden');
            sovereignStatus.classList.add('hidden');
            indicatorRed.classList.remove('hidden');
            indicatorGold.classList.add('hidden');
        } else {
            modeSovereign.classList.add('bg-[#D4AF37]/20', 'text-[#D4AF37]', 'border', 'border-[#D4AF37]/30');
            modeSovereign.classList.remove('text-white/40');
            modeHeadless.classList.remove('bg-red-500/20', 'text-red-400', 'border', 'border-red-500/30');
            modeHeadless.classList.add('text-white/40');
            
            headlessAlerts.classList.add('hidden');
            sovereignStatus.classList.remove('hidden');
            indicatorRed.classList.add('hidden');
            indicatorGold.classList.remove('hidden');
        }
    }

    btnSimulate.addEventListener('click', () => {
        if (isRunning) return;
        isRunning = true;
        btnSimulate.disabled = true;
        btnSimulate.classList.add('opacity-50');

        if (currentMode === 'headless') {
            runHeadlessSimulation();
        } else {
            runSovereignSimulation();
        }
    });

    function runHeadlessSimulation() {
        addLog("CRITICAL", "STACK", "Headless Mode Active: n8n/Ollama isolation absent.");
        addLog("ALERT", "GOVERNANCE", "Detected Context Pollution in inference pipeline.");
        
        for(let i=0; i<20; i++) {
            setTimeout(() => spawnPacket(stressContainer, true, false), i * 150);
        }

        setTimeout(() => {
            addLog("FAILURE", "OLLAMA", "Vector leakage detected. Prompt injection successful.");
            isRunning = false;
            btnSimulate.disabled = false;
            btnSimulate.classList.remove('opacity-50');
        }, 4000);
    }

    function runSovereignSimulation() {
        addLog("SYSTEM", "GOVERNANCE", "Sovereign Mode Active: Intercepting request...");
        
        for(let i=0; i<15; i++) {
            setTimeout(() => spawnPacket(stressContainer, true, true), i * 150);
        }

        setTimeout(() => {
            gsap.to(walletBox, { opacity: 1, y: 0, duration: 0.5 });
            addLog("SECURITY", "BLOCKCHAIN", "Wallet Signature required for high-risk inference.");
            
            setTimeout(() => {
                alertOverlay.style.opacity = '1';
                addLog("SUCCESS", "GOVERNANCE", "Injection blocked via Wallet Multi-sig verification.");
                
                setTimeout(() => {
                    alertOverlay.style.opacity = '0';
                    gsap.to(walletBox, { opacity: 0, y: 20, duration: 0.5 });
                    isRunning = false;
                    btnSimulate.disabled = false;
                    btnSimulate.classList.remove('opacity-50');
                }, 2000);
            }, 1000);
        }, 1000);
    }

    btnKill.addEventListener('click', () => {
        addLog("TERMINAL", "EMERGENCY", "Protocol 0 initiated. Cryptographic lockdown engaging.");
        gsap.to(cryptoOverlay, { 
            opacity: 1, 
            pointerEvents: 'all', 
            duration: 1.2,
            onStart: () => {
                gsap.to("body", { x: 5, duration: 0.05, repeat: 20, yoyo: true });
            }
        });
        console.warn("SYSTEM LOCKED BY SOVEREIGN OVERRIDE.");
    });
}

function spawnPacket(container, isMalicious, isIntercepted) {
    if (!container) return;
    const packet = document.createElement('div');
    packet.className = `packet ${isMalicious ? 'malicious' : ''}`;
    
    const startX = Math.random() * 100;
    const startY = -10;
    
    packet.style.left = `${startX}%`;
    packet.style.top = `${startY}%`;
    container.appendChild(packet);

    const timeline = gsap.timeline({
        onComplete: () => packet.remove()
    });

    if (isIntercepted) {
        timeline.to(packet, {
            y: 100,
            x: 50 + (Math.random() - 0.5) * 20,
            duration: 0.8,
            ease: "power2.in"
        }).to(packet, {
            backgroundColor: '#D4AF37',
            scale: 2,
            opacity: 0,
            duration: 0.3
        });
    } else {
        timeline.to(packet, {
            y: 300,
            x: startX + (Math.random() - 0.5) * 40,
            duration: 1.5,
            ease: "none",
            opacity: 0.5
        });
    }
}
