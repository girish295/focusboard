import { useState, useEffect } from 'react'
import { sampleTasks } from './data/sampleTasks'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { StatCard } from './components/StatCard'
import { FocusNotes } from './components/FocusNotes'
import { DeepFocusTimer } from './components/DeepFocusTimer'
import { SearchBar } from './components/SearchBar'
import { FilterTabs } from './components/FilterTabs'
import { TaskList } from './components/TaskList'
import { TaskForm } from './components/TaskForm'
import { ConfirmDialog } from './components/ConfirmDialog'
import { Toast } from './components/Toast'
import { 
  CheckCircle2, 
  Clock, 
  ListTodo, 
  Percent, 
  Sparkles, 
  RotateCcw
} from 'lucide-react'

function App() {
  // Single Source of Truth for tasks, persisted to localStorage
  const [tasks, setTasks] = useLocalStorage('focusboard_tasks', sampleTasks)

  // Theme State: 'bento' | 'obsidian' | 'scandi' | 'topnav'
  const [theme, setTheme] = useLocalStorage('focusboard_theme', 'bento')

  // Navigation & Layout State
  const [activeNav, setActiveNav] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // ---------------------------------------------------------------------------
  // Modal Form State (Create / Edit)
  // ---------------------------------------------------------------------------
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)

  // ---------------------------------------------------------------------------
  // Confirmation Dialog State (Delete Safety)
  // ---------------------------------------------------------------------------
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)

  // ---------------------------------------------------------------------------
  // Toast Notifications State
  // ---------------------------------------------------------------------------
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const handleDismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // ---------------------------------------------------------------------------
  // Search & Filter State
  // ---------------------------------------------------------------------------
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const isFilterActive = 
    searchTerm.trim() !== '' || 
    statusFilter !== 'all' || 
    priorityFilter !== 'all'

  const handleClearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setPriorityFilter('all')
    addToast('All filters and search queries cleared.', 'info')
  }

  // ---------------------------------------------------------------------------
  // Derived Statistics (Zero redundant state — computed directly from `tasks`)
  // ---------------------------------------------------------------------------
  const totalTasks = tasks.length
  const todoCount = tasks.filter((t) => t.status === 'todo').length
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length
  const completedCount = tasks.filter((t) => t.status === 'completed').length
  const completionPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  const statusCounts = {
    all: totalTasks,
    todo: todoCount,
    'in-progress': inProgressCount,
    completed: completedCount
  }

  // ---------------------------------------------------------------------------
  // Combined Filter Logic
  // ---------------------------------------------------------------------------
  const filteredTasks = tasks.filter((task) => {
    const cleanQuery = searchTerm.trim().toLowerCase()
    const matchesSearch = cleanQuery === '' || task.title.toLowerCase().includes(cleanQuery)
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  // ---------------------------------------------------------------------------
  // Form Modal Handlers (Create & Edit)
  // ---------------------------------------------------------------------------
  const handleOpenCreateModal = () => {
    setTaskToEdit(null)
    setIsFormOpen(true)
  }

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task)
    setIsFormOpen(true)
  }

  const handleFormSubmit = (taskData) => {
    if (taskToEdit) {
      // Edit existing task
      setTasks((prev) =>
        prev.map((t) => (t.id === taskToEdit.id ? { ...t, ...taskData } : t))
      )
      addToast(`Task "${taskData.title}" updated successfully.`, 'success')
    } else {
      // Create new task (prepend to top)
      const newTask = {
        ...taskData,
        id: `task-${Date.now()}`
      }
      setTasks((prev) => [newTask, ...prev])
      addToast(`New task "${taskData.title}" created.`, 'success')
    }
    setIsFormOpen(false)
    setTaskToEdit(null)
  }

  // ---------------------------------------------------------------------------
  // Delete Safety Handlers
  // ---------------------------------------------------------------------------
  const handleRequestDelete = (taskId) => {
    const target = tasks.find((t) => t.id === taskId)
    if (target) {
      setTaskToDelete(target)
      setIsConfirmOpen(true)
    }
  }

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id))
      addToast(`Task "${taskToDelete.title}" deleted.`, 'info')
      setTaskToDelete(null)
      setIsConfirmOpen(false)
    }
  }

  const handleCancelDelete = () => {
    setTaskToDelete(null)
    setIsConfirmOpen(false)
  }

  // ---------------------------------------------------------------------------
  // Inline Status Change Handler
  // ---------------------------------------------------------------------------
  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    )
    const statusLabels = {
      todo: 'To Do',
      'in-progress': 'In Progress',
      completed: 'Completed'
    }
    addToast(`Task moved to "${statusLabels[newStatus] || newStatus}".`, 'info')
  }

  // ---------------------------------------------------------------------------
  // Reset Sample Dataset
  // ---------------------------------------------------------------------------
  const handleResetSampleData = () => {
    setTasks(sampleTasks)
    setSearchTerm('')
    setStatusFilter('all')
    setPriorityFilter('all')
    addToast('Board reset to initial sample tasks.', 'info')
  }

  // ---------------------------------------------------------------------------
  // Sidebar Navigation Handler
  // ---------------------------------------------------------------------------
  const handleNavSelect = (navId) => {
    setActiveNav(navId)
    if (navId === 'tasks') {
      setStatusFilter('all')
      setPriorityFilter('all')
      setSearchTerm('')
    }
    addToast(`Navigated to ${navId.charAt(0).toUpperCase() + navId.slice(1)}.`, 'info')
  }

  // ---------------------------------------------------------------------------
  // Synchronize Theme to Document Element
  // ---------------------------------------------------------------------------
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // ---------------------------------------------------------------------------
  // Global Keyboard Shortcuts ('/' for search, 'c' for new task)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input/textarea
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if (e.key === '/') {
        e.preventDefault()
        const searchInput = document.getElementById('task-search-input')
        if (searchInput) {
          searchInput.focus()
          searchInput.select()
        }
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault()
        handleOpenCreateModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="app-layout">
      {/* WCAG Skip Navigation Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Accessible Sidebar Navigation Drawer */}
      <Sidebar 
        activeNav={activeNav}
        onNavSelect={handleNavSelect}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="main-wrapper">
        {/* Sticky Dashboard Header */}
        <Header 
          onOpenCreateTask={handleOpenCreateModal}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          currentTheme={theme}
          onThemeChange={setTheme}
        />

        <main id="main-content" className="content-container">
          {/* Dynamic Statistics Grid */}
          <section className="stats-grid-section" aria-label="Task Performance Statistics">
            <StatCard 
              icon={ListTodo}
              label="Total Tasks"
              value={totalTasks}
              variant="total"
              subtext="All categories"
            />
            <StatCard 
              icon={Clock}
              label="To Do"
              value={todoCount}
              variant="todo"
              subtext="Awaiting start"
            />
            <StatCard 
              icon={Sparkles}
              label="In Progress"
              value={inProgressCount}
              variant="progress"
              subtext="In flight"
            />
            <StatCard 
              icon={CheckCircle2}
              label="Completed"
              value={completedCount}
              variant="completed"
              subtext="Finished"
            />
            <StatCard 
              icon={Percent}
              label="Completion Rate"
              value={`${completionPercentage}%`}
              variant="rate"
              subtext={`${completedCount} of ${totalTasks} completed`}
            />
          </section>

          {/* 2-Column Bento Workspace Architecture */}
          <div className="bento-workspace-grid">
            {/* Left Column: Task Workspace (Search, Filter Tabs, Task Rows) */}
            <section className="task-workspace-card" aria-label="Task Workspace">
              {/* Integrated Search and Filter Header */}
              <div className="workspace-toolbar">
                <SearchBar 
                  value={searchTerm}
                  onChange={setSearchTerm}
                  onClear={() => setSearchTerm('')}
                />

                <div className="workspace-filters-bar">
                  <FilterTabs 
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    priorityFilter={priorityFilter}
                    onPriorityChange={setPriorityFilter}
                    onClearFilters={handleClearFilters}
                    isFilterActive={isFilterActive}
                    statusCounts={statusCounts}
                  />

                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={handleResetSampleData}
                    title="Reset all tasks to initial sample dataset"
                  >
                    <RotateCcw size={13} />
                    <span>Reset Tasks</span>
                  </button>
                </div>
              </div>

              {/* Task Display Rows */}
              <TaskList 
                tasks={filteredTasks}
                isFilterActive={isFilterActive}
                onClearFilters={handleClearFilters}
                onStatusChange={handleStatusChange}
                onEdit={handleOpenEditModal}
                onDelete={handleRequestDelete}
              />
            </section>

            {/* Right Column: Companion Insights (Notes Carousel + Pomodoro Session) */}
            <aside className="bento-companion-column" aria-label="Productivity Tools">
              <FocusNotes />
              <DeepFocusTimer 
                completedCount={completedCount}
                totalTasks={totalTasks}
                onComplete={() => addToast('Deep focus session complete! Well done.', 'success')}
              />
            </aside>
          </div>
        </main>
      </div>

      {/* Modal Form (Create / Edit) */}
      {isFormOpen && (
        <TaskForm 
          key={taskToEdit ? `edit-${taskToEdit.id}` : 'create-new'}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          taskToEdit={taskToEdit}
        />
      )}

      {/* Accessible Delete Confirmation Dialog */}
      <ConfirmDialog 
        isOpen={isConfirmOpen}
        title="Delete Task"
        message={
          taskToDelete 
            ? `Are you sure you want to delete "${taskToDelete.title}"? This action cannot be undone.`
            : 'Are you sure you want to delete this task?'
        }
        confirmLabel="Delete Task"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Accessible Toast Notifications */}
      <Toast 
        toasts={toasts}
        onDismiss={handleDismissToast}
      />
    </div>
  )
}

export default App
