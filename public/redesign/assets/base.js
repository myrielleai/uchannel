/* U Channel shared behaviour for inner pages. Exposes window.UC. */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE=matchMedia('(pointer: fine)').matches;
const HAS_GSAP=!!window.gsap;
const PAL=['#6C97D3','#FFC49C','#FFAB72','#FB9B51','#FF8732','#FFFFFF'];
const hexRgb=h=>{h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];};
const PALRGB=PAL.map(hexRgb);
document.documentElement.classList.add('js');
if(HAS_GSAP && window.ScrollTrigger){ gsap.registerPlugin(ScrollTrigger); document.documentElement.classList.add('js-drench'); }

/* smooth scroll */
let lenis=null;
if(HAS_GSAP && window.Lenis && !REDUCED && FINE){
  lenis=new Lenis({duration:1.15,smoothWheel:true});
  lenis.on('scroll',ScrollTrigger.update);
  gsap.ticker.add(t=>lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0);
}
function scrollToEl(el,offset){ if(!el) return; if(lenis) lenis.scrollTo(el,{offset:offset==null?-10:offset,duration:1.4}); else el.scrollIntoView({behavior:REDUCED?'auto':'smooth'}); }

/* page transition */
const pt=document.createElement('div'); pt.className='pt'; pt.setAttribute('aria-hidden','true'); pt.innerHTML='<i></i>'.repeat(8); document.body.appendChild(pt);
const cols=$$('i',pt);
if(HAS_GSAP && !REDUCED){ gsap.set(cols,{scaleY:1,transformOrigin:'50% 100%'}); gsap.to(cols,{scaleY:0,duration:.7,ease:'expo.inOut',stagger:.05,delay:.05,onComplete:()=>pt.style.visibility='hidden'}); }
else pt.style.display='none';
function go(href){ if(!HAS_GSAP||REDUCED){ location.href=href; return; } pt.style.visibility='visible'; gsap.fromTo(cols,{scaleY:0,transformOrigin:'50% 0%'},{scaleY:1,duration:.55,ease:'expo.inOut',stagger:.04,onComplete:()=>{ location.href=href; }}); }
addEventListener('pageshow',e=>{ if(e.persisted && HAS_GSAP){ gsap.set(cols,{scaleY:0}); pt.style.visibility='hidden'; } });

/* links */
const drawer=$('#drawer'), menuBtn=$('#menuBtn');
function openMenu(){ if(!drawer) return; drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); menuBtn.setAttribute('aria-expanded','true'); $('#menuClose').focus(); }
function closeMenu(){ if(!drawer||!drawer.classList.contains('open')) return; drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); menuBtn.setAttribute('aria-expanded','false'); }
menuBtn && menuBtn.addEventListener('click',openMenu); $('#menuClose') && $('#menuClose').addEventListener('click',closeMenu);
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeMenu(); });
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href]'); if(!a || a.target==='_blank' || e.metaKey || e.ctrlKey) return;
  const href=a.getAttribute('href');
  if(href.startsWith('#')){ const id=href.slice(1); const el=id?document.getElementById(id):document.body; if(!el) return; e.preventDefault(); closeMenu(); scrollToEl(el); return; }
  if(/^[\w-]+\.html(#[\w-]+)?$/.test(href)){ e.preventDefault(); closeMenu(); go(href); }
});
addEventListener('load',()=>{ const id=location.hash.slice(1); if(id && /^[\w-]+$/.test(id)){ const el=document.getElementById(id); if(el) setTimeout(()=>scrollToEl(el,-80),350); } });

/* cursor */
if(FINE && !REDUCED){
  document.documentElement.classList.add('has-cursor');
  const cur=document.createElement('div'); cur.className='cursor'; cur.setAttribute('aria-hidden','true'); cur.innerHTML='<div class="px"></div><div class="lbl"></div>'; document.body.appendChild(cur);
  const lbl=$('.lbl',cur);
  const trails=[]; for(let i=0;i<4;i++){ const t=document.createElement('div'); t.className='trail'; t.style.background=PAL[i+1]; t.style.opacity=String(.8-i*.18); document.body.appendChild(t); trails.push({el:t,x:0,y:0}); }
  let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;
  addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;},{passive:true});
  (function loop(){ cx+=(mx-cx)*.28; cy+=(my-cy)*.28; cur.style.transform=`translate(${cx}px,${cy}px)`;
    let px=cx,py=cy; trails.forEach((t,i)=>{ t.x+=(px-t.x)*(.35-i*.05); t.y+=(py-t.y)*(.35-i*.05); t.el.style.transform=`translate(${t.x}px,${t.y}px)`; px=t.x; py=t.y; });
    requestAnimationFrame(loop); })();
  document.addEventListener('pointerover',e=>{
    const lab=e.target.closest('[data-cursor]'); const link=e.target.closest('a,button,label,.tab');
    if(lab){ lbl.textContent=lab.dataset.cursor; cur.classList.add('is-label'); cur.classList.remove('is-link'); }
    else if(link){ cur.classList.add('is-link'); cur.classList.remove('is-label'); }
    else cur.classList.remove('is-label','is-link');
    const field=e.target.closest('input,textarea,select'); cur.style.opacity=field&&!lab?'0':'1';
  });
}

/* LED wall engine */
const FONT={A:['01110','10001','10001','11111','10001','10001','10001'],B:['11110','10001','10001','11110','10001','10001','11110'],C:['01110','10001','10000','10000','10000','10001','01110'],D:['11110','10001','10001','10001','10001','10001','11110'],E:['11111','10000','10000','11110','10000','10000','11111'],H:['10001','10001','10001','11111','10001','10001','10001'],I:['01110','00100','00100','00100','00100','00100','01110'],L:['10000','10000','10000','10000','10000','10000','11111'],M:['10001','11011','10101','10101','10001','10001','10001'],N:['10001','11001','10101','10011','10001','10001','10001'],O:['01110','10001','10001','10001','10001','10001','01110'],P:['11110','10001','10001','11110','10000','10000','10000'],R:['11110','10001','10001','11110','10100','10010','10001'],S:['01111','10000','10000','01110','00001','00001','11110'],T:['11111','00100','00100','00100','00100','00100','00100'],U:['10001','10001','10001','10001','10001','10001','01110'],W:['10001','10001','10001','10101','10101','10101','01010'],Y:['10001','10001','01010','00100','00100','00100','00100'],'0':['01110','10011','10101','10101','11001','10001','01110'],'2':['01110','10001','00001','00010','00100','01000','11111'],'.':['00000','00000','00000','00000','00000','01100','01100'],' ':['00000','00000','00000','00000','00000','00000','00000']};
function textBitmap(str){ const cols=[]; for(const ch of str){ const g=FONT[ch]||FONT[' ']; for(let c=0;c<5;c++) cols.push(g.map(r=>r[c]==='1')); cols.push(new Array(7).fill(false)); } return cols; }
class LedWall{
  constructor(canvas,o={}){ this.c=canvas; this.x=canvas.getContext('2d'); this.o=Object.assign({cell:26,gap:5,radius:6,dim:[28,47,85],bg:'#0d1a31',message:null,brush:2.2,ambient:true,lit:null,mask:null},o);
    this.ripples=[]; this.visible=false; this.p=null; this.hue=0; this.msgOffset=0; if(this.o.message&&!REDUCED) this.bitmap=textBitmap(this.o.message);
    this.resize(); new ResizeObserver(()=>this.resize()).observe(canvas);
    new IntersectionObserver(es=>{ this.visible=es[0].isIntersecting; if(this.visible&&!this.raf&&!REDUCED) this.loop(); },{threshold:0}).observe(canvas);
    const pos=e=>{ const r=this.c.getBoundingClientRect(); return [(e.clientX-r.left)/this.o.cell,(e.clientY-r.top)/this.o.cell]; };
    const target=o.listen||canvas;
    if(!o.noPaint){
      target.addEventListener('pointermove',e=>{ const [gx,gy]=pos(e); if(this.p){ const dx=gx-this.p[0],dy=gy-this.p[1],d=Math.hypot(dx,dy); for(let s=0;s<=d;s+=.5) this.paint(this.p[0]+dx*s/(d||1),this.p[1]+dy*s/(d||1)); } this.p=[gx,gy]; this.paint(gx,gy); if(REDUCED) this.draw(); });
      target.addEventListener('pointerleave',()=>this.p=null);
    }
    if(!o.noClick) target.addEventListener('pointerdown',e=>{ const [gx,gy]=pos(e); this.ripples.push({x:gx,y:gy,r:0,col:(this.hue|0)%5}); });
  }
  resize(){ const r=this.c.getBoundingClientRect(), dpr=Math.min(2,devicePixelRatio||1); if(!r.width) return; this.w=r.width; this.h=r.height; this.c.width=r.width*dpr; this.c.height=r.height*dpr; this.x.setTransform(dpr,0,0,dpr,0,0);
    this.cols=Math.ceil(this.w/this.o.cell); this.rows=Math.ceil(this.h/this.o.cell); this.I=new Float32Array(this.cols*this.rows); this.C=new Uint8Array(this.cols*this.rows);
    this.M=null; if(this.o.mask) this.M=this.o.mask(this.cols,this.rows); this.draw(); }
  paint(gx,gy){ const b=this.o.brush; this.hue+=.08; const col=(this.hue|0)%5;
    for(let y=Math.floor(gy-b);y<=gy+b;y++) for(let x=Math.floor(gx-b);x<=gx+b;x++){ if(x<0||y<0||x>=this.cols||y>=this.rows) continue; const d=Math.hypot(x+.5-gx,y+.5-gy); if(d>b) continue; const i=y*this.cols+x; if(this.M&&!this.M[i]) continue; const v=1-d/b*.6; if(v>this.I[i]){ this.I[i]=v; this.C[i]=col; } } }
  loop(){ this.raf=requestAnimationFrame(()=>{ this.raf=null; if(!this.visible) return; this.step(); this.draw(); this.loop(); }); }
  step(){ const I=this.I; for(let i=0;i<I.length;i++) I[i]*=.955; this.t=(this.t||0)+1;
    this.ripples.forEach(rp=>{ rp.r+=.55; for(let y=0;y<this.rows;y++) for(let x=0;x<this.cols;x++){ const i=y*this.cols+x; if(this.M&&!this.M[i]) continue; const d=Math.abs(Math.hypot(x+.5-rp.x,y+.5-rp.y)-rp.r); if(d<.9){ I[i]=Math.max(I[i],1-rp.r/60); this.C[i]=(rp.col+((x+y)>>2))%5; } } });
    this.ripples=this.ripples.filter(r=>r.r<60);
    if(this.o.ambient && Math.random()<.5){ const i=(Math.random()*I.length)|0; if((!this.M||this.M[i]) && I[i]<.3){ I[i]=.35; this.C[i]=(Math.random()*5)|0; } } }
  draw(){ if(!this.I) return; const {x}=this,{cell,gap,radius,dim}=this.o; x.fillStyle=this.o.bg; x.fillRect(0,0,this.w,this.h);
    let msg=null, top=0, scale=1; if(this.bitmap){ scale=this.rows>=18?2:1; top=Math.floor((this.rows-7*scale)/2); this.msgOffset+=.07; msg=this.bitmap; }
    const s=cell-gap;
    for(let gy=0;gy<this.rows;gy++) for(let gx=0;gx<this.cols;gx++){ const i=gy*this.cols+gx; if(this.M&&!this.M[i]) continue; let v=this.I[i], col=PALRGB[this.C[i]];
      if(this.o.lit){ const L=this.o.lit(gx,gy,this.cols,this.rows,this.t||0); if(L){ if(L.v>=v){ v=L.v; col=L.c; } } }
      if(msg){ const my=gy-top; if(my>=0&&my<7*scale){ const mx=Math.floor((gx+this.msgOffset)/scale)%msg.length; if(msg[mx][Math.floor(my/scale)] && v<.55){ v=.55; col=PALRGB[3]; } } }
      const r=dim[0]+(col[0]-dim[0])*v, g=dim[1]+(col[1]-dim[1])*v, b=dim[2]+(col[2]-dim[2])*v;
      x.fillStyle=`rgb(${r|0},${g|0},${b|0})`; const px=gx*cell+gap/2, py=gy*cell+gap/2;
      if(x.roundRect){ x.beginPath(); x.roundRect(px,py,s,s,radius); x.fill(); } else x.fillRect(px,py,s,s); } }
}

/* counters */
function counters(root=document){
  $$('[data-count]',root).forEach(el=>{ const to=+el.dataset.count, from=+(el.dataset.from||0), suf=el.dataset.suffix||'', pre=el.dataset.prefix||'', fmt=v=>pre+Math.round(v).toLocaleString('en-US')+suf;
    if(!HAS_GSAP||REDUCED){ el.textContent=fmt(to); return; }
    const o={v:from}; ScrollTrigger.create({trigger:el,start:'top 92%',once:true,onEnter:()=>gsap.to(o,{v:to,duration:1.6,ease:'expo.out',onUpdate:()=>el.textContent=fmt(o.v)})}); });
}

/* contact form */
function prefill(o){ if(o.company!=null) $('#fCompany').value=o.company; if(o.interest) $('#fInterest').value=o.interest; if(o.details!=null) $('#fDetails').value=o.details; scrollToEl($('#contact')); }
const qf=$('#qf');
qf && qf.addEventListener('submit',e=>{ e.preventDefault(); const name=$('#fName').value.trim(), email=$('#fEmail').value.trim(), s=$('#sent');
  if(!name||!/.+@.+\..+/.test(email)){ s.textContent='Add your name and a work email so we can reply.'; qf.classList.add('done'); (!name?$('#fName'):$('#fEmail')).focus(); return; }
  s.textContent=`Thanks, ${name}. This is a prototype, so nothing was sent yet. On the live site this goes straight to sales@uchannel.ph.`; qf.classList.add('done');
  if(HAS_GSAP&&!REDUCED) gsap.fromTo(s,{scale:.9},{scale:1,duration:.5,ease:'back.out(2)'}); });

/* footer blocks */
const fb=$('#footBlocks');
if(fb){ const hs=[40,70,100,130,160,130,100,70,40,70,100,130,160,180], cs=['#6C97D3','#FFC49C','#FFAB72','#FB9B51','#FF8732'];
  hs.forEach((h,i)=>{ const b=document.createElement('button'); b.type='button'; b.setAttribute('aria-label','Bounce block '+(i+1)); b.style.height=Math.round(h*(innerWidth<560?.66:1))+'px'; b.style.background=i===hs.length-1?'#FFFFFF':cs[i%5];
    const hop=()=>{ if(HAS_GSAP&&!REDUCED) gsap.fromTo(b,{y:0},{y:-40-Math.random()*40,duration:.28,ease:'power2.out',yoyo:true,repeat:1}); };
    b.addEventListener('pointerenter',hop); b.addEventListener('click',()=>$$('#footBlocks button').forEach((x,j)=>setTimeout(()=>x.dispatchEvent(new Event('pointerenter')),j*45))); fb.appendChild(b); }); }

/* colour drench (call after page sets up pins) */
function drench(){
  if(!HAS_GSAP) return; const secs=$$('[data-bg]'); let current=null, queued=false;
  const check=()=>{ queued=false; const line=innerHeight*.6; let hit=null; for(const sec of secs){ const r=sec.getBoundingClientRect(); if(r.top<=line && r.bottom>line) hit=sec; }
    if(hit && hit!==current){ current=hit; gsap.to(document.body,{backgroundColor:hit.dataset.bg,color:hit.dataset.fg,duration:.7,ease:'power2.out',overwrite:true}); document.dispatchEvent(new CustomEvent('uc:section',{detail:hit})); } };
  const q=()=>{ if(!queued){ queued=true; requestAnimationFrame(check); } };
  if(lenis) lenis.on('scroll',q); addEventListener('scroll',q,{passive:true}); addEventListener('resize',q); check();
}

window.UC={$,$$,REDUCED,FINE,HAS_GSAP,PAL,PALRGB,lenis,LedWall,textBitmap,scrollToEl,counters,prefill,drench,go};
})();
