@echo off
REM 🏷️ GitHub Labels Setup Script for Windows
REM This script automatically creates organized labels for your repository

echo 🚀 Setting up GitHub Labels for Morpion Otaku Battle...

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
echo 🏷️ Creating repository labels...

REM Bug labels
gh label create "bug" --color "d73a4a" --description "Something isn't working" --force >nul 2>nul
gh label create "critical bug" --color "b60205" --description "Critical bug that breaks core functionality" --force >nul 2>nul
gh label create "minor bug" --color "ff9f9f" --description "Minor bug that doesn't affect core functionality" --force >nul 2>nul

REM Feature labels
gh label create "enhancement" --color "a2eeef" --description "New feature or request" --force >nul 2>nul
gh label create "feature request" --color "1f77d4" --description "Request for new game feature" --force >nul 2>nul
gh label create "anime character" --color "ff69b4" --description "New anime character request" --force >nul 2>nul
gh label create "ui/ux" --color "7b68ee" --description "User interface and experience improvements" --force >nul 2>nul

REM Documentation labels
gh label create "documentation" --color "0075ca" --description "Improvements or additions to documentation" --force >nul 2>nul
gh label create "wiki" --color "0366d6" --description "Wiki documentation updates" --force >nul 2>nul
gh label create "readme" --color "5dade2" --description "README file updates" --force >nul 2>nul

REM Technical labels
gh label create "dependencies" --color "0366d6" --description "Pull requests that update a dependency file" --force >nul 2>nul
gh label create "security" --color "ee0701" --description "Security related issues or improvements" --force >nul 2>nul
gh label create "performance" --color "fbca04" --description "Performance improvements" --force >nul 2>nul
gh label create "refactoring" --color "c5def5" --description "Code refactoring without functional changes" --force >nul 2>nul

REM Game-specific labels
gh label create "ai" --color "28a745" --description "AI player functionality" --force >nul 2>nul
gh label create "gameplay" --color "ffa500" --description "Core game mechanics" --force >nul 2>nul
gh label create "visual effects" --color "9932cc" --description "Visual effects and animations" --force >nul 2>nul
gh label create "sound" --color "ff6347" --description "Sound effects and music" --force >nul 2>nul

REM Priority labels
gh label create "priority: high" --color "b60205" --description "High priority issue" --force >nul 2>nul
gh label create "priority: medium" --color "fbca04" --description "Medium priority issue" --force >nul 2>nul
gh label create "priority: low" --color "0e8a16" --description "Low priority issue" --force >nul 2>nul

REM Status labels
gh label create "status: in progress" --color "0052cc" --description "Currently being worked on" --force >nul 2>nul
gh label create "status: needs review" --color "006b75" --description "Needs code review" --force >nul 2>nul
gh label create "status: blocked" --color "d93f0b" --description "Blocked by other issues or dependencies" --force >nul 2>nul
gh label create "status: won't fix" --color "ffffff" --description "This will not be worked on" --force >nul 2>nul

REM Special labels
gh label create "good first issue" --color "7057ff" --description "Good for newcomers" --force >nul 2>nul
gh label create "help wanted" --color "008672" --description "Extra attention is needed" --force >nul 2>nul
gh label create "question" --color "d876e3" --description "Further information is requested" --force >nul 2>nul
gh label create "duplicate" --color "cfd3d7" --description "This issue or pull request already exists" --force >nul 2>nul
gh label create "invalid" --color "e4e669" --description "This doesn't seem right" --force >nul 2>nul

echo 🎉 All labels created successfully!
echo 🏷️ Your repository now has organized labels for better issue management.
echo.
echo 📋 Label Categories Created:
echo    🐛 Bug Labels (3)
echo    ✨ Feature Labels (4)
echo    📚 Documentation Labels (3)
echo    🔧 Technical Labels (4)
echo    🎮 Game-Specific Labels (4)
echo    🎯 Priority Labels (3)
echo    📊 Status Labels (4)
echo    🌟 Special Labels (5)
echo.
echo 🔗 View labels in your repository on GitHub
pause