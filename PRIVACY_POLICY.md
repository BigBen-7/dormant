# Privacy Policy — Dormant

**Effective date: 2026-05-09**

---

## Overview

Dormant is a Chrome extension that auto-suspends inactive browser tabs. This policy explains what data the extension touches, where it stays, and what it never does.

## Data collected

**None.** Dormant does not collect, transmit, or share any personal data. No information ever leaves your browser.

## Data stored locally

Dormant stores the following data in your browser using Chrome's built-in `chrome.storage` API:

| Data | Where | Purpose |
|---|---|---|
| Last-active timestamps | `chrome.storage.local` | Track when each tab was last used so the inactivity check works correctly |
| Whitelist domains | `chrome.storage.sync` | Remember which sites you've chosen to never suspend |
| Inactivity threshold | `chrome.storage.sync` | Remember your preferred suspension delay (in minutes) |

`chrome.storage.sync` data may be synced across your Chrome profile by Google's existing browser sync — this is standard Chrome behaviour controlled entirely by your own Google account settings.

## What Dormant does not do

- Does not make any network requests
- Does not communicate with external servers
- Does not use analytics, crash reporting, or telemetry
- Does not store browsing history or page content
- Does not require an account or login
- Does not include any third-party code with its own data practices

## Third-party services

None. Dormant has zero external runtime dependencies.

## Open source

Dormant's full source code is publicly available at [https://github.com/BigBen-7/dormant](https://github.com/BigBen-7/dormant). You can audit exactly what the extension does.

## Changes to this policy

If this policy is updated, the effective date above will change. Given the nature of the extension (no data collection), meaningful changes are unlikely.

## Contact

Questions or concerns: [benardsimon7@gmail.com]
