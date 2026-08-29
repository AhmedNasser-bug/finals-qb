# Backend Traceability Manual

## Overview
This document maps interactions and pipelines for backend services.

## Services
- **Framework**: Node.js APIs within Next.js Server Components / API Routes.
- **Database/Storage**: Currently relies on client-side `localStorage` via `lib/utils/user-storage.ts`.
- **Data Flow**:
  - Models: Centralized in `lib/mold-types.ts`.
