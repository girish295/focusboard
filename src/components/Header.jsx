import { Menu, Plus, Calendar, Palette } from 'lucide-react'

// Pure date formatter evaluated outside render
const getTodayFormatted = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

/**
 * Header Component
 * 
 * Top dashboard header featuring title, live workspace pulse indicator,
 * interactive 1-click theme switcher, mobile menu trigger, date indicator,
 * and primary "New Task" action button.
 * 
 * @param {Object} props
 * @param {Function} props.onOpenCreateTask - Callback invoked when "New Task" button is clicked.
 * @param {Function} props.onToggleSidebar - Callback invoked to open the mobile sidebar drawer.
 * @param {string} props.currentTheme - Active color theme identifier.
 * @param {Function} props.onThemeChange - Callback when theme changes.
 */
export function Header({ 
  onOpenCreateTask = () => {}, 
  onToggleSidebar = () => {},
  currentTheme = 'crisp',
  onThemeChange = () => {}
}) {
  const todayFormatted = getTodayFormatted()

  return (
    <header className="dashboard-header">
      <div className="header-left">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Open navigation sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="header-titles">
          <div className="header-title-badge-row">
            <h1 className="header-title">Task Dashboard</h1>
            <span className="live-status-pill" aria-label="System status: Workspace Live">
              <span className="live-dot" aria-hidden="true" />
              <span>Workspace Live</span>
            </span>
          </div>
          <p className="header-subtitle">
            Manage your workload, monitor priorities, and stay focused.
          </p>
        </div>
      </div>

      <div className="header-right">
        {/* Interactive Theme Palette Selector */}
        <div className="theme-switcher-wrapper">
          <label htmlFor="theme-selector-dropdown" className="sr-only">
            Select Dashboard Theme
          </label>
          <Palette size={15} className="theme-icon" aria-hidden="true" />
          <select
            id="theme-selector-dropdown"
            value={currentTheme}
            onChange={(e) => onThemeChange(e.target.value)}
            className="theme-dropdown"
            aria-label="Select visual color theme"
          >
            <option value="crisp">✨ Crisp Modern (Light)</option>
            <option value="warm">🍂 Warm Notion (Cream)</option>
            <option value="emerald">🌿 Fresh Emerald (Mint)</option>
            <option value="midnight">🌙 Midnight Dark (Linear)</option>
          </select>
        </div>

        {/* Date Display */}
        <div className="header-date" aria-label={`Current date: ${todayFormatted}`}>
          <Calendar size={15} className="date-icon" />
          <span>{todayFormatted}</span>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          className="btn-create-task"
          onClick={onOpenCreateTask}
          aria-label="Create a new task"
        >
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  )
}
