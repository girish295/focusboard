import { Search, X } from 'lucide-react'

/**
 * SearchBar Component
 * 
 * Provides accessible, real-time title search with:
 * - Controlled input handling
 * - Dedicated clear search button
 * - Keyboard support (Escape clears search)
 * - Accessible ARIA labels and association
 * 
 * @param {Object} props
 * @param {string} props.value - Current search term.
 * @param {Function} props.onChange - Handler called with new search string.
 * @param {Function} props.onClear - Handler to reset search query.
 */
export function SearchBar({ 
  value = '', 
  onChange = () => {}, 
  onClear = () => {} 
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && value) {
      onClear()
    }
  }

  return (
    <div className="search-bar-wrapper">
      <label htmlFor="task-search-input" className="sr-only">
        Search tasks by title
      </label>
      <div className="search-input-container">
        <Search size={18} className="search-icon" aria-hidden="true" />
        <input
          id="task-search-input"
          type="search"
          className="search-input"
          placeholder="Search tasks by title..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        {value.length > 0 && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={onClear}
            aria-label="Clear search input"
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
