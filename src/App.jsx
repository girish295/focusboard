import { useState, useEffect } from 'react'
import { sampleTasks } from './data/sampleTasks'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { StatCard } from './components/StatCard'
import { FocusNotes } from './components/FocusNotes'
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
  Plus, 
  RotateCcw
} from 'lucide-react'

function App() {
  // Single Source of Truth for tasks, persisted to localStorage
  const [tasks, setTasks] = useLocalStorage('focusboard_tasks', sampleTasks)
  
  // Theme State: 'crisp' | 'warm' | 'emerald' | 'midnight'
  const [theme, setTheme] = useLocalStorage('focusboard_theme', 'crisp')
  
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
      // Edit mode: update selected task while preserving id and createdAt
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskData.id
            ? { ...t, ...taskData, id: t.id, createdAt: t.createdAt }
            : t
        )
      )
      addToast(`Task "${taskData.title}" updated successfully.`, 'success')
    } else {
      // Create mode: add new task to top of list
      const newTask = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: Date.now()
      }
      setTasks((prevTasks) => [newTask, ...prevTasks])
      addToast(`Task "${newTask.title}" created successfully.`, 'success')
    }
  }

  // ---------------------------------------------------------------------------
  // Delete Confirmation Flow
  // ---------------------------------------------------------------------------
  const handleRequestDelete = (taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      setTaskToDelete(task)
      setIsConfirmOpen(true)
    }
  }

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id))
      addToast(`Task "${taskToDelete.title}" was deleted.`, 'info')
      setIsConfirmOpen(false)
      setTaskToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setIsConfirmOpen(false)
    setTaskToDelete(null)
  }

  // ---------------------------------------------------------------------------
  // Status Changes & Reset
  // ---------------------------------------------------------------------------
  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )
    const task = tasks.find((t) => t.id === taskId)
    const statusLabels = { todo: 'To Do', 'in-progress': 'In Progress', completed: 'Completed' }
    addToast(`"${task ? task.title : 'Task'}" moved to ${statusLabels[newStatus] || newStatus}.`, 'info')
  }

  const handleResetSampleData = () => {
    setTasks(sampleTasks)
    handleClearFilters()
    addToast('Restored 6 initial sample tasks to state & storage.', 'info')
  }

  // ---------------------------------------------------------------------------
  // Global Keyboard Shortcuts (Press '/' to focus search, 'c' to create task)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const activeEl = document.activeElement
      const tagName = activeEl ? activeEl.tagName.toLowerCase() : ''
      const isInputFocused = tagName === 'input' || tagName === 'textarea' || tagName === 'select' || activeEl?.isContentEditable

      if (isInputFocused) {
        return
      }

      if (e.key === '/') {
        e.preventDefault()
        const searchInput = document.getElementById('task-search-input')
        if (searchInput) {
          searchInput.focus()
          searchInput.select()
        }
      } else if (e.key === 'c' || e.key === 'C') {
        if (!isFormOpen && !isConfirmOpen) {
          e.preventDefault()
          handleOpenCreateModal()
        }
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [isFormOpen, isConfirmOpen])

  return (
    <div className="app-layout" data-theme={theme}>
      {/* WCAG Skip to Main Content Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Responsive Collapsible Sidebar */}
      <Sidebar 
        activeNav={activeNav}
        onNavSelect={setActiveNav}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
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
              subtext="Across all categories"
            />
            <StatCard 
              icon={Clock}
              label="To Do"
              value={todoCount}
              variant="todo"
              subtext="Awaiting initiation"
            />
            <StatCard 
              icon={Sparkles}
              label="In Progress"
              value={inProgressCount}
              variant="progress"
              subtext="Currently in flight"
            />
            <StatCard 
              icon={CheckCircle2}
              label="Completed"
              value={completedCount}
              variant="completed"
              subtext="Tasks finished"
            />
            <StatCard 
              icon={Percent}
              label="Completion Rate"
              value={`${completionPercentage}%`}
              variant="rate"
              subtext={`${completedCount} of ${totalTasks} completed`}
            />
          </section>

          {/* Focus Notes Carousel */}
          <FocusNotes />

          {/* Quick Action Bar */}
          <div className="dashboard-action-bar">
            <div className="action-buttons">
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleOpenCreateModal}
              >
                <Plus size={16} />
                <span>Create Task</span>
              </button>

              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleResetSampleData}
              >
                <RotateCcw size={16} />
                <span>Reset to Sample Tasks</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Suite */}
          <div className="search-filter-section">
            <SearchBar 
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
            />

            <FilterTabs 
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityChange={setPriorityFilter}
              onClearFilters={handleClearFilters}
              isFilterActive={isFilterActive}
              statusCounts={statusCounts}
            />
          </div>

          {/* Section Header with Active Results Count */}
          <div className="dashboard-section-header">
            <div>
              <h2 className="section-title">
                {isFilterActive ? `Filtered Tasks (${filteredTasks.length})` : `All Tasks (${tasks.length})`}
              </h2>
              <p className="section-subtitle">
                {isFilterActive 
                  ? `Showing results matching your active search and filter parameters.`
                  : `Browse, filter, and organize all tasks on your board.`
                }
              </p>
            </div>
          </div>

          {/* Task Display with Delete Confirmation Hook */}
          <TaskList 
            tasks={filteredTasks}
            isFilterActive={isFilterActive}
            onClearFilters={handleClearFilters}
            onStatusChange={handleStatusChange}
            onEdit={handleOpenEditModal}
            onDelete={handleRequestDelete}
          />
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
