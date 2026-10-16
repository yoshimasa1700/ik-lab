import {forward,inverse} from './kinematics.js';
const $=id=>document.getElementById(id),rad=Math.PI/180,deg=180/Math.PI;
const initial={x:2.4,y:1.5,l1:2,l2:1.5,a:0,b:0,sign:1,mode:'ik'};
let s={...initial};
const norm=a=>((a*deg+180)%360+360)%360-180;
const set=(id,attrs)=>Object.entries(attrs).forEach(([k,v])=>$(id).setAttribute(k,v));
const fixed=n=>(Math.abs(n)<.0005?0:n).toFixed(2);
function render(){
 let sol;
 if(s.mode==='ik'){sol=inverse(s.x,s.y,s.l1,s.l2,s.sign);s.a=sol.a;s.b=sol.b;}
 else{const p=forward(s.a,s.b,s.l1,s.l2);s.x=p.x;s.y=p.y;sol=inverse(s.x,s.y,s.l1,s.l2,s.b<0?-1:1);}
 const p=forward(s.a,s.b,s.l1,s.l2),other=inverse(s.x,s.y,s.l1,s.l2,s.b<0?1:-1),g=forward(other.a,other.b,s.l1,s.l2);
 const err=Math.hypot(p.x-s.x,p.y-s.y),det=s.l1*s.l2*Math.sin(s.b),singular=Math.abs(det)<1e-7;
 set('reach',{r:s.l1+s.l2});set('hole',{r:Math.abs(s.l1-s.l2)});
 set('link1',{d:`M 0 0 L ${p.ex} ${p.ey}`});set('link2',{d:`M ${p.ex} ${p.ey} L ${p.x} ${p.y}`});
 set('elbow',{cx:p.ex,cy:p.ey});set('tip',{cx:p.x,cy:p.y});
 set('ghost',{d:`M 0 0 L ${g.ex} ${g.ey} L ${g.x} ${g.y}`,visibility:$('show-other').checked&&!sol.infinite?'visible':'hidden'});
 set('target',{transform:`translate(${s.x} ${s.y})`});set('error-line',{d:`M ${p.x} ${p.y} L ${s.x} ${s.y}`});
 set('target-label',{x:Math.min(660,Math.max(10,360+s.x*56+17)),y:Math.min(580,Math.max(20,310-s.y*56-15))});$('target-label').textContent=s.mode==='ik'?'目標':'手先';
 $('a-value').textContent=norm(s.a).toFixed(1)+'°';$('b-value').textContent=(s.b*deg).toFixed(1)+'°';$('error-value').textContent=fixed(err);
 for(const id of ['x','y','l1','l2']){$(id).value=s[id];$(id+'-out').textContent=fixed(s[id]);}
 for(const id of ['a','b']){$(id).value=norm(s[id]);$(id+'-out').textContent=norm(s[id]).toFixed(1)+'°';}
 $('position-controls').hidden=s.mode!=='ik';$('angle-controls').hidden=s.mode!=='fk';
 $('ik').setAttribute('aria-pressed',s.mode==='ik');$('fk').setAttribute('aria-pressed',s.mode==='fk');$('branch').disabled=s.mode==='fk';
 $('branch').textContent=s.sign>0?'θ₂ 正 → 負へ切替':'θ₂ 負 → 正へ切替';
 $('mode-description').textContent=s.mode==='ik'?'目標の位置から、2つの関節角を計算します。':'関節の角度から、手先の位置を計算します。';
 $('hint').textContent=s.mode==='ik'?'ドラッグ / 矢印キーで目標を移動 · Shiftで微調整':'右のスライダーで角度を変更 · θ₂は第1リンクからの相対角';
 $('status').classList.toggle('warn',!sol.reachable||singular);
 $('status').textContent=!sol.reachable?'到達不能':sol.infinite?'無限個の解':singular?'特異点':'到達可能';
 $('observation').textContent=!sol.reachable?'目標には届きません。薄緑の到達範囲の境界に、最も近い姿勢を表示しています。点線の長さが残った誤差です。':sol.infinite?'等しい長さのリンクを折り畳むと、肩をどの角度にしても手先は原点。無限個の解があり、IKモードでは代表として肩0°を表示します。':singular?'リンクが一直線になり、ヤコビアンの行列式が0になりました。この姿勢では瞬間的に作れない手先速度の方向があります。':s.mode==='ik'?'同じ目標に届く姿勢が2つあります。「解の分岐」を切り替えると肘の位置が変わり、手先の位置は変わりません。':'角度から位置を求めるのが順運動学。θ₂は相対角なので、第2リンクの向きはθ₁ + θ₂になります。';
 const c=(s.x*s.x+s.y*s.y-s.l1*s.l1-s.l2*s.l2)/(2*s.l1*s.l2);
 $('numeric').textContent=`現在の c₂ = ${fixed(c)}${!sol.reachable?' → [−1, 1] の外なので実数のIK解なし。図は境界上の近似姿勢。':''}`;
 $('jacobian').textContent=`現在の det J = ${fixed(det)} / 到達距離 ${fixed(Math.abs(s.l1-s.l2))} 〜 ${fixed(s.l1+s.l2)} unit`;
}
for(const id of ['x','y','l1','l2','a','b'])$(id).addEventListener('input',e=>{s[id]=+e.target.value*(id==='a'||id==='b'?rad:1);render();});
for(const mode of ['ik','fk'])$(mode).onclick=()=>{s.mode=mode;s.sign=s.b<0?-1:1;render();};
$('branch').onclick=()=>{s.sign*=-1;render();};$('show-other').onchange=render;
$('reset').onclick=()=>{s={...initial};$('show-other').checked=true;render();};
const scene=$('scene');let dragging=false;
function move(e){if(s.mode!=='ik')return;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(scene.getScreenCTM().inverse());s.x=Math.max(-5.5,Math.min(5.5,(p.x-360)/56));s.y=Math.max(-4.5,Math.min(4.5,(310-p.y)/56));render();}
scene.addEventListener('pointerdown',e=>{if(s.mode!=='ik')return;dragging=true;scene.setPointerCapture(e.pointerId);move(e);});scene.addEventListener('pointermove',e=>{if(dragging)move(e);});
for(const event of ['pointerup','pointercancel','lostpointercapture'])scene.addEventListener(event,()=>dragging=false);
scene.addEventListener('keydown',e=>{if(s.mode!=='ik'||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const step=e.shiftKey?.01:.1;s.x=Math.max(-5.5,Math.min(5.5,s.x+(e.key==='ArrowRight'?step:e.key==='ArrowLeft'?-step:0)));s.y=Math.max(-4.5,Math.min(4.5,s.y+(e.key==='ArrowUp'?step:e.key==='ArrowDown'?-step:0)));render();});
document.querySelectorAll('[data-preset]').forEach(el=>el.onclick=()=>{s={...initial};if(el.dataset.preset==='outside'){s.x=4.5;s.y=1;}if(el.dataset.preset==='singular'){s.x=3.5;s.y=0;}$('show-other').checked=true;render();document.querySelector('.lab').scrollIntoView({behavior:'auto',block:'start'});scene.focus({preventScroll:true});});
render();
