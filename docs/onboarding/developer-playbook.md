### **Automated Onboarding Step-Instruction Playbooks**

#### **1. Workspace Initialization**
To instantly spin up the multi-tenant development environment, run the idempotent bootstrap orchestration script:
**`bash scripts/setup/setup.sh --multi-tenant`**
This script will:
- Check for **pnpm** and **Node.js** dependencies.
- Install workspace dependencies idempotently using **`pnpm install`**.
- Setup the local **`.env.local`** environment file.
- Seed mock data structures in **`.data/seeds/`**.
- Spin up isolated Docker containers for **tenant-a** and **tenant-b** using **docker-compose**.

#### **2. Localized Testing Workflows**
The project utilizes the native **node:test** runner.
To execute the full test suite and verify structural integrity, use the following command:
**`pnpm test`**
This executes tests across critical modules using **`--experimental-strip-types`** for seamless TypeScript interpretation.

#### **3. PR Validation Rules**
Before submitting a pull request, ensure the following validation rules are met:
- **Dependency Management**: Use **`pnpm`** exclusively.
- **Test Integrity**: Ensure **`pnpm test`** passes successfully.
- **Pre-commit Checks**: Complete all pre-commit testing, verifications, and architectural rule reviews.
- **Code Style**: Run auto-formatting using **`npx prettier --write <file>`** and adhere to Tailwind semantic tokens.
