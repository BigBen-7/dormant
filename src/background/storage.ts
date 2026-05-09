import type { DormantSettings } from '../shared/types'
import { DEFAULT_SETTINGS } from '../shared/constants'

const SETTINGS_KEY = 'settings'
const LAST_ACTIVE_KEY = 'lastActive'

// ─── Defaults ────────────────────────────────────────────────────────────────

export async function initDefaults(): Promise<void> {
  try {
    const result = await chrome.storage.sync.get(SETTINGS_KEY)
    if (!result[SETTINGS_KEY]) {
      await chrome.storage.sync.set({ [SETTINGS_KEY]: DEFAULT_SETTINGS })
    }
  } catch (err) {
    console.error('[dormant] initDefaults failed:', err)
  }
}

// ─── Settings (chrome.storage.sync) ──────────────────────────────────────────

export async function getSettings(): Promise<DormantSettings> {
  try {
    const result = await chrome.storage.sync.get(SETTINGS_KEY)
    // Merge with defaults so missing fields (e.g. from an older schema) are filled in
    return { ...DEFAULT_SETTINGS, ...(result[SETTINGS_KEY] as Partial<DormantSettings> ?? {}) }
  } catch (err) {
    console.error('[dormant] getSettings failed:', err)
    return { ...DEFAULT_SETTINGS }
  }
}

export async function saveSettings(settings: DormantSettings): Promise<void> {
  try {
    await chrome.storage.sync.set({ [SETTINGS_KEY]: settings })
  } catch (err) {
    console.error('[dormant] saveSettings failed:', err)
  }
}

export async function updateSettings(patch: Partial<DormantSettings>): Promise<void> {
  try {
    const current = await getSettings()
    await chrome.storage.sync.set({ [SETTINGS_KEY]: { ...current, ...patch } })
  } catch (err) {
    console.error('[dormant] updateSettings failed:', err)
  }
}

export async function updateWhitelist(domain: string, add: boolean): Promise<void> {
  try {
    const settings = await getSettings()
    const whitelist = add
      ? [...new Set([...settings.whitelist, domain])]
      : settings.whitelist.filter((d) => d !== domain)
    await saveSettings({ ...settings, whitelist })
  } catch (err) {
    console.error('[dormant] updateWhitelist failed:', err)
  }
}

// ─── Last-active timestamps (chrome.storage.local) ───────────────────────────

export async function getLastActiveMap(): Promise<Record<number, number>> {
  try {
    const result = await chrome.storage.local.get(LAST_ACTIVE_KEY)
    return (result[LAST_ACTIVE_KEY] as Record<number, number>) ?? {}
  } catch (err) {
    console.error('[dormant] getLastActiveMap failed:', err)
    return {}
  }
}

export async function setLastActive(tabId: number, timestamp: number): Promise<void> {
  try {
    const map = await getLastActiveMap()
    await chrome.storage.local.set({ [LAST_ACTIVE_KEY]: { ...map, [tabId]: timestamp } })
  } catch (err) {
    console.error('[dormant] setLastActive failed:', err)
  }
}

export async function cleanupStaleEntries(activeTabs: chrome.tabs.Tab[]): Promise<void> {
  try {
    const map = await getLastActiveMap()
    const activeIds = new Set(
      activeTabs.map((t) => t.id).filter((id): id is number => id !== undefined)
    )
    const cleaned: Record<number, number> = {}
    for (const [key, value] of Object.entries(map)) {
      const tabId = Number(key)
      if (activeIds.has(tabId)) cleaned[tabId] = value
    }
    await chrome.storage.local.set({ [LAST_ACTIVE_KEY]: cleaned })
  } catch (err) {
    console.error('[dormant] cleanupStaleEntries failed:', err)
  }
}
