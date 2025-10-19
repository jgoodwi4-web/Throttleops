#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

echo "Deploying ThrottleOps locally with Docker Compose..."

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker CLI not found. Install Docker and ensure the daemon is running." >&2
  exit 2
fi

if ! docker info >/dev/null 2>&1; then
  echo "Error: cannot connect to Docker daemon. Start Docker (e.g. 'sudo systemctl start docker' or open Docker Desktop)." >&2
  exit 3
fi

echo "Building and starting containers (this runs 'docker compose build && docker compose up -d')"
docker compose build
docker compose up -d --remove-orphans

echo "Waiting for API health at http://localhost:5000/api/health ..."
for i in {1..30}; do
  if curl -sS http://localhost:5000/api/health | grep -q '"ok"'; then
    echo "API healthy."
    break
  fi
  sleep 1
done

if ! curl -sS http://localhost:5000/api/health | grep -q '"ok"'; then
  echo "Warning: API did not become healthy in time. Check 'docker compose logs api' and docker status." >&2
  exit 4
fi

echo "Deployment finished. Frontend should be available on the port configured in docker-compose (default 5173)."
