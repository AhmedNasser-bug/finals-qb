# Developer Onboarding Playbook

Welcome to the My v0 Project! This guide provides step-by-step instructions for setting up your local environment, running tests, and validating your pull requests.

## **Initialization Commands**

1.  **Install Dependencies:** Ensure you have Node.js and `pnpm` installed.
    ```bash
    pnpm install
    ```
2.  **Bootstrap Multi-Tenant Sandbox:** Run the setup script to clean caches, install dependencies, and spin up the Docker Compose multi-tenant environment.
    ```bash
    ./scripts/setup/bootstrap.sh
    ```
3.  **Start Local Development:** (If not using the multi-tenant Docker setup)
    ```bash
    pnpm dev
    ```

## **Testing Workflows**

The project uses the native `node:test` runner.

1.  **Run All Tests:** Execute the test suite using `pnpm`. This uses `--experimental-strip-types` to handle TypeScript.
    ```bash
    pnpm test
    ```
2.  **Linting:** Run Next.js linting to catch style and quality issues.
    ```bash
    pnpm lint
    ```
    *Note: If `pnpm lint` fails with "Invalid project directory provided", ensure you are running it from the project root. This can be safely ignored if tests pass.*
3.  **Type Checking:** Explicitly check TypeScript types.
    ```bash
    pnpm exec tsc --noEmit
    ```

## **PR Validation Rules**

Before submitting a Pull Request, ensure the following criteria are met:

1.  **Testing:** All tests must pass (`pnpm test`).
2.  **Linting:** Code must pass linting rules (`pnpm lint`).
3.  **Build Verification:** Ensure the project builds successfully.
    ```bash
    pnpm build
    ```
4.  **Formatting:** Ensure code is formatted correctly using Prettier.
    ```bash
    npx prettier --write .
    ```
5.  **Review the OS Protocol:** Ensure all code changes adhere to the Core OS Protocol outlined in the system directives (context discovery, memory utilization, adaptive gracefulness, domain isolation, and strict verification).
