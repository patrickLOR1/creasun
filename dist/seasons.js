(() => {
  const select=document.querySelector('#season-select');
  const allowed=[...select.options].map(o=>o.value);
  document.querySelectorAll('.journey-world,.campaign-map').forEach(host=>{
    const layer=document.createElement('div');layer.className='season-atmosphere';layer.setAttribute('aria-hidden','true');
    for(let i=0;i<22;i++){
      const particle=document.createElement('i');particle.style.setProperty('--left',((i*43)%100)+'%');particle.style.setProperty('--delay',(-i*.83)+'s');particle.style.setProperty('--duration',(9+i%7)+'s');particle.style.setProperty('--size',(4+i%5*2)+'px');layer.append(particle);
    }
    host.append(layer);
  });
  function sync(){const world=document.body.dataset.world;if(allowed.includes(world))select.value=world;}
  function choose(world){
    if(!allowed.includes(world))return;
    document.body.dataset.seasonChosen='true';
    document.querySelector('.worlds button[data-world="'+world+'"]').click();
    const url=new URL(location.href);url.searchParams.set('campana',world);history.replaceState(null,'',url);
    document.querySelector('#announcement').textContent='Temporada: '+select.options[select.selectedIndex].text;
  }
  select.addEventListener('change',()=>choose(select.value));
  document.querySelectorAll('.worlds button').forEach(b=>b.addEventListener('click',e=>{sync();if(e.isTrusted)choose(b.dataset.world);}));
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['data-world']});
  const requested=new URLSearchParams(location.search).get('campana');
  if(allowed.includes(requested))choose(requested);else sync();
})();
