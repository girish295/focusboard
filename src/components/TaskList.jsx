import { TaskCard } from './TaskCard'
import { EmptyState } from './EmptyState'
import { ClipboardList, SearchX, RotateCcw } from 'lucide-react'

/**
 * TaskList Component
 * 
 * Renders the collection of tasks using reusable TaskCard components.
 * Intelligently delegates to EmptyState when 0 tasks are present:
 * 1. An entirely empty board (no tasks exist)
 * 2. An empty search/filter result (tasks exist, but none match active criteria)
 * 
 * @param {Object} props
 * @param {Array} props.tasks - Array of tasks to render (already filtered).
 * @param {boolean} props.isFilterActive - True if search or filters are currently applied.
 * @param {Function} props.onClearFilters - Handler to reset all filters.
 * @param {Function} props.onStatusChange - Handler to update task status.
 * @param {Function} props.onEdit - Handler to trigger task editing.
 * @param {Function} props.onDelete - Handler to trigger task deletion.
 */
export function TaskList({ 
  tasks = [], 
  isFilterActive = false,
  onClearFilters = () => {},
  onStatusChange = () => {}, 
  onEdit = () => {}, 
  onDelete = () => {} 
}) {
  // Empty State 1: Active filter returned 0 matches
  if (tasks.length === 0 && isFilterActive) {
    return (
      <EmptyState
        icon={SearchX}
        variant="search"
        title="No matching tasks found"
        description="We couldn't find any tasks matching your search query or active filter selections."
        actionLabel="Clear All Filters"
        actionIcon={RotateCcw}
        onAction={onClearFilters}
      />
    )
  }

  // Empty State 2: Board has no tasks at all
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        variant="default"
        title="No tasks available"
        description="Your task board is currently empty. Click 'Create Task' or 'Reset to Sample Tasks' to get started."
      />
    )
  }

  // Populated Task Grid
  return (
    <section className="task-list-section" aria-label={`Task list containing ${tasks.length} tasks`}>
      <div className="task-grid">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  )
}
