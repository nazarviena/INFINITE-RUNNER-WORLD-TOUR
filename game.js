// ===================================================================
// INFINITE RUNNER: WORLD TOUR v5.0
// Autor: MagnorioBR | Magnoriobr@gmail.com
// © 2026 Todos os direitos reservados
// ===================================================================
// CORREÇÕES v5.0:
// - W = CORRER PARA FRENTE (direção da câmera)
// - Mouse Look com pointer lock
// - Texturas detalhadas nos prédios (graffiti, janelas)
// - Biomas: cidade → fazenda → praia → floresta
// - Score diminui ao andar para trás
// ===================================================================
import * as THREE from 'three';

const C={
  BS:100,RW:10,SW:3,BMN:8,BMX:40,VD:400,CH:1.7,
  BSP:2.222,SSP:3.333,MS:100,SD:20,SR:12,
  GR:9.8,JF:5,HA:.04,HF:2.5,DK:5
};
const hr=C.RW/2,se=hr+C.SW,bz2=C.BS/2;
const $=id=>document.getElementById(id);
const PI2=Math.PI*2;

// ─── HELPERS ─────────────────────────────────────────────────
function hsh(x,z){let h=x*374761393+z*668265263;h=(h^(h>>13))*1274126177;return h^(h>>16)}
function sR(s){let v=s;return()=>{v=(v*16807)%2147483647;return(v-1)/2147483646}}
function pn(x,z,s){return Math.sin(x*12.9898+z*78.233+s)*43758.5453%1}

// ─── TEXTURAS DETALHADAS (512px, graffiti, janelas) ──────────
class TG{
  constructor(){this.c={};this.cv=document.createElement('canvas');this.cv.width=512;this.cv.height=512;this.ctx=this.cv.getContext('2d')}
  _t(){const t=new THREE.CanvasTexture(this.cv);t.wrapS=THREE.RepeatWrapping;t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t}
  asphalt(seed){const c=this.ctx,w=512,r=sR(seed);c.fillStyle='#333';c.fillRect(0,0,w,w);for(let i=0;i<8000;i++){const v=35+r()*30;c.fillStyle=`rgb(${v},${v},${v+3})`;c.fillRect(r()*w,r()*w,1+r()*3,1+r()*3)}c.strokeStyle='rgba(20,20,20,.2)';for(let i=0;i<3;i++){c.beginPath();let x=r()*w,y=r()*w;c.moveTo(x,y);for(let j=0;j<6;j++){x+=(r()-.5)*150;y+=(r()-.5)*150;c.lineTo(x,y)}c.lineWidth=.5+r()*2;c.stroke()}return this._t()}
  sidewalk(seed){const c=this.ctx,w=512,r=sR(seed),br=175+r()*35;c.fillStyle=`rgb(${br},${br-5},${br-10})`;c.fillRect(0,0,w,w);const ts=90+r()*50;for(let x=0;x<w;x+=ts)for(let y=0;y<w;y+=ts){const v=r()*12-6;c.fillStyle=`rgb(${br+v},${br-5+v},${br-10+v})`;c.fillRect(x+1,y+1,ts-3,ts-3)}return this._t()}
  grass(seed){const c=this.ctx,w=512,r=sR(seed),bg=75+r()*50;c.fillStyle=`rgb(${20},${bg},${18})`;c.fillRect(0,0,w,w);for(let i=0;i<15000;i++){const g=bg+r()*40;c.fillStyle=`rgb(${12+r()*25},${g},${10+r()*20})`;c.fillRect(r()*w,r()*w,1,1+r()*3)}return this._t()}
  dirt(seed){const c=this.ctx,w=512,r=sR(seed);c.fillStyle=`rgb(${95+r()*45},${60+r()*35},${28+r()*25})`;c.fillRect(0,0,w,w);for(let i=0;i<10000;i++){const dr=95+r()*50;c.fillStyle=`rgb(${dr},${dr*.6},${dr*.3})`;c.fillRect(r()*w,r()*w,1+r()*2,1+r()*2)}return this._t()}
  sand(seed){const c=this.ctx,w=512,r=sR(seed);c.fillStyle=`rgb(${210+r()*35},${190+r()*30},${140+r()*40})`;c.fillRect(0,0,w,w);for(let i=0;i<6000;i++){c.fillStyle=`rgb(${215+r()*30},${195+r()*25},${145+r()*35})`;c.fillRect(r()*w,r()*w,1+r()*2,1+r()*2)}return this._t()}
  building(seed){const c=this.ctx,w=512,r=sR(seed);
    const pals=[[210,195,180],[175,165,158],[200,190,178],[160,150,142],[220,210,198],[180,170,162],[190,182,172],[205,195,185],[170,160,150],[215,205,193],[185,175,165],[198,188,178],[168,158,148],[208,198,188]];
    const p=pals[Math.floor(r()*pals.length)];c.fillStyle=`rgb(${p[0]},${p[1]},${p[2]})`;c.fillRect(0,0,w,w);
    // Janelas detalhadas
    const ww=30+r()*22,wh=50+r()*28,sx=15+r()*30,sy=18+r()*35;
    for(let x=sx;x<w-ww;x+=ww+sx){for(let y=sy;y<w-wh;y+=wh+sy){
      c.fillStyle='rgba(30,30,35,.65)';c.fillRect(x-3,y-3,ww+6,wh+6);
      if(r()>.35){const wr=235+r()*20;c.fillStyle=`rgb(${wr},${wr-45},${wr-90})`}else{c.fillStyle=`rgb(${25+r()*20},${30+r()*20},${35+r()*20})`}
      c.fillRect(x,y,ww,wh);c.fillStyle='rgba(0,0,0,.2)';c.fillRect(x+ww/2-1,y,2,wh);c.fillRect(x,y+wh/2-1,ww,2);
    }}
    // Graffiti aleatório
    if(r()>.6){c.fillStyle='rgba(180,40,80,.4)';const gx=50+r()*(w-150),gy=80+r()*(w-200);c.font='bold '+(14+r()*18)+'px sans-serif';c.fillText('GRAFFITI',gx,gy);c.fillStyle='rgba(40,120,200,.35)';c.fillText('ART',gx+r()*40-20,gy+r()*30-15)}
    // Manchas de sujeira
    for(let i=0;i<8;i++){const cx=r()*w,cy=r()*w,rad=8+r()*25;c.fillStyle=`rgba(40,35,30,${.05+r()*.1})`;c.beginPath();c.arc(cx,cy,rad,0,PI2);c.fill()}
    return this._t()}
  roof(seed){const c=this.ctx,w=512,r=sR(seed),v=55+r()*40;c.fillStyle=`rgb(${v},${v-5},${v-10})`;c.fillRect(0,0,w,w);for(let y=0;y<w;y+=20+r()*18){c.fillStyle=`rgba(${v+10},${v+5},${v},.2)`;c.fillRect(0,y,w,9);c.fillStyle=`rgba(${v-10},${v-15},${v-20},.2)`;c.fillRect(0,y+9,w,11)}return this._t()}
  gen(){for(let i=0;i<4;i++)this.c['a'+i]=this.asphalt(1000+i);for(let i=0;i<4;i++)this.c['s'+i]=this.sidewalk(2000+i);for(let i=0;i<2;i++)this.c['g'+i]=this.grass(3000+i);for(let i=0;i<2;i++)this.c['d'+i]=this.dirt(3500+i);for(let i=0;i<1;i++)this.c['sd'+i]=this.sand(3700+i);for(let i=0;i<8;i++)this.c['b'+i]=this.building(4000+i);for(let i=0;i<4;i++)this.c['r'+i]=this.roof(5000+i)}
  get(type,seed){const a=Math.abs(seed);const m={asphalt:['a',4],sidewalk:['s',4],grass:['g',2],dirt:['d',2],sand:['sd',1],building:['b',8],roof:['r',4]};const e=m[type];if(!e)return this.c['a0'];return this.c[e[0]+(a%e[1])].clone()}
}

// ─── AUDIO ────────────────────────────────────────────────────
class AU{
  constructor(){this.v=.8;this.ctx=null;this.sr=44100}
  _e(){if(!this.ctx){try{this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.sr=this.ctx.sampleRate}catch(e){return null}}if(this.ctx.state==='suspended')this.ctx.resume();return this.ctx}
  fs(surf){const c=this._e();if(!c)return;const n=c.currentTime,o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);let f=surf==='grass'?55+Math.random()*35:surf==='dirt'?45+Math.random()*45:75+Math.random()*55;o.frequency.setValueAtTime(f,n);o.frequency.exponentialRampToValueAtTime(f*.25,n+.12);o.type=surf==='grass'?'sine':'triangle';g.gain.setValueAtTime(this.v*.1,n);g.gain.exponentialRampToValueAtTime(.001,n+.14);o.start(n);o.stop(n+.14)}
  br(i){const c=this._e();if(!c)return;const n=c.currentTime,len=Math.floor(this.sr*.3),b=c.createBuffer(1,len,this.sr),d=b.getChannelData(0);for(let j=0;j<len;j++)d[j]=(Math.random()*2-1)*.2*Math.sin(j/len*Math.PI);const s=c.createBufferSource(),g=c.createGain();s.buffer=b;s.connect(g);g.connect(c.destination);g.gain.setValueAtTime(this.v*i*.05,n);g.gain.exponentialRampToValueAtTime(.001,n+.3);s.start(n)}
  ms(){const c=this._e();if(!c)return;const n=c.currentTime;[523,659,784,1047].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.06,n+i*.1);g.gain.exponentialRampToValueAtTime(.001,n+i*.1+.2);o.start(n+i*.1);o.stop(n+i*.1+.2)})}
  dm(){const c=this._e();if(!c)return;const n=c.currentTime,len=Math.floor(this.sr*.12),b=c.createBuffer(1,len,this.sr),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*.3;const s=c.createBufferSource(),g=c.createGain();s.buffer=b;s.connect(g);g.connect(c.destination);g.gain.setValueAtTime(this.v*.12,n);g.gain.exponentialRampToValueAtTime(.001,n+.12);s.start(n)}
}

// ─── BIOMAS ──────────────────────────────────────────────────
const BIOMES={city:{name:'🏙️ Cidade',bldgDensity:.7,bldgH:1,treeDensity:.2,ground:'sidewalk',fence:false},
  farm:{name:'🌾 Fazenda',bldgDensity:.15,bldgH:.3,treeDensity:.1,ground:'dirt',fence:true},
  beach:{name:'🏖️ Praia',bldgDensity:.05,bldgH:.2,treeDensity:.4,ground:'sand',fence:false},
  forest:{name:'🌲 Floresta',bldgDensity:0,bldgH:0,treeDensity:.9,ground:'grass',fence:false}};
const BIOME_ORDER=['city','farm','city','forest','beach','city','farm','city','forest','beach'];

function getBiome(distKm){const i=Math.floor(distKm/1.5)%BIOME_ORDER.length;return BIOMES[BIOME_ORDER[i]]||BIOMES.city}

// ─── MUNDO ────────────────────────────────────────────────────
function makeWorld(scene,tg){
  const mats={};
  mats.curb=new THREE.MeshStandardMaterial({color:0x777777,roughness:.5});
  mats.treeT=new THREE.MeshStandardMaterial({color:0x5D4037,roughness:.85});
  mats.treeC=[0x2E7D32,0x388E3C,0x43A047,0x4CAF50,0x1B5E20].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.75}));
  mats.postM=new THREE.MeshStandardMaterial({color:0x2a2a2a,roughness:.3,metalness:.85});
  mats.postB=new THREE.MeshStandardMaterial({color:0xfffef0,emissive:0x333322,roughness:.25});
  mats.benchW=new THREE.MeshStandardMaterial({color:0x6D4C41,roughness:.65});
  mats.benchM=new THREE.MeshStandardMaterial({color:0x3a3a3a,roughness:.25,metalness:.9});
  mats.binM=new THREE.MeshStandardMaterial({color:0x2E7D32,roughness:.4,metalness:.5});
  mats.yellow=new THREE.MeshStandardMaterial({color:0xffcc00,roughness:.4,emissive:0x111100});
  mats.fence=new THREE.MeshStandardMaterial({color:0x8B7355,roughness:.7});
  mats.palmT=new THREE.MeshStandardMaterial({color:0xA1887F,roughness:.8});
  mats.palmC=new THREE.MeshStandardMaterial({color:0x388E3C,roughness:.7});

  const blocks=new Map();

  function getH(lx,lz,seed){const ax=Math.abs(lx);if(ax<hr)return 0;if(ax<se)return.15+(ax-hr)/C.SW*.02;return.3+(pn(lx*3,lz*3,seed)*.5+.5)*.25}

  function mkBlock(bx,bz){
    const key=bx+','+bz;if(blocks.has(key))return;
    const seed=hsh(bx,bz),BS=C.BS;
    const geo=new THREE.PlaneGeometry(BS,BS,10,10);geo.rotateX(-Math.PI/2);
    const pos=geo.attributes.position.array;
    for(let i=0;i<pos.length;i+=3)pos[i+1]=getH(pos[i],pos[i+2],seed);
    geo.computeVertexNormals();
    // Ground texture depends on biome
    const distKm=Math.abs(bz*BS)/1000;
    const biome=getBiome(distKm);
    const gTex=tg.get(biome.ground==='sand'?'sand':biome.ground==='dirt'?'dirt':'asphalt',seed);
    gTex.repeat.set(biome.ground==='sand'?4:6,biome.ground==='sand'?4:6);
    const mat=new THREE.MeshStandardMaterial({map:gTex,roughness:biome.ground==='sand'?.6:.88,metalness:.02});
    const mesh=new THREE.Mesh(geo,mat);mesh.receiveShadow=true;
    const g=new THREE.Group();g.add(mesh);g.position.set(bx*BS,0,bz*BS);mesh.position.set(0,0,0);
    // Curbs + road lines (only on city/asphalt biomes)
    if(biome.ground!=='sand'&&biome.ground!=='dirt'){
      const cGeo=new THREE.BoxGeometry(.2,.1,BS);
      for(let s=-1;s<=1;s+=2){const c=new THREE.Mesh(cGeo,mats.curb);c.position.set(s*hr,.05,0);c.castShadow=true;c.receiveShadow=true;g.add(c)}
      const dGeo=new THREE.PlaneGeometry(.2,3);
      for(let z=-48;z<48;z+=6){const d=new THREE.Mesh(dGeo,mats.yellow);d.rotation.x=-Math.PI/2;d.position.set(0,.015,z+3);g.add(d)}
    }
    scene.add(g);blocks.set(key,{grp:g,seed,biome,pop:false});
  }

  function popBlock(key){
    const b=blocks.get(key);if(!b||b.pop)return;b.pop=true;
    const g=b.grp,seed=b.seed,biome=b.biome,r=sR(seed),BS=C.BS,bzs=BS/2-se,bzw=bzs*2;
    // Buildings based on biome density
    if(biome.bldgDensity>0){
      for(let side=-1;side<=1;side+=2){
        const bxC=side*(se+bzs/2),nb=Math.max(1,Math.floor(biome.bldgDensity*4)),bw=(BS-3)/nb;
        for(let i=0;i<nb;i++){
          const bzP=-BS/2+1.5+i*bw+bw/2;
          const h=(C.BMN+Math.abs(r())*(C.BMX-C.BMN))*Math.max(0.3,biome.bldgH);
          if(h<2)continue;
          const geo=new THREE.BoxGeometry(bzs-.2,h,bw-.4);
          const tex=tg.get('building',seed+i*100+side*50);tex.repeat.set(1,Math.max(1,h/(bw-.4)));
          const bm=new THREE.MeshStandardMaterial({map:tex,roughness:.55,metalness:.08});
          const bldg=new THREE.Mesh(geo,bm);bldg.position.set(bxC,h/2,bzP);bldg.castShadow=true;bldg.receiveShadow=true;g.add(bldg);
          const rGeo=new THREE.PlaneGeometry(bzs-.2,bw-.4);
          const rTex=tg.get('roof',seed+i*200+side*100);rTex.repeat.set(2,2);
          const rf=new THREE.Mesh(rGeo,new THREE.MeshStandardMaterial({map:rTex,roughness:.75}));rf.rotation.x=-Math.PI/2;rf.position.set(bxC,h+.02,bzP);g.add(rf);
        }
      }
    }
    // Fences for farms
    if(biome.fence){
      for(let side=-1;side<=1;side+=2){
        const fx=side*(hr+C.SW-1);
        for(let z=-48;z<48;z+=4+r()*6){
          const fp=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,1.5,4),mats.fence);fp.position.set(fx,.75,z);fp.castShadow=true;g.add(fp);
        }
        const fh=new THREE.Mesh(new THREE.BoxGeometry(.04,.08,BS),mats.fence);fh.position.set(fx,.7,0);g.add(fh);
      }
    }
    // Trees based on biome
    if(biome.treeDensity>0){
      for(let side=-1;side<=1;side+=2){
        const tx=side*(hr+C.SW/2);
        for(let tz=-BS/2+5;tz<BS/2-5;tz+=8+Math.abs(r())*16){
          if(Math.abs(r())<biome.treeDensity){
            const tr=new THREE.Group();const th=1.5+r()*3.5;
            // Palm trees for beach
            if(biome.ground==='sand'){const tk=new THREE.Mesh(new THREE.CylinderGeometry(.08,.14,th,6),mats.palmT);tk.position.y=th/2;tk.castShadow=true;tr.add(tk);const cr=.6+r()*1.2;const cn=new THREE.Mesh(new THREE.SphereGeometry(cr,6,4),mats.palmC);cn.position.set(0,th+.5,0);cn.castShadow=true;tr.add(cn)}
            else{const tk=new THREE.Mesh(new THREE.CylinderGeometry(.1,.16,th,6),mats.treeT);tk.position.y=th/2;tk.castShadow=true;tr.add(tk);const ns=2+Math.floor(r()*3);for(let j=0;j<ns;j++){const cr=.5+r()*1.3;const cn=new THREE.Mesh(new THREE.SphereGeometry(cr,6,4),mats.treeC[Math.floor(Math.abs(r())*mats.treeC.length)]);cn.position.set((r()-.5)*1.6,th+.3+r()*1.6,(r()-.5)*1.6);cn.castShadow=true;tr.add(cn)}}
            tr.position.set(tx,0,tz);g.add(tr);
          }
        }
      }
    }
    // Street furniture (city only)
    if(biome.bldgDensity>.3){
      for(let side=-1;side<=1;side+=2){
        const px=side*(hr+.5);
        for(let pz=-BS/2+10;pz<BS/2-10;pz+=22){
          const pg=new THREE.Group();const p=new THREE.Mesh(new THREE.CylinderGeometry(.05,.09,5,6),mats.postM);p.position.y=2.5;p.castShadow=true;pg.add(p);
          const a=new THREE.Mesh(new THREE.BoxGeometry(1.2,.06,.06),mats.postM);a.position.set(.6,4.8,0);pg.add(a);
          const lb=new THREE.Mesh(new THREE.SphereGeometry(.2,6,3),mats.postB);lb.position.set(1.25,4.8,0);pg.add(lb);pg.position.set(px,0,pz);g.add(pg);
        }
        const bx=side*(hr+C.SW-1);
        for(let pz=-BS/2+12;pz<BS/2-12;pz+=26+Math.abs(r())*18){
          if(Math.abs(r())>.45){const bg=new THREE.Group();for(let l=-1;l<=1;l+=2){const leg=new THREE.Mesh(new THREE.BoxGeometry(.04,.55,.04),mats.benchM);leg.position.set(l*.65,.275,0);bg.add(leg)}bg.add(new THREE.Mesh(new THREE.BoxGeometry(1.5,.06,.32),mats.benchW)).position.y=.58;bg.add(new THREE.Mesh(new THREE.BoxGeometry(1.5,.35,.04),mats.benchW)).position.set(0,.78,-.15);bg.position.set(bx,0,pz);g.add(bg)}
          else{const bg=new THREE.Group();const bin=new THREE.Mesh(new THREE.CylinderGeometry(.2,.16,.85,8),mats.binM);bin.position.y=.425;bin.castShadow=true;bg.add(bin);bg.position.set(bx,0,pz);g.add(bg)}
        }
      }
    }
  }

  function upd(playerPosZ){
    const pbz=Math.floor(playerPosZ/C.BS),range=Math.ceil(C.VD/C.BS)+1;
    const needed=new Set();
    for(let bz=pbz-range;bz<=pbz+range;bz++)for(let bx=-2;bx<=2;bx++)needed.add(bx+','+bz);
    for(const[k,b]of blocks){if(!needed.has(k)){scene.remove(b.grp);blocks.delete(k)}needed.delete(k)}
    for(const k of needed){const[bx,bz]=k.split(',').map(Number);mkBlock(bx,bz)}
    let done=0;for(const[k,b]of blocks){if(!b.pop&&done<2){popBlock(k);done++}}
  }

  return {upd,blocks};
}

// ─── MOUSE LOOK ──────────────────────────────────────────────
function setupMouse(cam,canvas){
  let yaw=0,pitch=0,locked=false;
  const sens=.002;
  canvas.addEventListener('click',()=>{if(!locked&&game.st==='playing'){canvas.requestPointerLock();$('lock-msg').style.display='none'}});
  document.addEventListener('pointerlockchange',()=>{locked=document.pointerLockElement===canvas;$('crosshair').style.display=locked&&window.innerWidth>=1024?'block':'none';if(!locked&&game.st==='playing')$('lock-msg').style.display='block'});
  document.addEventListener('mousemove',e=>{if(!locked)return;yaw-=e.movementX*sens*(parseInt($('vs')?.value||3)/3);pitch-=e.movementY*sens*(parseInt($('vs')?.value||3)/3);pitch=Math.max(-Math.PI/3,Math.min(Math.PI/3,pitch))});
  return{getDir:()=>{const d=new THREE.Vector3(-Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch));d.normalize();return d},getYaw:()=>yaw,getPitch:()=>pitch,isLocked:()=>locked};
}

// ─── JOGADOR ──────────────────────────────────────────────────
function makePlayer(cam,mouselook){
  const p={
    cam,spd:0,tSpd:0,lat:0,tLat:0,dist:0,maxDist:0,stam:C.MS,
    sprint:false,jumping:false,jv:0,vo:0,hp:100,alive:true,hbT:0,keys:{},spdH:[],
    upd(dt){
      if(!this.alive)return;dt=Math.min(dt,.1);
      if(this.keys['w']){this.tSpd=this.sprint&&this.stam>0?C.SSP:C.BSP}
      else if(this.keys['s']){this.tSpd=Math.max(-C.BSP*.4,this.spd-6*dt)}
      else{this.tSpd=Math.max(0,this.spd-1.5*dt)}
      if(this.sprint&&this.keys['w']&&this.spd>C.BSP){this.stam=Math.max(0,this.stam-C.SD*dt);if(this.stam<=0)this.sprint=false}
      else this.stam=Math.min(C.MS,this.stam+C.SR*dt);
      this.spd+=(this.tSpd-this.spd)*Math.min(8*dt,1);
      const dir=mouselook.getDir();
      // Move in camera direction (W=forward, S=backward)
      this.dist+=this.spd*dt;
      if(this.dist>this.maxDist)this.maxDist=this.dist;
      if(this.keys['a'])this.tLat=-3;else if(this.keys['d'])this.tLat=3;else this.tLat=0;
      this.lat+=(this.tLat-this.lat)*Math.min(10*dt,1);
      if(this.keys[' ']&&!this.jumping){this.jumping=true;this.jv=C.JF}
      if(this.jumping){this.jv-=C.GR*dt;this.vo+=this.jv*dt;if(this.vo<=0){this.vo=0;this.jumping=false;this.jv=0}}
      if(Math.abs(this.spd)>1)this.hbT+=dt*C.HF*(Math.abs(this.spd)/C.BSP);
      const hbY=Math.sin(this.hbT*PI2)*C.HA*Math.min(Math.abs(this.spd)/C.BSP,1.5);
      const hbX=Math.cos(this.hbT*Math.PI)*C.HA*.5;
      this.cam.position.set(this.lat+hbX,C.CH+this.vo+hbY,this.dist);
      // Rotate cam based on mouse
      const yaw=mouselook.getYaw(),pitch=mouselook.getPitch();
      this.cam.rotation.order='YXZ';this.cam.rotation.set(pitch,yaw,0);
      if(Math.abs(this.cam.position.x)>bz2+.5){this.spd*=.6;this.cam.position.x=Math.sign(this.cam.position.x)*bz2;this.hp-=15;this.lat=this.cam.position.x;this.tLat=this.cam.position.x;this._dmg();if(this.hp<=0){this.alive=false;this.spd=0}}
      this.spdH.push(this.spd);if(this.spdH.length>180)this.spdH.shift();
    },
    _dmg(){const f=document.createElement('div');f.className='dmg';document.body.appendChild(f);setTimeout(()=>f.remove(),350)},
    avgSpd(){return this.spdH.length?this.spdH.reduce((a,b)=>a+b,0)/this.spdH.length:0}
  };
  cam.position.set(0,C.CH,0);
  function kd(e){p.keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==='shift')p.sprint=true}
  function ku(e){p.keys[e.key.toLowerCase()]=false;if(e.key.toLowerCase()==='shift')p.sprint=false}
  window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);
  function btn(id,k,v){const el=$(id);if(!el)return;el.addEventListener('pointerdown',()=>{p.keys[k]=v;if(k==='shift')p.sprint=v;if(k==='w'&&v)p.keys['w']=true});el.addEventListener('pointerup',()=>{p.keys[k]=false;if(k==='shift')p.sprint=false});el.addEventListener('pointerleave',()=>{p.keys[k]=false;if(k==='shift')p.sprint=false})}
  btn('mcl','a',true);btn('mcr','d',true);btn('mcj',' ',true);btn('mcs','shift',true);btn('mcs','w',true);
  document.addEventListener('touchstart',()=>{if(p.spd<1)p.keys['w']=true},{passive:true});
  return p;
}

// ─── PONTUACAO (score cai ao andar pra tras) ──────────────────
function makeScore(){
  return{
    st:0,el:0,dist:0,cSpd:0,ms:[1,2,4,8,16,32,64,128,256,512,1024],reached:[],next:1,running:false,
    bd:parseFloat(localStorage.getItem('irbd')||'0'),bm:parseFloat(localStorage.getItem('irbm')||'0'),
    start(){this.st=performance.now();this.running=true},
    upd(sprinting,maxDist){
      if(!this.running)return null;
      this.el=(performance.now()-this.st)/1000;
      this.cSpd=sprinting?C.SSP:C.BSP;
      this.dist=maxDist; // Use max distance (doesn't decrease)
      const km=this.dist/1000;
      if(km>=this.next){const m=this.next;this.reached.push(m);const i=this.ms.indexOf(m);this.next=(i>=0&&i<this.ms.length-1)?this.ms[i+1]:this.next*2;return m}
      return null;
    },
    fd(){return(this.dist/1000).toFixed(2)+' km'},
    ft(){const s=Math.floor(this.el),m=Math.floor(s/60),h=Math.floor(m/60);return h>0?String(h).padStart(2,'0')+':'+String(m%60).padStart(2,'0')+':'+String(s%60).padStart(2,'0'):String(m).padStart(2,'0')+':'+String(s%60).padStart(2,'0')},
    fp(){if(this.dist<5)return'--:-- /km';const ps=this.el/(this.dist/1000);return Math.floor(ps/60)+':'+String(Math.floor(ps%60)).padStart(2,'0')+' /km'},
    kmh(){return this.el>1?(this.dist/1000)/(this.el/3600):0},
    save(){const km=this.dist/1000;if(km>this.bd){this.bd=km;localStorage.setItem('irbd',km.toString())}const lm=this.reached.length?Math.max(...this.reached):0;if(lm>this.bm){this.bm=lm;localStorage.setItem('irbm',lm.toString())}}
  };
}

// ─── DIA/NOITE ────────────────────────────────────────────────
function makeDN(scene){
  const sun=new THREE.DirectionalLight(0xfff5e6,1.5);sun.position.set(50,80,30);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.near=.5;sun.shadow.camera.far=350;sun.shadow.camera.left=-70;sun.shadow.camera.right=70;sun.shadow.camera.top=70;sun.shadow.camera.bottom=-70;scene.add(sun);
  const amb=new THREE.AmbientLight(0x404060,.4);scene.add(amb);scene.add(new THREE.HemisphereLight(0x87CEEB,0x362907,.3));
  return{upd(dist){
    const hp=(dist/1000)/C.DK,dc=((8+hp)%24)/24,sa=dc*PI2,sh=Math.sin(sa);
    sun.position.set(Math.cos(sa)*100,sh*100,30);
    const i=Math.max(.04,sh+.2);sun.intensity=i*2.5;amb.intensity=Math.max(.08,i*.4);
    if(sh>-.1){scene.background=new THREE.Color(.3+sh*.3,.5+sh*.3,.8+sh*.2);scene.fog=new THREE.Fog(new THREE.Color(.7,.75,.8),60,C.VD)}
    else{const nf=Math.abs(sh);scene.background=new THREE.Color(.02+nf*.04,.02+nf*.04,.08+nf*.08);scene.fog=new THREE.Fog(new THREE.Color(.02,.02,.05),25,C.VD*.7)}
  }};
}
function makeSky(scene){
  const clds=[];for(let i=0;i<25;i++){const g=new THREE.Group();const m=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.5,depthWrite:false});for(let j=0;j<2;j++){const sp=new THREE.Mesh(new THREE.SphereGeometry(4+Math.random()*10,5,3),m);sp.position.set((Math.random()-.5)*16,Math.random()*2,(Math.random()-.5)*6);g.add(sp)}g.position.set((Math.random()-.5)*400,50+Math.random()*40,(Math.random()-.5)*400);g.userData={spd:.3+Math.random()*1.5};scene.add(g);clds.push(g)}return clds;
}
function makeRain(scene){
  const obj={mesh:null,intensity:0,scene};
  obj.upd=function(dt,dm){const rnd=Math.sin(dm*.0001)*.5+.5,tgt=rnd>.65?rnd*.7:0;this.intensity+=(tgt-this.intensity)*Math.min(dt*1.5,1);if(this.intensity>.08&&!this.mesh){const g=new THREE.BufferGeometry();const c=1500,p=new Float32Array(c*3);for(let i=0;i<c;i++){p[i*3]=(Math.random()-.5)*80;p[i*3+1]=Math.random()*60;p[i*3+2]=(Math.random()-.5)*80}g.setAttribute('position',new THREE.BufferAttribute(p,3));this.mesh=new THREE.Points(g,new THREE.PointsMaterial({color:0xaaccff,size:.1,transparent:true,opacity:.1,blending:THREE.AdditiveBlending,depthWrite:false}));this.scene.add(this.mesh)}if(this.mesh){const p=this.mesh.geometry.attributes.position.array;for(let j=0;j<p.length;j+=3){p[j+1]-=14*dt*this.intensity;if(p[j+1]<-1){p[j+1]=59;p[j]=(Math.random()-.5)*80;p[j+2]=(Math.random()-.5)*80}}this.mesh.geometry.attributes.position.needsUpdate=true;this.mesh.material.opacity=.08+this.intensity*.35}if(this.intensity<.02&&this.mesh){this.scene.remove(this.mesh);this.mesh=null}};
  obj.emoji=function(){return this.intensity>.6?'🌧️':this.intensity>.2?'🌦️':'☀️'};return obj;
}

// ─── RANKING ──────────────────────────────────────────────────
function maskIp(ip){const p=ip.split('.');return p.length===4?p[0]+'.'+p[1]+'.***.***':ip}
function getRank(){try{return JSON.parse(localStorage.getItem('irrk')||'[]')}catch(e){return[]}}
function saveRank(ip,dist,ms,time){const scores=getRank();scores.push({ip,dist:parseFloat(dist.toFixed(2)),ms,time,date:new Date().toISOString().slice(0,10)});scores.sort((a,b)=>b.dist-a.dist);const top=scores.slice(0,100);localStorage.setItem('irrk',JSON.stringify(top));return top}
async function getIp(){try{const ctrl=new AbortController();const id=setTimeout(()=>ctrl.abort(),3000);const r=await fetch('https://api.ipify.org?format=json',{signal:ctrl.signal});clearTimeout(id);const d=await r.json();return d.ip}catch(e){return'local_'+Math.random().toString(36).slice(2,8)}}
function renderRank(ip){const scores=getRank(),rb=$('rb'),rp=$('rp');let h='';scores.forEach((s,i)=>{const isP=s.ip===ip;h+='<tr class="'+(isP?'pr':'')+'"><td>'+(i<3?['🥇','🥈','🥉'][i]:i+1+'º')+'</td><td>'+maskIp(s.ip)+'</td><td>'+s.dist.toFixed(2)+' km</td><td>'+(s.ms||0)+'</td><td>'+s.time+'</td></tr>'});if(!scores.length)h='<tr><td colspan="5">Nenhum resultado</td></tr>';rb.innerHTML=h;const pi=scores.findIndex(s=>s.ip===ip);rp.textContent=pi>=0?'Sua posicao: '+(pi+1)+'º':'Jogue para aparecer!'}
function show(id){['menu','rank','conf','hud','pause','go'].forEach(s=>{const e=$(s);if(e)e.style.display=s===id?'flex':'none'});const mc=$('mc');if(mc)mc.style.display=(id==='hud'&&window.innerWidth<1024)?'flex':'none'}

// ─── JOGO ─────────────────────────────────────────────────────
const game={
  st:'loading',scene:null,cam:null,rnd:null,tg:null,world:null,player:null,score:null,dn:null,skyClds:null,rain:null,au:null,mouselook:null,ip:'',stTimer:0,brTimer:0,lastT:0,
  async init(){
    this._lb(5,'Inicializando...');this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x87CEEB);this.scene.fog=new THREE.Fog(0xCCDDFF,60,C.VD);
    this.cam=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,C.VD+100);
    this.rnd=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});this.rnd.setSize(window.innerWidth,window.innerHeight);this.rnd.setPixelRatio(Math.min(window.devicePixelRatio,2));
    this.rnd.shadowMap.enabled=true;this.rnd.shadowMap.type=THREE.PCFSoftShadowMap;this.rnd.toneMapping=THREE.ACESFilmicToneMapping;this.rnd.toneMappingExposure=1.1;
    const gc=$('game-container')||document.body;gc.appendChild(this.rnd.domElement);
    this.mouselook=setupMouse(this.cam,this.rnd.domElement);
    this._lb(12,'Texturas...');await this._y();this.tg=new TG();this.tg.gen();await this._y();
    this._lb(25,'Audio...');this.au=new AU();
    this._lb(40,'Mundo...');await this._y();this.world=makeWorld(this.scene,this.tg);await this._y();
    this._lb(55,'Ceu...');this.skyClds=makeSky(this.scene);this.rain=makeRain(this.scene);this.dn=makeDN(this.scene);
    this._lb(70,'Jogador...');this.player=makePlayer(this.cam,this.mouselook);this.score=makeScore();
    this._lb(85,'Ranking...');this.ip=await getIp();
    this._lb(100,'Pronto!');await new Promise(r=>setTimeout(r,300));
    $('loading').style.display='none';this.st='menu';show('menu');this._events();
    window.addEventListener('resize',()=>{this.cam.aspect=window.innerWidth/window.innerHeight;this.cam.updateProjectionMatrix();this.rnd.setSize(window.innerWidth,window.innerHeight)});
    renderRank(this.ip);$('brec').textContent=this.score.bd.toFixed(2)+' km';this.lastT=performance.now();this._loop();
  },
  _lb(p,t){const b=$('lbar');if(b)b.style.width=p+'%';$('lt').textContent=t},
  _y(){return new Promise(r=>setTimeout(r,25))},
  _events(){
    $('bs').addEventListener('click',()=>this.start());
    $('brk').addEventListener('click',()=>{renderRank(this.ip);show('rank')});
    $('bcf').addEventListener('click',()=>show('conf'));
    $('bcr').addEventListener('click',()=>show('menu'));
    $('bcc').addEventListener('click',()=>show('menu'));
    $('bres').addEventListener('click',()=>this.resume());
    $('brst').addEventListener('click',()=>this.restart());
    $('bqt').addEventListener('click',()=>this.quit());
    $('brtry').addEventListener('click',()=>this.restart());
    $('bgm').addEventListener('click',()=>this.quit());
    window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(this.st==='playing')this._pause();else if(this.st==='paused')this.resume()}});
    document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement&&this.st==='playing')$('lock-msg').style.display='block'});
  },
  start(){
    this._clean();this.player=makePlayer(this.cam,this.mouselook);this.score=makeScore();this.score.start();
    this.st='playing';this.stTimer=0;this.brTimer=0;show('hud');
    if(window.innerWidth>=1024){$('lock-msg').style.display='block';$('crosshair').style.display='block'}
    this.lastT=performance.now();
    // Try to lock mouse
    try{this.rnd.domElement.requestPointerLock()}catch(e){}
  },
  _clean(){if(this.world){for(const[k,b]of this.world.blocks)this.scene.remove(b.grp);this.world.blocks.clear()}},
  _pause(){this.st='paused';document.exitPointerLock();show('pause')},
  resume(){this.st='playing';show('hud');$('lock-msg').style.display=window.innerWidth>=1024?'block':'none';this.lastT=performance.now();setTimeout(()=>{try{this.rnd.domElement.requestPointerLock()}catch(e){}},100)},
  restart(){show('hud');this.start()},
  quit(){if(this.player&&this.player.maxDist>10){this.score.save();const ms=this.score.reached.length?Math.max(...this.score.reached):0;saveRank(this.ip,this.player.maxDist/1000,ms,this.score.ft());renderRank(this.ip)}document.exitPointerLock();this._clean();this.st='menu';show('menu');$('brec').textContent=this.score.bd.toFixed(2)+' km'},
  _go(){this.st='gameover';this.score.save();const ms=this.score.reached.length?Math.max(...this.score.reached):0;saveRank(this.ip,this.player.maxDist/1000,ms,this.score.ft());$('gd').textContent=(this.player.maxDist/1000).toFixed(2)+' km';$('gt').textContent=this.score.ft();$('gm').textContent=ms+' km';$('gs').textContent=Math.round(this.player.avgSpd()*3.6)+' km/h';$('gmsg').textContent='Pontuacao enviada ao ranking!';document.exitPointerLock();show('go')},
  _loop(){
    requestAnimationFrame(()=>this._loop());const now=performance.now();let dt=(now-this.lastT)/1000;this.lastT=now;dt=Math.min(dt,.15);
    if(this.st==='playing'){
      this.player.upd(dt);this.world.upd(this.player.dist);
      const ms=this.score.upd(this.player.sprint,this.player.maxDist);
      if(ms){$('msv').textContent=ms+' km';$('ms').style.display='flex';$('ms').style.animation='none';void $('ms').offsetHeight;$('ms').style.animation='mi 2.5s ease-out forwards';setTimeout(()=>{$('ms').style.display='none'},2500);this.au.ms()}
      this.dn.upd(this.player.maxDist);
      this.skyClds.forEach(c=>{c.position.x+=c.userData.spd*dt;if(c.position.x>260)c.position.x=-260});
      this.skyClds.forEach(c=>c.children.forEach(ch=>{if(ch.material)ch.material.opacity=.25+this.rain.intensity*.4}));
      this.rain.upd(dt,this.player.maxDist);
      if(Math.abs(this.player.spd)>1){this.stTimer+=dt*(Math.abs(this.player.spd)/C.BSP);if(this.stTimer>.45){this.stTimer=0;const px=this.cam.position.x;let s='asphalt';if(Math.abs(px)>se)s='grass';else if(Math.abs(px)>hr)s='sidewalk';this.au.fs(s)}}
      if(Math.abs(this.player.spd)>1){this.brTimer+=dt;if(this.brTimer>3){this.brTimer=0;const i=Math.min(1,(this.player.maxDist/1000)/10);if(i>.2)this.au.br(i)}}
      this._updHUD();if(!this.player.alive){this.au.dm();this._go()}
    }
    this.rnd.render(this.scene,this.cam);
  },
  _updHUD(){
    $('hd').textContent=(this.player.maxDist/1000).toFixed(2)+' km';$('ht').textContent=this.score.ft();$('hp').textContent=this.score.fp();
    $('hn').textContent=this.score.next+' km';$('hs').textContent=Math.round(Math.abs(this.player.spd)*3.6)+' km/h';
    $('hrc').textContent=this.score.bd.toFixed(1)+' km';
    const sf=$('sf');sf.style.width=this.player.stam+'%';sf.style.background=this.player.stam<25?'linear-gradient(90deg,#f44336,#ff9800)':this.player.stam<50?'linear-gradient(90deg,#ff9800,#ffc107)':'linear-gradient(90deg,#4CAF50,#8BC34A)';
    const biome=getBiome(this.player.maxDist/1000);$('biome').textContent=biome.name;$('cl').textContent=this.rain.emoji();
    $('brec').textContent=this.score.bd.toFixed(2)+' km';
  }
};

window.addEventListener('DOMContentLoaded',()=>{console.log('%c🏃 Infinite Runner: World Tour v5.0 %c| MagnorioBR','color:#ff5e2c;font-size:1.2em','color:#ffb833');game.init()});
