// ===================================================================
// INFINITE RUNNER: WORLD TOUR v4.0 - COMPLETO
// Autor: MagnorioBR | Magnoriobr@gmail.com
// Todos os direitos reservados (c) 2026
// Motor: Three.js r152+ | Áudio: Web Audio API procedural
// ===================================================================
import * as THREE from 'three';

// ==================== CONFIGURAÇÃO ====================
const CFG = {
  BLOCK: 100, ROAD_W: 10, SIDEWALK_W: 3,
  BLDG_MIN: 8, BLDG_MAX: 40, VIEW: 400,
  CAM_H: 1.70, BASE_SPD: 2.222, SPRINT_SPD: 3.333,
  MAX_STAM: 100, STAM_DRN: 20, STAM_REG: 12,
  GRAVITY: 9.8, JUMP_F: 5,
  HB_AMP: 0.04, HB_FREQ: 2.5,
  DAY_KM: 5
};

// ==================== GERADOR DE TEXTURAS PROCEDURAL ====================
class TexGen {
  constructor(){ this.cache={}; this.cv=document.createElement('canvas'); this.cv.width=1024; this.cv.height=1024; this.ctx=this.cv.getContext('2d'); }
  sr(seed){ let s=seed; return ()=>{ s=(s*16807)%2147483647; return(s-1)/2147483646; } }
  
  asphalt(seed){
    const r=this.sr(seed),ctx=this.ctx,w=1024;
    ctx.fillStyle=`rgb(${38+r()*22},${38+r()*22},${40+r()*22})`; ctx.fillRect(0,0,w,w);
    for(let i=0;i<40000;i++){ let v=38+r()*28; ctx.fillStyle=`rgb(${v},${v},${v+3})`; ctx.fillRect(Math.floor(r()*w),Math.floor(r()*w),1+r()*3,1+r()*3); }
    ctx.strokeStyle='rgba(18,18,18,0.25)';
    for(let i=0;i<4;i++){ ctx.beginPath(); let x=r()*w,y=r()*w; ctx.moveTo(x,y); for(let j=0;j<8;j++){x+=(r()-.5)*180;y+=(r()-.5)*180;ctx.lineTo(x,y);} ctx.lineWidth=.5+r()*2; ctx.stroke(); }
    ctx.strokeStyle='rgba(28,28,28,0.12)';
    for(let i=0;i<6;i++){ let y=r()*w; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y+(r()-.5)*15); ctx.lineWidth=2+r()*5; ctx.stroke(); }
    return this.toTex();
  }
  
  sidewalk(seed){
    const r=this.sr(seed),ctx=this.ctx,w=1024,br=175+r()*35,bg=170+r()*35,bb=165+r()*35;
    ctx.fillStyle=`rgb(${br},${bg},${bb})`; ctx.fillRect(0,0,w,w);
    const ts=100+r()*80;
    for(let x=0;x<w;x+=ts){ for(let y=0;y<w;y+=ts){ let v=r()*18-9; ctx.fillStyle=`rgb(${br+v},${bg+v},${bb+v})`; ctx.fillRect(x,y,ts-2,ts-2); ctx.fillStyle='rgba(90,90,90,0.35)'; ctx.fillRect(x+ts-3,y,3,ts); ctx.fillRect(x,y+ts-3,ts,3); } }
    for(let i=0;i<25;i++){ let cx=r()*w,cy=r()*w,rad=8+r()*45; const g=ctx.createRadialGradient(cx,cy,0,cx,cy,rad); g.addColorStop(0,`rgba(70,65,60,${.08+r()*.18})`); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.fillRect(cx-rad,cy-rad,rad*2,rad*2); }
    return this.toTex();
  }
  
  grass(seed){
    const r=this.sr(seed),ctx=this.ctx,w=1024,bg=75+r()*60;
    ctx.fillStyle=`rgb(${15+r()*22},${bg},${15+r()*18})`; ctx.fillRect(0,0,w,w);
    for(let i=0;i<70000;i++){ let g=bg+r()*45; ctx.fillStyle=`rgb(${12+r()*28},${g},${12+r()*22})`; ctx.fillRect(r()*w,r()*w,1,1+r()*4); }
    for(let i=0;i<12;i++){ let cx=r()*w,cy=r()*w,rad=25+r()*90; const g=ctx.createRadialGradient(cx,cy,0,cx,cy,rad); g.addColorStop(0,r()>.5?'rgba(35,105,25,0.18)':'rgba(55,135,35,0.18)'); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.fillRect(cx-rad,cy-rad,rad*2,rad*2); }
    return this.toTex();
  }
  
  dirt(seed){
    const r=this.sr(seed),ctx=this.ctx,w=1024;
    ctx.fillStyle=`rgb(${100+r()*40},${65+r()*35},${30+r()*25})`; ctx.fillRect(0,0,w,w);
    for(let i=0;i<60000;i++){ let dr=100+r()*50,dg=65+r()*40,db=30+r()*30; ctx.fillStyle=`rgb(${dr},${dg},${db})`; ctx.fillRect(r()*w,r()*w,1+r()*3,1+r()*3); }
    return this.toTex();
  }
  
  building(seed){
    const r=this.sr(seed),ctx=this.ctx,w=1024;
    const p=[ [210,195,180],[175,165,158],[200,190,178],[160,150,142],[220,210,198],[180,170,162],[190,182,172],[205,195,185],[170,160,150],[215,205,193],[185,175,165],[198,188,178],[168,158,148],[208,198,188],[178,170,160],[195,185,175],[188,180,170],[212,202,192],[172,162,152],[202,194,184] ];
    const c=p[Math.floor(r()*p.length)];
    ctx.fillStyle=`rgb(${c[0]},${c[1]},${c[2]})`; ctx.fillRect(0,0,w,w);
    const ww=35+r()*25,wh=55+r()*35,sx=18+r()*35,sy=25+r()*45;
    for(let x=sx;x<w-ww;x+=ww+sx){ for(let y=sy;y<w-wh;y+=wh+sy){
      ctx.fillStyle='rgba(35,35,40,0.7)'; ctx.fillRect(x-3,y-3,ww+6,wh+6);
      if(r()>.35){ let wr=235+r()*20; ctx.fillStyle=`rgb(${wr},${wr-45},${wr-90})`; }else{ ctx.fillStyle=`rgb(${25+r()*25},${30+r()*25},${35+r()*25})`; }
      ctx.fillRect(x,y,ww,wh);
      ctx.fillStyle='rgba(0,0,0,0.25)'; ctx.fillRect(x+ww/2-1,y,2,wh); ctx.fillRect(x,y+wh/2-1,ww,2);
    }}
    if(r()>.5){ for(let y=180;y<900;y+=180+r()*120){ ctx.fillStyle='rgba(55,55,60,0.5)'; ctx.fillRect(0,y,w,5+r()*4); } }
    return this.toTex();
  }
  
  roof(seed){
    const r=this.sr(seed),ctx=this.ctx,w=1024,v=55+r()*45;
    ctx.fillStyle=`rgb(${v},${v-5},${v-10})`; ctx.fillRect(0,0,w,w);
    for(let y=0;y<w;y+=25+r()*25){ ctx.fillStyle=`rgba(${v+12},${v+7},${v+2},0.25)`; ctx.fillRect(0,y,w,12); ctx.fillStyle=`rgba(${v-12},${v-17},${v-22},0.25)`; ctx.fillRect(0,y+12,w,13); }
    for(let i=0;i<8;i++){ let cx=r()*w,cy=r()*w,rad=15+r()*65; const g=ctx.createRadialGradient(cx,cy,0,cx,cy,rad); g.addColorStop(0,`rgba(${v-22},${v-27},${v-32},0.25)`); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.fillRect(cx-rad,cy-rad,rad*2,rad*2); }
    return this.toTex();
  }
  
  toTex(){
    const t=new THREE.CanvasTexture(this.cv);
    t.wrapS=THREE.RepeatWrapping; t.wrapT=THREE.RepeatWrapping; t.colorSpace=THREE.SRGBColorSpace;
    return t;
  }
  
  genAll(){
    for(let i=0;i<5;i++) this.cache[`asphalt_${i}`]=this.asphalt(1000+i);
    for(let i=0;i<5;i++) this.cache[`sidewalk_${i}`]=this.sidewalk(2000+i);
    for(let i=0;i<4;i++) this.cache[`grass_${i}`]=this.grass(3000+i);
    for(let i=0;i<3;i++) this.cache[`dirt_${i}`]=this.dirt(3500+i);
    for(let i=0;i<20;i++) this.cache[`building_${i}`]=this.building(4000+i);
    for(let i=0;i<10;i++) this.cache[`roof_${i}`]=this.roof(5000+i);
  }
  
  get(type,seed){
    const abs=Math.abs(seed);
    if(type==='asphalt') return this.cache[`asphalt_${abs%5}`];
    if(type==='sidewalk') return this.cache[`sidewalk_${abs%5}`];
    if(type==='grass') return this.cache[`grass_${abs%4}`];
    if(type==='dirt') return this.cache[`dirt_${abs%3}`];
    if(type==='building') return this.cache[`building_${abs%20}`];
    if(type==='roof') return this.cache[`roof_${abs%10}`];
    return this.cache[`asphalt_0`];
  }
}
// ==================== GERADOR DE ÁUDIO PROCEDURAL ====================
class AudioGen {
  constructor(){ this.ctx=null; this.vol=.8; this.musicVol=.5; this.init(); }
  init(){
    try{ this.ctx=new(window.AudioContext||window.webkitAudioContext)(); }catch(e){}
  }
  ensure(){ if(!this.ctx)this.init(); if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume(); return this.ctx; }
  
  footstep(surface){
    const ctx=this.ensure(); if(!ctx)return;
    const now=ctx.currentTime;
    const osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    let freq=surface==='grass'?60+Math.random()*40:surface==='dirt'?50+Math.random()*50:80+Math.random()*60;
    osc.frequency.setValueAtTime(freq,now); osc.frequency.exponentialRampToValueAtTime(freq*.3,now+.1);
    osc.type=surface==='grass'?'sine':'triangle';
    gain.gain.setValueAtTime(this.vol*.15,now); gain.gain.exponentialRampToValueAtTime(.001,now+.15);
    osc.start(now); osc.stop(now+.15);
    // Noise burst for texture
    const buf=ctx.createBuffer(1,ctx.sampleRate*.1,ctx.sampleRate);
    const d=buf.getChannelData(0); for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*.3;
    const src=ctx.createBufferSource(),ng=ctx.createGain();
    src.buffer=buf; src.connect(ng); ng.connect(ctx.destination);
    ng.gain.setValueAtTime(this.vol*(surface==='dirt'?.12:.06),now); ng.gain.exponentialRampToValueAtTime(.001,now+.1);
    src.start(now);
  }
  
  breath(intensity){
    const ctx=this.ensure(); if(!ctx)return;
    const now=ctx.currentTime;
    const buf=ctx.createBuffer(1,ctx.sampleRate*.5,ctx.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*.3*Math.sin(i/d.length*Math.PI*2);
    const src=ctx.createBufferSource(),g=ctx.createGain(),f=ctx.createBiquadFilter();
    src.buffer=buf; src.connect(f); f.connect(g); g.connect(ctx.destination);
    f.type='bandpass'; f.frequency.value=200+intensity*300; f.Q.value=1;
    g.gain.setValueAtTime(this.vol*intensity*.08,now); g.gain.exponentialRampToValueAtTime(.001,now+.5);
    src.start(now); src.stop(now+.5);
  }
  
  milestone(){
    const ctx=this.ensure(); if(!ctx)return;
    const now=ctx.currentTime;
    [523,659,784,1047].forEach((f,i)=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type='triangle'; o.frequency.value=f;
      g.gain.setValueAtTime(this.vol*.12,now+i*.12); g.gain.exponentialRampToValueAtTime(.001,now+i*.12+.25);
      o.start(now+i*.12); o.stop(now+i*.12+.25);
    });
  }
  
  damage(){
    const ctx=this.ensure(); if(!ctx)return;
    const now=ctx.currentTime;
    const buf=ctx.createBuffer(1,ctx.sampleRate*.2,ctx.sampleRate);
    const d=buf.getChannelData(0); for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*.5;
    const src=ctx.createBufferSource(),g=ctx.createGain();
    src.buffer=buf; src.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(this.vol*.2,now); g.gain.exponentialRampToValueAtTime(.001,now+.2);
    src.start(now);
  }
  
  rainLoop(){
    const ctx=this.ensure(); if(!ctx)return null;
    const buf=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*.15;
    const src=ctx.createBufferSource(),g=ctx.createGain(),f=ctx.createBiquadFilter();
    src.buffer=buf; src.loop=true; src.connect(f); f.connect(g); g.connect(ctx.destination);
    f.type='highpass'; f.frequency.value=800;
    g.gain.setValueAtTime(0,ctx.currentTime); g.gain.linearRampToValueAtTime(this.vol*.06,ctx.currentTime+2);
    src.start(); return {src,g};
  }
  
  setVol(v){ this.vol=v/100; }
  setMusicVol(v){ this.musicVol=v/100; }
}

// ==================== CLIMA ====================
class WeatherSystem {
  constructor(scene){
    this.scene=scene; this.mode='auto'; this.isRaining=false; this.rainIntensity=0; this.targetRain=0;
    this.groundWetness=0; this.rainParticles=null; this.cloudGroup=null; this.rainAudio=null;
    this.setupClouds();
  }
  setupClouds(){
    this.cloudGroup=new THREE.Group();
    for(let i=0;i<30;i++){
      const g=new THREE.Group();
      const mat=new THREE.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.7,roughness:1});
      for(let j=0;j<3;j++){
        const s=new THREE.Mesh(new THREE.SphereGeometry(8+Math.random()*15,7,5),mat);
        s.position.set((Math.random()-.5)*25,Math.random()*5,(Math.random()-.5)*10); g.add(s);
      }
      g.position.set((Math.random()-.5)*400,60+Math.random()*40,(Math.random()-.5)*400); this.cloudGroup.add(g);
    }
    this.scene.add(this.cloudGroup);
  }
  update(dt,dist,audioGen){
    const rnd=Math.sin(dist*.0001)*.5+.5;
    if(this.mode==='rain') this.targetRain=1;
    else if(this.mode==='clear') this.targetRain=0;
    else this.targetRain=rnd>.7?rnd*.8:0;
    this.rainIntensity+=(this.targetRain-this.rainIntensity)*Math.min(dt*2,1);
    this.groundWetness+=(this.rainIntensity-this.groundWetness)*Math.min(dt,1);
    const wasRaining=this.isRaining;
    this.isRaining=this.rainIntensity>.1;
    if(this.isRaining&&!wasRaining){ if(!this.rainAudio&&audioGen)this.rainAudio=audioGen.rainLoop(); }
    else if(!this.isRaining&&wasRaining&&this.rainAudio){ this.rainAudio.g.gain.linearRampToValueAtTime(0,(audioGen?.ensure()?.currentTime||0)+1); this.rainAudio=null; }
    if(this.rainParticles&&this.rainIntensity<.05){ this.scene.remove(this.rainParticles); this.rainParticles=null; }
    if(this.isRaining){
      if(!this.rainParticles){
        const g=new THREE.BufferGeometry(); const c=2000; const p=new Float32Array(c*3);
        for(let i=0;i<c;i++){ p[i*3]=(Math.random()-.5)*120; p[i*3+1]=Math.random()*80; p[i*3+2]=(Math.random()-.5)*120; }
        g.setAttribute('position',new THREE.BufferAttribute(p,3));
        this.rainParticles=new THREE.Points(g,new THREE.PointsMaterial({color:0xaaccff,size:.15,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false}));
        this.scene.add(this.rainParticles);
      }
      const pp=this.rainParticles.geometry.attributes.position.array;
      for(let i=0;i<pp.length;i+=3){ pp[i+1]-=15*dt*this.rainIntensity; if(pp[i+1]<-1){pp[i+1]=79; pp[i]=(Math.random()-.5)*120; pp[i+2]=(Math.random()-.5)*120; } }
      this.rainParticles.geometry.attributes.position.needsUpdate=true;
      this.rainParticles.material.opacity=.15+this.rainIntensity*.35;
    }
    this.cloudGroup.children.forEach(c=>{ c.position.x+=dt*2; if(c.position.x>250)c.position.x=-250; });
    this.cloudGroup.children.forEach(c=>{ c.material.opacity=.3+this.rainIntensity*.5; });
  }
  getWeatherEmoji(){ return this.rainIntensity>.6?'🌧️':this.rainIntensity>.2?'🌦️':'☀️'; }
}

// ==================== TERRAIN GENERATOR ====================
class TerrainGen {
  constructor(scene,texGen){
    this.scene=scene; this.tg=texGen; this.blocks=new Map(); this.BS=CFG.BLOCK;
  }
  hash(x,z){ let h=x*374761393+z*668265263; h=(h^(h>>13))*1274126177; return h^(h>>16); }
  perlin(x,z,seed){ const n=Math.sin(x*12.9898+z*78.233+seed)*43758.5453; return n-Math.floor(n); }
  smoothNoise(x,z,seed,s=15){
    const nx=x/s,nz=z/s; const ix=Math.floor(nx),iz=Math.floor(nz);
    const fx=nx-ix,fz=nz-iz; const sx=fx*fx*(3-2*fx),sz=fz*fz*(3-2*fz);
    const n00=this.perlin(ix,iz,seed),n10=this.perlin(ix+1,iz,seed),n01=this.perlin(ix,iz+1,seed),n11=this.perlin(ix+1,iz+1,seed);
    return(n00+(n10-n00)*sx)+((n01+(n11-n01)*sx)-(n00+(n10-n00)*sx))*sz;
  }
  getHeight(lx,lz,seed){
    const hr=CFG.ROAD_W/2,se=hr+CFG.SIDEWALK_W,ax=Math.abs(lx);
    if(ax<hr)return 0;
    if(ax<se){ const t=(ax-hr)/CFG.SIDEWALK_W; return .15+t*.02; }
    return .30+this.smoothNoise(lx,lz,seed,12)*.22;
  }
  createBlock(bx,bz){
    const seed=this.hash(bx,bz),BS=this.BS,seg=20;
    const geo=new THREE.PlaneGeometry(BS,BS,seg,seg); geo.rotateX(-Math.PI/2);
    const pos=geo.attributes.position.array;
    for(let i=0;i<pos.length;i+=3){ pos[i+1]=this.getHeight(pos[i],pos[i+2],seed); }
    geo.computeVertexNormals();
    const aTex=this.tg.get('asphalt',seed).clone(); aTex.repeat.set(8,8);
    const sTex=this.tg.get('sidewalk',seed).clone(); sTex.repeat.set(6,6);
    const gTex=this.tg.get('grass',seed+1000).clone(); gTex.repeat.set(5,5);
    const dTex=this.tg.get('dirt',seed+2000).clone(); dTex.repeat.set(3,3);
    const mat=new THREE.MeshStandardMaterial({map:aTex,roughness:.85,metalness:.02});
    const mesh=new THREE.Mesh(geo,mat); mesh.receiveShadow=true;
    const grp=new THREE.Group(); grp.add(mesh); grp.position.set(bx*BS,0,bz*BS); mesh.position.set(0,0,0);
    this.addCurbsRoad(grp,seed);
    return grp;
  }
  addCurbsRoad(grp,seed){
    const hr=CFG.ROAD_W/2;
    const cGeo=new THREE.BoxGeometry(.2,.1,CFG.BLOCK);
    const cMat=new THREE.MeshStandardMaterial({color:0x777777,roughness:.5});
    for(let s=-1;s<=1;s+=2){ const c=new THREE.Mesh(cGeo,cMat); c.position.set(s*hr,.05,0); c.castShadow=true; c.receiveShadow=true; grp.add(c); }
    const dGeo=new THREE.PlaneGeometry(.25,3.5);
    const dMat=new THREE.MeshStandardMaterial({color:0xffcc00,roughness:.4,emissive:0x111100});
    for(let z=-49;z<49;z+=7){ const d=new THREE.Mesh(dGeo,dMat); d.rotation.x=-Math.PI/2; d.position.set(0,.015,z+3.5); grp.add(d); }
  }
  update(pz){
    const pbz=Math.floor(pz/this.BS),range=Math.ceil(CFG.VIEW/this.BS)+1;
    const needed=new Set();
    for(let bz=pbz-range;bz<=pbz+range;bz++) for(let bx=-2;bx<=2;bx++) needed.add(`${bx},${bz}`);
    for(const[k,b]of this.blocks){ if(!needed.has(k)){this.scene.remove(b);this.blocks.delete(k);} needed.delete(k); }
    for(const k of needed){ const[bx,bz]=k.split(',').map(Number); const b=this.createBlock(bx,bz); this.scene.add(b); this.blocks.set(k,b); }
  }
}
// ==================== GERADOR DE MUNDO ====================
class WorldGen {
  constructor(scene,texGen){
    this.scene=scene; this.tg=texGen; this.objs=[]; this.BS=CFG.BLOCK;
  }
  sr(seed){ let s=seed; return()=>{ s=(s*16807)%2147483647; return(s-1)/2147483646; }; }
  
  populateBlock(grp,bx,bz){
    const seed=TerrainGen.prototype.hash(bx,bz),r=this.sr(seed),BS=this.BS;
    const hr=CFG.ROAD_W/2,se=hr+CFG.SIDEWALK_W,bzs=BS/2-bldgZone(hr,se),bzw=bldgZone(hr,se)*2;
    for(let side=-1;side<=1;side+=2){
      const bxC=side*(se+bzs/2),nb=2+Math.floor(Math.abs(r())*3);
      const bw=(BS-4)/nb;
      for(let b=0;b<nb;b++){
        const bzP=-BS/2+2+b*bw+bw/2,h=CFG.BLDG_MIN+Math.abs(r())*(CFG.BLDG_MAX-CFG.BLDG_MIN);
        const geo=new THREE.BoxGeometry(bzs-.3,h,bw-.5);
        const tex=this.tg.get('building',seed+b*100+side*50).clone();
        tex.repeat.set(1,Math.max(1,h/(bw-.5))); tex.offset.y=Math.abs(this.sr(seed+b+999)())*.4;
        const mat=new THREE.MeshStandardMaterial({map:tex,roughness:.55,metalness:.08});
        const bldg=new THREE.Mesh(geo,mat); bldg.position.set(bxC,h/2,bzP); bldg.castShadow=true; bldg.receiveShadow=true;
        grp.add(bldg);
        const rGeo=new THREE.PlaneGeometry(bzs-.3,bw-.5);
        const rTex=this.tg.get('roof',seed+b*200+side*100).clone(); rTex.repeat.set(2,2);
        const roof=new THREE.Mesh(rGeo,new THREE.MeshStandardMaterial({map:rTex,roughness:.75}));
        roof.rotation.x=-Math.PI/2; roof.position.set(bxC,h+.02,bzP); grp.add(roof);
      }
    }
    // Trees
    for(let side=-1;side<=1;side+=2){
      const tx=side*(hr+CFG.SIDEWALK_W/2);
      for(let tz=-BS/2+5;tz<BS/2-5;tz+=13+Math.abs(r())*18){
        if(Math.abs(r())>.2){
          const tree=this.makeTree(seed+Math.floor(tz*1000)+side*3000);
          tree.position.set(tx,0,tz); grp.add(tree);
        }
      }
    }
    // Lampposts
    for(let side=-1;side<=1;side+=2){
      const px=side*(hr+.5);
      for(let pz=-BS/2+10;pz<BS/2-10;pz+=22){ grp.add(this.makeLamppost(seed+Math.floor(pz*2000)+side*5000,px,pz)); }
    }
    // Benches & bins
    for(let side=-1;side<=1;side+=2){
      const px=side*(hr+CFG.SIDEWALK_W-1);
      for(let pz=-BS/2+8;pz<BS/2-8;pz+=28+Math.abs(r())*22){
        if(Math.abs(r())>.45){ const b=this.makeBench(); b.position.set(px,0,pz); grp.add(b); }
        else{ const bn=this.makeBin(); bn.position.set(px,0,pz); grp.add(bn); }
      }
    }
  }
  
  makeTree(seed){
    const r=this.sr(seed),g=new THREE.Group();
    const th=1.5+r()*3.5;
    const t=new THREE.Mesh(new THREE.CylinderGeometry(.12,.18,th,8),new THREE.MeshStandardMaterial({color:0x5D4037,roughness:.85}));
    t.position.y=th/2; t.castShadow=true; g.add(t);
    const cc=[0x2E7D32,0x388E3C,0x43A047,0x4CAF50,0x1B5E20];
    const ns=2+Math.floor(r()*3);
    for(let i=0;i<ns;i++){
      const cr=.6+r()*1.4;
      const c=new THREE.Mesh(new THREE.SphereGeometry(cr,8,6),new THREE.MeshStandardMaterial({color:cc[Math.floor(Math.abs(r())*cc.length)],roughness:.75}));
      c.position.set((r()-.5)*1.8,th+.4+r()*1.8,(r()-.5)*1.8); c.castShadow=true; g.add(c);
    }
    return g;
  }
  
  makeLamppost(seed,x,z){
    const g=new THREE.Group();
    const m=new THREE.MeshStandardMaterial({color:0x2a2a2a,roughness:.3,metalness:.85});
    const p=new THREE.Mesh(new THREE.CylinderGeometry(.06,.1,5.5,8),m); p.position.y=2.75; p.castShadow=true; g.add(p);
    const a=new THREE.Mesh(new THREE.BoxGeometry(1.3,.07,.07),m); a.position.set(.65,5.2,0); g.add(a);
    const b=new THREE.Mesh(new THREE.SphereGeometry(.22,8,4),new THREE.MeshStandardMaterial({color:0xfffef0,emissive:0x333322,roughness:.25}));
    b.position.set(1.35,5.2,0); g.add(b);
    return g;
  }
  
  makeBench(){
    const g=new THREE.Group();
    const w=new THREE.MeshStandardMaterial({color:0x6D4C41,roughness:.65});
    const m=new THREE.MeshStandardMaterial({color:0x3a3a3a,roughness:.25,metalness:.9});
    for(let s=-1;s<=1;s+=2){ const l=new THREE.Mesh(new THREE.BoxGeometry(.04,.55,.04),m); l.position.set(s*.65,.275,0); g.add(l); }
    g.add(new THREE.Mesh(new THREE.BoxGeometry(1.5,.06,.32),w)).position.y=.58;
    g.add(new THREE.Mesh(new THREE.BoxGeometry(1.5,.35,.04),w)).position.set(0,.78,-.15);
    return g;
  }
  
  makeBin(){
    const g=new THREE.Group();
    const b=new THREE.Mesh(new THREE.CylinderGeometry(.2,.16,.85,8),new THREE.MeshStandardMaterial({color:0x2E7D32,roughness:.4,metalness:.5}));
    b.position.y=.425; b.castShadow=true; g.add(b);
    return g;
  }
}

function bldgZone(hr,se){ return CFG.BLOCK/2-se; }

// ==================== JOGADOR ====================
class Player {
  constructor(cam){
    this.cam=cam; this.cam.position.set(0,CFG.CAM_H,0);
    this.spd=0; this.tSpd=0; this.lat=0; this.tLat=0; this.dist=0; this.stam=CFG.MAX_STAM;
    this.sprint=false; this.jumping=false; this.jv=0; this.vo=0; this.hp=100; this.alive=true;
    this.hbT=0; this.keys={}; this.spdHist=[];
    this.setupInput();
  }
  setupInput(){
    window.addEventListener('keydown',e=>{ this.keys[e.key.toLowerCase()]=true; if(e.key.toLowerCase()==='shift')this.sprint=true; });
    window.addEventListener('keyup',e=>{ this.keys[e.key.toLowerCase()]=false; if(e.key.toLowerCase()==='shift')this.sprint=false; });
    // Mobile
    const ml=document.getElementById('mb-left'),mr=document.getElementById('mb-right'),mj=document.getElementById('mb-jump'),ms=document.getElementById('mb-sprint');
    if(ml){ ml.addEventListener('pointerdown',()=>this.keys['a']=true); ml.addEventListener('pointerup',()=>this.keys['a']=false); ml.addEventListener('pointerleave',()=>this.keys['a']=false); }
    if(mr){ mr.addEventListener('pointerdown',()=>this.keys['d']=true); mr.addEventListener('pointerup',()=>this.keys['d']=false); mr.addEventListener('pointerleave',()=>this.keys['d']=false); }
    if(mj){ mj.addEventListener('pointerdown',()=>this.keys[' ']=true); mj.addEventListener('pointerup',()=>this.keys[' ']=false); }
    if(ms){ ms.addEventListener('pointerdown',()=>{this.sprint=true;this.keys['w']=true;}); ms.addEventListener('pointerup',()=>{this.sprint=false;this.keys['w']=false;}); }
    document.addEventListener('touchstart',()=>{ if(!this.keys['w']&&!this.sprint)this.keys['w']=true; },{passive:true});
  }
  update(dt){
    if(!this.alive)return; dt=Math.min(dt,.1);
    if(this.keys['w']) this.tSpd=this.sprint&&this.stam>0?CFG.SPRINT_SPD:CFG.BASE_SPD;
    else if(this.keys['s']) this.tSpd=Math.max(0,this.spd-5*dt);
    else this.tSpd=Math.max(0,this.spd-1.8*dt);
    if(this.sprint&&this.keys['w']&&this.spd>CFG.BASE_SPD){ this.stam=Math.max(0,this.stam-CFG.STAM_DRN*dt); if(this.stam<=0)this.sprint=false; }
    else this.stam=Math.min(CFG.MAX_STAM,this.stam+CFG.STAM_REG*dt);
    this.spd+=(this.tSpd-this.spd)*Math.min(6*dt,1);
    this.dist+=this.spd*dt;
    if(this.keys['a'])this.tLat=-3; else if(this.keys['d'])this.tLat=3; else this.tLat=0;
    this.lat+=(this.tLat-this.lat)*Math.min(9*dt,1);
    if(this.keys[' ']&&!this.jumping){ this.jumping=true; this.jv=CFG.JUMP_F; }
    if(this.jumping){ this.jv-=CFG.GRAVITY*dt; this.vo+=this.jv*dt; if(this.vo<=0){this.vo=0;this.jumping=false;this.jv=0;} }
    if(this.spd>1){ this.hbT+=dt*CFG.HB_FREQ*(this.spd/CFG.BASE_SPD); }
    const hbY=Math.sin(this.hbT*Math.PI*2)*CFG.HB_AMP*Math.min(this.spd/CFG.BASE_SPD,1.5);
    const hbX=Math.cos(this.hbT*Math.PI)*CFG.HB_AMP*.5;
    this.cam.position.set(this.lat+hbX,CFG.CAM_H+this.vo+hbY,this.dist);
    this.checkCol();
    this.spdHist.push(this.spd); if(this.spdHist.length>180)this.spdHist.shift();
  }
  checkCol(){
    const hr=CFG.ROAD_W/2,bz=hr+CFG.SIDEWALK_WIDTH+.5;
    if(Math.abs(this.cam.position.x)>bz){
      this.spd*=.65; this.cam.position.x=Math.sign(this.cam.position.x)*bz; this.hp-=12; this.lat=this.cam.position.x; this.tLat=this.cam.position.x;
      this.showDmg(); if(this.hp<=0){this.alive=false;this.spd=0;}
    }
  }
  showDmg(){
    const f=document.createElement('div'); f.className='dmg-flash'; document.body.appendChild(f); setTimeout(()=>f.remove(),400);
  }
  avgSpd(){ return this.spdHist.length?this.spdHist.reduce((a,b)=>a+b,0)/this.spdHist.length:0; }
}

// ==================== PONTUAÇÃO ====================
class Score {
  constructor(){
    this.startT=0; this.elapsed=0; this.dist=0; this.cSpd=0;
    this.milestones=[1,2,4,8,16,32,64,128,256,512,1024];
    this.reached=[]; this.next=1; this.running=false;
    this.bestDist=parseFloat(localStorage.getItem('ir_best')||'0');
    this.bestMS=parseFloat(localStorage.getItem('ir_bestms')||'0');
  }
  start(){ this.startT=performance.now(); this.running=true; }
  update(sprinting){
    if(!this.running)return null;
    this.elapsed=(performance.now()-this.startT)/1000;
    this.cSpd=sprinting?CFG.SPRINT_SPD:CFG.BASE_SPD;
    this.dist=this.cSpd*this.elapsed;
    const km=this.dist/1000;
    if(km>=this.next){ const m=this.next; this.reached.push(m); this.next=this.milestones.includes(m)?this.milestones[this.milestones.indexOf(m)+1]||this.next*2:this.next*2; return m; }
    return null;
  }
  fmtDist(){ return (this.dist/1000).toFixed(2)+' km'; }
  fmtTime(){ const s=Math.floor(this.elapsed),m=Math.floor(s/60),h=Math.floor(m/60); return h>0?`${String(h).padStart(2,'0')}:${String(m%60).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`:`${String(m).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`; }
  fmtPace(){ if(this.dist<5)return'--:--/km'; const ps=this.elapsed/(this.dist/1000); return`${Math.floor(ps/60)}:${String(Math.floor(ps%60)).padStart(2,'0')}/km`; }
  kmh(){ return this.elapsed>1?(this.dist/1000)/(this.elapsed/3600):0; }
  save(){
    const km=this.dist/1000;
    if(km>this.bestDist){ this.bestDist=km; localStorage.setItem('ir_best',km.toString()); }
    const lm=this.reached.length?Math.max(...this.reached):0;
    if(lm>this.bestMS){ this.bestMS=lm; localStorage.setItem('ir_bestms',lm.toString()); }
  }
}
// ==================== CICLO DIA/NOITE ====================
class DayNight {
  constructor(scene,rnd){
    this.scene=scene; this.rnd=rnd; this.tod=8;
    this.sun=new THREE.DirectionalLight(0xfff5e6,1.5);
    this.sun.position.set(50,80,30); this.sun.castShadow=true;
    this.sun.shadow.mapSize.set(2048,2048); this.sun.shadow.camera.near=.5; this.sun.shadow.camera.far=250;
    this.sun.shadow.camera.left=-60; this.sun.shadow.camera.right=60; this.sun.shadow.camera.top=60; this.sun.shadow.camera.bottom=-60;
    scene.add(this.sun);
    this.amb=new THREE.AmbientLight(0x404060,.4); scene.add(this.amb);
    this.hemi=new THREE.HemisphereLight(0x87CEEB,0x362907,.3); scene.add(this.hemi);
  }
  update(dist){
    const hp=(dist/1000)/CFG.DAY_KM; this.tod=(8+hp)%24;
    const dc=this.tod/24,sa=dc*Math.PI*2,sh=Math.sin(sa);
    this.sun.position.set(Math.cos(sa)*100,sh*100,30);
    const i=Math.max(.04,sh+.2);
    this.sun.intensity=i*2; this.amb.intensity=Math.max(.08,i*.4);
    if(sh>-.1){ this.scene.background=new THREE.Color(.3+sh*.3,.5+sh*.3,.8+sh*.2); this.scene.fog=new THREE.Fog(new THREE.Color(.7,.75,.8),50,CFG.VIEW); }
    else{ const nf=Math.abs(sh); this.scene.background=new THREE.Color(.02+nf*.04,.02+nf*.04,.08+nf*.08); this.scene.fog=new THREE.Fog(new THREE.Color(.02,.02,.05),20,CFG.VIEW*.7); }
  }
}

// ==================== UI ====================
class UI {
  constructor(){
    this.el={
      load:document.getElementById('loading-screen'),lbar:document.getElementById('load-bar'),lmsg:document.getElementById('load-msg'),
      menu:document.getElementById('main-menu'),rankM:document.getElementById('ranking-modal'),sets:document.getElementById('settings-modal'),
      hud:document.getElementById('game-hud'),
      hd:document.getElementById('hd'),ht:document.getElementById('ht'),hp:document.getElementById('hp'),hm:document.getElementById('hm'),hs:document.getElementById('hs'),hr:document.getElementById('hr'),
      sf:document.getElementById('stam-fill'),sl:document.getElementById('stam-label'),hw:document.getElementById('hw'),
      mso:document.getElementById('milestone-ov'),msk:document.getElementById('ms-km'),
      pause:document.getElementById('pause-sc'),go:document.getElementById('gameover-sc'),
      gd:document.getElementById('go-dist'),gt:document.getElementById('go-time'),gm:document.getElementById('go-ms'),gs:document.getElementById('go-spd'),
      gmsg:document.getElementById('go-msg'),mbest:document.getElementById('menu-best'),rb:document.getElementById('rank-body'),rp:document.getElementById('rank-pos'),
      mc:document.getElementById('mobile-controls')
    };
    this.ws=document.getElementById('weather-mode');
  }
  loading(pct,msg){ this.el.lbar.style.width=pct+'%'; this.el.lmsg.textContent=msg; }
  showMenu(){ this.el.menu.style.display='flex'; this.el.hud.style.display='none'; this.el.go.style.display='none'; this.el.pause.style.display='none'; this.el.rankM.style.display='none'; this.el.sets.style.display='none'; this.el.mc.style.display='none'; }
  startGame(){ this.el.menu.style.display='none'; this.el.hud.style.display='block'; this.el.go.style.display='none'; this.el.pause.style.display='none'; this.el.rankM.style.display='none'; this.el.sets.style.display='none';
    if(window.innerWidth<1024)this.el.mc.style.display='flex'; }
  updHUD(dist,next,record,spd,stam,pace,time,weather){
    this.el.hd.textContent=(dist/1000).toFixed(2)+' km'; this.el.ht.textContent=time;
    this.el.hp.textContent=pace; this.el.hm.textContent=next+' km';
    this.el.hs.textContent=Math.round(spd*3.6)+' km/h'; this.el.hr.textContent=record.toFixed(1)+' km';
    this.el.sf.style.width=stam+'%';
    this.el.sf.style.background=stam<25?'linear-gradient(90deg,#f44336,#ff9800)':stam<50?'linear-gradient(90deg,#ff9800,#ffc107)':'linear-gradient(90deg,#4CAF50,#8BC34A)';
    this.el.hw.textContent=weather||'☀️';
    this.el.mbest.textContent=record.toFixed(2)+' km';
  }
  showMilestone(km){ this.el.msk.textContent=km+' km'; this.el.mso.style.display='flex'; this.el.mso.style.animation='none'; void this.el.mso.offsetHeight; this.el.mso.style.animation='mf 2.2s forwards'; setTimeout(()=>{this.el.mso.style.display='none';},2200); }
  showPause(){ this.el.pause.style.display='flex'; }
  hidePause(){ this.el.pause.style.display='none'; }
  showGO(dist,time,ms,spd,sent){
    this.el.gd.textContent=(dist/1000).toFixed(2)+' km'; this.el.gt.textContent=time; this.el.gm.textContent=ms+' km'; this.el.gs.textContent=Math.round(spd*3.6)+' km/h';
    this.el.gmsg.textContent=sent?'✅ Resultado enviado ao ranking global!':'📊 Partida finalizada!';
    this.el.go.style.display='flex'; this.el.hud.style.display='none'; this.el.mc.style.display='none';
  }
  renderLocalRanking(data,playerIp){
    const scores=JSON.parse(localStorage.getItem('ir_localrank')||'[]');
    let html='';
    scores.forEach((s,i)=>{ const isP=s.ip===playerIp; html+=`<tr class="${isP?'player-row':''}"><td>${i<3?['🥇','🥈','🥉'][i]:i+1+'º'}</td><td>${maskIp(s.ip)}</td><td>${s.dist.toFixed(2)} km</td><td>${s.ms||0} marcos</td><td>${s.time}</td></tr>`; });
    if(!scores.length)html='<tr><td colspan="5">Nenhum resultado ainda</td></tr>';
    this.el.rb.innerHTML=html;
    const pi=scores.findIndex(s=>s.ip===playerIp);
    this.el.rp.textContent=pi>=0?`Sua posição: ${pi+1}º`:'Jogue para aparecer!';
  }
}

function maskIp(ip){ const p=ip.split('.'); return p.length===4?`${p[0]}.${p[1]}.***.***`:ip; }

// ==================== RANKING LOCAL ====================
async function getIp(){
  try{ const r=await fetch('https://api.ipify.org?format=json'); const d=await r.json(); return d.ip; }catch(e){ return 'local_'+Math.random().toString(36).slice(2,8); }
}
function saveLocalScore(ip,dist,ms,time){
  const scores=JSON.parse(localStorage.getItem('ir_localrank')||'[]');
  scores.push({ip,dist,ms,time:time,date:new Date().toISOString()});
  scores.sort((a,b)=>b.dist-a.dist);
  const top=scores.slice(0,100);
  localStorage.setItem('ir_localrank',JSON.stringify(top));
  return top;
}

// ==================== JOGO PRINCIPAL ====================
class Game {
  constructor(){
    this.state='loading'; this.scene=null; this.cam=null; this.rnd=null;
    this.texG=null; this.terrain=null; this.world=null; this.player=null;
    this.score=null; this.dayNight=null; this.weather=null; this.audio=null; this.ui=null;
    this.stepTimer=0; this.breathTimer=0; this.playerIp='';
    this.init();
  }
  async init(){
    this.ui=new UI(); this.ui.loading(5,'Inicializando...');
    this.scene=new THREE.Scene(); this.scene.background=new THREE.Color(0x87CEEB); this.scene.fog=new THREE.Fog(0xCCDDFF,50,CFG.VIEW);
    this.cam=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,CFG.VIEW+100);
    this.rnd=new THREE.WebGLRenderer({antialias:true}); this.rnd.setSize(window.innerWidth,window.innerHeight); this.rnd.setPixelRatio(Math.min(window.devicePixelRatio,2));
    this.rnd.shadowMap.enabled=true; this.rnd.shadowMap.type=THREE.PCFSoftShadowMap; this.rnd.toneMapping=THREE.ACESFilmicToneMapping; this.rnd.toneMappingExposure=1;
    document.getElementById('game-container').appendChild(this.rnd.domElement);
    
    this.ui.loading(15,'Gerando texturas...'); await this.sleep(80);
    this.texG=new TexGen(); this.texG.genAll();
    
    this.ui.loading(30,'Criando áudio...'); await this.sleep(50);
    this.audio=new AudioGen();
    
    this.ui.loading(45,'Construindo terreno...'); await this.sleep(80);
    this.terrain=new TerrainGen(this.scene,this.texG);
    this.world=new WorldGen(this.scene,this.texG);
    
    this.ui.loading(60,'Configurando clima...'); await this.sleep(50);
    this.weather=new WeatherSystem(this.scene);
    this.dayNight=new DayNight(this.scene,this.rnd);
    
    this.ui.loading(75,'Preparando jogador...'); await this.sleep(60);
    this.player=new Player(this.cam);
    this.score=new Score();
    
    this.ui.loading(90,'Conectando ranking...');
    try{ this.playerIp=await getIp(); }catch(e){ this.playerIp='local'; }
    this.ui.renderLocalRanking([],this.playerIp);
    
    this.ui.loading(100,'Pronto!'); await this.sleep(400);
    document.getElementById('loading-screen').style.display='none';
    this.state='menu'; this.ui.showMenu();
    this.setupEvents(); this.resizeHandler();
    this.lastT=performance.now(); this.loop();
  }
  sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
  
  setupEvents(){
    document.getElementById('btn-start').addEventListener('click',()=>this.startRun());
    document.getElementById('btn-ranking').addEventListener('click',()=>{ document.getElementById('ranking-modal').style.display='flex'; });
    document.getElementById('btn-settings').addEventListener('click',()=>{ document.getElementById('settings-modal').style.display='flex'; });
    document.querySelectorAll('.btn-close-rank').forEach(b=>b.addEventListener('click',()=>{ document.getElementById('ranking-modal').style.display='none'; }));
    document.querySelectorAll('.btn-close-settings').forEach(b=>b.addEventListener('click',()=>{ document.getElementById('settings-modal').style.display='none'; }));
    document.getElementById('btn-resume').addEventListener('click',()=>this.resume());
    document.getElementById('btn-restart').addEventListener('click',()=>this.restart());
    document.getElementById('btn-quit').addEventListener('click',()=>this.quit());
    document.getElementById('btn-retry').addEventListener('click',()=>this.restart());
    document.getElementById('btn-go-menu').addEventListener('click',()=>this.quit());
    document.getElementById('vol-music').addEventListener('input',e=>this.audio.setMusicVol(e.target.value));
    document.getElementById('vol-sfx').addEventListener('input',e=>this.audio.setVol(e.target.value));
    document.getElementById('weather-mode').addEventListener('change',e=>{ if(this.weather)this.weather.mode=e.target.value; });
    window.addEventListener('keydown',e=>{ if(e.key==='Escape'){ if(this.state==='playing')this.pause(); else if(this.state==='paused')this.resume(); } });
  }
  
  resizeHandler(){
    window.addEventListener('resize',()=>{ this.cam.aspect=window.innerWidth/window.innerHeight; this.cam.updateProjectionMatrix(); this.rnd.setSize(window.innerWidth,window.innerHeight); });
  }
  
  startRun(){
    this.cleanWorld();
    this.player=new Player(this.cam); this.score=new Score();
    this.score.start(); this.state='playing';
    this.lastT=performance.now(); this.breathTimer=0; this.stepTimer=0;
    this.ui.startGame();
  }
  
  cleanWorld(){
    if(this.terrain){ for(const[k,b]of this.terrain.blocks){ this.scene.remove(b); } this.terrain.blocks.clear(); }
  }
  
  pause(){ this.state='paused'; this.ui.showPause(); }
  resume(){ this.state='playing'; this.ui.hidePause(); this.lastT=performance.now(); }
  restart(){ this.ui.el.go.style.display='none'; this.ui.hidePause(); this.startRun(); }
  quit(){
    if(this.player&&this.player.dist>0){
      this.score.save();
      const ms=this.score.reached.length?Math.max(...this.score.reached):0;
      saveLocalScore(this.playerIp,this.player.dist/1000,ms,this.score.fmtTime());
    }
    this.state='menu'; this.ui.showMenu(); this.cleanWorld();
  }
  
  gameOver(){
    this.state='gameover'; this.score.save();
    const ms=this.score.reached.length?Math.max(...this.score.reached):0;
    const top=saveLocalScore(this.playerIp,this.player.dist/1000,ms,this.score.fmtTime());
    this.ui.renderLocalRanking(top,this.playerIp);
    this.ui.showGO(this.player.dist,this.score.fmtTime(),ms,this.player.avgSpd(),true);
  }
  
  loop(){
    requestAnimationFrame(()=>this.loop());
    const now=performance.now(); let dt=(now-this.lastT)/1000; this.lastT=now;
    if(this.state==='playing'){
      this.player.update(dt);
      this.terrain.update(this.player.dist);
      const blockBZ=Math.floor(this.player.dist/CFG.BLOCK);
      // Populate new terrain blocks with buildings
      for(const[k,grp]of this.terrain.blocks){
        if(grp.children.length<5){ const[bx,bz]=k.split(',').map(Number); this.world.populateBlock(grp,bx,bz); }
      }
      const ms=this.score.update(this.player.sprint);
      if(ms){ this.ui.showMilestone(ms); this.audio.milestone(); }
      this.dayNight.update(this.player.dist);
      this.weather.update(dt,this.player.dist,this.audio);
      // Footsteps
      if(this.player.spd>1){ this.stepTimer+=dt*(this.player.spd/CFG.BASE_SPD);
        if(this.stepTimer>.45){ this.stepTimer=0;
          const px=this.cam.position.x,hr=CFG.ROAD_W/2,se=hr+CFG.SIDEWALK_W;
          let surf='asphalt'; if(Math.abs(px)>se)surf='grass'; else if(Math.abs(px)>hr)surf='sidewalk';
          this.audio.footstep(surf);
        }
      }
      // Breathing
      if(this.player.spd>1){ this.breathTimer+=dt; if(this.breathTimer>3){ this.breathTimer=0; const intensity=Math.min(1,(this.player.dist/1000)/10); if(intensity>.2)this.audio.breath(intensity); } }
      this.ui.updHUD(this.player.dist,this.score.next,this.score.bestDist,this.player.spd,this.player.stam,this.score.fmtPace(),this.score.fmtTime(),this.weather.getWeatherEmoji());
      if(!this.player.alive){ this.audio.damage(); this.gameOver(); }
    }
    // Update terrain populating for non-playing state too (for world preview in background)
    this.rnd.render(this.scene,this.cam);
  }
}

window.addEventListener('DOMContentLoaded',()=>{
  console.log('%c🏃 Infinite Runner: World Tour v4.0 %c| MagnorioBR','color:#ff6b35;font-size:1.2em;','color:#f7c948;');
  window.game=new Game();
});
