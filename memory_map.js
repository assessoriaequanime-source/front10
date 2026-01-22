export class MemoryMap {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.isActive = false;
        this.particleCount = 150;
        
        window.addEventListener('resize', () => this.resize());
        this.resize();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                targetX: this.canvas.width / 2,
                targetY: this.canvas.height / 2,
                accel: Math.random() * 0.02 + 0.01
            });
        }
    }

    start() {
        this.isActive = true;
        this.initParticles();
        this.animate();
    }

    stop() {
        this.isActive = false;
    }

    animate() {
        if (!this.isActive) return;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {

            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            p.speedX += dx * p.accel * 0.1;
            p.speedY += dy * p.accel * 0.1;

            p.x += p.speedX;
            p.y += p.speedY;


            p.speedX *= 0.95;
            p.speedY *= 0.95;


            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = '#D4AF37';
            this.ctx.fill();


            this.particles.forEach(p2 => {
                const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                if (dist < 60) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(212, 175, 55, ${1 - dist / 60})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}
