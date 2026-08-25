# Backend Architecture

This document details the backend services and their interactions.

## Key Services

- **API Routes**: Serve data to the frontend clients.
- **Logging**: A centralized `logger` utility is used for server-side logging with required data redaction filters. Avoid using native console methods in application logic.

## Interface Properties and Data Pipelines

- Data contracts like `GameState`, `RunRecord`, `FullSubjectData`, `Question` must be maintained.
