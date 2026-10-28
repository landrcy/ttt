// Tung — a wise old reclining tree spirit. Hand-drawn procedurally, pixel by pixel, into a buffer at the
// scene's LOGICAL resolution (Sea of Thought grid), then blitted 1:1 (no smoothing). No photo assets.
(function (G) {
  var PAL = {
    out: '#170c06',
    bark: ['#21110a', '#3b2112', '#5a3519', '#7a4c25', '#9c6735', '#c08a4d', '#ddb071'],
    leaf: ['#10241a', '#1d3a22', '#2c5530', '#3f7436', '#5b9440', '#86b955', '#b4d878'],
    moss: ['#24401f', '#3b6630', '#5f8f3e', '#8fbf5a'],
    eye: '#f6d27a', eyeHi: '#fff4cf', pupil: '#1a0d06', mouth: '#1a0905', tongue: '#9a4a36', teeth: '#e9dcb4',
    capA: '#c9783a', capB: '#e8a65a', spot: '#f5e6c8', stem: '#e9dcc0', glow: '#7fe0c8', glowHi: '#d4fff2', staff: '#6e4524'
  };
  var C32 = {};
  function c32(hex) { if (C32[hex]) return C32[hex]; var n = parseInt(hex.slice(1), 16); return (C32[hex] = (0xff000000 | ((n & 0xff) << 16) | (n & 0xff00) | (n >> 16)) >>> 0); }
  function hash(x, y) { var n = (x * 374761393 + y * 668265263) | 0; n = (n ^ (n >>> 13)) * 1274126177 | 0; return ((n ^ (n >>> 16)) >>> 0) / 4294967296; }
  var cv = null, img = null, buf = null, BW = 0, BH = 0;
  function px(x, y, col) { x |= 0; y |= 0; if (x < 0 || y < 0 || x >= BW || y >= BH) return; buf[y * BW + x] = c32(col); }
  function get(x, y) { x |= 0; y |= 0; return (x < 0 || y < 0 || x >= BW || y >= BH) ? 0 : buf[y * BW + x]; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function bark(l) { return PAL.bark[clamp(Math.round(l), 0, 6)]; }
  function bez(p0, p1, p2, t) { var a = 1 - t; return [a*a*p0[0] + 2*a*t*p1[0] + t*t*p2[0], a*a*p0[1] + 2*a*t*p1[1] + t*t*p2[1]]; }

  // thick tapered bark limb along a quadratic curve, outlined, shaded (lit from upper-right), streaked
  function limb(p0, p1, p2, r0, r1, lit) {
    var len = Math.hypot(p1[0]-p0[0], p1[1]-p0[1]) + Math.hypot(p2[0]-p1[0], p2[1]-p1[1]), n = Math.max(8, Math.ceil(len * 1.5)), pass, i;
    for (pass = 0; pass < 2; pass++) for (i = 0; i <= n; i++) {
      var t = i / n, p = bez(p0, p1, p2, t), q = bez(p0, p1, p2, Math.min(1, t + 0.01)), dx = q[0]-p[0], dy = q[1]-p[1], dl = Math.hypot(dx, dy) || 1, nx = -dy/dl, ny = dx/dl;
      var r = r0 + (r1 - r0) * t, R = Math.ceil(r + 1);
      for (var oy = -R; oy <= R; oy++) for (var ox = -R; ox <= R; ox++) {
        var d = Math.hypot(ox, oy); if (pass === 0) { if (d <= r + 1) px(p[0]+ox, p[1]+oy, PAL.out); continue; }
        if (d > r) continue;
        var across = (ox*nx + oy*ny) / (r || 1); if (ny > 0) across = -across;           // -1 top .. 1 bottom
        var X = Math.round(p[0]+ox), Y = Math.round(p[1]+oy), along = i / 1.5;
        var streak = ((Math.round(across * r * 0.9 + Math.sin(along * 0.35) * 0.8) + 99) % 3 === 0) ? -1 : 0;
        var l = (lit || 3.2) - across * 1.4 + streak + (hash(X, Y) - 0.5) * 0.7 - (d > r - 0.8 ? 0.8 : 0);
        px(X, Y, bark(l));
      }
    }
  }
  function disc(x, y, r, col) { for (var oy = -Math.ceil(r); oy <= r; oy++) for (var ox = -Math.ceil(r); ox <= r; ox++) if (ox*ox + oy*oy <= r*r) px(x+ox, y+oy, col); }
  function mossPatch(x, y, r, seed) {
    for (var oy = -Math.ceil(r); oy <= 1; oy++) for (var ox = -Math.ceil(r); ox <= r; ox++) {
      var d = (ox*ox)/(r*r) + (oy*oy)/(r*r*0.35); if (d > 1 + (hash(x+ox, seed+oy)-0.5)*0.6) continue;
      if (!get(x+ox, y+oy)) continue;
      var h = hash(x+ox+seed, y+oy); px(x+ox, y+oy, PAL.moss[oy < -r*0.5 ? (h > 0.4 ? 3 : 2) : h > 0.7 ? 2 : h > 0.3 ? 1 : 0]);
    }
  }
  function shroom(x, y, s, glow) {
    var sh = Math.max(2, Math.round(s * 1.2)), cw = Math.max(2, Math.round(s));
    for (var k = 0; k < sh; k++) { px(x, y - k, PAL.out); px(x + 1, y - k, glow ? PAL.glowHi : PAL.stem); }
    for (var oy = -Math.ceil(cw*0.7); oy <= 0; oy++) for (var ox = -cw-1; ox <= cw+1; ox++) {
      var e = (ox*ox)/((cw+1)*(cw+1)) + (oy*oy)/((cw*0.7+1)*(cw*0.7+1)); if (e > 1) continue;
      var edge = e > 0.62; px(x + ox, y - sh + oy, edge ? PAL.out : glow ? (oy < -cw*0.35 ? PAL.glowHi : PAL.glow) : (oy < -cw*0.35 && ox > 0 ? PAL.capB : PAL.capA));
    }
    if (!glow && cw > 2) { px(x - 1, y - sh - 1, PAL.spot); px(x + Math.round(cw*0.6), y - sh, PAL.spot); }
  }

  // ---------- main ----------
  // c: logical ctx; cx: sprite centre x; gy: ground y; h: sprite height (logical px); st: {t, blink, mouth, tap}
  function draw(c, cx, gy, h, st) {
    h = Math.round(h); var SH = h, SW = Math.round(h * 1.6), t = st.t || 0;
    if (!cv || BW !== SW || BH !== SH) { cv = (typeof OffscreenCanvas !== 'undefined') ? new OffscreenCanvas(SW, SH) : Object.assign(document.createElement('canvas'), { width: SW, height: SH }); BW = SW; BH = SH; img = cv.getContext('2d').createImageData(SW, SH); buf = new Uint32Array(img.data.buffer); }
    buf.fill(0);
    var X = function (f) { return f * SW; }, Y = function (f) { return f * SH; }, u = Math.max(1, SH / 120);
    var br = Math.round(Math.sin(t * 1.5) * Math.max(1, u * 0.9));   // breathing lift (upper body)
    var GY = SH - 2;

    // stretched leg (far, along the ground) + root foot with toes up
    var sr = Y(0.035);
    limb([X(0.36), GY - sr], [X(0.62), GY - sr], [X(0.90), GY - Y(0.045)], sr, Y(0.025), 2.8);
    var wig = (t % 7) < 0.4 ? Math.round(Math.sin((t % 7) / 0.4 * Math.PI) * u) : 0;
    limb([X(0.89), GY - Y(0.05)], [X(0.93), GY - Y(0.08)], [X(0.95) + wig, GY - Y(0.17)], Y(0.028), Y(0.012), 3);
    limb([X(0.90), GY - Y(0.04)], [X(0.95), GY - Y(0.05)], [X(0.985), GY - Y(0.10) + wig], Y(0.022), Y(0.01), 3);
    limb([X(0.88), GY - Y(0.02)], [X(0.94), GY], [X(0.99), GY - Y(0.01)], Y(0.016), Y(0.008), 2.6);

    // braced arm: shoulder -> elbow on ground -> forearm forward, root fingers splayed
    limb([X(0.20), Y(0.46) - br], [X(0.13), Y(0.70)], [X(0.12), GY - Y(0.05)], Y(0.024), Y(0.022), 3);
    limb([X(0.12), GY - Y(0.045)], [X(0.17), GY - Y(0.03)], [X(0.24), GY - Y(0.03)], Y(0.022), Y(0.018), 3.2);
    for (var f = 0; f < 4; f++) limb([X(0.235), GY - Y(0.03)], [X(0.26 + f*0.012), GY - Y(0.02 - f*0.004)], [X(0.275 + f*0.018), GY - Y(0.004)], Y(0.013), Y(0.006), 3.3);

    var topY = Y(0.07) - br, tcx = X(0.30);
    // trunk/torso: stout, slightly leaning, rooty flare at the hips
    var y0 = Math.round(topY), y1 = Math.round(GY), y, x;
    function tc(yy) { var k = (yy - y0) / (y1 - y0); return { cx: X(0.290 + k * 0.07), hw: X(0.10 + k * 0.008 + Math.pow(k, 8) * 0.02) }; }
    for (y = y0; y <= y1; y++) { var T = tc(y); for (x = Math.floor(T.cx - T.hw - 1); x <= T.cx + T.hw + 1; x++) {
      var rel = (x - T.cx) / T.hw; if (Math.abs(rel) > 1.06) continue;
      if (Math.abs(rel) > 0.95) { px(x, y, PAL.out); continue; }
      var ridge = Math.sin((x - T.cx) * 0.95 + Math.sin(y * 0.12 + x * 0.07) * 2.2 + Math.sin(y * 0.031) * 3);
      var l = 3.1 + rel * 1.1 - (Math.abs(rel) > 0.8 ? 0.9 : 0) + (ridge > 0.62 ? -1.3 : ridge < -0.75 ? 0.7 : 0) + (hash(x, y) - 0.5) * 0.7;
      px(x, y, bark(l)); } }
    // end-grain cap (cut log top) with growth rings + tiny moss & sprouts
    var T0 = tc(y0), cr = T0.hw, cry = Math.max(2, cr * 0.28);
    for (y = -cry - 1; y <= cry + 1; y++) for (x = -cr - 1; x <= cr + 1; x++) { var e = (x*x)/(cr*cr) + (y*y)/(cry*cry); if (e > 1.12) continue;
      var ring = Math.floor(Math.sqrt(e) * 7 + hash(x|0, y|0) * 0.6); px(T0.cx + x, y0 + y, e > 0.9 ? PAL.out : bark(ring % 2 ? 5.2 - e : 4 - e)); }
    for (x = -cr*0.15; x <= cr*0.15; x++) px(T0.cx + x + cr*0.2, y0 - 1 + (x|0)%2, bark(1));
    mossPatch(Math.round(T0.cx - cr*0.4), Math.round(y0 + cry*0.3), cr*0.35, 41);
    for (i = 0; i < 2; i++) { var spx = T0.cx - cr*0.5 + i*cr*0.25, sws = Math.round(Math.sin(t*1.4 + i) * u); limb([spx, y0 - 1], [spx, y0 - Y(0.03)], [spx + sws, y0 - Y(0.05 + i*0.015)], Math.max(0.5, u*0.4), 0.5, 3); disc(spx + sws + u, y0 - Y(0.05 + i*0.015), Math.max(1, u), PAL.leaf[5]); px(spx + sws + u, y0 - Y(0.05 + i*0.015) - 1, PAL.leaf[6]); }
    // carved bands (rope-lashed iron rings with studs)
    [0.20, 0.58, 0.84].forEach(function (fb, bi) { var yb = Math.round(Y(fb) - (fb < 0.5 ? br : 0)), bh = Math.max(2, Math.round(Y(0.022)));
      var TB = tc(yb); for (var yy = 0; yy < bh; yy++) { var Tq = tc(yb + yy); for (var xx = -Tq.hw*0.94; xx <= Tq.hw*0.94; xx++) { var rr = xx / Tq.hw; px(Tq.cx + xx, yb + yy + Math.round((1 - rr*rr) * u * 1.2), yy === 0 ? bark(0.3) : yy === bh - 1 ? PAL.out : ((xx|0) + yy) % 3 ? bark(4.6 + rr) : bark(2.4)); } }
      for (var st3 = -2; st3 <= 2; st3++) { var sxs = TB.cx + st3 * TB.hw * 0.42, syy = yb + Math.round(bh/2) + Math.round((1 - Math.pow(st3*0.42, 2)) * u * 1.2); px(sxs, syy, '#e6c27a'); px(sxs + 1, syy, '#7a5a2a'); } });
    // the kentongan slit: deep carved slot in the belly
    var slY = Math.round(Y(0.635)), slH = Math.round(Y(0.17)), slW = Math.max(2, Math.round(X(0.018))), slx = Math.round(tc(slY).cx);
    for (y = -2; y <= slH + 2; y++) for (x = -slW - 2; x <= slW + 2; x++) { var inside = Math.abs(x) <= slW && y >= 0 && y <= slH; var rim = !inside;
      if (rim && (Math.abs(x) === slW + 2 || y === -2 || y === slH + 2)) px(slx + x, slY + y, bark(5)); else px(slx + x, slY + y, inside ? (x < 0 ? '#0a0402' : '#1e0e06') : PAL.out); }
    // ---- face ----
    var fy = Math.round(Y(0.365) - br), FT = tc(fy), fx = Math.round(FT.cx), F = FT.hw * 2, i, k;
    // forehead wrinkles
    for (k = 0; k < 3; k++) { var wy = fy - F * (0.30 - k * 0.045); for (x = -F*0.24 + k*F*0.03; x <= F*0.24 - k*F*0.03; x++) { var wyy = wy - Math.cos(x / (F*0.3)) * F * 0.03; px(fx + x, wyy, bark(1.4)); if (hash(x, k) > 0.3) px(fx + x, wyy + 1, bark(4.4)); } }
    // cheeks (warm raised bark)
    [-1, 1].forEach(function (s) { var chx = fx + s * F * 0.26, chy = fy + F * 0.08; for (var oy = -F*0.09; oy <= F*0.09; oy++) for (var ox = -F*0.11; ox <= F*0.11; ox++) { var e = (ox*ox)/(F*F*0.0121) + (oy*oy)/(F*F*0.0081); if (e > 1) continue; px(chx + ox, chy + oy, bark(e > 0.75 ? 2.4 : 4.3 + (oy < 0 ? 0.8 : 0) - (hash(ox|0, oy|0) > 0.8 ? 1 : 0))); } });
    // eye sockets, gentle eyes, heavy wise brows drooping outward
    var bl = st.blink || 0, look = Math.round(Math.sin(t * 0.31) * Math.max(1, F * 0.015));
    [-1, 1].forEach(function (s) {
      var ex = fx + s * F * 0.21, ey = fy - F * 0.10, ew = F * 0.11, eh = F * 0.055;
      for (var oy = -eh*1.6; oy <= eh*1.4; oy++) for (var ox = -ew*1.3; ox <= ew*1.3; ox++) { if ((ox*ox)/(ew*ew*1.69) + (oy*oy)/(eh*eh*2.4) <= 1) px(ex + ox, ey + oy, bark(1)); }
      var open = 1 - bl;
      if (open > 0.25) for (oy = -eh*open; oy <= eh*open; oy++) for (ox = -ew; ox <= ew; ox++) { if ((ox*ox)/(ew*ew) + (oy*oy)/(eh*eh*open*open + 0.01) > 1) continue; px(ex + ox, ey + oy, oy < -eh*open*0.3 ? '#b8862f' : PAL.eye); }
      if (open > 0.45) { var pr = Math.max(1, Math.round(F * 0.028)); for (oy = -pr; oy <= pr; oy++) for (ox = -pr; ox <= pr; ox++) if (ox*ox + oy*oy <= pr*pr + 0.5) px(ex + ox + look, ey + oy + Math.round(eh*0.2), PAL.pupil); px(ex + look - pr + 1, ey - pr + Math.round(eh*0.2) + 1, PAL.eyeHi); }
      // upper lid (soft, kind, slightly lowered) and smile-crinkles
      for (ox = -ew*1.1; ox <= ew*1.1; ox++) { var ly = ey - eh*open*0.95 - Math.cos(ox/ew*1.4)*eh*0.35*open; px(ex + ox, ly, PAL.out); px(ex + ox, ly - 1, bark(4.2)); }
      for (k = 0; k < 3; k++) for (var q = 0; q < F*0.05; q++) px(ex + s*(ew*1.25 + q), ey + (k-1)*F*0.03 + q*(k-1)*0.4, bark(1.3));
      // brow: thick bark ridge, arching up in the middle, drooping at the outer end (wise, not angry)
      for (ox = -ew*1.5; ox <= ew*1.9; ox++) { var xr = s * ox, k2 = ox / (ew*1.7), by2 = ey - eh*2.1 - (1 - k2*k2) * F*0.035 + Math.max(0, ox - ew*0.6) * 0.45, th = Math.max(2, F*0.055 * (1 - Math.max(0, k2)*0.4));
        for (var j = -1; j <= th; j++) { var bxp = ex + xr, byp = by2 + j; px(bxp, byp, j < 0 ? PAL.out : j < 1 ? bark(6) : j < th*0.5 ? bark(5 - (hash(bxp, byp) > 0.7 ? 1 : 0)) : j >= th - 1 ? bark(1) : bark(3.6)); }
        if (hash(ox|0, s) > 0.55) px(ex + xr, by2 + th*0.5, bark(2.5)); }
    });
    // nose: long, bulbous, knotted
    for (y = -F*0.15; y <= F*0.12; y++) { var k3 = (y + F*0.15) / (F*0.27), nw = F*(0.035 + k3*k3*0.06); for (x = -nw - 1; x <= nw + 1; x++) { var r2 = x / nw; px(fx + x, fy + y, Math.abs(r2) > 1 ? PAL.out : bark(3.5 + r2 * 1.5 + (k3 > 0.7 && r2 > -0.2 && r2 < 0.5 ? 1 : 0))); } }
    for (x = -F*0.06; x <= F*0.06; x++) px(fx + x, fy + F*0.125, PAL.out);
    px(fx - F*0.04, fy + F*0.10, bark(0)); px(fx + F*0.04, fy + F*0.10, bark(0));
    // mouth (under the moustache): warm closed smile, or open dark oval when speaking
    var m = clamp(st.mouth || 0, 0, 1), my = fy + F * 0.20, mw = F * 0.26, mh = F * 0.20 * m;
    if (m > 0.05) {
      for (y = -1; y <= mh + 1; y++) for (x = -mw - 1; x <= mw + 1; x++) { var e2 = (x*x)/((mw+1)*(mw+1)) + Math.pow((y - mh/2)/(mh/2 + 1.5), 2); if (e2 > 1) continue; px(fx + x, my + y, e2 > 0.72 ? PAL.out : (y > mh * 0.62 && Math.abs(x) < mw*0.6) ? PAL.tongue : PAL.mouth); }
      for (x = -mw*0.55; x <= mw*0.55; x++) if ((x|0) % 3) px(fx + x, my, PAL.teeth);
    } else for (x = -mw*1.1; x <= mw*1.1; x++) { var sy2 = my + Math.cos(x / mw * 1.35) * F * 0.06; px(fx + x, sy2, PAL.out); px(fx + x, sy2 + 1, PAL.out); px(fx + x, sy2 + 2, bark(5)); if (Math.abs(x) > mw*0.95) px(fx + x, sy2 - 1, PAL.out); }
    // knots & a small owl nook low on the trunk
    function knot(kx, ky, kr) { for (var q2 = kr; q2 >= 1; q2--) for (var a = 0; a < 6.3; a += 0.4/q2) px(kx + Math.cos(a)*q2*1.3, ky + Math.sin(a)*q2, q2 === kr ? PAL.out : bark(q2 % 2 ? 4.5 : 2)); px(kx, ky, PAL.out); }
    knot(fx - F*0.40, fy - F*0.30, Math.max(2, F*0.04)); knot(fx + F*0.30, Y(0.74), Math.max(2, F*0.04)); knot(fx - F*0.28, Y(0.50), Math.max(2, F*0.03));
    // moss on shoulders, hips, limbs; lichen freckles
    
    mossPatch(X(0.31), Y(0.93), X(0.05), 9);
    for (i = 0; i < 30; i++) { var lx = X(0.20 + hash(i, 21) * 0.22), ly2 = Y(0.40 + hash(i, 23) * 0.48); if (get(lx, ly2) && (Math.abs(lx - fx) > F*0.45 || ly2 > fy + F*0.7) && i % 3 === 0) px(lx, ly2, hash(i, 2) > 0.5 ? '#b9c79a' : PAL.moss[2]); }

    // wooden bat (pentung) leaning on the raised knee: thin grip low, fat rounded club up top
    limb([X(0.86), GY - Y(0.01)], [X(0.80), Y(0.55)], [X(0.745), Y(0.16)], Y(0.014), Y(0.05), 3.6);
    disc(X(0.745), Y(0.16), Y(0.05) + 1, PAL.out); disc(X(0.745), Y(0.16), Y(0.05), bark(3.8)); disc(X(0.735), Y(0.145), Y(0.02), bark(5.5));
    for (i = 0; i < 3; i++) { var gk = 0.08 + i * 0.03; var gp = bez([X(0.86), GY], [X(0.80), Y(0.55)], [X(0.745), Y(0.16)], gk); px(gp[0] - 1, gp[1], bark(1)); px(gp[0], gp[1], bark(1)); px(gp[0] + 1, gp[1], bark(1)); }
    knot(X(0.775), Y(0.32), Math.max(1, Y(0.012)));
    // raised knee leg (near side): hip -> knee -> planted root foot
    var knee = [X(0.635), Y(0.43) - br * 0.5];
    limb([X(0.40), Y(0.80)], [X(0.52), Y(0.52)], knee, Y(0.036), Y(0.03), 3.4);
    limb(knee, [X(0.72), Y(0.62)], [X(0.765), GY - Y(0.06)], Y(0.03), Y(0.026), 3.2);
    limb([X(0.75), GY - Y(0.05)], [X(0.79), GY - Y(0.01)], [X(0.84), GY - Y(0.01)], Y(0.04), Y(0.02), 3);
    for (f = 0; f < 3; f++) limb([X(0.80), GY - Y(0.02)], [X(0.84 + f*0.01), GY - Y(0.01)], [X(0.86 + f*0.022), GY], Y(0.012), Y(0.006), 2.8);
    mossPatch(knee[0] - X(0.01), knee[1] - Y(0.045), X(0.045), 31);
    // resting arm: shoulder -> elbow -> twig hand draped over the knee (taps gently)
    var tap = st.tap || 0, hand = [X(0.615), Y(0.395) - br * 0.5];
    limb([X(0.405), Y(0.60) - br], [X(0.54), Y(0.64)], hand, Y(0.024), Y(0.02), 3.5);
    for (f = 0; f < 4; f++) { var lift = (f === 1 ? tap : f === 2 ? tap * 0.5 : 0) * Y(0.03);
      limb([hand[0] + X(0.01), hand[1]], [knee[0] + X(0.025 + f*0.008), knee[1] - Y(0.02) - lift], [knee[0] + X(0.035 + f*0.011), knee[1] + Y(0.05 + f*0.012) - lift * 1.5], Y(0.016), Y(0.007), 3.8); }

    // mushrooms & glowcaps around the base
    var ms = Math.max(2, Y(0.022));
    shroom(X(0.06), GY, ms * 1.3, false); shroom(X(0.085), GY, ms, false); shroom(X(0.30), GY, ms * 0.8, true); shroom(X(0.33), GY, ms * 0.6, true);
    shroom(X(0.70), GY, ms * 0.9, false); shroom(X(0.995), GY, ms * 0.7, true); shroom(X(0.455), Y(0.88), ms * 0.6, true);
    // grass tufts along the ground line
    for (x = 0; x < SW; x += 2) if (hash(x, 99) > 0.55) { var gh = 1 + Math.round(hash(x, 98) * u * 2); for (k = 0; k < gh; k++) px(x + (k > 1 ? 1 : 0), GY + 1 - k, PAL.moss[k ? 2 : 1]); }

    cv.getContext('2d').putImageData(img, 0, 0);
    var ox0 = Math.round(cx - SW / 2), oy0 = Math.round(gy - SH + 2);
    c.drawImage(cv, ox0, oy0);
    return { mouthX: ox0 + fx, mouthY: oy0 + my + mh, headTop: oy0, crownCx: ox0 + X(0.30), w: SW, h: SH, x: ox0, y: oy0 };
  }
  function idle(t, speaking) {
    var bp = t % 4.6, blink = bp < 0.16 ? Math.sin(bp / 0.16 * Math.PI) : 0;
    var tp = t % 6, tap = tp < 0.6 ? Math.abs(Math.sin(tp / 0.6 * Math.PI * 2)) : 0;
    var mouth = speaking ? 0.3 + 0.7 * Math.abs(Math.sin(t * 9)) : 0;
    return { t: t, blink: blink, tap: tap, mouth: mouth };
  }
  // size helper: largest sprite height that fits a W x H logical viewport
  function fit(W, H) { return Math.floor(Math.min(H * 0.86, (W * 0.98) / 1.6)); }
  G.Tung = { draw: draw, idle: idle, fit: fit, palette: PAL };
})(typeof window !== 'undefined' ? window : globalThis);
