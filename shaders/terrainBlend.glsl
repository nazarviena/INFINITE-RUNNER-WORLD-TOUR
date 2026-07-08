// Terrain Blend Shader - Infinite Runner World Tour - MagnorioBR
// Vertex
const TERRAIN_VS=/*glsl*/`
varying vec2 vUv; varying vec3 vWPos; varying vec3 vN; varying vec3 vVD;
void main(){ vec4 wp=modelMatrix*vec4(position,1.); vWPos=wp.xyz; vUv=uv; vN=normalize(mat3(modelMatrix)*normal); vec4 mvp=modelViewMatrix*vec4(position,1.); vVD=normalize(-mvp.xyz); gl_Position=projectionMatrix*mvp; }`;

// Fragment
const TERRAIN_FS=/*glsl*/`
uniform sampler2D tA,tS,tG,tD,tB; uniform vec3 uLD; varying vec2 vUv; varying vec3 vWPos,vN,vVD;
void main(){ vec4 b=texture2D(tB,vUv*5.); vec4 a=texture2D(tA,vUv*15.+.13); vec4 s=texture2D(tS,vUv*18.+.07); vec4 g=texture2D(tG,vUv*22.+.17); vec4 d=texture2D(tD,vUv*26.+.23); float t=b.r+b.g+b.b+b.a; vec4 w=b/max(t,.001); vec3 alb=a.rgb*w.r+s.rgb*w.g+g.rgb*w.b+d.rgb*w.a; float nd=max(dot(vN,uLD),0.); float amb=.25; vec3 col=alb*(amb+nd*.75); float fr=pow(1.-abs(dot(vN,vVD)),3.); col+=vec3(.04,.05,.06)*fr*w.r; gl_FragColor=vec4(col,1.); }`;
