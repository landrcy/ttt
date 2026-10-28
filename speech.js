// Tung's reply bank (keyword -> lines) + picker that avoids recent repeats + typewriter.
(function (G) {
  var BANK = {
    who: { k: ['who are you', 'who r u', 'your name', 'what are you', 'who is tung', 'whats your name'], r: [
      'tung tung tung SAHUR. i am the drum. the drum is me. i am also a log. a very relaxed log.',
      'i am Tung Tung Tung Sahur, night watchman of the woods. i knock, therefore i am.',
      'they call me Triple T. three tungs. no more, no less. four tungs is illegal.',
      'a kentongan with legs and opinions. mostly opinions about waking up for sahur.'] },
    ttt: { k: ['ttt', 'triple t', 'what is this', 'this site', 'talk to tung'], r: [
      'ttt = Talk To Tung. also Tung Tung Tung. also Totally Trustworthy Timber.',
      'triple T: three knocks, one log, zero chill.',
      'this is my porch. you type, i tung. that is the deal.'] },
    drum: { k: ['drum', 'bang', 'knock', 'kentongan', 'beat', 'noise', 'loud'], r: [
      'TUNG. TUNG. TUNG. that was a gentle one. you should hear the 3am version.',
      'my belly slit is a drum. do not put snacks in it. it echoes the snacks.',
      'drum lesson one: hit wood. lesson two: hit wood again. lesson three: sahurrr.',
      'i drum so the whole woodland knows it is time. the owls hate me. respectfully.'] },
    sahur: { k: ['sahur', 'ramadan', 'wake up', 'breakfast', 'eat', 'food', 'hungry', 'dawn'], r: [
      'SAHUR SAHUR! wake up wake up! the dates will not eat themselves!',
      'if you do not wake up for sahur i will knock on your window three times. tung. tung. tung.',
      'sahur is the most important meal of the night. ask any log.',
      'eat something before dawn, friend. even the moss is having a snack.'] },
    hub: { k: ['hub', 'home', 'cottage', 'void', 'sea of thought', 'other sites', 'finley'], r: [
      'the hub? a bunch of little worlds. i am the loudest one. the ocean is the wettest one.',
      'i have heard of the sea of thought. logs float, you know. i could visit. tung by sea.',
      'other worlds exist beyond the trees. i stay here. someone has to guard the porch.'] },
    fish: { k: ['fish', 'ocean', 'sea', 'swim', 'water', 'boat'], r: [
      'fish? i am wood. i float. fish try to nibble me. i drum them away. tung tung blub.',
      'a fish once asked me for directions. i said tung. it swam off satisfied.',
      'wet log is sad log. but a drum underwater goes bloooong. very cool.'] },
    hello: { k: ['hello', 'hi', 'hey', 'yo', 'sup', 'hii', 'good evening', 'howdy', 'salam'], r: [
      'hello hello hello! three hellos, like three tungs. welcome to the porch.',
      'oh! a visitor. *knock knock*. that is how i wave.',
      'heyyy. pull up a mushroom. ask me anything. tung.',
      'evening, traveler. the fireflies told me you were coming.'] },
    bye: { k: ['bye', 'goodbye', 'good night', 'goodnight', 'see you', 'cya', 'later', 'gn'], r: [
      'bye bye bye. three byes. come back before sahur or i come to you. tung.',
      'goodnight! sleep well. i will knock at dawn. lovingly.',
      'see you later, sapling. watch out for roots on the way out.'] },
    how: { k: ['how are you', 'how r u', 'you ok', 'how do you feel', 'whats up'], r: [
      'i am chilling. look at me. reclined. a log at peace. until sahur.',
      'feeling woody. a little mossy. overall: tung out of ten.'] },
    bat: { k: ['bat', 'mallet', 'stick', 'club', 'weapon'], r: [
      'this is my pentung. it is for drumming, not bonking. mostly drumming.',
      'my bat is my best friend. we have been knocking together for years.'] },
    forest: { k: ['forest', 'woods', 'tree', 'moss', 'mushroom', 'firefly', 'owl', 'night', 'moon'], r: [
      'the woods are calm tonight. the fireflies are my backup dancers.',
      'i grow a little moss on my head. it is my hairstyle. do not touch.',
      'the moon is my night light. the lamp is my other night light. i am scared of nothing. except termites.'] },
    love: { k: ['love you', 'cute', 'friend', 'best', 'cool', 'nice'], r: [
      'aww. i would hug you but my arms are sticks. consider yourself tunged.',
      'you are officially my friend. friends get the soft knock.'] },
    joke: { k: ['joke', 'funny', 'laugh', 'meme', 'brainrot'], r: [
      'why did the log go to school? to get a little more WOOD-ucated. tung tung.',
      'knock knock. who is there? tung. tung who? TUNG TUNG TUNG SAHUR.',
      'what does a drum say at the party? let us get this beat started. i am sorry. i am wood.'] },
    scary: { k: ['scary', 'scared', 'creepy', 'afraid', 'monster'], r: [
      'scary? me? i am a big soft log with a big soft smile. i only bonk the alarm clock.',
      'do not be scared. i am huge but i am horizontal. very harmless angle.'] }
  };
  var DEFAULT = [
    'hmm. tung. let me think. tung tung. the answer is: sahur.',
    'i do not know, but i can say it louder. TUNG.',
    'the drum says yes. the bat says maybe. the moss says nothing, it is moss.',
    'great question. i will knock on it and see what echoes. ...tung. inconclusive.',
    'interesting. very interesting. anyway, did you wake up for sahur?',
    'my wood senses are tingling. ask again but with more tung.',
    'that is above my pay grade. i am paid in dates.',
    'the fireflies are whispering the answer. they say "bzzzt". i agree.',
    'i am a log. i process questions slowly. like rings. come back in a decade.',
    'tung tung tung... yeah. that is my final answer.'
  ];
  var recent = [];
  function norm(s) { return (' ' + String(s || '').toLowerCase().replace(/[^a-z0-9 ']/g, ' ').replace(/\s+/g, ' ') + ' '); }
  function topic(q) { var n = norm(q), best = null, bl = 0;
    for (var key in BANK) BANK[key].k.forEach(function (k) { if (n.indexOf(' ' + k + ' ') >= 0 && k.length > bl) { best = key; bl = k.length; } });
    return best; }
  function pick(list, rnd) { var opts = list.filter(function (r) { return recent.indexOf(r) < 0; }); if (!opts.length) opts = list; var r = opts[Math.floor((rnd || Math.random)() * opts.length)]; recent.push(r); if (recent.length > 8) recent.shift(); return r; }
  function reply(q, rnd) { if (!String(q || '').trim()) return 'say something! i cannot hear silence. it sounds like un-tung.'; var t = topic(q); return pick(t ? BANK[t].r : DEFAULT, rnd); }
  function count() { var n = DEFAULT.length; for (var k in BANK) n += BANK[k].r.length; return n; }
  // typewriter: reveal chars at ~cps; calls onDone at end
  function typewrite(el, text, cps, onTick, onDone) {
    el.textContent = ''; var word = null, i = 0, acc = 0, last = null, raf = (typeof requestAnimationFrame !== 'undefined') ? requestAnimationFrame : function (f) { return setTimeout(function () { f(Date.now()); }, 16); };
    function step(now) { if (last == null) last = now; acc += (now - last) / 1000 * cps; last = now;
      while (acc >= 1 && i < text.length) { acc -= 1; if (!word || text[i] === ' ') { word = document.createElement('span'); word.style.whiteSpace = 'nowrap'; el.appendChild(word); }
        if (text[i] === ' ') { el.appendChild(document.createTextNode(' ')); word = null; } else { var s = document.createElement('span'); s.className = 'c'; s.textContent = text[i]; word.appendChild(s); }
        if (onTick) onTick(text[i], i); i++; }
      if (i < text.length) raf(step); else if (onDone) onDone(); }
    raf(step);
  }
  G.Speech = { BANK: BANK, DEFAULT: DEFAULT, reply: reply, topic: topic, count: count, typewrite: typewrite, _recent: recent };
})(typeof window !== 'undefined' ? window : globalThis);
