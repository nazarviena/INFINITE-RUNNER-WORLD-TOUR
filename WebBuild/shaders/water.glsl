// Water shader for fountains/water features
const waterVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorldPos;
void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const waterFragmentShader = /* glsl */ `
uniform float uTime;
varying vec2 vUv;
varying vec3 vWorldPos;

void main() {
    vec2 uv = vUv * 4.0;
    uv.x += sin(uv.y * 3.0 + uTime) * 0.02;
    uv.y += cos(uv.x * 2.0 + uTime * 0.7) * 0.02;
    
    vec3 waterColor = vec3(0.1, 0.3, 0.6);
    vec3 highlight = vec3(0.3, 0.5, 0.8);
    
    float wave = sin(uv.x * 10.0 + uTime) * cos(uv.y * 8.0 + uTime * 0.8) * 0.5 + 0.5;
    
    vec3 color = mix(waterColor, highlight, wave * 0.3);
    float alpha = 0.8;
    
    gl_FragColor = vec4(color, alpha);
}
`;

export { waterVertexShader, waterFragmentShader };
