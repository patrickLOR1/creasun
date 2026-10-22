(() => {
  const form = document.querySelector('#quote-form');
  const update = () => form.dispatchEvent(new Event('input', { bubbles: true }));
  document.querySelector('#brand-form').addEventListener('submit', () => {
    document.querySelector('#quote-brand').value = document.querySelector('#brand-name').value.trim();
    update();
  });
  document.querySelectorAll('#details a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      const selected = document.querySelector('.object[aria-pressed="true"] img');
      const scene = selected?.getAttribute('src').match(/scene-(\w+)-/)[1];
      const radio = form.querySelector(`input[data-scene="${scene}"]`);
      if (radio) radio.checked = true;
      update();
      document.querySelector('#details').close();
    });
  });
})();
