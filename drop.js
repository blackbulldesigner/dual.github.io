/* Drop 01 "Desert Venom": visor de producto con las fotos del mockup. */
(() => {
  const TELA = v => (v === 'negro' ? 'negra' : 'blanca');
  const photo = (variant, print) => `tee-${TELA(variant)}-${print}.jpg`;
  const alt = (variant, print) =>
    `Playera oversize ${TELA(variant)} con alacrán Desert Venom ${print === 'solido' ? 'relleno' : 'de contorno'}`;

  /* lo usan también las tarjetas de la tienda y el carrito */
  window.DUAL_TEE = (variant, print) =>
    `<img class="tee-photo" src="${photo(variant, print)}" alt="${alt(variant, print)}" loading="lazy" decoding="async">`;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const shot = $('#shot');
  if (!shot) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const money = n => '$' + n.toLocaleString('es-MX');
  const PRICE = 650;
  const state = { variant: 'negro', print: 'solido', size: null, zoom: false };

  /* las cuatro fotos apiladas: el cambio es un fundido */
  const combos = [['negro', 'solido'], ['negro', 'contorno'], ['blanco', 'solido'], ['blanco', 'contorno']];
  shot.innerHTML = combos.map(([v, p], i) =>
    `<img src="${photo(v, p)}" alt="${alt(v, p)}" data-key="${v}-${p}" class="${i === 0 ? 'is-on' : ''}"
      ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`).join('');

  function render() {
    const key = `${state.variant}-${state.print}`;
    $$('img', shot).forEach(img => img.classList.toggle('is-on', img.dataset.key === key));
    $('#venomCode').textContent = state.print === 'solido' ? 'DV-01-01' : 'DV-01-02';
    $('#venomName').textContent = `Desert Venom · ${state.print === 'solido' ? 'Sólido' : 'Contorno'}`;
    $('#venomDesc').textContent = state.print === 'solido'
      ? 'Alacrán a placa completa: relleno macizo, de hombro a hombro y con bajada a la manga.'
      : 'El mismo alacrán en línea: solo el contorno, con trazo fino sobre la tela.';
    $('#venomTela').textContent = `Tela ${TELA(state.variant)}`;
  }

  $$('[data-set]').forEach(btn => btn.addEventListener('click', () => {
    const [key, value] = btn.dataset.set.split(':');
    state[key] = value;
    $$(`[data-set^="${key}:"]`).forEach(b => b.setAttribute('aria-pressed', b === btn));
    render();
  }));

  $$('#venomSizes .size').forEach(btn => btn.addEventListener('click', () => {
    state.size = btn.dataset.size;
    $$('#venomSizes .size').forEach(b => b.setAttribute('aria-pressed', b === btn));
    $('#venomAdd').textContent = `Agregar talla ${state.size} · ${money(PRICE)}`;
  }));

  $('#venomAdd').addEventListener('click', () => {
    if (!state.size) { window.DUAL_CART.say('Elige una talla primero'); return; }
    window.DUAL_CART.add(state.print === 'solido' ? 'venom-solido' : 'venom-contorno', state.variant, state.size);
  });

  /* acercar el estampado: la lupa sigue al cursor */
  const stage = $('#stage'), zoomBtn = $('#venomZoom');
  let mx = 50, my = 50, tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;

  function apply() {
    const z = state.zoom ? 2.2 : (fine && !reduce ? 1.05 : 1);
    shot.style.transformOrigin = `${mx}% ${my}%`;
    shot.style.transform = state.zoom
      ? `scale(${z})`
      : `scale(${z}) translate3d(${(-cx * 14).toFixed(1)}px, ${(-cy * 14).toFixed(1)}px, 0)`;
  }
  function loop() {
    cx += (tx - cx) * .09;
    cy += (ty - cy) * .09;
    apply();
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > .002 ? requestAnimationFrame(loop) : 0;
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

  zoomBtn.addEventListener('click', () => {
    state.zoom = !state.zoom;
    stage.classList.toggle('is-zoom', state.zoom);
    zoomBtn.querySelector('span').textContent = state.zoom ? 'Alejar' : 'Acercar estampado';
    apply();
  });

  if (fine) {
    stage.addEventListener('pointermove', e => {
      const r = stage.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width) * 100;
      my = ((e.clientY - r.top) / r.height) * 100;
      tx = (e.clientX - r.left) / r.width - .5;
      ty = (e.clientY - r.top) / r.height - .5;
      if (state.zoom) apply(); else kick();
    });
    stage.addEventListener('pointerleave', () => { tx = ty = 0; if (!state.zoom) kick(); });
  }

  /* ---------- cuenta regresiva corta en los datos del drop ---------- */
  const launch = new Date('2026-09-19T18:00:00').getTime();
  const dropCount = $('[data-drop-count]');
  const tickDrop = () => {
    const s = Math.max(0, Math.floor((launch - Date.now()) / 1000));
    const pad = n => String(n).padStart(2, '0');
    dropCount.textContent = s
      ? `${Math.floor(s / 86400)}d ${pad(Math.floor(s / 3600) % 24)}h ${pad(Math.floor(s / 60) % 60)}m`
      : 'Ya';
    if (!s) dropCount.nextSibling.textContent = 'disponible';
  };
  tickDrop();
  setInterval(tickDrop, 15000);

  /* ---------- entrada con hype ---------- */
  const section = $('#venom');
  let letter = 0;
  $$('.venom__word', section).forEach(word => {
    word.innerHTML = [...word.textContent]
      .map(ch => `<span class="l" aria-hidden="true" style="--i:${letter++}">${ch}</span>`).join('');
  });
  $$('.venom__facts li', section).forEach((li, i) => li.style.setProperty('--i', i));
  $$('.panel > *', section).forEach((el, i) => el.style.setProperty('--i', i));

  /* el aviso se "descifra" letra por letra */
  function scramble(el, duration) {
    const final = el.textContent;
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/·';
    const start = performance.now();
    (function frame(now) {
      const p = Math.min(1, (now - start) / duration);
      const shown = Math.floor(p * final.length);
      el.textContent = [...final].map((c, i) =>
        i < shown || c === ' ' ? c : glyphs[Math.floor(Math.random() * glyphs.length)]).join('');
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = final;
    })(start);
  }

  /* solo se arma si la sección todavía no se ve: nunca esconde algo que ya está en pantalla */
  if (!reduce && 'IntersectionObserver' in window && section.getBoundingClientRect().top > innerHeight * .75) {
    section.classList.add('is-armed');
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      requestAnimationFrame(() => section.classList.add('is-live'));
      scramble($('[data-scramble]', section), 1100);
      setTimeout(() => section.classList.remove('is-armed'), 3400);
    }, { threshold: .2 });
    io.observe(section);
  }

  render();
  apply();
})();
