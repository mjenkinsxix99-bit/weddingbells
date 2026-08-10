/* =========================================================================
   Wedding Website — music.js
   Background music player.

   Rules:
     • Volume fixed at 40%.
     • The 4 tracks loop forever in random order.
     • A track never plays back-to-back, and never repeats with only one
       song in between (no A → B → A). We do this by keeping the last TWO
       played tracks out of the running and picking randomly from the rest.

   Notes:
     • Browsers block audio from auto-starting until the visitor interacts
       with the page, so on first visit the music kicks in on the first tap,
       click, scroll, or key press — and a floating ♪ button lets anyone
       turn it on or off at any time.
     • The on/off choice and the recent-play history are remembered for the
       browsing session, so navigating between pages keeps the music going
       instead of restarting it.
   ========================================================================= */

(function () {
  var TRACKS = [
    "assets/music/beneath-the-wedding-sky.mp3",
    "assets/music/beneath-the-wedding-bells.mp3",
    "assets/music/bells-and-bunting.mp3",
    "assets/music/bells-and-bunting-2.mp3"
  ];
  var VOLUME = 0.4;
  var HISTORY_KEY = "wb-music-history"; // last 2 track indices
  var INTENT_KEY = "wb-music-intent";   // "on" | "off" (unset = default on)

  var audio = new Audio();
  audio.volume = VOLUME;
  audio.preload = "auto";

  /* ---- Session helpers ---- */
  function getHistory() {
    try { return JSON.parse(sessionStorage.getItem(HISTORY_KEY)) || []; }
    catch (e) { return []; }
  }
  function rememberPlayed(i) {
    var h = getHistory();
    h.push(i);
    while (h.length > 2) h.shift();          // keep only the last two
    try { sessionStorage.setItem(HISTORY_KEY, JSON.stringify(h)); } catch (e) {}
  }
  function setIntent(v) {
    try { sessionStorage.setItem(INTENT_KEY, v); } catch (e) {}
  }
  function getIntent() {
    try { return sessionStorage.getItem(INTENT_KEY); } catch (e) { return null; }
  }

  /* ---- Track selection ---- */
  function pickNextIndex() {
    var recent = getHistory();               // up to 2 recent indices
    var pool = [];
    for (var i = 0; i < TRACKS.length; i++) {
      if (recent.indexOf(i) === -1) pool.push(i);
    }
    if (pool.length === 0) {                  // safety net (shouldn't happen with 4)
      for (var j = 0; j < TRACKS.length; j++) pool.push(j);
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }
  function playNewTrack() {
    var i = pickNextIndex();
    rememberPlayed(i);
    audio.src = TRACKS[i];
    audio.play().catch(function () {});
  }

  // When a track finishes, roll to the next one — forever.
  audio.addEventListener("ended", playNewTrack);

  /* ---- Floating toggle button ---- */
  var btn = document.createElement("button");
  btn.className = "music-toggle";
  btn.type = "button";
  btn.setAttribute("aria-label", "Toggle background music");
  btn.setAttribute("aria-pressed", "false");
  btn.title = "Play / pause music";
  btn.innerHTML = '<span class="music-toggle__icon">♪</span>';

  function attachButton() {
    if (document.body) document.body.appendChild(btn);
  }
  if (document.body) attachButton();
  else document.addEventListener("DOMContentLoaded", attachButton);

  // Keep the button in sync with what the audio is actually doing.
  audio.addEventListener("play", function () {
    btn.classList.add("is-playing");
    btn.setAttribute("aria-pressed", "true");
  });
  audio.addEventListener("pause", function () {
    btn.classList.remove("is-playing");
    btn.setAttribute("aria-pressed", "false");
  });

  /* ---- Controls ---- */
  function start() {
    setIntent("on");
    if (!audio.src) playNewTrack();
    else audio.play().catch(function () {});
  }
  function stop() {
    setIntent("off");
    audio.pause();
  }
  btn.addEventListener("click", function () {
    if (audio.paused) start();
    else stop();
  });

  /* ---- Auto-start (respecting the browser + the visitor's choice) ---- */
  // Default is "on" unless the visitor has explicitly turned it off.
  if (getIntent() !== "off") {
    start(); // may be blocked by the browser until a real interaction…

    // …so also start on the first user gesture, whichever comes first.
    var events = ["pointerdown", "keydown", "touchstart", "scroll"];
    var kick = function () {
      if (getIntent() !== "off" && audio.paused) audio.play().catch(function () {});
      events.forEach(function (e) { document.removeEventListener(e, kick); });
    };
    events.forEach(function (e) {
      document.addEventListener(e, kick, { once: true, passive: true });
    });
  }
})();
