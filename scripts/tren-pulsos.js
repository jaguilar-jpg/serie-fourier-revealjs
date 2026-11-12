// Diapositiva 7: tren de pulsos rectangulares, su suma de N armónicos y su espectro.
(function () {
  const { sinc, rango, crear, enlazar, numero, texto, base } = FS;

  const ks = rango(-15, 15, 1);

  const opcionesTiempo = Object.assign({}, base, {
    plugins: {
      legend: { display: true, labels: { boxWidth: 14, font: { size: 11 } } },
      title: { display: true, text: 'Señal x(t)', font: { size: 12 } }
    },
    scales: {
      x: { type: 'linear', min: -4, max: 4, title: { display: true, text: 't (s)' } },
      y: { min: -1, max: 4 }
    }
  });

  const gt = crear('p_tiempo', {
    type: 'scatter',
    data: {
      datasets: [
        { label: 'Pulso (señal original)', data: [], showLine: true,
          borderColor: '#888', borderWidth: 2, pointRadius: 0 },
        { label: 'Suma de N armónicos', data: [], showLine: true,
          borderColor: '#42affa', borderWidth: 2, pointRadius: 0 }
      ]
    },
    options: opcionesTiempo
  });

  const ge = crear('p_espectro', {
    type: 'bar',
    data: { labels: ks, datasets: [{ data: ks.map(() => 0), backgroundColor: [] }] },
    options: Object.assign({}, base, {
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Espectro |C_k| (azul: armónicos usados)', font: { size: 12 } }
      },
      scales: {
        x: { title: { display: true, text: 'k' } },
        y: { min: 0, max: 1 }
      }
    })
  });

  function actualizar() {
    const A = numero('p_A');
    const tau = numero('p_tau');
    const T0 = numero('p_T0');
    const N = numero('p_N');

    texto('p_A_txt', A);
    texto('p_tau_txt', tau);
    texto('p_T0_txt', T0);
    texto('p_N_txt', N);

    const f0 = 1 / T0;
    const tauEf = Math.min(tau, T0);          // el pulso no puede ser más ancho que el periodo
    const ck = k => (A * tauEf / T0) * sinc(k * f0 * tauEf);

    // --- Gráfica en el tiempo: dos periodos ---
    if (gt) {
      const original = [];
      const suma = [];
      const paso = (2 * T0) / 600;
      for (let t = -T0; t <= T0 + 1e-9; t += paso) {
        const r = (((t + T0 / 2) % T0) + T0) % T0 - T0 / 2;
        const dentro = tauEf >= T0 || Math.abs(r) < tauEf / 2;
        original.push({ x: +t.toFixed(4), y: dentro ? A : 0 });

        let y = ck(0);
        for (let k = 1; k <= N; k++) y += 2 * ck(k) * Math.cos(2 * Math.PI * k * f0 * t);
        suma.push({ x: +t.toFixed(4), y: y });
      }
      gt.data.datasets[0].data = original;
      gt.data.datasets[1].data = suma;
      gt.options.scales.x.min = -T0;
      gt.options.scales.x.max = T0;
      gt.options.scales.y.min = -0.35 * A;
      gt.options.scales.y.max = 1.4 * A;
      gt.update();
    }

    // --- Espectro ---
    if (ge) {
      ge.data.datasets[0].data = ks.map(k => Math.abs(ck(k)));
      ge.data.datasets[0].backgroundColor = ks.map(k => (Math.abs(k) <= N ? '#42affa' : '#555'));
      ge.options.scales.y.max = Math.max(0.1, (A * tauEf / T0) * 1.15);
      ge.update();
    }

    let info = 'f₀ = ' + f0.toFixed(2) + ' Hz   ·   C₀ = ' + ck(0).toFixed(2) +
               ' (valor medio)   ·   primer cero del sinc en k = ' + (T0 / tauEf).toFixed(1);
    if (tau >= T0) info += '   ·   ancho ≥ periodo: la señal es constante';
    texto('p_info', info);
  }

  ['p_A', 'p_tau', 'p_T0', 'p_N'].forEach(id => enlazar(id, actualizar));
  actualizar();
})();
