/* Catálogo y dibujos técnicos (flats) de cada prenda. viewBox 300 × 340 */
(() => {
  const MARK = (x, y, s) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><path class="k" d="M30 0H20A20 20 0 0 0 20 40H30Z"/><path fill="none" stroke="var(--st)" stroke-width="3" d="M35.5 1.5H44A18.5 18.5 0 0 1 44 38.5H35.5Z"/></g>`;

  const FLATS = {
    hoodie: `
      <path class="g" d="M102 58L62 74L32 96L10 292L50 300L64 176V318H236V176L250 300L290 292L268 96L238 74L198 58Z"/>
      <path class="g" d="M102 58Q92 8 150 6Q208 8 198 58Q150 96 102 58Z"/>
      <path class="p" d="M120 56Q126 26 150 24Q174 26 180 56Q150 80 120 56Z"/>
      <path class="l" d="M140 72L136 124M160 72L164 124M64 176L66 86M236 176L234 86"/>
      <circle class="k" cx="136" cy="128" r="3.5"/><circle class="k" cx="164" cy="128" r="3.5"/>
      <path class="l" d="M92 252L110 204H190L208 252Z"/>
      <path class="d" d="M14 274L52 282M286 274L248 282M66 300H234M100 248L114 210H186L200 248"/>
      ${MARK(180, 142, .45)}`,
    tee: `
      <path class="g" d="M95 40Q150 64 205 40L268 68L292 132L246 150L238 128V316H62V128L54 150L8 132L32 68Z"/>
      <path class="l" d="M104 44Q150 76 196 44M72 64L62 128M228 64L238 128"/>
      <path class="d" d="M112 50Q150 82 188 50M14 124L52 140M286 124L248 140M68 304H232"/>
      ${MARK(126, 118, .75)}`,
    cargo: `
      <path class="g" d="M88 18H212L220 60L252 322L176 328L152 128H148L124 328L48 322L80 60Z"/>
      <path class="l" d="M84 44H216M104 18V44M150 18V44M196 18V44M86 50Q96 86 128 46M214 50Q204 86 172 46"/>
      <path class="d" d="M150 44V120M160 44V104Q160 118 150 122"/>
      <path class="p" d="M70 176L112 170L116 238L76 244Z"/><path class="p" d="M68 166L112 160L114 182L72 188Z"/>
      <path class="p" d="M230 176L188 170L184 238L224 244Z"/><path class="p" d="M232 166L188 160L186 182L228 188Z"/>
      <path class="d" d="M52 306L126 312M248 306L174 312"/>`,
    coach: `
      <path class="g" d="M104 30L60 46L26 72L8 292L52 298L62 150V318H238V150L248 298L292 292L274 72L240 46L196 30L150 60Z"/>
      <path class="g" d="M104 30L128 84L150 60Z"/><path class="g" d="M196 30L172 84L150 60Z"/>
      <path class="l" d="M150 60V318M62 150L64 60M238 150L236 60"/>
      <circle class="k" cx="150" cy="112" r="4"/><circle class="k" cx="150" cy="162" r="4"/><circle class="k" cx="150" cy="212" r="4"/><circle class="k" cx="150" cy="262" r="4"/>
      <path class="d" d="M62 304H238M12 276L50 282M288 276L250 282"/>
      ${MARK(180, 104, .5)}`,
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
      { id: 'split',    name: 'Hoodie Split',   code: 'DL-03-01', cat: 'tops',       price: 1290, meta: '420 GSM · Oversized',     flat: 'hoodie', left: 32,  sizes: SIZES, sold: ['XS'] },
      { id: 'mirror',   name: 'Playera Mirror', code: 'DL-03-02', cat: 'tops',       price: 590,  meta: '260 GSM · Boxy',          flat: 'tee',    left: 88,  sizes: SIZES, sold: [] },
      { id: 'asfalto',  name: 'Cargo Asfalto',  code: 'DL-03-03', cat: 'bottoms',    price: 1150, meta: 'Twill 12 oz · Relaxed',   flat: 'cargo',  left: 41,  sizes: ['28', '30', '32', '34', '36'], sold: ['28'] },
      { id: 'negativo', name: 'Coach Negativo', code: 'DL-03-04', cat: 'outerwear',  price: 1690, meta: 'Nylon ripstop · Regular', flat: 'coach',  left: 12,  sizes: SIZES, sold: ['M', 'XL'] },
      { id: 'doble',    name: 'Gorra Doble',    code: 'DL-03-05', cat: 'accesorios', price: 490,  meta: '6 paneles · Ajustable',   flat: 'cap',    left: 104, sizes: ['Única'], sold: [] },
      { id: 'bloque',   name: 'Tote Bloque',    code: 'DL-03-06', cat: 'accesorios', price: 390,  meta: 'Canvas 16 oz · 40×42 cm', flat: 'tote',   left: 67,  sizes: ['Única'], sold: [] }
    ]
  };
})();
