// js/pulso.js — Diapositiva 4: tren de pulsos rectangulares y su espectro
// Cn = (A*tau/T0) * sinc(n*f0*tau), con sinc(x) = sin(pi x)/(pi x)
(function () {
  const $ = id => document.getElementById(id);
  if (!$('p_tiempo')) return;

  const sinc = x => (Math.abs(x) < 1e-12 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x));

  Chart.defaults.color = '#ccc';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.12)';

  const sA = $('p_A'), sTau = $('p_tau'), sT0 = $('p_T0'), sN = $('p_N');

  function leer() {
    const T0 = parseFloat(sT0.value);
    let tau = parseFloat(sTau.value);
    if (tau > T0) { tau = T0; sTau.value = T0; }   // el pulso no puede ser más ancho que el periodo
    return { A: parseFloat(sA.value), tau, T0, N: parseInt(sN.value, 10) };
  }

  // Señal original: pulso centrado en 0, repetido cada T0
  function pulsos(t, p) {
    const r = (((t + p.T0 / 2) % p.T0) + p.T0) % p.T0 - p.T0 / 2;
    return Math.abs(r) <= p.tau / 2 + 1e-9 ? p.A : 0;
  }

  // Suma de Fourier: C0 + 2 * sum_{n=1..N} Cn cos(2 pi n f0 t)   (Cn real porque el pulso es par)
  function recon(t, p) {
    const f0 = 1 / p.T0, K = p.A * p.tau / p.T0;
    let s = K;
    for (let n = 1; n <= p.N; n++) {
      s += 2 * K * sinc(n * f0 * p.tau) * Math.cos(2 * Math.PI * n * f0 * t);
    }
    return s;
  }

  // Plugin que dibuja los "palitos" del espectro de líneas
  const palitos = {
    id: 'palitos',
    afterDatasetsDraw(chart) {
      const meta = chart.getDatasetMeta(0);
      const ctx = chart.ctx;
      const y0 = chart.scales.y.getPixelForValue(0);
      ctx.save();
      ctx.lineWidth = 2;
      meta.data.forEach((pt, i) => {
        const d = chart.data.datasets[0].data[i];
        ctx.strokeStyle = Math.abs(d.n) <= chart.$N ? '#ffb347' : '#666';
        ctx.beginPath();
        ctx.moveTo(pt.x, y0);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
      });
      ctx.restore();
    }
  };

  const graficaT = new Chart($('p_tiempo'), {
    type: 'scatter',
    data: {
      datasets: [
        { label: 'x(t) original', data: [], showLine: true, borderColor: '#9a9a9a', borderWidth: 2, pointRadius: 0 },
        { label: 'Suma de N armónicos', data: [], showLine: true, borderColor: '#42affa', borderWidth: 2, pointRadius: 0 }
      ]
    },
    options: {
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: { type: 'linear', title: { display: true, text: 't (s)' } },
        y: { title: { display: true, text: 'x(t)' } }
      },
      plugins: { legend: { labels: { boxWidth: 14 } } }
    }
  });

  const graficaF = new Chart($('p_espectro'), {
    type: 'scatter',
    data: {
      datasets: [
        { label: 'Cn en f = n·f0', data: [], showLine: false, pointRadius: 3, pointBackgroundColor: '#ffb347' },
        { label: 'Envolvente (A·τ/T0)·sinc(fτ)', data: [], showLine: true, borderColor: '#e56', borderWidth: 1.5, borderDash: [5, 4], pointRadius: 0 }
      ]
    },
    options: {
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: { type: 'linear', title: { display: true, text: 'Frecuencia (Hz)' } },
        y: { title: { display: true, text: 'Cn' } }
      },
      plugins: { legend: { labels: { boxWidth: 14 } } }
    },
    plugins: [palitos]
  });

  function actualizar() {
    const p = leer();
    const f0 = 1 / p.T0, K = p.A * p.tau / p.T0;

    // ---- Tiempo ----
    const tmax = 1.5 * p.T0, M = 1200;
    const orig = [], rec = [];
    for (let i = 0; i <= M; i++) {
      const t = -tmax + 2 * tmax * i / M;
      orig.push({ x: t, y: pulsos(t, p) });
      rec.push({ x: t, y: recon(t, p) });
    }
    graficaT.data.datasets[0].data = orig;
    graficaT.data.datasets[1].data = rec;
    graficaT.options.scales.x.min = -tmax;
    graficaT.options.scales.x.max = tmax;
    graficaT.options.scales.y.min = -0.3 * p.A;
    graficaT.options.scales.y.max = 1.3 * p.A;
    graficaT.update();

    // ---- Espectro ----
    const fmax = 4 / p.tau;                    // se ven los ceros en ±1/τ, ±2/τ, ±3/τ, ±4/τ
    const nMax = Math.floor(fmax / f0);
    const palos = [], colores = [];
    for (let n = -nMax; n <= nMax; n++) {
      const f = n * f0;
      palos.push({ x: f, y: K * sinc(f * p.tau), n });
      colores.push(Math.abs(n) <= p.N ? '#ffb347' : '#666');
    }
    const env = [];
    for (let i = 0; i <= 600; i++) {
      const f = -fmax + 2 * fmax * i / 600;
      env.push({ x: f, y: K * sinc(f * p.tau) });
    }
    graficaF.data.datasets[0].data = palos;
    graficaF.data.datasets[0].pointBackgroundColor = colores;
    graficaF.data.datasets[1].data = env;
    graficaF.options.scales.x.min = -fmax;
    graficaF.options.scales.x.max = fmax;
    graficaF.options.scales.y.min = -0.3 * K;
    graficaF.options.scales.y.max = 1.15 * K;
    graficaF.$N = p.N;
    graficaF.update();

    // ---- Textos ----
    $('p_A_txt').textContent = p.A;
    $('p_tau_txt').textContent = p.tau;
    $('p_T0_txt').textContent = p.T0;
    $('p_N_txt').textContent = p.N;
    $('p_info').innerHTML =
      'f<sub>0</sub> = 1/T<sub>0</sub> = ' + f0.toFixed(3) + ' Hz &nbsp;·&nbsp; ' +
      'C<sub>0</sub> = Aτ/T<sub>0</sub> = ' + K.toFixed(3) + ' &nbsp;·&nbsp; ' +
      'primer cero de la envolvente en f = 1/τ = ' + (1 / p.tau).toFixed(3) + ' Hz';
  }

  [sA, sTau, sT0, sN].forEach(s => s.addEventListener('input', actualizar));
  actualizar();

  // Chart.js mide mal un canvas oculto: al llegar a la diapositiva, se redimensiona
  function alMostrar() {
    graficaT.resize();
    graficaF.resize();
    actualizar();
  }
  if (window.Reveal) {
    Reveal.on('slidechanged', e => {
      if (e.currentSlide && e.currentSlide.id === 'diapo-pulso') alMostrar();
    });
    Reveal.on('ready', e => {
      if (e.currentSlide && e.currentSlide.id === 'diapo-pulso') alMostrar();
    });
  }
})();
