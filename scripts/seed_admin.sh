#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$REPO_ROOT/config/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "No $ENV_FILE found. Create it with JWT_SECRET and MONGO_URI and default PORT if needed." >&2
  exit 1
fi

# Defaults
API_BASE=${API_BASE:-http://localhost:5000}
EMAIL=${ADMIN_EMAIL:-admin@example.com}
PASSWORD=${ADMIN_PASSWORD:-ChangeMe!123}

# If config/.env contains values, try to source ADMIN_EMAIL/ADMIN_PASSWORD if present
if grep -q '^ADMIN_EMAIL=' "$ENV_FILE" 2>/dev/null; then
  ADMIN_EMAIL_VAL=$(grep '^ADMIN_EMAIL=' "$ENV_FILE" | cut -d'=' -f2-)
  EMAIL=${ADMIN_EMAIL_VAL:-$EMAIL}
fi
if grep -q '^ADMIN_PASSWORD=' "$ENV_FILE" 2>/dev/null; then
  ADMIN_PW_VAL=$(grep '^ADMIN_PASSWORD=' "$ENV_FILE" | cut -d'=' -f2-)
  PASSWORD=${ADMIN_PW_VAL:-$PASSWORD}
fi

echo "Seeding admin user -> $API_BASE/api/auth/register"
echo " email: $EMAIL"

resp=$(curl -sS -w "\n%{http_code}" -X POST "$API_BASE/api/auth/register" -H 'Content-Type: application/json' -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}") || true
body=$(echo "$resp" | sed '$d')
code=$(echo "$resp" | tail -n1)

if [ "$code" = "200" ] || [ "$code" = "201" ]; then
  echo "Seed succeeded: $body"
  exit 0
else
  echo "Seed failed (HTTP $code): $body" >&2
  exit 2
fi
