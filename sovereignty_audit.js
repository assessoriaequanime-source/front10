let currentMode = 'sovereign';
let orbPedro, orbLaura, flashEl;
const CIRCLE_LENGTH = 251.2;

export function initSovereigntyAudit() {
    initCollisionSim();
    animateLatency();
    updateValuation(100);
}

function initCollisionSim() {
    const container = document.getElementById('collision-sim-container');
    if (!container) return;

    orbPedro = document.createElement('div');
    orbPedro.className = 'collision-orb orb-pedro';
    orbPedro.innerHTML = '<span class="absolute -top-3 left-0 text-[6px] text-white font-mono">PEDRO</span>';
    
    orbLaura = document.createElement('div');
    orbLaura.className = 'collision-orb orb-laura';
    orbLaura.innerHTML = '<span class="absolute -top-3 left-0 text-[6px] text-white font-mono">LAURA</span>';

    flashEl = document.createElement('div');
    flashEl.className = 'collision-flash';
    flashEl.innerHTML = '<div class="flex h-full items-center justify-center text-[10px] font-black glitch-text">CONTEXT COLLISION</div>';

    container.appendChild(orbPedro);
    container.appendChild(orbLaura);
    container.appendChild(flashEl);

    startSimLoop();
}

function startSimLoop() {
    const loop = () => {
        if (currentMode === 'headless') {

            gsap.to(orbPedro, { x: 45, y: 30, duration: 2, ease: "sine.inOut" });
            gsap.to(orbLaura, { x: 65, y: 30, duration: 2, ease: "sine.inOut", onComplete: () => {
                if (currentMode === 'headless') triggerCollisionEffect();
            }});
        } else {

            gsap.to(orbPedro, { x: 15, y: 15, duration: 1.5, ease: "power2.out" });
            gsap.to(orbLaura, { x: 95, y: 45, duration: 1.5, ease: "power2.out" });
            gsap.to(flashEl, { opacity: 0, duration: 0.3 });
        }
        setTimeout(loop, 4000);
    };
    loop();
}

function triggerCollisionEffect() {
    gsap.timeline()
        .to(flashEl, { opacity: 1, duration: 0.1, repeat: 5, yoyo: true })
        .to(flashEl, { opacity: 0.5, duration: 1 })
        .to(flashEl, { opacity: 0, duration: 0.5 });
}

function animateLatency() {
    const headlessBar = document.getElementById('bar-latency-headless');
    const sovereignBar = document.getElementById('bar-latency-sovereign');
    
    setInterval(() => {
        const hVal = Math.floor(Math.random() * 50 + 230);
        const sVal = Math.floor(Math.random() * 5 + 10);
        
        headlessBar.innerText = `${hVal}ms`;
        sovereignBar.innerText = `${sVal}ms`;
    }, 2000);
}

export function updateSovereigntyMode(mode) {
    currentMode = mode;
    if (mode === 'headless') {
        updateValuation(30);
        document.getElementById('valuation-status').innerText = "FRAGMENTED (ALPHA)";
        document.getElementById('valuation-status').className = "text-[10px] font-bold text-red-500";
        document.getElementById('fragmentation-penalty').classList.remove('hidden');
        document.getElementById('valuation-bonus').innerText = "x1.00";
        document.getElementById('valuation-bonus').className = "text-[10px] font-mono text-red-500 font-bold";
    } else {
        updateValuation(100);
        document.getElementById('valuation-status').innerText = "SOVEREIGN PREMIUM";
        document.getElementById('valuation-status').className = "text-[10px] font-bold text-[#FFD700]";
        document.getElementById('fragmentation-penalty').classList.add('hidden');
        document.getElementById('valuation-bonus').innerText = "x3.33";
        document.getElementById('valuation-bonus').className = "text-[10px] font-mono text-green-500 font-bold";
    }
}

function updateValuation(percent) {
    const path = document.getElementById('valuation-gauge-path');
    const text = document.getElementById('valuation-percent');
    
    const offset = CIRCLE_LENGTH - (percent / 100) * CIRCLE_LENGTH;
    path.style.strokeDashoffset = offset;
    text.innerText = `${percent}%`;

    if (percent < 50) {
        path.classList.remove('text-[#FFD700]');
        path.classList.add('text-red-500');
    } else {
        path.classList.remove('text-red-500');
        path.classList.add('text-[#FFD700]');
    }
}
