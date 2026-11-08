# 3. Data Pipelines

This document maps the data pipelines mapping memory state to storage.

### Data Persistence Pipeline
`lib/subject/subject-persistence.ts` operates as the primary data pipeline bridging active memory and browser storage constraints.
- `validateSubjectData(raw: unknown)`: Secures inbound JSON parsing constraints, avoiding schema mismatch.
- `loadSubjects()` and `saveSubjects()`: Interfacing points with Next.js environment mapping directly to local persistence layers.

### Game State Reducer Pipeline
Within `lib/game/game-engine.tsx`, state mutations operate within a unidirectional data flow. Actions such as answer selections trigger state shifts that are then broadcasted back up to listeners mapped via `useGameEngine`.

## Persistence Sequence

```mermaid
sequenceDiagram
    participant User
    participant Component
    participant GameEngine
    participant SubjectStore
    participant LocalStorage

    User->>Component: Answers Question
    Component->>GameEngine: Dispatch SELECT_OPTION
    GameEngine-->>Component: Update GameState (re-render)

    User->>Component: Submits Answer
    Component->>GameEngine: Dispatch REVEAL_ANSWER
    GameEngine-->>Component: Update GameState (score/streak)

    User->>Component: Finishes Session
    Component->>GameEngine: Complete Phase
    GameEngine->>LocalStorage: Save RunRecord
    GameEngine->>LocalStorage: Update Achievements

    User->>Component: Imports Subject
    Component->>SubjectStore: Add Subject
    SubjectStore->>SubjectStore: validateSubjectData()
    SubjectStore->>LocalStorage: saveSubjects()
```
