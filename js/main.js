(function(){
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const menuBtn=document.getElementById("menuBtn"), nav=document.getElementById("mainNav"), header=document.getElementById("top");
if(menuBtn){
  menuBtn.addEventListener("click",()=>{const o=nav.classList.toggle("open");menuBtn.setAttribute("aria-expanded",String(o));});
  nav.querySelectorAll("a").forEach(l=>l.addEventListener("click",()=>{nav.classList.remove("open");menuBtn.setAttribute("aria-expanded","false");}));
}
const bar=document.createElement("div");bar.className="progress";document.body.appendChild(bar);

// Titulares por palabra
function splitNode(node,c){
  [...node.childNodes].forEach(n=>{
    if(n.nodeType===3){
      const frag=document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(part=>{
        if(!part)return;
        if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(" "));return;}
        const w=document.createElement("span");w.className="w";w.setAttribute("aria-hidden","true");
        const s=document.createElement("span");s.textContent=part;s.style.setProperty("--i",c.i++);
        w.appendChild(s);frag.appendChild(w);
      });
      n.replaceWith(frag);
    }else if(n.nodeType===1&&n.tagName!=="BR"){splitNode(n,c);}
  });
}
if(!reduce){
  document.querySelectorAll("h1,h2,blockquote").forEach(el=>{
    el.setAttribute("aria-label",el.textContent.trim().replace(/\s+/g," "));
    el.classList.remove("reveal");el.classList.add("split","rv");
    splitNode(el,{i:0});
  });
}

// Revelado al hacer scroll
const targets=document.querySelectorAll(".reveal,.rv,.clip");
if("IntersectionObserver" in window&&!reduce){
  // Un elemento recortado con clip-path nunca "intersecta": se observa su contenedor.
  const map=new Map();
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){(map.get(e.target)||[e.target]).forEach(t=>t.classList.add("in"));io.unobserve(e.target);}}),{threshold:.12,rootMargin:"0px 0px -6% 0px"});
  targets.forEach(el=>{
    if(el.closest(".hero,.page-hero"))return;
    const t=el.classList.contains("clip")?el.parentElement:el;
    if(!map.has(t)){map.set(t,[]);io.observe(t);}
    map.get(t).push(el);
  });
}else{targets.forEach(el=>el.classList.add("in"));}

// Parallax, header y progreso
const hb=document.querySelector(".hero-bg");
const pxImgs=[...document.querySelectorAll(".px img,.detail-image img")];
let ticking=false;
function frame(){
  const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  header.classList.toggle("scrolled",y>40);
  bar.style.transform="scaleX("+(h>0?y/h:0)+")";
  if(!reduce){
    if(hb&&y<innerHeight*1.2)hb.style.transform="translate3d(0,"+(y*.28)+"px,0)";
    pxImgs.forEach(img=>{
      const r=img.parentElement.getBoundingClientRect();
      if(r.bottom<0||r.top>innerHeight)return;
      const p=(r.top+r.height/2-innerHeight/2)/innerHeight;
      img.style.transform="translate3d(0,"+(p*-8)+"%,0)";
    });
  }
  ticking=false;
}
addEventListener("scroll",()=>{if(!ticking){ticking=true;requestAnimationFrame(frame);}},{passive:true});
addEventListener("resize",frame);frame();

// Botones magnéticos
if(!reduce&&matchMedia("(hover:hover)").matches){
  document.querySelectorAll(".cta,.round-link").forEach(b=>{
    b.addEventListener("mousemove",e=>{const r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.18)+"px "+((e.clientY-r.top-r.height/2)*.28)+"px";});
    b.addEventListener("mouseleave",()=>{b.style.translate="";});
  });
}

// Transición entre páginas
document.querySelectorAll("a[href]").forEach(a=>{
  const href=a.getAttribute("href");
  if(!href||href.startsWith("#")||/^(https?:|mailto:|tel:)/.test(href)||a.target)return;
  a.addEventListener("click",e=>{
    if(e.metaKey||e.ctrlKey||e.shiftKey||reduce)return;
    e.preventDefault();document.body.classList.add("leaving");
    setTimeout(()=>{location.href=href;},330);
  });
});
addEventListener("pageshow",e=>{if(e.persisted)document.body.classList.remove("leaving");});
})();
