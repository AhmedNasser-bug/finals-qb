# Cross-Module Architectural Traceability Manual

## Overview
This document maps component interactions across frontend client apps, backend services, and cloud infra targets. It provides a clear guide for cross-layer development, documenting interface properties and data pipelines.

## Frontend Client Apps (Next.js)
- **App Router (`app/`)**: Strict server-components by default, handling structural page rendering and initial routing states.
- **Client Components**: Interactive elements (marked with `"use client"`) that hydrate post-load, such as dynamic quizzes, game engines, and theme providers.
- **Game Engine (`lib/game/game-engine.tsx`)**: The core interactive loop for the quiz platform, maintaining session states, scoring, and UI transitions.

## Backend Services
- **Data Persistence**: Data persistence relies heavily on client-side `localStorage` managed via `lib/utils/user-storage.ts`.
- **Subject Module (`lib/subject/`)**:
  - `subject-persistence.ts`: Core service layer logic for persisting quiz models and subjects.
  - Models are centralized in `lib/mold-types.ts` to ensure strict typing across the service boundaries.
- **Next.js API Routes**: Acts as the intermediary backend-for-frontend (BFF) layer where applicable, coordinating client requests before delegating to storage or third-party integrations.

## Cloud Infra Targets
- **Multi-Tenant Sandbox**: Orchestrated via `scripts/orchestration/bootstrap.sh` and `docker-compose.yml`, spinning up `tenant-a` and `tenant-b` instances for local development.
- **Deployment**: Configured for Vercel deployment with optimized asset delivery pipelines through Turbopack.

## Data Pipelines & Interface Properties
- **Subject Import/Export**: Data pipeline supporting base64 or JSON schemas for subjects. Hash routing (`#share=...`) is used for URL-based subject ingestion.
- **User State Sync**: Asynchronous synchronization of user streak states and achievements (`lib/achievement/achievement-logic.ts`) back to the persistent store.
