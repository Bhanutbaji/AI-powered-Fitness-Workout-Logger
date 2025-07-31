@echo off
echo Stopping any existing backend processes...
taskkill /f /im node.exe 2>nul
echo.
echo Starting AI Fitness Logger Backend Server...
echo.
cd backend
echo Current directory: %CD%
echo.
echo Starting server on port 3001...
node index.js
pause 