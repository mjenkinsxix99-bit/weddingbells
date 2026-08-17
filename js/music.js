/* =========================================================================
   Wedding Website — music.js
   Background music player.

   Rules:
     • Volume fixed at 40%.
     • The 4 tracks loop forever in random order.
     • A track never plays back-to-back, and never repeats with only one
       song in between (no A → B → A). We keep the last TWO played tracks
       out of the running and pick randomly from the rest.

   Continuous across pages:
     • This is a multi-page site, so each tab click reloads the page and
       recreates the audio. To keep it feeling like one continuous loop, we
       remember the CURRENT track and playback position and resume from that
       exact spot on the next page — instead of starting a new song.

   Notes:
     • Browsers block audio from auto-starting until the visitor interacts
       with the page, so on first visit the music kicks in on the first tap,
       click, scroll, or key press — and a floating ♪ button lets anyone
       turn it on or off at any time.
   ========================================================================= */

(function () {
  var TRACKS = [
    "assets/music/beneath-the-wedding-sky.mp3",
    "assets/music/beneath-the-wedding-bells.mp3",
    "assets/music/bells-and-bunting.mp3",
    "assets/music/bells-and-bunting-2.mp3"
  ];
  var VOLUME = 0.4;
  var HISTORY_KEY = "wb-music-history"; // last 2 track indices (for no-repeat)
  var INTENT_KEY  = "wb-music-intent";  // "on" | "off" (unset = default on)
  var TRACK_KEY   = "wb-music-track";   // index of the current track
  var TIME_KEY    = "wb-music-time";    // playback position (seconds)

  var audio = new Audio();
  audio.volume = VOLUME;
  audio.preload = "auto";

  /* ---- Session helpers ---- */
  function ss(key)        { try { return sessionStorage.getItem(key); } catch (e) { return null; } }
  function ssSet(key, v)  { try { sessionStorage.setItem(key, v); } catch (e) {} }

  function getHistory() {
    try { return JSON.parse(ss(HISTORY_KEY)) || []; } catch (e) { return []; }
  }
  function rememberPlayed(i) {
    var h = getHistory();
    h.push(i);
    while (h.length > 2) h.shift();       // keep only the last two
    ssSet(HISTORY_KEY, JSON.stringify(h));
  }
  function setIntent(v) { ssSet(INTENT_KEY, v); }
  function getIntent()  { return ss(INTENT_KEY); }

  /* ---- Track selection (no-repeat) ---- */
  function pickNextIndex() {
    var recent = getHistory();            // up to 2 recent indices
    var pool = [];
    for (var i = 0; i < TRACKS.length; i++) {
      if (recent.indexOf(i) === -1) pool.push(i);
    }
    if (pool.length === 0) {              // safety net (shouldn't happen with 4)
      for (var j = 0; j < TRACKS.length; j++) pool.push(j);
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /* ---- Load a specific track, optionally seeking to a saved position ---- */
  function loadTrack(index, atTime, playNow) {
    audio.src = TRACKS[index];
    ssSet(TRACK_KEY, index);
    ssSet(TIME_KEY, atTime > 0 ? atTime : 0);
    if (atTime > 0) {
      var seek = function () {
        try { if (isFinite(atTime)) audio.currentTime = atTime; } catch (e) {}
        audio.removeEventListener("loadedmetadata", seek);
      };
      audio.addEventListener("loadedmetadata", seek);
    }
    if (playNow) audio.play().catch(function () {});
  }

  // Start a brand-new track (used on first play and when a song ends).
  function playNewTrack() {
    var i = pickNextIndex();
    rememberPlayed(i);
    loadTrack(i, 0, true);
  }

  // Continue the saved track at its saved spot, or start fresh if none.
  function resumeOrStart() {
    var idx = parseInt(ss(TRACK_KEY), 10);
    var t = parseFloat(ss(TIME_KEY));
    if (idx >= 0 && idx < TRACKS.length) {
      loadTrack(idx, (t > 0 && isFinite(t)) ? t : 0, true);
    } else {
      playNewTrack();
    }
  }

  // When a track finishes, roll to the next one — forever.
  audio.addEventListener("ended", playNewTrack);

  /* ---- Save playback position so the next page can continue ---- */
  var lastSave = 0;
  audio.addEventListener("timeupdate", function () {
    var now = Date.now();
    if (now - lastSave > 900) {           // throttle writes to ~1/sec
      lastSave = now;
      if (!isNaN(audio.currentTime)) ssSet(TIME_KEY, audio.currentTime);
    }
  });
  function saveNow() {
    if (!isNaN(audio.currentTime)) ssSet(TIME_KEY, audio.currentTime);
  }
  // Save right before leaving/hiding the page (covers tab clicks & backgrounding).
  window.addEventListener("pagehide", saveNow);
  window.addEventListener("beforeunload", saveNow);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) saveNow();
  });

  /* ---- Floating toggle button ---- */
  var btn = document.createElement("button");
  btn.className = "music-toggle";
  btn.type = "button";
  btn.setAttribute("aria-label", "Toggle background music");
  btn.setAttribute("aria-pressed", "false");
  btn.title = "Play / pause music";
  btn.innerHTML = '<span class="music-toggle__icon">♪</span>';

  function attachButton() { if (document.body) document.body.appendChild(btn); }
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
    if (!audio.src) resumeOrStart();
    else audio.play().catch(function () {});
  }
  function stop() {
    setIntent("off");
    saveNow();
    audio.pause();
  }
  btn.addEventListener("click", function () {
    if (audio.paused) start();
    else stop();
  });

  /* ---- Auto-start (respecting the browser + the visitor's choice) ---- */
  // Default is "on" unless the visitor has explicitly turned it off.
  if (getIntent() !== "off") {
    resumeOrStart(); // may be blocked by the browser until a real interaction…

    // …so also resume on the first user gesture, whichever comes first.
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
