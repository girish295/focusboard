import { Filter, RotateCcw } from 'lucide-react'

/**
 * FilterTabs Component
 * 
 * Provides combined status tabs and priority filtering controls:
 * - Status filter tabs: 'all', 'todo', 'in-progress', 'completed' with task counts
 * - Priority selector: 'all', 'low', 'medium', 'high'
 * - "Clear Filters" action when any filter criteria is active
 * - Accessible tablist semantics (role="tablist", aria-selected)
 * 
 * @param {Object} props
 * @param {string} props.statusFilter - Active status filter.
 * @param {Function} props.onStatusChange - Callback when a status tab is selected.
 * @param {string} props.priorityFilter - Active priority filter.
 * @param {Function} props.onPriorityChange - Callback when priority selector changes.
 * @param {Function} props.onClearFilters - Callback to reset all filters.
 * @param {boolean} props.isFilterActive - True if any filter or search query is applied.
 * @param {Object} [props.statusCounts] - Task count breakdown per status.
 */
export function FilterTabs({
  statusFilter = 'all',
  onStatusChange = () => {},
  priorityFilter = 'all',
  onPriorityChange = () => {},
  onClearFilters = () => {},
  isFilterActive = false,
  statusCounts = { all: 0, todo: 0, 'in-progress': 0, completed: 0 }
}) {
  const statusOptions = [
    { id: 'all', label: 'All Tasks', count: statusCounts.all },
    { id: 'todo', label: 'To Do', count: statusCounts.todo },
    { id: 'in-progress', label: 'In Progress', count: statusCounts['in-progress'] },
    { id: 'completed', label: 'Completed', count: statusCounts.completed },
  ]

  return (
    <div className="filter-controls-bar">
      {/* Status Filter Tabs (ARIA Tablist) */}
      <div className="filter-tabs-group" role="tablist" aria-label="Filter tasks by status">
        {statusOptions.map((tab) => {
          const isSelected = statusFilter === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isSelected}
              className={`filter-tab ${isSelected ? 'filter-tab-active' : ''}`}
              onClick={() => onStatusChange(tab.id)}
            >
              <span>{tab.label}</span>
              <span className={`filter-tab-badge ${isSelected ? 'badge-active' : ''}`}>
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Priority Selector & Clear Action */}
      <div className="filter-secondary-group">
        <div className="priority-select-container">
          <label htmlFor="priority-filter-select" className="priority-select-label">
            <Filter size={14} className="filter-icon" aria-hidden="true" />
            <span>Priority:</span>
          </label>
          <select
            id="priority-filter-select"
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="priority-dropdown"
            aria-label="Filter tasks by priority"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        {/* Clear Filters Action */}
        {isFilterActive && (
          <button
            type="button"
            className="btn-clear-filters"
            onClick={onClearFilters}
            aria-label="Reset all search and filter criteria"
            title="Reset filters"
          >
            <RotateCcw size={14} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  )
}
