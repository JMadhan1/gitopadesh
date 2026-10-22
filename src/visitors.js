
/* ================= Visitor counters (anonymous; hidden until the server reports them) ================= */
let visStats=null,visId=store.get('gp_vid',null),visFirst=false;
if(!visId||!/^[A-Za-z0-9_-]{16,32}$/.test(visId)){
 try{visId=Array.from(crypto.getRandomValues(new Uint8Array(18)),b=>'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[b%62]).join('')}
 catch{visId=(Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)+'abcdefghijklmnop').slice(0,20)}
 store.set('gp_vid',visId);visFirst=true;
}
function renderStats(){
 const box=$('#stats');if(!box||!visStats)return;
 const nf=new Intl.NumberFormat(lang==='en'?'en-IN':lang==='hi'?'hi-IN':'te-IN');
 $('#stTotal').textContent=`👁 ${nf.format(visStats.total)} ${tx('visitors')}`;
 $('#stLive').innerHTML=`<i class="dotlive"></i>${nf.format(Math.max(1,visStats.live))} ${tx('online now')}`;
 box.hidden=false;const n=$('#stNote');n.hidden=false;n.textContent=tx('Counted with an anonymous random ID: no account or personal details.');
}
async function visPing(){
 if(document.hidden)return;
 try{
  const r=await fetch('/api/visit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:visId,first:visFirst})});
  if(!r.ok)return;
  const j=await r.json();
  if(j&&typeof j.total==='number'&&typeof j.live==='number'){visFirst=false;visStats=j;renderStats()}
 }catch{}
}
visPing();setInterval(visPing,60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)visPing()});
