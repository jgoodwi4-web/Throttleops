y# ThrottleOps — Cross-Platform Full Package

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

## CI / GitHub Actions

A sample GitHub Actions workflow is included at `.github/workflows/ci.yml`. It builds and pushes Docker images for the backend and web to GitHub Container Registry (GHCR) on pushes to `main`, and provides a manual `workflow_dispatch` deploy step which SSHes to a remote server and runs `docker compose pull && docker compose up -d`.

Before using the workflow, add these repository secrets in your GitHub repository settings:

- `SSH_USER` — user to SSH as on the remote host
- `SSH_HOST` — remote host/IP
- `SSH_PORT` — (optional) port (default 22)
- `SSH_PRIVATE_KEY` — private key for SSH (PEM format)
- `REMOTE_PATH` — path on the remote host with the `docker-compose.yml` to run (e.g. `/home/deploy/throttleops`)

The workflow uses the `GITHUB_TOKEN` to authenticate to GHCR by default. If you prefer Docker Hub or another registry, I can adjust the workflow to use repository secrets for registry credentials instead.

### Local Docker Compose deploy

If you prefer to deploy locally via Docker Compose, there's a helper script:

```bash
# Ensure Docker is running, then from repo root:
bash scripts/deploy-local.sh
```

This script runs `docker compose build` and `docker compose up -d`, then polls the API health endpoint. If Docker isn't available in your environment, the script will print a clear error message with next steps.

## Production deployment

This repository includes resources and guidance for deploying ThrottleOps in production.

Files to review
- `config/.env.example.production` — example production environment variables. Copy to `config/.env` and update values (don't commit secrets).
- `docker-compose.prod.yml` — a production-style Compose file that references image names (not local builds).

Recommended production workflow
1. Build and publish images using the included CI workflow (the workflow pushes to GHCR by default or Docker Hub if `DOCKERHUB_USERNAME` is set).
2. On your production host, place `docker-compose.prod.yml` and a `config/.env` containing production values (for example `MONGO_URI` and `JWT_SECRET`).
   - You can download the `deploy-compose` artifact produced by the CI run (it contains a `docker-compose.yml` that references the images built for that commit), or edit `docker-compose.prod.yml` to set the `API_IMAGE` and `WEB_IMAGE` environment variables to the desired image tags.
3. Start the stack on the host:

```bash
# on the production server
cp config/.env.example.production config/.env
# edit config/.env to set JWT_SECRET and MONGO_URI
docker compose -f docker-compose.prod.yml up -d --remove-orphans
```

Security and operational notes
- Never commit `config/.env` with production secrets. Use an external secrets manager or populate the file via CI/automation on the host.
- Use a managed MongoDB (Atlas) or a properly secured Mongo deployment. If using a remote DB, ensure network restrictions are in place.
- Run the services behind a reverse proxy (nginx, Caddy) with TLS. `docker compose` can be combined with a reverse-proxy service or Traefik.
- Monitor logs and set up backups for the `mongo` volume (or use a managed DB with backups).
- Use the CI `deploy` job (requires SSH secrets) to automate pulling new images and restarting the compose stack on your server. Alternatively, download the `deploy-compose` artifact from the Actions run and apply it manually.

Troubleshooting
- If the API doesn't become healthy after deploy, check `docker compose logs api` on the host and verify `MONGO_URI` and `JWT_SECRET` are correct.
- If ports are already in use, change the host ports in `docker-compose.prod.yml` or add a reverse-proxy mapping.

```
