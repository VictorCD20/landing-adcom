// Formulario de contacto (solo validación en el navegador)
(function(){
  const form=document.getElementById("contactForm");
  if(!form)return;
  const wrapOf=el=>el.closest(".fld,.check");
  const validate=el=>{
    let ok=el.checkValidity();
    if(el.type==="email"&&ok)ok=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value);
    if(el.type!=="checkbox"&&el.required&&!el.value.trim())ok=false;
    wrapOf(el).classList.toggle("invalid",!ok);return ok;
  };
  const req=[...form.querySelectorAll("[required]")];
  req.forEach(el=>{
    el.addEventListener("blur",()=>validate(el));
    el.addEventListener("input",()=>{if(wrapOf(el).classList.contains("invalid"))validate(el);});
  });
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const results=req.map(validate);
    if(results.includes(false)){req[results.indexOf(false)].focus();return;}
    document.getElementById("okName").textContent=form.nombre.value.trim().split(" ")[0];
    document.getElementById("formOk").hidden=false;
    form.querySelector(".form-ok a").focus();
  });
})();

// Filtros de proyectos
(function(){
  const btns=document.querySelectorAll(".filters button");
  if(!btns.length)return;
  btns.forEach(b=>b.addEventListener("click",()=>{
    btns.forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
    const f=b.dataset.filter;
    document.querySelectorAll(".project-card[data-cat]").forEach(c=>{
      const show=f==="all"||c.dataset.cat.split(" ").includes(f);
      c.classList.toggle("hide",!show);
    });
  }));
})();

// Lightbox
(function(){
  const zs=document.querySelectorAll("[data-zoom]");
  if(!zs.length)return;
  const lb=document.createElement("div");
  lb.className="lightbox";lb.setAttribute("role","dialog");lb.setAttribute("aria-modal","true");lb.setAttribute("aria-label","Imagen ampliada");
  lb.innerHTML='<button type="button">Cerrar ✕</button><img alt="">';
  document.body.appendChild(lb);
  const img=lb.querySelector("img"),btn=lb.querySelector("button");
  let last;
  const close=()=>{lb.classList.remove("open");if(last)last.focus();};
  zs.forEach(z=>{
    z.tabIndex=0;z.setAttribute("role","button");
    const open=()=>{const s=z.querySelector("img");img.src=s.src;img.alt=s.alt;lb.classList.add("open");last=z;btn.focus();};
    z.addEventListener("click",open);
    z.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}});
  });
  lb.addEventListener("click",e=>{if(e.target!==img)close();});
  addEventListener("keydown",e=>{if(e.key==="Escape"&&lb.classList.contains("open"))close();});
})();
