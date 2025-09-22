@echo off
REM Script de déploiement automatique GitHub pour Windows

echo 🚀 Déploiement automatique de Morpion Otaku Battle sur GitHub
echo ==============================================================

REM Vérifier si GitHub CLI est installé
gh --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ GitHub CLI n'est pas installé.
    echo 📥 Téléchargez-le depuis: https://cli.github.com/
    echo 💡 Ou installez avec: winget install --id GitHub.cli
    pause
    exit /b 1
)

REM Vérifier l'authentification GitHub
gh auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Authentification GitHub requise...
    gh auth login
)

echo ✅ GitHub CLI configuré

REM Variables du projet
set REPO_NAME=Morpion-Otaku-Battle
set DESCRIPTION=🎮 Epic anime tic-tac-toe battle game with AI, themes, and advanced features

echo 📦 Création du repository GitHub...
gh repo create "%REPO_NAME%" --public --description "%DESCRIPTION%" --clone=false

echo 🔗 Configuration du remote...
git remote remove origin 2>nul
for /f "tokens=*" %%i in ('gh api user --jq .login') do set USERNAME=%%i
git remote add origin "https://github.com/%USERNAME%/%REPO_NAME%.git"

echo 📤 Push du code...
git push -u origin main

echo ⚙️ Configuration des paramètres du repository...
REM Activer les Issues et Discussions
gh repo edit "%USERNAME%/%REPO_NAME%" --enable-issues --enable-discussions --enable-projects --enable-wiki

echo 🏷️ Création du premier release...
git tag -a v1.0.0 -m "🎮 Morpion Otaku Battle v1.0.0 - Initial Release"
git push origin v1.0.0

gh release create v1.0.0 --title "🎮 Morpion Otaku Battle v1.0.0" --notes "Premier release officiel du jeu ! Téléchargez et jouez immédiatement avec toutes les fonctionnalités avancées." --latest

echo.
echo 🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!
echo ==================================
echo 📂 Repository: https://github.com/%USERNAME%/%REPO_NAME%
echo 🌐 GitHub Pages: https://%USERNAME%.github.io/%REPO_NAME% (sera disponible dans quelques minutes)
echo 📋 Issues: https://github.com/%USERNAME%/%REPO_NAME%/issues
echo 💬 Discussions: https://github.com/%USERNAME%/%REPO_NAME%/discussions
echo.
echo 🎯 Prochaines étapes:
echo 1. Partagez le lien avec la communauté
echo 2. Surveillez les Issues et Pull Requests  
echo 3. Ajoutez des stars et watch le repository
echo.
pause