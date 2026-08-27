# Developer Onboarding Playbook

## **1. Initialization Commands**
To spin up the multi-tenant sandbox and prepare the local environment:

- **Run Bootstrap**: Execute the bootstrap script to install dependencies, configure the environment, and seed data.
  `bash scripts/orchestration/bootstrap.sh`
- **Multi-Tenant Mode**: To spin up isolated tenant environments via Docker.
  `bash scripts/orchestration/bootstrap.sh --multi-tenant`
- **Start Development Server**: Launch Next.js local development.
  `pnpm dev`

## **2. Testing Workflows**
- **Unit & Structural Testing**: Run the official test execution suite to verify codebase integrity.
  `pnpm test`
- **Linting**: Ensure code conforms to Next.js standards.
  `pnpm lint`

## **3. PR Validation Rules**
- **Pre-Commit Checks**: Always execute `pnpm test` and `pnpm lint` locally before opening a pull request.
- **Idempotency**: All new initialization or migration scripts must check for existing state before executing to remain idempotent.
- **Type Checking**: Verify no type errors exist using Next.js build.
  `pnpm build`
