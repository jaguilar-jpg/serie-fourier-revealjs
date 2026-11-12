// Cosas que usan varias diapositivas
window.Fourier = {
  // sinc(x) = sen(πx) / (πx)
  sinc: function (x) {
    return Math.abs(x) < 1e-12 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x);
  },

  // Dibuja "palitos" verticales (espectro de líneas) para los datasets con tallos:true
  tallos: {
    id: 'tallos',
    afterDatasetsDraw: function (chart) {
      const ctx = chart.ctx;
      const x = chart.scales.x, y = chart.scales.y;
      chart.data.datasets.forEach(function (ds) {
        if (!ds.tallos) return;
        ctx.save();
        ctx.strokeStyle = ds.borderColor;
        ctx.lineWidth = 2;
        ds.data.forEach(function (p) {
          ctx.beginPath();
          ctx.moveTo(x.getPixelForValue(p.x), y.getPixelForValue(0));
          ctx.lineTo(x.getPixelForValue(p.x), y.getPixelForValue(p.y));
          ctx.stroke();
        });
        ctx.restore();
      });
    }
  }
};

// Después de mover una barra o casilla, se suelta el foco
// para que la flecha derecha vuelva a cambiar de diapositiva.
document.addEventListener('change', function (e) {
  if (e.target && e.target.matches && e.target.matches('input[type=range], input[type=checkbox]')) {
    e.target.blur();
  }
});
