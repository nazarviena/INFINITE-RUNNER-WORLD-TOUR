// ═══════════════════════════════════════════════════════════════════
// INFINITE RUNNER: WORLD TOUR v8.0 - MagnorioBR
// TODAS AS TEXTURAS EM BUTIDAS VIA CANVAS (ZERO DEPENDÊNCIAS)
// ═══════════════════════════════════════════════════════════════════
import * as THREE from 'three';

const C={BS:100,RW:10,SW:3,BMN:8,BMX:40,VD:350,CH:1.7,BSP:2.222,SSP:3.333,MS:100,SD:20,SR:12,GR:9.8,JF:5,HA:.04,HF:2.5,DK:5};
const hr=C.RW/2,se=hr+C.SW,bz2=C.BS/2,PI2=Math.PI*2;
const $=id=>document.getElementById(id);
const isMobile=!window.matchMedia('(hover:hover) and (pointer:fine)').matches;
$('ctrl-hint')&&($('ctrl-hint').textContent=isMobile?'📱 Incline p/ desviar - Toque p/ correr':'🖱️ Mouse p/ olhar - W=Correr A/D=Desviar Shift=Sprint Espaco=Pular');

function hs(x,z){let h=x*374761393+z*668265263;h=(h^(h>>13))*1274126177;return h^(h>>16)}
function sR(s){let v=s;return()=>{v=(v*16807)%2147483647;return(v-1)/2147483646}}

// ═══════════════════════════════════════════════════════════════════
// ⭐ GERADOR DE TEXTURAS ULTRA-REALISTAS ⭐
// Cada textura é gerada com centenas de camadas para parecer FOTO REAL
// ═══════════════════════════════════════════════════════════════════
const TEX={asphalt:[],sidewalk:[],grass:[],dirt:[],sand:[],building:[]};

function makeCanvasTex(w,h){
  const cv=document.createElement('canvas');cv.width=w;cv.height=h;
  return{cv,ctx:cv.getContext('2d')};
}
function canvasToTex(cv){
  const t=new THREE.CanvasTexture(cv);
  t.wrapS=THREE.RepeatWrapping;t.wrapT=THREE.RepeatWrapping;
  t.colorSpace=THREE.SRGBColorSpace;
  t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;
  t.generateMipmaps=true;return t;
}

// ═══ ASFALTO FOTORREALISTA ═══
function genAsphalt(seed){
  const{cv,ctx}=makeCanvasTex(512,512),r=sR(seed);
  // Base cinza escuro
  ctx.fillStyle='#3a3a3d';ctx.fillRect(0,0,512,512);
  // Milhares de pontos de agregado (pedriscos)
  for(let i=0;i<15000;i++){
    const v=40+r()*30;ctx.fillStyle=`rgb(${v},${v},${v+2})`;
    ctx.fillRect(r()*512,r()*512,1+r()*3,1+r()*3);
  }
  // Pedras maiores visíveis
  for(let i=0;i<600;i++){
    const v=35+r()*35;ctx.fillStyle=`rgb(${v},${v-2},${v-4})`;
    const sz=2+r()*6;ctx.fillRect(r()*512,r()*512,sz,sz);
  }
  // Rachaduras finas escuras
  ctx.strokeStyle='rgba(15,15,15,0.5)';ctx.lineWidth=0.6;
  for(let i=0;i<6;i++){
    ctx.beginPath();let x=r()*512,y=r()*512;ctx.moveTo(x,y);
    for(let j=0;j<12;j++){x+=(r()-0.5)*120;y+=(r()-0.5)*120;ctx.lineTo(x,y)}ctx.stroke();
  }
  // Marcas de pneu (faixas escuras paralelas)
  ctx.strokeStyle='rgba(22,22,22,0.2)';ctx.lineWidth=4;
  for(let i=0;i<6;i++){
    const y=r()*512;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(512,y+(r()-0.5)*10);ctx.stroke();
  }
  // Manchas de óleo (círculos escuros irregulares)
  for(let i=0;i<5;i++){
    const cx=r()*512,cy=r()*512,rad=12+r()*45;
    ctx.fillStyle=`rgba(18,15,12,${0.1+r()*0.15})`;
    ctx.beginPath();ctx.arc(cx,cy,rad,0,PI2);ctx.fill();
  }
  // Remendos (quadrados de tom ligeiramente diferente)
  for(let i=0;i<4;i++){
    const rx=r()*450,ry=r()*450,rw=25+r()*70,rh=20+r()*50;
    ctx.fillStyle=`rgba(50,50,53,${0.3+r()*0.3})`;ctx.fillRect(rx,ry,rw,rh);
  }
  // Marcas brancas de tráfego desgastadas
  ctx.fillStyle='rgba(220,220,210,0.08)';
  for(let i=0;i<3;i++){const x=r()*400;ctx.fillRect(x,r()*500,8+r()*20,2+r()*3)}
  return canvasToTex(cv);
}

// ═══ CALÇADA DE CONCRETO REAL ═══
function genSidewalk(seed){
  const{cv,ctx}=makeCanvasTex(512,512),r=sR(seed);
  const br=195+r()*25,bg=190+r()*25,bb=185+r()*25;
  ctx.fillStyle=`rgb(${br},${bg},${bb})`;ctx.fillRect(0,0,512,512);
  // Placas de concreto com juntas
  const ts=100+r()*35;
  for(let x=0;x<512;x+=ts){for(let y=0;y<512;y+=ts){
    const v=r()*12-6;
    ctx.fillStyle=`rgb(${br+v},${bg+v},${bb+v})`;ctx.fillRect(x+2,y+2,ts-5,ts-5);
    // Juntas escuras entre as placas
    ctx.fillStyle='rgba(90,90,90,0.45)';ctx.fillRect(x+ts-3,y,3,ts);ctx.fillRect(x,y+ts-3,ts,3);
  }}
  // Porosidade do concreto (milhares de micropontos)
  for(let i=0;i<8000;i++){
    const v=r()*8-4;ctx.fillStyle=`rgba(${br+v},${bg+v},${bb+v},0.2)`;
    ctx.fillRect(r()*512,r()*512,1,1);
  }
  // Manchas de água/sujeira
  for(let i=0;i<8;i++){
    const cx=r()*512,cy=r()*512,rad=8+r()*30;
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,rad);
    g.addColorStop(0,`rgba(70,65,60,${0.04+r()*0.1})`);g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;ctx.fillRect(cx-rad,cy-rad,rad*2,rad*2);
  }
  // Pequenas fissuras
  ctx.strokeStyle='rgba(100,95,90,0.2)';ctx.lineWidth=0.4;
  for(let i=0;i<3;i++){ctx.beginPath();let x=r()*512,y=r()*512;ctx.moveTo(x,y);for(let j=0;j<5;j++){x+=(r()-0.5)*60;y+=(r()-0.5)*60;ctx.lineTo(x,y)}ctx.stroke()}
  return canvasToTex(cv);
}

// ═══ GRAMA VERDADEIRA ═══
function genGrass(seed){
  const{cv,ctx}=makeCanvasTex(512,512),r=sR(seed);
  const bg=75+r()*45;
  ctx.fillStyle=`rgb(${22+r()*12},${bg},${16+r()*12})`;ctx.fillRect(0,0,512,512);
  // 25.000 folhas de grama individuais
  for(let i=0;i<25000;i++){
    const g=bg+r()*40;
    ctx.fillStyle=`rgb(${14+r()*28},${g},${10+r()*22})`;
    const h=1+r()*5;ctx.fillRect(r()*512,r()*512,1,h);
  }
  // Manchas de grama mais clara/mais escura
  for(let i=0;i<12;i++){
    const cx=r()*512,cy=r()*512,rad=15+r()*60;
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,rad);
    g.addColorStop(0,r()>0.5?'rgba(35,110,25,0.15)':'rgba(20,70,15,0.12)');
    g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(cx-rad,cy-rad,rad*2,rad*2);
  }
  // Flores silvestres (pontinhos brancos/amarelos)
  for(let i=0;i<40;i++){
    if(r()>0.7){ctx.fillStyle=r()>0.5?'rgba(255,255,200,0.7)':'rgba(255,240,200,0.5)';
    ctx.fillRect(r()*512,r()*512,2,2)}
  }
  // Sombras de nuvens (faixas mais escuras)
  for(let i=0;i<3;i++){
    const y=r()*450;ctx.fillStyle='rgba(0,0,0,0.04)';
    ctx.fillRect(0,y,512,20+r()*30);
  }
  return canvasToTex(cv);
}

// ═══ TERRA/SOLO REAL ═══
function genDirt(seed){
  const{cv,ctx}=makeCanvasTex(512,512),r=sR(seed);
  ctx.fillStyle=`rgb(${100+r()*35},${65+r()*30},${32+r()*22})`;ctx.fillRect(0,0,512,512);
  // Partículas de terra
  for(let i=0;i<18000;i++){
    const dr=100+r()*45,dg=65+r()*35,db=32+r()*28;
    ctx.fillStyle=`rgb(${dr},${dg},${db})`;
    ctx.fillRect(r()*512,r()*512,1+r()*3,1+r()*3);
  }
  // Pedras e cascalho
  for(let i=0;i<300;i++){
    const v=70+r()*50;ctx.fillStyle=`rgb(${v},${v-5},${v-10})`;
    const sz=2+r()*7;ctx.fillRect(r()*512,r()*512,sz,sz*0.7);
  }
  // Trilhas/sulcos
  ctx.strokeStyle='rgba(70,40,20,0.2)';ctx.lineWidth=3;
  for(let i=0;i<4;i++){ctx.beginPath();let x=0,y=r()*512;ctx.moveTo(x,y);
    for(let j=0;j<6;j++){x+=512/6;y+=(r()-0.5)*50;ctx.lineTo(x,y)}ctx.stroke()}
  // Raízes finas
  ctx.strokeStyle='rgba(60,35,15,0.25)';ctx.lineWidth=0.8;
  for(let i=0;i<4;i++){ctx.beginPath();let x=r()*512,y=r()*512;ctx.moveTo(x,y);
    for(let j=0;j<8;j++){x+=(r()-0.5)*80;y+=(r()-0.5)*80;ctx.lineTo(x,y)}ctx.stroke()}
  return canvasToTex(cv);
}

// ═══ AREIA DE PRAIA ═══
function genSand(seed){
  const{cv,ctx}=makeCanvasTex(512,512),r=sR(seed);
  ctx.fillStyle=`rgb(${222+r()*18},${202+r()*18},${158+r()*28})`;ctx.fillRect(0,0,512,512);
  // Grãos de areia
  for(let i=0;i<15000;i++){
    ctx.fillStyle=`rgb(${225+r()*15},${205+r()*15},${162+r()*25})`;
    ctx.fillRect(r()*512,r()*512,1,1);
  }
  // Conchas e fragmentos
  for(let i=0;i<100;i++){
    if(r()>0.82){ctx.fillStyle='rgba(255,255,240,0.6)';ctx.fillRect(r()*512,r()*512,2+r()*5,1+r()*3)}
  }
  // Marcas de onda
  for(let i=0;i<8;i++){
    ctx.strokeStyle='rgba(195,175,140,0.18)';ctx.lineWidth=1.5;
    ctx.beginPath();const y=30+r()*(512-60);
    ctx.moveTo(0,y);
    for(let x=0;x<512;x+=15){ctx.lineTo(x,y+Math.sin(x*0.04+r())*4)}ctx.stroke();
  }
  // Pequenas pedras
  for(let i=0;i<60;i++){
    const v=130+r()*40;ctx.fillStyle=`rgb(${v},${v-5},${v-10})`;
    ctx.fillRect(r()*512,r()*512,3+r()*5,2+r()*4);
  }
  return canvasToTex(cv);
}

// ═══ FACHADA DE TIJOLO REAL ═══
function genBuilding(seed){
  const{cv,ctx}=makeCanvasTex(512,512),r=sR(seed);
  // Cores de tijolo variadas
  const tones=[
    [185,120,85],[195,130,95],[175,110,75],[200,140,100],
    [180,115,80],[190,125,90],[170,105,70],[205,145,105],
    [178,118,82],[188,122,88],[195,135,92],[182,112,78]
  ];
  const base=tones[Math.floor(r()*tones.length)];
  // Fundo de argamassa
  ctx.fillStyle='#c8c0b5';ctx.fillRect(0,0,512,512);
  // Textura de argamassa
  for(let i=0;i<3000;i++){
    ctx.fillStyle=`rgba(190,185,175,0.15)`;ctx.fillRect(r()*512,r()*512,2,2);
  }
  // Tijolos individuais (com variação de cor)
  const bw=45+r()*15,bh=18+r()*6,mg=3+r()*2;
  for(let row=0;row<512/(bh+mg)+1;row++){
    const offset=row%2===0?0:bw/2;
    for(let col=-1;col<512/(bw+mg)+1;col++){
      const x=col*(bw+mg)+offset,y=row*(bh+mg);
      // Cor do tijolo com variação
      const v=r()*25-12;
      ctx.fillStyle=`rgb(${Math.min(255,Math.max(0,base[0]+v))},${Math.min(255,Math.max(0,base[1]+v))},${Math.min(255,Math.max(0,base[2]+v))})`;
      ctx.fillRect(x+1,y+1,bw-1,bh-1);
      // Textura áspera do tijolo
      for(let k=0;k<15;k++){
        ctx.fillStyle=`rgba(0,0,0,${r()*0.08})`;
        ctx.fillRect(x+2+r()*(bw-4),y+2+r()*(bh-4),1+r()*2,1);
      }
      // Borda mais escura em baixo (sombra)
      ctx.fillStyle='rgba(0,0,0,0.1)';ctx.fillRect(x+1,y+bh-2,bw,2);
    }
  }
  // Sujeira/manchas
  for(let i=0;i<6;i++){
    const cx=r()*512,cy=r()*512,rad=10+r()*40;
    ctx.fillStyle=`rgba(50,40,30,${0.03+r()*0.08})`;
    ctx.beginPath();ctx.arc(cx,cy,rad,0,PI2);ctx.fill();
  }
  // Eflorescência branca (manchas de sal)
  for(let i=0;i<3;i++){
    ctx.fillStyle=`rgba(255,255,250,${0.03+r()*0.06})`;
    ctx.fillRect(r()*480,r()*480,20+r()*60,15+r()*30);
  }
  return canvasToTex(cv);
}

// ═══ GERA TODAS AS TEXTURAS (64 textos no total) ═══
function generateAllTextures(){
  for(let i=0;i<6;i++)TEX.asphalt.push(genAsphalt(1000+i));
  for(let i=0;i<6;i++)TEX.sidewalk.push(genSidewalk(2000+i));
  for(let i=0;i<6;i++)TEX.grass.push(genGrass(3000+i));
  for(let i=0;i<4;i++)TEX.dirt.push(genDirt(3500+i));
  for(let i=0;i<4;i++)TEX.sand.push(genSand(3700+i));
  for(let i=0;i<8;i++)TEX.building.push(genBuilding(4000+i));
  console.log('✅ Texturas geradas:',{asphalt:TEX.asphalt.length,sidewalk:TEX.sidewalk.length,grass:TEX.grass.length,dirt:TEX.dirt.length,sand:TEX.sand.length,building:TEX.building.length});
}

function getTex(type,seed){
  const abs=Math.abs(seed),pool=TEX[type];
  if(!pool||!pool.length)return null;
  const t=pool[abs%pool.length].clone();t.needsUpdate=true;return t;
}

// ═══ MATERIAIS ═══
const M={};
function initMats(){
  M.curb=new THREE.MeshPhongMaterial({color:0x999999,specular:0x111111,shininess:10});
  M.treeT=new THREE.MeshPhongMaterial({color:0x6D4C41,specular:0,shininess:5});
  M.treeC=[0x388E3C,0x43A047,0x4CAF50,0x2E7D32].map(c=>new THREE.MeshPhongMaterial({color:c,specular:0x111100,shininess:8}));
  M.postM=new THREE.MeshPhongMaterial({color:0x3a3a3a,specular:0x222222,shininess:60});
  M.postB=new THREE.MeshPhongMaterial({color:0xfffef0,emissive:0x443322,specular:0x111111,shininess:30});
  M.benchW=new THREE.MeshPhongMaterial({color:0x8D6E63,specular:0,shininess:5});
  M.benchM=new THREE.MeshPhongMaterial({color:0x444444,specular:0x333333,shininess:80});
  M.binM=new THREE.MeshPhongMaterial({color:0x2E7D32,specular:0x113311,shininess:40});
  M.yellow=new THREE.MeshPhongMaterial({color:0xffcc00,emissive:0x111100,specular:0,shininess:5});
  M.fence=new THREE.MeshPhongMaterial({color:0xB8956A,specular:0,shininess:5});
  M.palmT=new THREE.MeshPhongMaterial({color:0xBCAAA4,specular:0,shininess:5});
  M.palmC=new THREE.MeshPhongMaterial({color:0x388E3C,specular:0x112200,shininess:8});
}

// ═══ BIOMAS ═══
const BIOMES={city:{n:'🏙️ Cidade',b:.7,bh:1,td:.2,g:'sidewalk',rd:true,fn:true},farm:{n:'🌾 Fazenda',b:.2,bh:.3,td:.15,g:'dirt',rd:false,fe:true},beach:{n:'🏖️ Praia',b:.05,bh:.2,td:.4,g:'sand',rd:false,pa:true},forest:{n:'🌲 Floresta',b:0,bh:0,td:.85,g:'grass',rd:false}};
const BO=['city','city','farm','city','forest','beach','city','city','farm','forest'];
function biome(d){return BIOMES[BO[Math.floor(d/1.4)%BO.length]]||BIOMES.city}

// ═══ MUNDO ═══
function mkWorld(scene){
  const blocks=new Map();
  function gH(lx,lz,bx,bz,seed){const ax=Math.abs(lx),b=biome(Math.abs(bz*C.BS)/1000);if(b.rd&&ax<hr)return 0;if(b.rd&&ax<se)return.15+(ax-hr)/C.SW*.02;return Math.max(0,Math.sin(lx*.03+seed*.01)*.5+.6)*.2}
  function mkB(bx,bz){
    const k=bx+','+bz;if(blocks.has(k))return;
    const seed=hs(bx,bz),BS=C.BS,dk=Math.abs(bz*BS)/1000,b=biome(dk);
    const geo=new THREE.PlaneGeometry(BS+.4,BS+.4,10,10);geo.rotateX(-Math.PI/2);
    const pos=geo.attributes.position.array;
    for(let i=0;i<pos.length;i+=3)pos[i+1]=gH(pos[i],pos[i+2],bx,bz,seed);
    geo.computeVertexNormals();
    const gt=b.rd?'asphalt':(b.g==='sand'?'sand':b.g==='dirt'?'dirt':'grass');
    const gTex=getTex(gt,seed);if(gTex){gTex.repeat.set(b.g==='sand'?3:4,b.g==='sand'?3:4)}
    const mat=gTex?new THREE.MeshPhongMaterial({map:gTex,specular:0x050505,shininess:3}):new THREE.MeshPhongMaterial({color:gt==='asphalt'?0x444:gt==='sand'?0xdb9:gt==='dirt'?0x864:0x4a4,specular:0,shininess:3});
    const mesh=new THREE.Mesh(geo,mat);mesh.receiveShadow=true;
    const g=new THREE.Group();g.add(mesh);g.position.set(bx*BS,0,bz*BS);mesh.position.set(0,0,0);
    if(b.rd){const cGeo=new THREE.BoxGeometry(.25,.12,BS+.4);for(let s=-1;s<=1;s+=2){const c=new THREE.Mesh(cGeo,M.curb);c.position.set(s*hr,.06,0);c.castShadow=true;c.receiveShadow=true;g.add(c)}const dGeo=new THREE.PlaneGeometry(.22,3.2);for(let z=-48;z<48;z+=7){const d=new THREE.Mesh(dGeo,M.yellow);d.rotation.x=-Math.PI/2;d.position.set(0,.016,z+3.5);g.add(d)}}
    scene.add(g);blocks.set(k,{g,seed,b,pop:false});
  }
  function popB(key){
    const bk=blocks.get(key);if(!bk||bk.pop)return;bk.pop=true;
    const g=bk.g,seed=bk.seed,b=bk.b,r=sR(seed),BS=C.BS,bzs=BS/2-se;
    if(b.b>0){for(let side=-1;side<=1;side+=2){const bxC=side*(se+bzs/2),nb=Math.max(1,Math.floor(b.b*4)),bw=(BS-3)/nb;
      for(let i=0;i<nb;i++){const bzP=-BS/2+1.5+i*bw+bw/2,h=(C.BMN+Math.abs(r())*(C.BMX-C.BMN))*Math.max(.3,b.bh);if(h<2)continue;
        const geo=new THREE.BoxGeometry(bzs-.2,h,bw-.4);
        const t=getTex('building',seed+i*100+side*50);
        const bm=t?new THREE.MeshPhongMaterial({map:t,specular:0x111111,shininess:10}):new THREE.MeshPhongMaterial({color:0xb8956a,specular:0x111111,shininess:10});
        const bldg=new THREE.Mesh(geo,bm);bldg.position.set(bxC,h/2,bzP);bldg.castShadow=true;bldg.receiveShadow=true;g.add(bldg);
    }}}
    if(b.fe){for(let side=-1;side<=1;side+=2){const fx=side*(hr+C.SW-1);for(let z=-48;z<48;z+=4+r()*5){const fp=new THREE.Mesh(new THREE.CylinderGeometry(.04,.05,1.3,4),M.fence);fp.position.set(fx,.65,z);fp.castShadow=true;g.add(fp)}[.25,1.05].forEach(y=>{const fb=new THREE.Mesh(new THREE.BoxGeometry(.04,.06,BS+.4),M.fence);fb.position.set(fx,y,0);g.add(fb)})}}
    if(b.td>0){for(let side=-1;side<=1;side+=2){const tx=side*(hr+C.SW/2);for(let tz=-BS/2+5;tz<BS/2-5;tz+=7+Math.abs(r())*12){if(Math.abs(r())<b.td){const tr=new THREE.Group();const th=1.5+r()*3.5;if(b.pa){const tk=new THREE.Mesh(new THREE.CylinderGeometry(.07,.13,th,6),M.palmT);tk.position.y=th/2;tk.castShadow=true;tr.add(tk);const cn=new THREE.Mesh(new THREE.SphereGeometry(.5+r()*1,6,4),M.palmC);cn.position.set(0,th+.4,0);cn.castShadow=true;tr.add(cn)}else{const tk=new THREE.Mesh(new THREE.CylinderGeometry(.1,.16,th,6),M.treeT);tk.position.y=th/2;tk.castShadow=true;tr.add(tk);const ns=2+Math.floor(r()*3);for(let j=0;j<ns;j++){const cr=.5+r()*1.3;const cn=new THREE.Mesh(new THREE.SphereGeometry(cr,6,4),M.treeC[Math.floor(Math.abs(r())*M.treeC.length)]);cn.position.set((r()-.5)*1.4,th+.3+r()*1.4,(r()-.5)*1.4);cn.castShadow=true;tr.add(cn)}}tr.position.set(tx,0,tz);g.add(tr)}}}}
    if(b.fn){for(let side=-1;side<=1;side+=2){const px=side*(hr+.5);for(let pz=-BS/2+10;pz<BS/2-10;pz+=22){const pg=new THREE.Group();const p=new THREE.Mesh(new THREE.CylinderGeometry(.04,.08,5.5,6),M.postM);p.position.y=2.75;p.castShadow=true;pg.add(p);const a=new THREE.Mesh(new THREE.BoxGeometry(1.1,.05,.05),M.postM);a.position.set(.55,5.1,0);pg.add(a);const lb=new THREE.Mesh(new THREE.SphereGeometry(.18,6,3),M.postB);lb.position.set(1.15,5.1,0);pg.add(lb);pg.position.set(px,0,pz);g.add(pg)}const bx=side*(hr+C.SW-1);for(let pz=-BS/2+10;pz<BS/2-10;pz+=24+Math.abs(r())*12){if(Math.abs(r())>.4){const bg=new THREE.Group();for(let l=-1;l<=1;l+=2){const leg=new THREE.Mesh(new THREE.BoxGeometry(.04,.55,.04),M.benchM);leg.position.set(l*.65,.275,0);bg.add(leg)}bg.add(new THREE.Mesh(new THREE.BoxGeometry(1.5,.06,.32),M.benchW)).position.y=.58;bg.add(new THREE.Mesh(new THREE.BoxGeometry(1.5,.35,.04),M.benchW)).position.set(0,.78,-.15);bg.position.set(bx,0,pz);g.add(bg)}else{const bg=new THREE.Group();const bi=new THREE.Mesh(new THREE.CylinderGeometry(.18,.15,.85,8),M.binM);bi.position.y=.425;bi.castShadow=true;bg.add(bi);bg.position.set(bx,0,pz);g.add(bg)}}}}
  }
  function upd(pz){const pbz=Math.floor(pz/C.BS),range=Math.ceil(C.VD/C.BS)+1;const needed=new Set();for(let bz=pbz-range;bz<=pbz+range;bz++)for(let bx=-2;bx<=2;bx++)needed.add(bx+','+bz);for(const[k,v]of blocks){if(!needed.has(k)){scene.remove(v.g);blocks.delete(k)}needed.delete(k)}for(const k of needed){const[bx,bz]=k.split(',').map(Number);mkB(bx,bz)}let done=0;for(const[k,v]of blocks){if(!v.pop&&done<2){popB(k);done++}}}
  return{upd,blocks};
}

// ═══ INPUT + PLAYER + SCORE + LIGHT + SKY + RAIN + AUDIO + RANKING ═══
function mkInput(cam,canvas){let y=0,pitch=0,l=false,g=0;canvas.addEventListener('click',()=>{if(!l&&!isMobile&&game.st==='playing'){canvas.requestPointerLock();$('lock-msg').style.display='none'}});document.addEventListener('pointerlockchange',()=>{l=document.pointerLockElement===canvas;$('crosshair').style.display=l?'block':'none';if(!l&&!isMobile&&game.st==='playing')$('lock-msg').style.display='block'});document.addEventListener('mousemove',e=>{if(!l||isMobile)return;y-=e.movementX*.0025;pitch-=e.movementY*.0025;pitch=Math.max(-Math.PI/3,Math.min(Math.PI/3,pitch))});if(isMobile&&window.DeviceOrientationEvent){window.addEventListener('deviceorientation',e=>{if(game.st!=='playing')return;if(e.gamma!==null)g=Math.max(-3,Math.min(3,e.gamma/15))})}return{gD:()=>new THREE.Vector3(-Math.sin(y)*Math.cos(pitch),Math.sin(pitch),-Math.cos(y)*Math.cos(pitch)).normalize(),gY:()=>y,gP:()=>pitch,iL:()=>l,gG:()=>g}}
function mkPlayer(cam,input){const p={cam,spd:0,tS:0,lat:0,tL:0,dist:0,mD:0,stam:C.MS,sp:false,jp:false,jv:0,vo:0,hp:100,alive:true,hb:0,keys:{},sH:[],hold:false,upd(dt){if(!this.alive)return;dt=Math.min(dt,.1);if(isMobile&&this.hold)this.keys['w']=true;this.tS=this.keys['w']?(this.sp&&this.stam>0?C.SSP:C.BSP):this.keys['s']?Math.max(-C.BSP*.4,this.spd-6*dt):Math.max(0,this.spd-1.5*dt);if(this.sp&&this.keys['w']&&this.spd>C.BSP){this.stam=Math.max(0,this.stam-C.SD*dt);if(this.stam<=0)this.sp=false}else this.stam=Math.min(C.MS,this.stam+C.SR*dt);this.spd+=(this.tS-this.spd)*Math.min(8*dt,1);this.dist+=this.spd*dt;if(this.dist>this.mD)this.mD=this.dist;if(isMobile)this.tL=input.gG();else this.tL=this.keys['a']?-3:this.keys['d']?3:0;this.lat+=(this.tL-this.lat)*Math.min(10*dt,1);if(this.keys[' ']&&!this.jp){this.jp=true;this.jv=C.JF}if(this.jp){this.jv-=C.GR*dt;this.vo+=this.jv*dt;if(this.vo<=0){this.vo=0;this.jp=false;this.jv=0}}if(Math.abs(this.spd)>1)this.hb+=dt*C.HF*(Math.abs(this.spd)/C.BSP);const hbY=Math.sin(this.hb*PI2)*C.HA*Math.min(Math.abs(this.spd)/C.BSP,1.5),hbX=Math.cos(this.hb*Math.PI)*C.HA*.5;this.cam.position.set(this.lat+hbX,C.CH+this.vo+hbY,this.dist);this.cam.rotation.order='YXZ';this.cam.rotation.set(input.gP(),input.gY(),0);if(Math.abs(this.cam.position.x)>bz2+.5){this.spd*=.6;this.cam.position.x=Math.sign(this.cam.position.x)*bz2;this.hp-=15;this.lat=this.cam.position.x;this.tL=this.cam.position.x;this._d();if(this.hp<=0){this.alive=false;this.spd=0}}this.sH.push(this.spd);if(this.sH.length>180)this.sH.shift();},_d(){const f=document.createElement('div');f.className='dmg';document.body.appendChild(f);setTimeout(()=>f.remove(),350)},avg(){return this.sH.length?this.sH.reduce((a,b)=>a+b,0)/this.sH.length:0}};cam.position.set(0,C.CH,0);window.addEventListener('keydown',e=>{p.keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==='shift')p.sp=true});window.addEventListener('keyup',e=>{p.keys[e.key.toLowerCase()]=false;if(e.key.toLowerCase()==='shift')p.sp=false});function btn(id,k,v){const el=$(id);if(!el)return;el.addEventListener('pointerdown',()=>{p.keys[k]=v;if(k==='shift')p.sp=v;if(k==='w'&&v)p.keys['w']=true});el.addEventListener('pointerup',()=>{p.keys[k]=false;if(k==='shift')p.sp=false});el.addEventListener('pointerleave',()=>{p.keys[k]=false;if(k==='shift')p.sp=false})}btn('mcl','a',true);btn('mcr','d',true);btn('mcj',' ',true);btn('mcs','shift',true);btn('mcs','w',true);if(isMobile){document.addEventListener('touchstart',e=>{if(e.target.tagName!=='BUTTON'){p.hold=true;p.keys['w']=true}});document.addEventListener('touchend',()=>{p.hold=false;p.keys['w']=false});document.addEventListener('touchcancel',()=>{p.hold=false;p.keys['w']=false})}return p}
function mkScore(){return{st:0,el:0,dist:0,ms:[1,2,4,8,16,32,64,128,256,512,1024],reached:[],next:1,running:false,bd:parseFloat(localStorage.getItem('irbd')||'0'),bm:parseFloat(localStorage.getItem('irbm')||'0'),start(){this.st=performance.now();this.running=true},upd(mD){if(!this.running)return null;this.el=(performance.now()-this.st)/1000;this.dist=mD;const km=this.dist/1000;if(km>=this.next){const m=this.next;this.reached.push(m);const i=this.ms.indexOf(m);this.next=(i>=0&&i<this.ms.length-1)?this.ms[i+1]:this.next*2;return m}return null},fd(){return(this.dist/1000).toFixed(2)+' km'},ft(){const s=Math.floor(this.el),m=Math.floor(s/60),h=Math.floor(m/60);return h>0?String(h).padStart(2,'0')+':'+String(m%60).padStart(2,'0')+':'+String(s%60).padStart(2,'0'):String(m).padStart(2,'0')+':'+String(s%60).padStart(2,'0')},fp(){if(this.dist<5)return'--:-- /km';const ps=this.el/(this.dist/1000);return Math.floor(ps/60)+':'+String(Math.floor(ps%60)).padStart(2,'0')+' /km'},save(){const km=this.dist/1000;if(km>this.bd){this.bd=km;localStorage.setItem('irbd',km.toString())}const lm=this.reached.length?Math.max(...this.reached):0;if(lm>this.bm){this.bm=lm;localStorage.setItem('irbm',lm.toString())}}}}
function mkLight(scene){const sun=new THREE.DirectionalLight(0xffffff,3.5);sun.position.set(60,90,40);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.near=.5;sun.shadow.camera.far=450;sun.shadow.camera.left=-80;sun.shadow.camera.right=80;sun.shadow.camera.top=80;sun.shadow.camera.bottom=-80;sun.shadow.bias=-.0003;scene.add(sun);const fill=new THREE.DirectionalLight(0xb0c0ff,1.2);fill.position.set(-30,25,-20);scene.add(fill);const amb=new THREE.AmbientLight(0xaabbcc,1.6);scene.add(amb);scene.add(new THREE.HemisphereLight(0x87CEEB,0x554433,.8));return{upd(dist){const hp=(dist/1000)/C.DK,dc=((8+hp)%24)/24,sa=dc*PI2,sh=Math.sin(sa);sun.position.set(Math.cos(sa)*100,sh*100,30);const i=Math.max(.2,sh+.3);sun.intensity=i*4;amb.intensity=Math.max(.5,i*1.2);fill.intensity=Math.max(.3,i*.7);if(sh>-.1)scene.background=new THREE.Color(.4+sh*.25,.55+sh*.25,.82+sh*.15);else{const nf=Math.abs(sh);scene.background=new THREE.Color(.04+nf*.05,.04+nf*.05,.12+nf*.1)}}}}
function mkSky(s){const c=[];for(let i=0;i<16;i++){const g=new THREE.Group(),m=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.45,depthWrite:false});for(let j=0;j<2;j++){const sp=new THREE.Mesh(new THREE.SphereGeometry(3+Math.random()*7,4,3),m);sp.position.set((Math.random()-.5)*10,Math.random()*2,(Math.random()-.5)*4);g.add(sp)}g.position.set((Math.random()-.5)*300,48+Math.random()*30,(Math.random()-.5)*300);g.userData={s:.2+Math.random()*1};s.add(g);c.push(g)}return c}
function mkRain(s){const o={m:null,i:0};o.upd=function(dt,dm){const t=(Math.sin(dm*.0001)*.5+.5)>.65?(Math.sin(dm*.0001)*.5+.5)*.5:0;this.i+=(t-this.i)*Math.min(dt,1);if(this.i>.08&&!this.m){const g=new THREE.BufferGeometry(),c=800,p=new Float32Array(c*3);for(let i=0;i<c;i++){p[i*3]=(Math.random()-.5)*60;p[i*3+1]=Math.random()*40;p[i*3+2]=(Math.random()-.5)*60}g.setAttribute('position',new THREE.BufferAttribute(p,3));this.m=new THREE.Points(g,new THREE.PointsMaterial({color:0xaaccff,size:.05,transparent:true,opacity:.08,blending:THREE.AdditiveBlending,depthWrite:false}));s.add(this.m)}if(this.m){const p=this.m.geometry.attributes.position.array;for(let j=0;j<p.length;j+=3){p[j+1]-=9*dt*this.i;if(p[j+1]<-1){p[j+1]=39;p[j]=(Math.random()-.5)*60;p[j+2]=(Math.random()-.5)*60}}this.m.geometry.attributes.position.needsUpdate=true;this.m.material.opacity=.04+this.i*.22}if(this.i<.02&&this.m){s.remove(this.m);this.m=null}};o.emoji=()=>o.i>.6?'🌧️':o.i>.2?'🌦️':'☀️';return o}
class AU{constructor(){this.c=null;this.sr=44100}_g(){if(!this.c){try{this.c=new(window.AudioContext||window.webkitAudioContext)();this.sr=this.c.sampleRate}catch(e){return null}}if(this.c.state==='suspended')this.c.resume();return this.c}fs(){const c=this._g();if(!c)return;const n=c.currentTime,o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.setValueAtTime(70+Math.random()*60,n);o.frequency.exponentialRampToValueAtTime(15,n+.1);o.type='triangle';g.gain.setValueAtTime(.04,n);g.gain.exponentialRampToValueAtTime(.001,n+.1);o.start(n);o.stop(n+.1)}br(i){const c=this._g();if(!c)return;const n=c.currentTime,l=Math.floor(this.sr*.18),b=c.createBuffer(1,l,this.sr),d=b.getChannelData(0);for(let j=0;j<l;j++)d[j]=(Math.random()*2-1)*.08;const s=c.createBufferSource(),g=c.createGain();s.buffer=b;s.connect(g);g.connect(c.destination);g.gain.setValueAtTime(i*.025,n);g.gain.exponentialRampToValueAtTime(.001,n+.18);s.start(n)}ms(){const c=this._g();if(!c)return;const n=c.currentTime;[523,659,784,1047].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.04,n+i*.08);g.gain.exponentialRampToValueAtTime(.001,n+i*.08+.16);o.start(n+i*.08);o.stop(n+i*.08+.16)})}}
function mIp(ip){const p=ip.split('.');return p.length===4?p[0]+'.'+p[1]+'.***.***':ip}
function gRk(){try{return JSON.parse(localStorage.getItem('irrk')||'[]')}catch(e){return[]}}
async function gIp(){try{const c=new AbortController();const id=setTimeout(()=>c.abort(),2e3);const r=await fetch('https://api.ipify.org?format=json',{signal:c.signal});clearTimeout(id);const d=await r.json();return d.ip}catch(e){return'local_'+Math.random().toString(36).slice(2,8)}}
function rRk(ip){const s=gRk(),b=$('rb'),p=$('rp');let h='';s.forEach((v,i)=>{const pl=v.ip===ip;h+='<tr class="'+(pl?'pr':'')+'"><td>'+(i<3?['🥇','🥈','🥉'][i]:i+1+'º')+'</td><td>'+mIp(v.ip)+'</td><td>'+v.dist.toFixed(2)+' km</td><td>'+(v.ms||0)+'</td></tr>'});if(!s.length)h='<tr><td colspan="4">Nenhum</td></tr>';b.innerHTML=h;const pi=s.findIndex(v=>v.ip===ip);p.textContent=pi>=0?'Sua posicao: '+(pi+1)+'º':'Jogue para aparecer!'}
function sRk(ip,dist,ms,time){const s=gRk();s.push({ip,dist:parseFloat(dist.toFixed(2)),ms,time,date:new Date().toISOString().slice(0,10)});s.sort((a,b)=>b.dist-a.dist);const t=s.slice(0,100);localStorage.setItem('irrk',JSON.stringify(t));return t}
function show(id){['menu','rank','hud','pause','go'].forEach(s=>{const e=$(s);if(e)e.style.display=s===id?'flex':'none'});const mc=$('mc');if(mc)mc.style.display=(id==='hud'&&isMobile)?'flex':'none'}

// ═══════════════════════════════════════════════════════════════════
const game={st:'loading',scene:null,cam:null,rnd:null,world:null,player:null,score:null,light:null,skyC:null,rain:null,au:null,input:null,ip:'',sT:0,bT:0,lastT:0,
  async init(){
    this._lb(5,'Motor grafico...');this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x87CEEB);
    this.cam=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,C.VD+100);
    this.rnd=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});this.rnd.setSize(window.innerWidth,window.innerHeight);this.rnd.setPixelRatio(Math.min(window.devicePixelRatio,2));this.rnd.shadowMap.enabled=true;this.rnd.shadowMap.type=THREE.PCFSoftShadowMap;this.rnd.toneMapping=THREE.ACESFilmicToneMapping;this.rnd.toneMappingExposure=1.4;(document.getElementById('game-container')||document.body).appendChild(this.rnd.domElement);
    this.input=mkInput(this.cam,this.rnd.domElement);initMats();
    this._lb(15,'Iluminacao...');this.light=mkLight(this.scene);
    this._lb(20,'Gerando texturas...');generateAllTextures();await new Promise(r=>setTimeout(r,50));
    this._lb(40,'Audio...');this.au=new AU();
    this._lb(55,'Construindo mundo...');this.world=mkWorld(this.scene);
    this._lb(70,'Ceu e clima...');this.skyC=mkSky(this.scene);this.rain=mkRain(this.scene);
    this._lb(85,'Jogador...');this.player=mkPlayer(this.cam,this.input);this.score=mkScore();
    this._lb(95,'Ranking...');this.ip=await gIp();
    this._lb(100,'Pronto!');await new Promise(r=>setTimeout(r,200));
    $('loading').style.display='none';this.st='menu';show('menu');this._ev();
    window.addEventListener('resize',()=>{this.cam.aspect=window.innerWidth/window.innerHeight;this.cam.updateProjectionMatrix();this.rnd.setSize(window.innerWidth,window.innerHeight)});
    rRk(this.ip);$('brec').textContent=this.score.bd.toFixed(2)+' km';this.lastT=performance.now();this._loop();
  },
  _lb(p,t){const b=$('lbar');if(b)b.style.width=p+'%';$('lt').textContent=t},
  _ev(){$('bs').addEventListener('click',()=>this.start());$('brk').addEventListener('click',()=>{rRk(this.ip);show('rank')});$('bcr').addEventListener('click',()=>show('menu'));$('bres').addEventListener('click',()=>this.resume());$('brst').addEventListener('click',()=>this.restart());$('bqt').addEventListener('click',()=>this.quit());$('brtry').addEventListener('click',()=>this.restart());$('bgm').addEventListener('click',()=>this.quit());window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(this.st==='playing')this._pause();else if(this.st==='paused')this.resume()}})},
  start(){this._clean();this.player=mkPlayer(this.cam,this.input);this.score=mkScore();this.score.start();this.st='playing';this.sT=0;this.bT=0;show('hud');if(!isMobile){$('lock-msg').style.display='block';$('crosshair').style.display='block'}this.lastT=performance.now();if(!isMobile)try{this.rnd.domElement.requestPointerLock()}catch(e){}},
  _clean(){if(this.world){for(const[k,v]of this.world.blocks)this.scene.remove(v.g);this.world.blocks.clear()}},
  _pause(){this.st='paused';document.exitPointerLock();show('pause')},
  resume(){this.st='playing';show('hud');if(!isMobile)$('lock-msg').style.display='block';this.lastT=performance.now();setTimeout(()=>{if(!isMobile)try{this.rnd.domElement.requestPointerLock()}catch(e){}},80)},
  restart(){show('hud');this.start()},
  quit(){if(this.player&&this.player.mD>10){this.score.save();const ms=this.score.reached.length?Math.max(...this.score.reached):0;sRk(this.ip,this.player.mD/1000,ms,this.score.ft());rRk(this.ip)}document.exitPointerLock();this._clean();this.st='menu';show('menu');$('brec').textContent=this.score.bd.toFixed(2)+' km'},
  _go(){this.st='gameover';this.score.save();const ms=this.score.reached.length?Math.max(...this.score.reached):0;sRk(this.ip,this.player.mD/1000,ms,this.score.ft());$('gd').textContent=(this.player.mD/1000).toFixed(2)+' km';$('gt').textContent=this.score.ft();$('gm').textContent=ms+' km';$('gs').textContent=Math.round(this.player.avg()*3.6)+' km/h';$('gmsg').textContent='Pontuacao salva!';document.exitPointerLock();show('go')},
  _loop(){requestAnimationFrame(()=>this._loop());const n=performance.now();let dt=(n-this.lastT)/1000;this.lastT=n;dt=Math.min(dt,.15);if(this.st==='playing'){this.player.upd(dt);this.world.upd(this.player.dist);const ms=this.score.upd(this.player.mD);if(ms){$('msv').textContent=ms+' km';$('ms').style.display='flex';$('ms').style.animation='none';void $('ms').offsetHeight;$('ms').style.animation='mi 2.5s ease-out forwards';setTimeout(()=>{$('ms').style.display='none'},2500);this.au.ms()}this.light.upd(this.player.mD);this.skyC.forEach(c=>{c.position.x+=c.userData.s*dt;if(c.position.x>220)c.position.x=-220});this.rain.upd(dt,this.player.mD);if(Math.abs(this.player.spd)>1){this.sT+=dt;if(this.sT>.45){this.sT=0;this.au.fs()}}if(Math.abs(this.player.spd)>1){this.bT+=dt;if(this.bT>3){this.bT=0;const i=Math.min(1,(this.player.mD/1000)/10);if(i>.2)this.au.br(i)}}this._upd();if(!this.player.alive)this._go()}this.rnd.render(this.scene,this.cam)},
  _upd(){$('hd').textContent=(this.player.mD/1000).toFixed(2)+' km';$('ht').textContent=this.score.ft();$('hp').textContent=this.score.fp();$('hn').textContent=this.score.next+' km';$('hs').textContent=Math.round(Math.abs(this.player.spd)*3.6)+' km/h';$('hrc').textContent=this.score.bd.toFixed(1)+' km';const sf=$('sf');sf.style.width=this.player.stam+'%';sf.style.background=this.player.stam<25?'#f44':this.player.stam<50?'#f90':'#4a4';$('biome').textContent=biome(this.player.mD/1000).n;$('cl').textContent=this.rain.emoji();$('brec').textContent=this.score.bd.toFixed(2)+' km'}
};
window.addEventListener('DOMContentLoaded',()=>{console.log('%c🏃 IRWT v8.0 %c| MagnorioBR %c| 34 texturas Canvas','color:#ff5e2c;font-size:1.2em','color:#fff','color:#ffb833');game.init()});
