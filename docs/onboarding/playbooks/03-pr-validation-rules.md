# PR Validation Rules

Please follow these guidelines before submitting a Pull Request:

1. **Verify Sandbox**: Ensure `./scripts/setup/setup.sh` runs successfully.
2. **Run Tests**: Execute `pnpm test` and ensure all tests pass.
3. **Format PR**: The PR description must explicitly define:
   - **What**: Exact structural modifications made.
   - **Why**: The problem solved.
   - **Impact**: How it affects adjacent systems.
   - **Measurement**: Any relevant metrics if applicable.
