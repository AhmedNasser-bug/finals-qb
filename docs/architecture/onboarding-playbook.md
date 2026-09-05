# Automated Onboarding Step-Instruction Playbook

## Setup Requirements
**1. Dependency Setup:**
Ensure `pnpm` is enabled and dependencies are installed.
```bash
corepack enable pnpm
pnpm install
```

**2. Multi-tenant Sandbox:**
Run the orchestration script to spin up the local Docker environment:
```bash
./scripts/orchestration/bootstrap.sh
```

## Testing Workflows
The project relies on localized testing.
Execute the test runner script using `node --experimental-strip-types --import ./test-runner.mjs --test [files]`.

Or standard invocation:
```bash
pnpm test
```

## PR Validation Rules
- Code must pass `pnpm test`.
- All design and architecture decisions must comply with the `Cross-Module Architectural Traceability Manual`.
