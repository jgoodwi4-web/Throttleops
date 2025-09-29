
@echo off
setlocal enabledelayedexpansion
title ThrottleOps One-Click Installer (Windows)

REM ---- Admin seed (edit if desired) ----
set ADMIN_NAME=HeathenWolf
set ADMIN_EMAIL=jgoodwi4@wvup.edu
set ADMIN_PASSWORD=ThrottleBornHeathen2692
REM --------------------------------------

echo === Checking prerequisites ===
where docker >nul 2>&1 || (echo [X] Docker is not installed or not on PATH.& goto :fail)
docker --version >nul 2>&1 || (echo [X] Docker not available. Start Docker Desktop.& goto :fail)
where node >nul 2>&1 || (echo [X] Node.js is not installed or not on PATH.& goto :fail)
where powershell >nul 2>&1 || (echo [X] PowerShell not found.& goto :fail)

echo.
echo === Ensuring config\.env exists ===
if not exist config\.env (
  copy config\.env.example config\.env >nul && echo Created config\.env from example.
) else (
  echo config\.env already present.
)

echo.
echo === Starting stack (docker compose up) ===
docker compose up -d --build
if errorlevel 1 (echo [X] docker compose failed.& goto :fail)

echo.
echo === Waiting for API to be ready ===
powershell -ExecutionPolicy Bypass -File "scripts\wait_for_api.ps1" -Url "http://localhost:5000/api/health" -TimeoutSec 180
if errorlevel 1 (echo [X] API did not become ready in time.& goto :fail)

echo.
echo === Seeding admin user (idempotent) ===
powershell -ExecutionPolicy Bypass -File "scripts\seed_admin.ps1" -Name "
if errorlevel 1 (echo [!] Seeding failed or user exists. Continuing...)

echo.
echo === Opening web app ===
start http://localhost:5173
echo Login: HeathenWolf / ThrottleBornHeathen2692
echo Done!
goto :eof

:fail
echo.
echo Installer encountered a problem. Fix the issue above and run again.
exit /b 1
