// Gráficas de las diapositivas 5, 6, 8 y 9.
(function () {
  const { sinc, rango, crear, enlazar, numero, texto,
          opcionesBarras, opcionesLinea } = FS;

  const ks = rango(-10, 10, 1);

  // ---------- Diapositiva 5: Problema 1 (pulso centrado, altura 2, de -1 a 1) ----------
  const g1 = crear('p1_graf', {
    type: 'bar',
    data: { labels: ks, datasets: [{ data: ks.map(() => 0), backgroundColor: '#42affa' }] },
    options: opcionesBarras(0, 2.2, '|c_k|')
  });

  function actualizarP1() {
    const T0 = numero('p1_T0');
    texto('p1_T0_txt', T0);
    if (g1) {
      g1.data.datasets[0].data = ks.map(k => Math.abs((4 / T0) * sinc(2 * k / T0)));
      g1.update();
    }
    texto('p1_info', 'Espectro |c_k|.  c_0 = 4/T_0 = ' + (4 / T0).toFixed(2) +
                     '  (valor medio de la señal)');
  }
  enlazar('p1_T0', actualizarP1);
  actualizarP1();

  // ---------- Diapositiva 6: la función sinc ----------
  const xs = rango(-6, 6, 0.05);
  crear('g6_sinc', {
    type: 'scatter',
    data: {
      datasets: [{
        data: xs.map(x => ({ x: x, y: sinc(x) })),
        showLine: true, borderColor: '#42affa', borderWidth: 2, pointRadius: 0
      }]
    },
    options: opcionesLinea(-6, 6, -0.4, 1.1)
  });

  // ---------- Diapositiva 8: Problema 2 (pulso de 0 a 2, altura 1) ----------
  const g2 = crear('p2_graf', {
    type: 'scatter',
    data: { datasets: [{ data: [], showLine: true, borderColor: '#ffd166', borderWidth: 2, pointRadius: 0 }] },
    options: opcionesLinea(-4, 8, -0.2, 1.4)
  });

  function actualizarP2() {
    const T0 = numero('p2_T0');
    texto('p2_T0_txt', T0);
    if (!g2) return;
    const xmin = -T0, xmax = 2 * T0;
    const pts = [];
    for (let t = xmin; t <= xmax + 1e-9; t += 0.02) {
      const r = ((t % T0) + T0) % T0;
      pts.push({ x: +t.toFixed(3), y: r < 2 ? 1 : 0 });
    }
    g2.data.datasets[0].data = pts;
    g2.options.scales.x.min = xmin;
    g2.options.scales.x.max = xmax;
    g2.update();
  }
  enlazar('p2_T0', actualizarP2);
  actualizarP2();

  // ---------- Diapositiva 9: forma simplificada (A=1, tau=2, T0=4) ----------
  const A9 = 1, TAU9 = 2, T9 = 4, F9 = 1 / T9;

  const g9p = crear('g9_pulso', {
    type: 'scatter',
    data: { datasets: [{ data: [], showLine: true, borderColor: '#ffd166', borderWidth: 2, pointRadius: 0 }] },
    options: opcionesLinea(-4, 8, -0.2, 1.4)
  });
  const g9m = crear('g9_mag', {
    type: 'bar',
    data: {
      labels: ks,
      datasets: [{ data: ks.map(k => Math.abs(A9 * TAU9 / T9 * sinc(k * F9 * TAU9))), backgroundColor: '#42affa' }]
    },
    options: opcionesBarras(0, 0.6)
  });
  const g9f = crear('g9_fase', {
    type: 'bar',
    data: { labels: ks, datasets: [{ data: ks.map(() => 0), backgroundColor: '#ff7b72' }] },
    options: opcionesBarras(-3.5, 3.5)
  });

  function fase(k, tc) {
    const s = sinc(k * F9 * TAU9);
    if (Math.abs(s) < 1e-9) return null;           // magnitud cero: no hay fase que mostrar
    const ph = -2 * Math.PI * k * F9 * tc + (s < 0 ? Math.PI : 0);
    return Math.atan2(Math.sin(ph), Math.cos(ph));  // dejarla entre -pi y pi
  }

  function actualizarG9() {
    const tc = numero('g9_tc');
    texto('g9_tc_txt', tc);
    if (g9p) {
      const pts = [];
      for (let t = -4; t <= 8 + 1e-9; t += 0.02) {
        const r = (((t - tc + T9 / 2) % T9) + T9) % T9 - T9 / 2;
        pts.push({ x: +t.toFixed(3), y: Math.abs(r) < TAU9 / 2 ? A9 : 0 });
      }
      g9p.data.datasets[0].data = pts;
      g9p.update();
    }
    if (g9f) {
      g9f.data.datasets[0].data = ks.map(k => fase(k, tc));
      g9f.update();
    }
  }
  enlazar('g9_tc', actualizarG9);
  actualizarG9();
})();
