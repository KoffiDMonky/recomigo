#!/bin/bash

echo "🔑 Configuration des Clés API - Recomigo"
echo "=========================================="
echo ""

# Vérifier si le fichier api.js existe déjà
if [ -f "config/api.js" ]; then
    echo "⚠️  Le fichier config/api.js existe déjà."
    echo "   Il contient probablement vos vraies clés API."
    echo ""
    read -p "Voulez-vous le sauvegarder avant de continuer ? (y/n): " backup
    if [ "$backup" = "y" ] || [ "$backup" = "Y" ]; then
        cp config/api.js config/api.js.backup
        echo "✅ Fichier sauvegardé vers config/api.js.backup"
        echo ""
    fi
fi

# Copier le template
echo "📋 Copie du template..."
cp config/api.template.js config/api.js

if [ $? -eq 0 ]; then
    echo "✅ Template copié vers config/api.js"
    echo ""
    echo "🔧 Maintenant, éditez config/api.js et ajoutez vos vraies clés API :"
    echo ""
    echo "   YOUTUBE_API_KEY: 'VOTRE_CLE_API_YOUTUBE_ICI'"
    echo "   SPOTIFY_CLIENT_ID: 'VOTRE_CLIENT_ID_SPOTIFY_ICI'"
    echo "   SPOTIFY_CLIENT_SECRET: 'VOTRE_CLIENT_SECRET_SPOTIFY_ICI'"
    echo ""
    echo "📖 Consultez config/README.md pour les instructions détaillées"
    echo ""
    echo "🛡️  Le fichier config/api.js est maintenant dans .gitignore"
    echo "   Vos clés ne seront pas exposées sur GitHub"
else
    echo "❌ Erreur lors de la copie du template"
    exit 1
fi 