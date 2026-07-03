# Pipeline Traceability

This document tracks local and remote data pipelines.

## State and Persistence

- **LocalStorage Wrapper (`lib/utils/user-storage.ts`)**:
  - Handles stringification and parsing of user runs, unlocked achievements, and active modules.
- **Active Subject Store (`lib/subject/active-subject-store.ts`)**:
  - In-memory orchestration layer that syncs user actions with long-term storage logic.
- **Game Stats Pipeline**:
  - `components/mold/game/` -> Context/Engines -> Persistence Store -> Real-time UI updates (e.g. `stats-screen.tsx`).

The pipeline uses strict interfaces to guarantee safe cross-layer state updates without relying on a full backend database.
