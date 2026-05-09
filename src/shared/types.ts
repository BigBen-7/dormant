export type TabStatus = 'active' | 'suspended' | 'whitelisted' | 'idle'

export interface TabInfo {
  id: number
  title: string
  url: string
  favIconUrl: string
  status: TabStatus
  lastActive: number
  domain: string
}

export interface DormantSettings {
  threshold: number
  whitelist: string[]
}

export interface DormantMessage {
  type: 'GET_TABS' | 'SUSPEND_TAB' | 'RESTORE_TAB' | 'UPDATE_SETTINGS'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
}

export interface DormantResponse {
  success: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
  error?: string
}
