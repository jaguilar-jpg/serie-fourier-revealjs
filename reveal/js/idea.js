// Diapositiva 2: una onda cuadrada se arma sumando senos (con deslizador)
(function () {
  const puntos = 500;
  const t = [];
  for (let i = 0; i < puntos; i++) t.push(-2 + 4 * i / (puntos - 1));

  const objetivo = t.map(v => (Math.sin(Math.PI * v) >= 0 ? 1 : -1));
  const seno = (k) => t.map(v => (4 / Math.PI) * Math.sin(k * Math.PI * v) / k);

  function suma(N) {
    const y = new Array(puntos).fill(0);
    for (let k = 1; k <= N; k += 2) {
      const s = seno(k);
      for (let i = 0; i < puntos; i++) y[i] += s[i];
    }
    return y;
  }

  const grafica = new Chart(document.getElementById('idea_grafica'), {
    type: 'line',
    data: {
      labels: t.map(v => v.toFixed(2)),
      datasets: [
        { label: 'Onda cuadrada', data: objetivo, borderColor: '#777',
          borderDash: [6, 6], borderWidth: 1.5, pointRadius: 0 },
        { label: 'Suma de senos', data: suma(1), borderColor: '#42affa',
          borderWidth: 3, pointRadius: 0 },
        { label: 'Último seno agregado', data: seno(1), borderColor: '#ff9f40',
          borderWidth: 1.5, pointRadius: 0 }
      ]
    },
    options: {
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: { ticks: { maxTicksLimit: 9 } },
        y: { min: -1.6, max: 1.6 }
      }
    }
  });

  document.getElementById('idea_N').addEventListener('input', function (e) {
    const N = parseInt(e.target.value);
    document.getElementById('idea_txt').textContent = 'N = ' + N;
    grafica.data.datasets[1].data = suma(N);
    grafica.data.datasets[2].data = seno(N);
    grafica.update();
  });
})();
