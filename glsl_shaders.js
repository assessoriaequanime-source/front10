export const vertexShader = `
    uniform float uTime;
    uniform float uProgress;
    uniform float uConvergence;
    attribute vec3 offset;
    attribute float size;
    varying float vAlpha;

    void main() {
        vec3 pos = position;
        

        float wave = sin(uTime * 2.0 + length(position) * 0.5) * 0.2;
        pos += offset * (1.0 - uProgress) + wave;
        

        pos *= (1.0 - uConvergence * 0.8);
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
        vAlpha = (1.0 - uConvergence * 0.5);
    }
`;

export const fragmentShader = `
    uniform vec3 uColor;
    varying float vAlpha;

    void main() {
        float dist = distance(gl_PointCoord, vec2(0.5));
        if (dist > 0.5) discard;
        float strength = 1.0 - (dist * 2.0);
        gl_FragColor = vec4(uColor, strength * vAlpha);
    }
`;

export const godRayVertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

export const godRayFragmentShader = `
    uniform float uTime;
    uniform float uIntensity;
    uniform float uExposure;
    uniform vec3 uColor;
    varying vec2 vUv;

    void main() {
        vec2 uv = vUv - 0.5;
        float angle = atan(uv.y, uv.x);
        float dist = length(uv);
        
        float rays = sin(angle * 12.0 + uTime) * sin(angle * 7.0 - uTime * 0.5);
        rays *= smoothstep(0.5, 0.2, dist);
        
        vec3 finalColor = uColor * rays * uIntensity * uExposure;
        gl_FragColor = vec4(finalColor, rays * uIntensity);
    }
`;

export const postProcessShader = {
    uniforms: {
        "tDiffuse": { value: null },
        "uTime": { value: 0 },
        "uVelocity": { value: 0 },
        "uVignette": { value: 1.2 },
        "uGrain": { value: 0.05 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        uniform float uVelocity;
        uniform float uVignette;
        uniform float uGrain;
        varying vec2 vUv;

        float random(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {

            float amount = uVelocity * 0.05;
            vec4 cr = texture2D(tDiffuse, vUv + vec2(amount, 0.0));
            vec4 cg = texture2D(tDiffuse, vUv);
            vec4 cb = texture2D(tDiffuse, vUv - vec2(amount, 0.0));
            
            vec4 color = vec4(cr.r, cg.g, cb.b, cg.a);
            

            float grain = (random(vUv + uTime) - 0.5) * uGrain;
            color.rgb += grain;
            

            float dist = distance(vUv, vec2(0.5));
            color.rgb *= smoothstep(0.8, 0.35, dist * uVignette);
            
            gl_FragColor = color;
        }
    `
};
