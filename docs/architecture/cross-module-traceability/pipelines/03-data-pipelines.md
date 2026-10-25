### Data Persistence Pipeline
`lib/subject/subject-persistence.ts` operates as the primary data pipeline bridging active memory and browser storage constraints.
- `validateSubjectData(raw: unknown)`: Secures inbound JSON parsing constraints, avoiding schema mismatch.
- `loadSubjects()` and `saveSubjects()`: Interfacing points with Next.js environment mapping directly to local persistence layers.

### Game State Reducer Pipeline
Within `lib/game-engine.tsx`, state mutations operate within a unidirectional data flow. Actions such as answer selections trigger state shifts that are then broadcasted back up to listeners mapped via `useGameEngine`.

### Achievement and Telemetry Pipeline
- **Achievement Engine Pipeline**: `lib/achievement-engine.tsx` monitors completed game sessions, evaluating `GameState` against `AchievementCondition` sets, and seamlessly sinking unlocked achievements to local storage.
- **Telemetry Pipeline**: `lighthouse-service` collects client-side performance metrics which are aggregated and displayed within the `Analytics Dashboard`.
