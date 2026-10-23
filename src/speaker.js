/* ---- speech: starts on the FIRST finished sentence while the rest is still being written.
        Audio is scheduled on the audio clock, so playback stays gapless even when the phone's main thread is busy. ---- */
const TERM=/(?<=[.!?।॥])\s+/;
function sentencesOf(t){return String(t).replace(/[#*_]/g,'').split(/(?<=[.!?।॥])\s+|[\r\n]+/).map(s=>s.trim()).filter(Boolean)}
function speechParts(text){
 const raw=String(text).replace(/[#*_]/g,'').split(/(?<=[.!?।॥])\s+|\n+/).map(s=>s.trim()).filter(Boolean),out=[];
 for(const s of raw){if(out.length&&out[out.length-1].length<26)out[out.length-1]+=' '+s;else out.push(s)}
 return out.flatMap(s=>s.length<=500?[s]:s.match(/.{1,480}(?:\s|$)/g).map(x=>x.trim()));
}
let ttsFails=0,ttsCool=0;   // after 3 failures in a row the device voice is used for 5 minutes
function startSpeaker(langOv,styleOv){
 const L=langOv||lang,S=styleOv||vstyle;
 audioInit();stopSpeak();ambStart();applyStyleFX(S);
 const my=++vtoken,items=[],count={};
 let pro=!!(AC&&ttsCfg&&ttsCfg[L])&&S!=='device'&&Date.now()>=ttsCool,ended=false,running=false,cancelled=false,nextAt=0;
 const rate=(STYLE_FX[S]||STYLE_FX.calm).rate;
 const once=s=>{const ac=new AbortController(),t=setTimeout(()=>ac.abort(),12000);
  return fetch('/api/speak',{signal:ac.signal,method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:sanskritSpeech(s),lang:L,style:S==='device'?'calm':S})})
   .then(r=>r.ok?r.arrayBuffer():Promise.reject(new Error('tts '+r.status))).then(b=>AC.decodeAudioData(b)).finally(()=>clearTimeout(t))};
 const load=s=>once(s).catch(()=>sleep(400).then(()=>once(s))).then(b=>{ttsFails=0;return b},()=>{if(++ttsFails>=3)ttsCool=Date.now()+300000;return null});
 const finish=()=>{if(my===vtoken){setState('idle');ambStop();if(convo&&speakOn)setTimeout(()=>{if(!busy&&!rec&&my===vtoken&&document.body.dataset.state==='idle')startListening()},700)}};
 // browser voice path (also the graceful fallback)
 const vo=pickVoice(L);
 const browserSay=t=>new Promise(done=>{if(!('speechSynthesis'in window))return done();const u=new SpeechSynthesisUtterance(sanskritSpeech(t));u.lang=LOCALE[L];if(vo)u.voice=vo;
  u.rate=.82;u.pitch=vo&&/natural|online/i.test(vo.name)?.9:.7;
  u.onstart=()=>{if(my===vtoken){setSubtitle(t);setState('speaking')}};
  u.onend=()=>{done();if(!pro&&ended&&my===vtoken&&!speechSynthesis.pending)setTimeout(()=>{if(!speechSynthesis.speaking)finish()},200)};
  u.onerror=()=>done();setTimeout(done,Math.max(4000,t.length*130));   // never hang the queue
  speechSynthesis.speak(u)});
 const idleWait=()=>sleep(Math.max(0,(nextAt-(AC?AC.currentTime:0))*1000)+60);   // let already-scheduled audio finish
 function schedule(it,buf){
  const now=AC.currentTime,at=Math.max(nextAt,now+.05);
  const src=AC.createBufferSource();src.buffer=buf;src.playbackRate.value=rate;src.connect(bus);
  liveSrcs.push(src);src.onended=()=>{const k=liveSrcs.indexOf(src);if(k>=0)liveSrcs.splice(k,1)};
  src.start(at);nextAt=at+buf.duration/rate+.18;      // a natural breath between lines, set on the audio clock
  setTimeout(()=>{if(my===vtoken&&!cancelled){setSubtitle(it.t);setState('speaking')}},Math.max(0,(at-now)*1000));
 }
 async function loop(){
  if(running)return;running=true;let i=0;
  while(true){
   if(my!==vtoken||cancelled)return;
   if(i>=items.length){if(ended){await idleWait();finish();return}await sleep(60);continue}
   const it=items[i++],buf=await it.p;
   if(my!==vtoken||cancelled)return;
   if(!buf){   // this chunk only: wait for audio already queued, speak it with the device voice, then resume the deep voice
    await idleWait();if(my!==vtoken||cancelled)return;
    setSubtitle(it.t);setState('speaking');await browserSay(it.t);if(my!==vtoken||cancelled)return;nextAt=AC.currentTime;continue}
   schedule(it,buf);
  }
 }
 // fewer, larger requests: the first sentence goes out at once for a fast start, the rest travel in groups
 let acc='',first=true,accT=null;
 const flush=()=>{clearTimeout(accT);if(!acc)return;const t=acc;acc='';items.push({t,p:load(t)});loop()};
 const push=t=>{
  if(!pro){browserSay(t);return}
  if(first){first=false;items.push({t,p:load(t)});loop();return}
  if(acc&&(acc+' '+t).length>460)flush();
  acc=acc?acc+' '+t:t;
  if(acc.length>=130)flush();else{clearTimeout(accT);accT=setTimeout(flush,1100)}
 };
 return {
  feed(p,final){
   const order=ORDER[p.mode]||[];
   order.forEach((k,idx)=>{const sec=p.sec[k];if(sec===undefined)return;
    const complete=final||order.slice(idx+1).some(n=>p.sec[n]!==undefined);
    const ss=sentencesOf(sec),lim=complete?ss.length:ss.length-1,from=count[k]||0;
    for(let j=from;j<lim;j++)push(ss[j]);
    if(lim>from)count[k]=lim});
  },
  say(list){list.forEach(push)},
  end(){flush();ended=true;if(!pro&&!items.length&&!(window.speechSynthesis&&(speechSynthesis.speaking||speechSynthesis.pending)))finish();if(pro&&!items.length)finish();else if(pro)loop()},
  cancel(){cancelled=true;clearTimeout(accT);stopSpeak()}
 };
}
function speak(text){const sp=startSpeaker();sp.say(speechParts(text));sp.end()}   // used by the Listen button
