import { AudioManager } from './audio_manager.js';
import { FragmentationRenderer } from './fragmentation_renderer.js';

class SingulAIApp {
    constructor() {
        this.assets = null;
        this.audioManager = null;
        this.fragRenderer = null;
        this.climaxOverlay = null;
        this.syncMeter = { fill: null, value: null };
        this.init();
    }

    async init() {
        await this.loadAssets();
        this.initLucide();
        this.initHUD();
        this.initCursor();
        this.initClimaxOverlay();
        this.initFragmentation();
        this.initParticles();
        this.initAnimations();
        this.audioManager = new AudioManager(this.assets.audio);
        this.initAudioTriggers();
    }

    async loadAssets() {
        try {
            const response = await fetch('assets.json');
            this.assets = await response.json();
            
            document.getElementById('hero-img').src = this.assets.images.hero;
            document.getElementById('ruptura-img').src = this.assets.images.ruptura;
            document.getElementById('node-img').src = this.assets.images.sovereign_node;
            document.getElementById('engine-img').src = this.assets.images.ollama;
        } catch (e) {
            console.warn("Assets not found, using fallback placeholders");

        }
    }

    initLucide() {
        lucide.createIcons();
    }

    initHUD() {
        this.syncMeter.fill = document.getElementById('sync-fill');
        this.syncMeter.value = document.getElementById('sync-value');

        setInterval(() => {
            const val = 97 + Math.random() * 2.9;
            if (this.syncMeter.fill) {
                this.syncMeter.fill.style.width = `${Math.min(val, 100)}%`;
                this.syncMeter.value.innerText = `${Math.min(val, 100).toFixed(1)}%`;
            }
        }, 800);
    }

    initAudioTriggers() {
        document.querySelectorAll('a, button, .glass-card').forEach(el => {
            el.addEventListener('mouseenter', () => this.audioManager?.playSfx('hover'));
            el.addEventListener('click', () => this.audioManager?.playSfx('click'));
        });
    }

    initCursor() {
        const cursor = document.getElementById('custom-cursor');
        const follower = document.querySelector('.cursor-follower');

        window.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
            gsap.to(follower, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.3 });
        });
    }

    initClimaxOverlay() {
        this.climaxOverlay = document.createElement('div');
        this.climaxOverlay.className = 'climax-bloom';
        document.body.appendChild(this.climaxOverlay);
    }

    initFragmentation() {
        this.fragRenderer = new FragmentationRenderer('webgl-container');
        this.fragRenderer.init();
    }

    initParticles() {
        const container = document.getElementById('canvas-container');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        container.appendChild(canvas);

        let particles = [];
        const particleCount = 40;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.2;
                this.vy = (Math.random() - 0.5) * 0.2;
                this.size = Math.random() * 1.0;
                this.alpha = Math.random() * 0.3;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 243, 255, ${this.alpha})`;
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

    initAnimations() {
        gsap.registerPlugin(ScrollTrigger);


        ScrollTrigger.create({
            onUpdate: (self) => {
                const velocity = Math.abs(self.getVelocity()) / 2000;
                this.fragRenderer.scrollVelocity = gsap.utils.clamp(0, 0.4, velocity);
            }
        });

        const titles = gsap.utils.toArray('.focal-blur-title');
        titles.forEach(title => {
            gsap.fromTo(title, 
                { filter: 'blur(15px)', opacity: 0, y: 30 },
                { 
                    filter: 'blur(0px)', 
                    opacity: 1, 
                    y: 0,
                    duration: 1.2, 
                    scrollTrigger: {
                        trigger: title,
                        start: "top 90%",
                        end: "top 40%",
                        scrub: true,
                    }
                }
            );
        });

        const dynamicText = document.querySelector('.dynamic-typography');
        if (dynamicText) {
            ScrollTrigger.create({
                onUpdate: (self) => {
                    const velocity = Math.abs(self.getVelocity());
                    const spacing = gsap.utils.mapRange(0, 4000, 0, 0.2, velocity);
                    gsap.to(dynamicText, {
                        letterSpacing: `${spacing}em`,
                        duration: 0.3,
                        overwrite: 'auto'
                    });
                }
            });
        }

        ScrollTrigger.create({
            trigger: ".section-curator",
            start: "top bottom",
            end: "top top",
            scrub: 1,
            onUpdate: (self) => {
                this.fragRenderer.updateTransition(self.progress);
            }
        });

        const climaxTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#engine",
                start: "top 60%",
                end: "bottom bottom",
                scrub: 1.5
            }
        });

        climaxTl.to({}, {
            duration: 1,
            onUpdate: () => {
                const p = climaxTl.progress();
                const intensity = p * 4.0;
                const convergence = gsap.utils.clamp(0, 1, (p - 0.2) * 1.5);
                this.fragRenderer.updateClimax(intensity, convergence);
            }
        });

        gsap.utils.toArray(".glitch-reveal").forEach(el => {
            gsap.to(el, { opacity: 1, filter: "blur(0px)", y: 0, duration: 1.5, ease: "expo.out", delay: 0.2 });
        });
    }
}

window.singulai_app = new SingulAIApp();
