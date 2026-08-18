# Cross-Module Architectural Traceability Manual

### 1. Frontend Client Apps (Next.js Components)
-   **Subject Management (`components/mold/subject/*`)**:
    -   `subject-importer.tsx`: Client component orchestrator handling URL imports.
    -   `subject-selector.tsx`: Client component for list and selection interface.
-   **Game Interface (`components/mold/game/*`)**:
    -   `game-runner.tsx`: Client component that orchestrates session state and run execution, wraps other game components like `game-header`, `question-card`, and `game-footer`.

### 2. Backend Services & Stores
-   **Active Subject Store (`lib/subject/active-subject-store.ts`)**:
    -   Lightweight sessionStorage bridge used to pass a selected subject from the `/subjects` page to the root page.
-   **Game Logic (`lib/game/*`)**:
    -   `game-engine.tsx`: Provides the core `GameEngineProvider` logic via React context and a reducer for state transitions.
    -   `stats-utils.ts`: Utility for stats logic calculations.
    -   `streak-utils.ts`: Utility for streak logic calculations.
    -   `streak-shield-logic.ts`: Utility for streak shields evaluation.

### 3. Cloud Infra Targets & Bootstrapping
-   **Multi-Tenant Setup**:
    -   `docker-compose.yml`: Defines local development services via Docker containers.
    -   `scripts/setup/*`: Shell scripts for dependencies, environment, mock seeding, and Docker container initialization.

### 4. Interface Properties & Data Pipelines (from `lib/types/mold-types.ts`)
-   **`FullSubjectData`**: Core data structure representing a complete subject quiz pack (`id`, `name`, `config`, `questions`).
-   **`GameState`**: Encapsulates the live progression (`phase`, `mode`, `questions`, `currentIndex`, `score`, `streak`, `wrongAnswers`).
-   **`RunRecord`**: Represents historical run completions (`id`, `date`, `mode`, `score`, `correctAnswers`, `totalQuestions`, `timeTaken`, `streak`, `grade`).
-   **`Question`**: The granular data model for a single interactable quiz node (`id`, `type`, `difficulty`, `category`, `question`, `options`, `answer`, `explanation`, `hint`, etc.).
