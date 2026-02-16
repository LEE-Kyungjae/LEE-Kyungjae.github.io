#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$ROOT_DIR/.termi-env"
PID_FILE="$ROOT_DIR/.termi-agent.pid"
LOG_FILE="$ROOT_DIR/.termi-agent.log"
BIN_PATH="$ROOT_DIR/termi-agent-bin"

if [[ ! -x "$BIN_PATH" ]]; then
  echo "ERROR: termi-agent-bin not found or not executable"
  exit 1
fi

gen_token() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex 24 2>/dev/null | tr -d '\n'
    return 0
  fi
  date +%s
}

if [[ ! -f "$ENV_FILE" ]]; then
  ADMIN_TOKEN="$(gen_token)"
  cat >"$ENV_FILE" <<EOT
TERMI_ADDR=0.0.0.0:8787
TERMI_ADMIN_TOKEN=$ADMIN_TOKEN
TERMI_HTTP_ALLOWED_CIDRS=127.0.0.1/32,::1/128,100.64.0.0/10,192.168.0.0/16,10.0.0.0/8,172.16.0.0/12
TERMI_WS_ALLOWED_CIDRS=100.64.0.0/10,192.168.0.0/16,10.0.0.0/8,172.16.0.0/12
TERMI_OUTPUT_MODE=snapshot
TERMI_CAPTURE_LINES=2000
EOT
  echo "Created $ENV_FILE"
fi

if [[ -f "$PID_FILE" ]]; then
  old_pid="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "${old_pid}" ]] && kill -0 "$old_pid" >/dev/null 2>&1; then
    echo "termi-agent already running (pid $old_pid)"
    exit 0
  fi
  rm -f "$PID_FILE"
fi

set -a
source "$ENV_FILE"
set +a

nohup "$BIN_PATH" >>"$LOG_FILE" 2>&1 &
pid="$!"
disown "$pid" >/dev/null 2>&1 || true
echo "$pid" > "$PID_FILE"

echo "Started termi-agent (pid $pid)"
echo "Local URL:     http://127.0.0.1:8787"
if command -v tailscale >/dev/null 2>&1; then
  TS_IP="$(tailscale ip -4 2>/dev/null | head -n 1 | tr -d '\r' || true)"
  if [[ "$TS_IP" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Tailscale URL: http://$TS_IP:8787"
  fi
fi
