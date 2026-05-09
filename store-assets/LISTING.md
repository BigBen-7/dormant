# Chrome Web Store — Listing Copy

## Metadata

| Field | Value |
|---|---|
| Extension name | Dormant |
| Category | Productivity |
| Language | English |

---

## Short description (132 chars max)

```
Auto-suspends inactive tabs to save RAM. Set your threshold, whitelist your favorites, done.
```

*(92 chars)*

---

## Long description

```
Dormant quietly puts your idle tabs to sleep so they stop eating your RAM — and wakes them up the moment you need them.

──────────────────────────────────────────
HOW IT WORKS
──────────────────────────────────────────

Every minute, Dormant checks which tabs you haven't visited in a while. Any tab that has been inactive longer than your chosen threshold gets suspended using Chrome's built-in discard mechanism — the tab stays in your tab bar, its title and favicon are preserved, but it's no longer consuming memory. Click it and it reloads instantly, right where you left off.

No custom suspend pages. No redirects. No loading spinners. Chrome handles the restore natively.

──────────────────────────────────────────
KEY FEATURES
──────────────────────────────────────────

• Auto-suspension — tabs inactive past your threshold (default: 30 min) are suspended automatically. You never have to think about it.

• Configurable threshold — slide it from 5 minutes to 2 hours to match how you actually work.

• Domain whitelist — add any site you never want suspended (banking apps, music players, long forms). They're always protected.

• MB saved counter — the popup shows a live estimate of how much RAM has been recovered based on your suspended tab count.

• Per-tab controls — manually suspend or restore any tab with a single click, independent of the timer.

• Suspend All — one button clears every eligible tab at once when you need to reclaim memory immediately.

──────────────────────────────────────────
BUILT ON CHROME MV3
──────────────────────────────────────────

Dormant is built exclusively on Manifest V3 APIs — the current and future standard for Chrome extensions. It uses chrome.alarms (not setInterval) so it works correctly even after Chrome's service worker goes idle, and chrome.tabs.discard (not a custom suspend page) so tab restoration is handled natively by the browser.

Zero external runtime dependencies. The entire extension is ~5 KB of JavaScript.

──────────────────────────────────────────
PRIVACY
──────────────────────────────────────────

Dormant stores nothing remotely. Your whitelist and threshold live in chrome.storage.sync (synced across your own Chrome profile, nowhere else). Tab timestamps live in chrome.storage.local. No analytics. No telemetry. No network requests of any kind.

Full privacy policy: https://bigben-7.github.io/dormant/privacy-policy.html

──────────────────────────────────────────
OPEN SOURCE
──────────────────────────────────────────

Dormant is open source. Read the code, fork it, learn from it:
https://github.com/BigBen-7/dormant
```

---

## Permissions justification (for store review)

| Permission | Justification |
|---|---|
| `tabs` | Required to list all open tabs, read their URLs and titles for display in the popup, and call `chrome.tabs.discard()` / `chrome.tabs.reload()` to suspend and restore them. |
| `storage` | Required to persist the user's whitelist and inactivity threshold across sessions (`chrome.storage.sync`) and to store per-tab last-active timestamps (`chrome.storage.local`). |
| `alarms` | Required to schedule a recurring 1-minute inactivity check using `chrome.alarms`. This is the MV3-recommended alternative to `setInterval`, which does not work reliably in service workers. |
| `activeTab` | Required to detect tab activation events so the last-active timestamp for the focused tab is updated when the user switches to it. |
