# Workspace Setup Playbook

## 1. **Install Dependencies**
Run the following command to download workspace packages:
`pnpm install`

## 2. **Orchestrate Setup Scripts**
Run the setup orchestrator to configure `.env.local`, seed mock databases, and spin up multi-tenant Docker containers:
`bash scripts/setup/setup.sh --multi-tenant`

## 3. **Start Development Server**
Start the local Next.js environment instantly:
`pnpm dev`
