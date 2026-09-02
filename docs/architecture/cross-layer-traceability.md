# Cross-Module Architectural Traceability Manual

## Overview
This manual maps component interactions across frontend client applications, backend services, and cloud infrastructure targets, creating a clear guide for cross-layer development.

## 1. Frontend Client Application (App Router & React)

### Component Hierarchy
- **`app/layout.tsx`**: Root provider, sets up `ThemeProvider` and global Geist fonts.
- **`app/page.tsx`**: The entry point that mounts the primary `<HomeScreen />` module.

### State & Providers
- **`AchievementProvider`**: Manages the persistent local state (`mold_v2_achievements`) and unlock evaluations.
- **`GameEngineProvider`**: An ephemeral, session-scoped provider managing turn-based flows, scoring, and timers.

### Key Components
- **`components/mold/subject/subject-importer.tsx`**: A client component utilizing `useMemo` and `useCallback` for performance. It processes external definitions (via hash routes) into local storage models.
- **`components/mold/subject/subject-selector.tsx`**: Manages the local library of stored subjects.

## 2. Backend Services & Data Pipelines (Persistence)

### Models and Definitions
- **`lib/mold-types.ts`**: Central registry defining robust data structures (e.g., `FullSubjectData`, `Achievement`, `GameState`).

### Storage Interactions (Local Sandbox Strategy)
- **`lib/utils/user-storage.ts`**: Asynchronous adapter handling read/write operations targeting the browser's `localStorage` (`mold_v2_runs`, `mold_v2_achievements`). Structured to easily pivot to IndexedDB or a server REST API.

## 3. Cloud Infrastructure Targets & Orchestration

### Multi-Tenant Architecture
- The system is built for isolated tenant deployments mapped natively to Next.js custom build directories (`NEXT_DIST_DIR`).
- **`docker-compose.yml`**: Defines the multi-tenant local simulation.
  - **`tenant-a`**: Port `3001`
  - **`tenant-b`**: Port `3002`

### Pipeline Validations
- Build checks and linting pipelines strictly enforce isomorphic module dependencies (e.g., using `isomorphic-dompurify`) and PII sanitization via `lib/utils/logger.ts` before serialization.
