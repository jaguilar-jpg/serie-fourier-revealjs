// Diapositiva 13: pulso desplazado -> el tamaño de c_k no cambia, solo el ángulo
(function () {
  const F = Fourier;
  const A = 1, tau = 2, T0 = 4, f0 = 1 / T0;
  const ks = [];
  for (let k = -8; k <= 8; k++) ks.push(k);

  const puntos = 1200, tmin = -6, tmax = 6;
  const t = [];
  for (let i = 0; i < puntos; i++) t.push(tmin + (tmax - tmin) * i / (puntos - 1));

  function tren(d) {
    return t.map(v => {
      const u = (((v - d) % T0) + T0) % T0;
      return { x: v, y: u <= tau ? A : 0 };
    });
  }

  function mag() {
    return ks.map(k => Math.abs(A * tau / T0 * F.sinc(k * f0 * tau)));
  }

  function fase(d) {
    const centro = d + tau / 2;
    return ks.map(k => {
      const s = A * tau / T0 * F.sinc(k * f0 * tau);
      if (Math.abs(s) < 1e-9) return null;                  // no hay onda: no hay ángulo
      const th = 2 * Math.PI * k * f0 * centro;
      return Math.atan2(-s * Math.sin(th), s * Math.cos(th)) * 180 / Math.PI;
    });
  }

  const barras = (titulo, min, max, paso) => ({
    maintainAspectRatio: false, animation: false,
    plugins: { legend: { display: false }, title: { display: true, text: titulo, color: '#ddd' } },
    scales: { x: { title: { display: true, text: 'k' } }, y: { min: min, max: max, ticks: { stepSize: paso } } }
  });

  const gT = new Chart(document.getElementById('d_tiempo'), {
    type: 'line',
    data: { datasets: [{ label: 'x(t)', data: tren(0), borderColor: '#42affa', borderWidth: 3, pointRadius: 0 }] },
    options: {
      maintainAspectRatio: false, animation: false, parsing: false,
      plugins: { legend: { display: false }, title: { display: true, text: 'La señal', color: '#ddd' } },
      scales: {
        x: { type: 'linear', min: tmin, max: tmax, title: { display: true, text: 't (s)' } },
        y: { min: -0.2, max: 1.4 }
      }
    }
  });

  const gM = new Chart(document.getElementById('d_mag'), {
    type: 'bar',
    data: { labels: ks, datasets: [{ data: mag(), backgroundColor: '#42affa', barPercentage: 0.3, categoryPercentage: 1 }] },
    options: barras('Tamaño de c_k (no cambia)', 0, 0.6, 0.2)
  });

  const gF = new Chart(document.getElementById('d_fase'), {
    type: 'bar',
    data: { labels: ks, datasets: [{ data: fase(0), backgroundColor: '#ff9f40', barPercentage: 0.3, categoryPercentage: 1 }] },
    options: barras('Ángulo de c_k (grados)', -180, 180, 90)
  });

  document.getElementById('d_in').addEventListener('input', function (e) {
    const d = parseFloat(e.target.value);
    document.getElementById('d_txt').textContent = d;
    gT.data.datasets[0].data = tren(d);
    gF.data.datasets[0].data = fase(d);
    gT.update(); gF.update();
  });
})();
