import { Aperture, Sparkles } from 'lucide-react'

function Navbar({ activeTab, isLoading, onChangeTab, tabs }) {
  return (
    <header className="navbar">
      <div className="brand-lockup">
        <div className="brand-mark">
          <Aperture size={20} />
        </div>
        <div>
          <p className="brand-name">Pear Media</p>
          <p className="brand-subtitle">Responsive AI prototype</p>
        </div>
      </div>

      <nav className="tab-switcher" aria-label="Workflow selection">
        <button
          type="button"
          className={activeTab === tabs.creative ? 'active' : ''}
          onClick={() => onChangeTab(tabs.creative)}
        >
          Creative Studio
        </button>
        <button
          type="button"
          className={activeTab === tabs.style ? 'active' : ''}
          onClick={() => onChangeTab(tabs.style)}
        >
          Style Lab
        </button>
      </nav>

      <div className="nav-indicator">
        <Sparkles size={16} />
        <span>{isLoading ? 'Live run in progress' : 'Waiting for input'}</span>
      </div>
    </header>
  )
}

export default Navbar
