# Onboarding Playbook

## Environment Setup
**1.** Ensure **Node.js** and **pnpm** are installed.
**2.** Run the setup orchestrator: `bash scripts/setup/setup.sh --multi-tenant`
**3.** Create your local environment config: `cp .env.example .env.local`

## Testing & Validation
**1.** Run local dev server: `pnpm dev`
**2.** Run test suite: `pnpm test`
**3.** Run type check: `pnpm lint`

## PR Rules
- Ensure you use descriptive messages.
- Run tests and linting before submitting any code.
