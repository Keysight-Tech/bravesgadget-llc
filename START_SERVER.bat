@echo off
echo ========================================
echo BRAVESGADGET LLC - Local Development Server
echo ========================================
echo.
echo Starting server on port 3000...
echo.
cd /d "%~dp0"
python -m http.server 3000
echo.
echo Server stopped.
pause
