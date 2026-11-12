// js/figuras.js — dibujos estáticos (SVG) de las señales de los problemas.
// Se dibujan al cargar la página; no dependen de Chart.js.
(function () {
  const F = window.Fourier;
  const NS = 'http://www.w3.org/2000/svg';
  let contador = 0;

  // s = {
  //   xmin, xmax, ymin, ymax,
  //   T0, forma: [[x, y], ...]   (un periodo; debe empezar y terminar en y = 0)
  //   ticksX: [[x, 'texto'], ...],
  //   etqY:  [{ x, y, t }],      (etiquetas de altura a la izquierda de x)
  //   cotas: [{ x1, x2, y, t }]  (flecha doble con texto, p. ej. el periodo)
  // }
  F.figura = function (id, s) {
    const cont = document.getElementById(id);
    if (!cont) return;
    const W = 560, H = 240, mx = 24, top = 16, bot = 190;
    const sx = function (x) { return mx + ((x - s.xmin) / (s.xmax - s.xmin)) * (W - 2 * mx); };
    const sy = function (y) { return bot - ((y - s.ymin) / (s.ymax - s.ymin)) * (bot - top); };
    const f1 = function (v) { return v.toFixed(1); };
    const uid = 'fig' + (++contador);

    let linea = [];
    let rellenos = '';
    for (let k = -6; k <= 6; k++) {
      const pts = s.forma.map(function (p) { return [p[0] + k * s.T0, p[1]]; });
      const txt = pts.map(function (p) { return f1(sx(p[0])) + ',' + f1(sy(p[1])); });
      linea = linea.concat(txt);
      rellenos += '<polygon points="' + txt.join(' ') + '" fill="#42affa" fill-opacity="0.3"/>';
    }

    let svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="' + NS + '" role="img">';
    svg += '<defs>'
      + '<clipPath id="c' + uid + '"><rect x="' + mx + '" y="0" width="' + (W - 2 * mx) + '" height="' + H + '"/></clipPath>'
      + '<marker id="m' + uid + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
      + '<path d="M0,0 L10,5 L0,10 z" fill="#ffb347"/></marker></defs>';

    // eje horizontal
    svg += '<line x1="4" y1="' + f1(sy(0)) + '" x2="' + (W - 4) + '" y2="' + f1(sy(0)) + '" stroke="#bbb" stroke-width="2"/>';
    // señal
    svg += '<g clip-path="url(#c' + uid + ')">' + rellenos
      + '<polyline points="' + linea.join(' ') + '" fill="none" stroke="#42affa" stroke-width="3" stroke-linejoin="round"/></g>';

    // marcas en el eje
    (s.ticksX || []).forEach(function (t) {
      svg += '<line x1="' + f1(sx(t[0])) + '" y1="' + f1(sy(0) - 5) + '" x2="' + f1(sx(t[0])) + '" y2="' + f1(sy(0) + 5) + '" stroke="#bbb" stroke-width="2"/>';
      svg += '<text x="' + f1(sx(t[0])) + '" y="' + f1(sy(0) + 28) + '" fill="#ddd" font-size="21" font-family="sans-serif" text-anchor="middle">' + t[1] + '</text>';
    });
    // alturas
    (s.etqY || []).forEach(function (e) {
      svg += '<text x="' + f1(sx(e.x) - 10) + '" y="' + f1(sy(e.y) + 7) + '" fill="#ddd" font-size="21" font-family="sans-serif" text-anchor="end">' + e.t + '</text>';
    });
    // cotas
    (s.cotas || []).forEach(function (c) {
      svg += '<line x1="' + f1(sx(c.x1)) + '" y1="' + f1(sy(c.y)) + '" x2="' + f1(sx(c.x2)) + '" y2="' + f1(sy(c.y))
        + '" stroke="#ffb347" stroke-width="2" marker-start="url(#m' + uid + ')" marker-end="url(#m' + uid + ')"/>';
      svg += '<text x="' + f1((sx(c.x1) + sx(c.x2)) / 2) + '" y="' + f1(sy(c.y) - 8) + '" fill="#ffb347" font-size="21" font-family="sans-serif" text-anchor="middle">' + c.t + '</text>';
    });
    svg += '</svg>';
    cont.innerHTML = svg;
  };

  // --- Problema 1: pulso de altura 2 entre -1 y 1 ---
  F.figura('fig_p1', {
    xmin: -2.5, xmax: 7.5, ymin: -0.5, ymax: 3.4, T0: 5,
    forma: [[-1, 0], [-1, 2], [1, 2], [1, 0]],
    ticksX: [[-1, '−1'], [0, '0'], [1, '1']],
    etqY: [{ x: -1, y: 2, t: '2' }],
    cotas: [{ x1: -1, x2: 4, y: 2.8, t: 'T₀' }]
  });

  // --- Problema 2: pulso de altura 1 entre 0 y 2 ---
  F.figura('fig_p2', {
    xmin: -2, xmax: 7.5, ymin: -0.35, ymax: 1.7, T0: 4,
    forma: [[0, 0], [0, 1], [2, 1], [2, 0]],
    ticksX: [[0, '0'], [2, '2']],
    etqY: [{ x: 0, y: 1, t: '1' }],
    cotas: [{ x1: 0, x2: 4, y: 1.45, t: 'T₀' }]
  });
})();
