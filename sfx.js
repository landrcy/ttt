// Wood bang SFX (CC0 files in assets/sfx) + quiet ambient loop. SFX louder than music.
(function (G) {
  var bangs = ['bang1', 'bang2', 'bang3', 'bang4', 'bang5'].map(function (n) { return 'assets/sfx/' + n + '.ogg'; }), knock = 'assets/sfx/knock.ogg';
  var music = null, musicOn = true; try { musicOn = localStorage.getItem('ttt:music') !== 'off'; } catch (e) {}
  function play(src, vol, rate) { try { var a = new Audio(src); a.volume = vol; a.playbackRate = rate || 1; a.play().catch(function () {}); } catch (e) {} }
  function tungTungTung() { // three drum hits, slightly varied, last one hardest
    for (var i = 0; i < 3; i++) (function (i) { setTimeout(function () { play(bangs[(Math.random() * bangs.length) | 0], i === 2 ? 0.95 : 0.7, 0.9 + Math.random() * 0.2 - (i === 2 ? 0.1 : 0)); }, i * 190); })(i);
  }
  function tick() { play(knock, 0.12, 1.4 + Math.random() * 0.4); }
  function startMusic() { if (!musicOn) return; if (!music) { music = new Audio('assets/music/forest-ambience.mp3'); music.loop = true; music.volume = 0; }
    music.play().then(function () { var v = 0, id = setInterval(function () { v = Math.min(0.22, v + 0.01); music.volume = v; if (v >= 0.22) clearInterval(id); }, 120); }).catch(function () {}); }
  function toggleMusic() { musicOn = !musicOn; try { localStorage.setItem('ttt:music', musicOn ? 'on' : 'off'); } catch (e) {} if (musicOn) startMusic(); else if (music) music.pause(); return musicOn; }
  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', function () { if (!music) return; if (document.hidden) music.pause(); else if (musicOn) music.play().catch(function () {}); });
  G.SFX = { tungTungTung: tungTungTung, tick: tick, startMusic: startMusic, toggleMusic: toggleMusic, isMusicOn: function () { return musicOn; } };
})(typeof window !== 'undefined' ? window : globalThis);
