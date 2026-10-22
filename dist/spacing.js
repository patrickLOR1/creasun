(() => {
  const toggle=document.querySelector('#campaign-toggle'),summary=document.querySelector('#campaign-summary');
  function close(){summary.hidden=true;toggle.setAttribute('aria-expanded','false');}
  toggle.addEventListener('click',()=>{summary.hidden=!summary.hidden;toggle.setAttribute('aria-expanded',String(!summary.hidden));});
  summary.querySelector('a').addEventListener('click',close);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!summary.hidden){close();toggle.focus();}});
  document.addEventListener('click',e=>{if(!summary.contains(e.target)&&!toggle.contains(e.target))close();});
  const header=document.querySelector('.story-header');
  new ResizeObserver(()=>{document.body.style.setProperty('--header-height',header.offsetHeight+'px');window.dispatchEvent(new Event('resize'));}).observe(header);
})();
