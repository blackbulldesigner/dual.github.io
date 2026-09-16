/* Catálogo del Drop 01 "Desert Venom". Los accesorios usan dibujo técnico (flat). */
(() => {
  const MARK = (x, y, s) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><path class="k" d="M30 0H20A20 20 0 0 0 20 40H30Z"/><path fill="none" stroke="var(--st)" stroke-width="3" d="M35.5 1.5H44A18.5 18.5 0 0 1 44 38.5H35.5Z"/></g>`;

  const FLATS = {
    cap: `
      <path class="g" d="M50 230Q50 70 150 70Q250 70 250 230Z"/>
      <path class="d" d="M150 72Q100 112 92 228M150 72Q200 112 208 228"/>
      <path class="g" d="M40 230Q150 200 260 230Q270 268 150 272Q30 268 40 230Z"/>
      <path class="d" d="M52 240Q150 214 248 240"/>
      <circle class="g" cx="150" cy="70" r="7"/>
      <circle class="k" cx="112" cy="126" r="3"/><circle class="k" cx="188" cy="126" r="3"/>
      ${MARK(126, 142, .75)}`,
    tote: `
      <path fill="none" stroke="var(--s)" stroke-width="17" stroke-linecap="round" d="M104 130V92Q104 40 150 40Q196 40 196 92V130"/>
      <path fill="none" stroke="var(--g)" stroke-width="12" stroke-linecap="round" d="M104 130V92Q104 40 150 40Q196 40 196 92V130"/>
      <path class="g" d="M54 120H246L258 322H42Z"/>
      <path class="d" d="M54 138H246M46 304H254"/>
      <use href="#logo-word" x="86" y="200" width="128" height="34" style="color:var(--st)"/>`
  };

  const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

  window.DUAL = {
    flats: FLATS,
    products: [
      { id: 'venom-solido',   name: 'Desert Venom · Sólido',   code: 'DV-01-01', cat: 'playeras',   price: 650, meta: '240 GSM · Oversize', kind: 'tee', print: 'solido',   left: 150, sizes: SIZES, sold: [] },
      { id: 'venom-contorno', name: 'Desert Venom · Contorno', code: 'DV-01-02', cat: 'playeras',   price: 650, meta: '240 GSM · Oversize', kind: 'tee', print: 'contorno', left: 150, sizes: SIZES, sold: ['XS'] },
      { id: 'doble',          name: 'Gorra Doble',             code: 'DV-01-03', cat: 'accesorios', price: 490, meta: '6 paneles · Ajustable',  flat: 'cap',  left: 104, sizes: ['Única'], sold: [] },
      { id: 'bloque',         name: 'Tote Bloque',             code: 'DV-01-04', cat: 'accesorios', price: 390, meta: 'Canvas 16 oz · 40×42 cm', flat: 'tote', left: 67,  sizes: ['Única'], sold: [] }
    ]
  };
})();
