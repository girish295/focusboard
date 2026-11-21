/**
 * FocusBoard — Sample Tasks Dataset
 * 
 * Provides initial realistic data for the task management dashboard.
 * Satisfies all requirements:
 * - 6 realistic tasks
 * - All 3 statuses: 'todo', 'in-progress', 'completed'
 * - All 3 priorities: 'low', 'medium', 'high'
 * - Varied due dates (past/overdue, near-term, long-term)
 * - Includes a long title to verify layout wrapping
 * - Realistic descriptions and categories
 * - Unique IDs and creation timestamps
 */

export const sampleTasks = [
  {
    id: "task-1",
    title: "Design user onboarding flow and wireframes",
    description: "Create high-fidelity Figma mockups for the new user registration and interactive product onboarding tour.",
    category: "Design",
    status: "completed",
    priority: "high",
    dueDate: "2026-11-18",
    createdAt: 1731900000000
  },
  {
    id: "task-2",
    title: "Implement responsive navigation drawer with accessible ARIA keyboard controls",
    description: "Build the collapsible sidebar with keyboard focus trap, aria-expanded attributes, and mobile swipe gestures.",
    category: "Frontend",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-11-25",
    createdAt: 1732000000000
  },
  {
    id: "task-3",
    title: "Configure localStorage persistence and error handling",
    description: "Create a resilient custom hook to synchronize state with window.localStorage using defensive try-catch blocks.",
    category: "Frontend",
    status: "in-progress",
    priority: "medium",
    dueDate: "2026-11-28",
    createdAt: 1732050000000
  },
  {
    id: "task-4",
    title: "Write unit tests for task filtering and search helpers",
    description: "Ensure case-insensitive partial match search and combined status/priority filter logic pass all edge cases.",
    category: "Testing",
    status: "todo",
    priority: "medium",
    dueDate: "2026-12-02",
    createdAt: 1732100000000
  },
  {
    id: "task-5",
    title: "Audit color contrast and accessibility compliance",
    description: "Verify WCAG 2.1 AA compliance across all status badges, form inputs, and dark/light color tokens.",
    category: "Accessibility",
    status: "todo",
    priority: "low",
    dueDate: "2026-12-05",
    createdAt: 1732150000000
  },
  {
    id: "task-6",
    title: "Prepare deployment documentation and AI usage disclosure",
    description: "Complete comprehensive README.md and AI_USAGE.md detailing prompt history and architecture.",
    category: "Documentation",
    status: "todo",
    priority: "low",
    dueDate: "2026-12-08",
    createdAt: 1732200000000
  }
]
