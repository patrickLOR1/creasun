(() => {
  const form = document.querySelector('#quote-form');
  const panels = [...form.querySelectorAll('fieldset')];
  const markers = [...document.querySelectorAll('.quote-steps li')];
  const back = document.querySelector('#quote-back');
  const next = document.querySelector('#quote-next');
  const result = document.querySelector('#quote-result');
  let step = 0;
  function selection() {
    return {
      product: form.querySelector('input[name=product]:checked'),
      quantity: document.querySelector('#quote-quantity').value,
      date: document.querySelector('#quote-date').value,
      brand: document.querySelector('#quote-brand').value.trim(),
      technique: document.querySelector('#quote-technique').value
    };
  }
  function preview() {
    const s = selection();
    const image = document.querySelector('#quote-preview-image');
    image.src = `assets/scene-${s.product.dataset.scene}-960.webp`;
    image.srcset = `assets/scene-${s.product.dataset.scene}-480.webp 480w, assets/scene-${s.product.dataset.scene}-960.webp 960w`;
    image.sizes = '(max-width: 900px) 85vw, 480px';
    image.alt = `Montaje conceptual: ${s.product.value}`;
    document.querySelector('#quote-brand-preview').textContent = s.brand || 'Tu marca';
    document.querySelector('#quote-product-preview').textContent = s.product.value;
    document.querySelector('#quote-quantity-preview').textContent = `${s.quantity || '—'} piezas aprox.`;
  }
  function showStep(focus = true) {
    panels.forEach((panel, i) => { panel.hidden = i !== step; panel.disabled = i !== step; });
    markers.forEach((marker, i) => { if(i === step) marker.setAttribute('aria-current','step'); else marker.removeAttribute('aria-current'); });
    back.hidden = step === 0;
    next.textContent = step === 2 ? 'Preparar propuesta →' : 'Continuar →';
    if(focus) panels[step].querySelector('legend').focus();
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if(!form.reportValidity()) return;
    if(step < 2) {step++;showStep();return;}
    const s = selection();
    const message = `Hola, quisiera cotizar ${s.quantity} piezas de ${s.product.value.toLowerCase()}.\nMarca: ${s.brand || 'Por definir'}.\nPersonalización: ${s.technique}.\nFecha requerida: ${s.date || 'Por definir'}.\nVi el montaje conceptual de Creasunn; quisiera confirmar productos disponibles, técnica, mínimo de compra y precio.`;
    document.querySelector('#quote-summary').textContent = `${s.product.value} · ${s.quantity} piezas · ${s.brand || 'Marca por definir'} · ${s.technique}${s.date ? ' · ' + s.date : ''}`;
    const intent = document.querySelector('#campaign-intent')?.value;
    const collections = document.querySelector('#campaign-products')?.value;
    const context = intent ? `Intención: ${intent}.\nColecciones de interés: ${collections}.\nCantidad orientativa para la colección principal; confirmar distribución entre colecciones.\n` : '';
    if (intent) document.querySelector('#quote-summary').textContent = `${intent} · ${collections} · Colección principal: ` + document.querySelector('#quote-summary').textContent;
    document.querySelector('#quote-send').href = 'https://wa.me/524424469598?text=' + encodeURIComponent(context + message);
    form.hidden = true; result.hidden = false;
    markers.forEach(marker=>marker.removeAttribute('aria-current'));
    result.focus();
  });
  back.addEventListener('click',()=>{step=Math.max(0,step-1);showStep();});
  document.querySelector('#quote-edit').addEventListener('click',()=>{result.hidden=true;form.hidden=false;step=0;showStep();});
  form.addEventListener('input',preview);
  showStep(false);
})();
