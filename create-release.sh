#!/bin/bash

# 🚀 Manual Release Creator - Morpion Otaku Battle
# This script creates a release manually if the automated workflow fails

echo "🎮 Morpion Otaku Battle - Manual Release Creator"
echo "==============================================="
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Please install it from: https://cli.github.com/"
    echo "Then run: gh auth login"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Please authenticate with GitHub CLI first:"
    echo "Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is ready!"
echo ""

# Get current version
if [ -f "VERSION" ]; then
    CURRENT_VERSION=$(cat VERSION)
else
    CURRENT_VERSION="1.0.0"
fi

echo "📋 Current version: $CURRENT_VERSION"
echo ""

# Ask for new version
read -p "🔢 Enter new version (or press Enter for auto-increment): " NEW_VERSION

if [ -z "$NEW_VERSION" ]; then
    # Auto increment patch version
    IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
    MAJOR=${VERSION_PARTS[0]}
    MINOR=${VERSION_PARTS[1]}
    PATCH=${VERSION_PARTS[2]}
    PATCH=$((PATCH + 1))
    NEW_VERSION="$MAJOR.$MINOR.$PATCH"
    echo "🔄 Auto-incremented to: $NEW_VERSION"
fi

# Check if version already exists
if gh release view "v$NEW_VERSION" &>/dev/null; then
    echo "❌ Release v$NEW_VERSION already exists!"
    echo "📋 Existing releases:"
    gh release list --limit 5
    exit 1
fi

echo ""
echo "🚀 Creating release v$NEW_VERSION..."

# Update VERSION file
echo "$NEW_VERSION" > VERSION

# Create release notes
cat > TEMP_RELEASE_NOTES.md << EOF
# 🎮 Morpion Otaku Battle v$NEW_VERSION

## 🚀 What's New

$(git log --oneline $(git describe --tags --abbrev=0 2>/dev/null || echo "")..HEAD --pretty=format:"- %s" | head -10)

## 🎯 Game Features
- 🤖 Advanced AI with multiple difficulty levels
- 🎨 24+ anime characters with unique abilities
- ⚡ Visual effects and animations
- 🏆 Evolution and progression system
- 🎵 Sound effects and background music
- 📱 Responsive design for all devices

## 🛠️ Installation

\`\`\`bash
git clone https://github.com/$(gh repo view --json owner,name -q '.owner.login + "/" + .name').git
cd Morpion-Otaku-Battle
pip install -r requirements.txt
python app.py
\`\`\`

## 🌐 Play Online

🎮 **Live Demo:** https://$(gh repo view --json owner,name -q '.owner.login').github.io/Morpion-Otaku-Battle/

## 🎯 Cloud Deployment

Deploy for free on:
- 🌟 **Vercel:** [vercel.com](https://vercel.com)
- 🚀 **Netlify:** [netlify.com](https://netlify.com)
- 🐙 **GitHub Pages:** Already configured!
- 🔥 **Firebase:** [firebase.google.com](https://firebase.google.com)

See \`CLOUD_DEPLOYMENT.md\` for detailed instructions.

---

Ready to battle with your favorite anime characters! 🥊✨
EOF

# Create the release
echo "📦 Creating GitHub release..."
gh release create "v$NEW_VERSION" \
    --title "🎮 Morpion Otaku Battle v$NEW_VERSION" \
    --notes-file TEMP_RELEASE_NOTES.md \
    --latest

if [ $? -eq 0 ]; then
    echo "✅ Release v$NEW_VERSION created successfully!"
    echo "🔗 View release: $(gh release view v$NEW_VERSION --json url -q '.url')"
    
    # Commit version update
    git add VERSION
    git commit -m "🔖 Bump version to $NEW_VERSION" || true
    git push origin main || echo "⚠️ Could not push version update to main branch"
    
    echo ""
    echo "🎉 Release complete!"
    echo "📦 Downloads will be available shortly"
    echo "🌐 Your game is ready for the community!"
else
    echo "❌ Failed to create release"
    echo "🔍 Check the error above and try again"
fi

# Cleanup
rm -f TEMP_RELEASE_NOTES.md

echo ""
echo "🎮 Happy gaming! Your anime tic-tac-toe battle awaits! ⚔️"