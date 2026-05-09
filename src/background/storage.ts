import type { Settings } from '../shared/types'

export async function initDefaults(): Promise<void> {}

export async function getSettings(): Promise<Settings> {
  return {} as Settings
}

export async function setLastActive(_tabId: number, _timestamp: number): Promise<void> {}

export async function updateSettings(_settings: Partial<Settings>): Promise<void> {}

export async function getLastActiveMap(): Promise<Record<number, number>> {
  return {}
}
