# Frontend Traceability Manual

## Overview
This document maps component interactions across the frontend Next.js application, detailing interface properties and data pipelines.

## Architecture
- **Framework**: Next.js App Router (React).
- **Entry**: `app/layout.tsx` (Global styles, Geist font setup).
- **State Management**:
  - `AchievementProvider` (located in `lib/achievement/achievement-engine.tsx` context): Persists achievements, survives navigation.
  - `GameEngineProvider` (`lib/game/game-engine.tsx`): Ephemeral game state, mounted per session.
- **UI System**:
  - **Design tokens**: Defined in CSS custom properties (`app/globals.css`).
  - **Styling**: Tailwind CSS + shadcn/ui.
- **Data Pipeline**:
  - Components dispatch actions to context reducers (e.g., `SELECT_OPTION`, `REVEAL_ANSWER` in `lib/game/game-engine.tsx`).
  - Reducers update ephemeral state.
