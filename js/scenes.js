// Hero por escenas: usa solo las imágenes que existan en assets/
(function(){
  const box=document.getElementById("heroScenes"),rail=document.getElementById("sceneRail");
  if(!box||!rail)return;
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const all=[...box.querySelectorAll(".scene")];
  const ready=all.map(sc=>new Promise(res=>{
    const img=sc.querySelector("img"),src=sc.dataset.src;
    if(!src){res(sc);return;}
    const t=new Image();
    t.onload=()=>{img.src=src;res(sc);};
    t.onerror=()=>{sc.remove();res(null);};
    t.src=src;
  }));
  Promise.all(ready).then(list=>{
    const scenes=list.filter(Boolean);
    if(scenes.length<2){rail.remove();return;}
    const DUR=6500;let i=0,timer=null;
    scenes.forEach(s=>s.classList.remove("active"));
    const btns=scenes.map((s,n)=>{
      const li=document.createElement("li"),b=document.createElement("button");
      b.type="button";b.innerHTML='<span>'+String(n+1).padStart(2,"0")+" · "+s.dataset.label+"</span><i></i>";
      b.addEventListener("click",()=>{go(n);restart();});
      li.appendChild(b);rail.appendChild(li);return b;
    });
    rail.style.setProperty("--dur",DUR+"ms");
    function go(n){
      i=n;
      scenes.forEach((s,k)=>s.classList.toggle("active",k===n));
      btns.forEach((b,k)=>{b.setAttribute("aria-current",String(k===n));});
    }
    function restart(){
      clearInterval(timer);
      if(reduce){rail.classList.add("paused");return;}
      // reinicia la animación de la barra
      const cur=btns[i];cur.setAttribute("aria-current","false");void cur.offsetWidth;cur.setAttribute("aria-current","true");
      timer=setInterval(()=>{go((i+1)%scenes.length);},DUR);
    }
    go(0);restart();
    const hero=document.getElementById("inicio");
    hero.addEventListener("mouseenter",()=>{clearInterval(timer);rail.classList.add("paused");});
    hero.addEventListener("mouseleave",()=>{rail.classList.remove("paused");restart();});
    document.addEventListener("visibilitychange",()=>{if(document.hidden)clearInterval(timer);else restart();});
  });
})();
