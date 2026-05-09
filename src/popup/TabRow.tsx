import { useState } from 'react'
import type { TabInfo, TabStatus } from '../shared/types'
import './TabRow.css'

interface Props {
  tab: TabInfo
  onSuspend: (tabId: number) => void
  onRestore: (tabId: number) => void
  onWhitelistToggle: (domain: string, currentlyWhitelisted: boolean) => void
}

const STATUS_LABEL: Record<TabStatus, string> = {
  active: 'Active',
  idle: 'Idle',
  suspended: 'Suspended',
  whitelisted: 'Whitelisted',
}

export default function TabRow({ tab, onSuspend, onRestore, onWhitelistToggle }: Props) {
  const [faviconError, setFaviconError] = useState(false)

  const title = tab.title || tab.url || 'Untitled'
  const isWhitelisted = tab.status === 'whitelisted'
  const isSuspended = tab.status === 'suspended'

  return (
    <div className="tab-row">
      <div className="tab-favicon-wrap">
        {!faviconError && tab.favIconUrl ? (
          <img
            src={tab.favIconUrl}
            alt=""
            className="tab-favicon"
            onError={() => setFaviconError(true)}
          />
        ) : (
          <span className="tab-favicon-fallback" />
        )}
      </div>

      <div className="tab-info">
        <span className="tab-title" title={title}>
          {title}
        </span>
        {tab.domain && <span className="tab-domain">{tab.domain}</span>}
      </div>

      <span className={`tab-status status-${tab.status}`}>
        {STATUS_LABEL[tab.status]}
      </span>

      <div className="tab-actions">
        {isSuspended ? (
          <button
            className="action-btn"
            title="Restore tab"
            onClick={() => onRestore(tab.id)}
          >
            ▶
          </button>
        ) : (
          <button
            className="action-btn"
            title="Suspend tab"
            disabled={isWhitelisted}
            onClick={() => onSuspend(tab.id)}
          >
            ⏸
          </button>
        )}

        <button
          className={`action-btn whitelist-btn${isWhitelisted ? ' is-whitelisted' : ''}`}
          title={isWhitelisted ? 'Remove from whitelist' : 'Add to whitelist'}
          disabled={!tab.domain}
          onClick={() => tab.domain && onWhitelistToggle(tab.domain, isWhitelisted)}
        >
          {isWhitelisted ? '★' : '☆'}
        </button>
      </div>
    </div>
  )
}
