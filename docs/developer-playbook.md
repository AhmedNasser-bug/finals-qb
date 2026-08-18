# Developer Playbook

### Initialization
**1. Install Dependencies**
Ensure Node.js is installed. Then run:
`pnpm install`

**2. Environment Variables**
Create a local environment file from the example:
`cp .env.example .env.local`

**3. Multi-Tenant Sandbox Setup**
Run the setup script with multi-tenant flag to spin up Docker containers and mock database:
`bash scripts/setup/setup.sh --multi-tenant`

### Local Development & Testing Workflow
**1. Start Development Server**
Start the Next.js local server:
`pnpm dev`

**2. Run Test Suite**
Execute the test runner to ensure no regressions:
`pnpm test`

### PR Validation Rules
**1. Pre-Commit Verification**
All developers must complete the pre-commit verifications before submitting:
- Code must pass `pnpm test`.
- No build errors must occur (can verify via `pnpm build`).
- Commits should follow conventional descriptions.
