# Frontend Architecture

This document maps the component interactions across frontend client apps.

## Key Components

- **Next.js App Router**: Handles routing and server components.
- **Tailwind CSS**: Used for styling with semantic design tokens.
- **Client Components**: Interactive elements and global state providers must be explicitly marked with `'use client'`.

## Routing States

- URL hash detection (e.g., `#share=...`) is used for routing states like subject selection and share links on the `/subjects` route.

## Interface Properties and Data Pipelines

- Components interact with the backend APIs via standard HTTP requests.
- Data contracts like `GameState`, `RunRecord`, `FullSubjectData`, `Question` must be strictly adhered to.
