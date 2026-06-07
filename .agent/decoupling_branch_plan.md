# Git Branch Roadmap: Platform-Agnostic Core Decoupling

This document outlines the detailed step-by-step plan to decouple the core state machine (`GameEngine`, `AchievementEngine`, `StatsLogic`) from Web-specific APIs (`localStorage`, `Next.js Router`, `window`) on a separate Git branch. This prepares the system for an offline-first React Native mobile client.

---

## 1. Git Branching Strategy & Setup

To ensure active development on the main branch is not disrupted, we isolate this structural clean-architecture refactoring to a dedicated branch: `feature/platform-agnostic-clean-architecture`.

### Step 1: Branch Creation and Sync
```bash
# Sync local master/main with remote
git checkout main
git pull origin main

# Create the dedicated clean-architecture branch
git checkout -b feature/platform-agnostic-clean-architecture
```

### Step 2: Workspace Restructuring (Empty Directories Setup)
To prepare the layer-based separation without breaking imports immediately, create the new directories:
```bash
# In PowerShell / Windows:
New-Item -ItemType Directory -Force src/domain/subject, src/domain/run, src/domain/achievement
New-Item -ItemType Directory -Force src/application/game, src/application/stats, src/application/ports
New-Item -ItemType Directory -Force src/infrastructure/storage, src/infrastructure/logger, src/infrastructure/routing
New-Item -ItemType Directory -Force src/presentation/elements, src/presentation/modules, src/presentation/screens
```

---

## 2. Step-by-Step Refactoring Roadmap

### Step 1: Define Core Ports (Interfaces)
We will introduce platform-agnostic interfaces in `src/application/ports/` to abstract environment-specific APIs.

#### A. Key-Value Storage Interface (`src/application/ports/storage.ts`)
This decouples the stats/achievement engines from direct Web `localStorage` calls:
```typescript
export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  // Support async storage (e.g. React Native AsyncStorage or IndexedDB upgrades)
  getItemAsync?(key: string): Promise<string | null>;
  setItemAsync?(key: string, value: string): Promise<void>;
  removeItemAsync?(key: string): Promise<void>;
}
```

#### B. Router Navigation Interface (`src/application/ports/router.ts`)
This decouples page redirects and subject parameter loading from the Next.js router:
```typescript
export interface AppRouter {
  push(path: string): void;
  replace(path: string): void;
  back(): void;
  getParam(param: string): string | null;
}
```

---

### Step 2: Implement Web Adapters (Infrastructure Layer)
In `src/infrastructure/`, implement these interfaces using standard Web APIs.

#### A. Web LocalStorage Adapter (`src/infrastructure/storage/local-storage-adapter.ts`)
```typescript
import type { KeyValueStore } from "@/src/application/ports/storage";

export class WebLocalStorageAdapter implements KeyValueStore {
  getItem(key: string): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  }
  setItem(key: string, value: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  }
  removeItem(key: string): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  }
}
```

#### B. Web NextRouter Adapter (`src/infrastructure/routing/next-router-adapter.ts`)
```typescript
import type { AppRouter } from "@/src/application/ports/router";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export class WebNextRouterAdapter implements AppRouter {
  constructor(private nextRouter: AppRouterInstance, private searchParams: URLSearchParams) {}

  push(path: string): void {
    this.nextRouter.push(path);
  }
  replace(path: string): void {
    this.nextRouter.replace(path);
  }
  back(): void {
    this.nextRouter.back();
  }
  getParam(param: string): string | null {
    return this.searchParams.get(param);
  }
}
```

---

### Step 3: Decouple Stats & Achievements (Application Layer)
We rewrite the Context Providers (`StatsProvider` and `AchievementProvider`) to accept storage and router dependency injections.

#### Example: Decoupled `StatsProvider` (`src/application/stats/stats-context.tsx`)
```typescript
import React, { createContext, useContext, useMemo } from "react";
import type { KeyValueStore } from "../ports/storage";
import type { RunRecord } from "@/src/domain/run";

interface StatsContextValue {
  runs: RunRecord[];
  dayStreak: number;
  recordSession: (run: RunRecord) => void;
}

const StatsContext = createContext<StatsContextValue | null>(null);

interface StatsProviderProps {
  storage: KeyValueStore; // Injected dependency
  userId: string | null;
  children: React.ReactNode;
}

export function StatsProvider({ storage, userId, children }: StatsProviderProps) {
  // Use 'storage' interface methods instead of direct localStorage/loadRuns imports
  const runs = useMemo(() => {
    const key = userId ? `mold_runs_${userId}` : "mold_runs_anonymous";
    const data = storage.getItem(key);
    return data ? JSON.parse(data) : [];
  }, [storage, userId]);

  const recordSession = (run: RunRecord) => {
    const key = userId ? `mold_runs_${userId}` : "mold_runs_anonymous";
    const nextRuns = [...runs, run].slice(-50);
    storage.setItem(key, JSON.stringify(nextRuns));
  };

  return (
    <StatsContext.Provider value={{ runs, dayStreak: 0, recordSession }}>
      {children}
    </StatsContext.Provider>
  );
}
```

---

### Step 4: Restructure UI Screens (Presentation Layer)
- Move all files from `components/mold/home/` to `src/presentation/screens/home/`.
- Inject the adapters in `src/presentation/app-root.tsx` (the Web container) or in standard layout wrappers:
```typescript
// Web Entry Wrapper (Next.js context)
import { WebLocalStorageAdapter } from "@/src/infrastructure/storage/local-storage-adapter";
import { StatsProvider } from "@/src/application/stats/stats-context";

const storageAdapter = new WebLocalStorageAdapter();

export function WebAppRoot({ children }: { children: React.ReactNode }) {
  return (
    <StatsProvider storage={storageAdapter} userId={null}>
      {children}
    </StatsProvider>
  );
}
```

---

## 3. Merging & Integration Protocol

Once all files are restructured and verify locally, the merge cycle is executed:

1. **Conflict Reconciliation:**
   ```bash
   # Checkout the clean architecture branch
   git checkout feature/platform-agnostic-clean-architecture
   # Pull latest changes from master and resolve conflicts
   git merge origin/main
   ```
2. **Execute Validation Gate:**
   - Execute `pnpm test` to verify that all unit assertions on game streaks, stats logic, and file parses run without compile-time errors.
3. **Commit & PR Review:**
   - Open a Pull Request from `feature/platform-agnostic-clean-architecture` to `main`.
   - The Orchestrator agent evaluates the PR, runs SAST, and generates the risk scorecard (CE Score).
   - Core developers conduct human sign-off before merging.
