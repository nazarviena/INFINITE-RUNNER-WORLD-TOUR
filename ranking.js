// Ranking Local - salva pontuações no localStorage
// Para ranking global, configurar firebase-config.js

async function getPlayerIP(){ try{ const r=await fetch('https://api.ipify.org?format=json'); const d=await r.json(); return d.ip; }catch(e){ return 'local'; } }

function maskIP(ip){ const p=ip.split('.'); return p.length===4?`${p[0]}.${p[1]}.***.***`:ip; }

function getLocalRanking(){ return JSON.parse(localStorage.getItem('ir_localrank')||'[]'); }

function saveLocalScore(ip,distKm,marcos,tempo){
  const scores=getLocalRanking();
  scores.push({ip,dist:parseFloat(distKm.toFixed(2)),ms:marcos,time:tempo,date:new Date().toISOString().slice(0,10)});
  scores.sort((a,b)=>b.dist-a.dist);
  const top=scores.slice(0,100);
  localStorage.setItem('ir_localrank',JSON.stringify(top));
  return top;
}

function formatDate(d){ if(!d)return''; const dt=new Date(d); return dt.toLocaleDateString('pt-BR'); }
