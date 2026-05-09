# Chrome Web Store — Screenshot Guide

The store requires **1–5 screenshots** at exactly **1280×800 px** (PNG or JPEG).
Three screenshots are recommended; instructions for each are below.

---

## Setup

1. Load the unpacked extension from `dist/` in Chrome (`chrome://extensions` → Developer mode → Load unpacked)
2. Open a window with at least 8–10 tabs across different domains
3. Suspend 3–4 of them manually via the popup so you have a realistic mixed state
4. Open Chrome DevTools, set device dimensions to **1280×800**, take screenshots from there — or use a full-page screenshot tool

---

## Screenshot 1 — Mixed tab states in the popup

**Goal:** Show the core value prop — a list of tabs with different statuses visible at once.

**Setup:**
- Have at least 2 active tabs, 2 suspended tabs, and 1 whitelisted tab visible in the list
- The stats bar should show something like `8 tabs · 2 suspended · ~300 MB freed`
- The popup should be open (floating over a neutral browser window)

**What to show:**
- The `DORMANT` header with the suspended-count badge
- The stats bar
- Tab rows with the green `active`, grey `suspended`, and purple `whitelisted` badges visible
- The suspend (⏸) and restore (▶) buttons on rows

---

## Screenshot 2 — Settings panel with whitelist entry

**Goal:** Show configurability — threshold slider and a populated whitelist.

**Setup:**
- Scroll down or expand the settings section in the popup
- Set the threshold slider to something non-default (e.g. 15 min)
- Add at least one domain to the whitelist (e.g. `github.com`)

**What to show:**
- The threshold slider with the minute value displayed
- At least one domain listed in the whitelist with its × remove button
- The "Add domain" input field (empty, ready for input)

---

## Screenshot 3 — High suspended count, MB saved

**Goal:** Show impact — lots of tabs suspended, meaningful memory recovered.

**Setup:**
- Open 10–12 tabs across different sites
- Use "Suspend All" to suspend them all at once
- The stats bar should read something like `12 tabs · 10 suspended · ~1,500 MB freed`

**What to show:**
- The stats bar prominently displaying the MB saved
- A scrollable list of mostly-suspended tabs (grey badges)
- The popup badge on the toolbar icon showing the suspended count

---

## Promo tile — 440×280 px

Required for the store's small promo banner. To be designed separately.

**Suggested concept:**
- Dark background (`#0a0a0a`)
- "Dormant" in large monospace type, purple (`#7c6af7`)
- Tagline below: "Suspend inactive tabs. Reclaim your RAM."
- The crescent moon + z icon from the extension, enlarged, in the upper right
- No screenshots — keep it typographic and clean

**Tools:** Figma, Sketch, or any vector tool. Export as PNG at exactly 440×280.

---

## File naming for upload

```
screenshot-1-tab-list.png
screenshot-2-settings.png
screenshot-3-suspended-count.png
promo-tile-440x280.png
```
