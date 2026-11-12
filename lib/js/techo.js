// js/techo.js — Diapositiva 11: "techo de casa" (triángulo de altura A y base T)
// X(f) = (A*T/2) * sinc^2(f*T/2)   y   c_n = X(n*f0)/T0
Fourier.registrar('diapo-techo', function () {
  const F = Fourier, sinc = F.sinc;
  const $ = function (id) { return document.getElementById(id); };
  const sinc2 = function (x) { const s = sinc(x); return s * s; };

  return F.panelTren({
    idTiempo: 't_tiempo', idEspectro: 't_espectro', idInfo: 't_info',
    controles: ['t_A', 't_T', 't_T0', 't_N'],
    leer: function () {
      const T0 = parseFloat($('t_T0').value);
      let T = parseFloat($('t_T').value);
      if (T > T0) { T = T0; $('t_T').value = T; }
      const p = { A: parseFloat($('t_A').value), T: T, T0: T0, N: parseInt($('t_N').value, 10) };
      $('t_A_txt').textContent = p.A;
      $('t_T_txt').textContent = p.T;
      $('t_T0_txt').textContent = p.T0;
      $('t_N_txt').textContent = p.N;
      return p;
    },
    senal: function (t, p) {
      const r = (((t + p.T0 / 2) % p.T0) + p.T0) % p.T0 - p.T0 / 2;
      return Math.abs(r) < p.T / 2 ? p.A * (1 - (2 * Math.abs(r)) / p.T) : 0;
    },
    cn: function (n, p) { return [(p.A * p.T) / (2 * p.T0) * sinc2((n / p.T0) * p.T / 2), 0]; },
    yRango: function (p) { return [-0.3 * p.A, 1.3 * p.A]; },
    etiquetaSenal: 'Techos x(t)',
    espectro: {
      titulo: 'cₙ',
      valor: function (n, p) { return (p.A * p.T) / (2 * p.T0) * sinc2((n / p.T0) * p.T / 2); },
      env: function (f, p) { return (p.A * p.T) / (2 * p.T0) * sinc2((f * p.T) / 2); },
      etiquetaEnv: 'Envolvente sinc²',
      fmax: function (p) { return 6 / p.T; },
      yRango: function (p) { const K = (p.A * p.T) / (2 * p.T0); return [-0.1 * K, 1.15 * K]; }
    },
    info: function (p) {
      return 'c₀ = AT/(2T₀) = ' + ((p.A * p.T) / (2 * p.T0)).toFixed(3) + ' (área / T₀) &nbsp;·&nbsp; primer cero en f = 2/T = '
        + (2 / p.T).toFixed(3) + ' Hz';
    }
  });
});
