# System Overview

## Introduction
This manual provides a detailed mapping of component interactions across the MOLD V2 frontend client apps, the underlying state and persistence layers, and cloud infrastructure targets (where applicable, focusing on local-first storage). It serves as a clear guide for cross-layer development by documenting interface properties, data pipelines, and state architecture.

## 1. System Overview
MOLD V2 is a frontend-only Next.js 16 App Router application. The system primarily operates as a client-side architecture with local storage persistence, designed for high performance and zero-latency user interactions. It implements a decoupled state architecture featuring three independent domains: Root Achievements, Session Game Engine, and View State.

### Core Stack
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19, Tailwind CSS, shadcn/ui
- **State Management:** React Context + React State + Ephemeral Reducer (`GameEngine`)
- **Persistence:** `localStorage` & `sessionStorage`

## 6. Cloud Infrastructure Targets & Future Extensions
While current operations are local-first, the architecture defines clear boundaries for backend integration:
- The `FullSubjectData` schema provides the contract for fetching new subjects from a remote API.
- The async nature of `loadRuns`, `saveRuns`, `loadAchievements`, and `saveAchievements` allows direct replacement with fetch/REST calls or GraphQL mutations without altering the UI component logic.