import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import WorkflowText from './components/WorkflowText'
import WorkflowImage from './components/WorkflowImage'

const TABS = {
  creative: 'creative',
  style: 'style',
}

function App() {
  const [activeTab, setActiveTab] = useState(TABS.creative)
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState(
    'Ready to enhance prompts or analyze a reference image.',
  )

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />

      <Navbar
        activeTab={activeTab}
        isLoading={isLoading}
        onChangeTab={setActiveTab}
        tabs={TABS}
      />

      <main className="workspace">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Pear Media AI Lab</p>
            <h1>Turn rough ideas into polished visual directions.</h1>
            <p className="hero-copy">
              Creative Studio upgrades short text prompts with a human approval
              step. Style Lab analyzes a reference image and spins up fresh
              variations from its visual DNA.
            </p>
          </div>

          <div className="status-card">
            <div className={`status-pill ${isLoading ? 'busy' : 'ready'}`}>
              <span className="status-dot" />
              {isLoading ? 'Processing request' : 'System ready'}
            </div>
            <p>{statusMessage}</p>
            <div className="progress-rail" aria-hidden="true">
              <div
                className={`progress-fill ${isLoading ? 'is-loading' : ''}`}
              />
            </div>
          </div>
        </section>

        <section className="panel-stack">
          {activeTab === TABS.creative ? (
            <WorkflowText
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setStatusMessage={setStatusMessage}
            />
          ) : (
            <WorkflowImage
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setStatusMessage={setStatusMessage}
            />
          )}
        </section>
      </main>
    </div>
  )
}

export default App
