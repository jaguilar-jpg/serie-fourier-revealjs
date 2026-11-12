// Diapositiva 9: fenómeno de Gibbs (las "orejas" en los saltos)
(function () {
  const puntos = 1500;
  const t = [];
  for (let i = 0; i < puntos; i++) t.push(-0.5 + 2 * i / (puntos - 1));   // de -0.5 a 1.5

  const objetivo = t.map(v => (Math.sin(Math.PI * v) >= 0 ? 1 : -1));

  function suma(N) {
    const y = new Array(puntos).fill(0);
    for (let k = 1; k <= N; k += 2) {
      for (let i = 0; i < puntos; i++) {
        y[i] += (4 / Math.PI) * Math.sin(k * Math.PI * t[i]) / k;
      }
    }
    return y;
  }

  const grafica = new Chart(document.getElementById('gibbs_grafica'), {
    type: 'line',
    data: {
      labels: t.map(v => v.toFixed(2)),
      datasets: [
        { label: 'Onda cuadrada', data: objetivo, borderColor: '#777',
          borderDash: [6, 6], borderWidth: 1.5, pointRadius: 0 },
        { label: 'Suma de senos', data: [], borderColor: '#42affa',
          borderWidth: 2.5, pointRadius: 0 }
      ]
    },
    options: {
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: { ticks: { maxTicksLimit: 9 } },
        y: { min: -1.5, max: 1.5 }
      }
    }
  });

  function mostrar(N) {
    const y = suma(N);
    grafica.data.datasets[1].data = y;
    grafica.update();
    document.getElementById('gibbs_txt').textContent = 'N = ' + N;
    document.getElementById('gibbs_max').textContent = Math.max.apply(null, y).toFixed(3);
  }

  document.getElementById('gibbs_N').addEventListener('input', function (e) {
    mostrar(parseInt(e.target.value));
  });
  mostrar(15);
})();
