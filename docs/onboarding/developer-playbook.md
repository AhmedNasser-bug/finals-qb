# Developer Onboarding Playbook

## **1. Environment Initialization**
Welcome to the project! To get your local workspace running, execute our unified bootstrap script. This idempotent script will handle dependencies, environment variables, seeding, and optionally spin up Docker containers.

Run the following command to initialize the project:
`./scripts/bootstrap.sh`

For multi-tenant container orchestration (starts Docker instances):
`./scripts/bootstrap.sh --multi-tenant`

## **2. Starting the Development Server**
Once initialized, start the local Next.js dev server with:
`pnpm dev`

**Note**: Never use `npm` or `yarn`. We exclusively use `pnpm`.

## **3. Testing Workflows**
Before committing any changes, ensure all tests pass. Our test suite is consolidated and uses the Node.js native test runner.

Execute the test suite:
`pnpm test`

## **4. Pull Request Validation Rules**
When creating a PR, strictly adhere to these guidelines:
- **Dependency Management**: Only use `pnpm install`.
- **Accuracy Denominator**: Ensure calculations use `score + wrongAnswers`, not `currentIndex`.
- **Accessibility (a11y)**: Add `aria-hidden="true"` to purely decorative icons, apply `focus-visible` outlines, and use `role="status"` for dynamic text.
- **Log Integrity**: Regex masking filters must use declarative capture-group patterns.
- **Architecture**: Do not scatter types. All data types go in `lib/mold-types.ts`.
- **Pre-commit**: Always run tests and complete the local validation suite prior to pushing branches.
