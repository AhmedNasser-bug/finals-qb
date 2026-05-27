# Automated Onboarding Step-Instruction Playbooks

**Welcome to the MOLD V2 repository!** Follow these steps to initialize the environment, run validation checks, and prepare Pull Requests for validation.

---

## **Step 1: Workspace Initialization**

We have consolidated the setup into a simple, idempotent bootstrap script. This project **strictly requires `pnpm`**.

1. Open your terminal in the repository root.
2. Run the bootstrap orchestration script to setup the multi-tenant sandbox and install dependencies:
   ```bash
   ./scripts/setup/setup.sh --multi-tenant
   ```
   *(This will verify your `pnpm` installation, install dependencies, and prepare the local environment instantly.)*
3. Start the local development server:
   ```bash
   pnpm dev
   ```
4. Access the sandbox locally at `http://localhost:3000`.

---
