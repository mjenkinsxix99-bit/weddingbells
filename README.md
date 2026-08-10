# 💜 Makayla & Micah — Wedding Website

A simple, elegant wedding website built with plain HTML, CSS, and JavaScript.
No frameworks, no build step — just open it and it works.

**The day:** Sunday, November 8, 2026
**The place:** The Springs in Lake Conroe, Texas
**The colors:** Plum, with sage green, gold, and soft lilac

> Some details (ceremony time, hotels, photos, and Micah's side of the story) are
> still placeholders, clearly marked so we can fill them in together.

## 📄 The pages

| File           | What it is                                                                 |
|----------------|----------------------------------------------------------------------------|
| `index.html`   | Home — the couple, the date, a live countdown, and ceremony/reception details. |
| `story.html`   | Our Story — a milestone timeline, "Her Story / His Story," the pet family ("Our Little Zoo"), and a photo gallery. |
| `travel.html`  | Travel & Registry — hotels, directions, things to do, and gift links.      |

## 👀 How to see it

Double-click `index.html` and it opens in your web browser. That's it.

## ✏️ What still needs the real details

- **Ceremony time** — start time at The Springs in Lake Conroe (`index.html`).
- **Micah's side** — "His Story" on `story.html` is a placeholder for him to write.
- **Photos** — childhood pics, prom, the proposal, and the pets. Drop images into
  the `assets/` folder and tell me the file names; I'll place them in the timeline
  and gallery.
- **Hotels, directions, registry links** — on `travel.html`.
- **The new last name** — mentioned in the story; we can feature it whenever you'd
  like to reveal it.

## 🎵 Music

Four tracks in `assets/music/` play softly in the background (fixed at 40%
volume), looping forever in random order — never the same song twice in a row,
and never repeating with only one song in between. A floating ♪ button (bottom
right) lets anyone turn it on or off; the choice is remembered as you move
between pages. Because browsers block audio until a visitor interacts with the
page, the music starts on the first tap/click/scroll. To change the songs, swap
the files in `assets/music/` and update the list at the top of `js/music.js`.

## 🎨 Changing the look

- **Colors:** all defined once at the top of `css/styles.css` under `--- Palette ---`.
- **Countdown date:** one line at the top of `js/main.js`, marked `✏️ EDIT ME`.

## 🌐 Putting it online (later)

When it's ready, this can be hosted for **free** on GitHub Pages, Netlify, or Vercel.
