(async()=>{const VERSES=await (await fetch('/verses.json')).json();
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const id=v=>v.chapter+'.'+v.verse, byId=Object.fromEntries(VERSES.map(v=>[id(v),v]));
const clean=v=>v.sanskrit.replace(/\s*[।॥]*\s*\d+\.\d+\s*[।॥]*\s*$/,'');
const ss={get(k,d){try{return JSON.parse(sessionStorage.getItem(k))??d}catch{return d}},set(k,v){try{sessionStorage.setItem(k,JSON.stringify(v))}catch{}}};
let lang=store.get('lang','en'), saved=new Set(store.get('saved',[])), cardTheme=0, hasLLM=false, speakOn=store.get('speak',true), history=ss.get('ctx',[]), busy=false;

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
 expl:v=>`यह तुम्हारे लिए मेरा वचन है — (अंग्रेज़ी अनुवाद) “${v.translation.trim()}” इसे नियम नहीं, आज की तुम्हारी स्थिति के लिए दीपक समझो।`},
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
 expl:v=>`ఇది నీ కోసం నా వాక్యం — (ఆంగ్ల అనువాదం) “${v.translation.trim()}” దీన్ని నియమంగా కాక, ఈ రోజు నీ పరిస్థితికి వెలుగుగా భావించు.`}
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
 const re=/^[ \t]*##\s*(SEE|FIELD|VERSE|PATH|SELF|ASK|SAY)[ \t]*$/gm,marks=[];let r;
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
  if(k==='VERSE'&&p.id!==undefined&&!st.dataset.v){const v=byId[vid];if(v){st.dataset.v=vid;st.querySelector('.vblock').innerHTML=`<span class="cite">Bhagavad Gītā ${vid}</span><div class="shloka">${esc(clean(v))}</div><div class="translit">${esc(v.transliteration)}</div>`}}
  body.querySelectorAll('p').forEach(x=>x.classList.remove('caret'));lastShown=st;
 });
 if(lastShown&&streaming)lastShown.querySelector('p').classList.add('caret');
 {const lk=[...order].reverse().find(k=>p.sec[k]);if(lk&&!speakOn)setSubtitle(lastSentence(p.sec[lk]))}
 if(!streaming&&!el.dataset.fin){el.dataset.fin=1;
  const verse=p.mode==='TEACH'?byId[vid]:null,text=order.map(k=>p.sec[k]).filter(Boolean).join('\n\n');
  const a=document.createElement('div');a.className='actions';
  a.innerHTML=(verse?'<button class="pill" data-a="card">🖼 Shloka card</button>':'')+'<button class="pill" data-a="copy">⧉ Copy</button>'+(verse?'<button class="pill" data-a="save">♡ Save verse</button>':'')+'<button class="pill" data-a="listen">🔊 Listen</button>';
  a.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const k=b.dataset.a;
   if(k==='card')openVerse(vid,true);if(k==='copy')navigator.clipboard?.writeText(text+'\n— Gitopadesh').then(()=>toast('Copied'));
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
 const me=document.createElement('div');me.className='me';const mk=document.createElement('small');mk.textContent='You';const mt=document.createElement('span');mt.textContent=text;me.append(mk,mt);$('#thread').appendChild(me);
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
function pickVoice(){const loc=LOCALE[lang],pool=voices.filter(v=>v.lang.replace('_','-').toLowerCase().startsWith(lang));
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
const setSpeakBtn=()=>$('#voiceOut').textContent='🔊 Krishna speaks: '+(speakOn?'on':'off');
$('#voiceOut').onclick=()=>{speakOn=!speakOn;store.set('speak',speakOn);setSpeakBtn();if(!speakOn)stopSpeak()};setSpeakBtn();

/* ---------- Verse cards / explorer ---------- */
function vcard(v){const i=id(v);return`<div class="vc" data-id="${i}"><button class="heart ${saved.has(i)?'on':''}" data-h="${i}" aria-label="save">${saved.has(i)?'♥':'♡'}</button><div class="t">BG ${i}</div><div class="s">${esc(clean(v).split('।')[0].replace(/^.*उवाच\s*/,'').slice(0,90))}…</div><div class="e">${esc(v.translation)}</div>${v.themes.slice(0,3).map(t=>`<span class="tag">${t}</span>`).join('')}</div>`}
function renderCards(el,list){el.innerHTML=list.length?list.map(vcard).join(''):'<div class="empty">Nothing here yet.</div>'}
document.addEventListener('click',e=>{
 const h=e.target.closest('.heart');if(h){e.stopPropagation();toggleSave(h.dataset.h);return}
 const c=e.target.closest('.vc');if(c)openVerse(c.dataset.id);
});
function toggleSave(i){saved.has(i)?saved.delete(i):saved.add(i);store.set('saved',[...saved]);toast(saved.has(i)?'Saved ♥':'Removed');refreshSaved()}
function refreshSaved(){$('#savedCount').textContent=saved.size;renderCards($('#savedGrid'),[...saved].map(i=>byId[i]).filter(Boolean));
 $$('.heart').forEach(b=>{const on=saved.has(b.dataset.h);b.classList.toggle('on',on);b.textContent=on?'♥':'♡'});
 if(!saved.size)$('#savedGrid').innerHTML='<div class="empty">Tap ♡ on any verse to keep it here.</div>'}
function openVerse(i,focusCard){
 const v=byId[i];if(!v)return;
 $('#box').innerHTML=`<button class="x" id="xBtn" aria-label="Close">×</button><span class="cite">Chapter ${v.chapter} · Verse ${v.verse}</span>
 <div class="shloka">${esc(clean(v))}</div><div class="translit">${esc(v.transliteration)}</div>
 <p style="font:500 20px/1.6 'Newsreader',serif">${esc(v.translation)}</p>
 <details><summary class="pill" style="display:inline-block">Word by word</summary><p class="wm">${esc(v.word_meanings||'').replace(/;/g,' · ')}</p></details>
 <h3 style="margin-top:18px;font:700 24px 'Newsreader',serif;color:var(--gold)">Shloka card</h3>
 <div class="actions">${['Midnight','Saffron','Lotus'].map((n,k)=>`<button class="pill ${k===cardTheme?'on':''}" data-ct="${k}">${n}</button>`).join('')}</div>
 <canvas id="cv" class="cardprev" width="1080" height="1080"></canvas>
 <div class="actions"><button class="go" id="dl">⬇ Download 1080×1080</button><button class="pill" id="sv">${saved.has(i)?'♥ Saved':'♡ Save'}</button><button class="pill" id="cp">⧉ Copy verse</button><button class="pill" id="nx">Next verse ➜</button></div>`;
 $('#modal').classList.add('show');$('#xBtn').onclick=closeM;drawCard(v);
 $$('[data-ct]').forEach(b=>b.onclick=()=>{cardTheme=+b.dataset.ct;$$('[data-ct]').forEach(x=>x.classList.toggle('on',x===b));drawCard(v)});
 $('#dl').onclick=()=>{const a=document.createElement('a');a.download=`gitopadesh-${i}.png`;a.href=$('#cv').toDataURL('image/png');a.click()};
 $('#sv').onclick=()=>{toggleSave(i);$('#sv').textContent=saved.has(i)?'♥ Saved':'♡ Save'};
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
 x.textAlign='center';x.fillStyle=T.g;x.font='400 76px "Tiro Devanagari Sanskrit",serif';x.fillText('ॐ',W/2,170);
 x.font='400 40px "Tiro Devanagari Sanskrit",serif';let y=250;
 wrap(x,clean(v),W-220).slice(0,6).forEach(l=>{x.fillText(l,W/2,y);y+=66});
 y+=14;x.fillRect(W/2-60,y,120,3);y+=62;
 x.fillStyle=T.t;let fs=36,tl;
 do{x.font=`italic 500 ${fs}px "Newsreader",serif`;tl=wrap(x,v.translation.trim(),W-240);fs-=2}while(tl.length*(fs+22)>W-y-170&&fs>20);
 tl.forEach(l=>{x.fillText(l,W/2,y);y+=fs+22});
 x.fillStyle=T.g;x.font='700 34px "Newsreader",serif';x.fillText(`Bhagavad Gita · Chapter ${v.chapter}, Verse ${v.verse}`,W/2,W-110);
 x.globalAlpha=.7;x.font='500 24px Inter,sans-serif';x.fillText('GITOPADESH',W/2,W-72);x.globalAlpha=1;
}

/* ---------- Page wiring ---------- */
const PROMPTS={en:['I failed my exam and feel ashamed','My boss takes credit for my work and I am furious','I lost someone I love and can’t move on','I can’t decide between two job offers','I’m anxious about my future'],hi:['मैं परीक्षा में असफल हो गया','मेरे बॉस मेरा श्रेय ले लेते हैं','मैं बहुत चिंतित हूँ'],te:['నేను పరీక్షలో ఫెయిల్ అయ్యాను','నాకు చాలా ఆందోళనగా ఉంది','నేను రెండు ఉద్యోగాల మధ్య తేల్చుకోలేకపోతున్నాను']};
function chips(){$('#chips').innerHTML=PROMPTS[lang].map(p=>`<button class="pill">${p}</button>`).join('')}
$('#chips').onclick=e=>{const b=e.target.closest('.pill');if(b)ask(b.textContent)};
$('#goBtn').onclick=()=>ask($('#q').value);
$('#q').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask($('#q').value)}});
const autosize=()=>{const q=$('#q');q.style.height='auto';q.style.height=Math.min(160,q.scrollHeight)+'px'};$('#q').addEventListener('input',autosize);
function setLang(l){lang=l;store.set('lang',l);$$('#langs .pill').forEach(x=>x.classList.toggle('on',x.dataset.l===l));chips();if(rec)rec.stop()}
$('#langs').onclick=e=>{const b=e.target.closest('[data-l]');if(b)setLang(b.dataset.l)};setLang(lang);
fetch('/api/health').then(r=>r.json()).then(j=>{hasLLM=!!j.llm;ttsCfg=j.tts||false;sttCfg=!!j.stt}).catch(()=>{});


function today(){const v=VERSES[Math.floor(Math.random()*VERSES.length)];$('#todayBox').innerHTML=`<h2 style="margin:0">Verse of the moment</h2><span class="cite">Bhagavad Gītā ${id(v)}</span><div class="shloka">${esc(clean(v))}</div><p class="tr">${esc(v.translation)}</p><div class="row"><button class="pill" id="tNew" type="button">🪷 Another verse</button><button class="pill" id="tOpen" type="button">Open shloka card</button></div>`;
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
 if(fQ){l=/^\d+\.\d+$/.test(fQ)?l.filter(v=>id(v)===fQ):l.filter(v=>(v.translation+' '+v.transliteration+' '+v.themes.join(' ')).toLowerCase().includes(fQ))}
 renderCards($('#results'),l.slice(0,shown));
 $('#more').style.display=l.length>shown?'inline-block':'none';$('#more').textContent=`Show more (${l.length-shown} left)`;
}
explore();refreshSaved();
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2200)}

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

/* ================= Krishna's voice: neural speech, temple-hall mastering, bansuri + tanpura ================= */
let warmN=null,bodyN=null,wetN=null,vstyle=store.get('vstyle','calm');
const STYLE_FX={calm:{warm:5,body:3,wet:.3,rate:1},natural:{warm:0,body:0,wet:.06,rate:1},deep:{warm:7,body:4.5,wet:.3,rate:.97},device:{warm:0,body:0,wet:.3,rate:1}};
let ttsCfg=false,AC=null,bus=null,verb=null,ambBus=null,vtoken=0,curSrc=null,ambOn=store.get('amb',true),amb=null;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

function impulse(sec,decay){const n=Math.floor(AC.sampleRate*sec),b=AC.createBuffer(2,n,AC.sampleRate);
 for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,decay)}return b}

function applyStyleFX(){const f=STYLE_FX[vstyle]||STYLE_FX.calm;if(!warmN)return;warmN.gain.value=f.warm;bodyN.gain.value=f.body;wetN.gain.value=f.wet}
function audioInit(){
 if(AC){if(AC.state==='suspended')AC.resume();return}
 const C=window.AudioContext||window.webkitAudioContext;if(!C)return;AC=new C();
 const warm=AC.createBiquadFilter();warm.type='lowshelf';warm.frequency.value=240;warm.gain.value=5;       // chest and warmth
 const body=AC.createBiquadFilter();body.type='peaking';body.frequency.value=150;body.gain.value=3;body.Q.value=.9;
 const air=AC.createBiquadFilter();air.type='highshelf';air.frequency.value=6500;air.gain.value=-4;          // soften the digital edge
 const comp=AC.createDynamicsCompressor();comp.threshold.value=-24;comp.ratio.value=3;
 verb=AC.createConvolver();verb.buffer=impulse(3.2,2.4);                                                       // a stone temple hall
 const wet=AC.createGain();wet.gain.value=.3;warmN=warm;bodyN=body;wetN=wet;applyStyleFX();
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
 let pro=!!(AC&&ttsCfg&&ttsCfg[lang])&&vstyle!=='device',ended=false,running=false,cancelled=false;
 const rate=(STYLE_FX[vstyle]||STYLE_FX.calm).rate;
 const once=s=>fetch('/api/speak',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:s,lang,style:vstyle})})
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
  say(list){list.forEach(push)},
  end(){ended=true;if(!pro&&!items.length&&!(window.speechSynthesis&&(speechSynthesis.speaking||speechSynthesis.pending)))finish();if(pro&&!items.length)finish();else if(pro)loop()},
  cancel(){cancelled=true;stopSpeak()}
 };
}
function speak(text){const sp=startSpeaker();sp.say(speechParts(text));sp.end()}   // used by the Listen button

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

/* ================= Voice style: Calm / Natural / Deep / Device ================= */
const VSTYLES=[['calm','Calm'],['natural','Natural'],['deep','Deep'],['device','Device']];
const SAMPLE={en:'O seeker, you have come to the field. Tell me what weighs upon your heart.',hi:'हे साधक, तुम रणभूमि में आए हो। बोलो, तुम्हारे हृदय पर क्या बोझ है?',te:'ఓ సాధకా, నీవు యుద్ధభూమికి వచ్చావు. చెప్పు, నీ హృదయంపై ఏ భారం ఉంది?'};
const setVstyleBtn=()=>$('#vstyleBtn').textContent='🎙 Voice: '+(VSTYLES.find(v=>v[0]===vstyle)||VSTYLES[0])[1];
$('#vstyleBtn').onclick=()=>{const i=VSTYLES.findIndex(v=>v[0]===vstyle);vstyle=VSTYLES[(i+1)%VSTYLES.length][0];store.set('vstyle',vstyle);setVstyleBtn();applyStyleFX();
 const sp=startSpeaker();sp.say([SAMPLE[lang]]);sp.end()};setVstyleBtn();

})();