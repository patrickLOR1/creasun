(() => {
  const story=document.querySelector('#story'), stage=story.querySelector('.story-stage');
  const panels=[...story.querySelectorAll('[data-story-copy]')];
  const words=['IMAGINA.','IDENTIDAD.','PARA TI.','CONTIGO.','HISTORIAS.'];
  const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
  let current=-1,frame=0,visible=true,brandTimer,place='office';
  const still=()=>document.body.classList.contains('paused')||matchMedia('(prefers-reduced-motion: reduce)').matches;
  function setChapter(i){
    if(i===current)return;current=i;stage.dataset.chapter=String(i);
    if(document.querySelector('.journey-world')){
      const scenes=[['08:00','EL ESTUDIO / DONDE NACE LA IDEA'],['09:00','LA OFICINA / UNA IDENTIDAD COMPARTIDA'],['17:00','LA TERRAZA / UN MOMENTO PARA CONECTAR'],['19:00','LA CELEBRACIÓN / ALGO PARA RECORDAR'],['MAÑANA','LA MESA / TU PRÓXIMA CAMPAÑA']];
      document.querySelector('#scene-time').textContent=scenes[i][0];
      document.querySelector('#scene-name').textContent=scenes[i][1];
      if(i===3){place='coast';stage.dataset.place=place;story.querySelectorAll('button[data-place]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.place===place)));document.querySelector('#place-caption').innerHTML='Personas que se encuentran.<br>Detalles que guardan ese momento.';}
    }
    panels.forEach((panel,n)=>{panel.hidden=n!==i;panel.classList.toggle('reveal',n===i&&!still());});
    story.querySelectorAll('.story-chapters button').forEach((b,n)=>{if(n===i)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
    const type=stage.querySelector('.story-type');type.textContent=words[i];type.classList.remove('word-enter');
    if(!still()){void type.offsetWidth;type.classList.add('word-enter');}
  }
  function render(){
    frame=0;
    const rect=story.getBoundingClientRect(),range=Math.max(1,story.offsetHeight-stage.offsetHeight);
    // Pin the complete layer stack explicitly, including absolute descendants.
    // This avoids clipping when a mobile browser jumps to a chapter mid-scroll.
    const headerOffset=document.body.classList.contains('landing')?document.querySelector('.story-header').offsetHeight:0;
    const pinned=rect.top<=headerOffset&&rect.bottom>=stage.offsetHeight+headerOffset;
    stage.style.position=pinned?'fixed':'absolute';
    stage.style.top=pinned?headerOffset+'px':`${rect.top>headerOffset?0:range}px`;
    stage.style.left='0px';stage.style.width='100%';
    const progress=clamp((headerOffset-rect.top)/range),position=progress*5;
    const chapter=Math.min(4,Math.floor(position)),local=clamp(position-chapter);
    setChapter(chapter);stage.style.setProperty('--progress',progress);
    const mobile=innerWidth<=700;
    const poses=mobile?[[0,0,1.04,-9],[0,-3,.98,0],[0,-7,.92,-3],[25,0,.9,0],[0,-3,.98,-6]]:[[30,-10,1.13,-12],[0,10,1.02,0],[0,-10,.98,-3],[35,70,.82,0],[0,0,1,-7]];
    const pose=poses[chapter],next=poses[Math.min(4,chapter+1)];
    const t=still()?0:clamp((local-.65)/.35);const ease=t*t*(3-2*t);
    const values=pose.map((v,n)=>v+(next[n]-v)*ease);
    stage.style.setProperty('--object-x',`${values[0]}px`);stage.style.setProperty('--object-y',`${values[1]}px`);
    stage.style.setProperty('--object-scale',values[2]);stage.style.setProperty('--object-angle',`${values[3]}deg`);
    stage.style.setProperty('--depth',`${still()?0:(local-.5)*65}px`);
    if(still()){stage.style.setProperty('--pointer-x','0px');stage.style.setProperty('--pointer-y','0px');}
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(render);}
  function go(i){const offset=document.body.classList.contains('landing')?document.querySelector('.story-header').offsetHeight:0;const range=Math.max(1,story.offsetHeight-stage.offsetHeight),top=scrollY+story.getBoundingClientRect().top-offset+range*(i+.12)/5;window.scrollTo({top,behavior:still()?'instant':'smooth'});}
  story.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>go(Number(b.dataset.goto))));
  document.querySelector('#brand-form').addEventListener('submit',e=>{e.preventDefault();const text=document.querySelector('#brand-name').value.trim()||'tu marca';document.querySelector('#vessel-brand').textContent=text;stage.classList.remove('branding');void stage.offsetWidth;stage.classList.add('branding');clearTimeout(brandTimer);brandTimer=setTimeout(()=>stage.classList.remove('branding'),1100);document.querySelector('#announcement').textContent=`Vista conceptual actualizada: ${text}`;});
  document.querySelector('#gift-toggle').addEventListener('click',e=>{const open=stage.classList.toggle('gift-open');const b=e.currentTarget;b.setAttribute('aria-expanded',String(open));b.innerHTML=open?'Cerrar el regalo <span>↘</span>':'Abrir el regalo <span>↗</span>';});
  story.querySelectorAll('button[data-place]').forEach(b=>b.addEventListener('click',()=>{place=b.dataset.place;stage.dataset.place=place;story.querySelectorAll('button[data-place]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelector('#place-caption').innerHTML=place==='office'?'La primera idea de la mañana.<br>Una pausa entre proyectos.':'El último pendiente puede esperar.<br>Hay momentos para llevar contigo.';}));
  let pointerFrame=0,px=0,py=0;
  if(document.querySelector('.journey-world')) story.querySelectorAll('button[data-place]').forEach(b=>b.addEventListener('click',()=>{
    document.querySelector('#scene-time').textContent=b.dataset.place==='office'?'09:00':'19:00';
    document.querySelector('#scene-name').textContent=b.dataset.place==='office'?'LA OFICINA / UNA IDENTIDAD COMPARTIDA':'LA CELEBRACIÓN / ALGO PARA RECORDAR';
  }));
  stage.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||still()||innerWidth<=700||!visible)return;px=(e.clientX/innerWidth-.5)*14;py=(e.clientY/innerHeight-.5)*8;if(!pointerFrame)pointerFrame=requestAnimationFrame(()=>{stage.style.setProperty('--pointer-x',`${px}px`);stage.style.setProperty('--pointer-y',`${py}px`);pointerFrame=0;});});
  stage.addEventListener('pointerleave',()=>{stage.style.setProperty('--pointer-x','0px');stage.style.setProperty('--pointer-y','0px');});
  function syncMotion(){const pause=document.body.classList.contains('paused');document.querySelectorAll('#story-motion,#stage-motion').forEach(b=>{b.textContent=pause?'Activar movimiento':'Pausar movimiento';b.setAttribute('aria-pressed',String(!pause));});schedule();}
  document.querySelector('#story-motion').addEventListener('click',()=>document.querySelector('#motion').click());
  document.querySelector('#stage-motion').addEventListener('click',()=>document.querySelector('#motion').click());
  new MutationObserver(syncMotion).observe(document.body,{attributes:true,attributeFilter:['class']});
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;story.classList.toggle('is-idle',!visible);if(visible)schedule();}).observe(story);
  window.addEventListener('scroll',()=>{if(visible)schedule();},{passive:true});window.addEventListener('resize',schedule);
  document.querySelectorAll('a[href="#collections"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.querySelector('#collections').scrollIntoView({behavior:still()?'instant':'smooth'});document.querySelector('#collections').focus({preventScroll:true});}));
  document.querySelectorAll('.map-node').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#collections').scrollIntoView({behavior:still()?'instant':'smooth'});}));
  render();syncMotion();
})();
