# Cross-Layer Traceability Manual

## Frontend (Next.js Client)
- **Entry:** App Router (`app/`)
- **State:** Providers (`GameEngineProvider` in `components/mold/game/game-runner.tsx`, `AchievementProvider` in `app/providers.tsx`)
- **Data Interface:** LocalStorage synced with React Context via Hooks (`useGameEngine`, `useAchievements` in `lib/achievement-engine`).

## Backend Services (APIs)
- **AI Routes:** `app/api/ai/` (job status/generation pipeline).
- **Payment Routes:** `app/api/payments/` (webhook and verification with RevenueCat).

## Cloud Infrastructure Targets
- **Hosting:** Vercel (Next.js serverless functions).
- **Docker Sandbox:** Multi-tenant setup orchestrated via `scripts/setup/` and mapped to unique output directories (`.next-tenant-a`, `.next-tenant-b`).
