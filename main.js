import { PortalEngine } from './portal_engine.js';
import { MemoryMap } from './memory_map.js';
import { translations } from './translations.js';

class App {
    constructor() {
        this.currentLang = localStorage.getItem('singulai_lang') || 'pt';
        this.isMuted = localStorage.getItem('singulai_muted') === 'true';
        this.portal = null;
        this.memoryMap = null;
        this.lenis = null;
        this.isEntering = false;
        this.isModalOpen = false;

        this.init();
    }

    async init() {
        lucide.createIcons();
        this.portal = new PortalEngine('portal-canvas');
        this.memoryMap = new MemoryMap('memory-canvas');
        
        this.setupLenis();
        this.setupInteractions();
        this.updateUI(this.currentLang);
        this.updateMuteUI();
    }

    setupLenis() {
        this.lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
        });

        const raf = (time) => {
            this.lenis.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
        this.lenis.stop();
    }

    async startExperience() {
        const splash = document.getElementById('splash-screen');
        const ambient = document.getElementById('audio-ambient');
        
        ambient.muted = this.isMuted;
        ambient.volume = 0.4;
        ambient.play().catch(() => {});
        
        gsap.to(splash, { 
            opacity: 0, 
            duration: 1.2, 
            ease: "expo.inOut",
            onComplete: () => {
                splash.style.display = 'none';
                this.runEntranceSequence();
            }
        });

        gsap.to('#mute-toggle', { opacity: 1, pointerEvents: 'all', duration: 1.5, delay: 0.5 });
        gsap.to('#global-lang', { opacity: 1, duration: 1.5, delay: 0.8 });
    }

    runEntranceSequence() {
        const tl = gsap.timeline();

        tl.to('#black-out', { 
            opacity: 0, 
            duration: 2.5, 
            ease: "power2.inOut",
            onStart: () => this.playVoiceGreeting(),
            onComplete: () => document.getElementById('black-out').style.display = 'none'
        });

        tl.to('#portal-canvas', { opacity: 1, duration: 3 }, "-=2.5");
        
        tl.to('#portal-ui', { 
            opacity: 1, 
            pointerEvents: 'all', 
            duration: 2.5,
            ease: "power1.inOut"
        }, "-=2.5");

        tl.to('#portal-buttons', {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "expo.out"
        }, "-=0.5");
    }

    playVoiceGreeting() {
        if (this.isMuted) return;
        const voice = document.getElementById(`audio-voice-${this.currentLang}`);
        if (voice) {
            voice.volume = 0.5;
            voice.play().catch(() => {});
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('singulai_muted', this.isMuted);
        document.getElementById('audio-ambient').muted = this.isMuted;
        this.updateMuteUI();
    }

    updateMuteUI() {
        const icon = document.getElementById('mute-icon');
        icon.setAttribute('data-lucide', this.isMuted ? 'volume-x' : 'volume-2');
        lucide.createIcons();
    }

    async enterSite() {
        if (this.isEntering) return;
        this.isEntering = true;

        gsap.to('#portal-ui', { 
            opacity: 0, 
            scale: 1.1,
            pointerEvents: 'none', 
            duration: 1.2, 
            ease: "power4.in" 
        });

        this.portal.enterVortex(() => {
            gsap.to('#site-content', { 
                opacity: 1, 
                pointerEvents: 'all', 
                duration: 2,
                onComplete: () => {
                    this.lenis.start();
                    document.body.style.overflow = 'auto';
                }
            });
            this.lenis.scrollTo(0, { immediate: true });
        });
    }

    openDemo() {
        if(this.isEntering || this.isModalOpen) return;
        this.isModalOpen = true;
        const modal = document.getElementById('demo-modal');
        
        modal.style.display = 'flex';
        
        gsap.to(modal, { 
            opacity: 1, 
            pointerEvents: 'all', 
            duration: 0.8, 
            ease: "power3.out",
            onStart: () => {
                this.memoryMap.start();
                this.simulateTerminal();
            }
        });
    }

    closeDemo() {
        if (!this.isModalOpen) return;
        this.isModalOpen = false;
        const modal = document.getElementById('demo-modal');
        
        gsap.to(modal, { 
            opacity: 0, 
            pointerEvents: 'none', 
            duration: 0.5, 
            ease: "power3.in",
            onComplete: () => {
                modal.style.display = 'none';
                this.memoryMap.stop();
            }
        });
    }

    simulateTerminal() {
        const logs = document.getElementById('terminal-logs');
        if (!logs) return;
        logs.innerHTML = '';
        const data = [
            "> core_sync: initializing node.14",
            "> latency check: 14ms (optimal)",
            "> synapse_map: 1.4TB read [SUCCESS]",
            "> security_layer: quantum_shield active",
            "> consciousness_bridge: established",
            "> status: streaming digital twin..."
        ];

        data.forEach((txt, i) => {
            setTimeout(() => {
                if(!this.isModalOpen) return;
                const p = document.createElement('p');
                p.textContent = txt;
                p.className = "terminal-line";
                logs.appendChild(p);
            }, i * 450);
        });
    }

    setupInteractions() {
        document.getElementById('btn-enter-exp').addEventListener('click', () => this.startExperience());
        

        document.getElementById('btn-site').addEventListener('click', (e) => {
            e.preventDefault();
            this.enterSite();
        });
        
        document.getElementById('btn-demo').addEventListener('click', (e) => {
            e.preventDefault();
            this.openDemo();
        });

        document.getElementById('mute-toggle').addEventListener('click', () => this.toggleMute());
        

        document.getElementById('close-modal').addEventListener('click', () => this.closeDemo());
        document.getElementById('modal-overlay').addEventListener('click', () => this.closeDemo());
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen) {
                this.closeDemo();
            }
        });

        document.getElementById('lang-pt').addEventListener('click', () => this.updateUI('pt'));
        document.getElementById('lang-en').addEventListener('click', () => this.updateUI('en'));

        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            if (this.portal && !this.isModalOpen) this.portal.updateMouse(x, y);
        });
    }

    updateUI(lang) {
        this.currentLang = lang;
        localStorage.setItem('singulai_lang', lang);
        const t = translations[lang];

        const mappings = [
            { id: 'txt-enter-exp', text: t.enterExperience },
            { id: 'hero-title', text: t.heroTitle },
            { id: 'txt-site', text: t.btnSite },
            { id: 'txt-demo', text: t.btnDemo },
            { id: 'pillars-title', text: t.pillarsTitle },
            { id: 'p1-title', text: t.p1Title },
            { id: 'p1-desc', text: t.p1Desc },
            { id: 'p2-title', text: t.p2Title },
            { id: 'p2-desc', text: t.p2Desc },
            { id: 'p3-title', text: t.p3Title },
            { id: 'p3-desc', text: t.p3Desc },
            { id: 'txt-footer-copyright', text: t.footerCopyright },
            { id: 'modal-title', text: t.modalTitle },
            { id: 'modal-desc', text: t.modalDesc }
        ];

        mappings.forEach(m => {
            const el = document.getElementById(m.id);
            if (el) el.innerHTML = m.text;
        });

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('text-white', btn.id === `lang-${lang}`);
            btn.classList.toggle('text-white/20', btn.id !== `lang-${lang}`);
        });
    }
}

window.addEventListener('load', () => new App());
