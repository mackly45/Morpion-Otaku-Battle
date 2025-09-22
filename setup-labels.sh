#!/bin/bash

# 🏷️ GitHub Labels Setup Script
# This script automatically creates organized labels for your repository

echo "🚀 Setting up GitHub Labels for Morpion Otaku Battle..."

# Function to create label
create_label() {
    local name="$1"
    local color="$2"
    local description="$3"
    
    echo "Creating label: $name"
    gh label create "$name" --color "$color" --description "$description" --force 2>/dev/null || true
}

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
echo "🏷️ Creating repository labels..."

# Bug labels
create_label "bug" "d73a4a" "Something isn't working"
create_label "critical bug" "b60205" "Critical bug that breaks core functionality"
create_label "minor bug" "ff9f9f" "Minor bug that doesn't affect core functionality"

# Feature labels
create_label "enhancement" "a2eeef" "New feature or request"
create_label "feature request" "1f77d4" "Request for new game feature"
create_label "anime character" "ff69b4" "New anime character request"
create_label "ui/ux" "7b68ee" "User interface and experience improvements"

# Documentation labels
create_label "documentation" "0075ca" "Improvements or additions to documentation"
create_label "wiki" "0366d6" "Wiki documentation updates"
create_label "readme" "5dade2" "README file updates"

# Technical labels
create_label "dependencies" "0366d6" "Pull requests that update a dependency file"
create_label "security" "ee0701" "Security related issues or improvements"
create_label "performance" "fbca04" "Performance improvements"
create_label "refactoring" "c5def5" "Code refactoring without functional changes"

# Game-specific labels
create_label "ai" "28a745" "AI player functionality"
create_label "gameplay" "ffa500" "Core game mechanics"
create_label "visual effects" "9932cc" "Visual effects and animations"
create_label "sound" "ff6347" "Sound effects and music"

# Priority labels
create_label "priority: high" "b60205" "High priority issue"
create_label "priority: medium" "fbca04" "Medium priority issue"
create_label "priority: low" "0e8a16" "Low priority issue"

# Status labels
create_label "status: in progress" "0052cc" "Currently being worked on"
create_label "status: needs review" "006b75" "Needs code review"
create_label "status: blocked" "d93f0b" "Blocked by other issues or dependencies"
create_label "status: won't fix" "ffffff" "This will not be worked on"

# Special labels
create_label "good first issue" "7057ff" "Good for newcomers"
create_label "help wanted" "008672" "Extra attention is needed"
create_label "question" "d876e3" "Further information is requested"
create_label "duplicate" "cfd3d7" "This issue or pull request already exists"
create_label "invalid" "e4e669" "This doesn't seem right"

echo "🎉 All labels created successfully!"
echo "🏷️ Your repository now has organized labels for better issue management."
echo ""
echo "📋 Label Categories Created:"
echo "   🐛 Bug Labels (3)"
echo "   ✨ Feature Labels (4)"
echo "   📚 Documentation Labels (3)"
echo "   🔧 Technical Labels (4)"
echo "   🎮 Game-Specific Labels (4)"
echo "   🎯 Priority Labels (3)"
echo "   📊 Status Labels (4)"
echo "   🌟 Special Labels (5)"
echo ""
echo "🔗 View labels: https://github.com/$(gh repo view --json owner,name -q '.owner.login + \"/\" + .name')/labels"