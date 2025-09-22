#!/bin/bash

echo "🔧 Nettoyage des caractères d'encodage problématiques..."

# Fonction pour nettoyer un fichier
clean_file() {
    file="$1"
    if [ -f "$file" ]; then
        echo "📝 Nettoyage de $file..."

        # Supprimer les espaces insécables et autres caractères problématiques
        sed -i 's/ / /g' "$file"  # Espace insécable (U+00A0)
        sed -i 's/ / /g' "$file"  # Espace em (U+2003)
        sed -i 's/ / /g' "$file"  # Espace en (U+2002)
        sed -i 's/ / /g' "$file"  # Espace fin insécable (U+2009)
        sed -i 's/ / /g' "$file"  # Espace capillaire (U+200A)
        sed -i 's/ / /g' "$file"  # Espace fine insécable (U+202F)

        # Supprimer les BOM
        sed -i '1s/^\xEF\xBB\xBF//' "$file"

        # Nettoyer les fins de ligne
        sed -i 's/\r$//' "$file"

        echo "✅ $file nettoyé"
    else
        echo "❌ $file non trouvé"
    fi
}

# Nettoyer tous les fichiers Python
find . -name "*.py" -exec bash -c 'clean_file "$0"' {} \;

# Nettoyer tous les fichiers JavaScript
find . -name "*.js" -exec bash -c 'clean_file "$0"' {} \;

# Nettoyer tous les fichiers HTML
find . -name "*.html" -exec bash -c 'clean_file "$0"' {} \;

# Nettoyer tous les fichiers CSS
find . -name "*.css" -exec bash -c 'clean_file "$0"' {} \;

# Nettoyer les fichiers Markdown
find . -name "*.md" -exec bash -c 'clean_file "$0"' {} \;

echo ""
echo "🎯 Nettoyage terminé !"
echo "📋 Vérifiez maintenant que les erreurs d'encodage ont disparu."
