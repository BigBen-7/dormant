export type TabStatus = 'active' | 'suspended' | 'whitelisted'

export interface TabInfo {
  id: number
  title: string
  url: string
  favIconUrl: string
  status: TabStatus
}

export interface Settings {
  thresholdMinutes: number
  whitelist: string[]
}

export type DormantMessage =
  | { type: 'GET_TABS' }
  | { type: 'SUSPEND_TAB'; tabId: number }
  | { type: 'RESTORE_TAB'; tabId: number }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<Settings> }
