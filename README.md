# ThrottleOps — Cross-Platform Full Package

Includes:
- Backend API (Node/Express/Mongo) with: Auth, Drivers, Vehicles, Loads, Invoices, Incidents, Driver Logs (HOS), Weight Reference
- Frontend (React + Vite) screens: Login, Dashboard, Drivers, Vehicles, Loads, Logs (graph), Tools (calculator + reference), Register
- One-click scripts for **Windows** and **Linux/macOS** with admin seeding

## Quick Start
1. Install **Docker Desktop** and **Node.js 20+**.
2. Copy `config/.env.example` → `config/.env` and set `JWT_SECRET`.
3. Run an installer:
   - Windows: `scripts\install.bat`
   - Linux/macOS: `bash scripts/install.sh`
4. Open http://localhost:5173 (API: http://localhost:5000)

### Default seeded admin (you can change in the scripts):
- Email: `admin@example.com`
- Password: `ChangeMe!123`

> If ports 5000/5173 are busy, edit them in `docker-compose.yml` before installing.

## Local convenience scripts

There are small helper scripts under `scripts/` to make local development easier:

- `scripts/start-local.sh` — starts the backend (default PORT=5000) and the built frontend preview (preferred FPORT=5173). It writes logs to `backend/nohup_backend.log` and `web/nohup_web.log` and stores PIDs under `scripts/pids`.
- `scripts/stop-local.sh` — stops the processes started by `start-local.sh` (kills stored PIDs) and shows log locations.
- `scripts/preview-frontend.sh` — runs `npm run preview` for the frontend in the foreground (useful for debugging). Example: `FPORT=5173 bash scripts/preview-frontend.sh`.

- `scripts/install-local.sh` — installs Node dependencies in `backend/` and `web/` (POSIX). Run this once after cloning to install packages.

The `start-local.sh` script now waits for the backend to report healthy (`/api/health`) before returning. The `preview-frontend.sh` will fail fast if the requested `FPORT` is already in use so you can choose another port.

Usage examples:

```bash
# Start backend + preview (will pick an available preview port if 5173 is busy)
bash scripts/start-local.sh

# Stop services started by the script
bash scripts/stop-local.sh

# Start frontend preview in foreground on a specific port
FPORT=5173 bash scripts/preview-frontend.sh
```

Makefile and npm scripts

You can also use the included `Makefile` or top-level `package.json` scripts as shortcuts:

```bash
# Install deps
make install
# Start services
make start
# Stop services
make stop
# Preview frontend
make preview
# Seed admin user (POSIX)
make seed

# Or with npm scripts
npm run install-local
npm run start-local
npm run stop-local
npm run preview-frontend
npm run seed-admin
```

