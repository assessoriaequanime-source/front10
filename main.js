import { AudioManager } from './audio_manager.js';

class SingulAIApp {
    constructor() {
        this.assets = null;
        this.audioManager = null;
        this.resonanceChart = null;
        this.omegaIndexValue = 0;
        this.isTerminalOpen = false;
        this.sovereigntyAchieved = false;
        this.init();
    }

    async init() {
        await this.loadAssets();
        this.initLucide();
        this.initCursor();
        this.initParticles();
        this.initResonanceChart();
        this.initOracleFlowGraph();
        this.initAnimations();
        this.initTerminalEvents();
        this.initSovereigntyEvents();
        this.audioManager = new AudioManager(this.assets?.audio?.ambient || '');
    }

    async loadAssets() {
        try {
            const response = await fetch('assets.json');
            this.assets = await response.json();
            
            document.getElementById('hero-img').src = this.assets.images.hero;
            document.getElementById('node-img').src = this.assets.images.sovereign_node;
            document.getElementById('omega-img').src = this.assets.images.indice_omega;
            document.getElementById('particle-img').src = this.assets.images.particle_biorhythm;
            document.getElementById('curator-img').src = this.assets.images.digital_curator;
        } catch (error) {
            console.error("Failed to load assets:", error);
        }
    }

    initLucide() {
        lucide.createIcons();
    }

    initCursor() {
        const cursor = document.getElementById('custom-cursor');
        const follower = document.querySelector('.cursor-follower');

        window.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
            gsap.to(follower, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.4 });
        });

        document.querySelectorAll('a, button, .glass-card, .core-interactable, .graph-node').forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(follower, { scale: 2, borderColor: '#00F3FF', backgroundColor: 'rgba(0, 243, 255, 0.1)', duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(follower, { scale: 1, borderColor: '#00F3FF', backgroundColor: 'transparent', duration: 0.3 });
            });
        });
    }

    initOracleFlowGraph() {
        const container = document.getElementById('oracle-graph-container');
        const nodes = container.querySelectorAll('.graph-node');
        const strokes = container.querySelectorAll('.flow-anim-stroke');


        strokes.forEach((stroke, i) => {
            gsap.to(stroke, {
                strokeDashoffset: -100,
                duration: 2 + i,
                repeat: -1,
                ease: "none"
            });
        });


        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;


            const svg = document.getElementById('oracle-flow-graph');
            const pt = svg.createSVGPoint();
            pt.x = e.clientX;
            pt.y = e.clientY;
            const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

            nodes.forEach(node => {
                const nodeX = parseFloat(node.querySelector('circle, rect').getAttribute(node.querySelector('circle') ? 'cx' : 'x')) + (node.querySelector('rect') ? 50 : 0);
                const nodeY = parseFloat(node.querySelector('circle, rect').getAttribute(node.querySelector('circle') ? 'cy' : 'y')) + (node.querySelector('rect') ? 40 : 0);

                const dx = svgP.x - nodeX;
                const dy = svgP.y - nodeY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const pull = (150 - dist) / 15;
                    gsap.to(node, { x: dx / pull, y: dy / pull, duration: 0.5 });
                    

                    const techId = node.getAttribute('data-tech');
                    if (techId) {
                        const tooltip = document.getElementById(`tooltip-${techId}`);
                        gsap.to(tooltip, { 
                            opacity: 1, 
                            x: mouseX + 15, 
                            y: mouseY + 15, 
                            display: 'block',
                            duration: 0.2 
                        });
                        this.updateTooltipData(techId);
                    }
                } else {
                    gsap.to(node, { x: 0, y: 0, duration: 0.8 });
                    const techId = node.getAttribute('data-tech');
                    if (techId) {
                        const tooltip = document.getElementById(`tooltip-${techId}`);
                        gsap.to(tooltip, { opacity: 0, display: 'none', duration: 0.3 });
                    }
                }
            });
        });
    }

    updateTooltipData(techId) {
        const tooltip = document.getElementById(`tooltip-${techId}`);
        if (!tooltip) return;

        if (techId === 'ollama') {
            tooltip.querySelector('.val-latency').textContent = `${(Math.random() * 5 + 10).toFixed(1)}ms`;
            tooltip.querySelector('.val-tokens').textContent = `${(Math.random() * 10 + 40).toFixed(1)}`;
        } else if (techId === 'blockchain') {
            const hex = '0123456789abcdef';
            let hash = '0x';
            for(let i=0; i<6; i++) hash += hex[Math.floor(Math.random()*16)];
            tooltip.querySelector('.val-hash').textContent = `${hash}...`;
        } else if (techId === 'n8n') {
            tooltip.querySelector('.val-sync').textContent = `${(99 + Math.random()).toFixed(2)}%`;
        }
    }

    initTerminalEvents() {
        const terminal = document.getElementById('terminal');
        const terminalInput = document.getElementById('terminal-input');
        const coreImg = document.getElementById('node-img');
        
        const toggleTerminal = () => {
            this.isTerminalOpen = !this.isTerminalOpen;
            if (this.isTerminalOpen) {
                terminal.classList.remove('hidden');
                gsap.fromTo(terminal, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
                terminalInput.focus();
            } else {
                gsap.to(terminal, { opacity: 0, y: 20, duration: 0.3, onComplete: () => terminal.classList.add('hidden') });
            }
        };

        window.addEventListener('keydown', (e) => {
            if (e.shiftKey && (e.code === 'Backquote' || e.key === '~' || e.key === '`')) {
                e.preventDefault();
                toggleTerminal();
            }
        });

        coreImg.addEventListener('click', toggleTerminal);

        let pressTimer;
        coreImg.addEventListener('touchstart', (e) => {
            pressTimer = window.setTimeout(toggleTerminal, 800);
        });
        coreImg.addEventListener('touchend', () => {
            window.clearTimeout(pressTimer);
        });

        document.getElementById('close-terminal').addEventListener('click', toggleTerminal);

        terminalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const cmd = terminalInput.value.toLowerCase();
                const output = document.getElementById('terminal-output');
                const line = document.createElement('p');
                line.textContent = `> ${cmd}`;
                output.appendChild(line);
                
                if (cmd === 'clear') output.innerHTML = '';
                if (cmd === 'omega 100') this.triggerSovereignty(100);
                
                terminalInput.value = '';
                output.scrollTop = output.scrollHeight;
            }
        });
    }

    initSovereigntyEvents() {
        document.getElementById('close-portal').addEventListener('click', () => {
            gsap.to('#sovereignty-portal', { opacity: 0, scale: 1.1, duration: 0.5, onComplete: () => {
                document.getElementById('sovereignty-portal').classList.add('hidden');
            }});
        });
    }

    triggerSovereignty(value) {
        if (value >= 100 && !this.sovereigntyAchieved) {
            this.sovereigntyAchieved = true;
            this.activateGoldenState();
        }
    }

    checkSovereigntyThreshold() {
        if (this.omegaIndexValue >= 100) {
            this.triggerSovereignty(100);
        }
    }

    activateGoldenState() {
        document.body.classList.add('golden-state');
        document.getElementById('sovereignty-portal').classList.remove('hidden');
        gsap.from('#sovereignty-portal > div', { scale: 0.8, opacity: 0, duration: 1, ease: "expo.out" });
        
        document.getElementById('stability-status').innerText = 'STABILITY: ABSOLUTE';
        document.getElementById('stability-status').classList.replace('text-white/20', 'text-gold');
        

        const lines = document.querySelectorAll('.flow-line');
        const animStrokes = document.querySelectorAll('.flow-anim-stroke');
        const nodes = document.querySelectorAll('.graph-node circle, .graph-node rect');

        gsap.to(lines, { stroke: "rgba(212, 175, 55, 0.4)", strokeWidth: 3, duration: 1 });
        gsap.to(animStrokes, { 
            stroke: "url(#gold-gradient)", 
            strokeWidth: 4, 
            strokeDasharray: "30, 10",
            duration: 1.5,
            filter: "drop-shadow(0 0 8px rgba(212, 175, 55, 0.8))"
        });
        gsap.to(nodes, { stroke: "#D4AF37", duration: 1 });

        const output = document.getElementById('terminal-output');
        const log = document.createElement('p');
        log.className = "text-gold animate-pulse";
        log.textContent = "[CRITICAL] SOVEREIGNTY_THRESHOLD_REACHED: ENTERING_GOLDEN_STATE";
        output.appendChild(log);
    }

    initParticles() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        document.getElementById('canvas-container').appendChild(canvas);

        let particles = [];
        const particleCount = 80;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 1.5;
                this.alpha = Math.random();
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                const color = document.body.classList.contains('golden-state') ? '212, 175, 55' : '0, 243, 255';
                ctx.fillStyle = `rgba(${color}, ${this.alpha * 0.2})`;
                ctx.fill();
            }
        }

        const init = () => {
            resize();
            for (let i = 0; i < particleCount; i++) particles.push(new Particle());
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        init();
        animate();
    }

    initResonanceChart() {
        const ctx = document.getElementById('resonance-chart').getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 243, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 243, 255, 0)');

        this.resonanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 20}, (_, i) => i),
                datasets: [{
                    label: 'Resonance',
                    data: Array.from({length: 20}, () => Math.random() * 50),
                    borderColor: '#00F3FF',
                    borderWidth: 2,
                    fill: true,
                    backgroundColor: gradient,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { display: false, min: 0, max: 100 }
                },
                animation: { duration: 0 }
            }
        });
    }

    initAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        gsap.to(".glitch-reveal", {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 1.5,
            stagger: 0.3,
            ease: "expo.out"
        });

        ScrollTrigger.create({
            trigger: "#omega",
            start: "top 80%",
            end: "bottom 20%",
            onUpdate: (self) => {
                this.omegaIndexValue = Math.round(self.progress * 100);
                
                const newData = this.resonanceChart.data.datasets[0].data.map(val => {
                    const jitter = (Math.random() - 0.5) * 5;
                    return Math.max(0, Math.min(100, val + jitter + (self.progress * 1)));
                });
                
                this.resonanceChart.data.datasets[0].data = newData;
                if (this.sovereigntyAchieved) {
                    this.resonanceChart.data.datasets[0].borderColor = '#D4AF37';
                }
                this.resonanceChart.update();
                
                document.getElementById('resonance-value').innerText = `RES: ${this.omegaIndexValue}.00%`;
                
                this.checkSovereigntyThreshold();
            }
        });

        gsap.utils.toArray('section img:not(.core-interactable)').forEach(img => {
            gsap.to(img, {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: img.parentElement,
                    scrub: true
                }
            });
        });
    }
}

new SingulAIApp();
