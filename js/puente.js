// Diapositiva 15: al crecer el periodo, las líneas se juntan y forman una curva
(function () {
  const F = Fourier;
  const A = 1, tau = 1, fmax = 3, tmin = -20, tmax = 20;
  const puntos = 2000;
  const t = [];
  for (let i = 0; i < puntos; i++) t.push(tmin + (tmax - tmin) * i / (puntos - 1));

  function tren(T0) {
    return t.map(v => {
      const u = (((v + tau / 2) % T0) + T0) % T0;
      return { x: v, y: u <= tau ? A : 0 };
    });
  }

  // Se dibuja T0·c_k (así la curva no se encoge al subir T0): T0·c_k = A·τ·sinc(f·τ)
  function lineas(T0) {
    const f0 = 1 / T0, K = Math.floor(fmax / f0), out = [];
    for (let k = -K; k <= K; k++) out.push({ x: k * f0, y: A * tau * F.sinc(k * f0 * tau) });
    return out;
  }

  const env = [];
  for (let i = 0; i <= 400; i++) {
    const f = -fmax + 2 * fmax * i / 400;
    env.push({ x: f, y: A * tau * F.sinc(f * tau) });
  }

  const gT = new Chart(document.getElementById('b_tiempo'), {
    type: 'line',
    data: { datasets: [{ label: 'x(t)', data: tren(4), borderColor: '#42affa', borderWidth: 2.5, pointRadius: 0 }] },
    options: {
      maintainAspectRatio: false, animation: false, parsing: false,
      plugins: { legend: { display: false }, title: { display: true, text: 'La señal', color: '#ddd' } },
      scales: {
        x: { type: 'linear', min: tmin, max: tmax, title: { display: true, text: 't (s)' } },
        y: { min: -0.2, max: 1.4 }
      }
    }
  });

  const gE = new Chart(document.getElementById('b_espectro'), {
    type: 'scatter',
    data: { datasets: [
      { label: 'Líneas', data: lineas(4), tallos: true, borderColor: '#42affa',
        backgroundColor: '#42affa', pointRadius: 3, showLine: false },
      { label: 'Curva', data: env, borderColor: '#ff9f40', borderDash: [6, 5],
        borderWidth: 1.5, pointRadius: 0, showLine: true }
    ] },
    options: {
      maintainAspectRatio: false, animation: false, parsing: false,
      plugins: { legend: { display: false }, title: { display: true, text: 'Las líneas del espectro (T0 · c_k)', color: '#ddd' } },
      scales: {
        x: { type: 'linear', min: -fmax, max: fmax, title: { display: true, text: 'frecuencia (Hz)' } },
        y: { min: -0.4, max: 1.2 }
      }
    },
    plugins: [F.tallos]
  });

  document.getElementById('b_T0').addEventListener('input', function (e) {
    const T0 = parseFloat(e.target.value);
    document.getElementById('b_txt').textContent = T0;
    gT.data.datasets[0].data = tren(T0);
    gE.data.datasets[0].data = lineas(T0);
    gT.update(); gE.update();
  });
})();
