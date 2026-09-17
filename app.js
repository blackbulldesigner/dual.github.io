(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const money = n => '$' + n.toLocaleString('es-MX');
  const variantLabel = (p, v) => (p.kind === 'tee' ? (v === 'negro' ? 'negra' : 'blanca') : v);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const { products, flats } = window.DUAL;
  const byId = Object.fromEntries(products.map(p => [p.id, p]));
  const FREE_SHIP = 1500;

  const flatSvg = (p, variant, label = true) =>
    p.kind === 'tee'
      ? window.DUAL_TEE(variant, p.print, 'front')
      : `<svg class="flat" data-variant="${variant}" viewBox="0 0 300 340" ${label ? `role="img" aria-label="Dibujo técnico: ${p.name} en ${variant}"` : 'aria-hidden="true"'}>${flats[p.flat]}</svg>`;

  /* ---------- anchor links (scroll nativo, suave) ---------- */
  const getScrollY = () => window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  const mobile = matchMedia('(max-width: 720px)');

  /* ---------- menú móvil ---------- */
  const menu = $('#menu'), menuBtn = $('#menuBtn');
  const setMenu = open => {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', !open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('no-scroll', open);
    document.body.classList.toggle('menu-open', open);
    $('#nav').classList.remove('is-hidden');
  };
  menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  mobile.addEventListener('change', e => { if (!e.matches) setMenu(false); });

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = $(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    if (menu.classList.contains('is-open')) setMenu(false);
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });

  /* ---------- toast ---------- */
  const toast = $('#toast');
  let toastTimer;
  const say = msg => {
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-on'), 2800);
  };

  /* ---------- product grid ---------- */
  const grid = $('#grid');
  grid.innerHTML = products.map(p => {
    const single = p.sizes.length === 1;
    return `
    <article class="card reveal ${p.kind === 'tee' ? 'card--tee' : ''}" data-id="${p.id}" data-cat="${p.cat}">
      <div class="card__media" data-variant="negro">
        <span class="card__code mono">${p.code}</span>
        <span class="card__stock mono">Quedan ${p.left}</span>
        <div class="card__flat">${flatSvg(p, 'negro')}</div>
        <div class="quick">
          <div class="quick__row"><span class="mono">Talla</span><span class="mono card__meta">${single ? 'Talla única' : 'Elige una'}</span></div>
          <div class="sizes" role="group" aria-label="Talla de ${p.name}">
            ${p.sizes.map(s => `<button class="size" data-size="${s}" aria-pressed="${single}" ${p.sold.includes(s) ? 'disabled title="Agotada"' : ''}>${s}</button>`).join('')}
          </div>
          <button class="add" data-hover>${single ? 'Agregar · ' + money(p.price) : 'Elige una talla'}</button>
        </div>
      </div>
      <div class="card__info">
        <h3 class="card__name">${p.name}</h3>
        <span class="card__price">${money(p.price)}</span>
        <span class="card__meta mono">${p.meta}</span>
        <div class="swatches" role="group" aria-label="Color de ${p.name}">
          <button class="swatch swatch--negro" data-variant="negro" aria-pressed="true" aria-label="Negro" data-hover></button>
          <button class="swatch swatch--blanco" data-variant="blanco" aria-pressed="false" aria-label="Blanco" data-hover></button>
        </div>
      </div>
    </article>`;
  }).join('');

  grid.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (!card) return;
    const p = byId[card.dataset.id];
    const media = $('.card__media', card);

    const sw = e.target.closest('.swatch');
    if (sw) {
      const v = sw.dataset.variant;
      $$('.swatch', card).forEach(b => b.setAttribute('aria-pressed', b === sw));
      media.dataset.variant = v;
      $('.card__flat', card).innerHTML = flatSvg(p, v);
      return;
    }

    const size = e.target.closest('.size');
    if (size) {
      $$('.size', card).forEach(b => b.setAttribute('aria-pressed', b === size));
      $('.add', card).textContent = `Agregar ${size.dataset.size} · ${money(p.price)}`;
      return;
    }

    const add = e.target.closest('.add');
    if (add) {
      const chosen = $('.size[aria-pressed="true"]', card);
      if (!chosen) {
        say('Elige una talla primero');
        $('.sizes', card).animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
          { duration: 360, easing: 'ease-out' });
        return;
      }
      addToCart(p.id, media.dataset.variant, chosen.dataset.size);
    }
  });

  /* ---------- carrusel móvil ---------- */
  const pad2 = n => String(n).padStart(2, '0');
  function updateSwipe() {
    if (!mobile.matches) return;
    const cards = $$('.card', grid).filter(c => !c.hidden && !c.classList.contains('is-out'));
    if (!cards.length) return;
    const step = cards[0].offsetWidth + (parseFloat(getComputedStyle(grid).columnGap) || 12);
    const max = grid.scrollWidth - grid.clientWidth;
    const i = grid.scrollLeft >= max - 4 ? cards.length - 1 : clamp(Math.round(grid.scrollLeft / step), 0, cards.length - 1);
    $('#swipeNow').textContent = pad2(i + 1);
    $('#swipeTotal').textContent = pad2(cards.length);
    $('#swipeBar').style.transform = `scaleX(${(i + 1) / cards.length})`;
  }
  grid.addEventListener('scroll', updateSwipe, { passive: true });
  mobile.addEventListener('change', updateSwipe);
  updateSwipe();

  /* ---------- filters ---------- */
  $$('.chip').forEach(chip => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    $$('.chip').forEach(c => c.setAttribute('aria-pressed', c === chip));
    let shown = 0;
    $$('.card', grid).forEach(card => {
      const match = f === 'todo' || card.dataset.cat === f;
      card.classList.remove('pre');
      if (match) {
        shown++;
        card.hidden = false;
        requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove('is-out')));
      } else {
        card.classList.add('is-out');
        setTimeout(() => { if (card.classList.contains('is-out')) card.hidden = true; }, 380);
      }
    });
    $('#pieceCount').textContent = `${String(shown).padStart(2, '0')} ${shown === 1 ? 'pieza' : 'piezas'}`;
    grid.scrollTo({ left: 0, behavior: reduce ? 'auto' : 'smooth' });
    setTimeout(updateSwipe, 420);
  }));

  /* ---------- cart ---------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('dual-cart') || '[]').filter(l => byId[l.id]); } catch (_) { cart = []; }
  const save = () => { try { localStorage.setItem('dual-cart', JSON.stringify(cart)); } catch (_) {} };

  const countEl = $('#cartCount');
  const body = $('#cartBody');

  function renderCart() {
    const items = cart.reduce((n, l) => n + l.qty, 0);
    const total = cart.reduce((n, l) => n + l.qty * byId[l.id].price, 0);
    countEl.textContent = items;
    $('#cartTotal').textContent = money(total);
    $('#shipBar').style.transform = `scaleX(${clamp(total / FREE_SHIP, 0, 1)})`;
    $('#shipNote').textContent = total >= FREE_SHIP ? 'Tu envío va gratis' : `Te faltan ${money(FREE_SHIP - total)} para envío gratis`;
    body.innerHTML = cart.length ? cart.map((l, i) => {
      const p = byId[l.id];
      return `<div class="line" data-i="${i}">
        <div class="line__thumb ${l.variant === 'blanco' ? 'is-blanco' : ''}">${flatSvg(p, l.variant, false)}</div>
        <div>
          <p class="line__name">${p.name}</p>
          <div class="line__meta mono">Tela ${variantLabel(p, l.variant)} · Talla ${l.size}</div>
          <div class="qty"><button data-q="-1" aria-label="Quitar uno">−</button><span>${l.qty}</span><button data-q="1" aria-label="Agregar uno">+</button></div>
        </div>
        <div class="line__right"><span class="card__price">${money(p.price * l.qty)}</span><button class="remove">Quitar</button></div>
      </div>`;
    }).join('') : `<div class="empty"><b>Todavía nada.</b><span>Elige de qué lado estás: todo sale en negro y en blanco.</span></div>`;
  }

  function addToCart(id, variant, size) {
    const found = cart.find(l => l.id === id && l.variant === variant && l.size === size);
    if (found) found.qty++;
    else cart.push({ id, variant, size, qty: 1 });
    save();
    renderCart();
    countEl.classList.add('bump');
    setTimeout(() => countEl.classList.remove('bump'), 350);
    say(`${byId[id].name} · ${variantLabel(byId[id], variant)} · ${size} agregado`);
  }

  window.DUAL_CART = { add: addToCart, say };

  body.addEventListener('click', e => {
    const line = e.target.closest('.line');
    if (!line) return;
    const l = cart[+line.dataset.i];
    const q = e.target.closest('[data-q]');
    if (q) l.qty += +q.dataset.q;
    if (e.target.closest('.remove') || l.qty < 1) cart.splice(+line.dataset.i, 1);
    save();
    renderCart();
  });

  const drawer = $('#drawer'), scrim = $('#scrim');
  const openCart = open => {
    drawer.classList.toggle('is-open', open);
    scrim.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', !open);
    document.body.classList.toggle('no-scroll', open);
    if (open) { setView('cart'); $('#cartClose').focus(); }
  };
  $('#cartOpen').addEventListener('click', () => openCart(true));
  $('#cartClose').addEventListener('click', () => openCart(false));
  scrim.addEventListener('click', () => openCart(false));
  addEventListener('keydown', e => { if (e.key === 'Escape') { openCart(false); setMenu(false); } });
  renderCart();

  /* ---------- pedido por Instagram ---------- */
  const INSTAGRAM = 'dual._.clothing';        // usuario de Instagram de la tienda, sin @
  const CITY = 'Ciudad Juárez', STATE = 'Chihuahua';   // solo entregas locales
  const igUrl = () => `https://ig.me/m/${INSTAGRAM}`;
  const cartFoot = $('#cartFoot'), checkoutFoot = $('#checkoutFoot');
  const checkoutBody = $('#checkoutBody'), orderForm = $('#orderForm'), orderSent = $('#orderSent');
  const fields = [
    ['oNombre', v => v.trim().length > 2, 'Escribe tu nombre completo'],
    ['oTel', v => v.replace(/\D/g, '').length === 10, 'Deben ser 10 dígitos'],
    ['oCp', v => /^32\d{3}$/.test(v.trim()), 'Solo entregamos en Ciudad Juárez (CP 32000 a 32999)'],
    ['oMail', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), 'Ejemplo: nombre@correo.com'],
    ['oCalle', v => v.trim().length > 4, 'Falta la calle y el número'],
    ['oCol', v => v.trim().length > 2, 'Falta la colonia'],
    ['oRef', () => true, '']
  ];

  /* los datos se quedan en el navegador de quien compra para la próxima vez */
  const DATA_KEY = 'dual-datos';
  try {
    const saved = JSON.parse(localStorage.getItem(DATA_KEY) || '{}');
    fields.forEach(([id]) => { if (saved[id]) $('#' + id).value = saved[id]; });
  } catch (_) {}
  orderForm.addEventListener('input', () => {
    try {
      const data = {};
      fields.forEach(([id]) => (data[id] = $('#' + id).value));
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
    } catch (_) {}
  });

  function setView(view) {
    const isCart = view === 'cart';
    body.hidden = !isCart;
    cartFoot.hidden = !isCart;
    checkoutBody.hidden = isCart;
    checkoutFoot.hidden = isCart;
    $('.drawer__title').textContent = isCart ? 'Carrito' : 'Tus datos';
    if (!isCart) {
      orderForm.hidden = false;
      orderSent.hidden = true;
      checkoutFoot.hidden = false;
      $('#checkoutTotal').textContent = $('#cartTotal').textContent;
      checkoutBody.scrollTop = 0;
    }
  }

  $('#checkout').addEventListener('click', () => {
    if (!cart.length) { say('Tu carrito está vacío'); return; }
    setView('form');
  });
  $('#backToCart').addEventListener('click', () => setView('cart'));

  function markError(input, msg) {
    input.setAttribute('aria-invalid', 'true');
    let err = input.parentElement.querySelector('.err');
    if (!err) { err = document.createElement('span'); err.className = 'err'; input.parentElement.appendChild(err); }
    err.textContent = msg;
  }
  function clearError(input) {
    input.removeAttribute('aria-invalid');
    const err = input.parentElement.querySelector('.err');
    if (err) err.remove();
  }

  function orderText() {
    const g = id => $('#' + id).value.trim();
    const lines = cart.map(l => {
      const p = byId[l.id];
      return `• ${l.qty} × ${p.name} — tela ${variantLabel(p, l.variant)} — talla ${l.size} — ${money(p.price * l.qty)}`;
    });
    const total = cart.reduce((n, l) => n + l.qty * byId[l.id].price, 0);
    return [
      'PEDIDO DUAL — Drop 01 Desert Venom',
      '',
      ...lines,
      `Total de piezas: ${money(total)} MXN`,
      `Entrega: ${CITY}, ${STATE} (costo por confirmar)`,
      '',
      `Nombre: ${g('oNombre')}`,
      `Teléfono: ${g('oTel')}`,
      `Correo: ${g('oMail')}`,
      `Dirección: ${g('oCalle')}, Col. ${g('oCol')}, ${CITY}, ${STATE}, CP ${g('oCp')}`,
      g('oRef') ? `Referencias: ${g('oRef')}` : null,
      '',
      'Enviado desde la página de Dual.'
    ].filter(l => l !== null).join('\n');
  }

  /* copia pensada para el navegador de Instagram en iPhone y Android */
  function execCopy(el) {
    const wasReadOnly = el.readOnly;
    el.contentEditable = 'true';
    el.readOnly = true;                               // evita que aparezca el teclado
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    el.setSelectionRange(0, el.value.length);
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (_) {}
    sel.removeAllRanges();
    el.contentEditable = 'inherit';
    el.readOnly = wasReadOnly;
    return ok;
  }

  const step1 = $('#step1'), step2 = $('#step2'), copyBtn = $('#copyStep'), igBtn = $('#igLink');

  function resetSteps() {
    step1.classList.remove('is-done');
    step2.classList.remove('is-next');
    copyBtn.querySelector('span').textContent = 'Copiar mi pedido';
    igBtn.classList.remove('btn--solid');
  }

  $('#sendOrder').addEventListener('click', () => {
    if (!cart.length) { say('Tu carrito está vacío'); setView('cart'); return; }
    let first = null;
    fields.forEach(([id, ok, msg]) => {
      const input = $('#' + id);
      if (ok(input.value)) clearError(input);
      else { markError(input, msg); if (!first) first = input; }
    });
    if (first) {
      say('Revisa los datos marcados');
      first.focus();
      first.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    $('#orderText').value = orderText();
    igBtn.href = igUrl();
    resetSteps();
    orderForm.hidden = true;
    orderSent.hidden = false;
    checkoutFoot.hidden = true;
    checkoutBody.scrollTop = 0;
    say('Listo: sigue los dos pasos');
  });

  /* paso 1: copiar (cada paso es su propio toque, así el navegador lo permite) */
  copyBtn.addEventListener('click', () => {
    const area = $('#orderText');
    const text = area.value;
    let settled = false;
    const finish = ok => {
      if (settled) return;
      settled = true;
      if (ok) {
        step1.classList.add('is-done');
        copyBtn.querySelector('span').textContent = '✓ Pedido copiado';
        igBtn.classList.add('btn--solid');
        step2.classList.add('is-next');
        say('Copiado. Ahora el paso 2');
      } else {
        area.focus();
        area.setSelectionRange(0, text.length);
        say('No se pudo copiar solo: mantén presionado el texto de abajo y elige Copiar');
      }
    };
    const viaSelection = execCopy(area);             // dentro del mismo toque
    if (viaSelection) finish(true);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => finish(true), () => finish(viaSelection));
    } else {
      finish(viaSelection);
    }
  });

  /* paso 2: si aún no copió, se lo recordamos pero lo dejamos pasar */
  igBtn.addEventListener('click', () => {
    if (!step1.classList.contains('is-done')) say('Recuerda copiar tu pedido (paso 1) para pegarlo en el chat');
  });

  /* ---------- newsletter ---------- */
  $('#joinForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = $('#email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
      say('Ese correo no parece válido. Ejemplo: nombre@correo.com');
      input.focus();
      return;
    }
    input.value = '';
    say('Listo. Te avisamos 24 h antes del Drop 04');
  });

  /* ---------- countdown ---------- */
  const target = new Date('2026-09-19T18:00:00').getTime();
  const units = Object.fromEntries($$('#countdown b').map(b => [b.dataset.u, b]));
  const tickCount = () => {
    let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const vals = { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
    for (const k in vals) {
      const txt = String(vals[k]).padStart(2, '0');
      if (units[k].textContent !== txt) units[k].textContent = txt;
    }
  };
  tickCount();
  setInterval(tickCount, 1000);

  /* ---------- tapes ---------- */
  const tracks = $$('.tape__track').map(tr => {
    const originals = [...tr.children];
    for (let i = 0; i < 8 && tr.scrollWidth < innerWidth * 1.3; i++) originals.forEach(n => tr.appendChild(n.cloneNode(true)));
    [...tr.children].forEach(n => { const c = n.cloneNode(true); c.setAttribute('aria-hidden', 'true'); tr.appendChild(c); });
    return { el: tr, dir: +tr.dataset.speed, x: 0, w: tr.scrollWidth / 2 };
  });
  addEventListener('resize', () => tracks.forEach(t => (t.w = t.el.scrollWidth / 2)));

  /* ---------- manifesto words ---------- */
  const mText = $('#manifestoText');
  const words = [];
  [...mText.childNodes].forEach(node => {
    const out = node.nodeName === 'EM';
    node.textContent.split(/\s+/).filter(Boolean).forEach(w => words.push(`<span class="w${out ? ' out' : ''}">${w}</span>`));
  });
  mText.innerHTML = words.join(' ');
  const wordEls = $$('.w', mText);
  if (reduce) wordEls.forEach(w => w.classList.add('on'));

  /* ---------- reveals ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    const i = [...el.parentElement.children].indexOf(el);
    const delay = el.classList.contains('card') ? (i % 3) * 90 : el.classList.contains('spec') ? i * 110 : 0;
    el.classList.remove('pre');
    el.animate([{ transform: 'translateY(60px)', opacity: 0 }, { transform: 'none', opacity: 1 }],
      { duration: 1200, delay, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
    io.unobserve(el);
  }), { rootMargin: '0px 0px -8% 0px' });
  if (!reduce) {
    $$('.reveal').forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight) return;
      if (mobile.matches && el.classList.contains('card')) return;
      el.classList.add('pre');
      io.observe(el);
    });
  }
  document.fonts && document.fonts.ready.then(() => {
    tracks.forEach(t => (t.w = t.el.scrollWidth / 2));
  });

  /* ---------- cursor + magnetic ---------- */
  const cur = $('.cursor'), ring = $('.cursor-ring');
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 }, ringPos = { ...mouse };
  if (fine) {
    cur.style.opacity = ring.style.opacity = 0;
    addEventListener('pointermove', e => {
      mouse.x = e.clientX; mouse.y = e.clientY;
      cur.style.opacity = ring.style.opacity = 1;
    });
    document.addEventListener('pointerover', e => ring.classList.toggle('is-hover', !!e.target.closest('a,button,[data-hover]')));
    document.addEventListener('pointerleave', () => (cur.style.opacity = ring.style.opacity = 0));

    if (!reduce) $$('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .3}px, ${(e.clientY - r.top - r.height / 2) * .4}px)`;
      });
      el.addEventListener('pointerleave', () => (el.style.transform = ''));
    });
  }

  /* ---------- hero split line ---------- */
  const hero = $('#hero'), ink = $('#heroInk');
  let splitTarget = .5, split = .5, pointerInHero = false;
  hero.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const r = hero.getBoundingClientRect();
    splitTarget = clamp((e.clientX - r.left) / r.width, .2, .8);
    pointerInHero = true;
  });
  hero.addEventListener('pointerleave', () => { splitTarget = .5; pointerInHero = false; });

  /* ---------- main loop ---------- */
  const nav = $('#nav');
  let lastY = getScrollY(), vel = 0, last = performance.now();

  function frame(t) {
    const dt = Math.min(64, t - last) / 16.67;
    last = t;
    const y = getScrollY();
    vel += ((y - lastY) - vel) * .12;

    if (Math.abs(y - lastY) > 2) nav.classList.toggle('is-hidden', y > lastY && y > 240);
    lastY = y;

    if (!reduce) {
      if (!pointerInHero && !fine) splitTarget = .5 + Math.sin(t / 1600) * .14;
      split += (splitTarget - split) * .075 * dt;
      ink.style.transform = `translate3d(${(split * 100).toFixed(3)}%,0,0)`;

      tracks.forEach(tr => {
        tr.x = (tr.x + (1 + Math.min(Math.abs(vel) * .35, 14)) * dt) % tr.w;
        tr.el.style.transform = `translate3d(${tr.dir > 0 ? -tr.x : tr.x - tr.w}px,0,0)`;
      });

      const r = mText.getBoundingClientRect();
      const prog = clamp((innerHeight * .8 - r.top) / (r.height + innerHeight * .25), 0, 1);
      const lit = Math.round(prog * wordEls.length);
      wordEls.forEach((w, i) => w.classList.toggle('on', i < lit));
    }

    if (fine) {
      ringPos.x += (mouse.x - ringPos.x) * .16 * dt;
      ringPos.y += (mouse.y - ringPos.y) * .16 * dt;
      cur.style.transform = `translate3d(${mouse.x}px,${mouse.y}px,0)`;
      ring.style.transform = `translate3d(${ringPos.x}px,${ringPos.y}px,0)`;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
