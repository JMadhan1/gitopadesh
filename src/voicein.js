
/* ================= Voice in: hear everything, in any language, hands-free ================= */
const RE_DEV=/[ऀ-ॿ]/g,RE_TEL=/[ఀ-౿]/g;
function detectLang(t){const n=String(t).replace(/\s/g,'').length||1,d=(String(t).match(RE_DEV)||[]).length/n,e=(String(t).match(RE_TEL)||[]).length/n;return d>.3?'hi':e>.3?'te':null}
let convo=store.get('convo',false),sendTimer=null,silenceTimer=null,sttCfg=false,convoMiss=0;
const setConvoBtn=()=>$('#convoBtn').textContent='🎧 Conversation: '+(convo?'on':'off');
$('#convoBtn').onclick=()=>{convo=!convo;convoMiss=0;store.set('convo',convo);setConvoBtn();
 toast(convo?'Hands-free on: Krishna will listen again after he speaks':'Hands-free off');
 if(convo&&!busy&&!rec&&document.body.dataset.state==='idle')startListening()};setConvoBtn();

function scheduleSend(){clearTimeout(sendTimer);toast('Sending to Krishna… tap the box to edit');
 sendTimer=setTimeout(()=>{const t=$('#q').value.trim();if(t)ask(t)},1500)}
['input','focus'].forEach(ev=>$('#q').addEventListener(ev,()=>clearTimeout(sendTimer)));

function endListenUI(){$('#mic').classList.remove('rec');if(!busy&&document.body.dataset.state==='listening')setState('idle')}
const MIC_MSG={'not-allowed':'Allow the microphone so Krishna can hear you.','service-not-allowed':'Allow the microphone so Krishna can hear you.','no-speech':'I heard nothing. Tap the mic and speak again.','network':'The speech service is unreachable. Please type instead.','audio-capture':'No microphone was found.'};

function startListening(){
 audioInit();stopSpeak();clearTimeout(sendTimer);
 if(SR)return listenSR();
 if(sttCfg)return listenRec();
 toast('Voice input needs Chrome, Edge or Safari. You can still type.');
}

/* Browser speech recognition: live words, stops by itself after a pause */
function listenSR(){
 const r=new SR();r.lang=LOCALE[lang];r.interimResults=true;r.continuous=true;r.maxAlternatives=1;
 let final='',got=false,errored=false;const base=$('#q').value.trim()?$('#q').value.trim()+' ':'';
 const arm=()=>{clearTimeout(silenceTimer);silenceTimer=setTimeout(()=>{if(got)r.stop()},2200)};
 r.onresult=e=>{let t='';for(let i=0;i<e.results.length;i++)t+=e.results[i][0].transcript;got=!!t.trim();final=t;$('#q').value=base+t;autosize();arm()};
 r.onerror=e=>{errored=true;clearTimeout(silenceTimer);if(e.error!=='aborted'&&MIC_MSG[e.error])toast(MIC_MSG[e.error])};
 r.onend=()=>{clearTimeout(silenceTimer);rec=null;endListenUI();
  if(final.trim()&&!errored){convoMiss=0;scheduleSend()}
  else if(convo&&!errored&&!busy){if(++convoMiss>=2){convo=false;store.set('convo',false);setConvoBtn();toast('Hands-free paused. Tap the mic when ready.')}else setTimeout(startListening,600)}};
 rec=r;$('#mic').classList.add('rec');setState('listening');
 try{r.start()}catch{rec=null;endListenUI();return}
 toast('Listening… speak freely. I wait while you pause.');
 setTimeout(()=>{if(rec===r&&!got)r.stop()},9000);
}

/* Fallback for browsers without speech recognition: record, then Krishna's server transcribes (Azure) */
function wavBlob(chunks,inRate){
 let len=0;chunks.forEach(c=>len+=c.length);const all=new Float32Array(len);let o=0;chunks.forEach(c=>{all.set(c,o);o+=c.length});
 const ratio=inRate/16000,n=Math.floor(len/ratio),pcm=new Int16Array(n);
 for(let i=0;i<n;i++){const v=Math.max(-1,Math.min(1,all[Math.floor(i*ratio)]));pcm[i]=v<0?v*0x8000:v*0x7FFF}
 const buf=new ArrayBuffer(44+pcm.length*2),dv=new DataView(buf),w=(p,s)=>[...s].forEach((c,i)=>dv.setUint8(p+i,c.charCodeAt(0)));
 w(0,'RIFF');dv.setUint32(4,36+pcm.length*2,true);w(8,'WAVEfmt ');dv.setUint32(16,16,true);dv.setUint16(20,1,true);dv.setUint16(22,1,true);
 dv.setUint32(24,16000,true);dv.setUint32(28,32000,true);dv.setUint16(32,2,true);dv.setUint16(34,16,true);w(36,'data');dv.setUint32(40,pcm.length*2,true);
 new Int16Array(buf,44).set(pcm);return new Blob([buf],{type:'audio/wav'});
}
async function listenRec(){
 let stream;try{stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}})}catch{toast(MIC_MSG['not-allowed']);return}
 const C=window.AudioContext||window.webkitAudioContext,ctx=new C(),src=ctx.createMediaStreamSource(stream),proc=ctx.createScriptProcessor(4096,1,1),chunks=[];
 let voiced=false,lastVoice=performance.now(),t0=lastVoice,done=false;
 const finish=async()=>{
  if(done)return;done=true;rec=null;proc.disconnect();src.disconnect();stream.getTracks().forEach(t=>t.stop());endListenUI();
  if(!voiced){ctx.close();toast(MIC_MSG['no-speech']);return}
  setState('thinking');toast('Krishna is listening to what you said…');
  try{
   const blob=wavBlob(chunks,ctx.sampleRate);ctx.close();
   const r=await fetch('/api/transcribe?lang='+lang,{method:'POST',headers:{'Content-Type':'audio/wav'},body:blob});
   if(!r.ok)throw new Error('stt '+r.status);
   const j=await r.json();
   if(j.text){$('#q').value=($('#q').value.trim()+' '+j.text).trim();autosize();convoMiss=0;scheduleSend()}else{toast(MIC_MSG['no-speech'])}
  }catch(e){toast('I could not hear that clearly. Please try again or type.')}
  if(!busy)setState('idle');
 };
 proc.onaudioprocess=e=>{const d=e.inputBuffer.getChannelData(0);chunks.push(new Float32Array(d));
  let s=0;for(let i=0;i<d.length;i+=8)s+=d[i]*d[i];const rms=Math.sqrt(s/(d.length/8)),now=performance.now();
  if(rms>.015){voiced=true;lastVoice=now}
  if((voiced&&now-lastVoice>1800)||now-t0>45000||(!voiced&&now-t0>9000))finish()};
 src.connect(proc);proc.connect(ctx.destination);   // the processor writes no output, so nothing is played back
 rec={stop:finish};$('#mic').classList.add('rec');setState('listening');toast('Listening… speak freely. I wait while you pause.');
}

$('#mic').onclick=()=>{if(rec){rec.stop();return}startListening()};
