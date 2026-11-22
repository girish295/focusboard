import { useState, useEffect } from 'react'
import { Timer, RotateCcw, Play, Pause } from 'lucide-react'

/**
 * DeepFocusTimer Component
 * 
 * Bento companion widget providing an interactive Pomodoro focus session (25:00)
 * paired with a live workload completion progress bar.
 * 
 * @param {Object} props
 * @param {number} props.completedCount - Number of completed tasks.
 * @param {number} props.totalTasks - Total task count.
 * @param {Function} [props.onComplete] - Callback fired when focus block ends.
 */
export function DeepFocusTimer({ 
  completedCount = 0, 
  totalTasks = 0, 
  onComplete = () => {} 
}) {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval = null
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            setIsRunning(false)
            onComplete()
            return 25 * 60
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, onComplete])

  const toggleRunning = () => {
    setIsRunning((prev) => !prev)
  }

  const handleReset = () => {
    setIsRunning(false)
    setSecondsLeft(25 * 60)
  }

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const secs = String(secondsLeft % 60).padStart(2, '0')
  const completionRatio = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  return (
    <section className="bento-focus-card" aria-label="Deep Focus Session">
      <div className="focus-card-header">
        <div className="focus-card-title-group">
          <div className="focus-icon-wrapper" aria-hidden="true">
            <Timer size={16} />
          </div>
          <h3 className="focus-title">Deep Focus Session</h3>
        </div>
        <span className="focus-badge">Pomodoro</span>
      </div>

      <div className="focus-timer-box">
        <div>
          <div className="focus-timer-digits" aria-label={`Time remaining: ${mins} minutes ${secs} seconds`}>
            {mins}:{secs}
          </div>
          <span className="focus-timer-sub">
            {isRunning ? 'Deep focus in progress...' : 'Next break in 25 mins'}
          </span>
        </div>

        <div className="focus-controls">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={toggleRunning}
            aria-label={isRunning ? 'Pause focus timer' : 'Start focus timer'}
          >
            {isRunning ? <Pause size={14} /> : <Play size={14} />}
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-icon-sm"
            onClick={handleReset}
            aria-label="Reset focus timer"
            title="Reset Timer"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      <div className="focus-workload-group">
        <div className="focus-workload-labels">
          <span className="workload-label">Workload Progress</span>
          <span className="workload-count">{completedCount} / {totalTasks} Done</span>
        </div>

        <div className="focus-progress-track" aria-hidden="true">
          <div 
            className="focus-progress-fill" 
            style={{ width: `${completionRatio}%` }} 
          />
        </div>

        <p className="focus-hint">Click any task status pill to update live</p>
      </div>
    </section>
  )
}
