# Cross-Module Architectural Traceability Manual

## Overview
This document maps component interactions across frontend client apps, backend services, and cloud infrastructure targets, creating a clear guide for cross-layer development.

## 1. Frontend Client Application (Next.js)

### State Management & Context Providers
- **ThemeContext** (`lib/themes/theme-context.tsx`): Manages global UI themes (e.g., Amber Phosphor, Nordic Glacier).
- **LayoutContext** (`lib/layouts/layout-context.tsx`): Controls the active layout (e.g., Default Sidebar, Zen Focus).
- **GameEngineProvider** (`lib/game/game-engine.tsx`): Ephemeral state for active quiz sessions, evaluating answers and managing timers.
- **AchievementProvider** (`lib/achievement/achievement-engine.tsx`): Persistent state evaluating and unlocking achievements across sessions.
- **PurchasesContext** (`lib/revenuecat/purchases-context.tsx`): Manages RevenueCat subscription state and paywall triggers.

### Component Layer
- **Root Layout** (`app/layout.tsx`): Injects global providers (Theme, Layout, Achievement, Analytics).
- **Home Screen** (`components/mold/home/home-screen.tsx`): Entry point for selecting modes, managing subjects, and viewing stats.
- **Game Runner** (`components/mold/game/game-runner.tsx`): Orchestrates the quiz flow, connecting the GameEngineProvider to the UI.
- **Subject Importer** (`components/mold/subject/subject-importer.tsx`): Handles parsing, validating, and persisting JSON subjects.
- **Paywall Modal** (`components/mold/payment/paywall-modal.tsx`): Triggered conditionally when free quotas are exceeded.

## 2. Backend Services (Next.js API Routes)

### Payments & Entitlements (RevenueCat)
- **Webhook Endpoint** (`app/api/payments/webhook/route.ts`): Listens for RevenueCat server-to-server events (renewals, cancellations) to update user records if necessary.
- **Verification Endpoint** (`app/api/payments/verify/route.ts`): Validates client-side purchase tokens or active entitlements securely on the server.

### AI Processing
- **Generation Endpoint** (`app/api/ai/generate/route.ts`): Initiates asynchronous AI tasks (e.g., generating flashcards from prompts) and queues the job.
- **Status Endpoint** (`app/api/ai/status/[jobId]/route.ts`): Allows clients to poll for the completion status and result payload of asynchronous AI jobs.

## 3. Data & Storage Pipelines

### Client-Side Persistence
- **Local Storage** (`lib/utils/user-storage.ts`): Primary persistence layer for offline-first data, including:
  - `mold_v2_runs`: Historical performance data.
  - `mold_v2_achievements`: Unlocked achievements and timestamps.
  - `mold_v2_subjects`: Imported user subjects and configurations.

### Telemetry & Analytics
- **Telemetry Collector** (`lib/telemetry/telemetry-collector.ts`): Captures application events (cognitive load, fatigue indicators).
- **Analytics Bridges**:
  - `lib/analytics/ga-bridge.ts`: Google Analytics integration.
  - `lib/analytics/clarity-bridge.ts`: Microsoft Clarity integration.
  - `lib/analytics/lighthouse-service.ts`: Web Vitals and performance monitoring.

## 4. Cross-Layer Data Flow Examples

### 1. Subject Import Flow
`Subject Importer UI` -> `JSON Validator (lib/mold-types.ts)` -> `Subject Persistence (localStorage)` -> `Active Subject Store (Zustand/Context)` -> `Game Engine (lib/game-engine.tsx)`

### 2. Premium Feature Access
`User Action` -> `PurchasesContext Check` -> (If denied) `Paywall Modal` -> `Purchase Intent` -> `RevenueCat Client SDK` -> `Next.js Verify Route` -> `Update Local Entitlement State`

### 3. AI Generation Pipeline
`User Prompt` -> `Prompt Builder (lib/subject/prompt-builder.ts)` -> `POST /api/ai/generate` -> (Returns Job ID) -> `Client Polling (/api/ai/status/[id])` -> `Result Merged into Subject Store`
