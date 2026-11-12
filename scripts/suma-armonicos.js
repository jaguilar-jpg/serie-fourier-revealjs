// Diapositiva 4: onda cuadrada armada sumando senos impares.
(function () {
  const { rango, crear, enlazar, numero, texto, opcionesLinea } = FS;

  const tiempos = rango(-2, 2, 0.01);

  function suma(N) {
    return tiempos.map(t => {
      let s = 0;
      for (let k = 1; k <= N; k += 2) s += Math.sin(k * Math.PI * t) / k;
      return { x: t, y: (4 / Math.PI) * s };
    });
  }

  const g = crear('suma_graf', {
    type: 'scatter',
    data: {
      datasets: [{
        data: suma(1), showLine: true,
        borderColor: '#42affa', borderWidth: 2, pointRadius: 0
      }]
    },
    options: opcionesLinea(-2, 2, -1.5, 1.5)
  });

  function actualizar() {
    const N = numero('suma_N');
    texto('suma_N_txt', 'N = ' + N);
    if (g) {
      g.data.datasets[0].data = suma(N);
      g.update();
    }
  }
  enlazar('suma_N', actualizar);
  actualizar();
})();
