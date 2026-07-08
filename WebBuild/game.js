// ═══════════════════════════════════════════════════════════════════
// INFINITE RUNNER: WORLD TOUR v9.1 — MagnorioBR
// TEXTURAS REAIS DE ARQUIVOS · FPS LIVRE · CHEATS Ctrl+Shift+Y
// ═══════════════════════════════════════════════════════════════════
import * as THREE from 'three';

const C={BS:100,RW:10,SW:3,BMN:8,BMX:45,VD:400,CH:1.7,BSP:8,SSP:14,MS:100,SD:20,SR:12,GR:15,JF:6,DK:5};
const hr=C.RW/2,se=hr+C.SW,bz2=C.BS/2,PI2=Math.PI*2;
const $=id=>document.getElementById(id);
const isMobile=!window.matchMedia('(hover:hover) and (pointer:fine)').matches;
function hs(x,z){let h=x*374761393+z*668265263;h=(h^(h>>13))*1274126177;return h^(h>>16)}
function sR(s){let v=s;return()=>{v=(v*16807)%2147483647;return(v-1)/2147483646}}

// ═══════════════════════════════════════════════════════════════════
// ⭐ CARREGADOR DE TEXTURAS DE ARQUIVOS ⭐
// ═══════════════════════════════════════════════════════════════════
const loader=new THREE.TextureLoader();
const TEX={asphalt:[],sidewalk:[],grass:[],dirt:[],sand:[],building:[]};
const TEX_BASE='WebBuild/assets/textures/';

const TEX_FILES={
  asphalt:['asphalt/asphalt_01.webp','asphalt/asphalt_02.webp','asphalt/asphalt_03.webp','asphalt/asphalt_04.webp'],
  sidewalk:['sidewalk/sidewalk_01.webp','sidewalk/sidewalk_02.webp','sidewalk/sidewalk_03.webp'],
  grass:['grass/grass_01.webp','grass/grass_02.webp','grass/grass_03.webp'],
  dirt:['dirt/dirt_01.webp','dirt/dirt_02.webp','dirt/dirt_03.webp'],
  sand:['sand/sand_01.webp','sand/sand_02.webp','sand/sand_03.webp'],
  building:['building/building_01.webp','building/building_02.webp','building/building_03.webp']
};

function loadAllTextures(callback){
  let total=0,loaded=0;
  for(const cat of Object.keys(TEX_FILES)){
    total+=TEX_FILES[cat].length;
    TEX_FILES[cat].forEach(file=>{
      loader.load(TEX_BASE+file,
        tex=>{
          tex.wrapS=THREE.RepeatWrapping;tex.wrapT=THREE.RepeatWrapping;
          tex.colorSpace=THREE.SRGBColorSpace;
          tex.magFilter=THREE.LinearFilter;tex.minFilter=THREE.LinearMipmapLinearFilter;
          tex.generateMipmaps=true;
          TEX[cat].push(tex);
          loaded++;
          if(loaded>=total)callback();
        },
        undefined,
        ()=>{
          // Fallback: cria textura colorida se arquivo falhar
          loaded++;
          const cv=document.createElement('canvas');cv.width=128;cv.height=128;
          const ctx=cv.getContext('2d');
          const colors={asphalt:'#555',sidewalk:'#bbb',grass:'#4a4',dirt:'#864',sand:'#db9',building:'#ba9'};
          ctx.fillStyle=colors[cat]||'#888';ctx.fillRect(0,0,128,128);
          const t=new THREE.CanvasTexture(cv);t.wrapS=THREE.RepeatWrapping;t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;
          TEX[cat].push(t);
          if(loaded>=total)callback();
        }
      );
    });
  }
}

function getTex(type,seed){
  const abs=Math.abs(seed),pool=TEX[type];
  if(!pool||!pool.length)return null;
  const t=pool[abs%pool.length].clone();t.needsUpdate=true;return t;
}

// ═══ MATERIAIS ═══
const M={};
function initMats(){
  M.curb=new THREE.MeshPhongMaterial({color:0x999,specular:0x111,shininess:10});
  M.treeT=new THREE.MeshPhongMaterial({color:0x6D4C41,shininess:5});
  M.treeC=[0x388E3C,0x43A047,0x4CAF50,0x2E7D32].map(c=>new THREE.MeshPhongMaterial({color:c,specular:0x110,shininess:8}));
  M.postM=new THREE.MeshPhongMaterial({color:0x3a3a3a,specular:0x222,shininess:60});
  M.postB=new THREE.MeshPhongMaterial({color:0xfffef0,emissive:0x332,shininess:30});
  M.benchW=new THREE.MeshPhongMaterial({color:0x8D6E63,shininess:5});
  M.benchM=new THREE.MeshPhongMaterial({color:0x444,specular:0x333,shininess:80});
  M.binM=new THREE.MeshPhongMaterial({color:0x2E7D32,specular:0x131,shininess:40});
  M.yellow=new THREE.MeshPhongMaterial({color:0xfc0,emissive:0x110,shininess:5});
  M.fence=new THREE.MeshPhongMaterial({color:0xB8956A,shininess:5});
  M.palmT=new THREE.MeshPhongMaterial({color:0xBCAAA4,shininess:5});
  M.palmC=new THREE.MeshPhongMaterial({color:0x388E3C,specular:0x120,shininess:8});
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
    const gTex=getTex(gt,seed);if(gTex){gTex.repeat.set(b.g==='sand'?2:3,b.g==='sand'?2:3)}
    const mat=gTex?new THREE.MeshPhongMaterial({map:gTex,specular:0x050505,shininess:3}):new THREE.MeshPhongMaterial({color:0x555,specular:0,shininess:3});
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
        const bldg=new THREE.Mesh(geo,new THREE.MeshPhongMaterial({map:t||null,color:0xb8956a,specular:0x111,shininess:8}));
        bldg.position.set(bxC,h/2,bzP);bldg.castShadow=true;bldg.receiveShadow=true;g.add(bldg);
    }}}
    if(b.fe){for(let side=-1;side<=1;side+=2){const fx=side*(hr+C.SW-1);for(let z=-48;z<48;z+=4+r()*5){const fp=new THREE.Mesh(new THREE.CylinderGeometry(.04,.05,1.3,4),M.fence);fp.position.set(fx,.65,z);fp.castShadow=true;g.add(fp)}[.25,1.05].forEach(y=>{const fb=new THREE.Mesh(new THREE.BoxGeometry(.04,.06,BS+.4),M.fence);fb.position.set(fx,y,0);g.add(fb)})}}
    if(b.td>0){for(let side=-1;side<=1;side+=2){const tx=side*(hr+C.SW/2);for(let tz=-BS/2+5;tz<BS/2-5;tz+=7+Math.abs(r())*12){if(Math.abs(r())<b.td){const tr=new THREE.Group();const th=1.5+r()*3.5;if(b.pa){const tk=new THREE.Mesh(new THREE.CylinderGeometry(.07,.13,th,6),M.palmT);tk.position.y=th/2;tk.castShadow=true;tr.add(tk);const cn=new THREE.Mesh(new THREE.SphereGeometry(.5+r()*1,6,4),M.palmC);cn.position.set(0,th+.4,0);cn.castShadow=true;tr.add(cn)}else{const tk=new THREE.Mesh(new THREE.CylinderGeometry(.1,.16,th,6),M.treeT);tk.position.y=th/2;tk.castShadow=true;tr.add(tk);const ns=2+Math.floor(r()*3);for(let j=0;j<ns;j++){const cr=.5+r()*1.3;const cn=new THREE.Mesh(new THREE.SphereGeometry(cr,6,4),M.treeC[Math.floor(Math.abs(r())*M.treeC.length)]);cn.position.set((r()-.5)*1.4,th+.3+r()*1.4,(r()-.5)*1.4);cn.castShadow=true;tr.add(cn)}}tr.position.set(tx,0,tz);g.add(tr)}}}}
    if(b.fn){for(let side=-1;side<=1;side+=2){const px=side*(hr+.5);for(let pz=-BS/2+10;pz<BS/2-10;pz+=22){const pg=new THREE.Group();const p=new THREE.Mesh(new THREE.CylinderGeometry(.04,.08,5.5,6),M.postM);p.position.y=2.75;p.castShadow=true;pg.add(p);const a=new THREE.Mesh(new THREE.BoxGeometry(1.1,.05,.05),M.postM);a.position.set(.55,5.1,0);pg.add(a);const lb=new THREE.Mesh(new THREE.SphereGeometry(.18,6,3),M.postB);lb.position.set(1.15,5.1,0);pg.add(lb);pg.position.set(px,0,pz);g.add(pg)}const bx=side*(hr+C.SW-1);for(let pz=-BS/2+10;pz<BS/2-10;pz+=24+Math.abs(r())*12){if(Math.abs(r())>.4){const bg=new THREE.Group();for(let l=-1;l<=1;l+=2){const leg=new THREE.Mesh(new THREE.BoxGeometry(.04,.55,.04),M.benchM);leg.position.set(l*.65,.275,0);bg.add(leg)}bg.add(new THREE.Mesh(new THREE.BoxGeometry(1.5,.06,.32),M.benchW)).position.y=.58;bg.add(new THREE.Mesh(new THREE.BoxGeometry(1.5,.35,.04),M.benchW)).position.set(0,.78,-.15);bg.position.set(bx,0,pz);g.add(bg)}else{const bg=new THREE.Group();const bi=new THREE.Mesh(new THREE.CylinderGeometry(.18,.15,.85,8),M.binM);bi.position.y=.425;bi.castShadow=true;bg.add(bi);bg.position.set(bx,0,pz);g.add(bg)}}}}
  }
  function upd(playerZ){const pbz=Math.floor(playerZ/C.BS),range=Math.ceil(C.VD/C.BS)+1;const needed=new Set();for(let bz=pbz-range;bz<=pbz+range;bz++)for(let bx=-2;bx<=2;bx++)needed.add(bx+','+bz);for(const[k,v]of blocks){if(!needed.has(k)){scene.remove(v.g);blocks.delete(k)}needed.delete(k)}for(const k of needed){const[bx,bz]=k.split(',').map(Number);mkB(bx,bz)}let done=0;for(const[k,v]of blocks){if(!v.pop&&done<2){popB(k);done++}}}
  return{upd,blocks};
}

// ═══ INPUT FPS ═══
function mkInput(cam,canvas){let y=0,p=0,l=false,g=0;canvas.addEventListener('click',()=>{if(!l&&!isMobile&&game.st==='playing'){canvas.requestPointerLock();$('lock-msg').style.display='none'}});document.addEventListener('pointerlockchange',()=>{l=document.pointerLockElement===canvas;$('crosshair').style.display=l?'block':'none';if(!l&&!isMobile&&game.st==='playing')$('lock-msg').style.display='block'});document.addEventListener('mousemove',e=>{if(!l||isMobile)return;y-=e.movementX*.003;p-=e.movementY*.003;p=Math.max(-Math.PI/2.5,Math.min(Math.PI/2.5,p))});if(isMobile&&window.DeviceOrientationEvent){window.addEventListener('deviceorientation',e=>{if(game.st!=='playing')return;if(e.gamma!==null)g=Math.max(-4,Math.min(4,e.gamma/10))})}return{gD:()=>new THREE.Vector3(Math.sin(y)*Math.cos(p),-Math.sin(p),Math.cos(y)*Math.cos(p)).normalize(),gY:()=>y,gP:()=>p,iL:()=>l,gG:()=>g};}

// ═══ JOGADOR FPS ═══
function mkPlayer(cam,input){const p={cam,vel:new THREE.Vector3(),pos:new THREE.Vector3(0,C.CH,0),maxDist:0,stamina:C.MS,alive:true,hp:100,sprinting:false,jumping:false,jv:0,grounded:true,keys:{},hbT:0,hold:false,cheats:{speed:1,god:false,noclip:false},
  upd(dt){if(!this.alive)return;dt=Math.min(dt,.15);const dir=input.gD(),right=new THREE.Vector3().crossVectors(dir,new THREE.Vector3(0,1,0)).normalize(),speed=(this.sprinting&&this.stamina>0?C.SSP:C.BSP)*this.cheats.speed,moveDir=new THREE.Vector3();
    if(this.keys['w']||this.keys['arrowup']){moveDir.add(dir);if(!this.sprinting)this.sprinting=this.keys['shift']&&this.stamina>0}
    if(this.keys['s']||this.keys['arrowdown'])moveDir.addScaledVector(dir,-.5);
    if(this.keys['a']||this.keys['arrowleft'])moveDir.addScaledVector(right,-1);
    if(this.keys['d']||this.keys['arrowright'])moveDir.addScaledVector(right,1);
    if(moveDir.length()>0){moveDir.normalize();this.vel.x+=(moveDir.x*speed-this.vel.x)*Math.min(8*dt,1);this.vel.z+=(moveDir.z*speed-this.vel.z)*Math.min(8*dt,1)}else{this.vel.x*=Math.pow(.1,dt);this.vel.z*=Math.pow(.1,dt)}
    if(this.sprinting&&moveDir.length()>0){this.stamina=Math.max(0,this.stamina-C.SD*dt);if(this.stamina<=0)this.sprinting=false}else{this.stamina=Math.min(C.MS,this.stamina+C.SR*dt);if(this.stamina>C.MS*.3)this.sprinting=this.keys['shift']&&this.keys['w']}
    if((this.keys[' ']||this.keys['space'])&&this.grounded){this.jumping=true;this.jv=C.JF;this.grounded=false}
    if(this.jumping){this.jv-=C.GR*dt;this.vel.y=this.jv;if(this.vel.y<=0&&!this.grounded)this.vel.y=Math.max(this.vel.y,-C.GR*dt*2)}else if(!this.grounded)this.vel.y-=C.GR*dt;
    this.pos.x+=this.vel.x*dt;this.pos.y+=this.vel.y*dt;this.pos.z+=this.vel.z*dt;
    if(this.pos.y<=C.CH){this.pos.y=C.CH;this.vel.y=0;this.grounded=true;this.jumping=false}
    if(this.pos.z>this.maxDist)this.maxDist=this.pos.z;
    if(moveDir.length()>0)this.hbT+=dt*C.HF*(speed/C.BSP);
    const hbY=Math.sin(this.hbT*PI2)*C.HA*Math.min(speed/C.BSP,2),hbX=Math.cos(this.hbT*Math.PI)*C.HA*.5;
    this.cam.position.set(this.pos.x+hbX,this.pos.y+hbY,this.pos.z);this.cam.rotation.order='YXZ';this.cam.rotation.set(input.gP(),input.gY(),0);
    if(!this.cheats.noclip&&Math.abs(this.pos.x)>bz2+.5){this.vel.x*=-.3;this.pos.x=Math.sign(this.pos.x)*bz2;this.hp-=10;this._dmg();if(this.hp<=0)this.alive=false}
    if(this.cheats.god)this.hp=100;
  },_dmg(){const f=document.createElement('div');f.className='dmg';document.body.appendChild(f);setTimeout(()=>f.remove(),350)}};
  cam.position.copy(p.pos);
  window.addEventListener('keydown',e=>{p.keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==='shift')p.sprinting=true;if(e.ctrlKey&&e.shiftKey&&e.key.toLowerCase()==='y'){e.preventDefault();toggleCheatMenu(p)}});
  window.addEventListener('keyup',e=>{p.keys[e.key.toLowerCase()]=false;if(e.key.toLowerCase()==='shift')p.sprinting=false});
  function btn(id,k,v){const el=$(id);if(!el)return;el.addEventListener('pointerdown',()=>{p.keys[k]=v;if(k==='shift'&&v)p.sprinting=v});el.addEventListener('pointerup',()=>{p.keys[k]=false;if(k==='shift')p.sprinting=false})}
  btn('mcl','a',true);btn('mcr','d',true);btn('mcj',' ',true);btn('mcs','shift',true);
  if(isMobile){document.addEventListener('touchstart',e=>{if(e.target.tagName!=='BUTTON')p.keys['w']=true});document.addEventListener('touchend',()=>{p.keys['w']=false})}
  return p;
}

// ═══ CHEATS ═══
function toggleCheatMenu(player){
  let cm=$('cheat-menu');
  if(!cm){cm=document.createElement('div');cm.id='cheat-menu';cm.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:200;background:rgba(0,0,0,.92);border:2px solid #f0f;border-radius:12px;padding:1.5rem;color:#fff;min-width:300px;text-align:center;font-family:monospace';cm.innerHTML='<h2 style="color:#f0f;margin-bottom:1rem">🔥 CHEATS</h2><div style="display:flex;flex-direction:column;gap:.5rem"><button class="cb" data-action="speed">⚡ Velocidade: <span id="cv-speed">1x</span></button><button class="cb" data-action="god">🛡️ God Mode: <span id="cv-god">OFF</span></button><button class="cb" data-action="noclip">👻 NoClip: <span id="cv-noclip">OFF</span></button><button class="cb" data-action="teleport" style="background:#40a0e0">📍 Teleportar +1km</button><button class="cb" data-action="heal" style="background:#40c040">💚 Curar</button><button class="cb" data-action="close" style="background:#e04040;margin-top:.5rem">❌ Fechar</button></div>';document.body.appendChild(cm);const s=document.createElement('style');s.textContent='.cb{padding:.5rem;font-size:.9rem;font-weight:600;border:none;border-radius:6px;cursor:pointer;background:#555;color:#fff;font-family:monospace}.cb:hover{filter:brightness(1.3)}';document.head.appendChild(s);cm.addEventListener('click',e=>{const b=e.target.closest('.cb');if(!b)return;const a=b.dataset.action;if(a==='speed'){player.cheats.speed=player.cheats.speed>=5?1:player.cheats.speed+1;$('cv-speed').textContent=player.cheats.speed+'x'}else if(a==='god'){player.cheats.god=!player.cheats.god;$('cv-god').textContent=player.cheats.god?'ON':'OFF'}else if(a==='noclip'){player.cheats.noclip=!player.cheats.noclip;$('cv-noclip').textContent=player.cheats.noclip?'ON':'OFF'}else if(a==='teleport'){player.pos.z+=1000;player.maxDist=Math.max(player.maxDist,player.pos.z)}else if(a==='heal'){player.hp=100}else if(a==='close')cm.style.display='none'})}cm.style.display=cm.style.display==='none'?'block':'none'}

// ═══ PONTUAÇÃO ═══
function mkScore(){return{st:0,el:0,dist:0,ms:[1,2,4,8,16,32,64,128,256,512,1024],reached:[],next:1,running:false,bd:parseFloat(localStorage.getItem('irbd')||'0'),bm:parseFloat(localStorage.getItem('irbm')||'0'),start(){this.st=performance.now();this.running=true},upd(mD){if(!this.running)return null;this.el=(performance.now()-this.st)/1000;this.dist=mD;const km=this.dist/1000;if(km>=this.next){const m=this.next;this.reached.push(m);const i=this.ms.indexOf(m);this.next=(i>=0&&i<this.ms.length-1)?this.ms[i+1]:this.next*2;return m}return null},fd(){return(this.dist/1000).toFixed(2)+' km'},ft(){const s=Math.floor(this.el),m=Math.floor(s/60),h=Math.floor(m/60);return h>0?String(h).padStart(2,'0')+':'+String(m%60).padStart(2,'0')+':'+String(s%60).padStart(2,'0'):String(m).padStart(2,'0')+':'+String(s%60).padStart(2,'0')},fp(){if(this.dist<5)return'--:-- /km';return Math.floor(this.el/(this.dist/1000)/60)+':'+String(Math.floor(this.el/(this.dist/1000)%60)).padStart(2,'0')+' /km'},save(){const km=this.dist/1000;if(km>this.bd){this.bd=km;localStorage.setItem('irbd',km.toString())}const lm=this.reached.length?Math.max(...this.reached):0;if(lm>this.bm){this.bm=lm;localStorage.setItem('irbm',lm.toString())}}}}

// ═══ LUZ ═══
function mkLight(scene){const sun=new THREE.DirectionalLight(0xffffff,3.5);sun.position.set(60,90,40);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.near=.5;sun.shadow.camera.far=450;sun.shadow.camera.left=-80;sun.shadow.camera.right=80;sun.shadow.camera.top=80;sun.shadow.camera.bottom=-80;sun.shadow.bias=-.0003;scene.add(sun);const fill=new THREE.DirectionalLight(0xb0c0ff,1.5);fill.position.set(-30,25,-20);scene.add(fill);const amb=new THREE.AmbientLight(0xaabbcc,1.8);scene.add(amb);scene.add(new THREE.HemisphereLight(0x87CEEB,0x554433,.9));return{upd(dist){const hp=(dist/1000)/C.DK,dc=((8+hp)%24)/24,sa=dc*PI2,sh=Math.sin(sa);sun.position.set(Math.cos(sa)*100,sh*100,30);const i=Math.max(.2,sh+.3);sun.intensity=i*4;amb.intensity=Math.max(.5,i*1.3);fill.intensity=Math.max(.3,i*.8);if(sh>-.1)scene.background=new THREE.Color(.4+sh*.25,.55+sh*.25,.82+sh*.15);else{const nf=Math.abs(sh);scene.background=new THREE.Color(.04+nf*.05,.04+nf*.05,.12+nf*.1)}}}}

// ═══ CÉU/CHUVA ═══
function mkSky(s){const c=[];for(let i=0;i<16;i++){const g=new THREE.Group(),m=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.45,depthWrite:false});for(let j=0;j<2;j++){const sp=new THREE.Mesh(new THREE.SphereGeometry(3+Math.random()*7,4,3),m);sp.position.set((Math.random()-.5)*10,Math.random()*2,(Math.random()-.5)*4);g.add(sp)}g.position.set((Math.random()-.5)*300,48+Math.random()*30,(Math.random()-.5)*300);g.userData={s:.2+Math.random()*1};s.add(g);c.push(g)}return c}
function mkRain(s){const o={m:null,i:0};o.upd=function(dt,dm){const t=(Math.sin(dm*.0001)*.5+.5)>.65?(Math.sin(dm*.0001)*.5+.5)*.5:0;this.i+=(t-this.i)*Math.min(dt,1);if(this.i>.08&&!this.m){const g=new THREE.BufferGeometry(),c=800,p=new Float32Array(c*3);for(let i=0;i<c;i++){p[i*3]=(Math.random()-.5)*60;p[i*3+1]=Math.random()*40;p[i*3+2]=(Math.random()-.5)*60}g.setAttribute('position',new THREE.BufferAttribute(p,3));this.m=new THREE.Points(g,new THREE.PointsMaterial({color:0xaaccff,size:.05,transparent:true,opacity:.08,blending:THREE.AdditiveBlending,depthWrite:false}));s.add(this.m)}if(this.m){const p=this.m.geometry.attributes.position.array;for(let j=0;j<p.length;j+=3){p[j+1]-=9*dt*this.i;if(p[j+1]<-1){p[j+1]=39;p[j]=(Math.random()-.5)*60;p[j+2]=(Math.random()-.5)*60}}this.m.geometry.attributes.position.needsUpdate=true;this.m.material.opacity=.04+this.i*.22}if(this.i<.02&&this.m){s.remove(this.m);this.m=null}};o.emoji=()=>o.i>.6?'🌧️':o.i>.2?'🌦️':'☀️';return o}
class AU{constructor(){this.c=null}_g(){if(!this.c){try{this.c=new(window.AudioContext||window.webkitAudioContext)()}catch(e){return null}}if(this.c.state==='suspended')this.c.resume();return this.c}fs(){const c=this._g();if(!c)return;const n=c.currentTime,o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.setValueAtTime(60+Math.random()*50,n);o.frequency.exponentialRampToValueAtTime(12,n+.1);o.type='triangle';g.gain.setValueAtTime(.03,n);g.gain.exponentialRampToValueAtTime(.001,n+.1);o.start(n);o.stop(n+.1)}ms(){const c=this._g();if(!c)return;const n=c.currentTime;[523,659,784,1047].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.04,n+i*.08);g.gain.exponentialRampToValueAtTime(.001,n+i*.08+.16);o.start(n+i*.08);o.stop(n+i*.08+.16)})}}

// ═══ RANKING ═══
function mIp(ip){const p=ip.split('.');return p.length===4?p[0]+'.'+p[1]+'.***.***':ip}
function gRk(){try{return JSON.parse(localStorage.getItem('irrk')||'[]')}catch(e){return[]}}
async function gIp(){try{const c=new AbortController();const id=setTimeout(()=>c.abort(),2e3);const r=await fetch('https://api.ipify.org?format=json',{signal:c.signal});clearTimeout(id);const d=await r.json();return d.ip}catch(e){return'local_'+Math.random().toString(36).slice(2,8)}}
function rRk(ip){const s=gRk(),b=$('rb'),p=$('rp');let h='';s.forEach((v,i)=>{const pl=v.ip===ip;h+='<tr class="'+(pl?'pr':'')+'"><td>'+(i<3?['🥇','🥈','🥉'][i]:i+1+'º')+'</td><td>'+mIp(v.ip)+'</td><td>'+v.dist.toFixed(2)+' km</td><td>'+(v.ms||0)+'</td></tr>'});if(!s.length)h='<tr><td colspan="4">Nenhum</td></tr>';b.innerHTML=h;const pi=s.findIndex(v=>v.ip===ip);p.textContent=pi>=0?'Sua posicao: '+(pi+1)+'º':'Jogue para aparecer!'}
function sRk(ip,dist,ms,time){const s=gRk();s.push({ip,dist:parseFloat(dist.toFixed(2)),ms,time,date:new Date().toISOString().slice(0,10)});s.sort((a,b)=>b.dist-a.dist);const t=s.slice(0,100);localStorage.setItem('irrk',JSON.stringify(t));return t}
function show(id){['menu','rank','hud','pause','go'].forEach(s=>{const e=$(s);if(e)e.style.display=s===id?'flex':'none'});const mc=$('mc');if(mc)mc.style.display=(id==='hud'&&isMobile)?'flex':'none'}

// ═══ JOGO ═══
const game={st:'loading',scene:null,cam:null,rnd:null,world:null,player:null,score:null,light:null,skyC:null,rain:null,au:null,input:null,ip:'',sT:0,lastT:0,
  async init(){
    this._lb(5,'Motor...');this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x87CEEB);
    this.cam=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,C.VD+100);
    this.rnd=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});this.rnd.setSize(window.innerWidth,window.innerHeight);this.rnd.setPixelRatio(Math.min(window.devicePixelRatio,2));this.rnd.shadowMap.enabled=true;this.rnd.shadowMap.type=THREE.PCFSoftShadowMap;this.rnd.toneMapping=THREE.ACESFilmicToneMapping;this.rnd.toneMappingExposure=1.5;(document.getElementById('game-container')||document.body).appendChild(this.rnd.domElement);
    this.input=mkInput(this.cam,this.rnd.domElement);initMats();this.light=mkLight(this.scene);
    this._lb(15,'Carregando texturas...');
    await new Promise(resolve=>loadAllTextures(resolve));
    this._lb(50,'Audio...');this.au=new AU();
    this._lb(60,'Mundo...');this.world=mkWorld(this.scene);
    this._lb(75,'Ceu...');this.skyC=mkSky(this.scene);this.rain=mkRain(this.scene);
    this._lb(85,'Player...');this.player=mkPlayer(this.cam,this.input);this.score=mkScore();
    this._lb(95,'Ranking...');this.ip=await gIp();
    this._lb(100,'OK!');await new Promise(r=>setTimeout(r,200));
    $('loading').style.display='none';this.st='menu';show('menu');this._ev();
    window.addEventListener('resize',()=>{this.cam.aspect=window.innerWidth/window.innerHeight;this.cam.updateProjectionMatrix();this.rnd.setSize(window.innerWidth,window.innerHeight)});
    rRk(this.ip);$('brec').textContent=this.score.bd.toFixed(2)+' km';this.lastT=performance.now();this._loop();this.score.start();
  },
  _lb(p,t){const b=$('lbar');if(b)b.style.width=p+'%';$('lt').textContent=t},
  _ev(){$('bs').addEventListener('click',()=>this.start());$('brk').addEventListener('click',()=>{rRk(this.ip);show('rank')});$('bcr').addEventListener('click',()=>show('menu'));$('bres').addEventListener('click',()=>this.resume());$('brst').addEventListener('click',()=>this.restart());$('bqt').addEventListener('click',()=>this.quit());$('brtry').addEventListener('click',()=>this.restart());$('bgm').addEventListener('click',()=>this.quit());window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(this.st==='playing')this._pause();else if(this.st==='paused')this.resume()}})},
  start(){this._clean();this.player=mkPlayer(this.cam,this.input);this.score=mkScore();this.score.start();this.st='playing';this.sT=0;show('hud');if(!isMobile){$('lock-msg').style.display='block';$('crosshair').style.display='block'}this.lastT=performance.now();if(!isMobile)try{this.rnd.domElement.requestPointerLock()}catch(e){}},
  _clean(){if(this.world){for(const[k,v]of this.world.blocks)this.scene.remove(v.g);this.world.blocks.clear()}},
  _pause(){this.st='paused';document.exitPointerLock();show('pause')},
  resume(){this.st='playing';show('hud');if(!isMobile)$('lock-msg').style.display='block';this.lastT=performance.now();setTimeout(()=>{if(!isMobile)try{this.rnd.domElement.requestPointerLock()}catch(e){}},80)},
  restart(){show('hud');this.start()},
  quit(){if(this.player&&this.player.maxDist>10){this.score.save();const ms=this.score.reached.length?Math.max(...this.score.reached):0;sRk(this.ip,this.player.maxDist/1000,ms,this.score.ft());rRk(this.ip)}document.exitPointerLock();this._clean();this.st='menu';show('menu');$('brec').textContent=this.score.bd.toFixed(2)+' km'},
  _go(){this.st='gameover';this.score.save();const ms=this.score.reached.length?Math.max(...this.score.reached):0;sRk(this.ip,this.player.maxDist/1000,ms,this.score.ft());$('gd').textContent=(this.player.maxDist/1000).toFixed(2)+' km';$('gt').textContent=this.score.ft();$('gm').textContent=ms+' km';$('gs').textContent=Math.round(Math.abs(this.player.vel.z)*3.6)+' km/h';$('gmsg').textContent='Pontuacao salva!';document.exitPointerLock();show('go')},
  _loop(){requestAnimationFrame(()=>this._loop());const n=performance.now();let dt=(n-this.lastT)/1000;this.lastT=n;dt=Math.min(dt,.15);if(this.st==='playing'){this.player.upd(dt);this.world.upd(this.player.pos.z);const ms=this.score.upd(this.player.maxDist);if(ms){$('msv').textContent=ms+' km';$('ms').style.display='flex';$('ms').style.animation='none';void $('ms').offsetHeight;$('ms').style.animation='mi 2.5s ease-out forwards';setTimeout(()=>{$('ms').style.display='none'},2500);this.au.ms()}this.light.upd(this.player.maxDist);this.skyC.forEach(c=>{c.position.x+=c.userData.s*dt;if(c.position.x>220)c.position.x=-220});this.rain.upd(dt,this.player.maxDist);if(this.player.vel.length()>1){this.sT+=dt;if(this.sT>.45){this.sT=0;this.au.fs()}}this._upd();if(!this.player.alive&&!this.player.cheats.god)this._go()}this.rnd.render(this.scene,this.cam)},
  _upd(){$('hd').textContent=(this.player.maxDist/1000).toFixed(2)+' km';$('ht').textContent=this.score.ft();$('hp').textContent=this.score.fp();$('hn').textContent=this.score.next+' km';$('hs').textContent=Math.round(Math.abs(this.player.vel.z)*3.6)+' km/h';$('hrc').textContent=this.score.bd.toFixed(1)+' km';const sf=$('sf');sf.style.width=this.player.stamina+'%';sf.style.background=this.player.stamina<25?'#f44':this.player.stamina<50?'#f90':'#4a4';$('biome').textContent=biome(this.player.maxDist/1000).n;$('cl').textContent=this.rain.emoji();$('brec').textContent=this.score.bd.toFixed(2)+' km'}
};
window.addEventListener('DOMContentLoaded',()=>{console.log('%c🏃 IRWT v9.1 %c| MagnorioBR %c| 19 texturas reais','color:#ff5e2c;font-size:1.2em','color:#fff','color:#ffb833');game.init()});
