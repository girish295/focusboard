import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Pencil, 
  Trash2,
  Tag,
  AlertTriangle
} from 'lucide-react'

// Pure date helper evaluated outside render
const getTodayIsoString = () => new Date().toISOString().split('T')[0]

/**
 * TaskCard Component
 * 
 * Renders an individual task with:
 * - Category & priority badge (text + color for WCAG AA compliance)
 * - Title (with word-wrap protection against overflow)
 * - Description
 * - Due date with overdue detection
 * - Accessible inline status switcher
 * - Edit and Delete action controls
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

  // Format display date (e.g. "Nov 25, 2026")
  const formatDueDate = (dateStr) => {
    if (!dateStr) return 'No due date'
    try {
      const [year, month, day] = dateStr.split('-')
      const date = new Date(year, month - 1, day)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  // Priority metadata helper
  const getPriorityMeta = (priority) => {
    switch (priority) {
      case 'high':
        return { label: 'High Priority', className: 'priority-high', icon: AlertTriangle }
      case 'medium':
        return { label: 'Medium Priority', className: 'priority-medium', icon: Clock }
      default:
        return { label: 'Low Priority', className: 'priority-low', icon: CheckCircle2 }
    }
  }

  const priorityMeta = getPriorityMeta(task.priority)
  const PriorityIcon = priorityMeta.icon

  return (
    <article 
      className={`task-card ${task.status === 'completed' ? 'task-card-completed' : ''} ${isOverdue ? 'task-card-overdue' : ''}`}
      aria-labelledby={`task-title-${task.id}`}
    >
      {/* Top Meta Bar: Category, Priority, and Actions */}
      <div className="task-card-header">
        <div className="task-badges-group">
          {task.category && (
            <span className="task-badge badge-category">
              <Tag size={12} className="badge-icon" />
              <span>{task.category}</span>
            </span>
          )}

          <span className={`task-badge ${priorityMeta.className}`}>
            <PriorityIcon size={12} className="badge-icon" />
            <span>{priorityMeta.label}</span>
          </span>
        </div>

        {/* Card Actions (Edit, Delete) */}
        <div className="task-card-actions">
          <button
            type="button"
            className="card-action-btn btn-edit"
            onClick={() => onEdit(task)}
            aria-label={`Edit task: ${task.title}`}
            title="Edit task"
          >
            <Pencil size={15} />
          </button>

          <button
            type="button"
            className="card-action-btn btn-delete"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete task: ${task.title}`}
            title="Delete task"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Title & Description with Overflow Protection */}
      <div className="task-card-body">
        <h3 id={`task-title-${task.id}`} className="task-title">
          {task.title}
        </h3>
        {task.description && (
          <p className="task-description">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer: Due Date & Status Control */}
      <div className="task-card-footer">
        {/* Due Date Indicator */}
        <div className={`task-due-date ${isOverdue ? 'due-overdue' : ''}`}>
          {isOverdue ? (
            <AlertCircle size={14} className="due-icon" />
          ) : (
            <Calendar size={14} className="due-icon" />
          )}
          <time dateTime={task.dueDate}>
            {formatDueDate(task.dueDate)}
            {isOverdue && <span className="overdue-tag">Overdue</span>}
          </time>
        </div>

        {/* Interactive Quick Status Switcher */}
        <div className="task-status-control">
          <label htmlFor={`status-select-${task.id}`} className="sr-only">
            Change status for {task.title}
          </label>
          <div className={`status-select-wrapper status-${task.status}`}>
            <select
              id={`status-select-${task.id}`}
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value)}
              className="status-select"
              aria-label={`Status for ${task.title}`}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <span className="status-indicator-dot" aria-hidden="true" />
          </div>
        </div>
      </div>
    </article>
  )
}
