# Automated Onboarding Step-Instruction Playbooks

## Overview
This playbook outlines the workspace configuration steps and localized testing frameworks to help engineers spin up multi-tenant development environments instantly.

## 1. Initialization Commands
- **Clone Repository**: `git clone <repo-url>`
- **Run Bootstrap Script**: Execute `./scripts/orchestration/bootstrap.sh` to install dependencies, setup environment variables, and seed the mock database.
- **Start Sandbox (Multi-Tenant)**: Run `./scripts/orchestration/bootstrap.sh --multi-tenant` to spin up Docker containers.
- **Start Local Server**: Run `pnpm dev` to start the local development server.

## 2. Testing Workflows
- **Run Tests**: Execute `pnpm test` to run the test suite and verify code changes.
- **Run Build**: Execute `pnpm build` to build the application.

## 3. PR Validation Rules
- **Pre-Commit Checks**: Ensure `pnpm test` and `pnpm build` pass before committing code.
- **Code Reviews**: Request code reviews and address any feedback promptly.
- **Merge Criteria**: PRs must pass all CI checks and have at least one approved review before merging.
