// Diapositiva 8: espectro de líneas del ejemplo
// x(t) = 3 + 2cos(4πt) + 3cos(6πt) + 2sin(2πt)   (f0 = 1 Hz)
(function () {
  const ks   = [-3, -2, -1, 0, 1, 2, 3];
  const mag  = [1.5, 1, 1, 3, 1, 1, 1.5];       // |c_k|
  const fase = [0, 0, 90, 0, -90, 0, 0];        // ángulo de c_k en grados
  const activo = { 0: true, 1: true, 2: true, 3: true };

  const colores = () => ks.map(k => activo[Math.abs(k)] ? '#42affa' : '#444');

  const opcionesBarras = (titulo, minY, maxY, paso) => ({
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: titulo, color: '#ddd' }
    },
    scales: {
      x: { title: { display: true, text: 'k' } },
      y: { min: minY, max: maxY, ticks: { stepSize: paso } }
    }
  });

  const gMag = new Chart(document.getElementById('esp_mag'), {
    type: 'bar',
    data: { labels: ks, datasets: [{ data: mag, backgroundColor: colores(), barPercentage: 0.25, categoryPercentage: 1 }] },
    options: opcionesBarras('Tamaño de c_k', 0, 3.5, 1)
  });

  const gFase = new Chart(document.getElementById('esp_fase'), {
    type: 'bar',
    data: { labels: ks, datasets: [{ data: fase, backgroundColor: colores(), barPercentage: 0.25, categoryPercentage: 1 }] },
    options: opcionesBarras('Ángulo de c_k (grados)', -120, 120, 90)
  });

  const puntos = 400;
  const t = [];
  for (let i = 0; i < puntos; i++) t.push(2 * i / (puntos - 1));

  function señal() {
    return t.map(v =>
      (activo[0] ? 3 : 0) +
      (activo[1] ? 2 * Math.sin(2 * Math.PI * v) : 0) +
      (activo[2] ? 2 * Math.cos(4 * Math.PI * v) : 0) +
      (activo[3] ? 3 * Math.cos(6 * Math.PI * v) : 0)
    );
  }

  const gTiempo = new Chart(document.getElementById('esp_tiempo'), {
    type: 'line',
    data: {
      labels: t.map(v => v.toFixed(2)),
      datasets: [{ label: 'x(t)', data: señal(), borderColor: '#42affa', borderWidth: 3, pointRadius: 0 }]
    },
    options: {
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'x(t) con las componentes elegidas', color: '#ddd' }
      },
      scales: {
        x: { title: { display: true, text: 't (s)' }, ticks: { maxTicksLimit: 9 } },
        y: { min: -6, max: 10 }
      }
    }
  });

  document.querySelectorAll('#diapo-espectro input[type=checkbox]').forEach(function (c) {
    c.addEventListener('change', function () {
      activo[c.dataset.k] = c.checked;
      gMag.data.datasets[0].backgroundColor = colores();
      gFase.data.datasets[0].backgroundColor = colores();
      gTiempo.data.datasets[0].data = señal();
      gMag.update(); gFase.update(); gTiempo.update();
    });
  });
})();
