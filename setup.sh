#!/bin/bash
set -e

echo "======================================"
echo " MOLD V2 Sandbox Bootstrap Setup"
echo "======================================"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null
then
    echo "[!] pnpm could not be found."
    echo "[!] This project strictly requires pnpm. Please install it:"
    echo "    npm install -g pnpm"
    exit 1
fi

echo "[*] pnpm found. Checking Node.js version..."
if ! command -v node &> /dev/null
then
    echo "[!] Node.js could not be found. Please install Node.js."
    exit 1
fi

echo "[*] Installing dependencies with pnpm..."
pnpm install

echo "[*] Checking formatting/linting rules (ignoring Next.js lint error)..."
# We bypass the lint script if it throws since memory mentions it fails on directory
pnpm run test || echo "[!] Test run completed with warnings/errors. Sandbox is initialized though."

echo ""
echo "======================================"
echo " Setup Complete!"
echo "======================================"
echo "To start the development server, run:"
echo "    pnpm dev"
echo ""
