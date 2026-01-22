import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { EffectComposer } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/OutputPass.js';
import { fragmentShader, vertexShader, godRayVertexShader, godRayFragmentShader, postProcessShader } from './glsl_shaders.js';

export class FragmentationRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.composer = null;
        this.customPass = null;
        this.material = null;
        this.rayMaterial = null;
        this.core = null;
        this.frameId = null;
        this.scrollVelocity = 0;
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 4;

        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: false, // Performance boost for Post-Processing
            powerPreference: "high-performance" 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.container.appendChild(this.renderer.domElement);

        this.setupPostProcessing();
        this.addLights();
        this.createCore();
        this.createParticles();
        this.createGodRays();
        this.animate();

        window.addEventListener('resize', () => this.onResize());
    }

    setupPostProcessing() {
        const renderScene = new RenderPass(this.scene, this.camera);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // Strength
            0.4, // Radius
            0.85 // Threshold (Selective bloom for bright emissives)
        );

        this.customPass = new ShaderPass(postProcessShader);
        
        const outputPass = new OutputPass();

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderScene);
        this.composer.addPass(bloomPass);
        this.composer.addPass(this.customPass);
        this.composer.addPass(outputPass);
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        this.scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0x00F3FF, 5);
        spotLight.position.set(5, 5, 5);
        this.scene.add(spotLight);
    }

    createCore() {
        const geometry = new THREE.IcosahedronGeometry(1, 15);
        const material = new THREE.MeshStandardMaterial({
            color: 0x050505,
            emissive: 0x00F3FF,
            emissiveIntensity: 0.5, // Lower standard, high bloom
            metalness: 1.0,
            roughness: 0.0,
            transparent: true,
            opacity: 0.9
        });
        
        this.core = new THREE.Mesh(geometry, material);
        this.core.position.y = -5;
        this.scene.add(this.core);
    }

    createParticles() {
        const count = 15000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const offsets = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 8;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
            offsets[i * 3] = (Math.random() - 0.5) * 5.0;
            offsets[i * 3 + 1] = (Math.random() - 0.5) * 5.0;
            offsets[i * 3 + 2] = (Math.random() - 0.5) * 4.0;
            sizes[i] = Math.random() * 3.0 + 1.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('offset', new THREE.BufferAttribute(offsets, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uProgress: { value: 0 },
                uConvergence: { value: 0 },
                uColor: { value: new THREE.Color(0x00F3FF).multiplyScalar(1.5) } // Overbright for Selective Bloom
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            depthTest: false,
            blending: THREE.AdditiveBlending
        });

        const points = new THREE.Points(geometry, this.material);
        this.scene.add(points);
    }

    createGodRays() {
        const geometry = new THREE.PlaneGeometry(15, 15);
        this.rayMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uIntensity: { value: 0 },
                uExposure: { value: 0 },
                uColor: { value: new THREE.Color(0x00F3FF) }
            },
            vertexShader: godRayVertexShader,
            fragmentShader: godRayFragmentShader,
            transparent: true,
            depthTest: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });

        const rayMesh = new THREE.Mesh(geometry, this.rayMaterial);
        rayMesh.position.z = -2;
        this.scene.add(rayMesh);
    }

    updateTransition(progress) {
        if (this.material) this.material.uniforms.uProgress.value = progress;
        if (this.core) {
            this.core.position.y = -5 + (progress * 5.5);
            this.core.rotation.y = progress * Math.PI * 2;
        }
    }

    updateClimax(intensity, convergence) {
        if (this.rayMaterial) {
            this.rayMaterial.uniforms.uIntensity.value = intensity;
            this.rayMaterial.uniforms.uExposure.value = intensity * 0.7;
        }
        if (this.material) this.material.uniforms.uConvergence.value = convergence;
        if (this.core) {
            this.core.material.emissiveIntensity = intensity * 2.0;
        }
    }

    onResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
        this.composer.setSize(w, h);
    }

    animate() {
        this.frameId = requestAnimationFrame(() => this.animate());
        const time = performance.now() * 0.001;
        
        if (this.material) this.material.uniforms.uTime.value = time;
        if (this.rayMaterial) this.rayMaterial.uniforms.uTime.value = time;
        if (this.customPass) {
            this.customPass.uniforms.uTime.value = time;
            this.customPass.uniforms.uVelocity.value = this.scrollVelocity;
        }

        if (this.core) {
            this.core.rotation.x = time * 0.15;
            this.core.rotation.z = time * 0.05;
        }
        
        this.composer.render();
    }
}
