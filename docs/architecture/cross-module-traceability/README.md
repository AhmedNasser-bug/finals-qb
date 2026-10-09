# Cross-Module Architectural Traceability Manual

Welcome to the MOLD V2 architectural manual. This series of documents meticulously maps the interplay between the Next.js frontend, backend storage layers, and localized infrastructure targets, providing a definitive guide for cross-layer development.

## Table of Contents

1. [Component Interactions](./01-component-interactions.md)
   Provides an end-to-end view of how Next.js client modules trigger interactions down to infrastructure targets, like the `docker-compose` multi-tenant orchestration setup.

2. [Interface Properties](./02-interface-properties.md)
   Defines the core data boundary models such as `FullSubjectData` and `GameState`, serving as the strict atomic structures shared between layers.

3. [Data Pipelines](./03-data-pipelines.md)
   Traces the unidirectional flow of data from action dispatch (reducer mutations) to persistent memory mappings (`loadSubjects` / `saveSubjects`).
