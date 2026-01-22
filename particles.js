let scene, camera, renderer, particles, particleSystem;
let particleCount = 12000;
let animationId;

export function initParticles() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 250;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 500;
        colors[i] = 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    animate();

    window.addEventListener('resize', onWindowResize);
}

function animate() {
    animationId = requestAnimationFrame(animate);
    
    particleSystem.rotation.y += 0.0015;
    particleSystem.rotation.x += 0.0005;

    const positions = particleSystem.geometry.attributes.position.array;
    for(let i = 0; i < particleCount; i++) {
        positions[i*3 + 1] += Math.sin(Date.now() * 0.001 + i) * 0.1;
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('canvas-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

export function updateParticleColors(hexColor) {
    const color = new THREE.Color(hexColor);
    const colors = particleSystem.geometry.attributes.color.array;
    
    gsap.to({}, {
        duration: 1.5,
        onUpdate: function() {
            const progress = this.progress();
            for (let i = 0; i < particleCount * 3; i += 3) {
                colors[i] = THREE.MathUtils.lerp(colors[i], color.r, progress);
                colors[i+1] = THREE.MathUtils.lerp(colors[i+1], color.g, progress);
                colors[i+2] = THREE.MathUtils.lerp(colors[i+2], color.b, progress);
            }
            particleSystem.geometry.attributes.color.needsUpdate = true;
        }
    });
}
