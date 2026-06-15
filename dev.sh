#!/usr/bin/env bash
# ============================================================
# Solidcare Web v2 – local development startup script
# Run from: solidcare-web-v2/
# ============================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ENV_FILE=".env"

# ── Colours ──────────────────────────────────────────────────
GREEN="\033[0;32m"; YELLOW="\033[1;33m"; RED="\033[0;31m"; NC="\033[0m"
info()    { echo -e "${GREEN}[WEB]${NC} $*"; }
warn()    { echo -e "${YELLOW}[WEB]${NC} $*"; }
error()   { echo -e "${RED}[WEB]${NC} $*"; exit 1; }

# ── Check Node / npm ─────────────────────────────────────────
if ! command -v node &>/dev/null; then
  error "node not found. Please install Node.js 18+."
fi

NODE_VER=$(node -e "process.stdout.write(process.versions.node)")
info "Using Node.js v${NODE_VER}"

# Prefer pnpm → yarn → npm
if command -v pnpm &>/dev/null; then
  PKG_MGR="pnpm"
elif command -v yarn &>/dev/null; then
  PKG_MGR="yarn"
else
  PKG_MGR="npm"
fi
info "Using package manager: ${PKG_MGR}"

# ── Environment file ──────────────────────────────────────────
if [ ! -f "$ENV_FILE" ]; then
  if [ -f ".env.example" ]; then
    warn ".env not found — copying from .env.example"
    cp .env.example "$ENV_FILE"
  else
    warn ".env not found and no .env.example available. Continuing with Vite defaults."
  fi
fi

# ── Install dependencies ──────────────────────────────────────
if [ ! -d "node_modules" ]; then
  info "node_modules not found — installing dependencies …"
  $PKG_MGR install
else
  info "node_modules found — skipping install (run '$PKG_MGR install' manually if needed)."
fi

# ── Type-check (optional, non-blocking) ──────────────────────
if [ "${TYPE_CHECK:-false}" = "true" ]; then
  info "Running TypeScript type-check …"
  $PKG_MGR run type-check || warn "Type errors detected — fix them before building for production."
fi

# ── Start Vite dev server ─────────────────────────────────────
PORT="${PORT:-5173}"
info "Starting Vite dev server on http://localhost:${PORT} …"

exec $PKG_MGR run dev -- --port "$PORT"
