# finals-qb

A dark-first, game-like educational quiz platform built with Next.js, TypeScript, Tailwind CSS, and a custom “Mastery Protocol” game system.

Live app: ([HERE](https://finals-qb.vercel.app))

## Overview

`finals-qb` is a quiz and revision platform focused on making question practice feel like an interactive game session rather than a static test bank. The project includes:
- multiple quiz/game modes
- a session-based game engine
- achievements and progression
- flashcards and terminology review
- local persistence for runs and unlocks
- a dark neo-brutalist UI system

The repository is primarily TypeScript, with supporting CSS and small amounts of JavaScript and shell. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- localStorage-based persistence
- Geist fonts

The repo includes standard Next/Tailwind project files such as `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `tsconfig.json`, and `components.json`. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

## Repository Structure

Top-level folders and key files include: ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

```text
app/                  # App Router pages, layout, globals
components/           # UI and feature components
docs/                 # Project docs
lib/                  # Types, engines, stores, utilities
public/               # Static assets
scripts/              # Utility scripts
styles/               # Styling support

AGENTS.md             # Agent/source-of-truth project documentation
DEVELOPER_GUIDE.md    # Developer-facing guide
README.md             # Repository overview
package.json          # Scripts and dependencies
docker-compose.yml    # Container/dev setup
test-runner.mjs       # Test runner entry
proxy.ts              # Project proxy/middleware-related entry
```

## Core Product Areas

Based on the project structure and internal documentation, the app is organized around:
- a home/setup flow
- a game session runner
- question answering modes
- flashcard review
- achievements
- run history and performance tracking
- subject-driven content loading

The codebase includes dedicated `app`, `components`, and `lib` layers, plus internal documentation intended to guide contributors and agents. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

## Getting Started

### Prerequisites

Use one of:
- Node.js 18+
- npm or pnpm

### Install

```bash
npm install
```

or

```bash
pnpm install
```

### Run locally

```bash
npm run dev
```

or

```bash
pnpm dev
```

Then open:

```text
http://localhost:3000
```

## Available Files You Should Read First

If you are contributing, read these before making changes:
- `AGENTS.md`
- `DEVELOPER_GUIDE.md`
- `lib/` shared types and engine files
- `components/` feature entry points

These files are present in the repo root and are intended to document architecture and contribution expectations. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

## Development Notes

This project appears to be structured for:
- App Router-based UI organization under `app/`
- component-driven feature development under `components/`
- shared logic and state in `lib/`
- project documentation in `docs/` and root markdown files

Because the app includes both `package-lock.json` and `pnpm-lock.yaml`, use one package manager consistently in your local workflow. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

## Running with Docker

A `docker-compose.yml` file is included in the repository. If your team uses Docker-based development, you can adapt your workflow around that file. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

## Deployment

The repository links to a deployed app on Vercel. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make focused changes
4. Test locally
5. Open a pull request

The repository currently has pull requests enabled and is publicly accessible on GitHub. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

## Notes

- The repo is public. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))
- The main branch is `main`. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))
- The project includes extensive internal guidance files for contributors. ([github.com](https://github.com/AhmedNasser-bug/finals-qb))

## License

Add your project license here if you want distribution terms to be explicit.



# Architecture Diagrams

## Overview

The finals-qb architecture consists of these major sections:

1. **App Router & Entry Point** — Next.js pages and root layout
2. **Provider Layer** — Global state contexts
3. **Home Screen Flow** — Mode selection and setup
4. **Game Session Flow** — Active game play and interaction
5. **State Management** — React state and context consumers
6. **Engine & Logic** — Game engine and achievement evaluator
7. **Data & Types** — Centralized type system and data store
8. **Persistence** — localStorage and async interface
9. **UI System** — Design tokens, Tailwind, shadcn/ui
10. **Session Complete Flow** — End-to-end game completion
11. **Achievement Unlock Flow** — Achievement evaluation and notification

---

## 1. App Router & Entry Point

```mermaid
graph TD
    Browser["🌐 Browser"]
    Browser --> Root["app/layout.tsx<br/>Root Layout<br/>Geist Fonts<br/>Global CSS"]
    Root --> Providers["AchievementProvider<br/>ThemeProvider<br/>Other Wrappers"]
    Providers --> HomePage["app/page.tsx<br/>Home Page<br/>Route: /"]
    HomePage --> HomeScreen["HomeScreen Component<br/>Entry Point to App"]
```

---

## 2. Provider Layer

```mermaid
graph TD
    RootLayout["app/layout.tsx<br/>Root Level"]
    
    RootLayout --> Achievement["AchievementProvider<br/>Scope: Global<br/>Lifespan: Root to Unmount<br/>---<br/>State:<br/>- achievements[]<br/>- unlockedAt timestamps<br/>---<br/>Methods:<br/>- loadAchievements<br/>- saveAchievements<br/>- onGameComplete"]
    
    RootLayout --> Theme["ThemeProvider<br/>Dark Theme Setup<br/>CSS Variables"]
    
    HomeScreen["HomeScreen Component<br/>Scope: Home View Only"]
    HomeScreen --> GameRunnerComponent["GameRunner Component<br/>Only Mounted During Game"]
    
    GameRunnerComponent --> GameEngine["GameEngineProvider<br/>Scope: During Active Game<br/>Lifespan: Mount to Return Home<br/>---<br/>State:<br/>- currentIndex<br/>- selectedOption<br/>- score<br/>- streak<br/>- lives<br/>- phase<br/>---<br/>Actions:<br/>- SELECT_OPTION<br/>- REVEAL_ANSWER<br/>- NEXT_QUESTION<br/>- TICK<br/>- FORFEIT"]
    
    GameRunnerComponent --> Toast["ToastLayer<br/>Render-Prop Pattern<br/>---<br/>For Achievement Notifications<br/>For Error Messages"]
    
    GameRunnerComponent --> ErrorBoundary["GameErrorBoundary<br/>Class Component<br/>Catches Engine Crashes"]
```

---

## 3. Home Screen Flow

```mermaid
graph TD
    HomeScreen["HomeScreen.tsx<br/>View Router<br/>---<br/>State:<br/>- view: home or game<br/>- runs: RunRecord[]<br/>- selectedMode<br/>- config: SetupConfig"]
    
    HomeScreen --> HeroHeader["hero-header.tsx<br/>---<br/>Subject Title<br/>Description<br/>Progress Bar<br/>Trophy Counter"]
    
    HomeScreen --> ModeSelector["mode-selector.tsx<br/>---<br/>7 Game Mode Cards<br/>- Speedrun<br/>- Blitz<br/>- Hardcore<br/>- Survival<br/>- Practice<br/>- Full Revision<br/>- Flashcards"]
    
    HomeScreen --> SetupPanel["setup-panel.tsx<br/>---<br/>Time Limit Toggle<br/>Hints Toggle<br/>Question Count Input<br/>Category Grid Filter"]
    
    HomeScreen --> PerformanceTable["performance-table.tsx<br/>---<br/>Aggregate Stats Strip<br/>- Avg Score<br/>- Best Streak<br/>- Total Runs<br/>- Win Rate<br/>---<br/>Recent Runs Table<br/>- Date<br/>- Grade<br/>- Score<br/>- Streak"]
    
    HomeScreen --> ActionHub["action-hub.tsx<br/>---<br/>Encyclopedia Button<br/>Initialize Game Button"]
    
    ActionHub --> Initialize["handleInitialize<br/>---<br/>Builds GameConfig<br/>Sets view = game<br/>Mounts GameRunner"]
```

---

## 4. Game Session Flow

```mermaid
graph TD
    GameRunner["GameRunner.tsx<br/>Composition Root"]
    
    GameRunner --> GameEngineProvider["GameEngineProvider<br/>---<br/>Builds Question Pool<br/>Initializes State<br/>Starts Timer"]
    
    GameEngineProvider --> GameRunnerInner["GameRunnerInner.tsx<br/>---<br/>Coordinates Game Flow<br/>Fires Achievement Eval<br/>Renders Screens"]
    
    GameRunnerInner --> GameHeader["game-header.tsx<br/>---<br/>Score / Total<br/>Streak Badge<br/>Timer<br/>Accuracy %<br/>Lives Remaining<br/>Progress Bar<br/>QUIT Button"]
    
    GameRunnerInner --> QuestionDisplay["Question Display<br/>Branch by Mode"]
    
    QuestionDisplay -->|Flashcards Mode| FlashcardScreen["flashcard-screen.tsx<br/>---<br/>Flip Animation<br/>Got It Button<br/>Still Learning Button<br/>Session Summary"]
    
    QuestionDisplay -->|All Other Modes| QuestionCard["question-card.tsx<br/>---<br/>Question Text HTML<br/>Diagram Container<br/>Mermaid Renderer<br/>Hint Panel<br/>Explanation Panel<br/>---<br/>Option Buttons<br/>SUBMIT / NEXT / HINT"]
    
    QuestionCard --> MermaidDiagram["mermaid-diagram.tsx<br/>---<br/>Render Mermaid Code<br/>Error Handling<br/>SVG Cleanup<br/>Timeout Protection"]
    
    GameRunnerInner --> GameFooter["game-footer.tsx<br/>---<br/>SUBMIT Button<br/>NEXT Button<br/>HINT Button<br/>Button State Logic"]
    
    GameRunnerInner --> ResultsScreen["results-screen.tsx<br/>---<br/>Grade Badge<br/>Stats Grid<br/>- Accuracy<br/>- Time Taken<br/>- Streak<br/>- Best Streak<br/>---<br/>HOME Button<br/>PLAY AGAIN Button"]
```

---

## 5. State Management

```mermaid
graph TD
    Achievement["AchievementProvider<br/>at root/layout"]
    Achievement --> AchievementHook["useAchievements<br/>---<br/>Returns:<br/>- achievements[]<br/>- onGameComplete<br/>- reset"]
    
    AchievementHook --> AchievementConsumer["Consumed By:<br/>- AchievementGallery<br/>- GameRunnerInner<br/>- AchievementToast"]
    
    GameEngine["GameEngineProvider<br/>at GameRunner during game"]
    GameEngine --> GameEngineHook["useGameEngine<br/>---<br/>Returns:<br/>- state: GameState<br/>- dispatch actions:<br/>  selectOption<br/>  revealAnswer<br/>  nextQuestion<br/>  useHint<br/>  forfeit"]
    
    GameEngineHook --> GameEngineConsumer["Consumed By:<br/>- GameHeader<br/>- QuestionCard<br/>- GameFooter<br/>- ResultsScreen"]
    
    HomeScreen["HomeScreen<br/>Local useState<br/>---<br/>- view<br/>- runs<br/>- selectedMode<br/>- config<br/>- showGallery"]
    
    HomeScreen --> LoadRuns["loadRuns<br/>from localStorage"]
    HomeScreen --> SaveRuns["saveRuns<br/>to localStorage"]
```

---

## 6. Engine & Logic Layer

```mermaid
graph TD
    GameEngine["game-engine.tsx<br/>GameEngineProvider + useGameEngine"]
    
    GameEngine --> BuildPool["buildQuestionPool<br/>---<br/>Input:<br/>- questions[]<br/>- mode<br/>- config<br/>---<br/>Output:<br/>- shuffled questions<br/>- filtered by mode<br/>- sliced to count"]
    
    GameEngine --> InitState["buildInitialState<br/>---<br/>Creates GameState:<br/>- currentIndex = 0<br/>- selectedOption = null<br/>- score = 0<br/>- wrongAnswers = 0<br/>- streak = 0<br/>- bestStreak = 0<br/>- phase = playing<br/>- elapsedSeconds = 0"]
    
    GameEngine --> Reducer["Reducer<br/>---<br/>Actions:<br/>- SELECT_OPTION<br/>- REVEAL_ANSWER<br/>- NEXT_QUESTION<br/>- TICK<br/>- USE_HINT<br/>- FORFEIT"]
    
    GameEngine --> Timer["Timer / useEffect<br/>---<br/>Fires TICK every 1s<br/>Decrements globalTimeRemaining<br/>Updates phase if time runs out"]
    
    AchievementEngine["achievement-engine.tsx<br/>AchievementProvider + useAchievements"]
    
    AchievementEngine --> EvalCondition["evaluateCondition<br/>---<br/>Types:<br/>- accuracy_gte<br/>- streak_gte<br/>- mode_complete<br/>- speedrun_under<br/>- no_hints<br/>- runs_gte<br/>- all_categories<br/>- all_unlocked"]
    
    AchievementEngine --> CheckUnlocks["checkNewUnlocks<br/>---<br/>Input:<br/>- current achievements<br/>- game state<br/>- all runs<br/>---<br/>Output:<br/>- newly unlocked"]
    
    AchievementEngine --> Persist["Persistence<br/>---<br/>loadAchievements()<br/>saveAchievements()"]
```

---

## 7. Data & Types

```mermaid
graph TD
    MoldTypes["lib/mold-types.ts<br/>Single Source of Truth"]
    
    MoldTypes --> Question["Question Interface<br/>---<br/>- id<br/>- type: MCQ or TrueFalse<br/>- difficulty<br/>- category<br/>- question<br/>- questionHTML optional<br/>- options[]<br/>- answer<br/>- explanation<br/>- hint<br/>- diagram optional"]
    
    MoldTypes --> RunRecord["RunRecord Interface<br/>---<br/>- id<br/>- date<br/>- mode<br/>- score<br/>- correctAnswers<br/>- totalQuestions<br/>- timeTaken<br/>- streak<br/>- grade: LetterGrade"]
    
    MoldTypes --> Achievement["Achievement Interface<br/>---<br/>- id<br/>- name<br/>- description<br/>- icon<br/>- conditions[]<br/>- unlockedAt optional"]
    
    MoldTypes --> FullSubjectData["FullSubjectData<br/>---<br/>- id<br/>- name<br/>- config<br/>- questions[]<br/>- flashcards[]<br/>- terminology<br/>- achievements[]"]
    
    MoldTypes --> Utilities["Utility Functions<br/>---<br/>- calculateGrade<br/>- gradeColor<br/>- formatTime<br/>- formatDate<br/>- modeLabel<br/>- formatLabel<br/>- computeAggregateStats"]
    
    SubjectStore["lib/subject-store.ts"]
    SubjectStore --> DemoData["DEMO_FULL_SUBJECT<br/>- 20 Questions<br/>- 10 Flashcards<br/>- Terminology<br/>- Demo Achievements"]
```

---

## 8. Persistence Layer

```mermaid
graph TD
    Interface["Async Interface<br/>All Functions are async"]
    
    Interface --> LoadRuns["loadRuns<br/>---<br/>Loads from localStorage<br/>Key: mold_v2_runs<br/>Returns: RunRecord[]"]
    
    Interface --> SaveRuns["saveRuns<br/>---<br/>Saves to localStorage<br/>Key: mold_v2_runs<br/>Cap: 50 recent runs"]
    
    Interface --> LoadAchievements["loadAchievements<br/>---<br/>Loads from localStorage<br/>Key: mold_v2_achievements<br/>Returns: Achievement[]"]
    
    Interface --> SaveAchievements["saveAchievements<br/>---<br/>Saves to localStorage<br/>Key: mold_v2_achievements<br/>Stamps unlockedAt"]
    
    Interface --> MigrationPath["Future Migration<br/>---<br/>Swap internals for:<br/>- IndexedDB<br/>- Server API<br/>- No call sites change"]
    
    Storage["localStorage<br/>Client-side browser storage"]
    
    LoadRuns --> Storage
    SaveRuns --> Storage
    LoadAchievements --> Storage
    SaveAchievements --> Storage
```

---

## 9. UI System

```mermaid
graph TD
    Tokens["Design Tokens<br/>CSS Custom Properties<br/>app/globals.css"]
    
    Tokens --> Colors["Colors<br/>---<br/>--background: stone-950<br/>--foreground: stone-100<br/>--primary: amber-500<br/>--panel: stone-800<br/>--border: stone-700<br/>--destructive: red-600<br/>--muted-foreground: stone-600"]
    
    Tokens --> Typography["Typography<br/>---<br/>--radius: 0.25rem<br/>Geist Sans: body text<br/>Geist Mono: labels/numbers"]
    
    Tokens --> Animations["Animations<br/>---<br/>animate-fade-in<br/>animate-slide-up<br/>animate-pulse-glow<br/>scanlines overlay"]
    
    Tailwind["Tailwind CSS<br/>Configuration"]
    
    Tailwind --> Grid["Grid & Layout<br/>grid, flex, gap<br/>Responsive sizes"]
    
    Tailwind --> Spacing["Spacing & Sizing<br/>Responsive padding<br/>max-width utilities"]
    
    Tailwind --> Responsive["Responsive Breakpoints<br/>md: tablet<br/>lg: desktop<br/>xl: large desktop"]
    
    ShadcnUI["shadcn/ui Components<br/>Headless UI primitives"]
    
    ShadcnUI --> Button["Button.tsx<br/>Unstyled base<br/>Styled with Tailwind"]
    
    ShadcnUI --> Card["Card.tsx<br/>Unstyled base<br/>Styled with Tailwind"]
    
    ShadcnUI --> Input["Input.tsx<br/>Text input<br/>Styled with Tailwind"]
    
    Tokens --> Tailwind
    Tailwind --> ShadcnUI
    
    ShadcnUI --> Components["Consumed By<br/>All components<br/>HomeScreen<br/>GameRunner<br/>QuestionCard<br/>etc"]
```

---

## 10. Session Complete Flow

```mermaid
graph TD
    Start["Player Answers All Questions"]
    Start --> CheckPhase["Check: phase === complete"]
    CheckPhase --> OnComplete["onGameComplete fires<br/>Guarded by useRef<br/>Fires exactly once"]
    
    OnComplete --> BuildRecord["Build RunRecord<br/>- id<br/>- date<br/>- mode<br/>- score<br/>- streak<br/>- grade"]
    
    BuildRecord --> AchievementEval["Achievement Evaluation<br/>onGameComplete<br/>state, runs passed in"]
    
    AchievementEval --> CheckUnlocks["checkNewUnlocks<br/>Evaluate conditions<br/>Find new unlocks"]
    
    CheckUnlocks --> Persist["saveAchievements<br/>Stamp unlockedAt<br/>Write to localStorage"]
    
    Persist --> Toast["showUnlocks<br/>Queue toast notifications<br/>AchievementToast renders"]
    
    Toast --> ResultsScreen["ResultsScreen<br/>Shows grade<br/>Shows stats<br/>HOME or PLAY AGAIN"]
    
    ResultsScreen --> HomeClick["Player clicks HOME"]
    HomeClick --> ReturnHome["onReturnHome<br/>GameRunner unmounts<br/>GameEngineProvider destroyed"]
    
    ReturnHome --> Refresh["loadRuns<br/>Refresh run history<br/>HomeScreen state updated"]
    
    Refresh --> End["Return to Home View"]
```

---

## 11. Achievement Unlock Flow

```mermaid
graph TD
    Complete["Game Completes<br/>phase = complete"]
    
    Complete --> FireOnce["onGameComplete<br/>Fires exactly once<br/>Ref guard: achievementsFiredRef"]
    
    FireOnce --> LoadCurrent["Load current achievements<br/>From localStorage<br/>Key: mold_v2_achievements"]
    
    LoadCurrent --> PassParams["Pass to checkNewUnlocks<br/>- current: Achievement[]<br/>- state: GameState<br/>- allRuns: RunRecord[]"]
    
    PassParams --> EvaluateAll["Evaluate all conditions<br/>For each condition type<br/>- accuracy_gte<br/>- streak_gte<br/>- mode_complete<br/>- speedrun_under<br/>- no_hints<br/>- runs_gte<br/>- all_categories<br/>- all_unlocked"]
    
    EvaluateAll --> FindNew["Find newly unlocked<br/>Before: achievement not in current<br/>After: condition passes now"]
    
    FindNew --> StampTime["Stamp unlockedAt<br/>Achievement.unlockedAt = now"]
    
    StampTime --> SaveBack["saveAchievements<br/>Write back to localStorage<br/>Persisted array with timestamps"]
    
    SaveBack --> UpdateState["useAchievements<br/>React state updates<br/>achievements[] changes"]
    
    UpdateState --> QueueToast["showUnlocks<br/>useAchievementToast<br/>Queue for render"]
    
    QueueToast --> RenderToast["AchievementToastContainer<br/>Renders stack<br/>Each toast auto-dismisses 4.5s"]
    
    RenderToast --> Done["Toast fades<br/>User sees unlock notification"]
```

---

## Connections Summary

All three levels connect like:

```
Providers (global state)
  ↓
Components (consume with hooks)
  ↓
Engines (game-engine, achievement-engine)
  ↓
Data Layer (mold-types, subject-store)
  ↓
Persistence (localStorage + async interface)
  ↓
UI System (tokens, tailwind, shadcn/ui)
```

---

## Architecture Narrative

### Layer 1: Entry & Routing
- **`app/layout.tsx`** — Root provider wrapper, global styles, Geist font setup
- **`app/page.tsx`** — Mounts `<HomeScreen />`

### Layer 2: State Management
Three independent provider contexts:
- **`AchievementProvider`** — Persisted achievements, unlock evaluation, global scope
- **`GameEngineProvider`** — Ephemeral game state, question pool, timer; scoped to active session
- **`HomeScreen`** — Local state for view, runs, mode selection, config

### Layer 3: Component Hierarchy
- **Home view** — mode selector, setup panel, performance table, hero header
- **Game view** — GameRunner wraps GameEngineProvider → GameRunnerInner → header/card/footer
- **Modals** — Achievement gallery, toast notifications, error boundary
- **Specialized** — Flashcard screen (no engine), Mermaid diagram renderer (with error handling)

### Layer 4: Game Logic
- **`game-engine.tsx`** — Question pool builder, state reducer, turn-based flow, timer tick
- **`achievement-engine.tsx`** — Condition evaluator, unlock checker, localStorage sync

### Layer 5: Data & Types
- **`lib/mold-types.ts`** — Single source of truth for all types, utility functions, game mode registry
- **`lib/subject-store.ts`** — Demo question bank, flashcards, terminology, achievements

### Layer 6: Persistence
- **localStorage** — Async interface ready for IndexedDB/server migration
- **Keys**: `mold_v2_runs`, `mold_v2_achievements`

### Layer 7: UI System
- **Design tokens** — CSS custom properties (dark, amber primary, neo-brutalist)
- **shadcn/ui** — Button, Card, Input, Dialog primitives
- **Tailwind CSS** — Layout, spacing, animations, responsive design

### Layer 8: External
- **Next.js 16 + React 19** — App Router, server/client boundaries
- **Mermaid.js** — Diagram rendering with error handling
- **Geist** — Typography (Mono for labels, Sans for body)

---

## Session Flow

```
HomeScreen (select mode + config)
  ↓
handleInitialize()
  ↓
GameRunner mounts with config + questions
  ↓
GameEngineProvider builds initial state + timer starts
  ↓
GameRunnerInner renders GameHeader/QuestionCard/GameFooter
  ↓
Player selects option → SELECT_OPTION action
  ↓
QuestionCard highlights selection
  ↓
Player presses SUBMIT → REVEAL_ANSWER action
  ↓
reducer updates score/streak/wrongAnswers
  ↓
Player presses NEXT or FORFEIT
  ↓
currentIndex advances or phase → "complete"
  ↓
ResultsScreen renders with grade
  ↓
Player clicks HOME → onReturnHome()
  ↓
GameRunner unmounts → GameEngineProvider destroyed
  ↓
HomeScreen calls loadRuns() to refresh history
```

---

## Achievement Evaluation Flow

```
Player completes game session
  ↓
onGameComplete(state, runs) fires exactly once via ref guard
  ↓
achievement-engine loads current achievements from localStorage
  ↓
checkNewUnlocks(current, state, allRuns) evaluates conditions
  ↓
Finds newly unlocked achievements
  ↓
Stamps unlockedAt timestamp
  ↓
saveAchievements() persists back to storage
  ↓
useAchievements React state updates
  ↓
showUnlocks(newAchievements) queues toast notifications
  ↓
AchievementToast renders in fixed stack with auto-dismiss
```

---

## Key Architectural Rules

1. **`GameEngineProvider` is ephemeral** — mounted per session, destroyed on return home
2. **`AchievementProvider` is persistent** — root-level, survives navigation
3. **All types centralized** — `lib/mold-types.ts` is the source of truth
4. **Accuracy denominator is `score + wrongAnswers`** — not `currentIndex`
5. **Achievement evaluation fires exactly once** — guarded by `useRef`
6. **Toast layer wraps everything** — `ToastLayer` render-prop keeps hooks above conditionals
7. **Mermaid diagrams are optional** — questions without `diagram` render normally
8. **localStorage interface is async** — ready for IndexedDB/server migration
