// ===================================================================
// INFINITE RUNNER: WORLD TOUR v4.1 — CORRIGIDO & ESTAVEL
// Autor: MagnorioBR | Magnoriobr@gmail.com
// © 2026 Todos os direitos reservados
// ===================================================================
import * as THREE from 'three';

const C={
  BS:100,RW:10,SW:3,BMN:8,BMX:40,VD:350,CH:1.7,
  BSP:2.222,SSP:3.333,MS:100,SD:20,SR:12,
  GR:9.8,JF:5,HA:.04,HF:2.5,DK:5
};
const hr=C.RW/2,se=hr+C.SW,bz2=C.BS/2;

// ─── HELPERS ─────────────────────────────────────────────────
function hsh(x,z){let h=x*374761393+z*668265263;h=(h^(h>>13))*1274126177;return h^(h>>16)}
function sR(seed){let s=seed;return function(){s=(s*16807)%2147483647;return(s-1)/2147483646}}
function pn(x,z,s){const n=Math.sin(x*12.9898+z*78.233+s)*43758.5453;return n-Math.floor(n)}
function sn(x,z,s,sc){sc=sc||12;const nx=x/sc,nz=z/sc,ix=Math.floor(nx),iz=Math.floor(nz),fx=nx-ix,fz=nz-iz;const sx=fx*fx*(3-2*fx),sz=fz*fz*(3-2*fz);const n00=pn(ix,iz,s),n10=pn(ix+1,iz,s),n01=pn(ix,iz+1,s),n11=pn(ix+1,iz+1,s);return(n00+(n10-n00)*sx)+((n01+(n11-n01)*sx)-(n00+(n10-n00)*sx))*sz}
const $=function(id){return document.getElementById(id)};

// ─── TEXTURAS (OTIMIZADO: canvas 256px, menos loops) ─────────
class TG{
  constructor(){this.c={};this.cv=document.createElement('canvas');this.cv.width=256;this.cv.height=256;this.ctx=this.cv.getContext('2d')}
  _t(){var t=new THREE.CanvasTexture(this.cv);t.wrapS=THREE.RepeatWrapping;t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t}
  _q(type,seed){
    var c=this.ctx,w=256,r=sR(seed);
    if(type==='a'){c.fillStyle='#333';c.fillRect(0,0,w,w);for(var i=0;i<3000;i++){var v=35+r()*30;c.fillStyle='rgb('+v+','+v+','+(v+3)+')';c.fillRect(r()*w,r()*w,1+r()*2,1+r()*2)}}
    else if(type==='s'){var br=175+r()*30;c.fillStyle='rgb('+br+','+(br-5)+','+(br-10)+')';c.fillRect(0,0,w,w);var ts=80+r()*50;for(var x=0;x<w;x+=ts)for(var y=0;y<w;y+=ts){var v2=r()*12-6;c.fillStyle='rgb('+(br+v2)+','+(br-5+v2)+','+(br-10+v2)+')';c.fillRect(x+1,y+1,ts-3,ts-3)}}
    else if(type==='g'){var bg=75+r()*50;c.fillStyle='rgb(20,'+bg+',18)';c.fillRect(0,0,w,w);for(var i=0;i<5000;i++){var g=bg+r()*40;c.fillStyle='rgb('+(12+r()*25)+','+g+','+(10+r()*20)+')';c.fillRect(r()*w,r()*w,1,1+r()*3)}}
    else if(type==='d'){c.fillStyle='rgb('+(95+r()*45)+','+(60+r()*35)+','+(28+r()*25)+')';c.fillRect(0,0,w,w);for(var i=0;i<4000;i++){var dr=95+r()*50;c.fillStyle='rgb('+dr+','+(dr*0.6)+','+(dr*0.3)+')';c.fillRect(r()*w,r()*w,1+r()*2,1+r()*2)}}
    else if(type==='b'){var P=[[210,195,180],[175,165,158],[200,190,178],[160,150,142],[220,210,198],[180,170,162]];var p=P[Math.floor(r()*P.length)];c.fillStyle='rgb('+p[0]+','+p[1]+','+p[2]+')';c.fillRect(0,0,w,w);var ww=28+r()*18,wh=45+r()*25;for(var x=12;x<w-ww;x+=ww+12)for(var y=18;y<w-wh;y+=wh+18){c.fillStyle='rgba(30,30,35,.6)';c.fillRect(x-2,y-2,ww+4,wh+4);c.fillStyle=r()>.35?'rgb('+(235+r()*20)+','+(190+r()*20)+','+(145+r()*20)+')':'rgb('+(25+r()*20)+','+(30+r()*20)+','+(35+r()*20)+')';c.fillRect(x,y,ww,wh)}}
    else if(type==='r'){var v=55+r()*40;c.fillStyle='rgb('+v+','+(v-5)+','+(v-10)+')';c.fillRect(0,0,w,w);for(var y=0;y<w;y+=20+r()*18){c.fillStyle='rgba('+(v+10)+','+(v+5)+','+v+',.2)';c.fillRect(0,y,w,9);c.fillStyle='rgba('+(v-10)+','+(v-15)+','+(v-20)+',.2)';c.fillRect(0,y+9,w,11)}}
    return this._t();
  }
  gen(){for(var i=0;i<4;i++)this.c['a'+i]=this._q('a',1000+i);for(var i=0;i<4;i++)this.c['s'+i]=this._q('s',2000+i);for(var i=0;i<2;i++)this.c['g'+i]=this._q('g',3000+i);for(var i=0;i<2;i++)this.c['d'+i]=this._q('d',3500+i);for(var i=0;i<6;i++)this.c['b'+i]=this._q('b',4000+i);for(var i=0;i<4;i++)this.c['r'+i]=this._q('r',5000+i)}
  g(type,seed){var a=Math.abs(seed);var m={asphalt:['a',4],sidewalk:['s',4],grass:['g',2],dirt:['d',2],building:['b',6],roof:['r',4]};var e=m[type];if(!e)return this.c['a0'];var t=this.c[e[0]+(a%e[1])];var n=t.clone();n.needsUpdate=true;return n}
}

// ─── AUDIO (CORRIGIDO - sem criar AudioContext extra) ────────
class AU{
  constructor(){this.v=.8;this.ctx=null;this.sr=44100}
  _e(){
    if(!this.ctx){try{this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.sr=this.ctx.sampleRate}catch(e){return null}}
    if(this.ctx.state==='suspended'){try{this.ctx.resume()}catch(e){}}
    return this.ctx;
  }
  fs(surf){
    var c=this._e();if(!c)return;var n=c.currentTime;
    var o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);
    var f=surf==='grass'?55+Math.random()*35:surf==='dirt'?45+Math.random()*45:75+Math.random()*55;
    o.frequency.setValueAtTime(f,n);o.frequency.exponentialRampToValueAtTime(f*.25,n+.12);
    o.type=surf==='grass'?'sine':'triangle';
    g.gain.setValueAtTime(this.v*.12,n);g.gain.exponentialRampToValueAtTime(.001,n+.14);
    o.start(n);o.stop(n+.14);
  }
  br(i){
    var c=this._e();if(!c)return;var n=c.currentTime;
    var len=Math.floor(this.sr*.35);
    var b=c.createBuffer(1,len,this.sr);var d=b.getChannelData(0);
    for(var j=0;j<len;j++)d[j]=(Math.random()*2-1)*.2*Math.sin(j/len*Math.PI*1.5);
    var s=c.createBufferSource(),g=c.createGain(),f=c.createBiquadFilter();
    s.buffer=b;s.connect(f);f.connect(g);g.connect(c.destination);
    f.type='bandpass';f.frequency.value=180+i*280;f.Q.value=1;
    g.gain.setValueAtTime(this.v*i*.06,n);g.gain.exponentialRampToValueAtTime(.001,n+.35);
    s.start(n);s.stop(n+.35);
  }
  ms(){
    var c=this._e();if(!c)return;var n=c.currentTime;
    [523,659,784,1047].forEach(function(f,i){
      var o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);
      o.type='triangle';o.frequency.value=f;
      g.gain.setValueAtTime(0.08,n+i*.12);g.gain.exponentialRampToValueAtTime(.001,n+i*.12+.22);
      o.start(n+i*.12);o.stop(n+i*.12+.22);
    });
  }
  dm(){
    var c=this._e();if(!c)return;var n=c.currentTime;
    var len=Math.floor(this.sr*.15);
    var b=c.createBuffer(1,len,this.sr);var d=b.getChannelData(0);
    for(var i=0;i<len;i++)d[i]=(Math.random()*2-1)*.35;
    var s=c.createBufferSource(),g=c.createGain();s.buffer=b;s.connect(g);g.connect(c.destination);
    g.gain.setValueAtTime(this.v*.15,n);g.gain.exponentialRampToValueAtTime(.001,n+.15);
    s.start(n);
  }
}

// ─── CEU ──────────────────────────────────────────────────────
function makeSky(scene){
  var clds=[];
  for(var i=0;i<25;i++){
    var g=new THREE.Group();var m=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.5,depthWrite:false});
    for(var j=0;j<2;j++){var sp=new THREE.Mesh(new THREE.SphereGeometry(5+Math.random()*10,5,3),m);sp.position.set((Math.random()-.5)*18,Math.random()*3,(Math.random()-.5)*6);g.add(sp)}
    g.position.set((Math.random()-.5)*400,50+Math.random()*40,(Math.random()-.5)*400);g.userData={spd:.4+Math.random()*1.5};scene.add(g);clds.push(g);
  }
  return clds;
}

// ─── CHUVA ────────────────────────────────────────────────────
function makeRain(scene){
  var obj={mesh:null,intensity:0,scene:scene};
  obj.update=function(dt,dm){
    var rnd=Math.sin(dm*.0001)*.5+.5,tgt=rnd>.65?rnd*.7:0;
    this.intensity+=(tgt-this.intensity)*Math.min(dt*1.5,1);
    if(this.intensity>.08&&!this.mesh){
      var g=new THREE.BufferGeometry();var c=1500,p=new Float32Array(c*3);
      for(var i=0;i<c;i++){p[i*3]=(Math.random()-.5)*80;p[i*3+1]=Math.random()*60;p[i*3+2]=(Math.random()-.5)*80}
      g.setAttribute('position',new THREE.BufferAttribute(p,3));
      this.mesh=new THREE.Points(g,new THREE.PointsMaterial({color:0xaaccff,size:.1,transparent:true,opacity:.1,blending:THREE.AdditiveBlending,depthWrite:false}));
      this.scene.add(this.mesh);
    }
    if(this.mesh){
      var p=this.mesh.geometry.attributes.position.array;
      for(var j=0;j<p.length;j+=3){p[j+1]-=14*dt*this.intensity;if(p[j+1]<-1){p[j+1]=59;p[j]=(Math.random()-.5)*80;p[j+2]=(Math.random()-.5)*80}}
      this.mesh.geometry.attributes.position.needsUpdate=true;
      this.mesh.material.opacity=.08+this.intensity*.35;
    }
    if(this.intensity<.02&&this.mesh){this.scene.remove(this.mesh);this.mesh=null}
  };
  obj.emoji=function(){return this.intensity>.6?'🌧️':this.intensity>.2?'🌦️':'☀️'};
  return obj;
}

// ─── MUNDO ────────────────────────────────────────────────────
function makeWorld(scene,tg){
  var obj={scene:scene,tg:tg,blocks:new Map(),mats:{}};
  obj.mats.curb=new THREE.MeshStandardMaterial({color:0x777777,roughness:.5});
  obj.mats.treeT=new THREE.MeshStandardMaterial({color:0x5D4037,roughness:.85});
  obj.mats.treeC=[0x2E7D32,0x388E3C,0x43A047,0x4CAF50,0x1B5E20].map(function(c){return new THREE.MeshStandardMaterial({color:c,roughness:.75})});
  obj.mats.postM=new THREE.MeshStandardMaterial({color:0x2a2a2a,roughness:.3,metalness:.85});
  obj.mats.postB=new THREE.MeshStandardMaterial({color:0xfffef0,emissive:0x333322,roughness:.25});
  obj.mats.yellow=new THREE.MeshStandardMaterial({color:0xffcc00,roughness:.4,emissive:0x111100});

  function getH(lx,lz,seed){var ax=Math.abs(lx);if(ax<hr)return 0;if(ax<se)return.15+(ax-hr)/C.SW*.02;return.3+sn(lx,lz,seed)*.22}

  obj.mkBlock=function(bx,bz){
    var seed=hsh(bx,bz),BS=C.BS,key=bx+','+bz;
    if(this.blocks.has(key))return;
    var geo=new THREE.PlaneGeometry(BS,BS,8,8);geo.rotateX(-Math.PI/2);
    var pos=geo.attributes.position.array;
    for(var i=0;i<pos.length;i+=3)pos[i+1]=getH(pos[i],pos[i+2],seed);
    geo.computeVertexNormals();
    var aTex=this.tg.g('asphalt',seed);aTex.repeat.set(5,5);
    var mat=new THREE.MeshStandardMaterial({map:aTex,roughness:.88,metalness:.02});
    var mesh=new THREE.Mesh(geo,mat);mesh.receiveShadow=true;
    var g=new THREE.Group();g.add(mesh);g.position.set(bx*BS,0,bz*BS);mesh.position.set(0,0,0);
    var cGeo=new THREE.BoxGeometry(.2,.1,BS);
    for(var s=-1;s<=1;s+=2){var c=new THREE.Mesh(cGeo,this.mats.curb);c.position.set(s*hr,.05,0);c.castShadow=true;c.receiveShadow=true;g.add(c)}
    var dGeo=new THREE.PlaneGeometry(.2,3);
    for(var z=-48;z<48;z+=6){var d=new THREE.Mesh(dGeo,this.mats.yellow);d.rotation.x=-Math.PI/2;d.position.set(0,.015,z+3);g.add(d)}
    this.scene.add(g);this.blocks.set(key,{grp:g,seed:seed,pop:false});
  };

  obj.popBlock=function(key){
    var b=this.blocks.get(key);if(!b||b.pop)return;b.pop=true;
    var g=b.grp,seed=b.seed,r=sR(seed),BS=C.BS,bzs=BS/2-se,bzw=bzs*2;
    for(var side=-1;side<=1;side+=2){
      var bxC=side*(se+bzs/2),nb=2+Math.floor(Math.abs(r())*3),bw=(BS-3)/nb;
      for(var i=0;i<nb;i++){
        var bzP=-BS/2+1.5+i*bw+bw/2,h=C.BMN+Math.abs(r())*(C.BMX-C.BMN);
        var geo=new THREE.BoxGeometry(bzs-.2,h,bw-.4);
        var tex=this.tg.g('building',seed+i*100+side*50);tex.repeat.set(1,Math.max(1,h/(bw-.4)));
        var bm=new THREE.MeshStandardMaterial({map:tex,roughness:.55,metalness:.08});
        var bldg=new THREE.Mesh(geo,bm);bldg.position.set(bxC,h/2,bzP);bldg.castShadow=true;bldg.receiveShadow=true;g.add(bldg);
        var rGeo=new THREE.PlaneGeometry(bzs-.2,bw-.4);
        var rTex=this.tg.g('roof',seed+i*200+side*100);rTex.repeat.set(2,2);
        var rf=new THREE.Mesh(rGeo,new THREE.MeshStandardMaterial({map:rTex,roughness:.75}));rf.rotation.x=-Math.PI/2;rf.position.set(bxC,h+.02,bzP);g.add(rf);
      }
    }
    for(var side=-1;side<=1;side+=2){
      var tx=side*(hr+C.SW/2);
      for(var tz=-BS/2+5;tz<BS/2-5;tz+=14+Math.abs(r())*16){
        if(Math.abs(r())>.25){
          var tr=new THREE.Group();var th=1.5+r()*3;
          var tk=new THREE.Mesh(new THREE.CylinderGeometry(.1,.16,th,6),this.mats.treeT);tk.position.y=th/2;tk.castShadow=true;tr.add(tk);
          var ns=2+Math.floor(r()*3);
          for(var j=0;j<ns;j++){var cr=.5+r()*1.3;var cn=new THREE.Mesh(new THREE.SphereGeometry(cr,6,4),this.mats.treeC[Math.floor(Math.abs(r())*this.mats.treeC.length)]);cn.position.set((r()-.5)*1.6,th+.3+r()*1.6,(r()-.5)*1.6);cn.castShadow=true;tr.add(cn)}
          tr.position.set(tx,0,tz);g.add(tr);
        }
      }
    }
    for(var side=-1;side<=1;side+=2){
      var px=side*(hr+.5);
      for(var pz=-BS/2+10;pz<BS/2-10;pz+=24){
        var pg=new THREE.Group();var p=new THREE.Mesh(new THREE.CylinderGeometry(.05,.09,5,6),this.mats.postM);p.position.y=2.5;p.castShadow=true;pg.add(p);
        var a=new THREE.Mesh(new THREE.BoxGeometry(1.2,.06,.06),this.mats.postM);a.position.set(.6,4.8,0);pg.add(a);
        var lb=new THREE.Mesh(new THREE.SphereGeometry(.2,6,3),this.mats.postB);lb.position.set(1.25,4.8,0);pg.add(lb);pg.position.set(px,0,pz);g.add(pg);
      }
    }
  };

  obj.upd=function(pz){
    var pbz=Math.floor(pz/C.BS),range=Math.ceil(C.VD/C.BS)+1;
    var needed=new Set();
    for(var bz=pbz-range;bz<=pbz+range;bz++)for(var bx=-2;bx<=2;bx++)needed.add(bx+','+bz);
    var self=this;
    this.blocks.forEach(function(b,k){if(!needed.has(k)){self.scene.remove(b.grp);self.blocks.delete(k)}needed.delete(k)});
    needed.forEach(function(k){var parts=k.split(',');self.mkBlock(parseInt(parts[0]),parseInt(parts[1]))});
    var done=0;
    this.blocks.forEach(function(b,k){if(!b.pop&&done<1){self.popBlock(k);done++}});
  };

  return obj;
}

// ─── JOGADOR ──────────────────────────────────────────────────
function makePlayer(cam){
  var p={
    c:cam,spd:0,tSpd:0,lat:0,tLat:0,dist:0,stam:C.MS,
    sprint:false,jumping:false,jv:0,vo:0,hp:100,alive:true,hbT:0,keys:{},spdH:[],
    upd:function(dt){
      if(!this.alive)return;dt=Math.min(dt,.1);
      if(this.keys['w'])this.tSpd=this.sprint&&this.stam>0?C.SSP:C.BSP;
      else if(this.keys['s'])this.tSpd=Math.max(0,this.spd-5*dt);
      else this.tSpd=Math.max(0,this.spd-1.2*dt);
      if(this.sprint&&this.keys['w']&&this.spd>C.BSP){this.stam=Math.max(0,this.stam-C.SD*dt);if(this.stam<=0)this.sprint=false}
      else this.stam=Math.min(C.MS,this.stam+C.SR*dt);
      this.spd+=(this.tSpd-this.spd)*Math.min(7*dt,1);
      this.dist+=this.spd*dt;
      if(this.keys['a'])this.tLat=-3;else if(this.keys['d'])this.tLat=3;else this.tLat=0;
      this.lat+=(this.tLat-this.lat)*Math.min(10*dt,1);
      if(this.keys[' ']&&!this.jumping){this.jumping=true;this.jv=C.JF}
      if(this.jumping){this.jv-=C.GR*dt;this.vo+=this.jv*dt;if(this.vo<=0){this.vo=0;this.jumping=false;this.jv=0}}
      if(this.spd>1)this.hbT+=dt*C.HF*(this.spd/C.BSP);
      var hbY=Math.sin(this.hbT*Math.PI*2)*C.HA*Math.min(this.spd/C.BSP,1.5);
      var hbX=Math.cos(this.hbT*Math.PI)*C.HA*.5;
      this.c.position.set(this.lat+hbX,C.CH+this.vo+hbY,this.dist);
      if(Math.abs(this.c.position.x)>bz2+.5){this.spd*=.6;this.c.position.x=(this.c.position.x>0?1:-1)*bz2;this.hp-=15;this.lat=this.c.position.x;this.tLat=this.c.position.x;this._dmg();if(this.hp<=0){this.alive=false;this.spd=0}}
      this.spdH.push(this.spd);if(this.spdH.length>180)this.spdH.shift();
    },
    _dmg:function(){var f=document.createElement('div');f.className='dmg';document.body.appendChild(f);setTimeout(function(){f.remove()},350)},
    avgSpd:function(){return this.spdH.length?this.spdH.reduce(function(a,b){return a+b},0)/this.spdH.length:0}
  };
  cam.position.set(0,C.CH,0);
  function kd(e){p.keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==='shift')p.sprint=true}
  function ku(e){p.keys[e.key.toLowerCase()]=false;if(e.key.toLowerCase()==='shift')p.sprint=false}
  window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);
  function btn(id,k,v){var el=$(id);if(!el)return;el.addEventListener('pointerdown',function(){p.keys[k]=v;if(k==='shift')p.sprint=v;if(k==='w'&&v)p.keys['w']=true});el.addEventListener('pointerup',function(){p.keys[k]=false;if(k==='shift')p.sprint=false});el.addEventListener('pointerleave',function(){p.keys[k]=false;if(k==='shift')p.sprint=false})}
  btn('mcl','a',true);btn('mcr','d',true);btn('mcj',' ',true);btn('mcs','shift',true);btn('mcs','w',true);
  document.addEventListener('touchstart',function(){if(p.spd<1)p.keys['w']=true},{passive:true});
  return p;
}

// ─── PONTUACAO ───────────────────────────────────────────────
function makeScore(){
  return {
    st:0,el:0,dist:0,cSpd:0,ms:[1,2,4,8,16,32,64,128,256,512,1024],reached:[],next:1,running:false,
    bd:parseFloat(localStorage.getItem('irbd')||'0'),bm:parseFloat(localStorage.getItem('irbm')||'0'),
    start:function(){this.st=performance.now();this.running=true},
    upd:function(sprinting){
      if(!this.running)return null;
      this.el=(performance.now()-this.st)/1000;
      this.cSpd=sprinting?C.SSP:C.BSP;this.dist=this.cSpd*this.el;
      var km=this.dist/1000;
      if(km>=this.next){var m=this.next;this.reached.push(m);var i=this.ms.indexOf(m);this.next=(i>=0&&i<this.ms.length-1)?this.ms[i+1]:this.next*2;return m}
      return null;
    },
    fd:function(){return(this.dist/1000).toFixed(2)+' km'},
    ft:function(){var s=Math.floor(this.el),m=Math.floor(s/60),h=Math.floor(m/60);return h>0?String(h).padStart(2,'0')+':'+String(m%60).padStart(2,'0')+':'+String(s%60).padStart(2,'0'):String(m).padStart(2,'0')+':'+String(s%60).padStart(2,'0')},
    fp:function(){if(this.dist<5)return'--:-- /km';var ps=this.el/(this.dist/1000);return Math.floor(ps/60)+':'+String(Math.floor(ps%60)).padStart(2,'0')+' /km'},
    kmh:function(){return this.el>1?(this.dist/1000)/(this.el/3600):0},
    save:function(){var km=this.dist/1000;if(km>this.bd){this.bd=km;localStorage.setItem('irbd',km.toString())}var lm=this.reached.length?Math.max.apply(null,this.reached):0;if(lm>this.bm){this.bm=lm;localStorage.setItem('irbm',lm.toString())}}
  };
}

// ─── DIA/NOITE ───────────────────────────────────────────────
function makeDN(scene){
  var obj={scene:scene};
  obj.sun=new THREE.DirectionalLight(0xfff5e6,1.5);obj.sun.position.set(50,80,30);obj.sun.castShadow=true;obj.sun.shadow.mapSize.set(1024,1024);obj.sun.shadow.camera.near=.5;obj.sun.shadow.camera.far=300;obj.sun.shadow.camera.left=-60;obj.sun.shadow.camera.right=60;obj.sun.shadow.camera.top=60;obj.sun.shadow.camera.bottom=-60;
  scene.add(obj.sun);obj.amb=new THREE.AmbientLight(0x404060,.4);scene.add(obj.amb);scene.add(new THREE.HemisphereLight(0x87CEEB,0x362907,.3));
  obj.upd=function(dist){
    var hp=(dist/1000)/C.DK,dc=((8+hp)%24)/24,sa=dc*Math.PI*2,sh=Math.sin(sa);
    this.sun.position.set(Math.cos(sa)*100,sh*100,30);
    var i=Math.max(.04,sh+.2);this.sun.intensity=i*2;this.amb.intensity=Math.max(.08,i*.4);
    if(sh>-.1){this.scene.background=new THREE.Color(.3+sh*.3,.5+sh*.3,.8+sh*.2);this.scene.fog=new THREE.Fog(new THREE.Color(.7,.75,.8),60,C.VD)}
    else{var nf=Math.abs(sh);this.scene.background=new THREE.Color(.02+nf*.04,.02+nf*.04,.08+nf*.08);this.scene.fog=new THREE.Fog(new THREE.Color(.02,.02,.05),25,C.VD*.7)}
  };
  return obj;
}

// ─── RANKING ─────────────────────────────────────────────────
function maskIp(ip){var p=ip.split('.');return p.length===4?p[0]+'.'+p[1]+'.***.***':ip}
function getRank(){try{return JSON.parse(localStorage.getItem('irrk')||'[]')}catch(e){return[]}}
function saveRank(ip,dist,ms,time){
  var scores=getRank();scores.push({ip:ip,dist:parseFloat(dist.toFixed(2)),ms:ms,time:time,date:new Date().toISOString().slice(0,10)});
  scores.sort(function(a,b){return b.dist-a.dist});var top=scores.slice(0,100);localStorage.setItem('irrk',JSON.stringify(top));return top;
}
async function getIp(){
  try{
    var ctrl=new AbortController();var id=setTimeout(function(){ctrl.abort()},3000);
    var r=await fetch('https://api.ipify.org?format=json',{signal:ctrl.signal});clearTimeout(id);
    var d=await r.json();return d.ip;
  }catch(e){return'local_'+Math.random().toString(36).slice(2,8)}
}
function renderRank(ip){
  var scores=getRank(),rb=$('rb'),rp=$('rp'),h='';
  scores.forEach(function(s,i){var isP=s.ip===ip;h+='<tr class="'+(isP?'pr':'')+'"><td>'+(i<3?['🥇','🥈','🥉'][i]:i+1+'º')+'</td><td>'+maskIp(s.ip)+'</td><td>'+s.dist.toFixed(2)+' km</td><td>'+(s.ms||0)+'</td><td>'+s.time+'</td></tr>'});
  if(!scores.length)h='<tr><td colspan="5">Nenhum resultado</td></tr>';
  rb.innerHTML=h;var pi=scores.findIndex(function(s){return s.ip===ip});rp.textContent=pi>=0?'Sua posição: '+(pi+1)+'º':'Jogue para aparecer!';
}

// ─── UI ──────────────────────────────────────────────────────
function show(id){['menu','rank','conf','hud','pause','go'].forEach(function(s){var e=$(s);if(e)e.style.display=s===id?'flex':'none'});var mc=$('mc');if(mc)mc.style.display=(id==='hud'&&window.innerWidth<1024)?'flex':'none'}

// ─── JOGO PRINCIPAL ──────────────────────────────────────────
var game={
  st:'loading',scene:null,cam:null,rnd:null,tg:null,world:null,player:null,score:null,dn:null,skyClds:null,rain:null,au:null,ip:'',stTimer:0,brTimer:0,lastT:0,
  init:async function(){
    var self=this;
    this._lb(5,'Inicializando motor...');
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x87CEEB);this.scene.fog=new THREE.Fog(0xCCDDFF,60,C.VD);
    this.cam=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,C.VD+100);
    this.rnd=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});this.rnd.setSize(window.innerWidth,window.innerHeight);this.rnd.setPixelRatio(Math.min(window.devicePixelRatio,2));
    this.rnd.shadowMap.enabled=true;this.rnd.shadowMap.type=THREE.PCFSoftShadowMap;this.rnd.toneMapping=THREE.ACESFilmicToneMapping;this.rnd.toneMappingExposure=1;
    var gc=$('game-container')||document.body;gc.appendChild(this.rnd.domElement);

    this._lb(15,'Gerando texturas...');
    await this._yield();this.tg=new TG();this.tg.gen();await this._yield();

    this._lb(35,'Preparando audio...');this.au=new AU();
    this._lb(45,'Construindo mundo...');
    await this._yield();this.world=makeWorld(this.scene,this.tg);await this._yield();

    this._lb(60,'Criando ceu...');this.skyClds=makeSky(this.scene);this.rain=makeRain(this.scene);this.dn=makeDN(this.scene);
    this._lb(75,'Preparando jogador...');this.player=makePlayer(this.cam);this.score=makeScore();

    this._lb(85,'Conectando ranking...');this.ip=await getIp();

    this._lb(100,'Pronto!');
    await new Promise(function(r){setTimeout(r,300)});
    $('loading').style.display='none';this.st='menu';show('menu');
    this._events();
    window.addEventListener('resize',function(){self.cam.aspect=window.innerWidth/window.innerHeight;self.cam.updateProjectionMatrix();self.rnd.setSize(window.innerWidth,window.innerHeight)});
    renderRank(this.ip);$('brec').textContent=this.score.bd.toFixed(2)+' km';
    this.lastT=performance.now();this._loop();
  },
  _lb:function(p,t){var b=$('lbar');if(b)b.style.width=p+'%';var m=$('load-t');if(m)m.textContent=t},
  _yield:function(){return new Promise(function(r){setTimeout(r,30)})},
  _events:function(){
    var self=this;
    $('bs').addEventListener('click',function(){self.start()});
    $('brk').addEventListener('click',function(){renderRank(self.ip);show('rank')});
    $('bcf').addEventListener('click',function(){show('conf')});
    $('bcr').addEventListener('click',function(){show('menu')});
    $('bcc').addEventListener('click',function(){show('menu')});
    $('bres').addEventListener('click',function(){self.resume()});
    $('brst').addEventListener('click',function(){self.restart()});
    $('bqt').addEventListener('click',function(){self.quit()});
    $('brtry').addEventListener('click',function(){self.restart()});
    $('bgm').addEventListener('click',function(){self.quit()});
    window.addEventListener('keydown',function(e){if(e.key==='Escape'){if(self.st==='playing')self._pause();else if(self.st==='paused')self.resume()}});
  },
  start:function(){this._clean();this.player=makePlayer(this.cam);this.score=makeScore();this.score.start();this.st='playing';this.stTimer=0;this.brTimer=0;show('hud');this.lastT=performance.now()},
  _clean:function(){if(this.world){var self=this;this.world.blocks.forEach(function(b){self.scene.remove(b.grp)});this.world.blocks.clear()}},
  _pause:function(){this.st='paused';show('pause')},
  resume:function(){this.st='playing';show('hud');this.lastT=performance.now()},
  restart:function(){show('hud');this.start()},
  quit:function(){
    if(this.player&&this.player.dist>10){this.score.save();var ms=this.score.reached.length?Math.max.apply(null,this.score.reached):0;saveRank(this.ip,this.player.dist/1000,ms,this.score.ft());renderRank(this.ip)}
    this._clean();this.st='menu';show('menu');$('brec').textContent=this.score.bd.toFixed(2)+' km'
  },
  _go:function(){this.st='gameover';this.score.save();var ms=this.score.reached.length?Math.max.apply(null,this.score.reached):0;saveRank(this.ip,this.player.dist/1000,ms,this.score.ft());$('gd').textContent=(this.player.dist/1000).toFixed(2)+' km';$('gt').textContent=this.score.ft();$('gm').textContent=ms+' km';$('gs').textContent=Math.round(this.player.avgSpd()*3.6)+' km/h';$('gmsg').textContent='✅ Pontuacao enviada ao ranking!';show('go')},
  _loop:function(){
    var self=this;
    requestAnimationFrame(function(){self._loop()});
    var now=performance.now(),dt=(now-this.lastT)/1000;this.lastT=now;dt=Math.min(dt,.15);
    if(this.st==='playing'){
      this.player.upd(dt);
      this.world.upd(this.player.dist);
      var ms=this.score.upd(this.player.sprint);
      if(ms){this._flashMs(ms);this.au.ms()}
      this.dn.upd(this.player.dist);
      this.skyClds.forEach(function(c){c.position.x+=c.userData.spd*dt;if(c.position.x>260)c.position.x=-260});
      this.skyClds.forEach(function(c){c.children.forEach(function(ch){if(ch.material)ch.material.opacity=.2+self.rain.intensity*.45})});
      this.rain.update(dt,this.player.dist);
      if(this.player.spd>1){this.stTimer+=dt*(this.player.spd/C.BSP);if(this.stTimer>.45){this.stTimer=0;var px=this.cam.position.x;var s='asphalt';if(Math.abs(px)>se)s='grass';else if(Math.abs(px)>hr)s='sidewalk';this.au.fs(s)}}
      if(this.player.spd>1){this.brTimer+=dt;if(this.brTimer>3){this.brTimer=0;var i=Math.min(1,(this.player.dist/1000)/10);if(i>.2)this.au.br(i)}}
      this._updHUD();if(!this.player.alive){this.au.dm();this._go()}
    }
    this.rnd.render(this.scene,this.cam);
  },
  _flashMs:function(km){var o=$('ms'),v=$('msv');if(!o||!v)return;v.textContent=km+' km';o.style.display='flex';o.style.animation='none';void o.offsetHeight;o.style.animation='mi 2.5s ease-out forwards';setTimeout(function(){o.style.display='none'},2500)},
  _updHUD:function(){
    $('hd').textContent=this.score.fd();$('ht').textContent=this.score.ft();$('hp').textContent=this.score.fp();
    $('hn').textContent=this.score.next+' km';$('hs').textContent=Math.round(this.player.spd*3.6)+' km/h';
    $('hrc').textContent=this.score.bd.toFixed(1)+' km';
    var sf=$('sf');sf.style.width=this.player.stam+'%';sf.style.background=this.player.stam<25?'linear-gradient(90deg,#f44336,#ff9800)':this.player.stam<50?'linear-gradient(90deg,#ff9800,#ffc107)':'linear-gradient(90deg,#4CAF50,#8BC34A)';
    $('wi').textContent=this.rain.emoji();$('brec').textContent=this.score.bd.toFixed(2)+' km';
  }
};

// ─── BOOT ────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded',function(){
  console.log('%c🏃 Infinite Runner: World Tour v4.1 %c| %cMagnorioBR','color:#ff5e2c;font-size:1.2em','color:#fff','color:#ffb833');
  game.init();
});
