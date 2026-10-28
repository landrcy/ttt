// Woodland night: layered pine silhouettes, moon + rays, porch lamp post, ground, fog, fireflies, falling leaves.
(function (G) {
  function hs(i) { var n = Math.sin(i * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); }
  var stars = [], flies = [], leaves = [];
  function init(W, H) {
    stars = []; for (var i = 0; i < Math.round(W * H / 400); i++) stars.push([hs(i) * W | 0, hs(i + 500) * H * 0.55 | 0, hs(i + 900)]);
    flies = []; for (i = 0; i < 18; i++) flies.push({ x: hs(i + 3) * W, y: H * (0.25 + hs(i + 7) * 0.6), p: hs(i + 11) * 6.28, s: 0.4 + hs(i + 13) });
    leaves = []; for (i = 0; i < 9; i++) leaves.push({ x: hs(i + 21) * W, y: hs(i + 23) * H, v: 4 + hs(i + 25) * 6, p: hs(i) * 6, c: ['#c9783a', '#8f5a2c', '#b9a24a', '#6f8f3e'][i % 4] });
  }
  function pine(g, x, base, h, col) { var w = Math.max(3, h * 0.42); g.fillStyle = col; for (var y = 0; y < h; y += 1) { var k = y / h, tier = (y % Math.max(3, h / 7 | 0)) / Math.max(3, h / 7 | 0), ww = Math.round(w * k * (0.55 + tier * 0.45)); g.fillRect(Math.round(x - ww / 2), base - h + y, ww + 1, 1); } g.fillRect(Math.round(x - 1), base - 2, 2, 2); }
  function draw(g, W, H, gy, t, dt, lampX) {
    var sky = g.createLinearGradient(0, 0, 0, gy); sky.addColorStop(0, '#050816'); sky.addColorStop(0.55, '#0f1a30'); sky.addColorStop(1, '#1c2b3a'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
    stars.forEach(function (s, i) { var tw = Math.sin(t * (1 + s[2] * 2) + i) > 0.6 - s[2]; if (tw) { g.fillStyle = s[2] > 0.85 ? '#fff6d8' : '#8fa0c0'; g.fillRect(s[0], s[1], 1, 1); } });
    // moon
    var mx = Math.round(W * 0.84), my = Math.round(H * 0.14), mr = Math.max(4, Math.round(Math.min(W, H) * 0.05));
    g.fillStyle = 'rgba(220,230,255,0.06)'; for (var r = mr * 3; r > mr; r -= Math.max(1, mr / 2)) { g.beginPath(); g.arc(mx, my, r, 0, 7); g.fill(); }
    for (var yy = -mr; yy <= mr; yy++) { var ww = Math.round(Math.sqrt(mr * mr - yy * yy)); g.fillStyle = yy < -mr * 0.3 ? '#fbf3d6' : '#e8dfbd'; g.fillRect(mx - ww, my + yy, ww * 2, 1); }
    g.fillStyle = '#cfc6a2'; g.fillRect(mx - (mr / 3 | 0), my - (mr / 4 | 0), Math.max(1, mr / 3 | 0), Math.max(1, mr / 4 | 0)); g.fillRect(mx + (mr / 4 | 0), my + (mr / 3 | 0), Math.max(1, mr / 4 | 0), Math.max(1, mr / 5 | 0));
    // god rays
    g.fillStyle = 'rgba(200,215,255,0.045)'; for (var i = 0; i < 4; i++) { var rx = mx - W * (0.15 + i * 0.2) + Math.sin(t * 0.1 + i) * 4; g.beginPath(); g.moveTo(rx, 0); g.lineTo(rx + W * 0.05, 0); g.lineTo(rx - W * 0.18, gy); g.lineTo(rx - W * 0.3, gy); g.fill(); }
    // pine layers
    var layers = [['#0c1626', 0.55, 0.9], ['#0a1320', 0.42, 0.7], ['#081019', 0.3, 0.55]];
    layers.forEach(function (L, li) { for (var k = 0; k < 18; k++) { var x = (hs(k + li * 50) * 1.2 - 0.1) * W, h = gy * (L[1] + hs(k + li * 77) * 0.25); pine(g, x, gy + 1, Math.round(h), L[0]); } });
    // lamp post (pos ronda)
    var lx = Math.round(lampX), lh = Math.round(gy * 0.42), fl = 0.85 + Math.sin(t * 13) * 0.05 + Math.sin(t * 7.3) * 0.06 + (Math.sin(t * 2.1) > 0.97 ? -0.3 : 0);
    var glow = g.createRadialGradient(lx, gy - lh, 1, lx, gy - lh, gy * 0.45); glow.addColorStop(0, 'rgba(255,190,100,' + (0.38 * fl) + ')'); glow.addColorStop(1, 'rgba(255,170,80,0)'); g.fillStyle = glow; g.fillRect(lx - gy * 0.45, gy - lh - gy * 0.45, gy * 0.9, gy * 0.9);
    g.fillStyle = '#1a0f08'; g.fillRect(lx - 1, gy - lh, 3, lh); g.fillRect(lx - 4, gy - lh - 1, 9, 2);
    g.fillStyle = '#2a1a0e'; g.fillRect(lx - 3, gy - lh + 1, 7, 6); g.fillStyle = fl > 0.7 ? '#ffd27a' : '#c98a3a'; g.fillRect(lx - 2, gy - lh + 2, 5, 4); g.fillStyle = '#fff1c4'; g.fillRect(lx, gy - lh + 3, 1, 2);
    // ground
    g.fillStyle = '#132017'; g.fillRect(0, gy, W, H - gy); g.fillStyle = '#1e3322'; g.fillRect(0, gy, W, 1);
    for (var x = 0; x < W; x += 3) { if (hs(x) > 0.5) { g.fillStyle = '#25402a'; g.fillRect(x, gy - 1, 1, 1 + (hs(x + 1) * 2 | 0)); } if (hs(x + 9) > 0.8) { g.fillStyle = '#0e1811'; g.fillRect(x, gy + 2 + (hs(x + 4) * (H - gy - 3) | 0), 2, 1); } }
    var lg = g.createRadialGradient(lx, gy, 1, lx, gy, W * 0.25); lg.addColorStop(0, 'rgba(255,180,90,' + 0.18 * fl + ')'); lg.addColorStop(1, 'rgba(255,180,90,0)'); g.fillStyle = lg; g.fillRect(0, gy, W, H - gy);
  }
  function drawFront(g, W, H, gy, t, dt) {
    // fog bands
    for (var i = 0; i < 3; i++) { var fy = gy - 6 - i * 5, a = 0.05 + 0.02 * Math.sin(t * 0.3 + i); g.fillStyle = 'rgba(170,190,215,' + a + ')'; for (var x = -40; x < W + 40; x += 20) { var ox = (x + t * (3 + i * 2)) % (W + 80) - 40; g.fillRect(Math.round(ox), fy + Math.round(Math.sin(x * 0.07 + t * 0.4) * 2), 26, 3 + i); } }
    // fireflies
    flies.forEach(function (f, i) { f.p += dt * f.s; f.x += Math.cos(f.p * 0.7) * dt * 5; f.y += Math.sin(f.p) * dt * 3; if (f.x < 0) f.x += W; if (f.x > W) f.x -= W;
      var on = Math.sin(t * 2 * f.s + i * 1.7); if (on > -0.1) { var X = Math.round(f.x), Y = Math.round(f.y); g.fillStyle = 'rgba(246,233,138,' + (0.18 * on + 0.05) + ')'; g.fillRect(X - 1, Y - 1, 3, 3); g.fillStyle = '#f9f0a0'; g.fillRect(X, Y, 1, 1); } });
    // falling leaves
    leaves.forEach(function (l) { l.y += l.v * dt; l.x += Math.sin(t + l.p) * dt * 6; if (l.y > gy) { l.y = -4; l.x = Math.random() * W; } g.fillStyle = l.c; var X = Math.round(l.x), Y = Math.round(l.y); g.fillRect(X, Y, 2, 1); if (Math.sin(t * 3 + l.p) > 0) g.fillRect(X + 1, Y + 1, 1, 1); });
    // vignette
    var v = g.createRadialGradient(W / 2, H * 0.55, Math.min(W, H) * 0.35, W / 2, H * 0.55, Math.max(W, H) * 0.8); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,6,0.55)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
  }
  // wooden pixel font (5x7) for the title
  var F = { T: ['11111','00100','00100','00100','00100','00100','00100'], A: ['01110','10001','10001','11111','10001','10001','10001'], L: ['10000','10000','10000','10000','10000','10000','11111'],
    K: ['10001','10010','10100','11000','10100','10010','10001'], O: ['01110','10001','10001','10001','10001','10001','01110'], U: ['10001','10001','10001','10001','10001','10001','01110'],
    N: ['10001','11001','10101','10011','10001','10001','10001'], G: ['01110','10001','10000','10111','10001','10001','01111'], ' ': ['000','000','000','000','000','000','000'] };
  function titleWidth(str, s) { var w = 0; for (var i = 0; i < str.length; i++) w += (F[str[i]][0].length + 1) * s; return w - s; }
  function title(g, str, cx, top, s, t) {
    var w = titleWidth(str, s), x0 = Math.round(cx - w / 2), x = x0, wood = ['#5a3519', '#8a5a2e', '#b07a42', '#d6a160', '#f2cf8e'];
    for (var pass = 0; pass < 2; pass++) { x = x0; for (var i = 0; i < str.length; i++) { var gl = F[str[i]], bob = Math.round(Math.sin(t * 2 + i * 0.6) * 0.6);
      for (var r = 0; r < 7; r++) for (var c = 0; c < gl[r].length; c++) if (gl[r][c] === '1') { var X = x + c * s, Y = top + r * s + bob;
        if (pass === 0) { g.fillStyle = '#120804'; g.fillRect(X - 1, Y - 1, s + 2, s + 2); g.fillRect(X + 1, Y + 1, s + 1, s + 1); }
        else for (var py = 0; py < s; py++) for (var pxx = 0; pxx < s; pxx++) { var yy = r * s + py, grain = Math.sin((x + c * s + pxx) * 0.9 + yy * 0.25) > 0.75 ? -1 : 0, lv = 3 - Math.floor(yy / (7 * s) * 2.5) + grain + (py === 0 && (r === 0 || gl[r - 1][c] === '0') ? 1 : 0); g.fillStyle = wood[Math.max(0, Math.min(4, lv))]; g.fillRect(X + pxx, Y + py, 1, 1); } }
      x += (gl[0].length + 1) * s; } }
    return w;
  }
  G.World = { init: init, draw: draw, drawFront: drawFront, title: title, titleWidth: titleWidth };
})(typeof window !== 'undefined' ? window : globalThis);
