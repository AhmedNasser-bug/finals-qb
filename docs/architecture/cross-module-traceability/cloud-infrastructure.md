# Cloud Infrastructure Targets & Future Extensions

While current operations are local-first, the architecture defines clear boundaries for backend integration:
- The `FullSubjectData` schema provides the contract for fetching new subjects from a remote API.
- The async nature of `loadRuns`, `saveRuns`, `loadAchievements`, and `saveAchievements` allows direct replacement with fetch/REST calls or GraphQL mutations without altering the UI component logic.