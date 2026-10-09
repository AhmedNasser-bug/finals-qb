# Developer Playbook: Initialization, Testing, and PR Validation

Welcome to MOLD V2! This onboarding playbook outlines step-by-step instructions for getting your environment bootstrapped, executing the localized test frameworks, and adhering to strict Pull Request validation rules.

## 1. Workspace Initialization Commands

Before running the Next.js server, you must bootstrap your dependencies and local sandbox multi-tenant orchestrators.

**Step 1:** Enable the mandatory package manager mapping. We strictly enforce `pnpm`.
```bash
corepack enable pnpm
```

**Step 2:** Ensure dependencies are cleanly installed.
```bash
pnpm install
```

**Step 3:** Spin up the multi-tenant orchestration setup.
```bash
./scripts/setup/setup.sh --multi-tenant
```

**Step 4:** Boot the local development server.
```bash
pnpm dev
```

## 2. Testing Workflows

Our testing suite runs off the native Node.js test runner (`node:test`). We do **not** use Jest or Vitest.

**Step 1:** Run the entire test suite to ensure stability across domains.
```bash
pnpm test
```

*Note on Typescript execution scripts*:
If compiling scripts individually, run:
```bash
node --experimental-strip-types file.ts
```

## 3. Pull Request Validation Rules

When preparing commits for merge, strict structural and semantic guidelines dictate validation rules.

### Performance Agents (Bolt)
If performing optimizations or latency reductions, your PR validation mandates:
- **Title**: `⚡ Bolt: [performance improvement]`
- **Description Body**: Must include the sections **💡 What**, **🎯 Why**, **📊 Impact**, and **🔬 Measurement**.
- **Requirement**: Stop and do not create a PR if only micro-optimizations with no measurable impact are found.

### UX & Accessibility Agents (Palette)
If modifying DOM structures for visual or structural accessibility, your PR validation mandates:
- **Title**: `🎨 Palette: [UX improvement]`
- **Description Body**: Must include **💡 What**, **🎯 Why**, **📸 Before/After**, and **♿ Accessibility**.
- **Requirement**: Ensure changes are kept under 50 lines and never modify backend logic or performance code.

### Pre-Commit Requisite
All execution paths must conclude by validating their logic against tests. Always ensure regressions are not introduced by running `pnpm test` prior to submitting your code for review.
