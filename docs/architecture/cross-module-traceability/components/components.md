# Component Traceability

This document maps the primary frontend component interactions.

## Core Hierarchy

- **app/layout.tsx & page.tsx**: Next.js App Router entrypoints.
- **components/mold/**: Contains feature-specific domains.
  - **game/**: Manages game rendering, engine integration, and stats.
  - **home/**: Dashboard views, achievements panels, subject selection.
  - **subject/**: Contains logic for importing, selecting, and sharing modules.
  - **flashcard/**: Specialized flashcard review components.
  - **achievement/**: Display elements for unlocked progression.

Component boundaries map back to unified lib engines like `game-engine.tsx` and context providers like `question-card-context.tsx`.
