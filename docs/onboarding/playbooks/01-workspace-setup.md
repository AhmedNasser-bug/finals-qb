# Workspace Initialization

**Welcome to the team!** Follow these steps to initialize your local development environment.

## Prerequisites
Ensure you have the following installed:
- **Node.js** (v18+)
- **pnpm** (enabled via corepack)
- **Docker & Docker Compose** (for multi-tenant sandbox)

## Step-by-Step Initialization

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Run the Setup Script**
   Execute the idempotent orchestration script to install dependencies, configure the environment, and seed mock data.
   ```bash
   ./scripts/setup/setup.sh
   ```

3. **Start the Multi-Tenant Sandbox (Optional)**
   If you need to test multi-tenant features locally, start the sandbox:
   ```bash
   ./scripts/setup/setup.sh --multi-tenant
   ```

4. **Start the Development Server**
   ```bash
   pnpm dev
   ```
