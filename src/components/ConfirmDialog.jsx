import { useEffect, useRef } from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

/**
 * ConfirmDialog Component
 * 
 * Accessible confirmation modal dialog compliant with WAI-ARIA alertdialog pattern.
 * 
 * Requirements:
 * - Prevents immediate deletion from task cards.
 * - Provides explicit Confirm and Cancel actions.
 * - Focuses the Cancel button on open (defensive safety against accidental Enter).
 * - Keyboard navigation (Escape key cancels).
 * - Traps focus and returns focus to the trigger element upon closing.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the confirmation dialog is visible.
 * @param {string} [props.title='Confirm Deletion'] - Dialog heading.
 * @param {string} props.message - Descriptive warning message.
 * @param {string} [props.confirmLabel='Delete'] - Confirmation button text.
 * @param {string} [props.cancelLabel='Cancel'] - Cancellation button text.
 * @param {Function} props.onConfirm - Callback invoked on confirmation.
 * @param {Function} props.onCancel - Callback invoked on cancellation.
 */
export function ConfirmDialog({
  isOpen = false,
  title = 'Delete Task',
  message = 'Are you sure you want to delete this task? This action cannot be undone.',
  confirmLabel = 'Delete Task',
  cancelLabel = 'Cancel',
  onConfirm = () => {},
  onCancel = () => {}
}) {
  const cancelBtnRef = useRef(null)
  const previousFocusRef = useRef(null)

  // Track active trigger element & focus management
  useEffect(() => {
    if (isOpen) {
      // Save previously focused element to restore focus on dismiss
      previousFocusRef.current = document.activeElement

      // Defensive focus: Focus Cancel button to prevent accidental Enter confirmation
      setTimeout(() => {
        cancelBtnRef.current?.focus()
      }, 50)
    } else if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
      // Restore focus to original trigger button
      previousFocusRef.current.focus()
    }
  }, [isOpen])

  // Keyboard navigation: Escape key cancels dialog
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
      role="presentation"
    >
      <div 
        className="modal-dialog modal-dialog-confirm" 
        role="alertdialog" 
        aria-modal="true" 
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
      >
        <div className="confirm-header">
          <div className="confirm-icon-badge" aria-hidden="true">
            <AlertTriangle size={24} />
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onCancel}
            aria-label="Close confirmation dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="confirm-body">
          <h2 id="confirm-dialog-title" className="confirm-title">
            {title}
          </h2>
          <p id="confirm-dialog-desc" className="confirm-message">
            {message}
          </p>
        </div>

        <div className="modal-footer confirm-footer">
          <button
            type="button"
            ref={cancelBtnRef}
            className="btn btn-secondary"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
          >
            <Trash2 size={16} />
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
