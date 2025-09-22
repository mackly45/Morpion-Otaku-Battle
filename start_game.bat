@echo off
REM Morpion Otaku Battle - Windows Startup Script

echo 🎮 Starting Morpion Otaku Battle...
echo 🔍 Checking Python installation...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.7+ and try again.
    echo 📥 Download from: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo ✅ Python found:
python --version

REM Check if pip is installed
pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ pip is not installed. Please install pip and try again.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
pip install -r requirements.txt

echo 🚀 Starting the game server...
echo 🌐 Open your browser and go to: http://localhost:5000
echo 🎯 Press Ctrl+C to stop the server
echo.

python app.py
pause