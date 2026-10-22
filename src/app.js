const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const id=v=>v.chapter+'.'+v.verse, byId=Object.fromEntries(VERSES.map(v=>[id(v),v]));
const clean=v=>{const s=v.sanskrit.replace(/\s*[।॥]*\s*\d+\.\d+\s*[।॥]*\s*$/,'');return lang==='te'?toTelugu(s):s};
const ss={get(k,d){try{return JSON.parse(sessionStorage.getItem(k))??d}catch{return d}},set(k,v){try{sessionStorage.setItem(k,JSON.stringify(v))}catch{}}};
let lang=store.get('lang','en'), saved=new Set(store.get('saved',[])), cardTheme=0, hasLLM=false, speakOn=store.get('speak',true), history=ss.get('ctx',[]), busy=false;
let i18nReady=false;

/* ---------- Starry sky ---------- */
(()=>{const c=$('#sky'),x=c.getContext('2d');let W,H,S=[],mx=0,my=0;
 const rs=()=>{W=c.width=innerWidth;H=c.height=innerHeight;S=Array.from({length:Math.min(140,W/8)},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.5+.3,p:Math.random()*6,s:Math.random()*.0004+.0001}))};
 addEventListener('resize',rs);rs();addEventListener('pointermove',e=>{mx=e.clientX/W-.5;my=e.clientY/H-.5});
 (function f(t){x.clearRect(0,0,W,H);const dark=document.documentElement.dataset.theme!=='light';
  S.forEach(s=>{const a=.4+.6*Math.abs(Math.sin(t*s.s*8+s.p));x.fillStyle=dark?`rgba(255,230,170,${a})`:`rgba(168,102,26,${a*.35})`;x.beginPath();x.arc(s.x+mx*s.r*18,s.y+my*s.r*18,s.r,0,7);x.fill()});
  requestAnimationFrame(f)})(0)})();

/* ---------- Retrieval over all 701 verses ---------- */
const STOP=new Set('the a an and or of to in on for with is are was be i me my you your it that this at as by from not but so do have has am can will just about what how when why who which if then than into out up we our they their them he she his her'.split(' '));
const tok=s=>(s.toLowerCase().match(/[a-zāīūṛṣśṇṭḍ']+/g)||[]).filter(w=>w.length>2&&!STOP.has(w));
const stem=w=>w.replace(/(ing|ed|es|s|ly)$/,'');
const df={};VERSES.forEach(v=>{v._t=new Map();tok(v.translation+' '+v.themes.join(' ')).map(stem).forEach(w=>v._t.set(w,(v._t.get(w)||0)+1));v._t.forEach((_,w)=>df[w]=(df[w]||0)+1)});
const idf=w=>Math.log(1+VERSES.length/(1+(df[w]||0)));
const MOODS={
 grief:{kw:'lost loss died death dead grief grieving breakup broke heartbroken sad cry crying depressed lonely alone miss mourning passed widow',th:['grief','death','suffering','soul'],an:['2.11','2.13','2.14','2.20','2.22','2.27']},
 fear:{kw:'afraid fear scared fail failure failing exam exams interview nervous terrified future uncertain risk worry reject rejected judged',th:['fear','strength','devotion'],an:['2.40','2.56','18.66','9.22','4.10']},
 anger:{kw:'angry anger hate hatred rage betrayed betray revenge jealous jealousy resent furious irritated bitter envy',th:['anger','control','desire'],an:['2.62','2.63','3.37','16.21','2.56']},
 work:{kw:'job career work boss duty responsibility result results goal study exam effort success promotion business salary deadline outcome ambition procrastinate lazy',th:['action','duty','karma','detachment'],an:['2.47','2.48','3.19','3.35','18.46','3.8']},
 confusion:{kw:'confused confusion decision decide choose dilemma lost direction purpose doubt path stuck unsure torn crossroads',th:['confusion','wisdom','duty'],an:['18.73','18.66','2.7','3.2','4.42','18.63']},
 desire:{kw:'want crave craving addiction addicted lust money greed phone social scrolling attachment obsessed temptation pleasure habit',th:['desire','pleasure','detachment','control'],an:['2.70','2.62','2.71','3.37','5.22','2.67']},
 mind:{kw:'anxiety anxious stress stressed overthinking overthink focus distracted sleep restless panic burnout mind thoughts meditation overwhelmed tired',th:['mind','control','meditation','peace'],an:['6.5','6.6','6.35','6.26','2.66','6.17']},
 peace:{kw:'peace calm happiness happy content joy meaning spiritual god faith grateful hope bliss',th:['peace','devotion','equality'],an:['2.71','12.13','5.29','6.7','2.66']},
 general:{kw:'',th:['wisdom','soul'],an:['2.47','2.14','4.7','18.66','2.20']}
};
function classify(text){const w=new Set(tok(text));let best='general',n=0;
 for(const[m,o]of Object.entries(MOODS)){if(m==='general')continue;const c=o.kw.split(' ').filter(k=>w.has(k)).length;if(c>n){n=c;best=m}}return best}
function retrieve(text,mood,n=4){
 const q=tok(text).map(stem),M=MOODS[mood];
 return VERSES.map(v=>{let s=0;q.forEach(w=>{if(v._t.has(w))s+=idf(w)*(1+Math.log(v._t.get(w)))});
  s=s/Math.sqrt(v._t.size+5)*4;
  M.th.forEach((t,i)=>{if(v.themes.includes(t))s+=1.2-i*.15});
  if(M.an.includes(id(v)))s+=3.5;
  return[v,s+Math.random()*.15]}).sort((a,b)=>b[1]-a[1]).slice(0,n).map(x=>x[0]);
}

/* ---------- Offline guide (used when no Bedrock keys) ---------- */
const T={
en:{h:{SEE:'I see you',FIELD:'The battlefield',VERSE:'The verse I give you',PATH:'The way forward',SELF:'Remember who you are',ASK:'Tell me',SAY:'Krishna says'},
 bridge:'Just as Arjuna stood trembling, bow slipping from his hands, between love and duty, so you stand now at your own Kurukshetra. The field is not outside you; it is every choice that asks for your courage.',
 last:'You are not this body, nor this passing storm of thought. You are the eternal Self — unborn, undying, untouched by victory or defeat. Rise.',
 open:['O seeker,','Dear one,','O Pārtha of this age,'],
 mood:{
  grief:['I see the tears you hide, and I do not turn away. Grief is love that has lost its address; it is no weakness, and it is not the end.','Hold what has passed with gratitude, not with clenched fists. What is born will pass and what passes is not destroyed — only the form changes. Let yourself weep, then do one kind act today for someone living.'],
  fear:['I see the trembling beneath your calm face. The fear of failure sits heavy on the one who counts only outcomes.','Give your whole effort to the task before you, and leave the harvest to Me. Prepare with devotion, act without clutching the result, and let each small step today be your offering.'],
  anger:['I see the fire in you. Anger is the pain of a wound that wishes to wound back — and it burns the one who carries it first.','Pause before you answer; let one breath pass between the sting and the word. Do not suppress the anger, but turn its energy into righteous action — a boundary, an honest conversation — never into revenge.'],
  work:['I see how tightly you hold the fruits of your labour, and how that grip steals the joy from the labour itself.','Do your duty fully, as an offering, with attention on the work and not on the applause. Choose the one task that matters most today, finish it with care, and release the outcome.'],
  confusion:['I see the crossroads and the fog. Even the greatest archer once laid down his bow because he could not tell right from wrong.','Be still and ask what your own dharma — your honest duty and nature — requires, not what others expect. Take counsel from the wise, then take the next step; clarity comes by walking, not by waiting.'],
  desire:['I see the pull in you — the craving that promises everything and delivers hunger. Desire is a flame that grows on the very fuel you feed it.','Do not wage war on the craving; starve it gently. Notice the urge, name it, wait ten breaths, and turn the attention to something nourishing. Master the senses and they become servants, not masters.'],
  mind:['I see the restless mind racing ahead to dangers that have not come. The mind is a friend to the one who tames it, and a foe to the one who does not.','Practise daily: sit in stillness, let the breath be your anchor, and each time the mind wanders, bring it gently back. Steady practice and non-attachment — these two will tame it.'],
  peace:['I see a heart already turning toward the light. The longing for peace is My own call within you.','Peace is not found in changed circumstance but in an unshaken centre. Serve without keeping score, be grateful for the moment, and offer your actions to something higher than yourself.'],
  general:['I see you, and I know the weight you carry. You are not alone on this field — I have always been the charioteer of your life.','Take one honest action today aligned with your duty, free from anxiety about the result. Seek stillness each morning, and the next step will reveal itself.']
 },
 talk:'I hear you, dear one. Offer this too at My feet: do the next right thing, and leave the rest to Me. Tell me, what is the one small step you can take before the sun sets?',
 expl:v=>`This is My word to you: “${v.translation.trim()}” Let it settle in you not as a rule, but as a light for the very situation you carry today.`},
hi:{h:{SEE:'मैं तुम्हें देखता हूँ',FIELD:'कुरुक्षेत्र',VERSE:'मेरा श्लोक',PATH:'आगे का मार्ग',SELF:'स्वयं को स्मरण करो',ASK:'मुझे बताओ',SAY:'कृष्ण कहते हैं'},
 bridge:'जैसे अर्जुन प्रेम और कर्तव्य के बीच काँपता खड़ा था, धनुष हाथ से छूट रहा था, वैसे ही आज तुम अपने कुरुक्षेत्र में खड़े हो। यह रणभूमि बाहर नहीं, तुम्हारे हर उस निर्णय में है जो साहस माँगता है।',
 last:'तुम यह शरीर नहीं, न ही विचारों का यह क्षणिक तूफ़ान हो। तुम अजन्मा, अविनाशी आत्मा हो — जय-पराजय से अछूते। उठो।',
 open:['हे साधक,','प्रिय,','हे पार्थ,'],
 mood:{
  grief:['मैं तुम्हारे छिपे आँसू देखता हूँ। शोक वह प्रेम है जिसका ठिकाना खो गया है; यह कमज़ोरी नहीं, और अंत भी नहीं।','जो बीत गया उसे कृतज्ञता से थामो, मुट्ठी भींचकर नहीं। जो जन्मा है वह जाएगा, और जो जाता है वह नष्ट नहीं होता — केवल रूप बदलता है। रो लो, फिर आज किसी जीवित व्यक्ति के लिए एक दयालु कर्म करो।'],
  fear:['मैं तुम्हारे शांत चेहरे के नीचे काँपन देखता हूँ। असफलता का भय उसी पर भारी होता है जो केवल परिणाम गिनता है।','अपना पूरा प्रयास सामने के कर्म को दो और फल मुझ पर छोड़ दो। भक्ति से तैयारी करो, परिणाम को मुट्ठी में मत जकड़ो, और आज का हर छोटा कदम अर्पण बना दो।'],
  anger:['मैं तुम्हारे भीतर की आग देखता हूँ। क्रोध उस घाव की पीड़ा है जो पलटकर घाव देना चाहता है — और वह पहले उसे ही जलाता है जो उसे ढोता है।','उत्तर देने से पहले ठहरो; चुभन और शब्द के बीच एक साँस आने दो। क्रोध को दबाओ मत, उसकी ऊर्जा को सही कर्म में लगाओ — एक सीमा, एक ईमानदार संवाद — बदले में नहीं।'],
  work:['मैं देखता हूँ कि तुम अपने श्रम के फल को कितना कसकर पकड़े हो, और वही पकड़ श्रम का आनंद छीन रही है।','अपना कर्तव्य पूरे मन से, अर्पण भाव से करो; ध्यान कर्म पर रहे, तालियों पर नहीं। आज सबसे महत्वपूर्ण एक कार्य चुनो, उसे लगन से पूरा करो और परिणाम छोड़ दो।'],
  confusion:['मैं दोराहा और धुंध देखता हूँ। महान धनुर्धर ने भी धनुष रख दिया था क्योंकि वह उचित-अनुचित नहीं पहचान पा रहा था।','शांत होकर पूछो कि तुम्हारा अपना धर्म क्या माँगता है, दूसरों की अपेक्षा नहीं। ज्ञानियों से परामर्श लो, फिर अगला कदम उठाओ; स्पष्टता चलने से आती है।'],
  desire:['मैं तुम्हारे भीतर का खिंचाव देखता हूँ — वह तृष्णा जो सब कुछ का वादा करती है और भूख देती है।','तृष्णा से युद्ध मत करो, उसे धीरे से भूखा रखो। इच्छा को पहचानो, दस साँसें प्रतीक्षा करो और ध्यान किसी पोषक चीज़ की ओर मोड़ दो।'],
  mind:['मैं उस बेचैन मन को देखता हूँ जो उन खतरों की ओर दौड़ता है जो आए ही नहीं। मन वश में हो तो मित्र है, नहीं तो शत्रु।','प्रतिदिन अभ्यास करो: शांत बैठो, साँस को आधार बनाओ, और जब भी मन भटके उसे कोमलता से लौटा लाओ। अभ्यास और वैराग्य उसे साध लेंगे।'],
  peace:['मैं देखता हूँ कि तुम्हारा हृदय प्रकाश की ओर मुड़ चुका है। शांति की चाह तुम्हारे भीतर मेरी ही पुकार है।','शांति परिस्थिति बदलने से नहीं, अडिग केंद्र से मिलती है। हिसाब रखे बिना सेवा करो, इस क्षण के लिए आभारी रहो।'],
  general:['मैं तुम्हें देखता हूँ और तुम्हारा बोझ जानता हूँ। इस रणभूमि में तुम अकेले नहीं — मैं सदा तुम्हारे जीवन का सारथी हूँ।','आज अपने कर्तव्य के अनुरूप एक ईमानदार कर्म करो, परिणाम की चिंता के बिना। हर सुबह मौन में बैठो, अगला कदम स्वयं प्रकट होगा।']
 },
 talk:'मैं सुन रहा हूँ, प्रिय। अगला उचित कर्म करो और शेष मुझ पर छोड़ दो। बताओ, सूर्यास्त से पहले तुम कौन-सा एक छोटा कदम उठा सकते हो?',
 expl:v=>`यह तुम्हारे लिए मेरा वचन है — “${v.translation.trim()}” इसे नियम नहीं, आज की तुम्हारी स्थिति के लिए दीपक समझो।`},
te:{h:{SEE:'నేను నిన్ను చూస్తున్నాను',FIELD:'కురుక్షేత్రం',VERSE:'నా శ్లోకం',PATH:'ముందుకు మార్గం',SELF:'నీవెవరో గుర్తుంచుకో',ASK:'నాకు చెప్పు',SAY:'కృష్ణుడు అంటున్నాడు'},
 bridge:'ప్రేమ మరియు కర్తవ్యం మధ్య అర్జునుడు వణుకుతూ నిలబడినట్లే, ఈ రోజు నీవు నీ స్వంత కురుక్షేత్రంలో నిలబడి ఉన్నావు. ఆ యుద్ధభూమి బయట లేదు; ధైర్యం కోరే ప్రతి నిర్ణయంలోనే ఉంది.',
 last:'నీవు ఈ శరీరం కాదు, ఈ క్షణికమైన ఆలోచనల తుఫాను కాదు. నీవు జన్మలేని, నాశనం లేని ఆత్మవు — గెలుపు ఓటముల స్పర్శ లేనివాడివి. లే.',
 open:['ఓ సాధకా,','ప్రియమైనవాడా,','ఓ పార్థా,'],
 mood:{
  grief:['నీ దాచుకున్న కన్నీళ్లు నాకు కనిపిస్తున్నాయి. దుఃఖం అంటే చిరునామా కోల్పోయిన ప్రేమ; అది బలహీనత కాదు, అంతం కూడా కాదు.','గతించినదాన్ని కృతజ్ఞతతో పట్టుకో, పిడికిలి బిగించి కాదు. పుట్టినది పోతుంది, పోయినది నశించదు — రూపమే మారుతుంది. ఏడ్చు, తర్వాత ఈ రోజు బ్రతికున్న ఒకరికి దయతో ఒక పని చెయ్యి.'],
  fear:['నీ ప్రశాంత ముఖం వెనుక వణుకు నాకు కనిపిస్తోంది. ఫలితాలనే లెక్కించేవాడిపై వైఫల్య భయం బరువుగా పడుతుంది.','నీ పూర్తి శ్రమను ఎదుటి పనికి ఇవ్వు, ఫలాన్ని నాకు వదిలెయ్యి. భక్తితో సిద్ధమవ్వు, ఫలితాన్ని గట్టిగా పట్టుకోకు.'],
  anger:['నీలోని అగ్ని నాకు కనిపిస్తోంది. కోపం అంటే తిరిగి గాయపరచాలనుకునే గాయం బాధ — అది మోసేవాడినే ముందు దహిస్తుంది.','జవాబు చెప్పే ముందు ఆగు; బాధకూ మాటకూ మధ్య ఒక శ్వాస ఉండనివ్వు. కోపాన్ని అణచకు, దాని శక్తిని సరైన కర్మగా మలుచు — ప్రతీకారంగా కాదు.'],
  work:['నీ శ్రమ ఫలాన్ని నీవెంత గట్టిగా పట్టుకున్నావో, ఆ పట్టే శ్రమలోని ఆనందాన్ని దొంగిలిస్తోందో నాకు కనిపిస్తోంది.','నీ కర్తవ్యాన్ని అర్పణ భావంతో పూర్తిగా చెయ్యి; దృష్టి పనిపై ఉండాలి, చప్పట్లపై కాదు. ఈ రోజు అత్యంత ముఖ్యమైన ఒక పనిని పూర్తిచేసి ఫలితాన్ని వదిలెయ్యి.'],
  confusion:['నాకు నీ కూడలి, పొగమంచు కనిపిస్తున్నాయి. గొప్ప ధనుర్ధారి కూడా ధర్మాధర్మాలు తెలియక విల్లు వదిలాడు.','నిశ్చలంగా ఉండి నీ స్వధర్మం ఏమి కోరుతోందో అడుగు, ఇతరుల ఆశలను కాదు. జ్ఞానుల సలహా తీసుకొని తర్వాతి అడుగు వెయ్యి.'],
  desire:['నీలోని ఆకర్షణ నాకు కనిపిస్తోంది — అన్నీ వాగ్దానం చేసి ఆకలినే ఇచ్చే కోరిక.','కోరికతో యుద్ధం చెయ్యకు, దాన్ని మెల్లగా ఆకలిగొలుపు. ఆ తపనను గుర్తించి, పది శ్వాసలు ఆగి, దృష్టిని పోషకమైన దానిపైకి మళ్లించు.'],
  mind:['ఇంకా రాని ప్రమాదాల వైపు పరుగెత్తే నీ చంచల మనస్సు నాకు కనిపిస్తోంది. మనస్సును నియంత్రించినవాడికి అది మిత్రుడు.','ప్రతిరోజూ సాధన చెయ్యి: నిశ్శబ్దంగా కూర్చో, శ్వాసను ఆధారం చేసుకో, మనసు తిరిగినప్పుడల్లా మెల్లగా వెనక్కి తీసుకురా.'],
  peace:['నీ హృదయం ఇప్పటికే వెలుగు వైపు తిరిగిందని చూస్తున్నాను. శాంతి కోసం నీ తపన నీలో నా పిలుపే.','శాంతి పరిస్థితులు మారడంలో కాదు, చలించని కేంద్రంలో దొరుకుతుంది. లెక్కలు వేయకుండా సేవ చెయ్యి, ఈ క్షణానికి కృతజ్ఞతగా ఉండు.'],
  general:['నేను నిన్ను చూస్తున్నాను, నీ భారం తెలుసు. ఈ యుద్ధభూమిలో నీవు ఒంటరివి కావు — నేనెప్పుడూ నీ జీవిత సారథిని.','ఈ రోజు ఫలితం గురించిన ఆందోళన లేకుండా, నీ కర్తవ్యానికి అనుగుణంగా ఒక నిజాయితీ గల పని చెయ్యి.']
 },
 talk:'నేను వింటున్నాను, ప్రియా. తదుపరి సరైన పని చెయ్యి, మిగిలినది నాకు వదిలెయ్యి. సూర్యాస్తమయం లోపల నీవు వేయగల ఒక చిన్న అడుగు ఏది?',
 expl:v=>`ఇది నీ కోసం నా వాక్యం — “${v.translation.trim()}” దీన్ని నియమంగా కాక, ఈ రోజు నీ పరిస్థితికి వెలుగుగా భావించు.`}
};
function offlineParsed(text,cands,mood,isFirst){
 const L=T[lang];
 if(!isFirst)return{mode:'TALK',id:null,sec:{SAY:L.talk},done:true};
 const m=L.mood[mood],o=L.open[Math.floor(Math.random()*3)];
 return{mode:'TEACH',id:id(cands[0]),done:true,sec:{SEE:`${o} ${m[0]}`,FIELD:L.bridge,VERSE:L.expl(cands[0]),PATH:m[1],SELF:L.last}};
}

/* ---------- Stream parser + Krishna block renderer ---------- */
const ORDER={ASK:['SEE','ASK'],TEACH:['SEE','FIELD','VERSE','PATH','SELF'],TALK:['SAY']};
function parseStream(buf){
 const out={mode:null,id:null,sec:{},done:false};
 let m=buf.match(/MODE:\s*(ASK|TEACH|TALK)/);if(m)out.mode=m[1];
 m=buf.match(/VERSE_ID:\s*(\d+\.\d+)/);if(m)out.id=m[1];
 const re=/^[ \t]*##\s*(SEE|FIELD|VERSE|PATH|SELF|ASK|SAY|BHAVAM|WORDS|MEANING|STORY|TODAY|REMEMBER)[ \t]*$/gm,marks=[];let r;
 while((r=re.exec(buf)))marks.push({n:r[1],s:r.index,e:r.index+r[0].length});
 marks.forEach((k,i)=>{out.sec[k.n]=buf.slice(k.e,i+1<marks.length?marks[i+1].s:buf.length).trim()});
 if(!out.mode&&marks.length)out.mode=marks.some(k=>k.n==='SAY')?'TALK':'TEACH';
 return out;
}
function newKrishna(){
 const el=document.createElement('div');el.className='kr';
 el.innerHTML='<div class="who">॥ श्रीभगवानुवाच ॥</div><div class="body"><div class="dots"><span></span><span></span><span></span></div></div>';
 $('#thread').appendChild(el);return el;
}
function renderKrishna(el,p,candIds,streaming){
 const L=T[lang];if(!p.mode)return;setStage(p.mode==='ASK'?2:p.mode==='TEACH'?3:4);
 const body=el.querySelector('.body'),order=ORDER[p.mode];
 let vid=p.id&&byId[p.id]?p.id:candIds[0];
 if(!body.dataset.mode){body.dataset.mode=p.mode;body.innerHTML=order.map(k=>`<div class="step ${k==='ASK'?'ask':''}" data-k="${k}" style="display:none"><b>${L.h[k]}</b>${k==='VERSE'?'<div class="vblock"></div>':''}<p></p></div>`).join('')}
 let lastShown=null;
 order.forEach(k=>{const st=body.querySelector(`[data-k="${k}"]`),t=p.sec[k];
  if(t===undefined){return}
  st.style.display='';
  st.querySelector('p').textContent=t;
  if(k==='VERSE'&&p.id!==undefined&&!st.dataset.v){const v=byId[vid];if(v){st.dataset.v=vid;st.querySelector('.vblock').innerHTML=`<span class="cite">${tx('Bhagavad Gītā')} ${vid}</span><div class="shloka">${esc(clean(v))}</div><div class="translit">${esc(v.transliteration)}</div>`}}
  body.querySelectorAll('p').forEach(x=>x.classList.remove('caret'));lastShown=st;
 });
 if(lastShown&&streaming)lastShown.querySelector('p').classList.add('caret');
 {const lk=[...order].reverse().find(k=>p.sec[k]);if(lk&&!speakOn)setSubtitle(lastSentence(p.sec[lk]))}
 if(!streaming&&!el.dataset.fin){el.dataset.fin=1;
  const verse=p.mode==='TEACH'?byId[vid]:null,text=order.map(k=>p.sec[k]).filter(Boolean).join('\n\n');
  const a=document.createElement('div');a.className='actions';
  a.innerHTML=(verse?'<button class="pill" data-a="recite">'+tx('🕉 Recite shloka')+'</button><button class="pill" data-a="teach">'+tx('📖 Teach me this shloka')+'</button><button class="pill" data-a="card">'+tx('🖼 Shloka card')+'</button>':'')+'<button class="pill" data-a="copy">'+tx('⧉ Copy')+'</button>'+(verse?'<button class="pill" data-a="save">'+tx('♡ Save verse')+'</button>':'')+'<button class="pill" data-a="listen">'+tx('🔊 Listen')+'</button>';
  a.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const k=b.dataset.a;
   if(k==='card')openVerse(vid,true);if(k==='recite')reciteShloka(verse);if(k==='teach')openTeach(vid);if(k==='copy')navigator.clipboard?.writeText(text+'\n— Gitopadesh').then(()=>toast('Copied'));
   if(k==='save')toggleSave(vid);if(k==='listen')speak(text)};
  el.appendChild(a);
  history.push({role:'assistant',text:Object.entries(p.sec).map(([k,v])=>`##${k}\n${v}`).join('\n')});
  history[history.length-1].text=`MODE: ${p.mode}\n`+history[history.length-1].text;
 }
 if(verse_pending(p))return;
}
const verse_pending=()=>false;

/* ---------- Ask flow ---------- */
async function ask(text){
 text=(text||'').trim();if(!text){toast('Speak or type what is on your heart 🙏');return}
 audioInit();if(busy)return;{const dl=detectLang(text);if(dl&&dl!==lang){setLang(dl);toast(dl==='hi'?'Krishna will answer in हिंदी':'Krishna will answer in తెలుగు')}}busy=true;$('#goBtn').disabled=true;stopSpeak();
 $('#thread').innerHTML='';
 const me=document.createElement('div');me.className='me';const mk=document.createElement('small');mk.textContent=tx('You');const mt=document.createElement('span');mt.textContent=text;me.append(mk,mt);$('#thread').appendChild(me);
 $('#chariot').classList.add('show');$('#readMore').classList.remove('show');
 if(speakOn)$('#readMore').classList.add('show');else setTimeout(()=>me.scrollIntoView({behavior:'smooth',block:'start'}),60);
 $('#q').value='';autosize();
 const isFirst=!history.some(h=>h.role==='assistant'&&/MODE: (TEACH)/.test(h.text));
 const allUser=history.filter(h=>h.role==='user').map(h=>h.text).concat(text).join(' ');
 const mood=classify(allUser),cands=retrieve(allUser,mood,4),candIds=cands.map(id);
 const el=newKrishna();setState('thinking');setSubtitle('…');let liveSp=speakOn?startSpeaker():null;
 let parsed;
 try{
  if(!hasLLM)throw new Error('offline');
  const res=await fetch('/api/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,lang,history,mood,candidates:cands.map(v=>({id:id(v),translation:v.translation}))})});
  if(!res.ok||!res.body)throw new Error('http '+res.status);
  const rd=res.body.getReader(),dec=new TextDecoder();let buf='';
  while(true){const{done,value}=await rd.read();if(done)break;buf+=dec.decode(value,{stream:true});if(document.body.dataset.state==='thinking')setState('speaking');
   if(buf.includes('\0ERR'))throw new Error('bedrock');
   parsed=parseStream(buf);renderKrishna(el,parsed,candIds,true);if(liveSp)liveSp.feed(parsed,false)}
  parsed=parseStream(buf);if(!parsed.mode)throw new Error('format');
 }catch(err){
  console.warn('falling back to offline guide:',err.message);
  if(err.message!=='offline')toast(/429/.test(err.message)?'Krishna rests a moment. Please try again in a minute.':/503/.test(err.message)?'Many seekers are here today. Showing the offline guide.':'Krishna’s cloud voice is unreachable. Showing the offline guide.');
  el.querySelector('.body').removeAttribute('data-mode');
  if(liveSp){liveSp.cancel();liveSp=speakOn?startSpeaker():null}
  parsed=offlineParsed(text,cands,mood,isFirst);
 }
 history.push({role:'user',text});
 // keep user turn before assistant turn in history order
 const a=history.pop();history.splice(history.length,0,a);
 renderKrishna(el,parsed,candIds,false);
 if(liveSp){liveSp.feed(parsed,true);liveSp.end()}
 // reorder: assistant entry was pushed inside renderKrishna after user push? ensure alternating
 history=history.filter(Boolean);
 {const vid=parsed.id&&byId[parsed.id]?parsed.id:candIds[0];saveExchange({t:Date.now(),q:text,mode:parsed.mode,vid:parsed.mode==='TEACH'?vid:null,sec:parsed.sec,lang});history=history.slice(-12);ss.set('ctx',history)}
 if(!(window.speechSynthesis&&speechSynthesis.speaking))setState('idle');busy=false;$('#goBtn').disabled=false;
}

/* ---------- Voice in (speak your problem) ---------- */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition,LOCALE={en:'en-IN',hi:'hi-IN',te:'te-IN'};
let rec=null,recText='';

/* ---------- Voice out (Krishna speaks) ---------- */
let voices=[];const loadV=()=>voices=speechSynthesis.getVoices();if('speechSynthesis'in window){loadV();speechSynthesis.onvoiceschanged=loadV}
// Prefer deep, natural MALE Indian neural voices (Edge ships Prabhat/Madhur/Mohan for free).
const MALE=/prabhat|madhur|mohan|ravi|hemant|rishi|male|google (hindi|telugu)|kalyani/i, NOTMALE=/swara|neerja|kajal|shruti|female|heera|aditi|raveena/i;
function pickVoice(l=lang){const loc=LOCALE[l],pool=voices.filter(v=>v.lang.replace('_','-').toLowerCase().startsWith(l));
 const exact=pool.filter(v=>v.lang.replace('_','-')===loc);const all=exact.length?exact:pool;
 return all.find(v=>/natural|online/i.test(v.name)&&MALE.test(v.name)&&!NOTMALE.test(v.name))||all.find(v=>MALE.test(v.name)&&!NOTMALE.test(v.name))||all.find(v=>/natural|online/i.test(v.name))||all[0]||null}
function browserSpeak(text){
 if(!('speechSynthesis'in window))return;stopSpeak();
 const parts=text.replace(/[#*_]/g,'').split(/(?<=[.!?।॥])\s+|\n+/).map(s=>s.trim()).filter(Boolean),vo=pickVoice();
 parts.forEach((s,i)=>{const u=new SpeechSynthesisUtterance(s);u.lang=LOCALE[lang];if(vo)u.voice=vo;
  u.rate=.82;u.pitch=vo&&/natural|online/i.test(vo.name)?.9:.7;u.volume=1;   // slow, grave, unhurried
  u.onstart=()=>{setSubtitle(s);setState('speaking')};
  if(i===parts.length-1)u.onend=()=>{setState('idle');ambStop()};
  speechSynthesis.speak(u)});
}
function stopSpeak(){try{speechSynthesis.cancel()}catch{}vtoken++;try{curSrc&&curSrc.stop()}catch{}ambStop();setState('idle')}
const setSpeakBtn=()=>$('#voiceOut').textContent='🔊 '+SL().speaks+': '+(speakOn?SL().on:SL().off);
$('#voiceOut').onclick=()=>{speakOn=!speakOn;store.set('speak',speakOn);setSpeakBtn();if(!speakOn)stopSpeak()};setSpeakBtn();

/* ---------- Verse cards / explorer ---------- */
function vcard(v){const i=id(v);return`<div class="vc" data-id="${i}"><button class="heart ${saved.has(i)?'on':''}" data-h="${i}" aria-label="save">${saved.has(i)?'♥':'♡'}</button><div class="t">BG ${i}</div><div class="s">${esc(clean(v).split('।')[0].replace(/^.*उवाच\s*/,'').slice(0,90))}…</div><div class="e">${esc(v.translation)}</div>${v.themes.slice(0,3).map(t=>`<span class="tag">${esc(themeName(t))}</span>`).join('')}</div>`}
function renderCards(el,list){el.innerHTML=list.length?list.map(vcard).join(''):'<div class="empty">'+tx('Nothing here yet.')+'</div>'}
document.addEventListener('click',e=>{
 const h=e.target.closest('.heart');if(h){e.stopPropagation();toggleSave(h.dataset.h);return}
 const c=e.target.closest('.vc');if(c)openVerse(c.dataset.id);
});
function toggleSave(i){saved.has(i)?saved.delete(i):saved.add(i);store.set('saved',[...saved]);toast(saved.has(i)?'Saved ♥':'Removed');refreshSaved()}
function refreshSaved(){$('#savedCount').textContent=saved.size;renderCards($('#savedGrid'),[...saved].map(i=>byId[i]).filter(Boolean));
 $$('.heart').forEach(b=>{const on=saved.has(b.dataset.h);b.classList.toggle('on',on);b.textContent=on?'♥':'♡'});
 if(!saved.size)$('#savedGrid').innerHTML='<div class="empty">'+tx('Tap ♡ on any verse to keep it here.')+'</div>'}
function openVerse(i,focusCard){
 const v=byId[i];if(!v)return;
 $('#box').innerHTML=`<button class="x" id="xBtn" aria-label="Close">×</button><span class="cite">${tx('Chapter')} ${v.chapter} · ${tx('Verse')} ${v.verse}</span>
 <div class="shloka">${esc(clean(v))}</div><div class="translit">${esc(v.transliteration)}</div>
 <p style="font:500 20px/1.6 'Newsreader','Tiro Devanagari Sanskrit','Noto Serif Telugu',serif">${esc(v.translation)}</p>${v.localized&&lang!=='en'?`<p class="wm">${tx('Translation prepared with AI from the Sanskrit. Please confirm with a teacher or a printed edition for study.')}</p>`:''}
 <details><summary class="pill" style="display:inline-block">${tx('Word by word')}</summary><p class="wm">${esc(v.word_meanings||'').replace(/;/g,' · ')}</p></details>
 <h3 style="margin-top:18px;font:700 24px 'Newsreader',serif;color:var(--gold)">${tx('Shloka card')}</h3>
 <div class="actions">${['Midnight','Saffron','Lotus'].map((n,k)=>`<button class="pill ${k===cardTheme?'on':''}" data-ct="${k}">${tx(n)}</button>`).join('')}</div>
 <canvas id="cv" class="cardprev" width="1080" height="1080"></canvas>
 <div class="actions"><button class="pill" id="vRecite" type="button">${tx('🕉 Recite shloka')}</button><button class="pill" id="vTeach" type="button">${tx('📖 Teach me this shloka')}</button></div>
 <div class="actions"><button class="go" id="dl">${tx('⬇ Download 1080×1080')}</button><button class="pill" id="sv">${tx(saved.has(i)?'♥ Saved':'♡ Save')}</button><button class="pill" id="cp">${tx('⧉ Copy verse')}</button><button class="pill" id="nx">${tx('Next verse ➜')}</button></div>`;
 $('#modal').classList.add('show');$('#xBtn').onclick=closeM;drawCard(v);$('#vRecite').onclick=()=>reciteShloka(v);$('#vTeach').onclick=()=>openTeach(i);
 $$('[data-ct]').forEach(b=>b.onclick=()=>{cardTheme=+b.dataset.ct;$$('[data-ct]').forEach(x=>x.classList.toggle('on',x===b));drawCard(v)});
 $('#dl').onclick=()=>{const a=document.createElement('a');a.download=`gitopadesh-${i}.png`;a.href=$('#cv').toDataURL('image/png');a.click()};
 $('#sv').onclick=()=>{toggleSave(i);$('#sv').textContent=tx(saved.has(i)?'♥ Saved':'♡ Save')};
 $('#cp').onclick=()=>navigator.clipboard?.writeText(`${v.sanskrit}\n\n${v.translation}\n\n— Bhagavad Gita ${i}`).then(()=>toast('Copied'));
 $('#nx').onclick=()=>{const k=VERSES.indexOf(v);openVerse(id(VERSES[(k+1)%VERSES.length]))};
 if(focusCard)setTimeout(()=>$('#cv').scrollIntoView({behavior:'smooth'}),150);
}
function closeM(){$('#modal').classList.remove('show')}
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeM()});
addEventListener('keydown',e=>{if(e.key==='Escape')closeM()});

/* ---------- Shloka card painter ---------- */
const CT=[{a:'#0a0820',b:'#2a1b6e',g:'#f5c76a',t:'#f3eee0'},{a:'#7a2e0a',b:'#f08a24',g:'#fff1c2',t:'#fffaf0'},{a:'#fdf0f3',b:'#f6c1d1',g:'#8a2a4d',t:'#3a1020'}];
function wrap(x,t,mw){const ws=t.split(/\s+/),ls=[];let l='';ws.forEach(w=>{const n=l?l+' '+w:w;if(x.measureText(n).width>mw&&l){ls.push(l);l=w}else l=n});if(l)ls.push(l);return ls}
async function drawCard(v){
 const c=$('#cv'),x=c.getContext('2d'),T=CT[cardTheme],W=1080;
 try{await Promise.all([document.fonts.load('400 40px "Tiro Devanagari Sanskrit"'),document.fonts.load('italic 500 30px "Newsreader"'),document.fonts.load('400 40px "Newsreader"')])}catch{}
 const g=x.createLinearGradient(0,0,W,W);g.addColorStop(0,T.a);g.addColorStop(1,T.b);x.fillStyle=g;x.fillRect(0,0,W,W);
 x.strokeStyle=T.g;x.globalAlpha=.16;x.lineWidth=2;for(let r=60;r<760;r+=48){x.beginPath();x.arc(W/2,W/2,r,0,7);x.stroke()}
 for(let k=0;k<16;k++){x.save();x.translate(W/2,W/2);x.rotate(k*Math.PI/8);x.beginPath();x.ellipse(0,-300,36,120,0,0,7);x.stroke();x.restore()}
 x.globalAlpha=1;x.strokeStyle=T.g;x.lineWidth=3;x.strokeRect(36,36,W-72,W-72);x.lineWidth=1;x.strokeRect(50,50,W-100,W-100);
 x.textAlign='center';x.fillStyle=T.g;x.font='400 76px "Tiro Devanagari Sanskrit","Noto Serif Telugu",serif';x.fillText('ॐ',W/2,170);
 x.font='400 40px "Tiro Devanagari Sanskrit","Noto Serif Telugu",serif';let y=250;
 wrap(x,clean(v),W-220).slice(0,6).forEach(l=>{x.fillText(l,W/2,y);y+=66});
 y+=14;x.fillRect(W/2-60,y,120,3);y+=62;
 x.fillStyle=T.t;let fs=36,tl;
 do{x.font=`italic 500 ${fs}px "Newsreader","Tiro Devanagari Sanskrit","Noto Serif Telugu",serif`;tl=wrap(x,v.translation.trim(),W-240);fs-=2}while(tl.length*(fs+22)>W-y-170&&fs>20);
 tl.forEach(l=>{x.fillText(l,W/2,y);y+=fs+22});
 x.fillStyle=T.g;x.font='700 34px "Newsreader","Tiro Devanagari Sanskrit","Noto Serif Telugu",serif';x.fillText(`Bhagavad Gita · Chapter ${v.chapter}, Verse ${v.verse}`,W/2,W-110);
 x.globalAlpha=.7;x.font='500 24px Inter,sans-serif';x.fillText('GITOPADESH',W/2,W-72);x.globalAlpha=1;
}

/* ---------- Page wiring ---------- */
const PROMPTS={en:['I failed my exam and feel ashamed','My boss takes credit for my work and I am furious','I lost someone I love and can’t move on','I can’t decide between two job offers','I’m anxious about my future'],hi:['मैं परीक्षा में असफल हो गया','मेरे बॉस मेरा श्रेय ले लेते हैं','मैं बहुत चिंतित हूँ'],te:['నేను పరీక్షలో ఫెయిల్ అయ్యాను','నాకు చాలా ఆందోళనగా ఉంది','నేను రెండు ఉద్యోగాల మధ్య తేల్చుకోలేకపోతున్నాను']};
function chips(){$('#chips').innerHTML=PROMPTS[lang].map(p=>`<button class="pill">${p}</button>`).join('')}
$('#chips').onclick=e=>{const b=e.target.closest('.pill');if(b)ask(b.textContent)};
$('#goBtn').onclick=()=>ask($('#q').value);
$('#q').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask($('#q').value)}});
const autosize=()=>{const q=$('#q');q.style.height='auto';q.style.height=Math.min(160,q.scrollHeight)+'px'};$('#q').addEventListener('input',autosize);
function setLang(l){lang=l;store.set('lang',l);$$('#langs .pill').forEach(x=>x.classList.toggle('on',x.dataset.l===l));chips();if(rec)rec.stop();if(i18nReady)applyLangAll()}
$('#langs').onclick=e=>{const b=e.target.closest('[data-l]');if(b)setLang(b.dataset.l)};setLang(lang);
fetch('/api/health').then(r=>r.json()).then(j=>{hasLLM=!!j.llm;ttsCfg=j.tts||false;sttCfg=!!j.stt}).catch(()=>{});


function today(){const v=VERSES[Math.floor(Math.random()*VERSES.length)];$('#todayBox').innerHTML=`<h2 style="margin:0">${tx('Verse of the moment')}</h2><span class="cite">${tx('Bhagavad Gītā')} ${id(v)}</span><div class="shloka">${esc(clean(v))}</div><p class="tr">${esc(v.translation)}</p><div class="row"><button class="pill" id="tNew" type="button">${tx('🪷 Another verse')}</button><button class="pill" id="tOpen" type="button">${tx('Open shloka card')}</button></div>`;
 $('#tNew').onclick=today;$('#tOpen').onclick=()=>openVerse(id(v))}
today();

let fCh=0,fTh='',fQ='',shown=12;
$('#chapters').innerHTML=`<button class="pill on" data-ch="0">All</button>`+Array.from({length:18},(_,i)=>`<button class="pill" data-ch="${i+1}">${i+1}</button>`).join('');
$('#themeChips').innerHTML=[...new Set(VERSES.flatMap(v=>v.themes))].filter(t=>t!=='general').sort().map(t=>`<button class="pill" data-th="${t}">${t}</button>`).join('');
$('#chapters').onclick=e=>{const b=e.target.closest('[data-ch]');if(!b)return;fCh=+b.dataset.ch;$$('#chapters .pill').forEach(x=>x.classList.toggle('on',x===b));shown=12;explore()};
$('#themeChips').onclick=e=>{const b=e.target.closest('[data-th]');if(!b)return;fTh=fTh===b.dataset.th?'':b.dataset.th;$$('#themeChips .pill').forEach(x=>x.classList.toggle('on',x.dataset.th===fTh));shown=12;explore()};
$('#search').oninput=e=>{fQ=e.target.value.trim().toLowerCase();shown=12;explore()};
$('#more').onclick=()=>{shown+=12;explore()};
function explore(){
 let l=VERSES.filter(v=>(!fCh||v.chapter===fCh)&&(!fTh||v.themes.includes(fTh)));
 if(fQ){l=/^\d+\.\d+$/.test(fQ)?l.filter(v=>id(v)===fQ):l.filter(v=>(v.translation+' '+(v.translation_en||'')+' '+v.transliteration+' '+v.themes.join(' ')+' '+v.themes.map(themeName).join(' ')).toLowerCase().includes(fQ))}
 renderCards($('#results'),l.slice(0,shown));
 $('#more').style.display=l.length>shown?'inline-block':'none';$('#more').textContent=`${tx('Show more')} (${l.length-shown})`;
}
explore();refreshSaved();
let tt;function toast(m){const t=$('#toast');t.textContent=tx(m);t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2200)}
