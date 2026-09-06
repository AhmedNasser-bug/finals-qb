# Automated Onboarding Playbook

**Welcome to the project!** Follow these steps to get your local environment up and running.

## 1. Initialization Commands

To bootstrap your local multi-tenant sandbox, run the following script:

**`./scripts/orchestration/bootstrap.sh`**

This script will:
- Install dependencies via **`pnpm install`**
- Set up environment variables
- Spin up multi-tenant development environments using **`docker-compose up -d`**

## 2. Testing Workflows

We use a customized testing setup. To run the full test suite, use:

**`pnpm test`**

Ensure all tests pass before submitting any pull requests.

## 3. PR Validation Rules

When submitting a Pull Request, ensure the following:
- Tests pass: **`pnpm test`** must succeed.
- Pre-commit checks: Complete all verification and testing before committing.
- Commit formatting: Ensure descriptive commit messages.
