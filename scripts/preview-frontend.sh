#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FPORT=${FPORT:-5173}

echo "Starting Vite preview from $REPO_ROOT/web (preferred port $FPORT)"
if ss -ltnp 2>/dev/null | grep -q ":$FPORT\b"; then
	echo "Error: port $FPORT is already in use. Specify a different FPORT or stop the occupying process."
	exit 1
fi

cd "$REPO_ROOT/web"
npm run preview -- --port "$FPORT"
