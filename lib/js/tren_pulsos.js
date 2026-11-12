// js/tren_pulsos.js — Diapositiva 7: tren de pulsos rectangulares (A, tau, T0, N)
// c_n = (A*tau/T0) * sinc(n*f0*tau)
Fourier.registrar('diapo-tren', function () {
  const F = Fourier, sinc = F.sinc;
  const $ = function (id) { return document.getElementById(id); };

  return F.panelTren({
    idTiempo: 'p_tiempo', idEspectro: 'p_espectro', idInfo: 'p_info',
    controles: ['p_A', 'p_tau', 'p_T0', 'p_N'],

    leer: function () {
      const T0 = parseFloat($('p_T0').value);
      let tau = parseFloat($('p_tau').value);
      if (tau > T0) { tau = T0; $('p_tau').value = tau; }   // el pulso no puede ser más ancho que el periodo
      const p = { A: parseFloat($('p_A').value), tau: tau, T0: T0, N: parseInt($('p_N').value, 10) };
      $('p_A_txt').textContent = p.A;
      $('p_tau_txt').textContent = p.tau;
      $('p_T0_txt').textContent = p.T0;
      $('p_N_txt').textContent = p.N;
      return p;
    },
    senal: function (t, p) {
      const r = (((t + p.T0 / 2) % p.T0) + p.T0) % p.T0 - p.T0 / 2;
      return Math.abs(r) <= p.tau / 2 + 1e-9 ? p.A : 0;
    },
    cn: function (n, p) { return [(p.A * p.tau / p.T0) * sinc((n / p.T0) * p.tau), 0]; },
    yRango: function (p) { return [-0.3 * p.A, 1.3 * p.A]; },
    etiquetaSenal: 'Pulsos x(t)',
    espectro: {
      titulo: 'cₙ',
      valor: function (n, p) { return (p.A * p.tau / p.T0) * sinc((n / p.T0) * p.tau); },
      env: function (f, p) { return (p.A * p.tau / p.T0) * sinc(f * p.tau); },
      etiquetaEnv: 'Envolvente (Aτ/T₀)·sinc(fτ)',
      fmax: function (p) { return 4 / p.tau; },
      yRango: function (p) { const K = p.A * p.tau / p.T0; return [-0.3 * K, 1.15 * K]; }
    },
    info: function (p) {
      return 'f₀ = 1/T₀ = ' + (1 / p.T0).toFixed(3) + ' Hz &nbsp;·&nbsp; c₀ = Aτ/T₀ = '
        + (p.A * p.tau / p.T0).toFixed(3) + ' &nbsp;·&nbsp; primer cero de la envolvente: f = 1/τ = '
        + (1 / p.tau).toFixed(3) + ' Hz';
    }
  });
});
