import { AudioManager } from './audio_manager.js';

class SingulAIApp {
    constructor() {
        this.assets = null;
        this.audioManager = null;
        this.init();
    }

    async init() {
        await this.loadAssets();
        this.initLucide();
        this.initCursor();
        this.initParticles();
        this.initAnimations();
        this.audioManager = new AudioManager(this.assets.audio.ambient);
    }

    async loadAssets() {
        const response = await fetch('assets.json');
        this.assets = await response.json();
        

        document.getElementById('hero-img').src = this.assets.images.hero;
        document.getElementById('ruptura-img').src = this.assets.images.ruptura;
        document.getElementById('node-img').src = this.assets.images.sovereign_node;
        document.getElementById('engine-img').src = this.assets.images.ollama;
    }

    initLucide() {
        lucide.createIcons();
    }

    initCursor() {
        const cursor = document.getElementById('custom-cursor');
        const follower = document.querySelector('.cursor-follower');

        window.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1
            });
            gsap.to(follower, {
                x: e.clientX - 10,
                y: e.clientY - 10,
                duration: 0.3
            });
        });

        document.querySelectorAll('a, button, .glass-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.style.width = '80px';
                follower.style.height = '80px';
                follower.style.borderColor = 'rgba(0, 243, 255, 0.5)';
                follower.style.backgroundColor = 'rgba(0, 243, 255, 0.05)';
            });
            el.addEventListener('mouseleave', () => {
                follower.style.width = '40px';
                follower.style.height = '40px';
                follower.style.borderColor = '#00F3FF';
                follower.style.backgroundColor = 'transparent';
            });
        });
    }

    initParticles() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        document.getElementById('canvas-container').appendChild(canvas);

        let particles = [];
        const particleCount = 100;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
                this.alpha = Math.random();
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
                ctx.fillStyle = `rgba(0, 243, 255, ${this.alpha * 0.3})`;
                ctx.fill();
            }
        }

        const init = () => {
            resize();
            for (let i = 0; i < particleCount; i++) particles.push(new Particle());
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        init();
        animate();
    }

    initAnimations() {
        gsap.registerPlugin(ScrollTrigger);


        const heroTl = gsap.timeline();
        heroTl.to(".glitch-reveal", {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 1.5,
            stagger: 0.3,
            ease: "expo.out"
        });


        gsap.from("#ruptura h2", {
            scrollTrigger: {
                trigger: "#ruptura",
                start: "top 80%",
            },
            opacity: 0,
            x: 50,
            duration: 1,
            ease: "power3.out"
        });


        gsap.from(".bento-grid > div", {
            scrollTrigger: {
                trigger: ".bento-grid",
                start: "top 70%",
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        });


        gsap.to("#engine-img", {
            scale: 1.1,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
}

new SingulAIApp();
