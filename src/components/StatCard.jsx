/**
 * StatCard Component
 * 
 * Reusable dynamic metric display card.
 * Calculates and visualizes task performance metrics dynamically without redundant state.
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
        <div className={`stat-icon-wrapper stat-icon-${variant}`} aria-hidden="true">
          {Icon && <Icon size={20} />}
        </div>
        <span className="stat-label">{label}</span>
      </div>

      <div className="stat-card-bottom">
        <div className="stat-value">{value}</div>
        
        {isRate && (
          <div className="stat-progress-bar-track" aria-hidden="true">
            <div 
              className="stat-progress-bar-fill" 
              style={{ width: `${Math.min(100, Math.max(0, numericRate))}%` }} 
            />
          </div>
        )}

        {subtext && <p className="stat-subtext">{subtext}</p>}
      </div>
    </article>
  )
}
