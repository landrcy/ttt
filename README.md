# Talk to Tung (ttt)
Static pixel-art site: a huge reclining Tung Tung Tung Sahur in a night woodland. Ask him things; he bangs his drum and answers.
Open `index.html` directly in a browser (or `python3 -m http.server` in this folder). No build, no backend.

Files: `tung.js` sprite (procedural pixels, no photo), `world.js` woodland + wooden title font, `speech.js` reply bank + typewriter,
`sfx.js` audio, `app.js` loop/scale (Sea of Thought rule S=5/4/3/2, smoothing off, delta time), `sprite-preview.html` sprite-only viewer.
Tests: `node tests/smoke.test.js`; screenshots: `python3 tests/screenshots.py` -> /workspace/preview/ttt/.
`assets/*-ref.png` are art references only (not shipped in the scene).

## Audio credits
- SFX `assets/sfx/bang1-5.ogg`, `knock.ogg`: from "80 CC0 RPG SFX" (wood_01–05, item_wood_01) by rubberduck, OpenGameArt — CC0 1.0. https://opengameart.org/content/80-cc0-rpg-sfx
- Ambient `assets/music/forest-ambience.mp3`: "Forest Ambience", OpenGameArt — CC0 1.0. https://opengameart.org/content/forest-ambience (plays at 22% volume after first send; toggle button remembers choice).
