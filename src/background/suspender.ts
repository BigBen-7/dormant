import type { Settings } from '../shared/types'
import { SKIP_URL_SCHEMES, MB_PER_TAB } from '../shared/constants'

export function getDomainFromTab(tab: chrome.tabs.Tab): string {
  if (!tab.url) return ''
  try {
    return new URL(tab.url).hostname
  } catch {
    return ''
  }
}

export function shouldSuspend(
  tab: chrome.tabs.Tab,
  lastActive: number,
  settings: Settings
): boolean {
  if (tab.discarded) return false
  if (tab.active) return false
  if (tab.audible) return false

  const url = tab.url ?? ''
  if (!url || SKIP_URL_SCHEMES.some((scheme) => url.startsWith(scheme))) return false

  const domain = getDomainFromTab(tab)
  if (domain && settings.whitelist.some((pattern) => url.includes(pattern))) return false

  const idleMs = Date.now() - lastActive
  return idleMs > settings.thresholdMinutes * 60 * 1000
}

export async function suspendTab(tabId: number): Promise<void> {
  try {
    await chrome.tabs.discard(tabId)
  } catch (err) {
    console.error(`[dormant] failed to discard tab ${tabId}:`, err)
  }
}

export async function evaluateAllTabs(
  settings: Settings,
  lastActiveMap: Record<number, number>
): Promise<number> {
  const tabs = await chrome.tabs.query({})
  let suspended = 0

  for (const tab of tabs) {
    if (tab.id === undefined) continue
    // Default to now so untracked tabs aren't immediately suspended
    const lastActive = lastActiveMap[tab.id] ?? Date.now()
    if (shouldSuspend(tab, lastActive, settings)) {
      await suspendTab(tab.id)
      suspended++
    }
  }

  return suspended
}

export function estimateMBSaved(suspendedCount: number): number {
  return suspendedCount * MB_PER_TAB
}
