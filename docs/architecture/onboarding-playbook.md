# Automated Onboarding Step-Instruction Playbook

## Introduction
Welcome to the team! This playbook outlines the workspace configuration steps, localized testing frameworks, and PR validation rules required to get started.

## Workspace Initialization

**Step 1: Install Dependencies**
Ensure you have Node.js and `pnpm` installed. Run the orchestrated bootstrap script to initialize the environment:
```bash
bash scripts/orchestration/bootstrap.sh
```

**Step 2: Start Multi-Tenant Sandbox**
To spin up the local multi-tenant docker sandbox, use the multi-tenant flag:
```bash
bash scripts/orchestration/bootstrap.sh --multi-tenant
```

**Step 3: Run the Development Server**
Start the local Next.js development server:
```bash
pnpm dev
```

## Testing Workflows

**Running the Test Suite**
We use a localized test-runner via Node.js native test runner. Execute the complete suite using:
```bash
pnpm test
```
**Important:** Tests must pass before any pull request can be merged. Ensure all modifications include corresponding tests.

## PR Validation Rules

**Formatting & Linting**
All code must pass the Next.js linter before submission:
```bash
pnpm lint
```

**Commit Structure**
- Use clear, descriptive commit messages.
- Ensure all temporary or scratchpad scripts are removed prior to review.

**Review Process**
- Push changes to a short, descriptive branch.
- Complete all pre-commit steps ensuring proper testing, verification, review, and reflection are done.
- Create a PR for review using the designated standard.
