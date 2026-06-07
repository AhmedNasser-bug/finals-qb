# Cross-Module Architectural Traceability Manual

## Overview
This manual maps component interactions across frontend client apps, backend services, and cloud infra targets.

## Frontend Client Apps
- Next.js App Router for frontend client app. (`app/` and `components/`)

## Backend Services
- Handled primarily by Next.js Server Actions and APIs. (e.g. `app/actions.ts`)

## Cloud Infrastructure Targets
- Docker multi-tenant containers for local development sandbox environments.

## Data Pipelines & Interface Properties
- Server Actions manage communication between the client side and the server context.
