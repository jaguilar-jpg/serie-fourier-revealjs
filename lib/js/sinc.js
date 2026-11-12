// js/sinc.js — Diapositiva 6: la función sinc
Fourier.registrar('diapo-sinc', function () {
  const F = Fourier;
  const curva = [], ceros = [];
  for (let i = 0; i <= 500; i++) {
    const x = -5 + (10 * i) / 500;
    curva.push({ x: x, y: F.sinc(x) });
  }
  for (let k = -5; k <= 5; k++) if (k !== 0) ceros.push({ x: k, y: 0 });

  const g = new Chart(document.getElementById('s_grafica'), {
    type: 'scatter',
    data: {
      datasets: [
        F.curva('sinc(x) = sin(πx) / (πx)', F.COLOR.suma, { data: curva, borderWidth: 3 }),
        { label: 'Ceros en x = ±1, ±2, …', data: ceros, showLine: false, pointRadius: 6,
          borderColor: F.COLOR.linea, backgroundColor: F.COLOR.linea },
        { label: 'sinc(0) = 1', data: [{ x: 0, y: 1 }], showLine: false, pointRadius: 6,
          borderColor: '#fff', backgroundColor: '#fff' }
      ]
    },
    options: F.opcionesBase('x', 'sinc(x)')
  });
  g.options.scales.x.min = -5; g.options.scales.x.max = 5;
  g.options.scales.x.ticks = { stepSize: 1 };
  g.options.scales.y.min = -0.4; g.options.scales.y.max = 1.15;
  g.update();
  return { mostrar: function () { g.resize(); } };
});
