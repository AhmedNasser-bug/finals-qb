# Developer Playbook

Welcome to the development environment! This playbook outlines the necessary commands and workflows to get you started smoothly.

## **Initialization Commands**

To set up the workspace, install dependencies and prepare your sandbox.

1. **Install Dependencies**
   Run the following command to install all required dependencies safely via `pnpm`:
   ```bash
   pnpm install
   ```

2. **Initialize Multi-Tenant Sandbox**
   To spin up the multi-tenant development containers and generate mock data seeds, execute the setup orchestration script:
   ```bash
   ./scripts/setup/setup.sh --multi-tenant
   ```

## **Testing Workflows**

We use the native Node.js test runner for unit testing. Always ensure tests pass before requesting reviews.

1. **Run the Test Suite**
   Execute all unit tests using the standard test command:
   ```bash
   pnpm test
   ```

2. **Local Frontend Verification**
   If you have created or modified Playwright scripts for frontend UI testing, you can execute them locally (if supported natively, e.g. via Python):
   ```bash
   python <script_path>
   ```

## **PR Validation Rules**

Before submitting a Pull Request, please ensure the following validations are met:

1. **Linting**
   Ensure your code conforms to the required styling rules:
   ```bash
   pnpm lint
   ```
   *(Note: If `pnpm lint` fails due to a missing `eslint.config.js` or invalid project directory, you may safely skip it until linting is properly configured.)*

2. **Testing**
   The test suite must pass without errors (`pnpm test`).

3. **No Temporary Artifacts**
   Do **not** commit temporary verification files, server logs (e.g., `dev.log`), or scratchpad scripts generated during local debugging. They will trigger automated code review rejections.

4. **Documentation Updates**
   If you modify core components, ensure you run documentation generator scripts (e.g., `generate-component-registry.js`) and commit the resulting output changes.
