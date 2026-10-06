# Cross-Module Architectural Traceability Manual

## Overview
This manual maps component interactions across frontend client apps, backend services, and cloud infra targets. It documents interface properties and data pipelines to create a clear guide for cross-layer development.

## 1. System Topology
The system architecture operates primarily offline-first with an active React context-based state management layer.

- **Client App UI**:
  - `HomeScreen`: Root navigation and entry point.
  - `GameRunner` / `GameRunnerInner`: The core shell and core game screen.
  - `AddQuestionsWizard`: Interface for Socratic AI generation of quiz questions.
  - `CheatSheetTerminal`: Secondary interactive UI for game assistance.

- **Client State Providers**:
  - `GameEngineProvider`: Active quiz state context.
  - `AchievementProvider`: Achievement tracking context.
  - `StatsProvider`: Player statistics context.
  - `ActiveSubjectStore`: State store for currently active study subject.

- **Persistence APIs**:
  - Browser LocalStorage / IndexedDB for offline data storage.
  - `isomorphic-dompurify` for data sanitization from external/pasted inputs.

- **External Integrations**:
  - External LLMs (Gemini/Claude/GPT) via user-driven copy-paste workflows.

## 2. Data Flow Pipelines
The data flow is centralized around processing raw subject data into active game states and persisting outcomes.

1. **Ingestion**: Raw JSON pasted into `AddQuestionsWizard` -> Validated via Zod Schema.
2. **Sanitization**: Valid JSON runs through `isomorphic-dompurify`.
3. **Storage**: Sanitized data saved to local persistence (`DB_Store`).
4. **Execution**: `ActiveSubjectStore` loads subject -> `GameEngine` builds state.
5. **Evaluation**: Player answers determine state transitions:
   - Correct: `StreakIncrement` triggered.
   - Incorrect/Hint: Logged to `StudyDeck` (Cheat Sheet).
6. **Completion**: Run metrics persisted to local storage; `AchievementEval` triggers unlock toasts asynchronously.

## 3. Dependency Graph Core Hubs
- `lib/types/mold-types.ts`: Central type definitions for MCQs, GamePhase, GameState.
- `lib/game/game-engine.tsx`: Core logic engine for phase updates.
- `lib/achievement/achievement-engine.tsx`: Core achievement unlocking logic.
- `lib/utils/logger.ts`: Centralized logging utility to ensure PII masking.

*Note: Ensure all UI components interact with the backend/persistence layers exclusively through established Context Providers (e.g., GameEngineProvider).*
