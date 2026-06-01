@echo off
title OpSense Backend Server
color 0B

echo ========================================
echo    OpSense Backend Server
echo ========================================
echo.
echo Configuration:
echo   - Port: 8000
echo   - Database: user_databases/
echo   - Auth: JWT Token-based
echo   - System: Multi-database (per user)
echo.
echo Database Structure:
echo   user_databases/
echo     users.db    - User accounts
echo     user_1.db   - User 1 data
echo     user_2.db   - User 2 data
echo     ...
echo.
echo Starting server...
echo.

cd /d %~dp0backend
python -m uvicorn app.main:app --reload --port 8000

echo.
echo Server stopped.
pause
