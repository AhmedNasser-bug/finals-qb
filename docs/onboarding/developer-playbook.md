# Developer Onboarding Playbook

Welcome to the MOLD V2 project! This playbook outlines the necessary steps to configure your workspace, run localized testing frameworks, and adhere to PR validation rules.

## Initialization Commands

1.  **Bootstrap the Environment**:
    To set up dependencies, local environment variables, and optionally spin up a multi-tenant sandbox, run the bootstrap orchestration script:
    ```bash
    bash scripts/orchestration/bootstrap.sh
    ```
    If you want to start the multi-tenant sandbox, pass the `--multi-tenant` flag:
    ```bash
    bash scripts/orchestration/bootstrap.sh --multi-tenant
    ```

2.  **Start Local Development Server**:
    After bootstrapping, you can start the Next.js development server using pnpm:
    ```bash
    pnpm dev
    ```

## Testing Workflows

1.  **TypeScript Type Checking**:
    The project does not define a `typecheck` script in `package.json`. To perform TypeScript type checking, explicitly use:
    ```bash
    pnpm exec tsc --noEmit
    ```
    *Note: Errors about missing `esModuleInterop` or TS1192 can be safely ignored. Rely on `pnpm test` for verification.*

2.  **Run Full Test Suite**:
    To run the comprehensive test suite and verify changes:
    ```bash
    pnpm test
    ```

3.  **Code Linting**:
    To ensure code adheres to standard conventions:
    ```bash
    pnpm lint
    ```

## PR Validation Rules

1.  **Format and Specificity**:
    Ensure all execution plans and PR descriptions clearly outline the **What**, **Why**, **Impact**, and **Measurement**.
2.  **Accessibility (a11y)**:
    - Include `aria-busy={isLoading}` for disabled buttons processing asynchronous actions.
    - Wrap dynamic empty states or status text inside live regions (e.g., `role="status"` or `aria-live="polite"`).
    - Exclude disabled elements in keyboard focus traps for interactive modals.
3.  **Security**:
    - Avoid using native console methods (e.g., `console.error`) in server-side application logic. Always import and use the centralized `logger` utility to prevent leakage of sensitive data.
    - Ensure Mermaid diagrams strictly set `securityLevel: 'strict'`.
4.  **Architectural Documentation**:
    Always update modular documentation in `docs/architecture/cross-module-traceability/` (e.g., `frontend/`, `backend/`, `infra/`) when domain boundaries change.
