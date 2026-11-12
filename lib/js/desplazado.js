// js/desplazado.js — Diapositiva 9: al mover el pulso, |c_n| no cambia; solo cambia la fase.
// c_n = (A*tau/T0) * sinc(n*f0*tau) * e^{-j 2 pi n f0 t_c}      (t_c = centro del pulso)
Fourier.registrar('diapo-desplazado', function () {
  const F = Fourier, sinc = F.sinc;
  const $ = function (id) { return document.getElementById(id); };
  const A = 1, tau = 2, T0 = 4, f0 = 1 / T0, K = (A * tau) / T0, NM = 8;

  const gT = new Chart($('d_tiempo'), {
    type: 'scatter',
    data: { datasets: [F.curva('Pulso (A = 1, τ = 2 s, T₀ = 4 s)', F.COLOR.suma, { borderWidth: 3 })] },
    options: F.opcionesBase('t (s)', 'x(t)')
  });
  gT.options.scales.x.min = -6; gT.options.scales.x.max = 6;
  gT.options.scales.y.min = -0.3; gT.options.scales.y.max = 1.4;

  const gM = F.graficaEspectro('d_mag', '|cₙ|', null, '|cₙ|');
  const gF = F.graficaEspectro('d_fase', '∠cₙ', null, '∠cₙ');
  const rotulos = { '-2': '−π', '-1': '−π/2', '0': '0', '1': 'π/2', '2': 'π' };
  // marcas exactas en -π, -π/2, 0, π/2, π
  gF.options.scales.y.afterBuildTicks = function (eje) {
    eje.ticks = [-2, -1, 0, 1, 2].map(function (k) { return { value: k * Math.PI / 2 }; });
  };
  gF.options.scales.y.ticks = {
    autoSkip: false,
    callback: function (v) { const k = Math.round(v / (Math.PI / 2)); return rotulos[k] !== undefined ? rotulos[k] : ''; }
  };

  function actualizar() {
    const t0 = parseFloat($('d_in').value);    // donde empieza el pulso
    const tc = t0 + tau / 2;                    // centro del pulso
    $('d_txt').textContent = t0;

    // señal en el tiempo
    const pts = [];
    for (let i = 0; i <= 1200; i++) {
      const t = -6 + (12 * i) / 1200;
      const r = (((t - t0) % T0) + T0) % T0;
      pts.push({ x: t, y: r < tau ? A : 0 });
    }
    gT.data.datasets[0].data = pts;
    gT.update();

    // espectro
    const mag = [], fase = [];
    for (let n = -NM; n <= NM; n++) {
      const s = K * sinc(n * f0 * tau);
      const th = 2 * Math.PI * n * f0 * tc;
      const re = s * Math.cos(th), im = -s * Math.sin(th);
      const m = Math.hypot(re, im);
      mag.push({ x: n * f0, y: m, c: F.COLOR.linea });
      if (m > 1e-9) fase.push({ x: n * f0, y: Math.atan2(im, re), c: '#7be0a0' });
    }
    const fmax = NM * f0 + 0.15;
    F.ponerEspectro(gM, mag, null, { xmin: -fmax, xmax: fmax, ymin: -0.05, ymax: K * 1.2, paso: 0.5 });
    F.ponerEspectro(gF, fase, null, { xmin: -fmax, xmax: fmax, ymin: -3.6, ymax: 3.6, paso: 0.5 });

    $('d_info').innerHTML = 'Centro del pulso: t<sub>c</sub> = ' + tc + ' s &nbsp;·&nbsp; las alturas |cₙ| no cambian; solo cambia la fase ∠cₙ';
  }

  $('d_in').addEventListener('input', actualizar);
  actualizar();
  return { mostrar: function () { gT.resize(); gM.resize(); gF.resize(); actualizar(); } };
});
