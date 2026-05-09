import { evaluateAllTabs } from './suspender'
import { initDefaults, getSettings, getLastActiveMap, setLastActive, updateSettings } from './storage'
import type { DormantMessage, TabInfo } from '../shared/types'
import { ALARM_NAME, ALARM_PERIOD_MINUTES } from '../shared/constants'

// ─── Install ────────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(async () => {
  try {
    await initDefaults()
    chrome.alarms.create(ALARM_NAME, { periodInMinutes: ALARM_PERIOD_MINUTES })
  } catch (err) {
    console.error('[dormant] onInstalled failed:', err)
  }
})

// ─── Alarm ──────────────────────────────────────────────────────────────────

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return
  try {
    const [settings, lastActiveMap] = await Promise.all([
      getSettings(),
      getLastActiveMap(),
    ])
    await evaluateAllTabs(settings, lastActiveMap)
    await updateBadge()
  } catch (err) {
    console.error('[dormant] alarm handler failed:', err)
  }
})

// ─── Tab activity tracking ───────────────────────────────────────────────────

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    await setLastActive(tabId, Date.now())
  } catch (err) {
    console.error('[dormant] onActivated failed:', err)
  }
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status !== 'complete') return
  try {
    await setLastActive(tabId, Date.now())
  } catch (err) {
    console.error('[dormant] onUpdated failed:', err)
  }
})

// ─── Message handling ────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message: DormantMessage, _sender, sendResponse) => {
  handleMessage(message).then(sendResponse).catch((err) => {
    console.error('[dormant] message handler failed:', err)
    sendResponse({ error: String(err) })
  })
  return true // keep channel open for async response
})

async function handleMessage(message: DormantMessage): Promise<unknown> {
  switch (message.type) {
    case 'GET_TABS': {
      const [tabs, settings] = await Promise.all([
        chrome.tabs.query({}),
        getSettings(),
      ])
      const tabInfoList: TabInfo[] = tabs.map((tab) => {
        const url = tab.url ?? ''
        const isWhitelisted = settings.whitelist.some((pattern) =>
          url.includes(pattern)
        )
        const status = tab.discarded
          ? 'suspended'
          : isWhitelisted
          ? 'whitelisted'
          : 'active'
        return {
          id: tab.id ?? 0,
          title: tab.title ?? '',
          url,
          favIconUrl: tab.favIconUrl ?? '',
          status,
        }
      })
      return tabInfoList
    }

    case 'SUSPEND_TAB': {
      await chrome.tabs.discard(message.tabId)
      return { ok: true }
    }

    case 'RESTORE_TAB': {
      await chrome.tabs.reload(message.tabId)
      return { ok: true }
    }

    case 'UPDATE_SETTINGS': {
      await updateSettings(message.settings)
      return { ok: true }
    }

    default:
      return { error: 'unknown message type' }
  }
}

// ─── Badge ───────────────────────────────────────────────────────────────────

async function updateBadge(): Promise<void> {
  try {
    const tabs = await chrome.tabs.query({ discarded: true })
    const count = tabs.length
    chrome.action.setBadgeText({ text: count > 0 ? String(count) : '' })
    chrome.action.setBadgeBackgroundColor({ color: '#6366f1' })
  } catch (err) {
    console.error('[dormant] badge update failed:', err)
  }
}
