import { useState, useEffect, useRef } from 'react'
import { X, AlertCircle, Check } from 'lucide-react'

/**
 * Pure helper to obtain today's date formatted as YYYY-MM-DD
 */
function getTodayDateString() {
  return new Date().toISOString().split('T')[0]
}

/**
 * TaskForm Component
 * 
 * Accessible modal form supporting both Create and Edit modes for tasks.
 * State is initialized on mount using a key-based resetting pattern from parent.
 * 
 * Strict Validation Rules:
 * - Title is required, trimmed, max 100 characters.
 * - Description max 500 characters.
 * - Due date is required.
 * - Auto-focuses the first invalid field upon failed submission.
 * - Associates inline errors with inputs via `aria-describedby`.
 * - Closes on Escape key or backdrop click.
 * - Preserves existing task ID and creation timestamp in edit mode.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility.
 * @param {Function} props.onClose - Modal close handler.
 * @param {Function} props.onSubmit - Submission callback receiving validated task data.
 * @param {Object|null} [props.taskToEdit=null] - Task object if in edit mode, or null for create mode.
 */
export function TaskForm({ 
  isOpen = false, 
  onClose = () => {}, 
  onSubmit = () => {}, 
  taskToEdit = null 
}) {
  const isEditMode = Boolean(taskToEdit)

  // Initialize form state directly from props on mount (remounted via key)
  const [formData, setFormData] = useState(() => ({
    title: taskToEdit?.title || '',
    description: taskToEdit?.description || '',
    category: taskToEdit?.category || 'Frontend',
    status: taskToEdit?.status || 'todo',
    priority: taskToEdit?.priority || 'medium',
    dueDate: taskToEdit?.dueDate || getTodayDateString()
  }))

  const [errors, setErrors] = useState({})

  // Element refs for focus management & accessibility
  const titleInputRef = useRef(null)
  const dueDateInputRef = useRef(null)
  const descriptionInputRef = useRef(null)
  const modalRef = useRef(null)

  // Auto-focus title input upon mounting
  useEffect(() => {
    const timer = setTimeout(() => {
      titleInputRef.current?.focus()
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  // Keyboard navigation: Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  // ---------------------------------------------------------------------------
  // Validation Logic
  // ---------------------------------------------------------------------------
  const validateForm = () => {
    const newErrors = {}
    const trimmedTitle = formData.title.trim()

    // Title validation
    if (!trimmedTitle) {
      newErrors.title = 'Title is required.'
    } else if (trimmedTitle.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters.'
    }

    // Due Date validation
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required.'
    }

    // Description validation
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters.'
    }

    setErrors(newErrors)
    return newErrors
  }

  // ---------------------------------------------------------------------------
  // Submission Handler
  // ---------------------------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault()

    const validationErrors = validateForm()

    // Focus the first invalid input
    if (validationErrors.title) {
      titleInputRef.current?.focus()
      return
    }
    if (validationErrors.dueDate) {
      dueDateInputRef.current?.focus()
      return
    }
    if (validationErrors.description) {
      descriptionInputRef.current?.focus()
      return
    }

    // Clean payload
    const payload = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim()
    }

    // If editing, preserve the existing id and createdAt timestamp
    if (isEditMode && taskToEdit) {
      payload.id = taskToEdit.id
      payload.createdAt = taskToEdit.createdAt
    }

    onSubmit(payload)
    onClose()
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error as user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="presentation"
    >
      <div 
        className="modal-dialog" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="task-form-title"
        ref={modalRef}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2 id="task-form-title" className="modal-title">
              {isEditMode ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="modal-subtitle">
              {isEditMode 
                ? 'Update task details, deadlines, and priorities.' 
                : 'Fill in the information below to add a new task to your board.'}
            </p>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close task form"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="task-form-body" noValidate>
          {/* Title Field */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="task-form-title-input" className="form-label">
                Task Title <span className="label-required">*</span>
              </label>
              <span className="char-counter" aria-live="polite">
                {formData.title.length}/100
              </span>
            </div>

            <input
              id="task-form-title-input"
              ref={titleInputRef}
              type="text"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g. Design user onboarding flow"
              value={formData.title}
              maxLength={100}
              onChange={(e) => handleInputChange('title', e.target.value)}
              aria-required="true"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'task-title-error' : undefined}
            />
            {errors.title && (
              <p id="task-title-error" className="form-error-msg" role="alert">
                <AlertCircle size={14} />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="task-form-desc-input" className="form-label">
                Description
              </label>
              <span className="char-counter" aria-live="polite">
                {formData.description.length}/500
              </span>
            </div>

            <textarea
              id="task-form-desc-input"
              ref={descriptionInputRef}
              className={`form-textarea ${errors.description ? 'input-error' : ''}`}
              placeholder="Provide context, acceptance criteria, or key dependencies..."
              rows={3}
              maxLength={500}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? 'task-desc-error' : undefined}
            />
            {errors.description && (
              <p id="task-desc-error" className="form-error-msg" role="alert">
                <AlertCircle size={14} />
                <span>{errors.description}</span>
              </p>
            )}
          </div>

          {/* Two Column Row: Category & Due Date */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-form-category" className="form-label">
                Category
              </label>
              <select
                id="task-form-category"
                className="form-select"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="Frontend">Frontend</option>
                <option value="Design">Design</option>
                <option value="Backend">Backend</option>
                <option value="Testing">Testing</option>
                <option value="Accessibility">Accessibility</option>
                <option value="Documentation">Documentation</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-form-due-date" className="form-label">
                Due Date <span className="label-required">*</span>
              </label>
              <input
                id="task-form-due-date"
                ref={dueDateInputRef}
                type="date"
                className={`form-input ${errors.dueDate ? 'input-error' : ''}`}
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                aria-required="true"
                aria-invalid={Boolean(errors.dueDate)}
                aria-describedby={errors.dueDate ? 'task-duedate-error' : undefined}
              />
              {errors.dueDate && (
                <p id="task-duedate-error" className="form-error-msg" role="alert">
                  <AlertCircle size={14} />
                  <span>{errors.dueDate}</span>
                </p>
              )}
            </div>
          </div>

          {/* Two Column Row: Status & Priority */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-form-status" className="form-label">
                Status
              </label>
              <select
                id="task-form-status"
                className="form-select"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-form-priority" className="form-label">
                Priority
              </label>
              <select
                id="task-form-priority"
                className="form-select"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Check size={16} />
              <span>{isEditMode ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
