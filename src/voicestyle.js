
/* ================= Voice style: Calm / Natural / Deep / Device ================= */
const VSTYLES=[['calm','Calm'],['natural','Natural'],['deep','Deep'],['device','Device']];
const SAMPLE={en:'O seeker, you have come to the field. Tell me what weighs upon your heart.',hi:'हे साधक, तुम रणभूमि में आए हो। बोलो, तुम्हारे हृदय पर क्या बोझ है?',te:'ఓ సాధకా, నీవు యుద్ధభూమికి వచ్చావు. చెప్పు, నీ హృదయంపై ఏ భారం ఉంది?'};
const setVstyleBtn=()=>$('#vstyleBtn').textContent='🎙 '+SL().voice+': '+SL().styles[vstyle];
$('#vstyleBtn').onclick=()=>{const i=VSTYLES.findIndex(v=>v[0]===vstyle);vstyle=VSTYLES[(i+1)%VSTYLES.length][0];store.set('vstyle',vstyle);setVstyleBtn();applyStyleFX();
 const sp=startSpeaker();sp.say([SAMPLE[lang]]);sp.end()};setVstyleBtn();
