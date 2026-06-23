# Developer Onboarding Playbook

## Initialization Commands

1. **Clone the repository:**
   ```bash
   git clone <repo_url>
   cd <repo_directory>
   ```

2. **Bootstrap the workspace:**
   To set up a multi-tenant local workspace, execute the following script:
   ```bash
   ./scripts/setup/setup.sh --multi-tenant
   ```
   This script will install dependencies via \`pnpm\`, set up your \`.env.local\`, seed mock databases for each tenant, and start the necessary Docker containers using \`docker-compose\`.

3. **Start the development server:**
   Once the sandbox is bootstrapped, start the Next.js development server:
   ```bash
   pnpm dev
   ```
   The local environment will now be running on port 3000 (with tenants accessible on ports 3001 and 3002 as configured).

## Testing Workflows

1. **Run the test suite:**
   To run the complete suite of tests via the custom Node.js test runner:
   ```bash
   pnpm test
   ```
   This validates core logic, utility accuracy, and state management mechanisms.

2. **Lint the codebase:**
   To ensure code quality and consistency:
   ```bash
   pnpm lint
   ```
   *Note: If linting fails with "Invalid project directory provided", a valid linting setup might currently be absent.*

3. **Verify the build:**
   Before pushing changes, verify that the application builds successfully:
   ```bash
   pnpm build
   ```
   *If the build fails with 'next: not found', run \`pnpm install\` first.*

## PR Validation Rules

- **Pre-commit Checks:** All PRs must pass the test suite and build verification. Ensure no temporary or generated debugging files (e.g., Python/Node scratch scripts) are accidentally tracked.
- **Visual Frontend Verification:** For UI updates, run \`pnpm build\` to confirm changes if a specific Playwright testing script is unavailable. Visual differences should be accompanied by recorded verifications.
- **Architectural Traceability:** Whenever a new component or cross-layer interaction is introduced, update the component registry using the generation script:
  ```bash
  node scripts/generate-component-registry.js
  ```
- **Code Standards:**
  - Do not use conversational text or vague instructions in commit messages or PR descriptions.
  - Follow the specific formatting rules outlined in `AGENTS.md` regarding component extraction and memoization.
  - Performance improvements (via Bolt) or UX updates (via Palette) must include specific details (What, Why, Impact/Before-After) in their PR descriptions.
