# Developer Onboarding Playbook

**Welcome to the Workspace**

Follow these step-by-step instructions to initialize your local sandbox, test your code, and validate PRs.

## 1. Initialization Commands

To set up the multi-tenant development environment instantly:

1. **Clone the repository** and navigate to the root directory.
2. **Run the bootstrap script**:
   `./scripts/orchestration/bootstrap.sh`
   *(This script is idempotent; it safely sets up `pnpm`, installs dependencies, spins up Docker Compose tenants, and runs required database seeds via `scripts/setup/03-seeding.sh`).*

## 2. Local Development Workflow

- Start the primary development server (if not relying on Compose):
  `pnpm dev`
- To interact with multi-tenant containers, view the `docker-compose.yml` for exposed ports (e.g., `3001`, `3002`).

## 3. Testing Framework

We use Node.js's native test runner. Ensure all logic changes are covered by tests.

- **Run all tests**:
  `pnpm test`
- *(Note: Warnings about missing `type: module` can safely be ignored as long as tests pass).*

## 4. PR Validation Rules

Before submitting a Pull Request, you must complete the following validations:

1. **Format and Lint**: Ensure code meets formatting standards (e.g., via `pnpm lint`, though rely on `pnpm test` if lint issues arise).
2. **Test Suite**: You **must** run `pnpm test` and verify that all cases pass.
3. **Architectural Traceability**: If domain boundaries change, update the modules in `docs/architecture/cross-module-traceability/`.
4. **Pre-Commit Checks**: **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**
