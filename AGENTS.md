# MOLD V2 — Mastery Protocol: Agent Documentation

This document is the single source of truth for any agent (human or AI) working on this codebase. Read it fully before touching any file.

---

## Table of Contents

1. [What This Project Is](#1-what-this-project-is)
2. [Directory Map](#2-directory-map)
3. [Design System](#3-design-system)
4. [Data Contracts](#4-data-contracts)
5. [State Architecture](#5-state-architecture)
6. [Game Engine](#6-game-engine)
7. [Achievement Engine](#7-achievement-engine)
8. [Component Catalogue](#8-component-catalogue)
9. [Data Flow: End-to-End Session](#9-data-flow-end-to-end-session)
10. [Persistence Layer](#10-persistence-layer)
11. [Connecting a Real Subject](#11-connecting-a-real-subject)
12. [Known Seams and Production TODOs](#12-known-seams-and-production-todos)
13. [Engineering Constraints](#13-engineering-constraints)
14. [Available Workflows](#14-available-workflows)

---

## 1. What This Project Is

MOLD V2 is a Next.js 16 App Router application that implements a high-performance educational quiz system called "Mastery Protocol." Players load a subject (a `FullSubjectData` JSON blob), select one of seven game modes, answer questions, and accumulate run history and achievements.

The demo subject is **Theory of Computation** with 20 questions across 6 categories.

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, Geist fonts. No external database — localStorage is the persistence layer, with an explicit async interface ready for an IndexedDB or server-side upgrade.

---

## 2. Directory Map

```
app/
  layout.tsx          — Root layout: Geist fonts, AchievementProvider wrapper, metadata
  page.tsx            — Entry point: renders <HomeScreen />
  globals.css         — Full design token definitions (CSS custom properties)

lib/
  mold-types.ts       — ALL shared TypeScript types, interfaces, enums, utility functions,
                        and the GAME_MODES registry and demo seed data. READ THIS FIRST.
  game-engine.tsx     — GameEngineProvider (React Context) + useGameEngine() hook.
                        Contains the reducer, question pool builder, and timer.
  achievement-engine.tsx — AchievementProvider + useAchievements() hook.
                        Contains evaluateCondition(), checkNewUnlocks(), and localStorage
                        persistence with async interface.
  subject-store.ts    — Demo question bank (20 questions, 10 flashcards, terminology).
                        Exports DEMO_FULL_SUBJECT and deriveCategoriesFromSubject().

components/
  mold/
    home-screen.tsx         — Root view switcher (home ↔ game). Owns selectedMode, config,
                              runs state. The only place that calls GameRunner.
    hero-header.tsx         — Subject title, description, status bar, clickable trophy counter.
    mode-selector.tsx       — 7 mode cards in two groups (Challenge / Learning).
    setup-panel.tsx         — Time limit, hints, question count, category grid (practice only).
    performance-table.tsx   — Aggregate stats strip + recent runs table with grades.
    action-hub.tsx          — Encyclopedia button + Initialize (start game) button.
    game-runner.tsx         — Mounts ToastLayer > GameErrorBoundary > GameEngineProvider.
                              Routes flashcards to FlashcardScreen, all other modes to
                              GameRunnerInner.
    game-screen.tsx         — GameHeader, QuestionCard, GameFooter, ResultsScreen.
                              All four consume useGameEngine().
    flashcard-screen.tsx    — Standalone flip-card UI for the "flashcards" mode.
                              Does NOT use the game engine.
    achievement-toast.tsx   — useAchievementToast() hook + AchievementToastContainer.
    achievement-gallery.tsx — Full-screen overlay listing unlocked/locked achievements.
    game-error-boundary.tsx — Class component wrapping GameEngineProvider. Renders a
                              recoverable "SYSTEM FAULT" panel on engine crashes.
  ui/
    button.tsx, card.tsx, input.tsx — shadcn/ui primitives (do not modify).
  theme-provider.tsx
```

---

## 3. Design System

### Theme

Dark-first, neo-brutalist, monospace data aesthetic. The primary accent is **amber/yellow** (`--primary: 43 96% 52%`). All colors are defined as CSS custom properties in `app/globals.css` and referenced via Tailwind semantic tokens.

**Never use direct color classes** (`text-white`, `bg-black`, etc.). Always use design tokens (`bg-background`, `text-foreground`, `border-border`, `text-primary`, etc.).

### Key Tokens

| Token | Value | Usage |
|---|---|---|
| `--background` | `220 13% 6%` | Page background |
| `--foreground` | `210 20% 92%` | Body text |
| `--primary` | `43 96% 52%` | Amber accent, CTAs, active states |
| `--panel` | `220 12% 11%` | Elevated surfaces (header, footer, cards) |
| `--border` | `220 10% 18%` | All borders |
| `--muted-foreground` | `215 12% 45%` | Labels, secondary text |
| `--destructive` | `0 72% 51%` | Errors, danger states |
| `--radius` | `0.25rem` | Border radius — keep this tight, neo-brutalist |

### Utility Classes (custom, defined in globals.css)

- `scanlines` — CRT scanline overlay, used on hero section backgrounds
- `border-glow` — Amber glow box-shadow for highlighted panels
- `border-glow-danger` — Red glow
- `border-glow-success` — Green glow
- `font-data` — Forces monospace for numeric data display

### Animations (defined in tailwind.config.ts)

- `animate-fade-in` — Opacity 0 → 1 (0.3s)
- `animate-slide-up` — Translate Y 8px → 0 + fade (0.3s)
- `animate-pulse-glow` — Opacity pulse for countdown warnings

### Typography

- **Headings/UI labels:** `font-mono` (Geist Mono) — all-caps, tracking-wider
- **Body/questions:** `font-sans` (Geist Sans)
- **Numbers/scores/times:** Always `font-mono tabular-nums`

---

## 4. Data Contracts

Everything lives in `lib/mold-types.ts`. Read that file before writing any data-handling code.

### `FullSubjectData` — the external data contract

This is the shape of data consumed from a subject JSON file or API:

```ts
interface FullSubjectData {
  id: string
  name: string
  config: {
    title: string
    description: string
    themeColor?: string
    version?: string
    storageKey?: string      // used as localStorage namespace
  }
  questions: Question[]
  flashcards: Flashcard[]
  terminology: Terminology   // { [category: string]: TerminologyEntry[] }
  achievements: RawAchievementDef[]
  [key: string]: unknown
}
```

### `Question`

```ts
interface Question {
  id: string
  type: "MCQ" | "TrueFalse"
  difficulty: "Easy" | "Medium" | "Hard"
  category: string           // kebab-case slug, e.g. "finite-automata"
  question: string
  options: MCQOption[]       // TrueFalse uses [{label:"A",text:"True"},{label:"B",text:"False"}]
  answer: string             // correct option label, e.g. "B"
  explanation?: string       // shown after reveal
  hint?: string              // shown if hintsEnabled and user requests hint
}
```

### `RunRecord` — a completed session

```ts
interface RunRecord {
  id: string
  date: string               // ISO string
  mode: GameModeId
  score: number              // 0–100 accuracy %
  correctAnswers: number
  totalQuestions: number
  timeTaken: number          // seconds; 0 = untimed
  streak: number
  grade: LetterGrade         // "S+" | "S" | "A+" | "A" | "B+" | "C+" | "D+" | "F"
}
```

### Grade thresholds (`calculateGrade(pct)`)

| Grade | Min accuracy |
|---|---|
| S+ | 97% |
| S | 93% |
| A+ | 90% |
| A | 87% |
| B+ | 80% |
| C+ | 70% |
| D+ | 60% |
| F | < 60% |

### Utility Functions (all exported from `lib/mold-types.ts`)

| Function | Purpose |
|---|---|
| `calculateGrade(pct)` | number → LetterGrade |
| `gradeColor(grade)` | grade → Tailwind text class |
| `gradeBgColor(grade)` | grade → Tailwind bg+border+text compound class |
| `formatTime(seconds)` | `178` → `"2:58"`, `0` → `"—"` |
| `formatDate(iso)` | ISO string → `"15 Mar 2025"` |
| `modeLabel(id)` | `"speedrun"` → `"Speedrun"` |
| `formatLabel(slug)` | `"finite-automata"` → `"Finite Automata"` |
| `computeAggregateStats(runs)` | `RunRecord[]` → `AggregateStats` |

**Do not duplicate these.** If you need a new utility of the same kind, add it here.

---

## 5. State Architecture

### Overview

There are three independent state domains:

```
AchievementProvider (app/layout.tsx)
  ├── achievements: Achievement[]        persisted in localStorage
  └── onGameComplete / reset

HomeScreen (local React state)
  ├── view: "home" | "game"
  ├── runs: RunRecord[]                  persisted in localStorage, 50-run cap
  ├── selectedMode: GameModeId
  ├── config: SetupConfig
  └── showGallery: boolean

GameEngineProvider (inside GameRunner, mounted per session)
  └── state: GameState                   in-memory, destroyed when GameRunner unmounts
```

### Rules

1. `GameEngineProvider` is ephemeral — it is mounted when a game starts and unmounted when the player returns home. Do not attempt to persist `GameState` across sessions.
2. `AchievementProvider` lives at the root and survives navigation.
3. `HomeScreen` owns `runs`. When a game completes and the player returns home, `handleReturnHome` calls `loadRuns()` to refresh state from storage.
4. **Never call `useGameEngine()` outside a component tree that has `GameEngineProvider` as an ancestor.** The hook throws if the context is null.

---

## 6. Game Engine

**File:** `lib/game-engine.tsx`

### How it works

`GameEngineProvider` takes `config: GameConfig` and `questions: Question[]`, builds initial state via `buildInitialState()`, and exposes state + actions via `GameEngineContext`.

**The config and questions props are frozen on first mount** via `useRef` — parent re-renders cannot reset the game state. This is intentional (Fix 4-A).

### Question Pool Builder (`buildQuestionPool`)

| Mode | Pool logic |
|---|---|
| `speedrun` | Shuffle all → slice to `questionCount` |
| `blitz` | Shuffle → slice to `questionCount` (default 20) |
| `hardcore` | Filter `difficulty === "Hard"` → fallback to full shuffle if < 5 hard questions |
| `survival` | Shuffle → slice to `questionCount` |
| `practice` | Filter by `selectedCategory` if set → shuffle → slice |
| `full-revision` | No shuffle, strict original order |
| `flashcards` | Bypasses engine entirely — handled by `FlashcardScreen` |

### Timer

A `setInterval` fires `TICK` every second while `phase === "playing" || "reviewing"`. `TICK` increments `elapsedSeconds` and decrements `globalTimeRemaining` for timed modes. When `globalTimeRemaining` reaches 0, the reducer transitions `phase` to `"complete"`.

### Global Time Limits

| Mode | Time limit |
|---|---|
| `speedrun` | 300s (5 min) |
| `blitz` | 120s (2 min) |
| All others | 0 (untimed) |

### Per-Question Time (Survival)

Survival starts at 15s per question. Every 5 questions, the limit decreases by 1s (minimum 5s). The SurvivalStressBar renders a CSS `drain` animation that restarts on each question advance.

### Reducer Actions

| Action | Trigger | Effect |
|---|---|---|
| `SELECT_OPTION` | Player taps an option | Sets `selectedOption` |
| `REVEAL_ANSWER` | Player presses SUBMIT | Sets `isRevealed`, updates `score`, `streak`, `bestStreak`, `wrongAnswers`, `livesRemaining` |
| `NEXT_QUESTION` | Player presses NEXT/FINISH | Advances `currentIndex` or transitions to `"complete"` |
| `TICK` | Every second | Increments `elapsedSeconds`, decrements `globalTimeRemaining` |
| `USE_HINT` | Player presses HINT | Increments `hintsUsedTotal` |
| `FORFEIT` | Player presses QUIT | Transitions to `"complete"` immediately |

### Accuracy Calculation

```ts
// Correct: uses answered questions as denominator
const answeredCount = state.score + state.wrongAnswers
const accuracyPct = answeredCount > 0 ? Math.round((state.score / answeredCount) * 100) : 0
```

Do not use `currentIndex` as a denominator — it is 0-based and does not equal answered count.

---

## 7. Achievement Engine

**File:** `lib/achievement-engine.tsx`

### Condition Types

| `type` | Evaluated against | Required fields |
|---|---|---|
| `accuracy_gte` | Accuracy % of completed run | `value` |
| `streak_gte` | `state.bestStreak` | `value` |
| `mode_complete` | `state.mode === condition.mode` | `mode` |
| `speedrun_under` | mode === speedrun + elapsed ≤ N | `mode`, `seconds` |
| `no_hints` | mode matches + `hintsUsedTotal === 0` | `mode` |
| `runs_gte` | `allRuns.length >= value` | `value` |
| `all_categories` | 3+ practice runs (simplified demo) | — |
| `all_unlocked` | Meta — all others unlocked | — |

### Calling order (critical)

```ts
// Inside GameRunnerInner, fired exactly once via useRef guard:
onGameComplete(state, runs).then((unlocked) => {
  if (unlocked.length > 0) showUnlocks(unlocked)
})
```

`onGameComplete` is an async function from `useAchievements()`. It:
1. Loads current achievements from localStorage
2. Calls `checkNewUnlocks(current, state, allRuns)`
3. Stamps `unlockedAt` on newly unlocked achievements
4. Saves back to localStorage
5. Updates React state
6. Returns the newly unlocked `Achievement[]` objects for the toast

### Production migration (condition registry)

The demo uses `DEMO_ACHIEVEMENT_CONDITIONS`, a hardcoded registry. To use conditions from a real `FullSubjectData`:

```ts
import { loadConditionsFromSubject } from "@/lib/achievement-engine"
const conditionMap = loadConditionsFromSubject(mySubject)
// Future: pass conditionMap as a parameter to checkNewUnlocks
```

The function is already exported. Wiring it into `checkNewUnlocks` as an overload is the next migration step.

### Storage

Key: `"mold_v2_achievements"`. Shape: `Achievement[]`. Swap `loadAchievements` / `saveAchievements` internals for IndexedDB without changing any call sites — the interface is intentionally async.

---

## 8. Component Catalogue

### HomeScreen

- **Owns:** `view`, `runs`, `selectedMode`, `config`, `showGallery`
- **Does NOT own:** achievements (comes from `useAchievements()`), game state
- **Key prop passing:** passes `runs` into `<GameRunner runs={runs}>` so achievement evaluation uses real history (not demo data)
- **On return from game:** calls `setRuns(loadRuns())` to refresh run history

### GameRunner

The composition root for a game session. Structure:

```
<ToastLayer>
  <div min-h-screen>
    <GameErrorBoundary onReturnHome={...}>
      {flashcards ? <FlashcardScreen> : <GameEngineProvider> → <GameRunnerInner>}
    </GameErrorBoundary>
  </div>
</ToastLayer>
```

`ToastLayer` is an internal render-prop component that keeps `useAchievementToast()` above all conditional renders (Rules of Hooks compliance).

### GameHeader

Reads `state` and `accuracyPct` from `useGameEngine()`. Displays: mode label, score/total, streak badge, global countdown or elapsed time, survival lives, accuracy, QUIT button, progress bar, question counter.

### QuestionCard

Reads `state` and `selectOption` from `useGameEngine()`. Manages per-option visual states: unselected / selected / revealed-correct / revealed-wrong / revealed-other. Shows hint panel and explanation panel conditionally.

### GameFooter

Reads `state` and dispatches `revealAnswer`, `nextQuestion`, `useHint`. SUBMIT button requires a selection; NEXT/FINISH appears after reveal; HINT button is hidden when `hintsEnabled === false`.

### ResultsScreen

Reads `state` from `useGameEngine()`. Displays grade badge, stat grid, HOME and PLAY AGAIN buttons. Accuracy is derived from answered questions (correct + wrong) to maintain consistency with the game engine's `accuracyPct`.

### FlashcardScreen

Standalone — no game engine. Manages a local `currentIndex`, `isFlipped`, `known: Set<string>` state. "Got It" / "Still Learning" controls. Shows session summary on completion.

### AchievementToastContainer

Bottom-right fixed stack. Each `AchievementToastItem` auto-dismisses after 4500ms. Animate in/out via Tailwind transition classes. Renders with `aria-live="polite"`.

### GameErrorBoundary

A React class component (required for `componentDidCatch`). Wraps `GameEngineProvider`. On error: logs to console (wire to Sentry in production), renders a "SYSTEM FAULT" panel with a "RETURN TO HOME" button that calls `this.props.onReturnHome`.

---

## 9. Data Flow: End-to-End Session

```
User selects mode + config on HomeScreen
  → handleInitialize() builds GameConfig
  → setView("game"), setActiveConfig(config)

<GameRunner config runs onReturnHome>
  → ToastLayer mounts (owns toast state)
  → GameErrorBoundary mounts (crash protection)
  → GameEngineProvider mounts (builds question pool, starts timer)
    → GameRunnerInner renders
      → GameHeader (reads state)
      → QuestionCard (reads state, dispatches SELECT_OPTION)
      → GameFooter (dispatches REVEAL_ANSWER, NEXT_QUESTION, USE_HINT)
      → [Survival only] SurvivalStressBar

User answers all questions or timer runs out
  → reducer sets phase = "complete"
  → useEffect in GameRunnerInner fires (achievementsFiredRef guard)
  → onGameComplete(state, runs) → evaluates conditions → persists → returns unlocked[]
  → showUnlocks(unlocked) → toast queue
  → ResultsScreen renders

User clicks HOME
  → onReturnHome() called
  → GameRunner unmounts (engine destroyed)
  → HomeScreen sets view = "home", calls loadRuns() to refresh run history
```

---

## 10. Persistence Layer

### Run History

- **Key:** `"mold_v2_runs"`
- **Shape:** `RunRecord[]`
- **Cap:** 50 most recent runs (enforced in `saveRuns`)
- **Hydration:** `HomeScreen.useEffect → setRuns(loadRuns())`
- **Write location:** Run records are not yet automatically saved after each game. The `onRunComplete` callback in `GameRunner` is the intended hook for this — it is called after achievement evaluation but the actual `saveRuns` call is not yet implemented. **This is the next feature to build.**

### Achievements

- **Key:** `"mold_v2_achievements"`
- **Shape:** `Achievement[]`
- **Hydration:** `AchievementProvider.useEffect → loadAchievements().then(setAchievements)`
- **Write location:** `onGameComplete` in `achievement-engine.tsx`

### Upgrade path to IndexedDB

Both `loadAchievements/saveAchievements` and `loadRuns/saveRuns` are intentionally async. Swap the implementation bodies for `idb` or native IndexedDB calls without touching any call site.

---

## 11. Connecting a Real Subject

To replace the demo question bank with a real subject:

**Step 1 — Create your subject file** matching `FullSubjectData`:

```ts
// lib/subjects/my-subject.ts
import type { FullSubjectData } from "@/lib/mold-types"
export const MY_SUBJECT: FullSubjectData = {
  id: "my-subject",
  name: "My Subject",
  config: { title: "My Subject", description: "...", storageKey: "mold_my_subject" },
  questions: [...],       // Question[]
  flashcards: [...],      // Flashcard[]
  terminology: {...},     // Terminology
  achievements: [...],    // RawAchievementDef[] — include condition fields
}
```

**Step 2 — Update `subject-store.ts`**

Replace `DEMO_FULL_SUBJECT` with an import of your subject.

**Step 3 — Update `lib/mold-types.ts` DEMO_SUBJECT**

Replace `DEMO_SUBJECT` (the simplified `SubjectData` used by `HomeScreen`) to match your subject's `id`, `name`, `description`, `totalQuestions`, and `categories`.

**Step 4 — Wire achievement conditions from subject data**

In `achievement-engine.tsx`, call `loadConditionsFromSubject(mySubject)` and use the resulting map in `checkNewUnlocks` instead of `ACHIEVEMENT_CONDITIONS`.

---

## 12. Known Seams and Production TODOs

These are explicitly acknowledged incomplete areas, not bugs:

| # | Location | Issue | Action Required |
|---|---|---|---|
| 1 | `home-screen.tsx` `handleReturnHome` | Run records are not persisted after a game — `saveRuns` is never called. | Call `saveRuns` in `onRunComplete` or in `handleReturnHome` after the game adds a new `RunRecord` to the list. |
| 2 | `game-runner.tsx` `GameRunnerInner` | No `RunRecord` is constructed and appended to the `runs` array after a session. | Build `RunRecord` from `state` in `onRunComplete`, call `onRunComplete(record)`, let `HomeScreen` append and save it. |
| 3 | `achievement-engine.tsx` `evaluateCondition` | `all_categories` condition uses run count as a proxy, not actual per-category tracking. | Extend `RunRecord` with `selectedCategory?: string` and use it in the evaluator. |
| 4 | `achievement-engine.tsx` `checkNewUnlocks` | `ACHIEVEMENT_CONDITIONS` is the demo fallback. | Call `loadConditionsFromSubject()` and pass the result into `checkNewUnlocks`. |
| 5 | `game-runner.tsx` | `DEMO_FULL_SUBJECT` is imported directly. | Accept the subject as a prop from `HomeScreen` so it can be swapped per subject. |
| 6 | Persistence | localStorage used throughout. | Swap `loadAchievements/saveAchievements` and `loadRuns/saveRuns` for IDB or server API. |
| 7 | Test coverage | Initial automated test suites exist and pass 100%. | Add further tests for remaining state transitions, custom mode logic, and edge cases. |

---

## 13. Engineering Constraints

These rules were agreed on during the code review and must be preserved:

1. **DRY — use `formatLabel()` for all slug-to-title transforms.** Do not inline `.split("-").map(...).join(" ")` anywhere.
2. **Accuracy denominator is `score + wrongAnswers`, not `currentIndex`.** The `wrongAnswers` field exists in `GameState` for this reason.
3. **`config` and `questions` props to `GameEngineProvider` must not be reassigned after mount.** The `useRef` stabilizer is load-bearing — do not remove it.
4. **`useGameEngine()` and `useAchievements()` throw if used outside their providers.** Always check the component tree before adding a consumer.
5. **`achievementsFiredRef` in `GameRunnerInner` ensures achievement evaluation fires exactly once.** Do not remove the `useRef` guard.
6. **The `ToastLayer` render-prop must remain the outermost wrapper in `GameRunner`** so `useAchievementToast()` is called before any conditional render (Rules of Hooks).
7. **All new utility functions belonging to the type/data layer go in `lib/mold-types.ts`.** Do not scatter them across component files.
8. **Never use `DEMO_RUNS` as the achievement evaluation baseline in production.** Always pass the real `runs` prop from `HomeScreen` through `GameRunner` into `onGameComplete`.
9. **SSR XSS Prevention:** Always use `isomorphic-dompurify` for HTML/question sanitization. Never fallback to raw/unsanitized HTML strings or bypass sanitization on the server-side (`typeof window === 'undefined'`).
10. **Log PII/Secret Masking Integrity:** All regex-based masking filters in `lib/logger.ts` must use declarative capture-group capture patterns to selectively redact values while preserving structural characters (like quotes, colons, commas) so logs remain valid JSON.
11. **Accessibility (A11y) First:** Purely decorative icons must have `aria-hidden="true"`. All clickable options and buttons must have clear focus rings (`focus-visible`). Dynamic empty or status text must be wrapped inside live regions (`role="status"` or `aria-live="polite"`).
12. **Strict Mermaid security Level:** Any rendering configuration for Mermaid diagrams must set `securityLevel: 'strict'` to prevent arbitrary script injections.
13. **Multi-Tenant isolated Builds:** Next.js build directories (`NEXT_DIST_DIR`) must be fully respected and cleanly separated within Docker container orchestration configs to avoid cross-tenant build collisions in multi-tenant environments.
14. **Consolidated Test Verification:** The official test execution command is:
    `pnpm test`
    Run this suite to verify structural and functional integrity before committing changes.
15. **Node.js Process & Resource Hygiene:** To prevent high CPU/Memory exhaustion (90%+ spikes due to dangling Node/compiler processes), agents MUST track every background server, dev server, or test suite spawned. Upon task conclusion, abort, or completion, agents must aggressively tear down lingering processes using force-kill compliance (`taskkill /F /T /PID <pid>` on Windows or `kill -9` on Unix).
16. **Tailwind Design Tokenization:** Avoid hardcoding arbitrary hex colors or static values inline (e.g. `bg-[#131313]`). All arbitrary values must be tokenized as CSS custom variables inside `:root` in `app/globals.css` using standard naming structures (`--tw-hex-...` for colors, `--tw-size-...` for spacing/fonts, `--tw-val-...` for general values) and referenceable via Tailwind variable patterns (e.g. `prefix-[var(--variable)]/opacity`).
17. **Responsive Sizing & Typography Overflows:** To prevent layout blowouts and text clipping on extremely long strings (such as continuous, underscore-joined names), all major headers and text blocks must scale responsively (e.g., `text-xl sm:text-2xl md:text-3xl lg:text-4xl`), utilize word breaking styles (`break-words break-all`), and be wrapped in flex flex-item boxes configured with `min-w-0 flex-1`.
18. **Next.js Compile Cache Cleansing:** Stale development server cache files and type configurations (inside the `.next` directory) must be recursively cleared (`Remove-Item -Recurse -Force .next` or `rm -rf .next`) prior to initiating production compilation (`next build` or `pnpm run build`) to prevent stale auto-generated route type collisions.
19. **React Compound Component Architectures:** Keep presentation components focused, reusable, and well under 300 lines of code. Strictly decouple state context orchestration providers from presentation layers. Avoid boolean prop proliferation by structuring complex workflows (like setups and wizards) into modular Compound Component structures.
20. **Socratic Navigation & Usability Feeds:** Reclaim visual space in headers by removing redundant links (e.g., buttons already present in the persistent sidebar). Replace them with unified navigation bars displaying the brand name `"FINALIST"` and an interactive Socratic study guidance feed (`GUIDE_FEED`) featuring rotating research-backed spaced repetition tips (Reddy et al., An et al., Kaczmarek et al.), usability hints, and project repository links.
21. **Decoupled Auto-Fix Architecture:** The automated JSON parser recovery engine (`autoFixSubjectData`) must remain strictly decoupled from the core validation logic (`validateSubjectData`). Validation checks must verify raw schemas strictly without mutations to preserve unit-testing assertion integrity. All auto-fixes must reside exclusively in the import/parse layer.
22. **Graceful Parse Degradation:** Automated fixes should silently map option-answer mismatches, normalize true/false boolean text to label indicators (`"A"`/`"B"`), resolve duplicate question IDs with indexing, and seed default collections and config elements. An orange warnings log must detail all recovery adjustments in the importer diagnostics screen.
23. **Generic JSON Bypass**: Ensure that any parsing recovery scripts inspect raw objects for specific subject keys (`hasSignature`) before applying recovery changes, preventing side effects on generic configuration payloads or sharing metadata.
24. **Package Manager Selection (PNPM Only)**: Under no circumstances should `npm`, `yarn`, or `bun` be invoked for managing dependencies, executing scripts, or building the project. Always use `pnpm` exclusively (e.g., `pnpm install`, `pnpm test`, `pnpm run build`, `pnpm dev`). `package-lock.json` is banned from the repository; `pnpm-lock.yaml` is the sole canonical lockfile. The project enforces `"preinstall": "npx only-allow pnpm"` and uses `vercel.json` with `"installCommand": "pnpm install --no-frozen-lockfile"` to guarantee resilient CI deployments.
25. **Terminal Command Chaining (Semicolon Rule)**: To ensure cross-platform safety (especially when running scripts on Windows hosts under PowerShell/CMD), never chain terminal shell commands with double-ampersands (`&&`). Always use semicolons (`;`) to separate commands or run them as independent process executions.
26. **Automated Documentation Self-Annealing Rule**: To keep project documentation and constraints unified, accurate, and completely synchronized, agents MUST auto-invoke the [Self-Annealing Workflow (self_annealing)](file:///d:/Study/Programming/Projects/finalsv2/finals-qb/.agent/workflows/self_annealing.md) every five turns. This ensures constraints are matched with code and obsolete rules are automatically pruned.

---

## 14. Available Workflows & Skills

Standardized, recurring recipes, workflows, and execution protocols are available for future agents in the `.agent` directory:

1. **[Pull Request Triage, Release Orchestration, and Session Cleanup (Workflow)](file:///d:/Study/Programming/Projects/finalsv2/finals-qb/.agent/workflows/pr_triage_release_cleanup.md):** 
   - **Trigger:** Large-scale git branch/PR consolidation, conflicting test-suite resolution, Vercel UI blocks, or remote jules session cleanups.
   - **Prerequisites:** Administrative push privileges, CLI access to git and jules, Node.js.
2. **[PR Triage, Release Orchestration, and Session Cleanup (Skill)](file:///d:/Study/Programming/Projects/finalsv2/finals-qb/.agent/skills/pr-triage-release-cleanup.md):**
   - **Trigger:** When requested to act as an automated triage, merge, or cleanup agent for git branches, Vercel deployment issues, and jules CLI remote sessions.
   - **Prerequisites:** Git write permissions, `jules` CLI, Node.js, `test-runner.mjs`.
3. **[Self-Annealing Documentation and Rules (Workflow)](file:///d:/Study/Programming/Projects/finalsv2/finals-qb/.agent/workflows/self_annealing.md):**
   - **Trigger:** Required automatically every five conversation turns (Rule 26) to scan, reconcile, and sync codebase configuration rules and constraint documentation.
   - **Prerequisites:** Codebase access to `AGENTS.md`, `pnpm` package manager.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
