/* THRESHOLD — interactions. Each module runs only if its markup exists. */
(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const eo=t=>1-Math.pow(1-t,3),eio=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const tween=(d,fn,e=eo)=>new Promise(res=>{const t0=performance.now();const f=n=>{const p=Math.min(1,(n-t0)/d);fn(e(p));p<1?requestAnimationFrame(f):res()};requestAnimationFrame(f)});
const BONE=[237,230,217],GOLD=[226,71,42];
const rgba=(c,a)=>`rgba(${c[0]},${c[1]},${c[2]},${a})`;

/* ============ THE THRESHOLD SCENE (hero canvas) ============ */
function Scene(canvas,opt={}){
  const ctx=canvas.getContext('2d');const host=canvas.parentElement;
  const o=Object.assign({horizon:.6,crossing:false,speed:1,density:1},opt);
  let W,H,hy,cx,dpr,dust=[],acts=[],bumps=[],beams=[],marks=[],riser=null,vis=true,t0=performance.now();
  const S={};
  function size(){
    const r=host.getBoundingClientRect();W=r.width;H=r.height;dpr=Math.min(2,devicePixelRatio||1);
    canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    const anchor=o.anchor&&o.anchor();hy=anchor!=null?anchor:H*o.horizon;cx=W*(o.vx??.5);
    dust=[];const nd=Math.round((W*H)/9000*o.density);
    for(let i=0;i<nd;i++)dust.push({x:Math.random()*W,y:Math.random()*hy*1.05,r:Math.random()*1.1+.2,a:Math.random()*.5+.1,v:Math.random()*.12+.02,p:Math.random()*6.3});
    acts=[];const na=Math.round(260*o.density*(W/1440+.4));
    for(let i=0;i<na;i++)acts.push({u:(Math.random()*2-1)*1.6,z:Math.random()*.94+.06,p:Math.random()*6.3,s:Math.random()*1.5+.4,f:0});
    S.hy=hy;S.W=W;S.H=H;S.cx=cx;
  }
  S.size=size;
  // floor projection: z in (0,1], 1 = at the viewer, small = near horizon
  const fy=z=>hy+(H-hy+40)*Math.pow(z,1.7);
  const fx=(u,z)=>cx+u*W*.62*(.08+z*1.25);
  S.fy=fy;S.fx=fx;
  S.bump=x=>{const b={x,a:0,v:0,t:0,s:W<700?46:70,live:true};bumps.push(b);return b};
  S.lineY=x=>{let d=0;for(const b of bumps)d+=b.a*Math.exp(-((x-b.x)**2)/(2*b.s*b.s));return hy+d};
  S.beam=x=>{const b={x,h:0,a:1,born:performance.now()};beams.push(b);marks.push({x,a:1});if(marks.length>4)marks.shift();marks.forEach((m,i)=>m.a=i===marks.length-1?1:.45);return b};
  S.setRiser=r=>riser=r;
  function draw(now){
    const t=(now-t0)/1000*o.speed;
    ctx.clearRect(0,0,W,H);
    // atmosphere: glow pooled at the threshold
    let g=ctx.createRadialGradient(cx,hy,0,cx,hy,Math.max(W,H)*.72);
    g.addColorStop(0,rgba(BONE,.2));g.addColorStop(.3,rgba(BONE,.05));g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    // light curtain rising from the line
    g=ctx.createLinearGradient(0,hy-H*.42,0,hy);
    g.addColorStop(0,rgba(BONE,0));g.addColorStop(.75,rgba(BONE,.05));g.addColorStop(1,rgba(BONE,.16));
    ctx.fillStyle=g;ctx.fillRect(0,hy-H*.42,W,H*.42);
    // floor: converging rails
    ctx.lineWidth=1;
    const rails=W<700?22:40;
    for(let i=0;i<=rails;i++){
      const u=(i/rails*2-1)*1.9;const x1=fx(u,1.25),y1=fy(1.25),x0=fx(u,.0);
      const lg=ctx.createLinearGradient(0,hy,0,H);lg.addColorStop(0,rgba(BONE,.02));lg.addColorStop(.2,rgba(BONE,.12));lg.addColorStop(1,rgba(BONE,.3));
      ctx.strokeStyle=lg;ctx.beginPath();ctx.moveTo(x0,hy);ctx.lineTo(x1,y1);ctx.stroke();
    }
    // floor: transverse lines drifting toward the viewer
    const N=18,off=(t*.05)%1;
    for(let k=0;k<N;k++){
      const z=Math.pow((k+off)/N,1.15);if(z<=.01)continue;const y=fy(z);
      ctx.strokeStyle=rgba(BONE,.05+z*.22);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();
    }
    // activity: points on the floor, busy but never crossing
    for(const a of acts){
      const y=fy(a.z),x=fx(a.u,a.z);if(x<-4||x>W+4)continue;
      const tw=.55+.45*Math.sin(t*a.s*2+a.p);
      const r=.5+a.z*1.6;ctx.fillStyle=rgba(BONE,(.12+a.z*.55)*tw);
      ctx.fillRect(x-r/2,y-r*1.6,r,r*2.2);
    }
    // dust in the air above
    for(const d of dust){d.y-=d.v;d.x+=Math.sin(t*.3+d.p)*.08;if(d.y<-4){d.y=hy;d.x=Math.random()*W}
      ctx.fillStyle=rgba(BONE,d.a*(.6+.4*Math.sin(t+d.p))*(.25+.75*(d.y/hy)));ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,6.283);ctx.fill()}
    // beams of things that crossed
    for(const b of beams){
      const age=(now-b.born)/1000;b.a=clamp(1-age/9,0,1);if(b.a<=0)continue;
      const top=hy-b.h;const bg=ctx.createLinearGradient(0,hy,0,top-80);
      bg.addColorStop(0,rgba(GOLD,.85*b.a));bg.addColorStop(1,rgba(GOLD,0));
      ctx.fillStyle=bg;ctx.fillRect(b.x-1,top-80,2,b.h+80);
      const glow=ctx.createRadialGradient(b.x,hy,0,b.x,hy,90);glow.addColorStop(0,rgba(GOLD,.28*b.a));glow.addColorStop(1,rgba(GOLD,0));
      ctx.fillStyle=glow;ctx.fillRect(b.x-90,hy-90,180,180);
    }
    beams=beams.filter(b=>b.a>0);
    // the line itself
    ctx.save();ctx.shadowColor=rgba(BONE,.7);ctx.shadowBlur=14;ctx.strokeStyle=rgba(BONE,.95);ctx.lineWidth=1.6;ctx.beginPath();
    for(let x=0;x<=W;x+=3){const y=S.lineY(x);x?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();ctx.restore();
    // evidence marks resting on the line
    for(const m of marks){ctx.fillStyle=rgba(GOLD,m.a);ctx.fillRect(m.x-4,hy-10,8,8)}
    // a riser on its way up
    if(riser){ctx.fillStyle=riser.gold?rgba(GOLD,1):rgba(BONE,.95);const s=riser.s||5;ctx.fillRect(riser.x-s/2,riser.y-s/2,s,s);
      if(riser.trail){const tg=ctx.createLinearGradient(0,riser.y,0,riser.y+120);tg.addColorStop(0,rgba(riser.gold?GOLD:BONE,.6));tg.addColorStop(1,rgba(BONE,0));ctx.fillStyle=tg;ctx.fillRect(riser.x-.5,riser.y,1,120)}}
  }
  let last=performance.now();
  function frame(now){
    const dt=Math.min(.033,(now-last)/1000);last=now;
    for(const b of bumps){const f=-160*(b.a-b.t)-12*b.v;b.v+=f*dt;b.a+=b.v*dt}
    bumps=bumps.filter(b=>b.live||Math.abs(b.a)>.05||Math.abs(b.v)>.05);
    if(vis)draw(now);
    requestAnimationFrame(frame);
  }
  size();
  new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(host);
  let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{const w=host.getBoundingClientRect().width;if(Math.abs(w-W)>30||!W){size();o.onResize&&o.onResize()}},180)});
  if(RM){draw(performance.now())}else requestAnimationFrame(frame);
  return S;
}

/* ---- home hero: the crossing ---- */
const hero=$('#hero');
if(hero){
  const cv=$('canvas',hero),lab=$('.hero-labels',hero),hz=$('.hero-horizon',hero);
  const anchor=()=>hz.getBoundingClientRect().top-hero.getBoundingClientRect().top;
  const S=Scene(cv,{anchor,crossing:true,onResize:()=>place()});
  const ACT=['Sends a proposal','Designs a pilot','Improves delivery','Builds a priced offer','Sends tailored outreach'];
  const RESP=['A customer pays','A partner agrees to run it','A customer orders again'];
  let actEls=[],respEls=[],ri=0,slot=0;
  function mk(cls,h){const e=document.createElement('div');e.className='hlbl '+cls;e.innerHTML=h;lab.appendChild(e);return e}
  const pos=(e,x,y)=>{e._x=x;e._y=y;e.style.transform=`translate(${x}px,${y}px)`};
  function place(){
    lab.innerHTML='';actEls=[];respEls=[];
    const W=S.W,m=W<700;
    const spots=m?[[-.7,.16]]:[[-1.05,.16],[-.62,.26],[-.28,.1]];
    spots.forEach(([u,z],i)=>{const e=mk('act',ACT[i]);e._u=u;e._z=z;pos(e,S.fx(u,z),S.fy(z));actEls.push(e)});
    if(RM){RESP.slice(0,m?1:2).forEach((r,i)=>{const e=mk('resp on','<small>Outside response · crossed</small><b>'+r+'</b>');const x=m?W*.38:W*(.6+i*.18);pos(e,x,S.hy-e.offsetHeight-26)})}
  }
  place();
  async function attempt(e){
    const z0=e._z,u=e._u,zt=.035;
    await tween(1600,p=>{const z=z0+(zt-z0)*p;pos(e,S.fx(u,z)-e.offsetWidth*p*.5,S.fy(z)-14*p)},eio);
    const b=S.bump(e._x+e.offsetWidth/2);b.t=-5;await sleep(380);b.t=0;b.live=false;
    e.style.transition='opacity .6s';e.style.opacity=0;await sleep(600);
    pos(e,S.fx(u,z0),S.fy(z0));await sleep(200);e.style.opacity=1;await sleep(600);e.style.transition='';
  }
  async function cross(){
    const W=S.W,m=W<700;const xs=m?[W*.62]:[W*.64,W*.82];const x=xs[slot++%xs.length];
    respEls.filter(r=>r._x0===x).forEach(r=>r.remove());respEls=respEls.filter(r=>r.isConnected);respEls.forEach(r=>r.classList.add('old'));
    // rise along the floor toward the line
    const R={x,y:S.fy(.9),s:6,trail:true};S.setRiser(R);
    await tween(2200,p=>{const z=.9+(.02-.9)*p;R.y=S.fy(z);R.s=6-3*p},eio);
    R.x=x;R.y=S.hy+3;
    // pressure on the threshold
    const b=S.bump(x);const t0=performance.now();
    await new Promise(r=>{const f=n=>{const p=Math.min(1,(n-t0)/800);b.t=-26*eio(p);R.y=S.lineY(x)+3;p<1?requestAnimationFrame(f):r()};requestAnimationFrame(f)});
    // break through
    b.t=0;b.v=520;b.live=false;R.gold=true;R.trail=false;R.s=7;
    const beam=S.beam(x);
    const e=mk('resp','<small>Outside response · crossed</small><b>'+RESP[ri++%RESP.length]+'</b>');e._x0=x;respEls.push(e);
    const ex=Math.min(x+16,W-e.offsetWidth-16);const ey=S.hy-e.offsetHeight-34;
    await tween(700,p=>{R.y=S.hy-(S.hy-ey-e.offsetHeight/2+10)*p;beam.h=S.hy-R.y},eo);
    S.setRiser(null);pos(e,ex,ey);e.classList.add('on');
  }
  if(!RM)(async()=>{await sleep(900);let i=0;for(;;){if(document.hidden){await sleep(800);continue}
    const a=actEls[i%actEls.length];if(a)await attempt(a);await sleep(300);
    if(i%2===0){await cross();await sleep(2600)}i++;await sleep(400)}})();
}
/* ---- inner page heroes: calm version of the same space ---- */
$$('.phero canvas').forEach(c=>Scene(c,{horizon:.5,speed:.6,density:.7,vx:.72}));

/* ============ nav ============ */
const nav=$('#nav');
if(nav){
  let lastY=scrollY;const sects=$$('[data-nav]');
  const upd=()=>{
    const y=scrollY;nav.classList.toggle('hide',y>lastY&&y>500&&!document.body.classList.contains('sheet-open'));lastY=y;
    nav.classList.toggle('solid',y>40);
    let theme='dark';for(const s of sects){const r=s.getBoundingClientRect();if(r.top<=40&&r.bottom>40){theme=s.dataset.nav;break}}
    nav.classList.toggle('light',theme==='light');
  };
  addEventListener('scroll',()=>requestAnimationFrame(upd),{passive:true});upd();
  const sheet=$('#sheet'),mb=$('#menuB'),cb=$('#sheetX');
  const open=v=>{sheet.hidden=!v;document.body.classList.toggle('sheet-open',v);document.body.style.overflow=v?'hidden':'';mb.setAttribute('aria-expanded',v);(v?cb:mb).focus()};
  mb&&mb.addEventListener('click',()=>open(true));cb&&cb.addEventListener('click',()=>open(false));
  addEventListener('keydown',e=>{if(e.key==='Escape'&&!sheet.hidden)open(false)});
  $$('#sheet a').forEach(a=>a.addEventListener('click',()=>{sheet.hidden=true;document.body.classList.remove('sheet-open');document.body.style.overflow=''}));
}

/* ============ reveals ============ */
if('IntersectionObserver' in window&&!RM){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');e.target.classList.remove('pending');io.unobserve(e.target)}}),{rootMargin:'0px 0px -12% 0px',threshold:.12});
  $$('.rv,.nope').forEach(el=>{if(el.classList.contains('nope'))el.classList.add('pending');io.observe(el)});
}else document.documentElement.classList.add('no-io');

/* ============ method: bottleneck → route ============ */
const bq=$('#bq');
if(bq){
  const EX=['Build a priced offer. Put it in front of a real buyer.','Find relevant prospects. Send tailored outreach. Work the replies.','Fix scope, pricing or delivery. Ask for the next order.'];
  const tabs=$$('button',bq),ex=$('#bex'),stns=$$('#track .stn'),rail=$('#track .rail i');let run=0;
  async function play(){const me=++run;stns.forEach(s=>s.classList.remove('on'));rail.style.transition='none';rail.style.transform='scaleX(0)';
    const vert=getComputedStyle($('#track')).gridTemplateColumns.split(' ').length<2;rail.style.transformOrigin=vert?'top':'left';
    void rail.offsetWidth;rail.style.transition='transform 2.4s cubic-bezier(.65,0,.35,1)';rail.style.transform=vert?'scaleY(1)':'scaleX(1)';
    for(let i=0;i<stns.length;i++){if(me!==run)return;stns[i].classList.add('on');await sleep(RM?0:520)}}
  function sel(i,f){tabs.forEach((b,j)=>{b.setAttribute('aria-selected',i===j);b.tabIndex=i===j?0:-1});
    ex.style.opacity=0;setTimeout(()=>{ex.textContent=EX[i];ex.style.opacity=1},RM?0:250);if(f)tabs[i].focus();play()}
  tabs.forEach((b,i)=>{b.addEventListener('click',()=>sel(i));b.addEventListener('keydown',e=>{if(/Arrow(Down|Right)/.test(e.key)){e.preventDefault();sel((i+1)%3,1)}if(/Arrow(Up|Left)/.test(e.key)){e.preventDefault();sel((i+2)%3,1)}})});
  new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){play();o.disconnect()}},{threshold:.4}).observe($('#track'));
}

/* ============ AI: stops at the founder (press and hold) ============ */
const pipe=$('#pipe');
if(pipe){
  const tok=$('#tok'),hold=$('#hold'),st=$('#aist'),ps=$$('.p',pipe),gate=$('.gate',pipe);let run=0,armed=false;
  const vert=()=>getComputedStyle(pipe).gridTemplateColumns.split(' ').length<3;
  function to(el){const pr=pipe.getBoundingClientRect(),r=el.getBoundingClientRect();
    tok.style.transform=vert()?`translate(0,${r.top-pr.top+(el===gate?r.height/2-10:0)}px)`:`translate(${r.left-pr.left+(el===gate?r.width/2-10:0)}px,0)`}
  async function go(){const me=++run;armed=false;pipe.classList.remove('open');tok.classList.remove('done');ps.forEach(p=>p.classList.remove('lit'));hold.disabled=true;hold.style.setProperty('--p',0);hold.classList.remove('full');
    tok.style.transition='none';to(ps[0]);void tok.offsetWidth;tok.style.transition='';
    st.innerHTML='<b>Running</b> · assistant researching and drafting';
    for(let i=0;i<4;i++){if(me!==run)return;ps[i].classList.add('lit');to(ps[i]);await sleep(RM?0:950)}
    if(me!==run)return;to(gate);await sleep(RM?0:700);
    st.innerHTML='<b>Stopped</b> · consequential action escalated to the founder';hold.disabled=false;armed=true}
  let raf=null,t0=0;
  function start(e){if(!armed)return;e.preventDefault();t0=performance.now();
    const f=n=>{const p=Math.min(1,(n-t0)/1100);hold.style.setProperty('--p',p);hold.classList.toggle('full',p>.5);if(p<1)raf=requestAnimationFrame(f);else done()};raf=requestAnimationFrame(f)}
  function stop(){if(raf){cancelAnimationFrame(raf);raf=null}if(armed){hold.style.setProperty('--p',0);hold.classList.remove('full')}}
  async function done(){raf=null;armed=false;hold.disabled=true;pipe.classList.add('open');st.innerHTML='<b>Approved</b> · by the founder';await sleep(RM?0:450);ps[4].classList.add('lit');to(ps[4]);await sleep(RM?0:900);tok.classList.add('done');st.innerHTML='<b>Done</b> · action taken after founder approval'}
  hold.addEventListener('pointerdown',start);['pointerup','pointerleave','pointercancel'].forEach(ev=>hold.addEventListener(ev,stop));
  hold.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!e.repeat)start(e)});hold.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter')stop()});
  $('#aire').addEventListener('click',go);
  new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){go();o.disconnect()}},{threshold:.45}).observe(pipe);
  addEventListener('resize',()=>{if(tok.classList.contains('done'))to(ps[4]);else if(armed)to(gate)});
}

/* ============ sorter: drag across the line ============ */
const sorter=$('#sorter');
if(sorter){
  const zA=$('.above',sorter),zB=$('.below',sorter),thr=$('.thr',sorter),msg=$('#smsg'),cards=$$('.card',sorter);
  function flip(c,dest,before){const a=c.getBoundingClientRect();before?dest.insertBefore(c,before):dest.appendChild(c);const b=c.getBoundingClientRect();
    if(!RM)c.animate([{transform:`translate(${a.left-b.left}px,${a.top-b.top}px)`},{transform:'none'}],{duration:800,easing:'cubic-bezier(.2,.7,.1,1)'})}
  function attempt(c){
    if(c.dataset.k==='resp'){if(c.parentElement===zA)return;c.classList.add('crossed');flip(c,zA);thr.classList.add('hot');setTimeout(()=>thr.classList.remove('hot'),700);msg.textContent=$('b',c).textContent+' crossed. That is outside evidence.'}
    else{c.classList.add('tried');$('.note',c).textContent='Stays below. We check what it leads to: '+c.dataset.l+'.';msg.textContent=$('b',c).textContent+' is activity. It does not cross on its own.';
      if(!RM)c.animate([{transform:'none'},{transform:'translateY(-40px)',offset:.4},{transform:'translateY(-30px)',offset:.55},{transform:'translateY(-36px)',offset:.7},{transform:'none'}],{duration:900,easing:'cubic-bezier(.2,.7,.1,1)'})}
  }
  cards.forEach(c=>{
    let sx,sy,moved=false,id=null;
    c.addEventListener('pointerdown',e=>{if(c.parentElement===zA)return;id=e.pointerId;sx=e.clientX;sy=e.clientY;moved=false;c.setPointerCapture(id)});
    c.addEventListener('pointermove',e=>{if(e.pointerId!==id)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(!moved&&Math.hypot(dx,dy)>6){moved=true;c.classList.add('drag')}
      if(moved){c.style.transform=`translate(${dx}px,${dy}px) rotate(${dx*.01}deg)`;const tr=thr.getBoundingClientRect(),cr=c.getBoundingClientRect();thr.classList.toggle('hot',cr.top<tr.top)}});
    const end=e=>{if(e.pointerId!==id)return;id=null;c.classList.remove('drag');thr.classList.remove('hot');
      if(!moved){c.style.transform='';attempt(c);return}
      const tr=thr.getBoundingClientRect(),cr=c.getBoundingClientRect();const over=cr.top+cr.height/2<tr.top;
      const cur=c.style.transform;c.style.transform='';
      if(over&&c.dataset.k==='resp'){const a=cr;c.classList.add('crossed');zA.appendChild(c);const b=c.getBoundingClientRect();if(!RM)c.animate([{transform:`translate(${a.left-b.left}px,${a.top-b.top}px)`},{transform:'none'}],{duration:600,easing:'cubic-bezier(.2,.7,.1,1)'});msg.textContent=$('b',c).textContent+' crossed. That is outside evidence.'}
      else{if(!RM)c.animate([{transform:cur},{transform:'none'}],{duration:700,easing:'cubic-bezier(.34,1.56,.64,1)'});if(over){c.classList.add('tried');$('.note',c).textContent='Stays below. We check what it leads to: '+c.dataset.l+'.';msg.textContent=$('b',c).textContent+' cannot cross. Activity is not progress.'}}};
    c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end);
    c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();attempt(c)}});
  });
  $('#sall').addEventListener('click',async()=>{for(const c of cards){attempt(c);await sleep(RM?0:240)}msg.textContent='Three crossed. Three stayed below. Founders do the work; we check what changed outside the venture.'});
  $('#sre').addEventListener('click',()=>{cards.forEach(c=>{c.classList.remove('crossed','tried');$('.note',c)&&($('.note',c).textContent='');zB.appendChild(c)});msg.textContent='Drag a card across the line, or select it.'});
}

/* ============ gates: the ascent ============ */
const gates=$('#gates');
if(gates){
  const cv=$('canvas',gates),ctx=cv.getContext('2d'),pin=$('.pin',gates),gl=$$('.gl',gates);
  const LV=[.84,.63,.42];let W,H,dpr,p=0,trail=[];
  function size(){const r=pin.getBoundingClientRect();W=r.width;H=r.height;dpr=Math.min(2,devicePixelRatio||1);cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);gl.forEach((g,i)=>g.style.top=(LV[i]*H)+'px')}
  size();addEventListener('resize',size);
  function prog(){if(RM)return 1;const r=gates.getBoundingClientRect();return clamp(-r.top/(r.height-innerHeight),0,1)}
  function draw(){
    const px=W<700?Math.max(28,W*.08):W*.2;const y=H*(.94-p*.84);
    ctx.clearRect(0,0,W,H);
    let g=ctx.createRadialGradient(px,y,0,px,y,H*.7);g.addColorStop(0,rgba(GOLD,.09));g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    LV.forEach((lv,i)=>{const ly=lv*H,on=y<ly;
      const lg=ctx.createLinearGradient(0,0,W,0);lg.addColorStop(0,rgba(BONE,on?.9:.18));lg.addColorStop(.6,rgba(BONE,on?.55:.12));lg.addColorStop(1,rgba(BONE,on?.2:.05));
      ctx.save();if(on){ctx.shadowColor=rgba(BONE,.6);ctx.shadowBlur=10}ctx.strokeStyle=lg;ctx.lineWidth=on?1.6:1;ctx.beginPath();ctx.moveTo(0,ly);ctx.lineTo(W,ly);ctx.stroke();ctx.restore();
      if(on){ctx.fillStyle=rgba(GOLD,1);ctx.fillRect(px-4,ly-4,8,8)}
      gl[i].classList.toggle('on',on)});
    const tg=ctx.createLinearGradient(0,y,0,H);tg.addColorStop(0,rgba(GOLD,.9));tg.addColorStop(1,rgba(GOLD,0));ctx.fillStyle=tg;ctx.fillRect(px-1,y,2,H-y);
    ctx.save();ctx.shadowColor=rgba(GOLD,.9);ctx.shadowBlur=24;ctx.fillStyle=rgba(GOLD,1);ctx.fillRect(px-6,y-6,12,12);ctx.restore();
  }
  let want=0;const loop=()=>{want=prog();p+=(want-p)*(RM?1:.12);draw();requestAnimationFrame(loop)};loop();
}

/* ============ proof by venture model ============ */
const mt=$('#mt');
if(mt){
  const M=[['Earned revenue','Payments, repeat purchases and workable delivery costs.'],['Business / government','Buyer commitments, completed pilots and renewals.'],['Marketplace','Real transactions, repeat use and sustainable fees.'],['Grant-funded impact','Funded delivery, verified outcomes and renewed support.'],['Industrial / hardware','Independent tests, certifications where needed and paid orders.'],['Blended capital','Commercial results and impact evidence that justify the funding mix.']];
  const ev=$('#mev');
  M.forEach((m,i)=>{const b=document.createElement('button');b.setAttribute('role','tab');b.id='mt'+i;b.textContent=m[0];b.setAttribute('aria-selected',i===0);b.tabIndex=i?-1:0;b.setAttribute('aria-controls','mev');
    b.onclick=()=>sel(i);b.onkeydown=e=>{if(e.key==='ArrowRight'){e.preventDefault();sel((i+1)%6,1)}if(e.key==='ArrowLeft'){e.preventDefault();sel((i+5)%6,1)}};mt.appendChild(b)});
  function sel(i,f){$$('button',mt).forEach((b,j)=>{b.setAttribute('aria-selected',i===j);b.tabIndex=i===j?0:-1});ev.style.opacity=0;setTimeout(()=>{ev.textContent=M[i][1];ev.style.opacity=1},RM?0:220);if(f)$('#mt'+i).focus()}
  ev.textContent=M[0][1];
}

/* ============ work backwards from the next yes ============ */
const wb=$('#wb');
if(wb){
  const rng=$('#wbr'),line=$('.wb-line',wb),nodes=$$('.wb-node',wb),stops=[0,33,66,100];
  function upd(){const v=+rng.value;const wide=getComputedStyle($('.wb-nodes',wb)).gridTemplateColumns.split(' ').length===4;
    line.style.width=wide?((100-v)*(1-0)+0)+'%':'0';
    nodes.forEach((n,i)=>n.classList.toggle('on',(100-v)>=(100-stops[i])-0.5||i===3));
    rng.setAttribute('aria-valuetext',['The work this week','The smallest credible test','The evidence they need','The next yes'][Math.round(v/33.34)])}
  // value 100 = at the next yes; dragging left (rtl) lowers the value toward today
  rng.addEventListener('input',upd);upd();
  async function play(){for(let v=100;v>=0;v-=1){rng.value=v;upd();await sleep(RM?0:22)}}
  $('#wbp').addEventListener('click',()=>{rng.value=100;upd();play()});
  new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){setTimeout(play,500);o.disconnect()}},{threshold:.5}).observe(wb);
  $$('#yes button').forEach(b=>b.addEventListener('click',()=>{$$('#yes button').forEach(x=>x.setAttribute('aria-pressed',x===b));$('#yesT').textContent=b.dataset.y}));
}

/* ============ follow the cheque ============ */
const cs=$('#cstage');
if(cs){
  const cq=$('#cq'),cqt=$('#cqt'),bt=$('#bart'),msg=$('#cmsg'),roles=$('#roles');
  const bEv=$('#cEv'),bD=$$('[data-d]'),bPay=$('#cPay'),bRe=$('#cRe');
  let st=0,x=0;
  const barX=()=>cs.clientWidth*parseFloat(getComputedStyle(cs.querySelector('.bar')).left)/cs.clientWidth;
  const maxX=()=>cs.clientWidth-cq.offsetWidth;const stopX=()=>barX()-cq.offsetWidth-10;
  const setX=(v,anim)=>{x=v;cq.style.transition=anim?'transform 1.1s cubic-bezier(.2,.7,.1,1)':'none';cq.style.transform=`translateX(${v}px)`};
  const focus=r=>{roles.classList.toggle('focus',!!r);$$('.role',roles).forEach(e=>e.classList.toggle('hot',e.dataset.r===r))};
  function render(){
    bEv.disabled=st!==0;bD.forEach(b=>b.disabled=st!==1);bPay.disabled=st!==2;
    cs.classList.toggle('open',st>=2&&st!==9);cq.classList.toggle('paid',st===3);
    if(st===0){cqt.textContent='Capital request';bt.textContent='Panel decision required';msg.textContent='A venture requests capital against its next result. Try sending the cheque across.';focus(null)}
    if(st===1){cqt.textContent='Request + checked evidence';msg.textContent='Threshold has checked dated, attributable evidence. The independent panel decides.';focus('panel')}
    if(st===2){bt.textContent=bt.dataset.d;msg.textContent='Decision made. Only the sponsor disburses: drag the cheque across, or release it.';focus('sponsor')}
    if(st===3){cqt.textContent='Disbursed by the sponsor';msg.textContent='Crossed. Threshold never held the capital.';focus('sponsor')}
    if(st===9){msg.textContent=bt.dataset.m;focus('panel')}
  }
  function reset(){st=0;setX(0,true);render()}
  function block(){cq.classList.remove('shake');void cq.offsetWidth;cq.classList.add('shake');msg.textContent=st===9?bt.dataset.m:'The cheque cannot cross until the panel decides.'}
  bEv.onclick=()=>{st=1;focus('threshold');msg.textContent='Threshold checks dated, attributable evidence.';setTimeout(render,RM?0:900)};
  bD.forEach(b=>b.onclick=()=>{const d=b.dataset.d;if(d==='a'||d==='c'){bt.dataset.d=d==='a'?'Approved':'Approved with conditions';st=2;render()}else{bt.textContent=d==='f'?'Deferred':'Declined';bt.dataset.m=d==='f'?'Deferred. The cheque stays with the sponsor. Further funding follows evidence.':'Declined. Not an automatic exit: review the bottleneck, then extend, adapt or pause.';st=9;render();block()}});
  bPay.onclick=()=>{st=3;setX(maxX(),true);render()};
  bRe.onclick=reset;
  let id=null,sx=0,x0=0;
  cq.addEventListener('pointerdown',e=>{if(st===3)return;id=e.pointerId;sx=e.clientX;x0=x;cq.setPointerCapture(id);cq.classList.add('drag')});
  cq.addEventListener('pointermove',e=>{if(e.pointerId!==id)return;let v=x0+e.clientX-sx;const lim=st===2?maxX():stopX();if(v>lim){v=lim+Math.min(14,(v-lim)*.15)}setX(clamp(v,0,maxX()))});
  const up=e=>{if(e.pointerId!==id)return;id=null;cq.classList.remove('drag');
    if(st===2&&x>barX()-cq.offsetWidth*.4){st=3;setX(maxX(),true);render()}
    else if(st!==2&&x>=stopX()-2){block();setX(0,true)}
    else setX(st===2?x:0,true)};
  cq.addEventListener('pointerup',up);cq.addEventListener('pointercancel',up);
  addEventListener('resize',()=>{if(st===3)setX(maxX())});
  render();
}

/* ============ LIFT: five illustrative routes ============ */
const lanes=$('#lanes');
if(lanes){
  const rows=$$('.lane5',lanes);
  function shuffle(){rows.forEach(r=>{const cells=$$('i',r);cells.forEach((c,k)=>{c.className=k===0?'b':(k===12?'r':'')});
    const pick=new Set();while(pick.size<6)pick.add(1+Math.floor(Math.random()*11));[...pick].forEach(k=>cells[k].className='s')})}
  shuffle();$('#reshuffle')&&$('#reshuffle').addEventListener('click',shuffle);
}

/* ============ LIFT: selection scoring ============ */
const sc=$('#score');
if(sc){
  const tot=$('#stot'),dq=$('#sdq');
  function upd(){let s=0;$$('[data-row]',sc).forEach(r=>{const on=$('button[aria-pressed="true"]',r);s+=on?+on.dataset.v:0});
    const killed=dq.getAttribute('aria-pressed')==='true';sc.classList.toggle('killed',killed);tot.textContent=s+' / 18';$('#snote').textContent=killed?'A hard disqualifier overrides the total score.':'Score evidence, not narrative.'}
  $$('[data-row]',sc).forEach(r=>$$('button',r).forEach(b=>b.addEventListener('click',()=>{$$('button',r).forEach(x=>x.setAttribute('aria-pressed',x===b&&b.getAttribute('aria-pressed')!=='true'));upd()})));
  dq.addEventListener('click',()=>{dq.setAttribute('aria-pressed',dq.getAttribute('aria-pressed')!=='true');upd()});upd();
}

/* ============ BUILD: month-3 gate ============ */
const g3=$('#g3');
if(g3){const segs=$$('[data-after]');const out=$('#g3o');
  $$('button',g3).forEach(b=>b.addEventListener('click',()=>{$$('button',g3).forEach(x=>x.setAttribute('aria-pressed',x===b));const go=b.dataset.v==='go';segs.forEach(s=>s.style.opacity=go?1:.18);out.textContent=go?'Proceed: you deploy capital and the fellowship begins.':'Pause: no fellowship and no capital deployed. You keep the design and the selected pool.'}))}

/* ============ pathway table (BUILD A9) ============ */
$$('.tbl tbody tr').forEach(tr=>{tr.tabIndex=0;const f=()=>{$$('tr',tr.parentElement).forEach(x=>x.classList.toggle('sel',x===tr))};tr.addEventListener('click',f);tr.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f()}})});

/* ============ begin: next-result map ============ */
const mf=$('#mapf');
if(mf){
  const mode=$$('#mode button'),out=$('#mapOut'),send=$('#mapSend');let m='venture';
  mode.forEach(b=>b.addEventListener('click',()=>{m=b.dataset.m;mode.forEach(x=>x.setAttribute('aria-pressed',x===b));$('#f0l').textContent=m==='mission'?'The mission you want to back':'The venture you want to bring';build()}));
  function build(){const v=id=>($('#'+id).value||'').trim();
    const lines=[(m==='mission'?'BUILD · Bring one mission':'LIFT · Bring one venture'),'',(m==='mission'?'Mission: ':'Venture: ')+(v('f0')||'—'),'Next result: '+(v('f1')||'—'),'Work to do: '+(v('f2')||'—'),'Proof to seek: '+(v('f3')||'—'),'Next decision: '+(v('f4')||'—'),'','From: '+(v('f5')||'—')];
    out.textContent=lines.join('\n');
    send.href='mailto:nihal@limitless.institute?subject='+encodeURIComponent('Threshold · '+(m==='mission'?'Bring one mission':'Bring one venture'))+'&body='+encodeURIComponent(lines.join('\n'))}
  $$('input,textarea',mf).forEach(i=>i.addEventListener('input',build));build();
  $('#mapCopy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(out.textContent);$('#mapMsg').textContent='Copied.'}catch(e){$('#mapMsg').textContent='Select the text and copy it.'}});
}

/* ============ copy address ============ */
$$('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);b.textContent='Copied'}catch(e){b.textContent='Select and copy'}setTimeout(()=>b.textContent='Copy address',2200)}));
})();
