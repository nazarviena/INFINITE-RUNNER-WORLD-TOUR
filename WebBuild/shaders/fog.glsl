// Urban fog/atmospheric shader
const fogVertexShader = /* glsl */ `
varying vec2 vUv;
varying float vDepth;
void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mvPosition.z;
    vUv = uv;
    gl_Position = projectionMatrix * mvPosition;
}
`;

const fogFragmentShader = /* glsl */ `
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
varying vec2 vUv;
varying float vDepth;

void main() {
    float fogFactor = smoothstep(uFogNear, uFogFar, vDepth);
    gl_FragColor = vec4(uFogColor, fogFactor * 0.6);
}
`;

export { fogVertexShader, fogFragmentShader };
