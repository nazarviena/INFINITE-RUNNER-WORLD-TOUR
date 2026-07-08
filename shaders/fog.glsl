const FOG_VS=/*glsl*/`varying vec2 vUv; varying float vD; void main(){ vec4 mvp=modelViewMatrix*vec4(position,1.); vD=-mvp.z; vUv=uv; gl_Position=projectionMatrix*mvp; }`;
const FOG_FS=/*glsl*/`uniform vec3 uFC; uniform float uFN,uFF; varying vec2 vUv; varying float vD; void main(){ float f=smoothstep(uFN,uFF,vD); gl_FragColor=vec4(uFC,f*.55); }`;
