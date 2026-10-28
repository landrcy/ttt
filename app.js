(function () {
  var cv = document.getElementById('scene'), g = cv.getContext('2d'), bubble = document.getElementById('bubble'), btext = document.getElementById('btext');
  var form = document.getElementById('ask'), q = document.getElementById('q'), muteBtn = document.getElementById('mute');
  var S, W, H, cssW, cssH, gy, th, anchors = null, speaking = false, mouthHold = 0, shake = 0, bgT = 0;
  function fit() {
    cssW = document.documentElement.clientWidth; cssH = window.innerHeight;
    S = cssW >= 1700 ? 5 : cssW >= 1000 ? 4 : cssW >= 600 ? 3 : 2; W = Math.ceil(cssW / S); H = Math.ceil(cssH / S);
    cv.width = W; cv.height = H; g.imageSmoothingEnabled = false; World.init(W, H);
    var bar = Math.ceil(76 / S); gy = H - bar;
    var ts = W >= 400 ? 3 : W >= 150 ? 2 : 1; th = 7 * ts + 6;
    window.__ttt = { S: S, W: W, H: H, ts: ts };
  }
  fit(); addEventListener('resize', function () { fit(); place(); });
  function spriteH() { return Math.floor(Math.min((W * 0.98) / 1.6, (gy - th - 10) / 0.93)); }
  var last = performance.now(), t = 0;
  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt; if (mouthHold > 0) mouthHold -= dt;
    World.draw(g, W, H, gy, t, dt, W * 0.9);
    var st = Tung.idle(t, speaking || mouthHold > 0), h = spriteH(), sx = Math.round(W / 2);
    if (shake > 0) { shake -= dt; sx += Math.round(Math.sin(t * 90) * 1.5 * shake / 0.3); }
    anchors = Tung.draw(g, sx, gy, h, st);
    World.drawFront(g, W, H, gy, t, dt);
    var ts = window.__ttt.ts, tw = World.titleWidth('TALK TO TUNG', ts), logTop = anchors.y + Math.round(h * 0.07);
    var tcx = Math.max(tw / 2 + 2, Math.min(W - tw / 2 - 2, anchors.crownCx)), ttop = Math.max(2, logTop - 7 * ts - 9);
    World.title(g, 'TALK TO TUNG', tcx, ttop, ts, t);
    g.fillStyle = '#e2b26a'; var sub = 'ttt'; // tiny subtitle dots under title
    for (var i = 0; i < 3; i++) g.fillRect(Math.round(tcx - 4 + i * 4), ttop + 7 * ts + 2, 2, 1);
    if (!bubble.hidden) place();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  function place() { if (!anchors || bubble.hidden) return;
    var mx = anchors.mouthX * S, my = anchors.mouthY * S, bw = bubble.offsetWidth, bh = bubble.offsetHeight;
    var left, top;
    if (cssW < 600) { left = Math.max(8, (cssW - bw) / 2); top = Math.max(12, Math.min(cssH * 0.12, anchors.y * S - bh - 20)); }
    else { left = Math.min(cssW - bw - 8, (anchors.x + anchors.w * 0.42) * S); top = Math.max(8, my - bh - 10); }
    bubble.style.left = left + 'px'; bubble.style.top = top + 'px'; bubble.style.setProperty('--tail', Math.max(12, Math.min(bw - 28, mx - left)) + 'px'); }
  var hideTimer = null;
  function ask(text) {
    var reply = Speech.reply(text); SFX.startMusic(); SFX.tungTungTung(); shake = 0.3;
    clearTimeout(hideTimer); bubble.classList.remove('out'); bubble.hidden = false; btext.textContent = '';
    bubble.style.animation = 'none'; void bubble.offsetWidth; bubble.style.animation = '';
    speaking = false; setTimeout(function () { speaking = true;
      Speech.typewrite(btext, reply, 32, function (ch, i) { place(); if (i % 5 === 0 && ch !== ' ') SFX.tick(); }, function () {
        speaking = false; mouthHold = 0.5; hideTimer = setTimeout(function () { bubble.classList.add('out'); setTimeout(function () { bubble.hidden = true; }, 260); }, 4000 + reply.length * 40); });
    }, 520);
    return reply;
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); var v = q.value.trim(); q.value = ''; ask(v); q.focus(); });
  muteBtn.classList.toggle('off', !SFX.isMusicOn());
  muteBtn.addEventListener('click', function () { muteBtn.classList.toggle('off', !SFX.toggleMusic()); });
  window.TTT = { ask: ask, setTime: function (v) { t = v; } };
})();
