// js/escalera.js — Diapositiva 10: dos alturas (2 en [0,1] y 1 en [1,2]), T0 = 4
// c_n = (1/4) * sinc(n/4) * [ 2 e^{-j pi n/4} + e^{-j 3 pi n/4} ]
Fourier.registrar('diapo-escalera', function () {
  const F = Fourier, sinc = F.sinc;
  const $ = function (id) { return document.getElementById(id); };

  function coef(n) {
    const s = 0.25 * sinc(n / 4);
    const a = Math.PI * n / 4;
    return [s * (2 * Math.cos(a) + Math.cos(3 * a)), -s * (2 * Math.sin(a) + Math.sin(3 * a))];
  }

  return F.panelTren({
    idTiempo: 'e_tiempo', idEspectro: 'e_espectro', idInfo: 'e_info',
    controles: ['e_N'],
    leer: function () {
      const N = parseInt($('e_N').value, 10);
      $('e_N_txt').textContent = N;
      return { T0: 4, N: N };
    },
    senal: function (t) {
      const r = ((t % 4) + 4) % 4;
      return r < 1 ? 2 : (r < 2 ? 1 : 0);
    },
    cn: function (n) { return coef(n); },
    tmax: function () { return 6; },
    yRango: function () { return [-0.6, 2.8]; },
    etiquetaSenal: 'x(t)',
    espectro: {
      titulo: '|cₙ|',
      valor: function (n) { const c = coef(n); return Math.hypot(c[0], c[1]); },
      fmax: function () { return 3; },
      yRango: function () { return [-0.05, 0.9]; },
      paso: 0.5
    },
    info: function () { return 'c₀ = (2 + 1)/4 = 0.75: es el promedio de la señal'; }
  });
});
