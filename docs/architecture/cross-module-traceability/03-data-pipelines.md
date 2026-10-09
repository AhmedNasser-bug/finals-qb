### Data Persistence Pipeline
`lib/subject/subject-persistence.ts` operates as the primary data pipeline bridging active memory and browser storage constraints.
- **Subject Persistence**: Changes to subjects pass through memory stores (like `subject-store.ts`) down to localized disk or `localStorage`.
- `validateSubjectData(raw: unknown)`: Secures inbound JSON parsing constraints via `Zod`, ensuring schema matching before storage.
- `loadSubjects()` and `saveSubjects()`: The primary entry/exit points that map component state to browser persistence. Uses a `debounce` layer to prevent excessive I/O writes.

### Game State Reducer Pipeline
Within `lib/game-engine.tsx`, state mutations operate within a unidirectional data flow.
- **Action Dispatch**: Components invoke dispatched actions (e.g., `SELECT_OPTION`, `NEXT_QUESTION`).
- **Reducer State Transition**: The reducer handles business logic (e.g. updating `score`, advancing `currentIndex`, managing `timer`), returning a strict immutable new `GameState`.
- **Reactivity & Broadcast**: Modifying state bubbles upward causing `useGameEngine` consumers to re-render.
