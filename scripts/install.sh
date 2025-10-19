#!/usr/bin/env bash
set -e

ADMIN_NAME="${ADMIN_NAME:-HeathenWolf}"
ADMIN_EMAIL="${ADMIN_EMAIL:-jgoodwi4@wvup.edu}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-ThrottleBornHeathen2692}"

echo "== Checking prerequisites =="
command -v docker >/dev/null || { echo "[X] Docker not found"; exit 1; }
docker --version >/dev/null || { echo "[X] Docker not running"; exit 1; }
command -v node >/dev/null || { echo "[X] Node.js not found"; exit 1; }
command -v curl >/dev/null || { echo "[X] curl not found"; exit 1; }

echo "== Ensuring config/.env exists =="
if [ ! -f config/.env ]; then
  cp config/.env.example config/.env
  echo "Created config/.env from example."
fi

echo "== Starting stack =="
docker compose up -d --build

echo "== Waiting for API http://localhost:5000 =="
deadline=$((SECONDS+180))
until curl -sf http://localhost:5000/api/health >/dev/null; do
  if [ $SECONDS -gt $deadline ]; then echo "[X] API didn't start in time"; exit 1; fi
  sleep 1
done
echo "API ready."

echo "== Seeding admin (idempotent) =="
set +e
code=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -d "{"name":"$ADMIN_NAME","email":"$ADMIN_EMAIL","password":"$ADMIN_PASSWORD","role":"admin"}" http://localhost:5000/api/auth/register)
set -e
if [ "$code" = "201" ]; then echo "Admin created: $ADMIN_EMAIL"; else echo "Admin exists or seeding failed (HTTP $code)."; fi

URL="http://localhost:5173"
echo "Open $URL"
if command -v xdg-open >/dev/null; then xdg-open "$URL"; elif command -v open >/dev/null; then open "$URL"; fi

echo "Login with: jgoodwi4@wvup.edu / ThrottleBornHeathen2692"
