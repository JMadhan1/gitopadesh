
/* ================= Krishna's voice: neural speech, temple-hall mastering, bansuri + tanpura ================= */
let ttsCfg=false,AC=null,bus=null,verb=null,ambBus=null,vtoken=0,curSrc=null,ambOn=store.get('amb',true),amb=null;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

function impulse(sec,decay){const n=Math.floor(AC.sampleRate*sec),b=AC.createBuffer(2,n,AC.sampleRate);
 for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,decay)}return b}

function audioInit(){
 if(AC){if(AC.state==='suspended')AC.resume();return}
 const C=window.AudioContext||window.webkitAudioContext;if(!C)return;AC=new C();
 const warm=AC.createBiquadFilter();warm.type='lowshelf';warm.frequency.value=240;warm.gain.value=5;       // chest and warmth
 const body=AC.createBiquadFilter();body.type='peaking';body.frequency.value=150;body.gain.value=3;body.Q.value=.9;
 const air=AC.createBiquadFilter();air.type='highshelf';air.frequency.value=6500;air.gain.value=-4;          // soften the digital edge
 const comp=AC.createDynamicsCompressor();comp.threshold.value=-24;comp.ratio.value=3;
 verb=AC.createConvolver();verb.buffer=impulse(3.2,2.4);                                                       // a stone temple hall
 const wet=AC.createGain();wet.gain.value=.3;
 bus=AC.createGain();ambBus=AC.createGain();ambBus.gain.value=0;
 bus.connect(warm);warm.connect(body);body.connect(air);air.connect(comp);comp.connect(AC.destination);
 air.connect(verb);ambBus.connect(verb);verb.connect(wet);wet.connect(comp);ambBus.connect(comp);
}

/* bansuri flute (Bhoopali scale) over a tanpura drone, synthesized live */
function fluteNote(f,at,dur){
 const o=AC.createOscillator(),o2=AC.createOscillator(),vib=AC.createOscillator(),vg=AC.createGain(),g=AC.createGain(),g2=AC.createGain();
 o.type='sine';o2.type='sine';o.frequency.setValueAtTime(f*.985,at);o.frequency.exponentialRampToValueAtTime(f,at+.12);o2.frequency.value=f*2;
 vib.frequency.value=5.2;vg.gain.value=f*.006;vib.connect(vg);vg.connect(o.frequency);vg.connect(o2.frequency);
 g2.gain.value=.12;o2.connect(g2);g2.connect(g);o.connect(g);
 g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(.5,at+.14);g.gain.setValueAtTime(.5,at+dur*.7);g.gain.linearRampToValueAtTime(0,at+dur);
 const len=Math.floor(AC.sampleRate*dur),nb=AC.createBuffer(1,len,AC.sampleRate),d=nb.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
 const ns=AC.createBufferSource();ns.buffer=nb;const bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=f*2.5;bp.Q.value=2;
 const ng=AC.createGain();ng.gain.setValueAtTime(0,at);ng.gain.linearRampToValueAtTime(.05,at+.1);ng.gain.linearRampToValueAtTime(0,at+dur);
 ns.connect(bp);bp.connect(ng);ng.connect(g);g.connect(ambBus);
 [o,o2,vib].forEach(x=>{x.start(at);x.stop(at+dur+.1)});ns.start(at);
}
function ambStart(){
 if(!AC||!ambOn||amb)return;const t=AC.currentTime,nodes=[];
 [[130.81,.55],[196,.4],[261.63,.35],[65.41,.45]].forEach(([f,a],i)=>{
  const o=AC.createOscillator(),g=AC.createGain(),l=AC.createOscillator(),lg=AC.createGain();
  o.type='triangle';o.frequency.value=f;g.gain.value=a*.5;l.frequency.value=.12+i*.05;lg.gain.value=a*.25;
  l.connect(lg);lg.connect(g.gain);o.connect(g);g.connect(ambBus);o.start(t);l.start(t);nodes.push(o,l)});
 ambBus.gain.cancelScheduledValues(t);ambBus.gain.setTargetAtTime(.11,t,1.6);
 const scale=[523.25,587.33,659.25,783.99,880,1046.5];let idx=2;
 const phrase=()=>{if(!amb)return;let at=AC.currentTime+.2;const n=3+Math.floor(Math.random()*3);
  for(let i=0;i<n;i++){idx=Math.max(0,Math.min(scale.length-1,idx+Math.floor(Math.random()*5)-2));const d=.9+Math.random()*1.3;fluteNote(scale[idx],at,d);at+=d*.95}};
 amb={nodes,timer:setInterval(phrase,5200)};phrase();
}
function ambStop(){
 if(!amb)return;const a=amb;amb=null;clearInterval(a.timer);
 if(AC){ambBus.gain.cancelScheduledValues(AC.currentTime);ambBus.gain.setTargetAtTime(0,AC.currentTime,.7)}
 setTimeout(()=>a.nodes.forEach(n=>{try{n.stop()}catch{}}),3200);
}

const setFluteBtn=()=>$('#fluteBtn').textContent='🪈 Flute: '+(ambOn?'on':'off');
$('#fluteBtn').onclick=()=>{ambOn=!ambOn;store.set('amb',ambOn);setFluteBtn();if(!ambOn)ambStop();else if(AC&&document.body.dataset.state==='speaking')ambStart()};setFluteBtn();
