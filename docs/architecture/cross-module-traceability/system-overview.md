# System Overview

MOLD V2 is a frontend-only Next.js 16 App Router application. The system primarily operates as a client-side architecture with local storage persistence, designed for high performance and zero-latency user interactions. It implements a decoupled state architecture featuring three independent domains: Root Achievements, Session Game Engine, and View State.

## Core Stack
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19, Tailwind CSS, shadcn/ui
- **State Management:** React Context + React State + Ephemeral Reducer (`GameEngine`)
- **Persistence:** `localStorage` & `sessionStorage`