# Persistence Pipeline

The application currently uses an asynchronous persistence pipeline interfacing with `localStorage`, with an explicit design to support IndexedDB or server-side API swaps.

## Storage Keys (The "Database")

| Key | Type | Storage | Description |
|---|---|---|---|
| `mold_v2_subjects` | `FullSubjectData[]` | `localStorage` | Contains imported subject files. |
| `mold_v2_active_subject` | `string` (ID) | `sessionStorage` | Keeps track of the currently selected subject across lists/home. |
| `mold_v2_runs` | `RunRecord[]` | `localStorage` | Keeps the history of past completed sessions (capped at 50). |
| `mold_v2_achievements` | `Achievement[]` | `localStorage` | The user's achievement unlocks merged dynamically with the subject's conditions. |

- **Run History**: Stored under "mold_v2_runs". Managed via `loadRuns()` and `saveRuns()`. Appended by the client after game completion.
- **Achievements**: Stored under "mold_v2_achievements". Managed via `loadAchievements()` and `saveAchievements()`. Automatically synced by `onGameComplete`.