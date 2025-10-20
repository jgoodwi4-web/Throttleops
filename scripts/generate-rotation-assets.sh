#!/usr/bin/env bash
# Generates a new JWT secret and prints recommended commands to update local env and GitHub Secrets.
# This script does NOT modify GitHub secrets; it only prints suggested commands.

set -euo pipefail

if ! command -v openssl >/dev/null 2>&1; then
  echo "openssl not found. Install openssl to use this script." >&2
  exit 1
fi

NEW_JWT_SECRET=$(openssl rand -base64 48)
TIMESTAMP=$(date -u +"%Y%m%dT%H%M%SZ")

echo "Generated new JWT_SECRET (store this securely)."
echo
echo "JWT_SECRET=$NEW_JWT_SECRET"
echo
cat <<EOF
Recommended next steps (copy & paste as needed):

1) Update local config/.env (on your machine where you run the app):

  # create a backup first
  cp config/.env config/.env.bak.${TIMESTAMP}
  # set the new JWT_SECRET (replace the placeholder below if needed)
  sed -i '' -e 's/^JWT_SECRET=.*/JWT_SECRET=${NEW_JWT_SECRET}/' config/.env || \
  (echo "JWT_SECRET=${NEW_JWT_SECRET}" >> config/.env)

2) Update GitHub repository secrets (manual step via UI or use gh CLI):

  # with GitHub CLI (replace owner/repo and secret name)
  gh secret set JWT_SECRET -b "${NEW_JWT_SECRET}"
  # also update (if needed) MONGO_URI secret
  # gh secret set MONGO_URI -b "<new-mongo-uri>"

3) Restart services (local or remote):

  # local (backend)
  cd backend
  # if running in foreground, stop and restart: (example)
  npm restart || (pkill -f server.js && npm start &)

  # docker compose on remote/server
  docker compose pull && docker compose up -d --remove-orphans

EOF

# For safety, print the secret only once
exit 0
