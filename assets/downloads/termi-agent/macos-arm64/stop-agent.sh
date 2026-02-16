#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$ROOT_DIR/.termi-agent.pid"

if [[ ! -f "$PID_FILE" ]]; then
  echo "No pid file. Nothing to stop."
  exit 0
fi

pid="$(cat "$PID_FILE" 2>/dev/null || true)"
if [[ -n "${pid}" ]] && kill -0 "$pid" >/dev/null 2>&1; then
  echo "Stopping termi-agent (pid $pid)..."
  kill "$pid" >/dev/null 2>&1 || true
fi
rm -f "$PID_FILE"
echo "Stopped."
