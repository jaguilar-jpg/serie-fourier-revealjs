// js/comun.js — utilidades compartidas por todas las diapositivas interactivas.
// Va DESPUÉS de Reveal.initialize(...) y de Chart.js (ver index.html).
(function () {
  const F = (window.Fourier = {});

  // ------------------------------------------------------------------
  // Matemática
  // ------------------------------------------------------------------

  // sinc(x) = sin(pi x) / (pi x), con sinc(0) = 1
  F.sinc = function (x) {
    return Math.abs(x) < 1e-12 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x);
  };

  // Suma parcial de la serie para una señal REAL:
  //   x_N(t) = c0 + 2 * sum_{n=1..N} Re[ c_n * e^{j 2 pi n t / T0} ]
  // c es un arreglo donde c[n] = [parte real, parte imaginaria] de c_n (n = 0..N).
  F.serie = function (c, T0, t) {
    let s = c[0][0];
    for (let n = 1; n < c.length; n++) {
      const th = (2 * Math.PI * n * t) / T0;
      s += 2 * (c[n][0] * Math.cos(th) - c[n][1] * Math.sin(th));
    }
    return s;
  };

  // ------------------------------------------------------------------
  // Registro de diapositivas: cada diapositiva interactiva se inicia
  // la primera vez que se muestra (así Chart.js mide bien el tamaño).
  // ------------------------------------------------------------------
  const registro = {};

  function mostrada(slide) {
    if (!slide) return;
    const r = registro[slide.id];
    if (!r) return;
    if (!r.api) r.api = r.init() || {};
    if (r.api.mostrar) r.api.mostrar();
  }

  F.registrar = function (id, init) {
    registro[id] = { init: init, api: null };
    if (Reveal.isReady && Reveal.isReady()) mostrada(Reveal.getCurrentSlide());
  };

  Reveal.on('ready', function (e) { mostrada(e.currentSlide); });
  Reveal.on('slidechanged', function (e) { mostrada(e.currentSlide); });

  // ------------------------------------------------------------------
  // Gráficas
  // ------------------------------------------------------------------

  F.COLOR = { original: '#9a9a9a', suma: '#42affa', linea: '#ffb347', apagado: '#666', envolvente: '#ee5566' };

  F.opcionesBase = function (xTitulo, yTitulo) {
    return {
      maintainAspectRatio: false,
      animation: false,
      parsing: false,
      normalized: true,
      scales: {
        // includeBounds:false evita marcas raras (p. ej. "-0.1") en los bordes del eje
        x: { type: 'linear', ticks: { includeBounds: false }, title: { display: !!xTitulo, text: xTitulo || '' } },
        y: { ticks: { includeBounds: false }, title: { display: !!yTitulo, text: yTitulo || '' } }
      },
      plugins: { legend: { labels: { boxWidth: 14 } } }
    };
  };

  F.curva = function (etiqueta, color, extra) {
    return Object.assign({
      label: etiqueta, data: [], showLine: true,
      borderColor: color, backgroundColor: color, borderWidth: 2, pointRadius: 0
    }, extra || {});
  };

  // Plugin que dibuja "palitos" verticales (espectro de líneas) para el dataset 0.
  // Cada punto puede traer su propio color en el campo c.
  F.palitos = {
    id: 'palitos',
    afterDatasetsDraw: function (chart) {
      const meta = chart.getDatasetMeta(0);
      const datos = chart.data.datasets[0].data;
      const y0 = chart.scales.y.getPixelForValue(0);
      const ctx = chart.ctx;
      ctx.save();
      ctx.lineWidth = 2;
      meta.data.forEach(function (pt, i) {
        ctx.strokeStyle = (datos[i] && datos[i].c) || F.COLOR.linea;
        ctx.beginPath();
        ctx.moveTo(pt.x, y0);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
      });
      ctx.restore();
    }
  };

  // Gráfica de espectro de líneas (palitos). Devuelve { chart, poner(palos, envolvente, ejes) }.
  F.graficaEspectro = function (canvasId, tituloY, etiquetaEnv, etiquetaPalitos) {
    const datasets = [{
      label: etiquetaPalitos || 'cₙ en f = n·f₀', data: [], showLine: false, pointRadius: 3,
      borderColor: F.COLOR.linea, backgroundColor: F.COLOR.linea
    }];
    if (etiquetaEnv) {
      datasets.push(F.curva(etiquetaEnv, F.COLOR.envolvente, { borderDash: [5, 4], borderWidth: 1.5 }));
    }
    const chart = new Chart(document.getElementById(canvasId), {
      type: 'scatter',
      data: { datasets: datasets },
      options: F.opcionesBase('Frecuencia (Hz)', tituloY),
      plugins: [F.palitos]
    });
    return chart;
  };

  F.ponerEspectro = function (chart, palos, envolvente, ejes) {
    const ds = chart.data.datasets;
    ds[0].data = palos;
    ds[0].pointBackgroundColor = palos.map(function (d) { return d.c; });
    ds[0].pointBorderColor = ds[0].pointBackgroundColor;
    ds[0].pointRadius = palos.length > 100 ? 1.5 : 3.5;
    if (envolvente && ds[1]) ds[1].data = envolvente;
    const sc = chart.options.scales;
    sc.x.min = ejes.xmin; sc.x.max = ejes.xmax;
    sc.y.min = ejes.ymin; sc.y.max = ejes.ymax;
    if (ejes.paso) sc.x.ticks = Object.assign({}, sc.x.ticks, { stepSize: ejes.paso });
    chart.update();
  };

  // ------------------------------------------------------------------
  // Panel genérico "señal periódica + serie + espectro de líneas"
  //
  // cfg = {
  //   idTiempo, idEspectro (opcional), idInfo (opcional),
  //   controles: [ids de deslizadores / casillas],
  //   leer(): devuelve los parámetros p (debe incluir T0 y, si hay suma, N),
  //   senal(t, p): señal original (opcional),
  //   cn(n, p): [re, im] del coeficiente n,
  //   sinSerie: true para no dibujar la suma,
  //   tmax(p), yRango(p): ejes del gráfico en el tiempo,
  //   etiquetaSenal, etiquetaSerie,
  //   espectro: { titulo, valor(n, p), env(f, p), etiquetaEnv, fmax(p), yRango(p, palos),
  //               color(n, p), paso },
  //   info(p): texto HTML
  // }
  // ------------------------------------------------------------------
  F.panelTren = function (cfg) {
    const $ = function (id) { return document.getElementById(id); };

    const dsT = [];
    if (cfg.senal) dsT.push(F.curva(cfg.etiquetaSenal || 'x(t) original', F.COLOR.original));
    if (!cfg.sinSerie) dsT.push(F.curva(cfg.etiquetaSerie || 'Suma de N armónicos', F.COLOR.suma));
    const gT = new Chart($(cfg.idTiempo), {
      type: 'scatter',
      data: { datasets: dsT },
      options: F.opcionesBase('t (s)', 'x(t)')
    });

    const e = cfg.espectro;
    const gE = (cfg.idEspectro && e) ? F.graficaEspectro(cfg.idEspectro, e.titulo || 'cₙ', e.env ? (e.etiquetaEnv || 'Envolvente') : null, e.etiqueta) : null;

    function actualizar() {
      const p = cfg.leer();
      const T0 = p.T0, f0 = 1 / T0;

      // ---- Tiempo ----
      const nSerie = cfg.sinSerie ? 0 : p.N;
      const c = [];
      for (let n = 0; n <= nSerie; n++) c.push(cfg.cn(n, p));
      const tmax = cfg.tmax ? cfg.tmax(p) : 1.5 * T0;
      const M = 1200;
      const orig = [], rec = [];
      for (let i = 0; i <= M; i++) {
        const t = -tmax + (2 * tmax * i) / M;
        if (cfg.senal) orig.push({ x: t, y: cfg.senal(t, p) });
        if (!cfg.sinSerie) rec.push({ x: t, y: F.serie(c, T0, t) });
      }
      let k = 0;
      if (cfg.senal) gT.data.datasets[k++].data = orig;
      if (!cfg.sinSerie) gT.data.datasets[k++].data = rec;
      const yr = cfg.yRango(p);
      gT.options.scales.x.min = -tmax; gT.options.scales.x.max = tmax;
      gT.options.scales.y.min = yr[0]; gT.options.scales.y.max = yr[1];
      gT.update();

      // ---- Espectro ----
      if (gE) {
        const fmax = e.fmax(p);
        const nMax = Math.floor(fmax / f0 + 1e-9);
        const palos = [];
        let vmin = 0, vmax = 0;
        for (let n = -nMax; n <= nMax; n++) {
          const v = e.valor(n, p);
          vmin = Math.min(vmin, v); vmax = Math.max(vmax, v);
          const col = e.color ? e.color(n, p) : (Math.abs(n) <= p.N ? F.COLOR.linea : F.COLOR.apagado);
          palos.push({ x: n * f0, y: v, c: col });
        }
        let env = null;
        if (e.env) {
          env = [];
          for (let i = 0; i <= 600; i++) {
            const f = -fmax + (2 * fmax * i) / 600;
            env.push({ x: f, y: e.env(f, p) });
          }
        }
        let yr2;
        if (e.yRango) yr2 = e.yRango(p, palos);
        else {
          const span = (vmax - vmin) || 1;
          yr2 = [vmin < 0 ? vmin - 0.15 * span : -0.05 * span, vmax + 0.15 * span];
        }
        F.ponerEspectro(gE, palos, env, { xmin: -fmax, xmax: fmax, ymin: yr2[0], ymax: yr2[1], paso: e.paso });
      }

      if (cfg.idInfo && cfg.info) $(cfg.idInfo).innerHTML = cfg.info(p);
    }

    (cfg.controles || []).forEach(function (id) {
      const el = $(id);
      el.addEventListener('input', actualizar);
      el.addEventListener('change', actualizar);
    });
    actualizar();

    return {
      actualizar: actualizar,
      mostrar: function () { gT.resize(); if (gE) gE.resize(); actualizar(); }
    };
  };
})();
