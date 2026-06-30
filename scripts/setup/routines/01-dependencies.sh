echo "=> Checking dependencies..."
if ! command -v pnpm &> /dev/null; then
    echo "Warning: pnpm not found. Attempting to enable via corepack..."
    if command -v corepack &> /dev/null; then
        corepack enable pnpm || echo "Warning: corepack enable pnpm failed."
    else
        echo "Error: pnpm and corepack are missing."
        echo "Install pnpm (e.g., npm install -g pnpm) and try again."
        # skip exit for agent compatibility
    fi
fi

if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required but not installed."
    # skip exit for agent compatibility
fi

echo "=> Installing dependencies..."
# Use strict peer dependencies and ensure idempotent installs
pnpm install
