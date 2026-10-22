
/* ================= Sanskrit pronunciation, shloka recitation, and "Teach me this shloka" ================= */
ORDER.LEARN=['BHAVAM','WORDS','MEANING','STORY','TODAY','REMEMBER'];
const LEARN_H={
 en:{BHAVAM:'The bhava, its inner feeling',WORDS:'Key words',MEANING:'The meaning',STORY:'From the Mahabharata',TODAY:'In your life today',REMEMBER:'Carry this with you'},
 hi:{BHAVAM:'भाव',WORDS:'मुख्य शब्द',MEANING:'अर्थ',STORY:'महाभारत से',TODAY:'आज के जीवन में',REMEMBER:'इसे याद रखो'},
 te:{BHAVAM:'భావం',WORDS:'ముఖ్య పదాలు',MEANING:'అర్థం',STORY:'మహాభారతం నుండి',TODAY:'నేటి జీవితంలో',REMEMBER:'దీన్ని గుర్తుంచుకో'}};

/* The voice reads plain spelling best. Map scholarly transliteration to how the word is actually said. */
const SK_MAP=[
 [/Bhagavad[\s-]*G[iī]t[aā]/gi,'Bhagavad Geeta'],[/G[iī]t[aā]/g,'Geeta'],[/K[ṛr][ṣs]ṇa/g,'Krishna'],[/Kuruk[ṣs]etra/g,'Kurukshetra'],
 [/P[āa]rtha/g,'Partha'],[/Bh[āa]rata/g,'Bharata'],[/P[āa][ñn]cajanya/g,'Panchajanya'],[/ni[ṣs]k[āa]ma/gi,'nishkama'],
 [/sthitapraj[ñn]a/gi,'sthita-pragya'],[/M[āa]dhava/g,'Madhava'],[/Dh[ṛr]tar[āa][ṣs][ṭt]ra/g,'Dhritarashtra'],[/Sa[ñn]jaya/g,'Sanjay'],
 [/Yudhi[ṣs][ṭt]hira/g,'Yudhishthira'],[/Bh[īi][ṣs]ma/g,'Bheeshma'],[/Dro[ṇn]a/g,'Drona'],[/Kar[ṇn]a/g,'Karna'],[/Draupad[īi]/g,'Draupadi'],
 [/Vy[āa]sa/g,'Vyasa'],[/Upani[ṣs]ad/gi,'Upanishad'],[/\bGovinda\b/g,'Govinda'],[/\bOm\b|\bAum\b/g,'Om']];
const SK_CH={'ā':'a','Ā':'A','ī':'ee','Ī':'Ee','ū':'oo','Ū':'Oo','ṛ':'ri','Ṛ':'Ri','ṝ':'ree','ṣ':'sh','Ṣ':'Sh','ś':'sh','Ś':'Sh','ṇ':'n','Ṇ':'N','ṭ':'t','Ṭ':'T','ḍ':'d','Ḍ':'D','ṅ':'ng','ñ':'ny','Ñ':'Ny','ṁ':'m','ṃ':'m','ḥ':'h','ḷ':'l'};
function sanskritSpeech(t){let s=String(t);for(const[re,r]of SK_MAP)s=s.replace(re,r);
 return s.replace(/jñ/g,'gy').replace(/[āĀīĪūŪṛṚṝṣṢśŚṇṆṭṬḍḌṅñÑṁṃḥḷ]/g,c=>SK_CH[c]||c)}

/* Chant the shloka itself: Devanagari read line by line by the Hindi voice, slowly, with the hall's resonance. */
function reciteShloka(v){
 const lines=clean(v).split(/[।॥|]+/).map(s=>s.trim()).filter(Boolean);if(!lines.length)return;
 const sp=startSpeaker('hi','chant');sp.say(lines.map(l=>l+' ।'));sp.end();toast('Reciting the shloka… ॐ');
}

/* The lesson: bhava, key words, meaning, a Mahabharata episode, and today's life. Cached on this device. */
const TCK='gp_teach_v1:';
function openTeach(vid){
 const v=byId[vid];if(!v)return;stopSpeak();
 const key=TCK+vid+':'+lang,H=LEARN_H[lang]||LEARN_H.en;let sec=null;
 $('#box').innerHTML=`<button class="x" id="xBtn" aria-label="Close">×</button><span class="cite">Bhagavad Gītā ${vid}</span><div class="shloka">${esc(clean(v))}</div><div class="translit">${esc(v.transliteration)}</div>
 <div class="actions"><button class="pill" id="tRecite" type="button">🕉 Recite shloka</button><button class="pill" id="tListen" type="button">🔊 Listen to the lesson</button><button class="pill" id="tCard" type="button">🖼 Shloka card</button></div>
 <div class="kr" id="tBody"><div class="who">॥ श्रीभगवानुवाच ॥</div><div class="body"><div class="dots"><span></span><span></span><span></span></div></div></div>`;
 $('#modal').classList.add('show');
 $('#xBtn').onclick=()=>{stopSpeak();closeM()};
 $('#tRecite').onclick=()=>reciteShloka(v);$('#tCard').onclick=()=>openVerse(vid,true);
 $('#tListen').onclick=()=>{if(!sec||!Object.keys(sec).length){toast('The lesson is still being prepared');return}const sp=startSpeaker();sp.feed({mode:'LEARN',sec},true);sp.end()};
 const draw=final=>{const body=document.querySelector('#tBody .body');if(!body)return;
  body.innerHTML=ORDER.LEARN.filter(k=>sec&&sec[k]).map(k=>`<div class="step"><b>${H[k]}</b><p>${esc(sec[k])}</p></div>`).join('')||'<div class="dots"><span></span><span></span><span></span></div>';
  if(!final){const ps=body.querySelectorAll('p');if(ps.length)ps[ps.length-1].classList.add('caret')}};
 const cached=store.get(key,null);if(cached){sec=cached;draw(true);return}
 const offline=()=>{sec={BHAVAM:v.translation.trim(),WORDS:(v.word_meanings||'').split(';').slice(0,5).map(s=>s.trim().replace(/—/g,' - ')).filter(Boolean).join('\n'),MEANING:v.translation.trim()};draw(true)};
 if(!hasLLM){offline();return}
 (async()=>{
  try{
   const res=await fetch('/api/teach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:vid,lang})});
   if(!res.ok||!res.body)throw new Error('http '+res.status);
   const rd=res.body.getReader(),dec=new TextDecoder();let buf='';
   while(true){const{done,value}=await rd.read();if(done)break;buf+=dec.decode(value,{stream:true});
    if(buf.includes('\0ERR'))throw new Error('teach');sec=parseStream(buf).sec;draw(false)}
   sec=parseStream(buf).sec;if(!sec.MEANING)throw new Error('format');
   draw(true);store.set(key,sec);
  }catch(e){toast(/429/.test(e.message)?'Krishna rests a moment. Please try again in a minute.':'The full lesson is unavailable right now. Showing the meaning.');offline()}
 })();
}
