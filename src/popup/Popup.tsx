import { useEffect, useState } from 'react'
import type { DormantResponse, DormantSettings, TabInfo } from '../shared/types'
import { DEFAULT_SETTINGS, MB_PER_TAB } from '../shared/constants'
import TabRow from './TabRow'
import Settings from './Settings'
import './Popup.css'

export default function Popup() {
  const [tabs, setTabs] = useState<TabInfo[]>([])
  const [settings, setSettings] = useState<DormantSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  const totalSuspended = tabs.filter((t) => t.status === 'suspended').length
  const estimatedMBSaved = totalSuspended * MB_PER_TAB

  async function fetchTabs() {
    try {
      const response = (await chrome.runtime.sendMessage({
        type: 'GET_TABS',
      })) as DormantResponse
      if (response?.success && response.data) {
        const { tabs: tabList, settings: currentSettings } = response.data as {
          tabs: TabInfo[]
          settings: DormantSettings
        }
        setTabs(tabList)
        setSettings(currentSettings)
      }
    } catch (err) {
      console.error('[dormant] fetchTabs failed:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTabs()
    const interval = setInterval(fetchTabs, 2000)
    return () => clearInterval(interval)
  }, [])

  async function handleSuspend(tabId: number) {
    await chrome.runtime.sendMessage({ type: 'SUSPEND_TAB', payload: tabId })
    fetchTabs()
  }

  async function handleRestore(tabId: number) {
    await chrome.runtime.sendMessage({ type: 'RESTORE_TAB', payload: tabId })
    fetchTabs()
  }

  async function handleWhitelistToggle(domain: string, currentlyWhitelisted: boolean) {
    const newWhitelist = currentlyWhitelisted
      ? settings.whitelist.filter((d) => d !== domain)
      : [...new Set([...settings.whitelist, domain])]
    await chrome.runtime.sendMessage({
      type: 'UPDATE_SETTINGS',
      payload: { whitelist: newWhitelist },
    })
    fetchTabs()
  }

  return (
    <div className="popup">
      <header className="popup-header">
        <span className="popup-title">Dormant</span>
        {totalSuspended > 0 && (
          <span className="popup-badge">{totalSuspended}</span>
        )}
      </header>

      <div className="popup-stats">
        {totalSuspended} tab{totalSuspended !== 1 ? 's' : ''} suspended
        <span className="popup-stats-sep">·</span>
        ~{estimatedMBSaved} MB saved
      </div>

      <div className="popup-tab-list">
        {loading ? (
          <p className="popup-state-msg">Loading...</p>
        ) : tabs.length === 0 ? (
          <p className="popup-state-msg">All tabs are active</p>
        ) : (
          tabs.map((tab) => (
            <TabRow
              key={tab.id}
              tab={tab}
              onSuspend={handleSuspend}
              onRestore={handleRestore}
              onWhitelistToggle={handleWhitelistToggle}
            />
          ))
        )}
      </div>

      <div className="popup-settings-section">
        <Settings />
      </div>
    </div>
  )
}
