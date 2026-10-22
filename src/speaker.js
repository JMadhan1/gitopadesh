/* ---- speech: starts on the FIRST finished sentence while the rest is still being written ---- */
const TERM=/(?<=[.!?।॥])\s+/;
function sentencesOf(t){return String(t).replace(/[#*_]/g,'').split(TERM).map(s=>s.trim()).filter(Boolean)}
function speechParts(text){
 const raw=String(text).replace(/[#*_]/g,'').split(/(?<=[.!?।॥])\s+|\n+/).map(s=>s.trim()).filter(Boolean),out=[];
 for(const s of raw){if(out.length&&out[out.length-1].length<26)out[out.length-1]+=' '+s;else out.push(s)}
 return out.flatMap(s=>s.length<=500?[s]:s.match(/.{1,480}(?:\s|$)/g).map(x=>x.trim()));
}
function startSpeaker(){
 audioInit();stopSpeak();ambStart();
 const my=++vtoken,items=[],count={};
 let pro=!!(AC&&ttsCfg&&ttsCfg[lang]),ended=false,running=false,cancelled=false;
 const rate=.97;   // a hair slower and lower for gravity
 const once=s=>fetch('/api/speak',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:s,lang})})
  .then(r=>r.ok?r.arrayBuffer():Promise.reject(new Error('tts '+r.status))).then(b=>AC.decodeAudioData(b));
 const load=s=>once(s).catch(()=>sleep(500).then(()=>once(s))).catch(()=>null);
 const finish=()=>{if(my===vtoken){setState('idle');ambStop();if(convo&&speakOn)setTimeout(()=>{if(!busy&&!rec&&my===vtoken&&document.body.dataset.state==='idle')startListening()},700)}};
 // browser voice path (also the graceful fallback)
 const vo=pickVoice();
 const browserSay=t=>new Promise(done=>{if(!('speechSynthesis'in window))return done();const u=new SpeechSynthesisUtterance(t);u.lang=LOCALE[lang];if(vo)u.voice=vo;
  u.rate=.82;u.pitch=vo&&/natural|online/i.test(vo.name)?.9:.7;
  u.onstart=()=>{if(my===vtoken){setSubtitle(t);setState('speaking')}};
  u.onend=()=>{done();if(!pro&&ended&&my===vtoken&&!speechSynthesis.pending)setTimeout(()=>{if(!speechSynthesis.speaking)finish()},200)};
  u.onerror=()=>done();setTimeout(done,Math.max(4000,t.length*130));   // never hang the queue
  speechSynthesis.speak(u)});
 async function loop(){
  if(running)return;running=true;let i=0;
  while(true){
   if(my!==vtoken||cancelled)return;
   if(i>=items.length){if(ended){finish();return}await sleep(70);continue}
   const it=items[i++],buf=await it.p;
   if(my!==vtoken||cancelled)return;
   if(!buf){setSubtitle(it.t);setState('speaking');await browserSay(it.t);if(my!==vtoken||cancelled)return;continue}   // this sentence only: the deep voice resumes on the next one
   setSubtitle(it.t);setState('speaking');
   await new Promise(res=>{const src=AC.createBufferSource();src.buffer=buf;src.playbackRate.value=rate;src.connect(bus);curSrc=src;src.onended=res;src.start()});
   if(my!==vtoken||cancelled)return;await sleep(240);
  }
 }
 const push=t=>{if(!pro){browserSay(t);return}items.push({t,p:load(t)});loop()};
 return {
  feed(p,final){
   const order=ORDER[p.mode]||[];
   order.forEach((k,idx)=>{const sec=p.sec[k];if(sec===undefined)return;
    const complete=final||order.slice(idx+1).some(n=>p.sec[n]!==undefined);
    const ss=sentencesOf(sec),lim=complete?ss.length:ss.length-1,from=count[k]||0;
    for(let j=from;j<lim;j++)push(ss[j]);
    if(lim>from)count[k]=lim});
  },
  end(){ended=true;if(!pro&&!items.length&&!(window.speechSynthesis&&(speechSynthesis.speaking||speechSynthesis.pending)))finish();if(pro&&!items.length)finish();else if(pro)loop()},
  cancel(){cancelled=true;stopSpeak()}
 };
}
function speak(text){const sp=startSpeaker();speechParts(text).forEach(t=>sp.feed({mode:'TALK',sec:{SAY:t}},true));sp.end()}   // used by the Listen button
