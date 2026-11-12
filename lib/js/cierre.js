// js/cierre.js — Diapositiva 15: puente a la transformada de Fourier
// Pulso fijo (A = 1, tau = 1). Al crecer T0, las líneas T0*c_n = sinc(n*f0*tau) se pegan
// y dibujan la curva continua X(f) = sinc(f).
Fourier.registrar('diapo-cierre', function () {
  const F = Fourier, sinc = F.sinc;
  const $ = function (id) { return document.getElementById(id); };

  return F.panelTren({
    idTiempo: 'b_tiempo', idEspectro: 'b_espectro', idInfo: 'b_info',
    controles: ['b_T0'],
    sinSerie: true,
    leer: function () {
      const T0 = parseFloat($('b_T0').value);
      $('b_txt').textContent = T0;
      return { T0: T0 };
    },
    senal: function (t, p) {
      const r = (((t + p.T0 / 2) % p.T0) + p.T0) % p.T0 - p.T0 / 2;
      return Math.abs(r) <= 0.5 + 1e-9 ? 1 : 0;
    },
    cn: function (n, p) { return [sinc(n / p.T0) / p.T0, 0]; },
    tmax: function (p) { return Math.max(1.5 * p.T0, 3); },
    yRango: function () { return [-0.3, 1.3]; },
    etiquetaSenal: 'x(t): pulso de ancho 1 cada T₀',
    espectro: {
      titulo: 'T₀ · cₙ',
      valor: function (n, p) { return sinc(n / p.T0); },
      env: function (f) { return sinc(f); },
      etiquetaEnv: 'Curva límite',
      color: function () { return F.COLOR.linea; },
      fmax: function () { return 4; },
      yRango: function () { return [-0.3, 1.15]; }
    },
    info: function (p) {
      return 'f₀ = 1/T₀ = ' + (1 / p.T0).toFixed(3) + ' Hz: las líneas están separadas esa distancia';
    }
  });
});
