import type { DormantSettings } from './types'

export const ALARM_NAME = 'dormant-check'
export const ALARM_INTERVAL = 1

export const DEFAULT_THRESHOLD = 30
export const MB_PER_TAB = 150

export const SKIP_URL_SCHEMES = [
  'chrome://',
  'chrome-extension://',
  'edge://',
  'about:',
  'data:',
  'file://',
]

export const DEFAULT_SETTINGS: DormantSettings = {
  threshold: DEFAULT_THRESHOLD,
  whitelist: [],
}
