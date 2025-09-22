#!/bin/bash
# Script de déploiement automatique GitHub

echo "🚀 Déploiement automatique de Morpion Otaku Battle sur GitHub"
echo "============================================================="

# Vérifier si GitHub CLI est installé
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI n'est pas installé."
    echo "📥 Téléchargez-le depuis: https://cli.github.com/"
    echo "💡 Ou installez avec: winget install --id GitHub.cli"
    exit 1
fi

# Vérifier l'authentification GitHub
if ! gh auth status &> /dev/null; then
    echo "🔐 Authentification GitHub requise..."
    gh auth login
fi

echo "✅ GitHub CLI configuré"

# Variables du projet
REPO_NAME="Morpion-Otaku-Battle"
DESCRIPTION="🎮 Epic anime tic-tac-toe battle game with AI, themes, and advanced features"

echo "📦 Création du repository GitHub..."
gh repo create "$REPO_NAME" --public --description "$DESCRIPTION" --clone=false

echo "🔗 Configuration du remote..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$(gh api user --jq .login)/$REPO_NAME.git"

echo "📤 Push du code..."
git push -u origin main

echo "⚙️ Configuration des paramètres du repository..."
# Activer GitHub Pages
gh api "repos/$(gh api user --jq .login)/$REPO_NAME/pages" \
  --method POST \
  --field source='{"branch":"main","path":"/"}' \
  --field build_type="workflow" 2>/dev/null || echo "Pages configuration will be set up manually"

# Activer les Issues et Discussions
gh repo edit "$(gh api user --jq .login)/$REPO_NAME" \
  --enable-issues \
  --enable-discussions \
  --enable-projects \
  --enable-wiki

echo "🏷️ Création du premier release..."
git tag -a v1.0.0 -m "🎮 Morpion Otaku Battle v1.0.0 - Initial Release

✨ Features:
- 9 anime characters with combat system
- AI with 4 difficulty levels (minimax algorithm)  
- 5 visual themes with dynamic switching
- Complete audio system with controls
- Mobile-optimized responsive design
- Achievement system and statistics
- Multi-language support (FR/EN/ES)
- Advanced visual effects and analytics

🚀 Ready for community use!"

git push origin v1.0.0

gh release create v1.0.0 \
  --title "🎮 Morpion Otaku Battle v1.0.0" \
  --notes "Premier release officiel du jeu ! Téléchargez et jouez immédiatement avec toutes les fonctionnalités avancées." \
  --latest

echo ""
echo "🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!"
echo "=================================="
echo "📂 Repository: https://github.com/$(gh api user --jq .login)/$REPO_NAME"
echo "🌐 GitHub Pages: https://$(gh api user --jq .login).github.io/$REPO_NAME (sera disponible dans quelques minutes)"
echo "📋 Issues: https://github.com/$(gh api user --jq .login)/$REPO_NAME/issues"
echo "💬 Discussions: https://github.com/$(gh api user --jq .login)/$REPO_NAME/discussions"
echo ""
echo "🎯 Prochaines étapes:"
echo "1. Partagez le lien avec la communauté"
echo "2. Surveillez les Issues et Pull Requests"
echo "3. Ajoutez des stars et watch le repository"
echo ""