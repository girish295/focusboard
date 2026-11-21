import { ClipboardList } from 'lucide-react'

/**
 * EmptyState Component
 * 
 * Reusable empty state display for empty boards, zero search results, or empty filters.
 * 
 * @param {Object} props
 * @param {React.ElementType} [props.icon=ClipboardList] - Lucide icon component.
 * @param {string} props.title - Primary heading.
 * @param {string} props.description - Explanatory helper message.
 * @param {string} [props.actionLabel] - Optional button label.
 * @param {Function} [props.onAction] - Optional button click callback.
 * @param {React.ElementType} [props.actionIcon] - Optional button icon.
 * @param {string} [props.variant='default'] - Visual style: 'default' | 'search' | 'info'.
 */
export function EmptyState({
  icon: Icon = ClipboardList,
  title = 'No tasks found',
  description = 'There are no items to display at this time.',
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
  variant = 'default'
}) {
  return (
    <section className="task-list-empty" aria-label={title}>
      <div className="empty-content">
        <div className={`empty-icon-wrapper empty-icon-${variant}`} aria-hidden="true">
          <Icon size={36} />
        </div>
        <h3 className="empty-title">{title}</h3>
        <p className="empty-description">{description}</p>

        {actionLabel && onAction && (
          <button
            type="button"
            className="btn btn-secondary mt-3"
            onClick={onAction}
          >
            {ActionIcon && <ActionIcon size={15} />}
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </section>
  )
}
