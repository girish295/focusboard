# FocusBoard — Final Loom Video Walkthrough Script (3:30 – 4:30 Min)

> **Audience:** Engineering Managers, Lead Frontend Developers, Technical Evaluators  
> **GitHub Repo:** https://github.com/girish295/focusboard  
> **Mode:** Loom Screen + Camera Bubble (1080p)  
> **Tone:** Confident, structured, senior-level engineering delivery

---

## 📋 1-Minute Pre-Recording Checklist

1. **Dev Server Running:**
   ```bash
   npm run dev
   ```
   Open **`http://localhost:5173`** in Chrome/Edge/Brave.
2. **VS Code Tabs to Have Open:**
   - `src/App.jsx` (showcases state orchestration & derived metrics)
   - `src/hooks/useLocalStorage.js` (showcases defensive storage)
   - `src/components/TaskForm.jsx` (showcases key-based reset & validation)
   - `src/index.css` (showcases CSS design tokens & 4-palette theme engine)
3. **Split Terminal Ready:**
   Keep a terminal ready to run:
   ```bash
   npm run lint; npm run build
   ```
4. **Loom Settings:**
   - Screen + Cam (Face bubble in bottom-left or bottom-right corner).
   - Target duration: **3:30 to 4:15 minutes**.

---

## ⏱️ Video Timeline at a Glance

| Time | Segment | Focus |
| :--- | :--- | :--- |
| **0:00 – 0:30** | **Hook & Introduction** | Self-intro, FocusBoard overview, React 19 + pure CSS3 token architecture. |
| **0:30 – 2:15** | **Live Interactive Demo** | Stats, compound filtering, 1-click completion, CRUD, theme switcher, carousel, mobile drawer. |
| **2:15 – 3:30** | **Architectural Deep Dive**| Derived state vs useEffect, React 19 key-resetting, resilient `useLocalStorage`, design token system. |
| **3:30 – 4:00** | **Code Health & Build** | `oxlint` (0 errors), Vite production build (<1s), WCAG 2.1 AA. |
| **4:00 – 4:20** | **AI Transparency & Sign-off**| `AI_USAGE.md` attestation, GitHub repo, interview closing. |

---

## 🎙️ Word-for-Word Teleprompter Script (With Action Cues)

### 1. Introduction (0:00 – 0:30)
> **[Camera on you + Browser showing FocusBoard dashboard]**
>
> *"Hi everyone! I’m excited to walk you through **FocusBoard**, a production-grade, highly accessible task management and productivity dashboard.*
>
> *I engineered FocusBoard using **React 19**, **Vite**, and **pure vanilla CSS3 Custom Properties**—intentionally avoiding third-party CSS frameworks or UI component libraries.*
>
> *My primary goal was to demonstrate enterprise frontend architecture: a strict single source of truth, synchronous derived metrics with zero redundant state, strict WCAG 2.1 AA compliance, and a resilient persistence layer."*

---

### 2. Live Interactive Product Walkthrough (0:30 – 2:15)

#### A. Reactive Metrics & Multi-Filtering
> **[Action: Point mouse at the 5 top StatCards]**
>
> *"Starting at the top, we have five reactive performance metrics: Total Tasks, To Do, In Progress, Completed, and the live Completion Rate. These are calculated synchronously during render, meaning they are mathematically impossible to fall out of sync.*
>
> **[Action: Type 'audit' in search bar, click 'In Progress' tab, select 'High' priority]**
>
> *Below is our compound filtering engine. Notice how text search, status tab filters, and priority dropdowns combine using boolean AND logic. If no tasks match, an empty state appears with an instant 'Clear All Filters' action.*
>
> **[Action: Click 'Clear All Filters' or the search 'X']**
>
> *With one click, our board restores immediately."*

#### B. Full CRUD, Quick Toggle & Form Validation
> **[Action: Click the circular check icon on any task card]**
>
> *"Notice this interactive quick-check button: with a single click, I can toggle any task between 'Completed' and 'To Do'. The completion rate at the top automatically animates and updates in real time.*
>
> **[Action: Click '+ New Task' button in header]**
>
> *Creating a task opens an accessible modal with keyboard focus trapping. Notice our validation:*
>
> **[Action: Click 'Create Task' with empty inputs — point out red error labels]**
>
> *It blocks submission, highlights required fields, and auto-focuses the first invalid input. Let’s enter 'Refactor Database Queries', set priority to High, and choose tomorrow's date.*
>
> **[Action: Type title, pick date, click 'Create Task']**
>
> *Submitting instantly updates the board, updates our stats, and triggers an accessible toast notification announced via screen readers."*

#### C. Accessible Delete Dialog
> **[Action: Click the trash icon on a card — ConfirmDialog appears]**
>
> *"Instead of an un-styled native `window.confirm`, we engineered a custom alert dialog (`role="alertdialog"`). It intentionally traps focus on 'Cancel' to prevent accidental data destruction, and pressing `Escape` closes the modal while restoring focus directly back to the trigger button.*
>
> **[Action: Press 'Escape', then click trash again and click 'Delete Task']**
>
> *When confirmed, the task is deleted and a toast confirms the removal."*

#### D. Live Theme Switcher & Productivity Carousel
> **[Action: Click the Palette dropdown in the header and switch between themes]**
>
> *"One feature I'm particularly proud of is our **4-Palette Theme Engine**. Right from the header, users can switch between:
> - **Crisp Light** (Stripe & Apple style)
> - **Warm Notion** (cream linen & terracotta)
> - **Fresh Emerald** (mint & forest)
> - and **Midnight Dark** (Linear & Raycast dark obsidian).
>
> Notice how all borders, glow accents, and badge contrast ratios dynamically adapt instantly without any page reload!*
>
> **[Action: Click next arrow on Focus Notes carousel, then toggle mobile DevTools (390px)]**
>
> *Below is our Focus Notes carousel using modulo mathematics for infinite cyclic navigation, and the dashboard is completely responsive with an animated off-canvas drawer on mobile viewports."*

---

### 3. Architecture & Code Deep Dive (2:15 – 3:30)
> **[Switch screen to VS Code]**
>
> *"Let's look under the hood at the architectural decisions.*
>
> **[Show `src/App.jsx` lines ~80–95 where stats are calculated]**
>
> *1. **Single Source of Truth & Derived State:** `App.jsx` owns the `tasks` state. Instead of maintaining redundant state like `const [completedCount, setCompletedCount] = useState()` synchronized via `useEffect`—which causes stale-state bugs—we calculate all counts and completion rates synchronously during render.*
>
> **[Show `src/App.jsx` line `<TaskForm key={taskToEdit ? ...} />`]**
>
> *2. **Key-Based Component Resetting:** In `TaskForm`, instead of resetting inputs through an effect when an edit task changes, we use the idiomatic React key-based lifecycle pattern: `key={taskToEdit ? taskToEdit.id : 'new'}`. This forces a clean remount, complying with React 19 compiler purity rules and avoiding cascading re-renders.*
>
> **[Show `src/hooks/useLocalStorage.js`]**
>
> *3. **Defensive Storage Engine (`useLocalStorage`):** It features lazy initialization (`useState(() => ...)`), defensive `try/catch` JSON parsing, fallback against corrupted non-array data, and safeguards against private-browsing `QuotaExceededError`.*
>
> **[Show `src/index.css` root design tokens & theme attributes]**
>
> *4. **Zero-Dependency CSS Architecture:** We used pure CSS custom properties and semantic design tokens to power all 4 themes, ensuring zero runtime CSS-in-JS overhead and maximum rendering performance."*

---

### 4. Code Quality & Build Verification (3:30 – 4:00)
> **[Switch screen to Terminal]**
>
> *"To verify enterprise code quality:*
>
> **[Action: Run `npm run lint; npm run build`]**
>
> *Running `npm run lint` with oxlint scans all 17 source files: **0 errors, 0 warnings**.*
>
> *And executing `npm run build` compiles our minified Vite production bundle in under 1 second."*

---

### 5. AI Transparency & Closing (4:00 – 4:20)
> **[Show GitHub repository or AI_USAGE.md]**
>
> *"In line with transparent engineering standards, I’ve included an `AI_USAGE.md` attestation documenting how AI was utilized as a pair-programmer for initial scaffolding and contrast audits, while all core architecture, state orchestration, and testing were authored and verified by me.*
>
> *The entire project is pushed and live on GitHub at **github.com/girish295/focusboard**.*
>
> *Thank you so much for your time and consideration—I look forward to discussing FocusBoard in the technical interview!"*

---

## 💡 Quick Tips for a Flawless Recording
* **Relax & Breathe:** Don't worry about tiny pauses; conversational confidence is what reviewers remember.
* **Guide the Viewer:** Move your mouse deliberately to the button or card you're explaining.
* **Keep Loom in 1080p:** Crisp code text and contrast badges look fantastic in high definition.
