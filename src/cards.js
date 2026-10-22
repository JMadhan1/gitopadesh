
/* ================= Shloka cards: any language, a short meaning, the site link at the bottom ================= */
const SITE_HOST='gitopadesh.jmadhan.me';
const CARD_T=[{a:'#0a0820',b:'#2a1b6e',g:'#f5c76a',t:'#f3eee0',m:'#b9bfe0'},{a:'#7a2e0a',b:'#f08a24',g:'#fff1c2',t:'#fffaf0',m:'#ffe3b8'},{a:'#fdf0f3',b:'#f6c1d1',g:'#8a2a4d',t:'#3a1020',m:'#7a4a5a'}];
const CARD_L={
 en:{meaning:'MEANING',ref:(c,v)=>`Bhagavad Gita · Chapter ${c}, Verse ${v}`,om:'ॐ',tag:'Ask Krishna · Bhagavad Gita guidance'},
 hi:{meaning:'अर्थ',ref:(c,v)=>`श्रीमद्भगवद्गीता · अध्याय ${c}, श्लोक ${v}`,om:'ॐ',tag:'कृष्ण से पूछिए · भगवद्गीता मार्गदर्शन'},
 te:{meaning:'అర్థం',ref:(c,v)=>`భగవద్గీత · అధ్యాయం ${c}, శ్లోకం ${v}`,om:'ఓం',tag:'కృష్ణుడిని అడగండి · భగవద్గీత మార్గదర్శనం'}};
const LANG_LABEL={en:'English',hi:'हिंदी',te:'తెలుగు'};
let cardLang=null;

function trFor(v,L){if(L==='en')return v.translation_en||v.translation;const e=VT[L]&&VT[L][id(v)];return (e&&e.t)||v.translation_en||v.translation}
function shlokaFor(v,L){const s=v.sanskrit.replace(/\s*[।॥]*\s*\d+\.\d+\s*[।॥]*\s*$/,'');return L==='te'?toTelugu(s):s}
function shortMeaning(t,max=190){
 t=String(t).replace(/\s+/g,' ').trim();if(t.length<=max)return t;
 let out='';for(const s of t.split(/(?<=[.!?।])\s+/)){const n=(out+' '+s).trim();if(n.length>max)break;out=n}
 if(out)return out;const c=t.slice(0,max);return c.replace(/[,;:\-—]?\s+\S*$/,'')+'…';
}
function rrect(x,X,y,w,h,r){x.beginPath();x.moveTo(X+r,y);x.arcTo(X+w,y,X+w,y+h,r);x.arcTo(X+w,y+h,X,y+h,r);x.arcTo(X,y+h,X,y,r);x.arcTo(X,y,X+w,y,r);x.closePath()}

async function paintCard(cv,v,L,themeIdx){
 if(!cv||!v)return;
 await loadVT(L);
 try{await Promise.all([document.fonts.load('400 40px "Tiro Devanagari Sanskrit"'),document.fonts.load('400 40px "Noto Serif Telugu"'),document.fonts.load('italic 500 30px "Newsreader"'),document.fonts.load('700 30px "Hanken Grotesk"'),document.fonts.load('400 30px "Yatra One"')])}catch{}
 const x=cv.getContext('2d'),T=CARD_T[themeIdx]||CARD_T[0],W=1080,Lb=CARD_L[L]||CARD_L.en;
 const g=x.createLinearGradient(0,0,W,W);g.addColorStop(0,T.a);g.addColorStop(1,T.b);x.fillStyle=g;x.fillRect(0,0,W,W);
 x.strokeStyle=T.g;x.globalAlpha=.14;x.lineWidth=2;for(let r=60;r<780;r+=48){x.beginPath();x.arc(W/2,W/2,r,0,7);x.stroke()}
 for(let k=0;k<16;k++){x.save();x.translate(W/2,W/2);x.rotate(k*Math.PI/8);x.beginPath();x.ellipse(0,-310,36,124,0,0,7);x.stroke();x.restore()}
 x.globalAlpha=1;x.strokeStyle=T.g;x.lineWidth=3;x.strokeRect(36,36,W-72,W-72);x.lineWidth=1;x.strokeRect(50,50,W-100,W-100);
 x.textAlign='center';x.textBaseline='alphabetic';
 // OM
 x.fillStyle=T.g;x.font='400 66px "Tiro Devanagari Sanskrit","Noto Serif Telugu",serif';x.fillText(Lb.om,W/2,150);
 // shloka: break at the danda, shrink to fit
 const sk=shlokaFor(v,L),parts=sk.split(/(?<=[।॥])\s*/).map(s=>s.trim()).filter(Boolean);
 let fs=46,lines,lh;
 for(;fs>=26;fs-=2){x.font=`400 ${fs}px "Tiro Devanagari Sanskrit","Noto Serif Telugu",serif`;lines=parts.flatMap(p=>wrap(x,p,W-220));lh=fs*1.62;if(lines.length*lh<=300)break}
 x.fillStyle=T.g;let y=232;lines.forEach(l=>{x.fillText(l,W/2,y);y+=lh});
 y+=6;x.globalAlpha=.8;x.fillRect(W/2-60,y,120,3);x.globalAlpha=1;
 // short meaning, in the card language
 y+=50;x.fillStyle=T.m;x.font=L==='en'?'600 22px "Hanken Grotesk",sans-serif':'500 28px "Tiro Devanagari Sanskrit","Noto Serif Telugu",serif';
 if('letterSpacing'in x)x.letterSpacing=L==='en'?'4px':'0px';x.fillText(Lb.meaning,W/2,y);if('letterSpacing'in x)x.letterSpacing='0px';
 y+=26;const limit=W-300,mean=shortMeaning(trFor(v,L));let mfs=38,ml;
 x.fillStyle=T.t;
 for(;mfs>=24;mfs-=2){x.font=`${L==='en'?'italic ':''}500 ${mfs}px "Newsreader","Tiro Devanagari Sanskrit","Noto Serif Telugu",serif`;ml=wrap(x,mean,W-220);if(y+ml.length*(mfs*1.5)<=limit)break}
 ml.forEach(l=>{y+=mfs*1.5;x.fillText(l,W/2,y)});
 // reference
 x.fillStyle=T.g;x.font='400 30px "Yatra One","Tiro Devanagari Sanskrit","Noto Serif Telugu",serif';x.fillText(Lb.ref(v.chapter,v.verse),W/2,W-218);
 // site link, on every card
 const pw=560,ph=70,px=(W-pw)/2,py=W-190;
 rrect(x,px,py,pw,ph,35);x.fillStyle='rgba(0,0,0,.22)';x.fill();x.strokeStyle=T.g;x.lineWidth=2;x.stroke();
 x.fillStyle=T.t;x.font='700 36px "Hanken Grotesk",sans-serif';x.fillText(SITE_HOST,W/2,py+47);
 x.fillStyle=T.m;x.font='500 22px "Hanken Grotesk","Tiro Devanagari Sanskrit","Noto Serif Telugu",sans-serif';x.fillText(Lb.tag,W/2,W-86);
}

/* the modal canvas */
async function drawCard(v){await paintCard($('#cv'),v,cardLang||lang,cardTheme)}
function cardDownload(cv,v,L,suffix){const a=document.createElement('a');a.download=`gitopadesh-${id(v)}-${L}${suffix||''}.png`;a.href=cv.toDataURL('image/png');a.click()}

const _openVerse=openVerse;
openVerse=function(i,focusCard){
 cardLang=lang;_openVerse(i,focusCard);
 const v=byId[i],cv=$('#cv');if(!v||!cv)return;
 const bar=document.createElement('div');bar.className='actions';bar.id='cardLangs';
 bar.innerHTML=Object.keys(LANG_LABEL).map(l=>`<button class="pill ${l===cardLang?'on':''}" type="button" data-cl="${l}">${LANG_LABEL[l]}</button>`).join('');
 cv.parentNode.insertBefore(bar,cv);
 bar.onclick=e=>{const b=e.target.closest('[data-cl]');if(!b)return;cardLang=b.dataset.cl;$$('#cardLangs .pill').forEach(x=>x.classList.toggle('on',x===b));drawCard(v)};
 const dl=$('#dl');if(dl)dl.onclick=()=>cardDownload(cv,v,cardLang||lang);
};

/* ================= Daily shloka ================= */
function dailyVerse(){
 const n=new Date(),day=Math.floor(Date.UTC(n.getFullYear(),n.getMonth(),n.getDate())/864e5);
 const pool=VERSES.filter(v=>(v.translation_en||v.translation).length<=240);
 return pool[(day*7919)%pool.length];
}
let dLang=null,dTheme=0;
async function renderDaily(){
 const cv=$('#dailyCv');if(!cv)return;
 const v=dailyVerse();dLang=dLang||lang;
 await paintCard(cv,v,dLang,dTheme);
 const n=new Date();
 $('#dailyCite').textContent=`${n.toLocaleDateString(dLang==='en'?'en-IN':dLang==='hi'?'hi-IN':'te-IN',{day:'numeric',month:'long',year:'numeric'})} · ${({en:'Bhagavad Gītā',hi:'भगवद्गीता',te:'భగవద్గీత'})[dLang]} ${id(v)}`;
 $('#dailyLangs').innerHTML=Object.keys(LANG_LABEL).map(l=>`<button class="pill ${l===dLang?'on':''}" type="button" data-dl="${l}">${LANG_LABEL[l]}</button>`).join('');
 $('#dailyDl').textContent=tx('⬇ Download card');$('#dailyOpen').textContent=tx('Open card');
}
if($('#dailyCv')){
 $('#dailyLangs').onclick=e=>{const b=e.target.closest('[data-dl]');if(!b)return;dLang=b.dataset.dl;renderDaily()};
 $('#dailyDl').onclick=()=>cardDownload($('#dailyCv'),dailyVerse(),dLang||lang,'-daily');
 $('#dailyOpen').onclick=()=>{cardLang=dLang||lang;openVerse(id(dailyVerse()),true)};
}

/* ================= Gentle reveal as sections scroll into view (never hides anything without JS) ================= */
(()=>{
 if(!('IntersectionObserver'in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.06,rootMargin:'0px 0px -4% 0px'});
 $$('main section.s, main .strip').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight*.92){el.classList.add('rv');io.observe(el)}});
})();
