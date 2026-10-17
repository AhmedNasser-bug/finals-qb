# Cross-Module Architectural Traceability Manual

This document maps the component interactions and data pipelines across the `finals-qb` project architecture.

## 1. Frontend Client Apps (`app/`, `components/`)
- **Routes & Sessions**: `app/page.tsx` drives active study sessions through URL state `?subject=<id>`.
- **Layout**: `app/layout.tsx` wraps the application in Vercel analytics, speed insights, Clerk authentication, and global styles/fonts.
- **Components**: The UI is composed of standard components (e.g., `components/ui/`) and project-specific interactive islands under `components/mold/` (e.g., `HomeScreen`).

## 2. Backend / Shared Services (`lib/`)
- **Core Stores & Persistence**: `lib/active-subject-store.ts` manages the current active session state. `lib/subject-persistence.ts` orchestrates local storage and validation rules.
- **Data Boundaries (Contracts)**: `lib/types/mold-types.ts` exposes contracts defining interfaces like `Question`, `MCQOption`, and core types used across the stack (`QuestionDifficulty`, `QuestionType`).
- **Game Engine**: `lib/game/game-engine.tsx` utilizes `calculateAccuracy` and crypto shuffles (`lib/crypto-utils.ts`) to drive the game loop and progression tracking.

## 3. Cloud Infra Targets
- **Containerization**: `docker-compose.yml` configures local multi-tenant execution using isolated runtime directories (`.next-tenant-a`, `.next-tenant-b`) to circumvent volume mount conflicts.
- **Vercel Deployments**: The continuous integration pipeline is defined partially through `vercel.json` alongside `.agent/skills/pr-triage-release-cleanup.md` which overrides deployment statuses in PRs.
