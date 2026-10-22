
/* ================= Presence: state, stage, subtitles ================= */
const setState=s=>{document.body.dataset.state=s};
const setStage=n=>{document.body.dataset.stage=n};
const subEl=$('#subtitle');let lastSub='';
function setSubtitle(t){if(!t||t===lastSub)return;lastSub=t;let q=subEl.querySelector('q');if(!q){q=document.createElement('q');subEl.replaceChildren(q)}q.textContent=t}
function lastSentence(t){const parts=String(t).replace(/\s+/g,' ').trim().split(/(?<=[.!?।॥])\s+/).filter(Boolean);let s=parts[parts.length-1]||'';
 if(s.length<28&&parts.length>1)s=parts[parts.length-2]+' '+s;
 if(s.length>190){s=s.slice(-190);s='…'+s.slice(s.indexOf(' ')+1)}return s}

/* ================= History (this browser only) ================= */
const HK='gp_hist_v1';let hist=store.get(HK,[]);
const updHist=()=>{$('#histCount').textContent=hist.length};
function saveExchange(e){hist.unshift(e);hist=hist.slice(0,60);store.set(HK,hist);updHist()}
function leafHTML(e){const L=T[e.lang]||T.en,order=ORDER[e.mode]||['SAY'];
 return `<div class="kr"><div class="who">॥ श्रीभगवानुवाच ॥</div>`+order.filter(k=>e.sec&&e.sec[k]).map(k=>{
  const v=k==='VERSE'&&e.vid&&byId[e.vid];
  const vb=v?`<span class="cite">Bhagavad Gītā ${e.vid}</span><div class="shloka">${esc(clean(v))}</div><div class="translit">${esc(v.transliteration)}</div>`:'';
  return `<div class="step ${k==='ASK'?'ask':''}"><b>${L.h[k]}</b>${vb}<p>${esc(e.sec[k])}</p></div>`}).join('')+`</div>`}
const modeLabel=m=>m==='ASK'?'Krishna asked':m==='TEACH'?'Teaching':'Dialogue';
function openHistory(){
 const box=$('#box');
 box.innerHTML=`<button class="x" id="xBtn" aria-label="Close">×</button><h3>Your conversations</h3><p class="wm">Kept only in this browser. Nothing is stored on a server.</p>`+
  (hist.length?`<div class="hlist">${hist.map((e,i)=>`<button class="hitem" data-i="${i}" type="button"><span class="hd">${new Date(e.t).toLocaleString([],{dateStyle:'medium',timeStyle:'short'})} · ${modeLabel(e.mode)}${e.vid?' · BG '+e.vid:''}</span><span class="hq">${esc(e.q.slice(0,140))}</span></button>`).join('')}</div><div class="actions"><button class="pill" id="hClear" type="button">Clear all history</button></div>`
   :'<div class="empty">No conversations yet. Speak to Krishna and they will appear here.</div>');
 $('#modal').classList.add('show');$('#xBtn').onclick=closeM;
 $$('.hitem').forEach(b=>b.onclick=()=>openHistItem(+b.dataset.i));
 const c=$('#hClear');if(c)c.onclick=()=>{if(c.dataset.sure){hist=[];store.set(HK,hist);updHist();openHistory();toast('History cleared')}else{c.dataset.sure=1;c.textContent='Tap again to confirm'}};
}
function openHistItem(i){const e=hist[i];if(!e)return;
 $('#box').innerHTML=`<button class="x" id="xBtn" aria-label="Close">×</button><button class="pill" id="hBack" type="button">← All conversations</button><div class="me"><small>You</small><span>${esc(e.q)}</span></div>${leafHTML(e)}<div class="actions">${e.vid?'<button class="pill" id="hCard" type="button">🖼 Shloka card</button>':''}<button class="pill" id="hCopy" type="button">⧉ Copy</button><button class="pill" id="hDel" type="button">Delete</button></div>`;
 $('#xBtn').onclick=closeM;$('#hBack').onclick=openHistory;
 const h=$('#hCard');if(h)h.onclick=()=>openVerse(e.vid,true);
 $('#hCopy').onclick=()=>navigator.clipboard?.writeText(e.q+'\n\n'+Object.values(e.sec||{}).join('\n\n')).then(()=>toast('Copied'));
 $('#hDel').onclick=()=>{hist.splice(i,1);store.set(HK,hist);updHist();openHistory()};
}
$('#histBtn').onclick=openHistory;updHist();
T.en.greet='O seeker, you have come to the field. Speak: tell me what weighs upon your heart.';
T.hi.greet='हे साधक, तुम रणभूमि में आए हो। बोलो, तुम्हारे हृदय पर क्या बोझ है?';
T.te.greet='ఓ సాధకా, నీవు యుద్ధభూమికి వచ్చావు. చెప్పు, నీ హృదయంపై ఏ భారం ఉంది?';
$('#newConvo').onclick=()=>{history=[];ss.set('ctx',[]);$('#thread').innerHTML='';$('#chariot').classList.remove('show');setStage(1);lastSub='';setSubtitle(T[lang].greet);toast('A new conversation begins');window.scrollTo({top:0,behavior:'smooth'})};
$$('#langs [data-l]').forEach(b=>b.addEventListener('click',()=>{lastSub='';if(!history.length)setSubtitle(T[b.dataset.l].greet)}));

/* ================= Hero quote (real verses from the dataset) ================= */
(()=>{const IDS=['2.47','18.66','6.5','4.7','2.20','2.14'],box=$('#heroQuote');let k=0;
 const short=t=>{t=t.trim();if(t.length<=170)return t;const m=t.slice(0,170).match(/^.*[.;]/);return m?m[0]:t.slice(0,167)+'…'};
 function show(){const v=byId[IDS[k%IDS.length]];if(!v){k++;return}
  box.classList.add('out');setTimeout(()=>{box.innerHTML=`<p class="sk">${esc(clean(v).split(/[।॥]/)[0].trim()+' ॥')}</p><p class="en">“${esc(short(v.translation))}”</p><cite>Krishna · Bhagavad Gītā ${id(v)}</cite>`;box.classList.remove('out');k++},k?500:0)}
 show();setInterval(show,10000)})();

/* ================= Stage effects over the portrait ================= */
(()=>{
 const img=$('#heroPic'),cv=$('#fx'),ctx=cv.getContext('2d'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const MOON={x:.54,y:.29,r:.195},IW=1280,IH=720;
 let W=0,H=0,dpr=1,pp=[.56,.25],P=[],F=[],rot=0,spd=.05,glow=.45,rip=[],rt=0,last=performance.now();
 const place=()=>{pp=innerWidth<=900?[.55,.3]:[.56,.25];img.style.objectPosition=pp[0]*100+'% '+pp[1]*100+'%'};
 const map=(nx,ny)=>{const s=Math.max(W/IW,H/IH);return[(W-IW*s)*pp[0]+nx*IW*s,(H-IH*s)*pp[1]+ny*IH*s,s]};
 const rnd=(a,b)=>a+Math.random()*(b-a);
 const petal=top=>({x:rnd(0,W),y:top?rnd(-H,H):rnd(-60,-10),vx:rnd(6,22),vy:rnd(14,34),r:rnd(0,6.28),vr:rnd(-1.5,1.5),s:rnd(4,9),a:rnd(.45,.9),ph:rnd(0,6.28)});
 const fly=()=>({x:rnd(0,W),y:rnd(H*.3,H),vx:rnd(-6,6),vy:rnd(-12,-3),ph:rnd(0,6.28),s:rnd(1,2.4),c:Math.random()<.5?'255,214,120':'80,230,200'});
 function size(){const r=cv.getBoundingClientRect();W=r.width;H=r.height;if(!W||!H)return;dpr=Math.min(2,devicePixelRatio||1);cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);place();
  P=Array.from({length:Math.max(10,Math.round(W/42))},()=>petal(true));F=Array.from({length:Math.max(10,Math.round(W/34))},fly)}
 function chakra(cx,cy,r1,r2,a,al){
  ctx.save();ctx.translate(cx,cy);ctx.strokeStyle=`rgba(255,226,160,${al})`;ctx.fillStyle=`rgba(255,226,160,${al})`;
  ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(0,0,r1,0,7);ctx.stroke();ctx.beginPath();ctx.arc(0,0,r2,0,7);ctx.stroke();
  ctx.rotate(a);for(let i=0;i<18;i++){ctx.save();ctx.rotate(i*Math.PI/9);ctx.beginPath();ctx.moveTo(r1,0);ctx.lineTo(r2,0);ctx.stroke();ctx.beginPath();ctx.arc(r2+5,0,2.2,0,7);ctx.fill();ctx.restore()}
  ctx.rotate(-2*a);ctx.setLineDash([2,9]);ctx.beginPath();ctx.arc(0,0,r2+16,0,7);ctx.stroke();ctx.setLineDash([]);ctx.restore()}
 function frame(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;if(!W){size();requestAnimationFrame(frame);return}
  const st=document.body.dataset.state||'idle';
  const tS={idle:.05,listening:.14,thinking:.9,speaking:.24}[st],tG={idle:.45,listening:.68,thinking:.85,speaking:1}[st];
  spd+=(tS-spd)*Math.min(1,dt*3);glow+=(tG-glow)*Math.min(1,dt*2.5);rot+=spd*dt;
  ctx.clearRect(0,0,W,H);
  const[mx,my,s]=map(MOON.x,MOON.y),R=MOON.r*IW*s,pulse=1+.07*Math.sin(now/(st==='speaking'?240:1500));
  const g=ctx.createRadialGradient(mx,my,R*.9,mx,my,R*2.3*pulse);g.addColorStop(0,`rgba(185,212,255,${.3*glow})`);g.addColorStop(1,'rgba(185,212,255,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(mx,my,R*2.4,0,7);ctx.fill();
  chakra(mx,my,R*1.17,R*1.5,rot,.12+.3*glow);
  if(st==='listening'||st==='speaking'){rt+=dt;if(rt>(st==='speaking'?.85:1.1)){rt=0;rip.push(0)}}
  rip=rip.map(a=>a+dt*.5).filter(a=>a<1);
  rip.forEach(a=>{ctx.strokeStyle=`rgba(244,239,225,${.4*(1-a)})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(mx,my,R*(1.05+a*1.25),0,7);ctx.stroke()});
  P.forEach((p,i)=>{p.ph+=dt;p.x+=(p.vx+Math.sin(p.ph*1.3)*14)*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;if(p.y>H+20||p.x>W+20)P[i]=petal(false);
   ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=`rgba(255,122,165,${p.a})`;ctx.beginPath();ctx.ellipse(0,0,p.s,p.s*.55*Math.abs(Math.cos(p.ph)*.6+.5),0,0,7);ctx.fill();ctx.restore()});
  F.forEach((f,i)=>{f.ph+=dt*2;f.x+=f.vx*dt;f.y+=f.vy*dt;if(f.y<-10||f.x<-10||f.x>W+10)F[i]=fly();
   const a=.25+.75*Math.abs(Math.sin(f.ph));const gg=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,f.s*5);gg.addColorStop(0,`rgba(${f.c},${a})`);gg.addColorStop(1,`rgba(${f.c},0)`);ctx.fillStyle=gg;ctx.beginPath();ctx.arc(f.x,f.y,f.s*5,0,7);ctx.fill()});
  if(!reduce)requestAnimationFrame(frame)};
 addEventListener('resize',()=>{size()});place();size();requestAnimationFrame(frame);
 if(img.complete)size();else img.addEventListener('load',size);
})();

/* ================= Floating mic + read-more ================= */
(()=>{const fab=$('#fab');
 if('IntersectionObserver'in window)new IntersectionObserver(([e])=>fab.classList.toggle('show',!e.isIntersecting),{threshold:.05}).observe($('#hero'));
 fab.onclick=()=>{$('#hero').scrollIntoView({behavior:'smooth'});setTimeout(()=>$('#q').focus({preventScroll:true}),500)};
 $('#readMore').onclick=()=>{const ks=$$('#thread .kr');(ks[ks.length-1]||$('#chariot')).scrollIntoView({behavior:'smooth',block:'start'})};
})();
setSubtitle(T[lang].greet);
