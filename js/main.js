/* =========================================================================
   Wedding Website — main.js
   Two jobs: the live countdown, and the mobile menu button.
   ========================================================================= */

/* -------------------------------------------------------------------------
   ✏️  EDIT ME: the wedding date and time.
   Format: "YYYY-MM-DDTHH:MM:SS" (24-hour clock, local time).
   This one placeholder controls the countdown on the home page.
   ------------------------------------------------------------------------- */
const WEDDING_DATE = "2027-06-12T16:00:00";

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

document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initNav();
});
