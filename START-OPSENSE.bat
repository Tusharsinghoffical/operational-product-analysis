@echo off
title OpSense - Start Both Servers
color 0A

echo ========================================
echo    OpSense - AI Operational Intelligence
echo ========================================
echo.
echo Starting BOTH servers...
echo.

:: Initialize databases if needed
echo [0/2] Checking databases...
if not exist "%~dp0backend\user_databases" (
    echo    First-time setup: Creating user databases...
    cd /d %~dp0backend
    python import_old_data.py 2>nul
    cd /d %~dp0
    echo    Database setup complete!
    echo.
)

:: Start Backend in a new window
echo [1/2] Starting Backend Server...
start "OpSense Backend (Port 8000)" cmd /k "cd /d %~dp0backend && echo ======================================== && echo    OpSense Backend Server && echo ======================================== && echo. && echo Database: user_databases/ && echo Users: Multi-database system && echo. && echo Starting server... && echo. && python -m uvicorn app.main:app --port 8000"
timeout /t 3 /nobreak >nul

:: Start Frontend in a new window  
echo [2/2] Starting Frontend Server...
start "OpSense Frontend (Port 3000/3001)" cmd /k "cd /d %~dp0frontend && echo ======================================== && echo    OpSense Frontend Server && echo ======================================== && echo. && echo Theme: White & echo Starting server... && echo. && npm run dev"

echo.
echo ========================================
echo    Servers are starting...
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000 (or 3001)
echo.
echo Features:
echo   - Multi-database system
echo   - User data isolation
echo   - White theme UI
echo   - AI-powered insights
echo.
echo Wait for both servers to show "Ready" messages,
echo then open http://localhost:3000 in your browser.
echo.
echo Press any key to exit this window...
pause >nul