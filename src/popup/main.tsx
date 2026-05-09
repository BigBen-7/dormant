import './index.css'
import { Component, StrictMode } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import Popup from './Popup'

class ErrorBoundary extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false }

  static getDerivedStateFromError() {
    return { crashed: true }
  }

  componentDidCatch(err: Error, info: ErrorInfo) {
    console.error('[dormant] popup crashed:', err, info)
  }

  render() {
    if (this.state.crashed) {
      return (
        <div style={{ padding: '24px 16px', color: '#f0f0f0', fontSize: '13px' }}>
          Something went wrong — reload the extension
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Popup />
    </ErrorBoundary>
  </StrictMode>
)
