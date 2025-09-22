#!/bin/bash

# 🚀 Déploiement Cloud Automatique - Morpion Otaku Battle
# Ce script configure et déploie votre jeu sur plusieurs services cloud gratuits

echo "🎮 Morpion Otaku Battle - Déploiement Cloud"
echo "============================================="
echo ""

# Fonction pour vérifier les prérequis
check_requirements() {
    echo "🔍 Vérification des prérequis..."
    
    # Vérifier Git
    if ! command -v git &> /dev/null; then
        echo "❌ Git n'est pas installé"
        exit 1
    fi
    
    # Vérifier Node.js (pour Vercel/Netlify CLI)
    if ! command -v node &> /dev/null; then
        echo "⚠️ Node.js non détecté - certaines options seront limitées"
        echo "💡 Installez Node.js depuis: https://nodejs.org/"
    fi
    
    echo "✅ Prérequis vérifiés"
    echo ""
}

# Menu de sélection du service
select_service() {
    echo "🌐 Choisissez votre service de déploiement:"
    echo "1. 🌟 Vercel (Recommandé - Très simple)"
    echo "2. 🚀 Netlify (Glisser-déposer)"
    echo "3. 🐙 GitHub Pages (Déjà configuré)"
    echo "4. 🔥 Firebase Hosting"
    echo "5. 📋 Voir toutes les options"
    echo ""
    read -p "Votre choix (1-5): " choice
    
    case $choice in
        1) deploy_vercel ;;
        2) deploy_netlify ;;
        3) deploy_github_pages ;;
        4) deploy_firebase ;;
        5) show_all_options ;;
        *) echo "❌ Choix invalide" && select_service ;;
    esac
}

# Déploiement Vercel
deploy_vercel() {
    echo "🌟 Déploiement Vercel"
    echo "===================="
    echo ""
    
    if command -v vercel &> /dev/null; then
        echo "🚀 Déploiement automatique avec Vercel CLI..."
        vercel --prod
    else
        echo "📋 Instructions de déploiement Vercel:"
        echo ""
        echo "1. 🌐 Allez sur: https://vercel.com"
        echo "2. 🔗 Connectez votre compte GitHub"
        echo "3. ➕ Cliquez 'New Project'"
        echo "4. 📂 Sélectionnez votre repo 'Morpion-Otaku-Battle'"
        echo "5. ⚙️ Configuration automatique détectée (vercel.json)"
        echo "6. 🚀 Cliquez 'Deploy'"
        echo ""
        echo "🎯 Votre jeu sera accessible via:"
        echo "   https://morpion-otaku-battle.vercel.app"
        echo ""
        echo "💡 Installation CLI (optionnel):"
        echo "   npm i -g vercel"
    fi
}

# Déploiement Netlify
deploy_netlify() {
    echo "🚀 Déploiement Netlify"
    echo "======================"
    echo ""
    
    if command -v netlify &> /dev/null; then
        echo "🚀 Déploiement automatique avec Netlify CLI..."
        netlify deploy --prod --dir=view
    else
        echo "📋 Instructions de déploiement Netlify:"
        echo ""
        echo "Méthode 1 - Glisser-Déposer (Plus simple):"
        echo "1. 🌐 Allez sur: https://netlify.com"
        echo "2. 📁 Compressez le dossier 'view' en ZIP"
        echo "3. 🖱️ Glissez-déposez le ZIP sur Netlify"
        echo "4. 🎯 URL générée automatiquement"
        echo ""
        echo "Méthode 2 - GitHub Integration:"
        echo "1. 🔗 Connectez GitHub à Netlify"
        echo "2. 📂 Sélectionnez 'Morpion-Otaku-Battle'"
        echo "3. ⚙️ Build settings: dir='view'"
        echo "4. 🚀 Deploy automatique"
        echo ""
        echo "💡 Installation CLI (optionnel):"
        echo "   npm i -g netlify-cli"
    fi
}

# GitHub Pages (déjà configuré)
deploy_github_pages() {
    echo "🐙 GitHub Pages"
    echo "==============="
    echo ""
    echo "✅ GitHub Pages est déjà configuré dans votre workflow!"
    echo ""
    echo "📋 Pour activer:"
    echo "1. 🌐 Allez sur votre repo GitHub"
    echo "2. ⚙️ Settings > Pages"
    echo "3. 🔧 Source: 'GitHub Actions'"
    echo "4. 🚀 Le workflow se déclenchera automatiquement"
    echo ""
    echo "🎯 Votre jeu sera accessible via:"
    echo "   https://mackly45.github.io/Morpion-Otaku-Battle"
    echo ""
    echo "💡 Déploiement automatique à chaque push sur main!"
}

# Firebase Hosting
deploy_firebase() {
    echo "🔥 Firebase Hosting"
    echo "=================="
    echo ""
    
    if command -v firebase &> /dev/null; then
        echo "🚀 Configuration Firebase..."
        firebase init hosting
        firebase deploy
    else
        echo "📋 Instructions de déploiement Firebase:"
        echo ""
        echo "1. 🌐 Allez sur: https://console.firebase.google.com"
        echo "2. ➕ Créez un nouveau projet"
        echo "3. 🏠 Activez 'Hosting'"
        echo "4. 💻 Installez Firebase CLI:"
        echo "   npm i -g firebase-tools"
        echo "5. 🔑 Connectez-vous:"
        echo "   firebase login"
        echo "6. 🚀 Initialisez et déployez:"
        echo "   firebase init hosting"
        echo "   firebase deploy"
        echo ""
        echo "🎯 URL finale: https://VOTRE-PROJET.web.app"
    fi
}

# Afficher toutes les options
show_all_options() {
    echo "📋 Tous les Services Cloud Gratuits"
    echo "=================================="
    echo ""
    echo "🌟 Vercel:"
    echo "   ✅ Le plus simple à utiliser"
    echo "   ✅ Domaine gratuit inclus"
    echo "   ✅ SSL automatique"
    echo "   ✅ Déploiement en 1 clic"
    echo "   🌐 https://vercel.com"
    echo ""
    echo "🚀 Netlify:"
    echo "   ✅ Glisser-déposer super simple"
    echo "   ✅ 100GB bandwidth/mois"
    echo "   ✅ Formulaires intégrés"
    echo "   🌐 https://netlify.com"
    echo ""
    echo "🐙 GitHub Pages:"
    echo "   ✅ Déjà configuré dans votre repo"
    echo "   ✅ Déploiement automatique"
    echo "   ✅ Gratuit illimité"
    echo "   🌐 Activé dans Settings > Pages"
    echo ""
    echo "🔥 Firebase:"
    echo "   ✅ Infrastructure Google"
    echo "   ✅ Très rapide mondialement"
    echo "   ✅ 10GB gratuit"
    echo "   🌐 https://firebase.google.com"
    echo ""
    echo "☁️ Autres options:"
    echo "   • Surge.sh (surge.sh)"
    echo "   • Render.com (render.com)"
    echo "   • Railway.app (railway.app)"
    echo "   • Heroku (limite: 550h/mois)"
    echo ""
}

# Créer une version statique optimisée
create_static_build() {
    echo "📦 Création du build statique..."
    
    # Créer le dossier de build
    mkdir -p build
    
    # Copier les fichiers essentiels
    cp -r view/* build/
    cp -r static build/
    cp -r controller build/
    cp -r model build/
    
    # Créer un index.html optimisé
    cat > build/index.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎮 Morpion Otaku Battle - Jeu Anime Gratuit</title>
    <meta name="description" content="Jeu de morpion anime gratuit avec 24+ personnages, IA avancée, effets visuels et système d'évolution. Jouez maintenant!">
    <meta name="keywords" content="morpion, anime, jeu gratuit, goku, naruto, luffy, one piece">
    <link rel="stylesheet" href="static/styles.css">
    <script>
        // Redirection automatique vers la vraie page
        if (window.location.pathname === '/') {
            window.location.href = '/view/index.html';
        }
    </script>
</head>
<body>
    <div style="text-align: center; padding: 50px; font-family: Arial;">
        <h1>🎮 Morpion Otaku Battle</h1>
        <p>Chargement du jeu...</p>
        <p><a href="view/index.html">Cliquez ici si le jeu ne se charge pas automatiquement</a></p>
    </div>
</body>
</html>
EOF
    
    echo "✅ Build statique créé dans le dossier 'build'"
}

# Script principal
main() {
    check_requirements
    
    echo "🎮 Prêt pour le déploiement cloud!"
    echo ""
    
    # Créer le build statique
    create_static_build
    
    # Menu de sélection
    select_service
    
    echo ""
    echo "🎉 Déploiement terminé!"
    echo "🌐 Votre jeu sera bientôt accessible mondialement"
    echo "📱 Compatible mobile et desktop"
    echo "🚀 Prêt pour la communauté anime!"
}

# Lancer le script
main