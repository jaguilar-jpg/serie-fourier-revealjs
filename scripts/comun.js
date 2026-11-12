// Funciones compartidas por todas las gráficas.
// Se carga primero; los demás archivos usan el objeto FS.
window.FS = (function () {
  Chart.defaults.devicePixelRatio = 3;          // gráficas nítidas
  Chart.defaults.color = '#ccc';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.15)';

  const graficas = [];

  function sinc(x) {
    return Math.abs(x) < 1e-12 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x);
  }

  function rango(a, b, paso) {
    const r = [];
    for (let x = a; x <= b + 1e-9; x += paso) r.push(+x.toFixed(6));
    return r;
  }

  // Crea una gráfica y la anota en la lista (para reajustarla después)
  function crear(id, config) {
    const el = document.getElementById(id);
    if (!el) return null;
    const c = new Chart(el, config);
    graficas.push(c);
    return c;
  }

  // Conecta un deslizador con una función
  function enlazar(id, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', fn);
    return el;
  }

  function numero(id) {
    return parseFloat(document.getElementById(id).value);
  }

  function texto(id, valor) {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
  }

  const base = { responsive: true, maintainAspectRatio: false, animation: false };

  function opcionesBarras(ymin, ymax, tituloY) {
    return Object.assign({}, base, {
      plugins: { legend: { display: false } },
      scales: {
        x: { title: { display: true, text: 'k' } },
        y: { min: ymin, max: ymax, title: { display: !!tituloY, text: tituloY || '' } }
      }
    });
  }

  function opcionesLinea(xmin, xmax, ymin, ymax) {
    return Object.assign({}, base, {
      plugins: { legend: { display: false } },
      scales: {
        x: { type: 'linear', min: xmin, max: xmax, title: { display: true, text: 't' } },
        y: { min: ymin, max: ymax }
      }
    });
  }

  // Reajustar el tamaño de todas las gráficas al cambiar de diapositiva
  function reajustar() { graficas.forEach(c => c.resize()); }
  if (window.Reveal) {
    Reveal.on('slidechanged', reajustar);
    Reveal.on('fragmentshown', reajustar);
    Reveal.on('resize', reajustar);
  }
  setTimeout(reajustar, 300);

  return { sinc, rango, crear, enlazar, numero, texto, base, opcionesBarras, opcionesLinea, graficas };
})();
