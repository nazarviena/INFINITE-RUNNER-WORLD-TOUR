// =============================================================================
// INFINITE RUNNER: WORLD TOUR - Terrain Blend Shader
// Autor: MagnorioBR
// Mix de texturas de terreno (asfalto, grama, calcada)
// =============================================================================

// Vertex Shader
const terrainVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vUv = uv;
    vNormal = normalize(mat3(modelMatrix) * normal);
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    
    gl_Position = projectionMatrix * mvPosition;
}
`;

// Fragment Shader
const terrainFragmentShader = /* glsl */ `
uniform sampler2D uAsphaltTex;
uniform sampler2D uSidewalkTex;
uniform sampler2D uGrassTex;
uniform sampler2D uBlendMap;
uniform float uTime;
uniform vec3 uLightDir;

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
    // Amostrar blend map (R = asfalto, G = calcada, B = grama)
    vec4 blend = texture2D(uBlendMap, vUv * 10.0);
    
    // Ajustar tiling diferente para cada textura
    vec2 asphaltUV = vUv * 20.0;
    vec2 sidewalkUV = vUv * 25.0 + vec2(0.13, 0.0);
    vec2 grassUV = vUv * 30.0 + vec2(0.0, 0.17);
    
    // Amostrar texturas
    vec4 asphalt = texture2D(uAsphaltTex, asphaltUV);
    vec4 sidewalk = texture2D(uSidewalkTex, sidewalkUV);
    vec4 grass = texture2D(uGrassTex, grassUV);
    
    // Normalizar pesos do blend
    float totalWeight = blend.r + blend.g + blend.b;
    vec3 weights = blend.rgb / max(totalWeight, 0.001);
    
    // Misturar texturas
    vec3 albedo = asphalt.rgb * weights.r + sidewalk.rgb * weights.g + grass.rgb * weights.b;
    
    // Iluminacao simples
    float NdotL = max(dot(vNormal, uLightDir), 0.0);
    float ambient = 0.3;
    float diffuse = ambient + NdotL * 0.7;
    
    vec3 color = albedo * diffuse;
    
    // Fresnel nas bordas (umidade)
    float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 3.0);
    color += vec3(0.1, 0.12, 0.15) * fresnel * weights.r; // asfalto brilha mais
    
    gl_FragColor = vec4(color, 1.0);
}
`;

export { terrainVertexShader, terrainFragmentShader };
