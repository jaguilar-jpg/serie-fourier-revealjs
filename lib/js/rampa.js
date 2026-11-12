// js/rampa.js — Diapositiva 12: rampa x(t) = t entre -1 y 1, repetida cada T0
// c_n = (2j/T0) * (a cos a - sin a) / a^2,   a = 2 pi n f0,   c_0 = 0
Fourier.registrar('diapo-rampa', function () {
  const F = Fourier;
  const $ = function (id) { return document.getElementById(id); };

  function coef(n, T0) {
    if (n === 0) return [0, 0];
    const a = (2 * Math.PI * n) / T0;
    return [0, (2 / T0) * (a * Math.cos(a) - Math.sin(a)) / (a * a)];
  }

  return F.panelTren({
    idTiempo: 'r_tiempo', idEspectro: 'r_espectro', idInfo: 'r_info',
    controles: ['r_T0', 'r_N'],
    leer: function () {
      const p = { T0: parseFloat($('r_T0').value), N: parseInt($('r_N').value, 10) };
      $('r_T0_txt').textContent = p.T0;
      $('r_N_txt').textContent = p.N;
      return p;
    },
    senal: function (t, p) {
      const r = (((t + p.T0 / 2) % p.T0) + p.T0) % p.T0 - p.T0 / 2;
      return Math.abs(r) < 1 ? r : 0;
    },
    cn: function (n, p) { return coef(n, p.T0); },
    yRango: function () { return [-1.9, 1.9]; },
    etiquetaSenal: 'Rampas x(t)',
    espectro: {
      titulo: 'Im(cₙ)',
      etiqueta: 'Im(cₙ)',
      valor: function (n, p) { return coef(n, p.T0)[1]; },
      fmax: function (p) { return 12 / p.T0; }
    },
    info: function (p) {
      return 'Los cₙ son números imaginarios puros (señal impar) y c₀ = 0 &nbsp;·&nbsp; f₀ = ' + (1 / p.T0).toFixed(3) + ' Hz';
    }
  });
});
