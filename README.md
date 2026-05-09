# Dormant

**Auto-suspends inactive browser tabs to free up RAM — no bloat, no tracking, no nonsense.**

![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite&logoColor=white)
![Chrome MV3](https://img.shields.io/badge/Chrome-Manifest%20V3-4285f4?style=flat-square&logo=googlechrome&logoColor=white)

---

## What it does

- Automatically discards tabs that have been inactive past a configurable threshold (default 30 min)
- Shows a live count of suspended tabs and estimated MB recovered in the popup
- Lets you whitelist domains that should never be suspended
- Uses `chrome.tabs.discard()` — tabs reload on click, no custom suspend page

## Why it exists

Dormant is a portfolio project built to demonstrate clean Chrome MV3 extension architecture: service workers, alarms-based scheduling, `chrome.storage` sync, and a React + TypeScript popup — all with zero external runtime dependencies.

## Tech stack

| Layer | Technology |
|---|---|
| UI | React 18 + TypeScript |
| Build | Vite 5 |
| Extension API | Chrome Manifest V3 |
| Storage | `chrome.storage.sync` / `.local` |
| Scheduling | `chrome.alarms` |

## Install from source

```bash
git clone https://github.com/BigBen-7/dormant.git
cd dormant
npm install
npm run build
```

Then in Chrome:

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** and select the `dist/` folder

## How to use

1. Click the Dormant icon in your toolbar to open the popup
2. Adjust the **inactivity threshold** slider in the settings panel
3. Add any domains you never want suspended to the **whitelist**

Tabs are evaluated every minute. Suspended tabs resume instantly when you click them.

## Permissions

| Permission | Why it's needed |
|---|---|
| `tabs` | Read tab URLs/titles and discard/reload tabs |
| `storage` | Persist your whitelist and threshold setting |
| `alarms` | Run the inactivity check every minute (MV3-safe — no persistent background) |
| `activeTab` | Detect which tab you switched to so its last-active timestamp updates |

## Privacy

Dormant stores nothing remotely. All data (tab timestamps, whitelist, threshold) lives exclusively in your browser via `chrome.storage`. No analytics, no telemetry, no network requests of any kind.

See the full [Privacy Policy](PRIVACY_POLICY.md).

## License

MIT
