# FocusBoard — Production-Ready Task & Productivity Dashboard

FocusBoard is a responsive, highly accessible task and metrics dashboard engineered with **React 19**, **Vite**, and pure **CSS3 Custom Properties**. Built with zero external CSS frameworks or UI component libraries, FocusBoard demonstrates enterprise frontend architecture, resilient local persistence, compound multi-criteria filtering, and strict WCAG 2.1 AA compliance.

---

## 🌟 Key Features

- **📊 Reactive Performance Metrics (Derived State):**
  - Instant live metrics: *Total Tasks*, *To Do*, *In Progress*, *Completed*, and *Completion Rate %*.
  - Computed synchronously during render — zero redundant state or out-of-sync stat bugs.

- **⚡ Full CRUD Operations with Strict Validation:**
  - Create and Edit tasks with dedicated modal overlays.
  - Form validation: Required title (trimmed, ≤ 100 characters), description (≤ 500 characters), and required due date.
  - Auto-focuses the first invalid field upon validation failure.
  - Key-based resetting pattern prevents cascading `setState` effects and preserves original creation timestamps.

- **🔍 Compound Search & Multi-Filtering:**
  - Instant, case-insensitive search across task titles and descriptions with an instant "X" clear action.
  - Status tabs (`All`, `To Do`, `In Progress`, `Completed`) with dynamic count badges.
  - Priority dropdown filter (`All Priorities`, `High`, `Medium`, `Low`).
  - Compound boolean logic (`AND` combination across search, status, and priority).
  - Empty state with an instant "Clear All Filters" button when no tasks match.

- **🛡️ Accessible Modals & Alert Dialogs:**
  - Custom delete confirmation dialog (`role="alertdialog"`, WAI-ARIA compliant).
  - Focus trapping and automatic focus restoration to the trigger button upon dismissal.
  - Full keyboard accessibility (`Escape` to close, `Tab` cycling, `Enter` submission).

- **🔔 Non-Intrusive Live Toast Queue:**
  - Accessible toast notifications announcing task additions, updates, deletions, and status toggles.
  - Screen-reader compatible via `aria-live="polite"`.
  - Self-dismissing with smooth transitions and manual dismiss buttons.

- **💡 Focus Notes Productivity Carousel:**
  - Interactive carousel featuring actionable productivity methods (Eat the Frog, Pomodoro, 2-Minute Rule).
  - Infinite circular navigation using pure modulo mathematics.
  - Full keyboard support (`ArrowLeft` / `ArrowRight`) and tablist-compliant dot indicators.

- **💾 Robust Local Persistence (`useLocalStorage` Hook):**
  - Lazy state initialization avoiding unnecessary disk reads on re-render.
  - Defensive `try/catch` wrappers protecting against corrupted JSON strings and non-array storage anomalies.
  - Graceful fallback to rich sample tasks on first launch or corrupt storage.
  - Safe error handling for private browsing `QuotaExceededError`.

- **♿ WCAG 2.1 AA Accessibility & Responsive Design:**
  - Hidden "Skip to Main Content" link for keyboard and screen-reader users.
  - Contrast ratios exceeding 4.5:1 on all text and UI badge variants.
  - High-visibility keyboard focus rings (`:focus-visible`).
  - `@media (prefers-reduced-motion: reduce)` support for motion-sensitive users.
  - Mobile off-canvas drawer navigation with backdrops and touch-friendly 44px hit targets.

---

## 🏗️ Architecture & Component Tree

FocusBoard follows a strict **Single Source of Truth** pattern where `App.jsx` orchestrates global state, and child components remain purely controlled and decoupled.

```text
src/
├── main.jsx                     # Application bootstrap and root mount
├── App.jsx                      # Single Source of Truth, state orchestration & layout
├── index.css                    # CSS Custom Properties, reset, layout, and responsive styles
├── data/
│   └── sampleTasks.js           # 6 rich initial tasks with varied categories & priorities
├── hooks/
│   └── useLocalStorage.js       # Resilient localStorage sync custom hook
└── components/
    ├── Sidebar.jsx              # Responsive navigation & mobile off-canvas drawer
    ├── Header.jsx               # Application title, pure date formatter, and New Task CTA
    ├── StatCard.jsx             # Individual reactive metric card
    ├── FocusNotes.jsx           # Modulo-driven productivity tips carousel
    ├── SearchBar.jsx            # Controlled search input with clear button
    ├── FilterTabs.jsx           # Status filter tabs with live counts & priority dropdown
    ├── TaskList.jsx             # Task grid container and zero-state handler
    ├── TaskCard.jsx             # Task item with overdue detection, status switcher & action buttons
    ├── TaskForm.jsx             # Create/Edit modal with validation and key-based reset
    ├── ConfirmDialog.jsx        # Accessible delete confirmation alert dialog
    ├── Toast.jsx                # Floating toast notification stack
    └── EmptyState.jsx           # Contextual empty state for searches or empty board
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js version 18.0.0 or higher
- npm (or pnpm / yarn)

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/focusboard.git
cd focusboard
npm install
```

### 2. Run Development Server
Start the Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Static Analysis & Linting
Run static code analysis using oxlint:
```bash
npm run lint
```
*Expected output: `Found 0 warnings and 0 errors.`*

### 4. Production Build & Preview
Compile the optimized production bundle:
```bash
npm run build
npm run preview
```
The output will be generated inside the `dist/` directory.

---

## 🌐 Deployment Guide (Vercel)

FocusBoard is optimized for zero-configuration deployment on Vercel:

### Method A: Deploy via GitHub (Recommended)
1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete FocusBoard dashboard"
   git branch -M main
   git remote add origin https://github.com/your-username/focusboard.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `focusboard` GitHub repository.
4. Verify the build settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **"Deploy"**. Your application will be live at `https://focusboard-yourusername.vercel.app`.

### Method B: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 📐 Design Decisions & Trade-offs

| Decision | Chosen Approach | Alternative Considered | Rationale |
| :--- | :--- | :--- | :--- |
| **Styling** | Plain CSS3 Custom Properties | Tailwind CSS / Bootstrap | Guarantees zero runtime overhead, enforces fundamental CSS competency, and enables modular theming via semantic design tokens. |
| **Metrics State** | Derived State during render | Redundant `useState` + `useEffect` | Synchronous derivation guarantees metrics are mathematically impossible to fall out of sync with `tasks`. |
| **Form Resetting** | Key-based mounting (`key={id}`) | Synchronizing `useEffect` | Follows React 19 compiler guidelines, prevents cascading re-renders, and cleanly initializes state via `useState`. |
| **Persistence** | Resilient `useLocalStorage` hook | External store / Redux | Demonstrates clean custom hook composition with defense against malformed JSON, quota issues, and SSR environments. |
| **Icons** | `lucide-react` | Emoji characters | Guarantees consistent typography, vector scalability, cross-platform visual consistency, and WCAG accessibility. |

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
