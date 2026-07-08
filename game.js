// ===================================================================
// INFINITE RUNNER: WORLD TOUR v4.0 – COMPLETO & ESTÁVEL
// Autor: MagnorioBR | Magnoriobr@gmail.com
// Todos os direitos reservados © 2026
// ===================================================================
import * as THREE from 'three';

// ─── CONFIG ────────────────────────────────────────────────────────
const C={
  BS:100,RW:10,SW:3,BMN:8,BMX:40,VD:350,CH:1.7,
  BSP:2.222,SSP:3.333,MS:100,SD:20,SR:12,
  GR:9.8,JF:5,HA:.04,HF:2.5,DK:5
};
const hr=C.RW/2,se=hr+C.SW,bz1=se,bz2=C.BS/2;

// ─── UTILITÁRIOS ────────────────────────────────────────────────────
function hsh(x,z){let h=x*374761393+z*668265263;h=(h^(h>>13))*1274126177;return h^(h>>16)}
function sR(seed){let s=seed;return function(){s=(s*16807)%2147483647;return(s-1)/2147483646}}
function pn(x,z,s){const n=Math.sin(x*12.9898+z*78.233+s)*43758.5453;return n-Math.floor(n)}
function sn(x,z,s,sc=15){const nx=x/sc,nz=z/sc,ix=Math.floor(nx),iz=Math.floor(nz),fx=nx-ix,fz=nz-iz;const sx=fx*fx*(3-2*fx),sz=fz*fz*(3-2*fz);const n00=pn(ix,iz,s),n10=pn(ix+1,iz,s),n01=pn(ix,iz+1,s),n11=pn(ix+1,iz+1,s);return(n00+(n10-n00)*sx)+((n01+(n11-n01)*sx)-(n00+(n10-n00)*sx))*sz}
function fm(v){return Math.floor(v)}
function q(s){return document.querySelector(s)}
function qi(s){return document.getElementById(s)}

// ─── GERADOR DE TEXTURAS ────────────────────────────────────────────
class TG{
  constructor(){this.c={};this.cv=document.createElement('canvas');this.cv.width=1024;this.cv.height=1024;this.ctx=this.cv.getContext('2d')}
  _t(){const t=new THREE.CanvasTexture(this.cv);t.wrapS=THREE.RepeatWrapping;t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t}
  _as(seed){const r=sR(seed),c=this.ctx,w=1024;c.fillStyle=`rgb(${38+r()*22},${38+r()*22},${40+r()*22})`;c.fillRect(0,0,w,w);for(let i=0;i<40000;i++){let v=38+r()*28;c.fillStyle=`rgb(${v},${v},${v+3})`;c.fillRect(fm(r()*w),fm(r()*w),1+fm(r()*3),1+fm(r()*3))}c.strokeStyle='rgba(20,20,20,.22)';for(let i=0;i<4;i++){c.beginPath();let x=r()*w,y=r()*w;c.moveTo(x,y);for(let j=0;j<8;j++){x+=(r()-.5)*180;y+=(r()-.5)*180;c.lineTo(x,y)}c.lineWidth=.5+r()*2;c.stroke()}c.strokeStyle='rgba(30,30,30,.1)';for(let i=0;i<6;i++){let y=r()*w;c.beginPath();c.moveTo(0,y);c.lineTo(w,y+(r()-.5)*15);c.lineWidth=2+r()*5;c.stroke()}return this._t()}
  _sw(seed){const r=sR(seed),c=this.ctx,w=1024,br=175+r()*35,bg=170+r()*35,bb=165+r()*35;c.fillStyle=`rgb(${br},${bg},${bb})`;c.fillRect(0,0,w,w);const ts=100+r()*80;for(let x=0;x<w;x+=ts){for(let y=0;y<w;y+=ts){let v=r()*18-9;c.fillStyle=`rgb(${br+v},${bg+v},${bb+v})`;c.fillRect(x,y,ts-2,ts-2);c.fillStyle='rgba(90,90,90,.35)';c.fillRect(x+ts-3,y,3,ts);c.fillRect(x,y+ts-3,ts,3)}}for(let i=0;i<25;i++){let cx=r()*w,cy=r()*w,rad=8+r()*45;const g=c.createRadialGradient(cx,cy,0,cx,cy,rad);g.addColorStop(0,`rgba(70,65,60,${.08+r()*.16})`);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(cx-rad,cy-rad,rad*2,rad*2)}return this._t()}
  _gr(seed){const r=sR(seed),c=this.ctx,w=1024,bg=75+r()*60;c.fillStyle=`rgb(${15+r()*22},${bg},${15+r()*18})`;c.fillRect(0,0,w,w);for(let i=0;i<70000;i++){let g=bg+r()*45;c.fillStyle=`rgb(${12+r()*28},${g},${12+r()*22})`;c.fillRect(r()*w,r()*w,1,1+r()*4)}for(let i=0;i<12;i++){let cx=r()*w,cy=r()*w,rad=25+r()*90;const g=c.createRadialGradient(cx,cy,0,cx,cy,rad);g.addColorStop(0,r()>.5?'rgba(35,105,25,.15)':'rgba(55,135,35,.15)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(cx-rad,cy-rad,rad*2,rad*2)}return this._t()}
  _di(seed){const r=sR(seed),c=this.ctx,w=1024;c.fillStyle=`rgb(${100+r()*40},${65+r()*35},${30+r()*25})`;c.fillRect(0,0,w,w);for(let i=0;i<60000;i++){let dr=100+r()*50,dg=65+r()*40,db=30+r()*30;c.fillStyle=`rgb(${dr},${dg},${db})`;c.fillRect(r()*w,r()*w,1+r()*3,1+r()*3)}return this._t()}
  _bd(seed){const r=sR(seed),c=this.ctx,w=1024;const P=[[210,195,180],[175,165,158],[200,190,178],[160,150,142],[220,210,198],[180,170,162],[190,182,172],[205,195,185],[170,160,150],[215,205,193],[185,175,165],[198,188,178],[168,158,148],[208,198,188],[178,170,160],[195,185,175],[188,180,170],[212,202,192],[172,162,152],[202,194,184]];const p=P[fm(r()*P.length)];c.fillStyle=`rgb(${p[0]},${p[1]},${p[2]})`;c.fillRect(0,0,w,w);const ww=35+r()*25,wh=55+r()*35,sx=18+r()*35,sy=25+r()*45;for(let x=sx;x<w-ww;x+=ww+sx){for(let y=sy;y<w-wh;y+=wh+sy){c.fillStyle='rgba(35,35,40,.65)';c.fillRect(x-3,y-3,ww+6,wh+6);if(r()>.35){let wr=235+r()*20;c.fillStyle=`rgb(${wr},${wr-45},${wr-90})`}else{c.fillStyle=`rgb(${25+r()*25},${30+r()*25},${35+r()*25})`}c.fillRect(x,y,ww,wh);c.fillStyle='rgba(0,0,0,.22)';c.fillRect(x+ww/2-1,y,2,wh);c.fillRect(x,y+wh/2-1,ww,2)}}if(r()>.5){for(let y=180;y<900;y+=180+r()*120){c.fillStyle='rgba(55,55,60,.45)';c.fillRect(0,y,w,5+r()*4)}}return this._t()}
  _rf(seed){const r=sR(seed),c=this.ctx,w=1024,v=55+r()*45;c.fillStyle=`rgb(${v},${v-5},${v-10})`;c.fillRect(0,0,w,w);for(let y=0;y<w;y+=25+r()*22){c.fillStyle=`rgba(${v+12},${v+7},${v+2},.22)`;c.fillRect(0,y,w,12);c.fillStyle=`rgba(${v-12},${v-17},${v-22},.22)`;c.fillRect(0,y+12,w,13)}for(let i=0;i<8;i++){let cx=r()*w,cy=r()*w,rad=15+r()*60;const g=c.createRadialGradient(cx,cy,0,cx,cy,rad);g.addColorStop(0,`rgba(${v-20},${v-25},${v-30},.22)`);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(cx-rad,cy-rad,rad*2,rad*2)}return this._t()}
  gen(){for(let i=0;i<5;i++)this.c['a'+i]=this._as(1000+i);for(let i=0;i<5;i++)this.c['s'+i]=this._sw(2000+i);for(let i=0;i<4;i++)this.c['g'+i]=this._gr(3000+i);for(let i=0;i<3;i++)this.c['d'+i]=this._di(3500+i);for(let i=0;i<20;i++)this.c['b'+i]=this._bd(4000+i);for(let i=0;i<10;i++)this.c['r'+i]=this._rf(5000+i)}
  g(type,seed){const a=Math.abs(seed);const m={asphalt:['a',5],sidewalk:['s',5],grass:['g',4],dirt:['d',3],building:['b',20],roof:['r',10]};const e=m[type];if(!e)return this.c['a0'];const t=this.c[e[0]+(a%e[1])];const n=t.clone();n.needsUpdate=true;return n}
}

// ─── ÁUDIO PROCEDURAL ───────────────────────────────────────────────
class AU{
  constructor(){this.v=.8;this.mv=.5;this.ctx=null;}
  _e(){if(!this.ctx)try{this.ctx=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume();return this.ctx}
  fs(surf){const c=this._e();if(!c)return;const n=c.currentTime;const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);let f=surf==='grass'?55+Math.random()*35:surf==='dirt'?45+Math.random()*45:75+Math.random()*55;o.frequency.setValueAtTime(f,n);o.frequency.exponentialRampToValueAtTime(f*.25,n+.12);o.type=surf==='grass'?'sine':'triangle';g.gain.setValueAtTime(this.v*.14,n);g.gain.exponentialRampToValueAtTime(.001,n+.14);o.start(n);o.stop(n+.14);const b=c.createBuffer(1,fc(.1),c.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*.25;const s=c.createBufferSource(),ng=c.createGain();s.buffer=b;s.connect(ng);ng.connect(c.destination);ng.gain.setValueAtTime(this.v*(surf==='dirt'?.1:.05),n);ng.gain.exponentialRampToValueAtTime(.001,n+.1);s.start(n)}
  br(i){const c=this._e();if(!c)return;const n=c.currentTime;const b=c.createBuffer(1,fc(.4),c.sampleRate);const d=b.getChannelData(0);for(let j=0;j<d.length;j++)d[j]=(Math.random()*2-1)*.25*Math.sin(j/d.length*Math.PI*1.5);const s=c.createBufferSource(),g=c.createGain(),f=c.createBiquadFilter();s.buffer=b;s.connect(f);f.connect(g);g.connect(c.destination);f.type='bandpass';f.frequency.value=180+i*280;f.Q.value=1;g.gain.setValueAtTime(this.v*i*.07,n);g.gain.exponentialRampToValueAtTime(.001,n+.4);s.start(n);s.stop(n+.4)}
  ms(){const c=this._e();if(!c)return;const n=c.currentTime;[523,659,784,1047].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(this.v*.11,n+i*.12);g.gain.exponentialRampToValueAtTime(.001,n+i*.12+.22);o.start(n+i*.12);o.stop(n+i*.12+.22)})}
  dm(){const c=this._e();if(!c)return;const n=c.currentTime;const b=c.createBuffer(1,fc(.18),c.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*.4;const s=c.createBufferSource(),g=c.createGain();s.buffer=b;s.connect(g);g.connect(c.destination);g.gain.setValueAtTime(this.v*.18,n);g.gain.exponentialRampToValueAtTime(.001,n+.18);s.start(n)}
  sv(v){this.v=v/100}smv(v){this.mv=v/100}
}
function fc(s){return Math.floor(s*(new(window.AudioContext||window.webkitAudioContext)()).sampleRate)}

// ─── CÉU & NUVENS ──────────────────────────────────────────────────
class Sky{
  constructor(s){this.s=s;this.c=[];this.create()}
  create(){for(let i=0;i<40;i++){const g=new THREE.Group();const m=new THREE.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.6,roughness:1,depthWrite:false});for(let j=0;j<3;j++){const sp=new THREE.Mesh(new THREE.SphereGeometry(6+Math.random()*14,6,4),m);sp.position.set((Math.random()-.5)*22,Math.random()*4,(Math.random()-.5)*8);g.add(sp)}g.position.set((Math.random()-.5)*500,55+Math.random()*45,(Math.random()-.5)*500);g.userData={spd:.5+Math.random()*2};this.s.add(g);this.c.push(g)}}
  update(dt){this.c.forEach(c=>{c.position.x+=c.userData.spd*dt;if(c.position.x>280)c.position.x=-280})}
  setOpacity(v){this.c.forEach(c=>c.children.forEach(ch=>{if(ch.material)ch.material.opacity=.2+v*.5}))}
}

// ─── CHUVA ──────────────────────────────────────────────────────────
class Rain{
  constructor(s){this.s=s;this.mesh=null;this.intensity=0;this.target=0;this.groundWet=0;this.active=false}
  create(){if(this.mesh)return;const g=new THREE.BufferGeometry();const c=2500;const p=new Float32Array(c*3);for(let i=0;i<c;i++){p[i*3]=(Math.random()-.5)*100;p[i*3+1]=Math.random()*70;p[i*3+2]=(Math.random()-.5)*100}g.setAttribute('position',new THREE.BufferAttribute(p,3));this.mesh=new THREE.Points(g,new THREE.PointsMaterial({color:0xaaccff,size:.12,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));this.s.add(this.mesh)}
  update(dt,dm,au){
    const rnd=Math.sin(dm*.0001)*.5+.5;
    this.target=dm>.01?(rnd>.65?rnd*.75:0):0;
    this.intensity+=(this.target-this.intensity)*Math.min(dt*1.5,1);
    this.groundWet+=(this.intensity-this.groundWet)*Math.min(dt*.8,1);
    const was=this.active;this.active=this.intensity>.08;
    if(this.active&&!was)this.create();
    if(this.active&&this.mesh){
      const pp=this.mesh.geometry.attributes.position.array;
      for(let i=0;i<pp.length;i+=3){pp[i+1]-=14*dt*this.intensity;if(pp[i+1]<-1){pp[i+1]=69;pp[i]=(Math.random()-.5)*100;pp[i+2]=(Math.random()-.5)*100}}
      this.mesh.geometry.attributes.position.needsUpdate=true;
      this.mesh.material.opacity=.12+this.intensity*.35;
    }
    if(!this.active&&this.mesh&&this.intensity<.02){this.s.remove(this.mesh);this.mesh=null}
  }
  emoji(){return this.intensity>.6?'🌧️':this.intensity>.2?'🌦️':'☀️'}
}

// ─── MUNDO ──────────────────────────────────────────────────────────
class World{
  constructor(s,tg){this.s=s;this.tg=tg;this.blocks=new Map();this.ptf=new Map();this.pend=[]}
  getH(lx,lz,seed){const ax=Math.abs(lx);if(ax<hr)return 0;if(ax<se){const t=(ax-hr)/C.SW;return.15+t*.02}return.3+sn(lx,lz,seed,12)*.22}
  createBlock(bx,bz){
    const seed=hsh(bx,bz),BS=C.BS;
    const geo=new THREE.PlaneGeometry(BS,BS,18,18);geo.rotateX(-Math.PI/2);
    const pos=geo.attributes.position.array;
    for(let i=0;i<pos.length;i+=3)pos[i+1]=this.getH(pos[i],pos[i+2],seed);
    geo.computeVertexNormals();
    const aTex=this.tg.g('asphalt',seed);aTex.repeat.set(8,8);
    const mat=new THREE.MeshStandardMaterial({map:aTex,roughness:.88,metalness:.02,color:0xffffff});
    const mesh=new THREE.Mesh(geo,mat);mesh.receiveShadow=true;
    const g=new THREE.Group();g.add(mesh);g.position.set(bx*BS,0,bz*BS);mesh.position.set(0,0,0);
    // Meio-fio
    const cGeo=new THREE.BoxGeometry(.2,.1,BS);
    const cMat=new THREE.MeshStandardMaterial({color:0x777777,roughness:.5});
    for(let s=-1;s<=1;s+=2){const c=new THREE.Mesh(cGeo,cMat);c.position.set(s*hr,.05,0);c.castShadow=true;c.receiveShadow=true;g.add(c)}
    // Faixa
    const dGeo=new THREE.PlaneGeometry(.25,3.5);
    const dMat=new THREE.MeshStandardMaterial({color:0xffcc00,roughness:.4,emissive:0x111100});
    for(let z=-49;z<49;z+=7){const d=new THREE.Mesh(dGeo,dMat);d.rotation.x=-Math.PI/2;d.position.set(0,.015,z+3.5);g.add(d)}
    this.s.add(g);this.blocks.set(`${bx},${bz}`,g);
    this.schedulePopulate(bx,bz,g,seed);
  }
  schedulePopulate(bx,bz,g,seed){this.pend.push({bx,bz,g,seed});if(this.pend.length>8)this.pend.shift()}
  processPending(max=2){
    let done=0;
    while(this.pend.length>0&&done<max){
      const p=this.pend.shift();const r=sR(p.seed);this.populateBlock(p.g,p.bx,p.bz,r,p.seed);this.ptf.set(`${p.bx},${p.bz}`,true);done++
    }
  }
  populateBlock(g,bx,bz,r,seed){
    const BS=C.BS,hr2=C.RW/2,se2=hr2+C.SW,bzs=BS/2-se2,bzw=bzs*2;
    for(let side=-1;side<=1;side+=2){
      const bxC=side*(se2+bzs/2),nb=2+Math.floor(Math.abs(r())*3),bw=(BS-4)/nb;
      for(let b=0;b<nb;b++){
        const bzP=-BS/2+2+b*bw+bw/2,h=C.BMN+Math.abs(r())*(C.BMX-C.BMN);
        const geo=new THREE.BoxGeometry(bzs-.3,h,bw-.5);
        const tex=this.tg.g('building',seed+b*100+side*50);tex.repeat.set(1,Math.max(1,h/(bw-.5)));tex.offset.y=Math.abs(sR(seed+b+999)())*.4;
        const mat=new THREE.MeshStandardMaterial({map:tex,roughness:.55,metalness:.08});
        const bldg=new THREE.Mesh(geo,mat);bldg.position.set(bxC,h/2,bzP);bldg.castShadow=true;bldg.receiveShadow=true;g.add(bldg);
        const rGeo=new THREE.PlaneGeometry(bzs-.3,bw-.5);
        const rTex=this.tg.g('roof',seed+b*200+side*100);rTex.repeat.set(2,2);
        const roof=new THREE.Mesh(rGeo,new THREE.MeshStandardMaterial({map:rTex,roughness:.75}));roof.rotation.x=-Math.PI/2;roof.position.set(bxC,h+.02,bzP);g.add(roof);
      }
    }
    for(let side=-1;side<=1;side+=2){
      const tx=side*(hr2+C.SW/2);
      for(let tz=-BS/2+5;tz<BS/2-5;tz+=12+Math.abs(r())*18){
        if(Math.abs(r())>.2)g.add(this.tree(seed+fm(tz*1000)+side*3000,tx,tz));
      }
    }
    for(let side=-1;side<=1;side+=2){
      const px=side*(hr2+.5);
      for(let pz=-BS/2+10;pz<BS/2-10;pz+=22)g.add(this.post(px,pz));
    }
    for(let side=-1;side<=1;side+=2){
      const px=side*(hr2+C.SW-1);
      for(let pz=-BS/2+8;pz<BS/2-8;pz+=26+Math.abs(r())*20){
        if(Math.abs(r())>.45)g.add(this.bench(px,pz));else g.add(this.bin(px,pz));
      }
    }
  }
  tree(seed,x,z){
    const r=sR(seed),g=new THREE.Group(),th=1.5+r()*3.5;
    const t=new THREE.Mesh(new THREE.CylinderGeometry(.12,.18,th,8),new THREE.MeshStandardMaterial({color:0x5D4037,roughness:.85}));
    t.position.y=th/2;t.castShadow=true;g.add(t);
    const cc=[0x2E7D32,0x388E3C,0x43A047,0x4CAF50,0x1B5E20];const ns=2+fm(r()*3);
    for(let i=0;i<ns;i++){const cr=.6+r()*1.4;const c=new THREE.Mesh(new THREE.SphereGeometry(cr,8,6),new THREE.MeshStandardMaterial({color:cc[fm(Math.abs(r())*cc.length)],roughness:.75}));c.position.set((r()-.5)*1.8,th+.4+r()*1.8,(r()-.5)*1.8);c.castShadow=true;g.add(c)}
    g.position.set(x,0,z);return g;
  }
  post(x,z){const g=new THREE.Group();const m=new THREE.MeshStandardMaterial({color:0x2a2a2a,roughness:.3,metalness:.85});const p=new THREE.Mesh(new THREE.CylinderGeometry(.06,.1,5.5,8),m);p.position.y=2.75;p.castShadow=true;g.add(p);const a=new THREE.Mesh(new THREE.BoxGeometry(1.3,.07,.07),m);a.position.set(.65,5.2,0);g.add(a);const b=new THREE.Mesh(new THREE.SphereGeometry(.22,8,4),new THREE.MeshStandardMaterial({color:0xfffef0,emissive:0x333322,roughness:.25}));b.position.set(1.35,5.2,0);g.add(b);g.position.set(x,0,z);return g}
  bench(x,z){const g=new THREE.Group();const w=new THREE.MeshStandardMaterial({color:0x6D4C41,roughness:.65});const m=new THREE.MeshStandardMaterial({color:0x3a3a3a,roughness:.25,metalness:.9});for(let s=-1;s<=1;s+=2){const l=new THREE.Mesh(new THREE.BoxGeometry(.04,.55,.04),m);l.position.set(s*.65,.275,0);g.add(l)}g.add(new THREE.Mesh(new THREE.BoxGeometry(1.5,.06,.32),w)).position.y=.58;g.add(new THREE.Mesh(new THREE.BoxGeometry(1.5,.35,.04),w)).position.set(0,.78,-.15);g.position.set(x,0,z);return g}
  bin(x,z){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(.2,.16,.85,8),new THREE.MeshStandardMaterial({color:0x2E7D32,roughness:.4,metalness:.5}));b.position.y=.425;b.castShadow=true;g.add(b);g.position.set(x,0,z);return g}
  update(pz){
    const pbz=Math.floor(pz/C.BS),range=Math.ceil(C.VD/C.BS)+1;
    const needed=new Set();
    for(let bz=pbz-range;bz<=pbz+range;bz++)for(let bx=-2;bx<=2;bx++)needed.add(`${bx},${bz}`);
    for(const[k,b]of this.blocks){if(!needed.has(k)){this.s.remove(b);this.blocks.delete(k);this.ptf.delete(k)}needed.delete(k)}
    for(const k of needed){const[bx,bz]=k.split(',').map(Number);if(!this.blocks.has(k))this.createBlock(bx,bz)}
    this.processPending(1);
  }
}

// ─── JOGADOR ────────────────────────────────────────────────────────
class Player{
  constructor(cam){this.c=cam;this.c.position.set(0,C.CH,0);this.spd=0;this.tSpd=0;this.lat=0;this.tLat=0;this.dist=0;this.stam=C.MS;this.sprint=false;this.jumping=false;this.jv=0;this.vo=0;this.hp=100;this.alive=true;this.hbT=0;this.keys={};this.spdH=[];this._ik()}
  _ik(){const K=e=>{this.keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==='shift')this.sprint=true};const U=e=>{this.keys[e.key.toLowerCase()]=false;if(e.key.toLowerCase()==='shift')this.sprint=false};window.addEventListener('keydown',K);window.addEventListener('keyup',U);
    const b=(id,k,v)=>{const el=qi(id);if(!el)return;el.addEventListener('pointerdown',()=>{this.keys[k]=v;if(k==='shift')this.sprint=v;if(k==='w'&&v)this.keys['w']=true});el.addEventListener('pointerup',()=>{this.keys[k]=false;if(k==='shift')this.sprint=false});el.addEventListener('pointerleave',()=>{this.keys[k]=false;if(k==='shift')this.sprint=false})};
    b('mcl','a',true);b('mcr','d',true);b('mcj',' ',true);b('mcs','shift',true);b('mcs','w',true);
    document.addEventListener('touchstart',()=>{if(this.spd<1)this.keys['w']=true},{passive:true})}
  update(dt){
    if(!this.alive)return;dt=Math.min(dt,.1);
    if(this.keys['w'])this.tSpd=this.sprint&&this.stam>0?C.SSP:C.BSP;
    else if(this.keys['s'])this.tSpd=Math.max(0,this.spd-5*dt);
    else this.tSpd=Math.max(0,this.spd-1.5*dt);
    if(this.sprint&&this.keys['w']&&this.spd>C.BSP){this.stam=Math.max(0,this.stam-C.SD*dt);if(this.stam<=0)this.sprint=false}
    else this.stam=Math.min(C.MS,this.stam+C.SR*dt);
    this.spd+=(this.tSpd-this.spd)*Math.min(6*dt,1);
    this.dist+=this.spd*dt;
    if(this.keys['a'])this.tLat=-3;else if(this.keys['d'])this.tLat=3;else this.tLat=0;
    this.lat+=(this.tLat-this.lat)*Math.min(9*dt,1);
    if(this.keys[' ']&&!this.jumping){this.jumping=true;this.jv=C.JF}
    if(this.jumping){this.jv-=C.GR*dt;this.vo+=this.jv*dt;if(this.vo<=0){this.vo=0;this.jumping=false;this.jv=0}}
    if(this.spd>1)this.hbT+=dt*C.HF*(this.spd/C.BSP);
    const hbY=Math.sin(this.hbT*Math.PI*2)*C.HA*Math.min(this.spd/C.BSP,1.5);
    const hbX=Math.cos(this.hbT*Math.PI)*C.HA*.5;
    this.c.position.set(this.lat+hbX,C.CH+this.vo+hbY,this.dist);
    if(Math.abs(this.c.position.x)>bz2+.5){this.spd*=.62;this.c.position.x=Math.sign(this.c.position.x)*bz2;this.hp-=14;this.lat=this.c.position.x;this.tLat=this.c.position.x;this._dmg();if(this.hp<=0){this.alive=false;this.spd=0}}
    this.spdH.push(this.spd);if(this.spdH.length>180)this.spdH.shift();
  }
  _dmg(){const f=document.createElement('div');f.className='dmg';document.body.appendChild(f);setTimeout(()=>f.remove(),350)}
  avgSpd(){return this.spdH.length?this.spdH.reduce((a,b)=>a+b,0)/this.spdH.length:0}
}

// ─── PONTUAÇÃO ──────────────────────────────────────────────────────
class Score{
  constructor(){this.st=0;this.el=0;this.dist=0;this.cSpd=0;this.ms=[1,2,4,8,16,32,64,128,256,512,1024];this.reached=[];this.next=1;this.running=false;this.bd=parseFloat(localStorage.getItem('irbd')||'0');this.bm=parseFloat(localStorage.getItem('irbm')||'0')}
  start(){this.st=performance.now();this.running=true}
  update(sprinting){
    if(!this.running)return null;
    this.el=(performance.now()-this.st)/1000;
    this.cSpd=sprinting?C.SSP:C.BSP;this.dist=this.cSpd*this.el;
    const km=this.dist/1000;
    if(km>=this.next){const m=this.next;this.reached.push(m);const i=this.ms.indexOf(m);this.next=(i>=0&&i<this.ms.length-1)?this.ms[i+1]:this.next*2;return m}
    return null;
  }
  fd(){return(this.dist/1000).toFixed(2)+' km'}
  ft(){const s=Math.floor(this.el),m=Math.floor(s/60),h=Math.floor(m/60);return h>0?`${String(h).padStart(2,'0')}:${String(m%60).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`:`${String(m).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
  fp(){if(this.dist<5)return'--:-- /km';const ps=this.el/(this.dist/1000);return`${Math.floor(ps/60)}:${String(Math.floor(ps%60)).padStart(2,'0')} /km`}
  kmh(){return this.el>1?(this.dist/1000)/(this.el/3600):0}
  save(){const km=this.dist/1000;if(km>this.bd){this.bd=km;localStorage.setItem('irbd',km.toString())}const lm=this.reached.length?Math.max(...this.reached):0;if(lm>this.bm){this.bm=lm;localStorage.setItem('irbm',lm.toString())}}
}

// ─── DIA/NOITE ──────────────────────────────────────────────────────
class DN{
  constructor(s){this.s=s;this.tod=8;this.sun=new THREE.DirectionalLight(0xfff5e6,1.5);this.sun.position.set(50,80,30);this.sun.castShadow=true;this.sun.shadow.mapSize.set(2048,2048);this.sun.shadow.camera.near=.5;this.sun.shadow.camera.far=300;this.sun.shadow.camera.left=-60;this.sun.shadow.camera.right=60;this.sun.shadow.camera.top=60;this.sun.shadow.camera.bottom=-60;s.add(this.sun);this.amb=new THREE.AmbientLight(0x404060,.4);s.add(this.amb);this.hemi=new THREE.HemisphereLight(0x87CEEB,0x362907,.3);s.add(this.hemi);this.skyGrad=null}
  update(dist){
    const hp=(dist/1000)/C.DK;this.tod=(8+hp)%24;const dc=this.tod/24,sa=dc*Math.PI*2,sh=Math.sin(sa);
    this.sun.position.set(Math.cos(sa)*100,sh*100,30);
    const i=Math.max(.04,sh+.2);this.sun.intensity=i*2;this.amb.intensity=Math.max(.08,i*.4);
    if(sh>-.1){this.s.background=new THREE.Color(.3+sh*.3,.5+sh*.3,.8+sh*.2);this.s.fog=new THREE.Fog(new THREE.Color(.7,.75,.8),60,C.VD)}
    else{const nf=Math.abs(sh);this.s.background=new THREE.Color(.02+nf*.04,.02+nf*.04,.08+nf*.08);this.s.fog=new THREE.Fog(new THREE.Color(.02,.02,.05),25,C.VD*.7)}
  }
}

// ─── UI ─────────────────────────────────────────────────────────────
const $=id=>qi(id);
function maskIp(ip){const p=ip.split('.');return p.length===4?`${p[0]}.${p[1]}.***.***`:ip}
function getRank(){return JSON.parse(localStorage.getItem('irrk')||'[]')}
function saveRank(ip,dist,ms,time){
  const scores=getRank();scores.push({ip,dist:parseFloat(dist.toFixed(2)),ms,time,date:new Date().toISOString().slice(0,10)});
  scores.sort((a,b)=>b.dist-a.dist);const top=scores.slice(0,100);localStorage.setItem('irrk',JSON.stringify(top));return top;
}
async function getIp(){try{const r=await fetch('https://api.ipify.org?format=json');const d=await r.json();return d.ip}catch(e){return'local_'+Math.random().toString(36).slice(2,8)}}

function renderRank(ip){
  const scores=getRank(),rb=$('rb'),rp=$('rp');let h='';
  scores.forEach((s,i)=>{const isP=s.ip===ip;h+=`<tr class="${isP?'pr':''}"><td>${i<3?['🥇','🥈','🥉'][i]:i+1+'º'}</td><td>${maskIp(s.ip)}</td><td>${s.dist.toFixed(2)} km</td><td>${s.ms||0}</td><td>${s.time}</td></tr>`});
  if(!scores.length)h='<tr><td colspan="5">Nenhum resultado</td></tr>';
  rb.innerHTML=h;const pi=scores.findIndex(s=>s.ip===ip);rp.textContent=pi>=0?`Sua posição: ${pi+1}º`:'Jogue para aparecer!';
}

// ─── JOGO PRINCIPAL ────────────────────────────────────────────────
class Game{
  constructor(){this.st='loading';this.scene=null;this.cam=null;this.rnd=null;this.tg=null;this.world=null;this.player=null;this.score=null;this.dn=null;this.sky=null;this.rain=null;this.au=null;this.ip='';this.stTimer=0;this.brTimer=0;this.lastT=0;this.msCount=0;this.init()}
  async init(){
    this._l(5,'Inicializando motor gráfico…');await this._w(60);
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x87CEEB);this.scene.fog=new THREE.Fog(0xCCDDFF,60,C.VD);
    this.cam=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,C.VD+100);
    this.rnd=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});this.rnd.setSize(window.innerWidth,window.innerHeight);this.rnd.setPixelRatio(Math.min(window.devicePixelRatio,2));
    this.rnd.shadowMap.enabled=true;this.rnd.shadowMap.type=THREE.PCFSoftShadowMap;this.rnd.toneMapping=THREE.ACESFilmicToneMapping;this.rnd.toneMappingExposure=1.1;
    qi('game-container')?.appendChild?.(this.rnd.domElement)||document.body.appendChild(this.rnd.domElement);
    this._l(15,'Gerando texturas…');await this._w(60);this.tg=new TG();this.tg.gen();
    this._l(25,'Preparando áudio…');await this._w(40);this.au=new AU();
    this._l(35,'Construindo mundo…');await this._w(60);this.world=new World(this.scene,this.tg);
    this._l(50,'Criando céu e clima…');await this._w(50);this.sky=new Sky(this.scene);this.rain=new Rain(this.scene);
    this.dn=new DN(this.scene);
    this._l(65,'Preparando jogador…');await this._w(40);this.player=new Player(this.cam);this.score=new Score();
    this._l(85,'Conectando ranking…');try{this.ip=await getIp()}catch(e){this.ip='local'}this._l(100,'Pronto!');await this._w(350);
    qi('loading').style.display='none';this.st='menu';this._show('menu');this._events();window.addEventListener('resize',()=>{this.cam.aspect=window.innerWidth/window.innerHeight;this.cam.updateProjectionMatrix();this.rnd.setSize(window.innerWidth,window.innerHeight)});
    renderRank(this.ip);$('brec').textContent=this.score.bd.toFixed(2)+' km';this.lastT=performance.now();this._loop();
  }
  _l(p,t){const b=$('lbar');if(b)b.style.width=p+'%';const m=$('load-t');if(m)m.textContent=t}
  _w(ms){return new Promise(r=>setTimeout(r,ms))}
  _show(id){['menu','rank','conf','hud','pause','go'].forEach(s=>{const e=$(s);if(e)e.style.display=s===id?'flex':'none'});const mc=$('mc');if(mc)mc.style.display=(id==='hud'&&window.innerWidth<1024)?'flex':'none'}
  _events(){
    $('bs').addEventListener('click',()=>this.start());
    $('brk').addEventListener('click',()=>{renderRank(this.ip);this._show('rank')});
    $('bcf').addEventListener('click',()=>this._show('conf'));
    $('bcr').addEventListener('click',()=>this._show('menu'));
    $('bcc').addEventListener('click',()=>this._show('menu'));
    $('bres').addEventListener('click',()=>this.resume());
    $('brst').addEventListener('click',()=>this.restart());
    $('bqt').addEventListener('click',()=>this.quit());
    $('brtry').addEventListener('click',()=>this.restart());
    $('bgm').addEventListener('click',()=>this.quit());
    $('vm').addEventListener('input',e=>this.au.smv(e.target.value));
    $('ve').addEventListener('input',e=>this.au.sv(e.target.value));
    $('wm').addEventListener('change',e=>{if(this.rain)this.rain.mode=e.target.value});
    window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(this.st==='playing')this._pause();else if(this.st==='paused')this.resume()}});
  }
  start(){
    this._clean();this.player=new Player(this.cam);this.score=new Score();this.score.start();
    this.st='playing';this.stTimer=0;this.brTimer=0;this.msCount=0;this._show('hud');this.lastT=performance.now();
  }
  _clean(){if(this.world){for(const[k,b]of this.world.blocks){this.scene.remove(b)}this.world.blocks.clear();this.world.ptf.clear();this.world.pend=[]}}
  _pause(){this.st='paused';this._show('pause')}
  resume(){this.st='playing';this._show('hud');this.lastT=performance.now()}
  restart(){this._show('hud');this.start()}
  quit(){
    if(this.player&&this.player.dist>10){this.score.save();const ms=this.score.reached.length?Math.max(...this.score.reached):0;saveRank(this.ip,this.player.dist/1000,ms,this.score.ft());renderRank(this.ip)}
    this._clean();this.st='menu';this._show('menu');$('brec').textContent=this.score.bd.toFixed(2)+' km'
  }
  _go(){this.st='gameover';this.score.save();const ms=this.score.reached.length?Math.max(...this.score.reached):0;saveRank(this.ip,this.player.dist/1000,ms,this.score.ft());$('gd').textContent=(this.player.dist/1000).toFixed(2)+' km';$('gt').textContent=this.score.ft();$('gm').textContent=ms+' km';$('gs').textContent=Math.round(this.player.avgSpd()*3.6)+' km/h';$('gmsg').textContent='✅ Pontuação enviada ao ranking!';this._show('go')}
  _loop(){
    requestAnimationFrame(()=>this._loop());
    const now=performance.now();let dt=(now-this.lastT)/1000;this.lastT=now;dt=Math.min(dt,.15);
    if(this.st==='playing'){
      this.player.update(dt);
      this.world.update(this.player.dist);
      const ms=this.score.update(this.player.sprint);
      if(ms){this.msCount++;this._flashMs(ms);this.au.ms()}
      this.dn.update(this.player.dist);
      this.sky.update(dt);
      const wm=$('wm');if(wm&&this.rain){if(wm.value==='rain'){this.rain.target=1}else if(wm.value==='clear'){this.rain.target=0}}
      this.rain.update(dt,this.player.dist,this.au);this.sky.setOpacity(this.rain.intensity);
      if(this.player.spd>1){this.stTimer+=dt*(this.player.spd/C.BSP);if(this.stTimer>.45){this.stTimer=0;const px=this.cam.position.x;let s='asphalt';if(Math.abs(px)>se)s='grass';else if(Math.abs(px)>hr)s='sidewalk';this.au.fs(s)}}
      if(this.player.spd>1){this.brTimer+=dt;if(this.brTimer>3){this.brTimer=0;const i=Math.min(1,(this.player.dist/1000)/10);if(i>.2)this.au.br(i)}}
      this._updHUD();if(!this.player.alive){this.au.dm();this._go()}
    }
    this.rnd.render(this.scene,this.cam);
  }
  _flashMs(km){const o=$('ms'),v=$('msv');if(!o||!v)return;v.textContent=km+' km';o.style.display='flex';o.style.animation='none';void o.offsetHeight;o.style.animation='mi 2.5s ease-out forwards';setTimeout(()=>{o.style.display='none'},2500)}
  _updHUD(){
    $('hd').textContent=this.score.fd();$('ht').textContent=this.score.ft();$('hp').textContent=this.score.fp();
    $('hn').textContent=this.score.next+' km';$('hs').textContent=Math.round(this.player.spd*3.6)+' km/h';
    $('hrc').textContent=this.score.bd.toFixed(1)+' km';
    const sf=$('sf');sf.style.width=this.player.stam+'%';sf.style.background=this.player.stam<25?'linear-gradient(90deg,#f44336,#ff9800)':this.player.stam<50?'linear-gradient(90deg,#ff9800,#ffc107)':'linear-gradient(90deg,#4CAF50,#8BC34A)';
    $('wi').textContent=this.rain.emoji();
    $('brec').textContent=this.score.bd.toFixed(2)+' km';
  }
}

// ─── INICIALIZAÇÃO ──────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded',()=>{
  console.log('%c🏃 Infinite Runner: World Tour v4.0 %c| %cMagnorioBR','color:#ff5e2c;font-size:1.2em','color:#fff','color:#ffb833');
  console.log('%c© 2026 Todos os direitos reservados','color:#888');
  new Game();
});
