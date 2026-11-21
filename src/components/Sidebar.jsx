import { 
  LayoutDashboard, 
  CheckSquare, 
  BookOpen, 
  BarChart3, 
  Settings,
  Sparkles,
  X
} from 'lucide-react'

/**
 * Sidebar Component
 * 
 * Provides primary dashboard navigation.
 * Semantic HTML <aside> and <nav> with proper accessible labels.
 * 
 * @param {Object} props
 * @param {string} props.activeNav - Identifier for the current active navigation item.
 * @param {Function} props.onNavSelect - Handler to update active nav state.
 * @param {boolean} props.isOpen - Mobile drawer open state.
 * @param {Function} props.onClose - Mobile drawer close handler.
 */
export function Sidebar({ 
  activeNav = 'dashboard', 
  onNavSelect = () => {},
  isOpen = false,
  onClose = () => {}
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'All Tasks', icon: CheckSquare },
    { id: 'focus-notes', label: 'Focus Notes', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={onClose} 
          aria-hidden="true" 
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`} aria-label="Main Navigation">
        {/* Sidebar Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo">
            <Sparkles size={20} className="brand-icon" />
          </div>
          <div className="brand-info">
            <span className="brand-name">FocusBoard</span>
            <span className="brand-tag">Workspace</span>
          </div>

          {/* Close button for mobile screens */}
          <button 
            type="button" 
            className="sidebar-mobile-close"
            onClick={onClose}
            aria-label="Close navigation sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="sidebar-nav">
          <span className="nav-group-title">Menu</span>
          <ul className="nav-list">
            {navItems.map((item) => {
              const IconComponent = item.icon
              const isActive = activeNav === item.id

              return (
                <li key={item.id} className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                    onClick={() => {
                      onNavSelect(item.id)
                      onClose()
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <IconComponent size={18} className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                    {item.id === 'tasks' && (
                      <span className="nav-badge" aria-label="Active module">Live</span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Sidebar Footer User Profile */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar" aria-hidden="true">JD</div>
            <div className="user-details">
              <span className="user-name">Frontend Dev</span>
              <span className="user-role">Candidate Assessment</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
