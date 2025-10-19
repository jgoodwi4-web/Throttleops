#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "Installing dependencies for backend and web..."

cd "$REPO_ROOT/backend"
npm install --no-audit --no-fund

cd "$REPO_ROOT/web"
npm install --no-audit --no-fund

echo "Dependencies installed."

# Optional admin seed step: use existing PowerShell seed if available (Windows) or prompt for manual seeding.
if [ -f "$REPO_ROOT/scripts/seed_admin.ps1" ]; then
  echo "Found scripts/seed_admin.ps1. If you want to run it, run it from PowerShell."
else
  echo "No automatic admin seed script for POSIX found. To create an admin user, either use the app's register flow or run the provided seed script on Windows PowerShell if available."
fi

echo "Done. You can start services with: bash scripts/start-local.sh"
