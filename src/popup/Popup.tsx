import { useEffect, useState } from 'react'
import type { DormantResponse, TabInfo } from '../shared/types'
import { MB_PER_TAB } from '../shared/constants'
import TabRow from './TabRow'
import Settings from './Settings'
import './Popup.css'

export default function Popup() {
  const [tabs, setTabs] = useState<TabInfo[]>([])
  const [loading, setLoading] = useState(true)

  const totalSuspended = tabs.filter((t) => t.status === 'suspended').length
  const estimatedMBSaved = totalSuspended * MB_PER_TAB

  async function fetchTabs() {
    try {
      const response = (await chrome.runtime.sendMessage({
        type: 'GET_TABS',
      })) as DormantResponse
      if (response?.success && Array.isArray(response.data)) {
        setTabs(response.data as TabInfo[])
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
          tabs.map((tab) => <TabRow key={tab.id} tab={tab} />)
        )}
      </div>

      <div className="popup-settings-section">
        <Settings />
      </div>
    </div>
  )
}
