@echo off
REM 🚀 Déploiement Cloud Automatique - Morpion Otaku Battle (Windows)
REM Ce script configure et déploie votre jeu sur plusieurs services cloud gratuits

title Morpion Otaku Battle - Deploiement Cloud

echo 🎮 Morpion Otaku Battle - Deploiement Cloud
echo =============================================
echo.

REM Verification des prerequis
echo 🔍 Verification des prerequis...

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git n'est pas installe
    echo 💡 Installez Git depuis: https://git-scm.com/
    pause
    exit /b 1
)

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ Node.js non detecte - certaines options seront limitees
    echo 💡 Installez Node.js depuis: https://nodejs.org/
)

echo ✅ Prerequisites verifies
echo.

REM Menu de selection
:menu
echo 🌐 Choisissez votre service de deploiement:
echo 1. 🌟 Vercel (Recommande - Tres simple)
echo 2. 🚀 Netlify (Glisser-deposer)
echo 3. 🐙 GitHub Pages (Deja configure)
echo 4. 🔥 Firebase Hosting
echo 5. 📋 Voir toutes les options
echo.
set /p choice="Votre choix (1-5): "

if "%choice%"=="1" goto vercel
if "%choice%"=="2" goto netlify
if "%choice%"=="3" goto github_pages
if "%choice%"=="4" goto firebase
if "%choice%"=="5" goto all_options
echo ❌ Choix invalide
goto menu

:vercel
echo.
echo 🌟 Deploiement Vercel
echo ====================
echo.

where vercel >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo 🚀 Deploiement automatique avec Vercel CLI...
    vercel --prod
) else (
    echo 📋 Instructions de deploiement Vercel:
    echo.
    echo 1. 🌐 Allez sur: https://vercel.com
    echo 2. 🔗 Connectez votre compte GitHub
    echo 3. ➕ Cliquez 'New Project'
    echo 4. 📂 Selectionnez votre repo 'Morpion-Otaku-Battle'
    echo 5. ⚙️ Configuration automatique detectee (vercel.json)
    echo 6. 🚀 Cliquez 'Deploy'
    echo.
    echo 🎯 Votre jeu sera accessible via:
    echo    https://morpion-otaku-battle.vercel.app
    echo.
    echo 💡 Installation CLI (optionnel):
    echo    npm i -g vercel
)
goto end

:netlify
echo.
echo 🚀 Deploiement Netlify
echo ======================
echo.

where netlify >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo 🚀 Deploiement automatique avec Netlify CLI...
    netlify deploy --prod --dir=view
) else (
    echo 📋 Instructions de deploiement Netlify:
    echo.
    echo Methode 1 - Glisser-Deposer (Plus simple):
    echo 1. 🌐 Allez sur: https://netlify.com
    echo 2. 📁 Compressez le dossier 'view' en ZIP
    echo 3. 🖱️ Glissez-deposez le ZIP sur Netlify
    echo 4. 🎯 URL generee automatiquement
    echo.
    echo Methode 2 - GitHub Integration:
    echo 1. 🔗 Connectez GitHub a Netlify
    echo 2. 📂 Selectionnez 'Morpion-Otaku-Battle'
    echo 3. ⚙️ Build settings: dir='view'
    echo 4. 🚀 Deploy automatique
    echo.
    echo 💡 Installation CLI (optionnel):
    echo    npm i -g netlify-cli
)
goto end

:github_pages
echo.
echo 🐙 GitHub Pages
echo ===============
echo.
echo ✅ GitHub Pages est deja configure dans votre workflow!
echo.
echo 📋 Pour activer:
echo 1. 🌐 Allez sur votre repo GitHub
echo 2. ⚙️ Settings ^> Pages
echo 3. 🔧 Source: 'GitHub Actions'
echo 4. 🚀 Le workflow se declenchera automatiquement
echo.
echo 🎯 Votre jeu sera accessible via:
echo    https://mackly45.github.io/Morpion-Otaku-Battle
echo.
echo 💡 Deploiement automatique a chaque push sur main!
goto end

:firebase
echo.
echo 🔥 Firebase Hosting
echo ==================
echo.

where firebase >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo 🚀 Configuration Firebase...
    firebase init hosting
    firebase deploy
) else (
    echo 📋 Instructions de deploiement Firebase:
    echo.
    echo 1. 🌐 Allez sur: https://console.firebase.google.com
    echo 2. ➕ Creez un nouveau projet
    echo 3. 🏠 Activez 'Hosting'
    echo 4. 💻 Installez Firebase CLI:
    echo    npm i -g firebase-tools
    echo 5. 🔑 Connectez-vous:
    echo    firebase login
    echo 6. 🚀 Initialisez et deployez:
    echo    firebase init hosting
    echo    firebase deploy
    echo.
    echo 🎯 URL finale: https://VOTRE-PROJET.web.app
)
goto end

:all_options
echo.
echo 📋 Tous les Services Cloud Gratuits
echo ==================================
echo.
echo 🌟 Vercel:
echo    ✅ Le plus simple a utiliser
echo    ✅ Domaine gratuit inclus
echo    ✅ SSL automatique
echo    ✅ Deploiement en 1 clic
echo    🌐 https://vercel.com
echo.
echo 🚀 Netlify:
echo    ✅ Glisser-deposer super simple
echo    ✅ 100GB bandwidth/mois
echo    ✅ Formulaires integres
echo    🌐 https://netlify.com
echo.
echo 🐙 GitHub Pages:
echo    ✅ Deja configure dans votre repo
echo    ✅ Deploiement automatique
echo    ✅ Gratuit illimite
echo    🌐 Active dans Settings ^> Pages
echo.
echo 🔥 Firebase:
echo    ✅ Infrastructure Google
echo    ✅ Tres rapide mondialement
echo    ✅ 10GB gratuit
echo    🌐 https://firebase.google.com
echo.
echo ☁️ Autres options:
echo    • Surge.sh (surge.sh)
echo    • Render.com (render.com)
echo    • Railway.app (railway.app)
echo    • Heroku (limite: 550h/mois)
echo.
pause
goto menu

:end
echo.
echo 🎉 Instructions de deploiement affichees!
echo 🌐 Votre jeu sera bientot accessible mondialement
echo 📱 Compatible mobile et desktop
echo 🚀 Pret pour la communaute anime!
echo.
pause