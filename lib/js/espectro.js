// js/espectro.js — Diapositiva 14: espectro de líneas de x(t) = 3 + 2cos(4πt) + 3cos(6πt)
// c0 = 3, c±2 = 1, c±3 = 3/2   (f0 = 1 Hz)
Fourier.registrar('diapo-espectro', function () {
  const F = Fourier;
  const $ = function (id) { return document.getElementById(id); };
  const coef = { 0: 3, 2: 1, 3: 1.5 };

  return F.panelTren({
    idTiempo: 'x_tiempo', idEspectro: 'x_espectro',
    controles: ['x_n0', 'x_n2', 'x_n3'],
    leer: function () {
      return { T0: 1, N: 3, act: { 0: $('x_n0').checked, 2: $('x_n2').checked, 3: $('x_n3').checked } };
    },
    cn: function (n, p) {
      const m = Math.abs(n);
      return [(coef[m] !== undefined && p.act[m]) ? coef[m] : 0, 0];
    },
    tmax: function () { return 2; },
    yRango: function () { return [-4, 9]; },
    etiquetaSerie: 'x(t) con las componentes activas',
    espectro: {
      titulo: 'cₙ',
      valor: function (n) { const m = Math.abs(n); return coef[m] !== undefined ? coef[m] : 0; },
      color: function (n, p) {
        const m = Math.abs(n);
        return (coef[m] !== undefined && p.act[m]) ? F.COLOR.linea : F.COLOR.apagado;
      },
      fmax: function () { return 4; },
      yRango: function () { return [-0.2, 3.6]; },
      paso: 1
    }
  });
});
