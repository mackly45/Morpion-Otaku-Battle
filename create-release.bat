@echo off
REM 🚀 Manual Release Creator - Morpion Otaku Battle (Windows)
REM This script creates a release manually if the automated workflow fails

title Morpion Otaku Battle - Manual Release Creator

echo 🎮 Morpion Otaku Battle - Manual Release Creator
echo ===============================================
echo.

REM Check if GitHub CLI is installed
where gh >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ GitHub CLI (gh) is not installed.
    echo Please install it from: https://cli.github.com/
    echo Then run: gh auth login
    pause
    exit /b 1
)

REM Check if authenticated
gh auth status >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Please authenticate with GitHub CLI first:
    echo Run: gh auth login
    pause
    exit /b 1
)

echo ✅ GitHub CLI is ready!
echo.

REM Get current version
if exist "VERSION" (
    set /p CURRENT_VERSION=<VERSION
) else (
    set CURRENT_VERSION=1.0.0
)

echo 📋 Current version: %CURRENT_VERSION%
echo.

REM Ask for new version
set /p NEW_VERSION="🔢 Enter new version (or press Enter for auto-increment): "

if "%NEW_VERSION%"=="" (
    REM Auto increment patch version
    for /f "tokens=1,2,3 delims=." %%a in ("%CURRENT_VERSION%") do (
        set MAJOR=%%a
        set MINOR=%%b
        set /a PATCH=%%c+1
    )
    set NEW_VERSION=%MAJOR%.%MINOR%.%PATCH%
    echo 🔄 Auto-incremented to: %NEW_VERSION%
)

REM Check if version already exists
gh release view "v%NEW_VERSION%" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ❌ Release v%NEW_VERSION% already exists!
    echo 📋 Existing releases:
    gh release list --limit 5
    pause
    exit /b 1
)

echo.
echo 🚀 Creating release v%NEW_VERSION%...

REM Update VERSION file
echo %NEW_VERSION%> VERSION

REM Create release notes
(
echo # 🎮 Morpion Otaku Battle v%NEW_VERSION%
echo.
echo ## 🚀 What's New
echo.
echo - Manual release v%NEW_VERSION%
echo - Bug fixes and improvements
echo - Enhanced cloud deployment support
echo - Better GitHub Actions integration
echo.
echo ## 🎯 Game Features
echo - 🤖 Advanced AI with multiple difficulty levels
echo - 🎨 24+ anime characters with unique abilities
echo - ⚡ Visual effects and animations
echo - 🏆 Evolution and progression system
echo - 🎵 Sound effects and background music
echo - 📱 Responsive design for all devices
echo.
echo ## 🛠️ Installation
echo.
echo ```bash
echo git clone https://github.com/mackly45/Morpion-Otaku-Battle.git
echo cd Morpion-Otaku-Battle
echo pip install -r requirements.txt
echo python app.py
echo ```
echo.
echo ## 🌐 Play Online
echo.
echo 🎮 **Live Demo:** https://mackly45.github.io/Morpion-Otaku-Battle/
echo.
echo ## 🎯 Cloud Deployment
echo.
echo Deploy for free on:
echo - 🌟 **Vercel:** vercel.com
echo - 🚀 **Netlify:** netlify.com
echo - 🐙 **GitHub Pages:** Already configured!
echo - 🔥 **Firebase:** firebase.google.com
echo.
echo See `CLOUD_DEPLOYMENT.md` for detailed instructions.
echo.
echo ---
echo.
echo Ready to battle with your favorite anime characters! 🥊✨
) > TEMP_RELEASE_NOTES.md

REM Create the release
echo 📦 Creating GitHub release...
gh release create "v%NEW_VERSION%" --title "🎮 Morpion Otaku Battle v%NEW_VERSION%" --notes-file TEMP_RELEASE_NOTES.md --latest

if %ERRORLEVEL% EQU 0 (
    echo ✅ Release v%NEW_VERSION% created successfully!
    
    REM Commit version update
    git add VERSION
    git commit -m "🔖 Bump version to %NEW_VERSION%" 2>nul
    git push origin main 2>nul || echo ⚠️ Could not push version update to main branch
    
    echo.
    echo 🎉 Release complete!
    echo 📦 Downloads will be available shortly
    echo 🌐 Your game is ready for the community!
) else (
    echo ❌ Failed to create release
    echo 🔍 Check the error above and try again
)

REM Cleanup
del TEMP_RELEASE_NOTES.md 2>nul

echo.
echo 🎮 Happy gaming! Your anime tic-tac-toe battle awaits! ⚔️
pause