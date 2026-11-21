import { useEffect } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

/**
 * Toast Component
 * 
 * Accessible notification banner announced via aria-live regions.
 * Automatically dismisses after a timeout and provides explicit manual dismiss controls.
 * 
 * @param {Object} props
 * @param {Array} props.toasts - Array of active toast notifications [{ id, message, type: 'success'|'error'|'info' }]
 * @param {Function} props.onDismiss - Callback to remove a specific toast by id.
 */
export function Toast({ toasts = [], onDismiss = () => {} }) {
  if (toasts.length === 0) return null

  return (
    <aside 
      className="toast-container" 
      aria-label="System notifications"
      aria-live="polite"
      role="region"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </aside>
  )
}

/**
 * Individual Toast Item with internal auto-dismiss timer.
 */
function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id)
    }, 4000)

    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  const getIcon = () => {
    switch (toast.type) {
      case 'error':
        return <AlertCircle size={18} className="toast-icon icon-error" />
      case 'info':
        return <Info size={18} className="toast-icon icon-info" />
      default:
        return <CheckCircle2 size={18} className="toast-icon icon-success" />
    }
  }

  return (
    <div 
      className={`toast-item toast-${toast.type || 'success'}`} 
      role="status"
    >
      <div className="toast-content">
        {getIcon()}
        <span className="toast-message">{toast.message}</span>
      </div>

      <button
        type="button"
        className="toast-close-btn"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        <X size={15} />
      </button>
    </div>
  )
}
