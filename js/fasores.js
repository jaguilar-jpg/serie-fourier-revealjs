// Diapositiva 14: círculos que giran y dibujan la onda cuadrada
(function () {
  const canvas = document.getElementById('f_canvas');
  const W = 1000, H = 440, DPR = 2;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  const ctx = canvas.getContext('2d');
  ctx.scale(DPR, DPR);

  const cx = 190, cy = 220, escala = 105;     // centro del primer círculo y tamaño
  const wx0 = 430, maxHist = 520;              // donde empieza la onda y cuántos puntos guarda
  const dx = (W - wx0 - 10) / maxHist;

  let N = 5, ang = 0, hist = [], detenido = false;

  function dibujar() {
    ctx.clearRect(0, 0, W, H);

    let x = cx, y = cy;
    for (let k = 1; k <= N; k += 2) {
      const r = escala * 4 / (Math.PI * k);
      const nx = x + r * Math.cos(k * ang);
      const ny = y - r * Math.sin(k * ang);

      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.stroke();

      ctx.strokeStyle = '#ff9f40';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.stroke();

      x = nx; y = ny;
    }

    hist.unshift(y);
    if (hist.length > maxHist) hist.pop();

    // eje y línea que une la punta con la onda
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(wx0, cy); ctx.lineTo(W - 10, cy); ctx.stroke();

    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#888';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(wx0, y); ctx.stroke();
    ctx.setLineDash([]);

    // la onda que se va dibujando
    ctx.strokeStyle = '#42affa';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < hist.length; i++) {
      const px = wx0 + i * dx;
      if (i === 0) ctx.moveTo(px, hist[i]); else ctx.lineTo(px, hist[i]);
    }
    ctx.stroke();

    ctx.fillStyle = '#ff9f40';
    ctx.beginPath(); ctx.arc(x, y, 5, 0, 2 * Math.PI); ctx.fill();
  }

  function paso() {
    requestAnimationFrame(paso);
    const d = Reveal.getCurrentSlide();
    if (!d || d.id !== 'diapo-fasores' || detenido) return;
    ang += 0.04;
    dibujar();
  }
  requestAnimationFrame(paso);

  document.getElementById('f_N').addEventListener('input', function (e) {
    N = parseInt(e.target.value);
    document.getElementById('f_txt').textContent = 'N = ' + N;
    hist = [];
    if (detenido) dibujar();
  });

  document.getElementById('f_boton').addEventListener('click', function () {
    detenido = !detenido;
    this.textContent = detenido ? 'Seguir' : 'Pausar';
    this.blur();
  });
})();
