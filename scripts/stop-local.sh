#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PIDS_DIR="$REPO_ROOT/scripts/pids"

echo "Stopping local services..."

if [ -f "$PIDS_DIR/backend.pid" ]; then
  PID=$(cat "$PIDS_DIR/backend.pid")
  if kill -0 "$PID" 2>/dev/null; then
    echo "Killing backend (pid $PID)"
    kill "$PID" || true
    sleep 1
  else
    echo "Backend pid $PID not running"
  fi
  rm -f "$PIDS_DIR/backend.pid"
fi

if [ -f "$PIDS_DIR/web_preview.pid" ]; then
  PID=$(cat "$PIDS_DIR/web_preview.pid")
  if kill -0 "$PID" 2>/dev/null; then
    echo "Killing web preview (pid $PID)"
    kill "$PID" || true
    sleep 1
  else
    echo "Web preview pid $PID not running"
  fi
  rm -f "$PIDS_DIR/web_preview.pid"
fi

echo "Stopped. Logs: $REPO_ROOT/backend/nohup_backend.log and $REPO_ROOT/web/nohup_web.log"
