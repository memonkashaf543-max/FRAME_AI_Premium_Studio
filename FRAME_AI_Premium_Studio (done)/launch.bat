@echo off
cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel%==0 (
  start "FRAME StudioAI Backend" cmd /k "node server.js"
  timeout /t 2 >nul
  start "" "http://localhost:8000/"
  exit /b
)

where py >nul 2>nul
if %errorlevel%==0 (
  start "FRAME AI Server" cmd /k "py -m http.server 8000"
  timeout /t 2 >nul
  start "" "http://localhost:8000/"
  exit /b
)

where python >nul 2>nul
if %errorlevel%==0 (
  start "FRAME AI Server" cmd /k "python -m http.server 8000"
  timeout /t 2 >nul
  start "" "http://localhost:8000/"
  exit /b
)

echo Opening FRAME AI Studio directly in default browser...
start "" "index.html"
