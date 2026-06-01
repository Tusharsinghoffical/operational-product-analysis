@echo off
title OpSense Database Manager
color 0E

:MENU
cls
echo ========================================
echo    OpSense Database Manager
echo ========================================
echo.
echo Database Options:
echo.
echo   1. View database statistics
echo   2. View all users
echo   3. Create database for new user
echo   4. Import old database data
echo   5. Backup all databases
echo   6. View database files
echo   7. Reset all databases (WARNING!)
echo.
echo   0. Exit
echo.
echo ========================================
echo.

set /p choice="Enter your choice (0-7): "

if "%choice%"=="1" goto STATS
if "%choice%"=="2" goto VIEW_USERS
if "%choice%"=="3" goto CREATE_DB
if "%choice%"=="4" goto IMPORT
if "%choice%"=="5" goto BACKUP
if "%choice%"=="6" goto VIEW_FILES
if "%choice%"=="7" goto RESET
if "%choice%"=="0" goto END
goto MENU

:STATS
cls
echo ========================================
echo    Database Statistics
echo ========================================
echo.
cd /d %~dp0backend
python view_db.py
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:VIEW_USERS
cls
echo ========================================
echo    Registered Users
echo ========================================
echo.
cd /d %~dp0backend
python -c "from app.database.db import get_shared_db; from app.models.user_model import User; db = next(get_shared_db()); users = db.query(User).all(); [print(f'ID: {u.id}, Name: {u.name}, Email: {u.email}') for u in users]; db.close()"
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:CREATE_DB
cls
echo ========================================
echo    Create User Database
echo ========================================
echo.
set /p user_id="Enter User ID: "
cd /d %~dp0backend
python -c "from app.database.db import create_user_database; create_user_database(%user_id%); print(f'Database created for user %user_id%')"
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:IMPORT
cls
echo ========================================
echo    Import Old Database
echo ========================================
echo.
echo This will import data from opsense.db
echo to the new multi-database system.
echo.
set /p confirm="Continue? (y/n): "
if /i "%confirm%"=="y" (
    cd /d %~dp0backend
    python import_old_data.py
    echo.
    echo Import complete!
) else (
    echo Import cancelled.
)
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:BACKUP
cls
echo ========================================
echo    Backup Databases
echo ========================================
echo.
set datetime=%date:~-4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set datetime=%datetime: =0%
set backup_dir=%~dp0backend\database_backup_%datetime%
echo Creating backup in: %backup_dir%
echo.
mkdir "%backup_dir%"
xcopy "%~dp0backend\user_databases\*.*" "%backup_dir%\" /E /I /Y
echo.
echo Backup completed successfully!
echo Location: %backup_dir%
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:VIEW_FILES
cls
echo ========================================
echo    Database Files
echo ========================================
echo.
echo Database location:
echo   %~dp0backend\user_databases\
echo.
echo Files:
dir %~dp0backend\user_databases\*.db /B
echo.
echo Total size:
dir %~dp0backend\user_databases\*.db | find "File(s)"
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:RESET
cls
echo ========================================
echo    WARNING: Reset All Databases
echo ========================================
echo.
echo This will DELETE all user databases!
echo This action CANNOT be undone!
echo.
set /p confirm="Type 'DELETE' to confirm: "
if "%confirm%"=="DELETE" (
    echo.
    echo Deleting all databases...
    rmdir /s /q "%~dp0backend\user_databases"
    echo.
    echo All databases deleted!
    echo Run import_old_data.py to restore from old database.
) else (
    echo Reset cancelled.
)
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:END
cls
echo ========================================
echo    OpSense Database Manager
echo ========================================
echo.
echo Thank you for using OpSense!
echo.
timeout /t 2 >nul
exit
