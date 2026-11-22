import { 
  Calendar, 
  Check, 
  Pencil, 
  Trash2
} from 'lucide-react'

// Pure date helper evaluated outside render
const getTodayIsoString = () => new Date().toISOString().split('T')[0]

/**
 * TaskCard Component (Streamlined Bento Task Row)
 * 
 * Renders an individual task with:
 * - One-click completion checkbox button
 * - Strikethrough on completed title
 * - Category badge, priority dot indicator, and due date
 * - Interactive status cycle pill
 * - Edit and delete actions
 * 
 * @param {Object} props
 * @param {Object} props.task - Task data model object.
 * @param {Function} props.onStatusChange - Handler to update task status.
 * @param {Function} props.onEdit - Handler to trigger editing mode.
 * @param {Function} props.onDelete - Handler to trigger delete confirmation.
 */
export function TaskCard({ 
  task, 
  onStatusChange = () => {}, 
  onEdit = () => {}, 
  onDelete = () => {} 
}) {
  const todayStr = getTodayIsoString()
  const isOverdue = Boolean(task.dueDate && task.dueDate < todayStr && task.status !== 'completed')
  const isCompleted = task.status === 'completed'

  const handleToggleCheck = () => {
    onStatusChange(task.id, isCompleted ? 'todo' : 'completed')
  }

  const handleCycleStatus = () => {
    const cycleMap = {
      'todo': 'in-progress',
      'in-progress': 'completed',
      'completed': 'todo'
    }
    const nextStatus = cycleMap[task.status] || 'todo'
    onStatusChange(task.id, nextStatus)
  }

  // Format display date (e.g. "Nov 25, 2026")
  const formatDueDate = (dateStr) => {
    if (!dateStr) return 'No due date'
    try {
      const [year, month, day] = dateStr.split('-')
      const date = new Date(year, month - 1, day)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  // Priority metadata helper
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
        return 'High'
      case 'medium':
        return 'Medium'
      default:
        return 'Low'
    }
  }

  // Status display label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'todo':
        return 'To Do'
      case 'in-progress':
        return 'In Progress'
      case 'completed':
        return 'Completed'
      default:
        return status
    }
  }

  return (
    <article 
      className={`task-row ${isCompleted ? 'task-row-completed' : ''} ${isOverdue ? 'task-row-overdue' : ''}`}
      aria-labelledby={`task-title-${task.id}`}
    >
      {/* Left Area: Checkbox + Title & Metadata */}
      <div className="task-row-main">
        {/* Quick Complete Toggle Button */}
        <button
          type="button"
          onClick={handleToggleCheck}
          className={`task-row-check ${isCompleted ? 'check-completed' : ''}`}
          aria-label={isCompleted ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as complete`}
        >
          {isCompleted && <Check size={13} className="check-icon" />}
        </button>

        <div className="task-row-details">
          <p 
            id={`task-title-${task.id}`} 
            className={`task-row-title ${isCompleted ? 'title-struck' : ''}`}
          >
            {task.title}
          </p>

          <div className="task-row-meta">
            {task.category && (
              <span className="task-row-category">{task.category}</span>
            )}

            <span className="task-row-priority">
              <span className={`priority-dot dot-${task.priority}`} aria-hidden="true" />
              <span>{getPriorityLabel(task.priority)}</span>
            </span>

            {task.dueDate && (
              <span className={`task-row-due ${isOverdue ? 'due-overdue' : ''}`}>
                <Calendar size={12} className="due-icon" aria-hidden="true" />
                <span>{formatDueDate(task.dueDate)}</span>
                {isOverdue && <span className="overdue-tag">Overdue</span>}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Area: Interactive Status Pill + Action Controls */}
      <div className="task-row-actions">
        <button
          type="button"
          onClick={handleCycleStatus}
          className={`task-status-pill status-pill-${task.status}`}
          title="Click to cycle status: To Do → In Progress → Completed"
          aria-label={`Current status: ${getStatusLabel(task.status)}. Click to cycle status.`}
        >
          {getStatusLabel(task.status)}
        </button>

        <div className="task-btn-group">
          <button
            type="button"
            className="row-action-btn btn-edit"
            onClick={() => onEdit(task)}
            aria-label={`Edit task: ${task.title}`}
            title="Edit task"
          >
            <Pencil size={14} />
          </button>

          <button
            type="button"
            className="row-action-btn btn-delete"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete task: ${task.title}`}
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </article>
  )
}
