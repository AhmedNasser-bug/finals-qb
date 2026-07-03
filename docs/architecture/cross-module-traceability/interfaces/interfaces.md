# Interface Traceability

This document defines core data models used across layers.

## Core Types (`lib/types/mold-types.ts`)

- **Question / Flashcard Types**: Structurally typed JSON inputs representing educational modules.
- **Game Session Stats**: Interfaces reflecting `accuracy`, `streak`, and time elapsed.
- **Subject Module Data**: Identifies unique modules across the local environment and serialization boundaries.

Interfaces serve as contracts between UI inputs (e.g., `subject-importer.tsx`), game logic (`game-engine.tsx`), and storage persistence wrappers.
