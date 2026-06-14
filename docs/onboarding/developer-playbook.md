# Developer Onboarding Playbook

Welcome to the MOLD V2 Development Sandbox. Follow these step-by-step instructions to initialize your workspace and validate your contributions.

## **1. Workspace Initialization**
*   **Install Dependencies:** Run `pnpm install` to ensure idempotent dependency resolution.
*   **Standard Setup:** Run `./scripts/setup/setup.sh` to seed the environment.
*   **Multi-Tenant Setup:** Run `./scripts/setup/setup.sh --multi-tenant` to spin up isolated Next.js Docker instances.

## **2. Testing Workflows**
*   **Run Local Tests:** Execute `pnpm test` to validate components and type logic. Ensure all tests pass before proposing changes.

## **3. PR Validation Rules**
*   **Linting:** You must address any linting errors prior to commit.
*   **Testing:** Zero failing tests are permitted in pull requests.
*   **PR Formatting:** Your pull request titles must adhere to strict prefixes:
    *   Performance: **⚡ Bolt: [performance improvement]**
    *   UX/UI: **🎨 Palette: [UX improvement]**