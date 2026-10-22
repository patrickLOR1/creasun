(() => {
  const form=document.querySelector('#quote-form'),stage=document.querySelector('.story-stage');
  const names={summer:'Bebidas',neutral:'Textil',halloween:'Tecnología',christmas:'Regalos'};
  const intents={
    equipo:{label:'Hacer equipo',copy:'Para que cada persona se sienta parte del equipo.',catalog:'Ya elegiste hacer equipo. Encuentra modelos y materiales para acompañar a tu gente.',world:'estudio',pieces:['summer','neutral']},
    celebrar:{label:'Celebrar',copy:'Para reunir personas y hacer que ese momento se quede.',catalog:'Tu campaña es para celebrar. Explora los detalles que pueden acompañar ese encuentro.',world:'verano',pieces:['summer','christmas']},
    agradecer:{label:'Dar las gracias',copy:'Para decir gracias con algo que se usa, se guarda y se recuerda.',catalog:'Tu campaña empieza con un gracias. Encuentra el detalle que mejor lo diga.',world:'navidad',pieces:['christmas','halloween']}
  };
  let intent='equipo',brand='',selected=new Set(intents.equipo.pieces);
  function sync(){
    if(!document.querySelector('#quote-result').hidden) document.querySelector('#quote-edit').click();
    const data=intents[intent],list=[...selected].map(key=>names[key]);
    document.querySelectorAll('button[data-intent]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.intent===intent)));
    document.querySelectorAll('[data-pick],[data-piece]').forEach(b=>b.setAttribute('aria-pressed',String(selected.has(b.dataset.pick||b.dataset.piece))));
    stage.dataset.intent=intent;
    stage.dataset.beverages=String(selected.has('summer'));
    document.querySelector('#intent-copy').textContent=data.copy;
    document.querySelector('[data-catalog-story]').textContent=data.catalog;
    document.querySelector('[data-campaign-heading]').textContent=(brand||'Tu marca')+' / '+data.label;
    document.querySelectorAll('[data-brand-label]').forEach(el=>el.textContent=brand||'tu marca');
    document.querySelector('#trail-brand').textContent=brand||'Tu marca';
    document.querySelector('#trail-intent').textContent=data.label+' · '+selected.size+' colecciones';
    document.querySelector('#campaign-intent').value=data.label;
    document.querySelector('#campaign-products').value=list.join(', ');
    document.querySelector('#campaign-recap-text').textContent=(brand||'Tu marca')+' · '+data.label+' · '+list.join(' + ');
    document.querySelector('#quote-brand').value=brand;
    const current=form.querySelector('input[name=product]:checked');
    if(!selected.has(current.dataset.scene)) form.querySelector('input[data-scene="'+[...selected][0]+'"]').checked=true;
    form.dispatchEvent(new Event('input',{bubbles:true}));
  }
  function toggle(key){
    if(selected.has(key)){
      if(selected.size===1){document.querySelector('#announcement').textContent='Conserva al menos una colección para tu campaña.';return;}
      selected.delete(key);
    }else selected.add(key);
    sync();
  }
  document.querySelectorAll('button[data-intent]').forEach(b=>b.addEventListener('click',()=>{
    intent=b.dataset.intent;selected=new Set(intents[intent].pieces);
    document.querySelector('.worlds button[data-world="'+intents[intent].world+'"]').click();sync();
  }));
  document.querySelectorAll('[data-pick],[data-piece]').forEach(b=>b.addEventListener('click',()=>toggle(b.dataset.pick||b.dataset.piece)));
  document.querySelector('#brand-form').addEventListener('submit',()=>{brand=document.querySelector('#brand-name').value.trim();sync();});
  document.querySelector('#quote-brand').addEventListener('input',e=>{
    brand=e.target.value.trim();document.querySelector('#brand-name').value=brand.slice(0,18);
    document.querySelector('#vessel-brand').textContent=brand||'tu marca';sync();
  });
  form.querySelectorAll('input[name=product]').forEach(r=>r.addEventListener('change',()=>{selected.add(r.dataset.scene);sync();}));
  document.querySelectorAll('#details a[href^="#"]').forEach(link=>link.addEventListener('click',()=>{
    if(link.getAttribute('href')==='#cotizador'){
      const src=document.querySelector('.object[aria-pressed="true"] img').getAttribute('src');
      const scene=src.match(/scene-(\w+)-/)[1];selected.add(scene);
      form.querySelector('input[data-scene="'+scene+'"]').checked=true;sync();
    }
    document.querySelector('#details').close();
  }));
  new MutationObserver(()=>{
    document.querySelector('#gift-toggle').innerHTML=stage.classList.contains('gift-open')?'Reunir las piezas <span>↘</span>':'Desplegar la campaña <span>↗</span>';
  }).observe(stage,{attributes:true,attributeFilter:['class']});
  sync();
})();
