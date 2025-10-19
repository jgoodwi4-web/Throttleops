#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PIDS_DIR="$REPO_ROOT/scripts/pids"
mkdir -p "$PIDS_DIR"

echo "Starting local services from $REPO_ROOT"

# Start backend on PORT (default 5000)
PORT=${PORT:-5000}
if ss -ltnp 2>/dev/null | grep -q ":$PORT\b"; then
  echo "Backend already listening on port $PORT, skipping start."
else
  echo "Starting backend on port $PORT..."
  nohup bash -lc "cd '$REPO_ROOT/backend' && PORT=$PORT node server.js" >"$REPO_ROOT/backend/nohup_backend.log" 2>&1 &
  echo $! >"$PIDS_DIR/backend.pid"
  echo "Backend started (pid $(cat $PIDS_DIR/backend.pid)). Log: $REPO_ROOT/backend/nohup_backend.log"
fi

# Wait for backend readiness (poll /api/health) - configurable
HEALTH_TIMEOUT=${HEALTH_TIMEOUT:-20}
HEALTH_INTERVAL=${HEALTH_INTERVAL:-1}
echo "Waiting for backend to become healthy on http://localhost:$PORT/api/health (timeout ${HEALTH_TIMEOUT}s) ..."
end=$((SECONDS + HEALTH_TIMEOUT))
while [ $SECONDS -le $end ]; do
  if curl -sS "http://localhost:$PORT/api/health" | grep -q '"ok"'; then
    echo "Backend healthy."
    break
  fi
  sleep $HEALTH_INTERVAL
done
if ! curl -sS "http://localhost:$PORT/api/health" | grep -q '"ok"'; then
  echo "Warning: backend did not become healthy within timeout ($HEALTH_TIMEOUT s). Check $REPO_ROOT/backend/nohup_backend.log"
fi

# Start frontend preview using Vite preview on preferred port (default 5173)
FPORT=${FPORT:-5173}
if ss -ltnp 2>/dev/null | grep -q ":$FPORT\b"; then
  echo "Port $FPORT already in use; starting Vite preview and letting it choose an available port."
  nohup bash -lc "cd '$REPO_ROOT/web' && npm run preview --silent" >"$REPO_ROOT/web/nohup_web.log" 2>&1 &
else
  echo "Starting Vite preview on preferred port $FPORT..."
  nohup bash -lc "cd '$REPO_ROOT/web' && npm run preview --silent -- --port $FPORT" >"$REPO_ROOT/web/nohup_web.log" 2>&1 &
fi
echo $! >"$PIDS_DIR/web_preview.pid"
echo "Frontend preview started (pid $(cat $PIDS_DIR/web_preview.pid)). Log: $REPO_ROOT/web/nohup_web.log"

echo "Done. Use scripts/stop-local.sh to stop these processes." 
