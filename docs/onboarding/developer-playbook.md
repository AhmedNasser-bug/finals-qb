# Developer Playbook

Welcome to the MOLD V2 developer onboarding guide. Follow these step-by-step instructions to initialize your workspace, run local tests, and prepare your PRs for review.

## Prerequisites
- Node.js (version 18+ recommended)
- `pnpm` (fallback to `corepack enable pnpm` if not globally installed)
- Docker and Docker Compose (for multi-tenant orchestration testing)
- A Unix-like bash environment

## Initialization Commands

To bootstrap your local development workspace, use our idempotent setup orchestration script. This script handles dependencies, `.env.local` creation, and local mock data seeding.

1. **Run the Initialization Script:**
   ```bash
   ./scripts/setup/setup.sh
   ```

2. **Run the Multi-Tenant Sandbox (Optional):**
   If you are working on features that require cross-tenant isolation, boot up the isolated Docker containers:
   ```bash
   ./scripts/setup/setup.sh --multi-tenant
   ```

3. **Start the Development Server:**
   ```bash
   pnpm dev
   ```

## Testing Workflows

The repository uses the native Node.js test runner for isolated, dependency-free test execution.

1. **Run All Tests:**
   Use the `pnpm test` wrapper to natively run all tests avoiding `node_modules`:
   ```bash
   pnpm test
   ```
   *Under the hood, this executes:*
   `node --experimental-strip-types --import ./test-runner.mjs --test $(find . -name '*.test.ts' -not -path '*/node_modules/*')`

2. **Run a Specific Test File:**
   ```bash
   node --experimental-strip-types --import ./test-runner.mjs --test lib/my-specific.test.ts
   ```

## PR Validation Rules

All code merged into `main` must adhere strictly to these operational and architectural guardrails:

**1. Accessibility (A11y) Standards**
- Interactive elements missing visible text must have an `aria-label`.
- All custom buttons/interactive elements must use Tailwind `focus-visible` utility classes (e.g., `focus-visible:ring-2`) to show focus rings.
- Disabled buttons must include an explanatory HTML `title` and `aria-disabled="true"`.
- Dynamic status text updates (e.g., toast messages, empty states) must be wrapped in `role="status"` or `aria-live="polite"`.
- Purely decorative graphical elements or layout structures must use `aria-hidden="true"`.

**2. Logging & PII Masking Integrity**
- Do not use native `console.*` methods for application logging. All logging must route through `lib/logger.ts`.
- When updating PII redaction patterns in `lib/logger.ts`, use declarative capture-group regex patterns. Ensure unquoted JSON primitives (numbers/booleans) conditionally wrap the `[REDACTED]` placeholder in quotes to preserve JSON validity in standard out.

**3. Strict Mermaid Configuration**
- Any component or configuration rendering MermaidJS diagrams must explicitly set `securityLevel: 'strict'` to mitigate arbitrary script injection vectors.

**4. Performance & Execution**
- Avoid O(N) array copying (`.slice()`) or chained iteration methods (`.some()`, `.every()`) within React render loops. Prefer single-pass `for` loops.
- In schema validation, avoid allocating intermediate arrays for membership checks (`['a', 'b'].includes(val)`). Use direct boolean comparisons instead.
