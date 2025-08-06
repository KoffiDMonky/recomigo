# 🎙️ Guide YouTube Podcast - Recomigo

## ✅ Nouveau Service Ajouté

J'ai ajouté le support des podcasts YouTube et YouTube Music dans la catégorie Podcast !

## 🎯 Fonctionnalités

### 🔍 **Détection Automatique de Podcasts**
Le service analyse automatiquement si une vidéo YouTube est un podcast en vérifiant :
- **Mots-clés** : "podcast", "episode", "show", "interview", "discussion", etc.
- **Tags** : Recherche de mots-clés de podcast dans les tags
- **Durée** : Vidéos de plus de 15 minutes (critère de podcast)

### 📋 **Métadonnées Récupérées**
- ✅ **Titre** de l'épisode
- ✅ **Animateurs** (nom de la chaîne)
- ✅ **Description** complète
- ✅ **Durée** de l'épisode
- ✅ **Image** (miniature YouTube)
- ✅ **Numéro d'épisode** (si détecté)
- ✅ **Nom du podcast** (extrait du titre)

## 🚀 Comment Utiliser

### Étape 1 : Créer une Recommandation Podcast
1. Ouvrez l'application Recomigo
2. Cliquez sur "Ajouter une recommandation"
3. Sélectionnez "Podcast" comme catégorie
4. Cliquez sur "Suivant"

### Étape 2 : Coller une URL YouTube
Vous pouvez maintenant utiliser :
- `https://www.youtube.com/watch?v=...`
- `https://music.youtube.com/watch?v=...`
- `https://youtu.be/...`

### Étape 3 : Vérifier l'Import
Le service va :
1. **Détecter** si c'est un podcast
2. **Extraire** les métadonnées
3. **Remplir** automatiquement les champs

## 🎙️ Exemples de Podcasts YouTube

### Podcasts Populaires
```
https://www.youtube.com/watch?v=... (Joe Rogan Experience)
https://www.youtube.com/watch?v=... (Lex Fridman Podcast)
https://www.youtube.com/watch?v=... (The Tim Ferriss Show)
```

### Podcasts Français
```
https://www.youtube.com/watch?v=... (Le Floodcast)
https://www.youtube.com/watch?v=... (Tech Paf)
https://www.youtube.com/watch?v=... (Pense Bêtes)
```

## 🔧 Fonctionnement Technique

### Détection de Podcast
```javascript
// Mots-clés recherchés
const podcastKeywords = [
  'podcast', 'episode', 'épisode', 'show', 'émission', 'radio',
  'interview', 'discussion', 'talk', 'conversation', 'débat',
  'live', 'stream', 'broadcast', 'diffusion'
];
```

### Extraction d'Informations
```javascript
// Patterns pour extraire le nom du podcast
const patterns = [
  /^(.+?)\s*[-–]\s*(.+)$/, // "Nom Podcast - Titre Episode"
  /^(.+?)\s*:\s*(.+)$/,    // "Nom Podcast : Titre Episode"
  /^(.+?)\s*#\s*\d+\s*(.+)$/i // "Nom Podcast #123 Titre Episode"
];
```

## 📊 Services de Podcasts Disponibles

| Service | Statut | Métadonnées |
|---------|--------|-------------|
| 🍎 **iTunes Podcasts** | ✅ Opérationnel | Titre, Animateurs, Description, Image |
| 🎙️ **YouTube Podcasts** | ✅ **Nouveau** | Titre, Animateurs, Description, **Durée**, Image |
| 🎵 **Spotify Podcasts** | ⚠️ Limité | Nécessite OAuth utilisateur |

## 🎯 Avantages YouTube Podcasts

### ✅ **Avantages**
- **Durée disponible** : Contrairement à iTunes
- **Pas de clé API** : Utilise la clé YouTube existante
- **Support YouTube Music** : Fonctionne aussi sur music.youtube.com
- **Détection intelligente** : Analyse automatique du contenu

### ⚠️ **Limitations**
- **Détection basée sur des mots-clés** : Pas 100% fiable
- **Pas de catalogue officiel** : Pas de liste de podcasts YouTube
- **Dépendant de la qualité des métadonnées** : YouTube

## 🧪 Test du Service

### URLs de Test
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ (Vidéo normale)
https://music.youtube.com/watch?v=x6QJPJO2w40 (Musique)
https://www.youtube.com/watch?v=... (Vrai podcast)
```

### Messages d'Information
- ✅ "URL YouTube Podcast valide - Les métadonnées seront récupérées automatiquement"
- ⚠️ "Clé API YouTube non configurée - Récupération manuelle des infos"
- ❌ "L'URL ne semble pas être une URL de podcast valide"

## 🎉 Résultat

Maintenant, vous pouvez :
1. **Ajouter des podcasts YouTube** dans la catégorie Podcast
2. **Récupérer automatiquement** les métadonnées
3. **Afficher la durée** des épisodes (contrairement à iTunes)
4. **Utiliser YouTube Music** pour les podcasts musicaux

Le support YouTube Podcast est maintenant opérationnel ! 🎙️ 