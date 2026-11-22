import { TrendingUp } from 'lucide-react'

/**
 * StatCard Component
 * 
 * Reusable dynamic metric display card.
 * Calculates and visualizes task performance metrics dynamically without redundant state.
 * Includes SVG circular completion ring for the 'rate' variant.
 * 
 * @param {Object} props
 * @param {React.ElementType} props.icon - Lucide icon component.
 * @param {string} props.label - Descriptive label of the statistic.
 * @param {string|number} props.value - Computed metric value (e.g. 6 or '50%').
 * @param {string} [props.variant='total'] - Color variant: 'total' | 'todo' | 'progress' | 'completed' | 'rate'.
 * @param {string} [props.subtext] - Contextual subtext or micro-copy.
 */
export function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  variant = 'total',
  subtext
}) {
  const isRate = variant === 'rate'
  const numericRate = typeof value === 'string' && value.includes('%') 
    ? parseInt(value, 10) || 0 
    : Number(value) || 0

  return (
    <article className={`stat-card stat-card-${variant}`}>
      <div className={`stat-card-accent stat-accent-${variant}`} aria-hidden="true" />
      
      <div className="stat-card-top">
        <span className="stat-label">{label}</span>
        <div className={`stat-icon-wrapper stat-icon-${variant}`} aria-hidden="true">
          {Icon && <Icon size={16} />}
        </div>
      </div>

      <div className="stat-card-bottom">
        {isRate ? (
          <div className="stat-rate-split">
            <div>
              <div className="stat-value">{value}</div>
              {subtext && <p className="stat-subtext">{subtext}</p>}
            </div>

            <div className="stat-ring-container" aria-hidden="true">
              <svg className="stat-ring-svg" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="22" className="stat-ring-track" />
                <circle 
                  cx="28" 
                  cy="28" 
                  r="22" 
                  className="stat-ring-meter"
                  strokeDasharray="138.23"
                  strokeDashoffset={(138.23 - (numericRate / 100) * 138.23).toFixed(2)}
                />
              </svg>
              <TrendingUp size={14} className="stat-ring-arrow" />
            </div>
          </div>
        ) : (
          <div className="stat-value-row">
            <div className="stat-value">{value}</div>
            {subtext && <p className="stat-subtext">{subtext}</p>}
          </div>
        )}
      </div>
    </article>
  )
}
