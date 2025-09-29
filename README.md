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
