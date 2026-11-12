// js/armonicos.js — Diapositiva 4: onda cuadrada armada sumando senos
Fourier.registrar('diapo-armonicos', function () {
  const F = Fourier;
  const $ = function (id) { return document.getElementById(id); };
  const deslizador = $('a_N');

  const g = new Chart($('a_grafica'), {
    type: 'scatter',
    data: {
      datasets: [
        F.curva('Onda cuadrada', F.COLOR.original, { borderDash: [6, 4] }),
        F.curva('Suma de los senos', F.COLOR.suma, { borderWidth: 3 }),
        F.curva('Último seno sumado', F.COLOR.linea)
      ]
    },
    options: F.opcionesBase('t (s)', 'x(t)')
  });
  g.options.scales.x.min = -2; g.options.scales.x.max = 2;
  g.options.scales.y.min = -1.7; g.options.scales.y.max = 1.7;

  function actualizar() {
    const N = parseInt(deslizador.value, 10);
    $('a_txt').textContent = 'N = ' + N;
    const M = 800;
    const cuad = [], suma = [], ultimo = [];
    for (let i = 0; i <= M; i++) {
      const t = -2 + (4 * i) / M;
      let s = 0;
      for (let n = 1; n <= N; n += 2) s += Math.sin(n * Math.PI * t) / n;
      cuad.push({ x: t, y: Math.sin(Math.PI * t) >= 0 ? 1 : -1 });
      suma.push({ x: t, y: (4 / Math.PI) * s });
      ultimo.push({ x: t, y: (4 / (Math.PI * N)) * Math.sin(N * Math.PI * t) });
    }
    g.data.datasets[0].data = cuad;
    g.data.datasets[1].data = suma;
    g.data.datasets[2].data = ultimo;
    g.update();
  }

  deslizador.addEventListener('input', actualizar);
  actualizar();
  return { mostrar: function () { g.resize(); actualizar(); } };
});
