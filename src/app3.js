
/* ================= Krishna's voice: neural speech, temple-hall mastering, bansuri + tanpura ================= */
let warmN=null,bodyN=null,wetN=null,vstyle=store.get('vstyle','calm');
const STYLE_FX={calm:{warm:5,body:3,wet:.3,rate:1},natural:{warm:0,body:0,wet:.06,rate:1},deep:{warm:7,body:4.5,wet:.3,rate:.97},device:{warm:0,body:0,wet:.3,rate:1},chant:{warm:6,body:3,wet:.4,rate:1}};
let ttsCfg=false,AC=null,bus=null,verb=null,ambBus=null,vtoken=0,curSrc=null,ambOn=store.get('amb',!MOBILE),amb=null;
const liveSrcs=[];
/* Real flute recordings: any audio files placed in public/audio/flute are listed in tracks.json by the build.
   They play quietly under Krishna's voice and rotate; the synthesized flute below is only a fallback. */
const MUSIC_LEVEL=.075;        // music under the voice (the voice is at full level, so it stays clear)
const MUSIC_LEVEL_MOBILE=.06;
let mTracks=null,mLast=-1,music=null,musicBus=null;
async function musicList(){
 if(mTracks)return mTracks;
 try{const r=await fetch('/audio/flute/tracks.json');const j=r.ok?await r.json():{};mTracks=(j.tracks||[]).filter(t=>t&&t.file)}catch{mTracks=[]}
 const cr=mTracks.map(t=>t.credit).filter(Boolean);const el=document.getElementById('musicCredit');
 if(el&&cr.length){el.textContent='♪ '+[...new Set(cr)].join(' · ');el.hidden=false}
 return mTracks;
}
function musicStart(){
 if(!AC||!ambOn||music||!mTracks||!mTracks.length)return false;
 let k;do{k=Math.floor(Math.random()*mTracks.length)}while(mTracks.length>1&&k===mLast);mLast=k;
 const el=new Audio();el.preload='auto';el.src='/audio/flute/'+encodeURIComponent(mTracks[k].file);
 const g=AC.createGain();g.gain.value=0;
 try{AC.createMediaElementSource(el).connect(g);g.connect(musicBus)}catch{return false}
 const m={el,g};music=m;
 el.onended=()=>{if(music===m){music=null;musicStart()}};      // next track, chosen at random
 el.onerror=()=>{if(music===m){music=null}};
 el.play().then(()=>{g.gain.setTargetAtTime(MOBILE?MUSIC_LEVEL_MOBILE:MUSIC_LEVEL,AC.currentTime,1.2)}).catch(()=>{music=null});
 return true;
}
function musicStop(){
 if(!music)return;const m=music;music=null;
 try{m.g.gain.cancelScheduledValues(AC.currentTime);m.g.gain.setTargetAtTime(0,AC.currentTime,.5)}catch{}
 setTimeout(()=>{try{m.el.pause();m.el.src=''}catch{}},2600);
}
musicList();
function stopAllSrcs(){for(const s of liveSrcs.splice(0)){try{s.stop()}catch{}}}
let noiseBuf=null;
const noise=()=>noiseBuf||(noiseBuf=(()=>{const n=AC.sampleRate*2,b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;return b})());
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

function impulse(sec,decay){const n=Math.floor(AC.sampleRate*sec),b=AC.createBuffer(2,n,AC.sampleRate);
 for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,decay)}return b}

function applyStyleFX(st){const f=STYLE_FX[st||vstyle]||STYLE_FX.calm;if(!warmN)return;warmN.gain.value=f.warm;bodyN.gain.value=f.body;wetN.gain.value=f.wet}
function audioInit(){
 if(AC){if(AC.state==='suspended'||AC.state==='interrupted')AC.resume();return}
 const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
 try{AC=new C({latencyHint:'playback'})}catch{AC=new C()}      // a larger buffer: no crackle on phones
 AC.onstatechange=()=>{if(AC&&(AC.state==='suspended'||AC.state==='interrupted')&&!document.hidden)AC.resume().catch(()=>{})};
 const warm=AC.createBiquadFilter();warm.type='lowshelf';warm.frequency.value=240;warm.gain.value=5;       // chest and warmth
 const body=AC.createBiquadFilter();body.type='peaking';body.frequency.value=150;body.gain.value=3;body.Q.value=.9;
 const air=AC.createBiquadFilter();air.type='highshelf';air.frequency.value=6500;air.gain.value=-4;          // soften the digital edge
 const comp=AC.createDynamicsCompressor();comp.threshold.value=-24;comp.ratio.value=3;
 if(!MOBILE){verb=AC.createConvolver();verb.buffer=impulse(2.6,2.4)}                                         // a stone temple hall (desktop only; phones skip the heavy reverb)
 const wet=AC.createGain();wet.gain.value=.3;warmN=warm;bodyN=body;wetN=wet;applyStyleFX();
 bus=AC.createGain();ambBus=AC.createGain();ambBus.gain.value=0;musicBus=AC.createGain();
 bus.connect(warm);warm.connect(body);body.connect(air);air.connect(comp);comp.connect(AC.destination);
 if(verb){air.connect(verb);ambBus.connect(verb);verb.connect(wet);wet.connect(comp)}
 ambBus.connect(comp);musicBus.connect(comp);   // music skips the voice EQ and reverb
}

/* bansuri flute (Bhoopali scale) over a tanpura drone, synthesized live */
function fluteNote(f,at,dur){
 const o=AC.createOscillator(),o2=AC.createOscillator(),vib=AC.createOscillator(),vg=AC.createGain(),g=AC.createGain(),g2=AC.createGain();
 o.type='sine';o2.type='sine';o.frequency.setValueAtTime(f*.985,at);o.frequency.exponentialRampToValueAtTime(f,at+.12);o2.frequency.value=f*2;
 vib.frequency.value=5.2;vg.gain.value=f*.006;vib.connect(vg);vg.connect(o.frequency);vg.connect(o2.frequency);
 g2.gain.value=.12;o2.connect(g2);g2.connect(g);o.connect(g);
 g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(.5,at+.14);g.gain.setValueAtTime(.5,at+dur*.7);g.gain.linearRampToValueAtTime(0,at+dur);
 const ns=AC.createBufferSource();ns.buffer=noise();ns.loop=true;const bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=f*2.5;bp.Q.value=2;
 const ng=AC.createGain();ng.gain.setValueAtTime(0,at);ng.gain.linearRampToValueAtTime(.05,at+.1);ng.gain.linearRampToValueAtTime(0,at+dur);
 ns.connect(bp);bp.connect(ng);ng.connect(g);g.connect(ambBus);
 [o,o2,vib].forEach(x=>{x.start(at);x.stop(at+dur+.1)});ns.start(at,Math.random()*1.5);ns.stop(at+dur+.05);
}
function ambStart(){
 if(!AC||!ambOn)return;
 if(mTracks&&mTracks.length){musicStart();return}      // real recordings available: no synthesized flute
 if(amb)return;const t=AC.currentTime,nodes=[];
 [[130.81,.55],[196,.4],[261.63,.35],[65.41,.45]].slice(0,MOBILE?2:4).forEach(([f,a],i)=>{
  const o=AC.createOscillator(),g=AC.createGain(),l=AC.createOscillator(),lg=AC.createGain();
  o.type='triangle';o.frequency.value=f;g.gain.value=a*.5;l.frequency.value=.12+i*.05;lg.gain.value=a*.25;
  l.connect(lg);lg.connect(g.gain);o.connect(g);g.connect(ambBus);o.start(t);l.start(t);nodes.push(o,l)});
 ambBus.gain.cancelScheduledValues(t);ambBus.gain.setTargetAtTime(MOBILE?.025:.04,t,1.6);
 const scale=[523.25,587.33,659.25,783.99,880,1046.5];let idx=2;
 const phrase=()=>{if(!amb)return;let at=AC.currentTime+.2;const n=3+Math.floor(Math.random()*3);
  for(let i=0;i<n;i++){idx=Math.max(0,Math.min(scale.length-1,idx+Math.floor(Math.random()*5)-2));const d=.9+Math.random()*1.3;fluteNote(scale[idx],at,d);at+=d*.95}};
 amb={nodes,timer:setInterval(phrase,5200)};phrase();
}
function ambStop(){
 musicStop();
 if(!amb)return;const a=amb;amb=null;clearInterval(a.timer);
 if(AC){ambBus.gain.cancelScheduledValues(AC.currentTime);ambBus.gain.setTargetAtTime(0,AC.currentTime,.7)}
 setTimeout(()=>a.nodes.forEach(n=>{try{n.stop()}catch{}}),3200);
}

const setFluteBtn=()=>$('#fluteBtn').textContent='🪈 '+SL().flute+': '+(ambOn?SL().on:SL().off);
$('#fluteBtn').onclick=()=>{ambOn=!ambOn;store.set('amb',ambOn);setFluteBtn();if(!ambOn)ambStop();else if(AC&&document.body.dataset.state==='speaking')ambStart()};setFluteBtn();

document.addEventListener('visibilitychange',()=>{if(!document.hidden&&AC&&(AC.state==='suspended'||AC.state==='interrupted'))AC.resume().catch(()=>{})});
