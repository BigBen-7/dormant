import { useEffect, useRef, useState } from 'react'
import type { DormantSettings, TabInfo } from '../shared/types'
import { DEFAULT_THRESHOLD } from '../shared/constants'
import './Settings.css'

interface Props {
  settings: DormantSettings
  onSettingsChange: (updated: DormantSettings) => void
}

function normalizeDomain(input: string): string {
  const trimmed = input.trim()
  try {
    if (trimmed.includes('://')) return new URL(trimmed).hostname.toLowerCase()
  } catch {}
  return trimmed.toLowerCase().replace(/^www\./, '').split('/')[0]
}

function isValidDomain(domain: string): boolean {
  return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)
}

export default function Settings({ settings, onSettingsChange }: Props) {
  const [localThreshold, setLocalThreshold] = useState(
    settings.threshold ?? DEFAULT_THRESHOLD
  )
  const [domainInput, setDomainInput] = useState('')
  const [inputError, setInputError] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLocalThreshold(settings.threshold)
  }, [settings.threshold])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  function handleThresholdChange(value: number) {
    setLocalThreshold(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onSettingsChange({ ...settings, threshold: value })
    }, 500)
  }

  function handleAddDomain() {
    const domain = normalizeDomain(domainInput)
    if (!domain) {
      setInputError('Enter a domain')
      return
    }
    if (!isValidDomain(domain)) {
      setInputError('Must be a plain domain — e.g. github.com')
      return
    }
    if (settings.whitelist.includes(domain)) {
      setInputError('Already whitelisted')
      return
    }
    setInputError('')
    setDomainInput('')
    onSettingsChange({ ...settings, whitelist: [...settings.whitelist, domain] })
  }

  function handleRemoveDomain(domain: string) {
    onSettingsChange({
      ...settings,
      whitelist: settings.whitelist.filter((d) => d !== domain),
    })
  }

  async function handleSuspendAll() {
    const confirmed = window.confirm(
      'Suspend all idle and active tabs? Whitelisted tabs will be skipped.'
    )
    if (!confirmed) return
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_TABS' })
      if (!response?.success) return
      const { tabs } = response.data as { tabs: TabInfo[] }
      for (const tab of tabs) {
        if (tab.status !== 'suspended' && tab.status !== 'whitelisted') {
          await chrome.runtime.sendMessage({ type: 'SUSPEND_TAB', payload: tab.id })
        }
      }
    } catch (err) {
      console.error('[dormant] suspendAll failed:', err)
    }
  }

  return (
    <div className="settings">
      <div className="settings-header">
        <span className="settings-title">Settings</span>
      </div>

      {/* ── Threshold slider ─────────────────────────────── */}
      <div className="settings-row">
        <label className="settings-label" htmlFor="threshold-slider">
          Suspend after{' '}
          <strong className="settings-threshold-value">{localThreshold}</strong>{' '}
          minutes
        </label>
        <input
          id="threshold-slider"
          type="range"
          min={5}
          max={120}
          step={5}
          value={localThreshold}
          className="settings-slider"
          onChange={(e) => handleThresholdChange(Number(e.target.value))}
        />
        <div className="settings-slider-labels">
          <span>5m</span>
          <span>120m</span>
        </div>
      </div>

      {/* ── Whitelist ────────────────────────────────────── */}
      <div className="settings-row">
        <span className="settings-label">Whitelisted Domains</span>

        <ul className="whitelist-list">
          {settings.whitelist.length === 0 ? (
            <li className="whitelist-empty">No domains whitelisted</li>
          ) : (
            settings.whitelist.map((domain) => (
              <li key={domain} className="whitelist-item">
                <span className="whitelist-domain">{domain}</span>
                <button
                  className="whitelist-remove"
                  title={`Remove ${domain}`}
                  onClick={() => handleRemoveDomain(domain)}
                >
                  ×
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="whitelist-add">
          <input
            type="text"
            placeholder="e.g. github.com"
            value={domainInput}
            className={`whitelist-input${inputError ? ' has-error' : ''}`}
            onChange={(e) => {
              setDomainInput(e.target.value)
              setInputError('')
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleAddDomain()}
          />
          <button className="whitelist-add-btn" onClick={handleAddDomain}>
            Add
          </button>
        </div>
        {inputError && <p className="whitelist-error">{inputError}</p>}
      </div>

      {/* ── Suspend All ──────────────────────────────────── */}
      <div className="settings-row">
        <button className="suspend-all-btn" onClick={handleSuspendAll}>
          Suspend All Idle Tabs
        </button>
      </div>
    </div>
  )
}
