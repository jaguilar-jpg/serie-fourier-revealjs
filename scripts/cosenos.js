// Diapositiva 10: suma de cosenos x(t) = a0 + a2*cos(4*pi*t) + a3*cos(6*pi*t)
// y su espectro de líneas (c_0 = a0, c_±2 = a2/2, c_±3 = a3/2).
(function () {
  const { rango, crear, enlazar, numero, texto, base } = FS;

  const ts = rango(-1.5, 1.5, 0.01);
  const ks = rango(-5, 5, 1);

  const gs = crear('c_senal', {
    type: 'scatter',
    data: { datasets: [{ data: [], showLine: true, borderColor: '#ffd166', borderWidth: 2, pointRadius: 0 }] },
    options: Object.assign({}, base, {
      plugins: { legend: { display: false } },
      scales: {
        x: { type: 'linear', min: -1.5, max: 1.5, title: { display: true, text: 't (s)' } },
        y: { min: -5, max: 10 }
      }
    })
  });

  const ge = crear('c_espectro', {
    type: 'bar',
    data: { labels: ks, datasets: [{ data: ks.map(() => 0), backgroundColor: [] }] },
    options: Object.assign({}, base, {
      plugins: { legend: { display: false } },
      scales: {
        x: { title: { display: true, text: 'k' } },
        y: { min: 0, max: 4 }
      }
    })
  });

  function actualizar() {
    const a0 = numero('c_a0');
    const a2 = numero('c_a2');
    const a3 = numero('c_a3');
    texto('c_a0_txt', a0);
    texto('c_a2_txt', a2);
    texto('c_a3_txt', a3);

    if (gs) {
      gs.data.datasets[0].data = ts.map(t => ({
        x: t,
        y: a0 + a2 * Math.cos(4 * Math.PI * t) + a3 * Math.cos(6 * Math.PI * t)
      }));
      gs.options.scales.y.min = a0 - a2 - a3 - 1;
      gs.options.scales.y.max = a0 + a2 + a3 + 1;
      gs.update();
    }

    if (ge) {
      const valores = { 0: a0, 2: a2 / 2, '-2': a2 / 2, 3: a3 / 2, '-3': a3 / 2 };
      ge.data.datasets[0].data = ks.map(k => valores[k] || 0);
      ge.data.datasets[0].backgroundColor = ks.map(k => (k === 0 ? '#ffd166' : '#42affa'));
      ge.options.scales.y.max = Math.max(1, a0, a2 / 2, a3 / 2) * 1.2;
      ge.update();
    }
  }

  ['c_a0', 'c_a2', 'c_a3'].forEach(id => enlazar(id, actualizar));
  actualizar();
})();
