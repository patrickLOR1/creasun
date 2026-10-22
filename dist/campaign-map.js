(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=reduced.matches;
  const motion=document.querySelector('#motion');
  function syncMotion(){document.body.classList.toggle('paused',paused);motion.setAttribute('aria-pressed',String(!paused));motion.textContent=paused?'Activar movimiento':'Pausar movimiento';}
  motion.addEventListener('click',()=>{paused=!paused;syncMotion();});
  reduced.addEventListener('change',()=>{paused=reduced.matches;syncMotion();});
  document.querySelectorAll('.worlds button').forEach(b=>b.addEventListener('click',()=>{
    document.body.dataset.world=b.dataset.world;
    document.querySelectorAll('.worlds button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  }));
  document.querySelector('#map-open').addEventListener('click',()=>{
    const map=document.querySelector('#collections');map.scrollIntoView({behavior:paused?'instant':'smooth'});map.focus({preventScroll:true});
  });
  const collections={
    summer:['Bebidas','Termos, vasos y cilindros para acompañar jornadas, reuniones y eventos. Consulta modelos, materiales y técnicas disponibles.'],
    neutral:['Textil','Bolsas, gorras y accesorios que comparten una identidad. El material y la técnica de personalización se definen según el producto.'],
    halloween:['Tecnología','Accesorios para el trabajo y la vida diaria. Revisa los modelos en los catálogos y confirma sus características con el equipo.'],
    christmas:['Regalos','Detalles y kits para agradecer o celebrar. La composición final depende de disponibilidad, presupuesto y cantidad.']
  };
  document.querySelectorAll('[data-map-detail]').forEach(button=>button.addEventListener('click',()=>{
    const key=button.dataset.mapDetail,[name,copy]=collections[key],dialog=document.querySelector('#details');
    dialog.dataset.scene=key;document.querySelector('#detail-title').textContent=name;document.querySelector('#detail-copy').textContent=copy;
    document.querySelector('#detail-image').src='assets/scene-'+key+'-480.webp';document.querySelector('#detail-image').alt='Montaje conceptual de '+name;dialog.showModal();
  }));
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
  const map=document.querySelector('#collections');
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){map.classList.add('arrived');observer.disconnect();}},{threshold:.12});
  observer.observe(map);syncMotion();
})();
