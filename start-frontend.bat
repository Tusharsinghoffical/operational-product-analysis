@echo off
title OpSense Frontend Server
color 0A

echo ========================================
echo    OpSense Frontend Server
echo ========================================
echo.
echo Configuration:
echo   - Port: 3000 (or 3001)
echo   - Theme: White
echo   - Framework: Next.js 14
echo.
echo Features:
echo   - Multi-user support
echo   - Data isolation
echo   - Real-time updates
echo   - AI-powered insights
echo.
echo Starting server...
echo.

cd /d %~dp0frontend
npm run dev

echo.
echo Server stopped.
pause
