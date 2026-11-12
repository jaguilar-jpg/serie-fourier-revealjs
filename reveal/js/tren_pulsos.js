// Diapositiva 12: tren de pulsos y su espectro
(function () {
  const F = Fourier;
  const el = id => document.getElementById(id);
  const inA = el('p_A'), inTau = el('p_tau'), inT0 = el('p_T0'), inN = el('p_N');

  const puntos = 1000, tmin = -10, tmax = 10, fmax = 3;
  const t = [];
  for (let i = 0; i < puntos; i++) t.push(tmin + (tmax - tmin) * i / (puntos - 1));

  function leer() {
    const T0 = parseFloat(inT0.value);
    inTau.max = T0;                                    // el ancho no puede pasar del periodo
    let tau = parseFloat(inTau.value);
    if (tau > T0) { tau = T0; inTau.value = tau; }
    return { A: parseFloat(inA.value), T0: T0, tau: tau, N: parseInt(inN.value) };
  }

  function datos(p) {
    const f0 = 1 / p.T0;
    const c0 = p.A * p.tau / p.T0;
    const ck = k => c0 * F.sinc(k * f0 * p.tau);

    // tren de pulsos (centrado en 0)
    const tren = t.map(v => {
      const u = (((v + p.tau / 2) % p.T0) + p.T0) % p.T0;
      return { x: v, y: u <= p.tau ? p.A : 0 };
    });

    // suma de los primeros N armónicos
    const suma = t.map(v => {
      let s = c0;
      for (let k = 1; k <= p.N; k++) s += 2 * ck(k) * Math.cos(2 * Math.PI * k * f0 * v);
      return { x: v, y: s };
    });

    // líneas del espectro (en Hz) y envolvente
    const K = Math.floor(fmax / f0);
    const lineas = [];
    for (let k = -K; k <= K; k++) lineas.push({ x: k * f0, y: ck(k) });
    const env = [];
    for (let i = 0; i <= 300; i++) {
      const f = -fmax + 2 * fmax * i / 300;
      env.push({ x: f, y: c0 * F.sinc(f * p.tau) });
    }
    return { f0: f0, c0: c0, tren: tren, suma: suma, lineas: lineas, env: env };
  }

  const p0 = leer(), d0 = datos(p0);

  const gT = new Chart(el('p_tiempo'), {
    type: 'line',
    data: { datasets: [
      { label: 'Pulsos', data: d0.tren, borderColor: '#888', borderWidth: 2, pointRadius: 0 },
      { label: 'Suma de N armónicos', data: d0.suma, borderColor: '#42affa', borderWidth: 2.5, pointRadius: 0 }
    ] },
    options: {
      maintainAspectRatio: false, animation: false, parsing: false,
      plugins: { legend: { labels: { boxWidth: 14 } } },
      scales: {
        x: { type: 'linear', min: tmin, max: tmax, title: { display: true, text: 't (s)' } },
        y: { min: -0.4 * p0.A, max: 1.4 * p0.A }
      }
    }
  });

  const gE = new Chart(el('p_espectro'), {
    type: 'scatter',
    data: { datasets: [
      { label: 'Líneas c_k', data: d0.lineas, tallos: true, borderColor: '#42affa',
        backgroundColor: '#42affa', pointRadius: 3, showLine: false },
      { label: 'Envolvente sinc', data: d0.env, borderColor: '#ff9f40', borderDash: [6, 5],
        borderWidth: 1.5, pointRadius: 0, showLine: true }
    ] },
    options: {
      maintainAspectRatio: false, animation: false, parsing: false,
      plugins: { legend: { labels: { boxWidth: 14 } } },
      scales: {
        x: { type: 'linear', min: -fmax, max: fmax, title: { display: true, text: 'frecuencia (Hz)' } },
        y: { min: -0.35 * d0.c0, max: 1.2 * d0.c0 }
      }
    },
    plugins: [F.tallos]
  });

  function actualizar() {
    const p = leer(), d = datos(p);
    el('p_A_txt').textContent = p.A;
    el('p_tau_txt').textContent = p.tau;
    el('p_T0_txt').textContent = p.T0;
    el('p_N_txt').textContent = p.N;

    gT.data.datasets[0].data = d.tren;
    gT.data.datasets[1].data = d.suma;
    gT.options.scales.y.min = -0.4 * p.A;
    gT.options.scales.y.max = 1.4 * p.A;
    gT.update();

    gE.data.datasets[0].data = d.lineas;
    gE.data.datasets[1].data = d.env;
    gE.options.scales.y.min = -0.35 * d.c0;
    gE.options.scales.y.max = 1.2 * d.c0;
    gE.update();

    el('p_info').textContent =
      'Separación entre líneas: f0 = 1/T0 = ' + d.f0.toFixed(3) + ' Hz   ·   ' +
      'Promedio: c0 = ' + d.c0.toFixed(2) + '   ·   ' +
      'La envolvente cruza el cero en 1/τ = ' + (1 / p.tau).toFixed(2) + ' Hz';
  }

  [inA, inTau, inT0, inN].forEach(i => i.addEventListener('input', actualizar));
  actualizar();
})();
