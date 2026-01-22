/**
 * SingulAI Pen - Premium Industrial Interaction Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();
    gsap.registerPlugin(ScrollTrigger);


    gsap.from('.hero-content > *', {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out"
    });


    try {
        const response = await fetch('technical_data.json');
        const data = await response.json();
        setupTechnicalView(data.labels);
    } catch (e) {
        console.error("Technical data load failed", e);
    }

    function setupTechnicalView(labels) {
        const container = document.getElementById('technical-labels-container');
        const svg = document.getElementById('tech-svg-lines');
        if (!container || !svg) return;

        labels.forEach((label, idx) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'tech-callout';
            wrapper.style.left = label.x;
            wrapper.style.top = label.y;
            
            wrapper.innerHTML = `
                <div class="callout-content">
                    <div class="callout-header" style="border-left: 2px solid ${label.color}">
                        <span class="callout-title" style="color: ${label.color}">${label.title}</span>
                        <span class="callout-id">SEC_${idx + 100}</span>
                    </div>
                    <p class="callout-sub">${label.subtitle}</p>
                </div>
                <div class="callout-dot" style="background: ${label.color}"></div>
            `;
            
            container.appendChild(wrapper);


            gsap.from(wrapper, {
                scrollTrigger: {
                    trigger: "#engineering",
                    start: "top 40%"
                },
                opacity: 0,
                x: idx % 2 === 0 ? -40 : 40,
                duration: 1,
                delay: idx * 0.15,
                ease: "power2.out"
            });
        });
    }


    const startBtn = document.getElementById('start-auth');
    const signatureTrace = document.getElementById('signature-trace');
    const seal = document.getElementById('auth-status-seal');
    const touchPoint = document.getElementById('touch-point');

    let isAuthenticating = false;

    startBtn.addEventListener('click', () => {
        if (isAuthenticating) return;
        isAuthenticating = true;

        const tl = gsap.timeline({
            onComplete: () => { isAuthenticating = false; }
        });


        gsap.set(signatureTrace, { strokeDashoffset: 1000 });
        gsap.set(seal, { scale: 1, borderColor: "rgba(255,255,255,0.05)" });
        seal.innerHTML = `<i data-lucide="loader-2" class="text-cyan-500 w-8 h-8 animate-spin"></i>`;
        lucide.createIcons();


        tl.to(signatureTrace, {
            strokeDashoffset: 0,
            duration: 3,
            ease: "power1.inOut",
            onUpdate: function() {

                const pathLength = signatureTrace.getTotalLength();
                const progress = this.progress();
                const point = signatureTrace.getPointAtLength(progress * pathLength);
                gsap.set(touchPoint, {
                    x: point.x - 200, // adjust based on SVG viewBox center
                    y: point.y - 100,
                    opacity: 1
                });
            }
        });

        tl.to(touchPoint, { opacity: 0, duration: 0.3 });


        tl.to(seal, {
            borderColor: "#22c55e", // Green-500
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            duration: 0.5,
            scale: 1.1
        });

        tl.add(() => {
            seal.innerHTML = `<i data-lucide="check-circle" class="text-green-500 w-8 h-8"></i>`;
            lucide.createIcons();
        });

        tl.to(seal, {
            scale: 1,
            boxShadow: "0 0 30px rgba(34, 197, 94, 0.3)",
            duration: 0.8,
            ease: "back.out"
        });


        tl.add(() => {
            const msg = document.createElement('div');
            msg.className = 'fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-500/20 text-green-400 text-[10px] font-mono px-6 py-2 border border-green-500/50 uppercase tracking-[0.3em] rounded-sm z-50';
            msg.innerText = "AUTHENTICATION_SUCCESSFUL // BLOCK_MINTED";
            document.body.appendChild(msg);
            gsap.from(msg, { y: 20, opacity: 0 });
            gsap.to(msg, { y: -20, opacity: 0, delay: 3, onComplete: () => msg.remove() });
        });
    });


    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        gsap.to('.hero-image-wrapper', {
            x: x,
            y: y,
            duration: 2,
            ease: "power2.out"
        });
    });
});
