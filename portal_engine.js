import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export class PortalEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });

        this.particleCount = 65000;
        this.isZooming = false;
        this.mouse = new THREE.Vector2(0, 0);
        this.targetMouse = new THREE.Vector2(0, 0);
        
        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.camera.position.z = 25;

        const geometry = new THREE.BufferGeometry();
        const pos = new Float32Array(this.particleCount * 3);
        const col = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);

        const starColor = new THREE.Color('#ffffff');
        const blueColor = new THREE.Color('#3b82f6');

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            const radius = Math.random() * 50;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
            pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            pos[i3 + 2] = (Math.random() - 0.5) * 400;

            const mix = Math.random();
            const color = mix > 0.9 ? starColor : blueColor;
            col[i3] = color.r * (Math.random() * 0.5 + 0.5);
            col[i3 + 1] = color.g * (Math.random() * 0.5 + 0.5);
            col[i3 + 2] = color.b * (Math.random() * 0.5 + 0.5);

            sizes[i] = Math.random() * 0.08;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(col, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 0.015,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.points = new THREE.Points(geometry, material);
        this.scene.add(this.points);

        window.addEventListener('resize', () => this.handleResize());
        this.render();
    }

    updateMouse(x, y) {
        this.targetMouse.set(x * 10, y * 10);
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        requestAnimationFrame(() => this.render());
        
        this.points.rotation.z += 0.0002;
        this.points.rotation.y += 0.0001;

        if (!this.isZooming) {
            this.mouse.lerp(this.targetMouse, 0.04);
            this.camera.position.x += (this.mouse.x * 0.2 - this.camera.position.x) * 0.05;
            this.camera.position.y += (this.mouse.y * 0.2 - this.camera.position.y) * 0.05;
        }

        this.renderer.render(this.scene, this.camera);
    }

    enterVortex(onComplete) {
        this.isZooming = true;
        
        const tl = gsap.timeline({
            onComplete: () => {
                if (onComplete) onComplete();
            }
        });


        tl.to(this.camera.position, {
            z: -300,
            duration: 2.2,
            ease: "expo.in"
        });

        tl.to(this.camera, {
            fov: 150,
            duration: 2.0,
            ease: "power2.in",
            onUpdate: () => this.camera.updateProjectionMatrix()
        }, 0);

        tl.to(this.points.material, {
            opacity: 0,
            duration: 2.2,
            ease: "power4.in"
        }, 0);
    }
}
