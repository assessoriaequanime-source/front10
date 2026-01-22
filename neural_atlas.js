let scene, camera, renderer, raycaster, mouse;
let points, geometry, material;
let particleCount = 8192;
let targetPositions = [];
let currentType = 'pedro';
let animationFrameId;

const memoryFragments = [
    "Core instruction set for ethical compliance v1.2",
    "Asset allocation strategy: Diversify into L2 protocols",
    "Historical prompt pattern identified: Aggressive inquiry",
    "Neural weights for creative prose synthesis",
    "Analytical framework: Quantitative risk assessment",
    "Memory fragment: Sovereign identity proof 0x8F...",
    "User preference: Prefers concise technical summaries",
    "Sentiment analysis buffer: Contextual awareness 84%"
];

export function initNeuralAtlas() {
    const container = document.getElementById('canvas-container');
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.z = 600;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 3.0;
    mouse = new THREE.Vector2();


    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    

    const pedroPos = generatePedroLayout();
    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = pedroPos[i];
        colors[i] = 0.8; 
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    material = new THREE.PointsMaterial({
        size: 2.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);

    setupInteractions(container);
    animate();

    window.addEventListener('resize', onWindowResize);
}

function generatePedroLayout() {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / particleCount);
        const theta = Math.sqrt(particleCount * Math.PI) * phi;
        const r = 200 + Math.random() * 20;
        arr[i * 3] = r * Math.cos(theta) * Math.sin(phi);
        arr[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
}

function generateLauraLayout() {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        const r = 300 * Math.pow(Math.random(), 0.5);
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.random() * 2 * Math.PI;
        arr[i * 3] = r * Math.cos(theta) * Math.sin(phi) + (Math.random() - 0.5) * 100;
        arr[i * 3 + 1] = (Math.random() - 0.5) * 400; 
        arr[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi) + (Math.random() - 0.5) * 50;
    }
    return arr;
}

function generateLeticiaLayout() {
    const arr = new Float32Array(particleCount * 3);
    const size = Math.floor(Math.pow(particleCount, 1/3));
    const spacing = 40;
    const offset = (size * spacing) / 2;
    for (let i = 0; i < particleCount; i++) {
        const x = i % size;
        const y = Math.floor(i / size) % size;
        const z = Math.floor(i / (size * size));
        arr[i * 3] = x * spacing - offset;
        arr[i * 3 + 1] = y * spacing - offset;
        arr[i * 3 + 2] = z * spacing - offset;
    }
    return arr;
}

export function morphToAvatar(type) {
    let newPositions;
    currentType = type;
    
    if (type === 'pedro') newPositions = generatePedroLayout();
    else if (type === 'laura') newPositions = generateLauraLayout();
    else newPositions = generateLeticiaLayout();

    const currentPositions = geometry.attributes.position.array;
    
    gsap.to(currentPositions, {
        endArray: newPositions,
        duration: 2.5,
        ease: "expo.inOut",
        onUpdate: () => {
            geometry.attributes.position.needsUpdate = true;
        }
    });


    const color = new THREE.Color(type === 'laura' ? '#007FFF' : '#D4AF37');
    const colors = geometry.attributes.color.array;
    gsap.to(colors, {
        duration: 1.5,
        onUpdate: function() {
            const prog = this.progress();
            for (let i = 0; i < particleCount * 3; i += 3) {
                colors[i] = THREE.MathUtils.lerp(colors[i], color.r, prog);
                colors[i+1] = THREE.MathUtils.lerp(colors[i+1], color.g, prog);
                colors[i+2] = THREE.MathUtils.lerp(colors[i+2], color.b, prog);
            }
            geometry.attributes.color.needsUpdate = true;
        }
    });
}

export function triggerActivationPulse() {
    const colors = geometry.attributes.color.array;
    const neuralBlue = new THREE.Color('#007FFF');
    const originalColor = new THREE.Color(currentType === 'laura' ? '#007FFF' : '#D4AF37');
    
    const startIndex = Math.floor(Math.random() * (particleCount - 100)) * 3;
    const count = 300;

    gsap.to({}, {
        duration: 0.6,
        repeat: 1,
        yoyo: true,
        onUpdate: function() {
            const prog = this.progress();
            for (let i = startIndex; i < startIndex + (count * 3); i += 3) {
                if (i >= colors.length) break;
                colors[i] = THREE.MathUtils.lerp(originalColor.r, neuralBlue.r * 2, prog);
                colors[i+1] = THREE.MathUtils.lerp(originalColor.g, neuralBlue.g * 2, prog);
                colors[i+2] = THREE.MathUtils.lerp(originalColor.b, neuralBlue.b * 2, prog);
            }
            geometry.attributes.color.needsUpdate = true;
        }
    });
}

function setupInteractions(container) {
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
    });

    container.addEventListener('click', () => {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(points);

        if (intersects.length > 0) {
            const index = intersects[0].index;
            inspectFragment(index);
        }
    });
}

function inspectFragment(index) {
    const panel = document.getElementById('inspection-panel');
    const content = document.getElementById('fragment-content');
    const uuid = document.getElementById('meta-uuid');
    const sim = document.getElementById('meta-sim');

    content.innerText = memoryFragments[index % memoryFragments.length];
    uuid.innerText = `0x${index.toString(16).padStart(4, '0')}...${Math.random().toString(16).slice(2, 6)}`;
    sim.innerText = (0.8 + Math.random() * 0.19).toFixed(4);

    panel.classList.remove('translate-x-full');
    

    const colors = geometry.attributes.color.array;
    const oldR = colors[index * 3];
    const oldG = colors[index * 3 + 1];
    const oldB = colors[index * 3 + 2];

    gsap.to({}, {
        duration: 0.3,
        repeat: 3,
        yoyo: true,
        onUpdate: function() {
            colors[index * 3] = 1;
            colors[index * 3 + 1] = 1;
            colors[index * 3 + 2] = 1;
            geometry.attributes.color.needsUpdate = true;
        },
        onComplete: () => {
            colors[index * 3] = oldR;
            colors[index * 3 + 1] = oldG;
            colors[index * 3 + 2] = oldB;
            geometry.attributes.color.needsUpdate = true;
        }
    });
}

document.getElementById('close-inspection')?.addEventListener('click', () => {
    document.getElementById('inspection-panel').classList.add('translate-x-full');
});

function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    if (points) points.rotation.y += 0.001;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(points);
    const tooltip = document.getElementById('atlas-tooltip');
    
    if (intersects.length > 0 && tooltip) {
        tooltip.style.opacity = '1';
        document.getElementById('tooltip-text').innerText = `Vector ID: ${intersects[0].index}`;
    } else if (tooltip) {
        tooltip.style.opacity = '0';
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('canvas-container');
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}
