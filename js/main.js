/* =========================================================================
   Wedding Website — main.js
   Two jobs: the live countdown, and the mobile menu button.
   ========================================================================= */

/* -------------------------------------------------------------------------
   ✏️  EDIT ME: the wedding date and time.
   Format: "YYYY-MM-DDTHH:MM:SS" (24-hour clock, local time).
   This one placeholder controls the countdown on the home page.
   ------------------------------------------------------------------------- */
const WEDDING_DATE = "2026-11-08T16:00:00";

/* ---- Countdown ---------------------------------------------------------- */
function initCountdown() {
  const target = new Date(WEDDING_DATE).getTime();
  const el = {
    days:    document.getElementById("cd-days"),
    hours:   document.getElementById("cd-hours"),
    minutes: document.getElementById("cd-minutes"),
    seconds: document.getElementById("cd-seconds"),
  };
  // Only run if the countdown exists on this page.
  if (!el.days) return;

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    const now = Date.now();
    let diff = target - now;

    if (diff <= 0) {
      el.days.textContent = "00";
      el.hours.textContent = "00";
      el.minutes.textContent = "00";
      el.seconds.textContent = "00";
      const note = document.getElementById("cd-note");
      if (note) note.textContent = "Today's the day! 🤍";
      clearInterval(timer);
      return;
    }

    const day = 1000 * 60 * 60 * 24;
    const hour = 1000 * 60 * 60;
    const min = 1000 * 60;

    el.days.textContent    = pad(Math.floor(diff / day));    diff %= day;
    el.hours.textContent   = pad(Math.floor(diff / hour));   diff %= hour;
    el.minutes.textContent = pad(Math.floor(diff / min));    diff %= min;
    el.seconds.textContent = pad(Math.floor(diff / 1000));
  }

  tick();
  const timer = setInterval(tick, 1000);
}

/* ---- Mobile menu -------------------------------------------------------- */
function initNav() {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    links.classList.toggle("is-open");
  });
  // Close menu after tapping a link (mobile).
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => links.classList.remove("is-open"))
  );
}

/* ---- Auto-retry images that fail to load -------------------------------- */
// On a shaky connection an image request can be dropped, and the browser
// won't retry on its own. This retries a failed image up to 3 times with a
// short backoff (and a cache-busting query so it re-fetches).
function initImageRetry() {
  document.addEventListener(
    "error",
    function (e) {
      var img = e.target;
      if (!img || img.tagName !== "IMG") return;
      var tries = parseInt(img.getAttribute("data-retry") || "0", 10);
      if (tries >= 3) return;
      img.setAttribute("data-retry", tries + 1);
      var base = img.src.split("#")[0].split("?")[0];
      setTimeout(function () {
        img.src = base + "?r=" + (tries + 1);
      }, 700 * (tries + 1));
    },
    true // capture phase — image "error" events don't bubble
  );
}

initImageRetry();

/* ---- Accurate #anchor scrolling despite lazy-loaded images -------------- */
// Lazy images above the target collapse to 0 height until loaded, so a hash
// jump lands short. This force-loads images before the target, then scrolls.
function initHashScroll() {
  if (!location.hash) return;
  var target;
  try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); }
  catch (e) { return; }
  if (!target) return;

  var pending = [];
  Array.prototype.forEach.call(document.images, function (img) {
    // DOCUMENT_POSITION_PRECEDING (2) => img appears before the target
    if (target.compareDocumentPosition(img) & 2) {
      if (img.loading === "lazy") img.loading = "eager";
      if (!img.complete) {
        pending.push(new Promise(function (res) {
          img.addEventListener("load", res, { once: true });
          img.addEventListener("error", res, { once: true });
        }));
      }
    }
  });

  function go() { target.scrollIntoView({ block: "start" }); }
  go();
  if (pending.length) Promise.all(pending).then(function () { setTimeout(go, 50); });
  window.addEventListener("load", function () { setTimeout(go, 80); });
}

document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initNav();
  initHashScroll();
});
