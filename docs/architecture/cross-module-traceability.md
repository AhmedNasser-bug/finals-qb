### **Cross-Module Architectural Traceability Manual**

#### **1. Frontend Client Apps to Backend Services**
- **Component**: `<HomeScreen />`
  - **Interface**: Interacts with `RunRecord` logic upon run completion (as per `AGENTS.md`).
  - **Data Pipeline**: Uses async calls `loadRuns()` and `saveRuns()` from `lib/utils/user-storage.ts` to manage historical records in `lib/game/stats-context.tsx`.
- **Component**: `<GameRunner />`
  - **Interface**: Wrapped by `GameEngineProvider` (`lib/game/game-engine.tsx`) and consumes context from `AchievementProvider` (`lib/achievement/achievement-engine.tsx`).
  - **Data Pipeline**: Calls `onGameComplete` from `useAchievements` when a run finishes, passing the current `GameState` and history of `RunRecord`s.

#### **2. Backend Services to Cloud Infra Targets**
- **Service**: LocalStorage Sync / Persistence Layer
  - **Interface**: Uses `loadAchievements()` and `saveAchievements()` to retrieve and persist unlocks.
  - **Data Pipeline**: Stores JSON representations of `Achievement[]` based on evaluations during `onGameComplete`.

#### **3. Data Pipelines & Interface Properties**
- **GameState** (from `lib/types/mold-types.ts`):
  - `score`: number
  - `streak`: number
  - `wrongAnswers`: number
- **RunRecord** (from `lib/types/mold-types.ts`):
  - `id`: string
  - `date`: string
  - `mode`: string
  - `score`: number
  - `streak`: number
  - `grade`: LetterGrade

#### **4. Cross-Layer Interactions**
- The global `AchievementProvider` interacts with `GameRunner` by evaluating new unlocks via `onGameComplete` when a session ends.
- All domain types are centralized in `lib/types/mold-types.ts` (re-exported via `lib/mold-types.ts`) ensuring typed data pipelines.
