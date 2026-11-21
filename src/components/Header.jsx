import { Menu, Plus, Calendar } from 'lucide-react'

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
 * Top dashboard header featuring title, mobile menu trigger,
 * date indicator, and primary "New Task" action button.
 * 
 * @param {Object} props
 * @param {Function} props.onOpenCreateTask - Callback invoked when "New Task" button is clicked.
 * @param {Function} props.onToggleSidebar - Callback invoked to open the mobile sidebar drawer.
 */
export function Header({ 
  onOpenCreateTask = () => {}, 
  onToggleSidebar = () => {} 
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
          <h1 className="header-title">Task Dashboard</h1>
          <p className="header-subtitle">
            Manage your workload, monitor priorities, and stay focused.
          </p>
        </div>
      </div>

      <div className="header-right">
        {/* Date Display */}
        <div className="header-date" aria-label={`Current date: ${todayFormatted}`}>
          <Calendar size={16} className="date-icon" />
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
