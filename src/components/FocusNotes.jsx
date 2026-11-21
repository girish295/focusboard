import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Lightbulb, Zap, Clock, ShieldCheck } from 'lucide-react'

/**
 * FocusNotes Carousel Component
 * 
 * Implements an accessible 3-slide productivity notes carousel adhering to W3C ARIA carousel guidelines.
 * 
 * Requirements:
 * - Exactly 3 curated focus notes slides.
 * - Previous & Next buttons with circular navigation.
 * - 3 dot indicators with aria-selected and accessible names.
 * - Keyboard navigation (ArrowLeft & ArrowRight).
 * - High visual contrast and responsive design.
 * 
 * @param {Object} props
 * @param {string} [props.className] - Optional custom CSS class.
 */
export function FocusNotes({ className = '' }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const carouselRef = useRef(null)

  const slides = [
    {
      id: 'slide-1',
      tag: 'Time Management',
      icon: Clock,
      title: 'The 2-Minute Rule for Quick Tasks',
      content: 'If an incoming task takes less than two minutes to complete, tackle it immediately rather than scheduling it. This prevents micro-tasks from cluttering your board and draining mental energy.',
      highlight: 'Saves up to 40% of daily cognitive friction'
    },
    {
      id: 'slide-2',
      tag: 'Deep Work Strategy',
      icon: Zap,
      title: 'Prioritize High-Impact Tasks First',
      content: 'Tackle your "High Priority" tasks early in the morning during your peak cognitive energy window. Defer administrative and routine tasks to the afternoon.',
      highlight: 'Accelerates sprint velocity and code throughput'
    },
    {
      id: 'slide-3',
      tag: 'Workflow Hygiene',
      icon: ShieldCheck,
      title: 'Limit Work-In-Progress (WIP)',
      content: 'Restrict items in the "In Progress" column to a maximum of 3 at any time. Context switching between multiple active tasks reduces overall productivity by up to 25%.',
      highlight: 'Reduces lead time and boosts completion rates'
    }
  ]

  const totalSlides = slides.length

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const handleGoTo = (index) => {
    setCurrentSlide(index)
  }

  // Keyboard navigation when carousel is focused
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      handlePrev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      handleNext()
    }
  }

  const activeSlide = slides[currentSlide]
  const ActiveIcon = activeSlide.icon

  return (
    <section 
      ref={carouselRef}
      className={`focus-notes-carousel ${className}`}
      aria-roledescription="carousel"
      aria-label="Productivity Focus Notes"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="carousel-top-bar">
        <div className="carousel-badge">
          <Lightbulb size={14} className="carousel-badge-icon" />
          <span>Focus Notes & Productivity Tips</span>
        </div>

        {/* Slide Counter for Screen Readers & Visual */}
        <span className="carousel-counter" aria-live="polite">
          Slide {currentSlide + 1} of {totalSlides}
        </span>
      </div>

      {/* Active Slide Content */}
      <div 
        className="carousel-slide-content"
        role="group"
        aria-roledescription="slide"
        aria-label={`${currentSlide + 1} of ${totalSlides}: ${activeSlide.title}`}
      >
        <div className="slide-meta">
          <span className="slide-tag">{activeSlide.tag}</span>
          <span className="slide-highlight">
            <ActiveIcon size={13} />
            <span>{activeSlide.highlight}</span>
          </span>
        </div>

        <h3 className="slide-title">{activeSlide.title}</h3>
        <p className="slide-description">{activeSlide.content}</p>
      </div>

      {/* Carousel Bottom Controls */}
      <div className="carousel-controls">
        {/* Navigation Buttons */}
        <div className="carousel-btn-group">
          <button
            type="button"
            className="carousel-nav-btn"
            onClick={handlePrev}
            aria-label="Previous slide"
            title="Previous slide (Left Arrow)"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            className="carousel-nav-btn"
            onClick={handleNext}
            aria-label="Next slide"
            title="Next slide (Right Arrow)"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* 3 Dot Indicators */}
        <div 
          className="carousel-dots-group" 
          role="tablist" 
          aria-label="Slide navigation dots"
        >
          {slides.map((slide, index) => {
            const isSelected = currentSlide === index

            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                className={`carousel-dot ${isSelected ? 'dot-active' : ''}`}
                onClick={() => handleGoTo(index)}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
