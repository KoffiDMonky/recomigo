# Services d'Import Automatique - Recomigo

## Vue d'ensemble

L'application Recomigo supporte maintenant l'import automatique de métadonnées depuis plusieurs plateformes de contenu via leurs APIs respectives.

## Services Disponibles

### 🎵 Musique

#### Spotify
- **API** : Spotify Web API
- **URLs supportées** : 
  - `spotify.com/track/...`
  - `spotify.com/album/...`
  - `open.spotify.com/track/...`
- **Métadonnées récupérées** :
  - Titre de la musique
  - Artiste(s)
  - Album
  - Durée
  - Image de l'album
  - Date de sortie
  - Popularité
- **Configuration** : Nécessite Client ID et Client Secret Spotify

#### YouTube Music
- **API** : YouTube Data API v3 (réutilise la clé YouTube)
- **URLs supportées** : Toutes les URLs YouTube
- **Détection** : Analyse automatique pour identifier les vidéos musicales
- **Métadonnées récupérées** :
  - Titre de la musique (extrait du titre YouTube)
  - Artiste (extrait du titre ou nom de la chaîne)
  - Miniature YouTube
  - Durée
  - Statistiques (vues, likes)
- **Avantages** : Utilise la clé YouTube existante, pas de configuration supplémentaire

### 🎙️ Podcasts

#### Apple Podcasts
- **API** : iTunes Search API (gratuit, pas de clé requise)
- **URLs supportées** :
  - `podcasts.apple.com/fr/podcast/...`
  - `itunes.apple.com/fr/podcast/...`
- **Métadonnées récupérées** :
  - Titre du podcast
  - Animateurs
  - Description
  - Image du podcast
  - Genre
  - Nombre d'épisodes
  - Note moyenne
- **Avantages** : API gratuite, pas de configuration requise

#### Spotify Podcasts
- **API** : Spotify Podcast API (nécessite OAuth)
- **URLs supportées** :
  - `spotify.com/show/...`
  - `open.spotify.com/show/...`
- **Statut** : API disponible mais nécessite une implémentation OAuth complète
- **Note** : Actuellement non implémenté car nécessite une authentification utilisateur

### 🎬 Vidéos

#### YouTube (existant)
- **API** : YouTube Data API v3
- **URLs supportées** : Toutes les URLs YouTube
- **Métadonnées récupérées** :
  - Titre de la vidéo
  - Description
  - Nom de la chaîne
  - Durée
  - Miniature
  - Statistiques

## Configuration des APIs

### Spotify API
1. Allez sur https://developer.spotify.com/dashboard/
2. Créez une nouvelle application
3. Récupérez le Client ID et Client Secret
4. Mettez à jour `config/api.js` :
```javascript
SPOTIFY_CLIENT_ID: 'votre_client_id',
SPOTIFY_CLIENT_SECRET: 'votre_client_secret',
```

### YouTube API (déjà configuré)
- Utilise la clé YouTube existante
- Fonctionne pour YouTube et YouTube Music

### iTunes API (Apple Podcasts)
- Aucune configuration requise
- API gratuite et publique

## Utilisation

### Dans les formulaires

Les formulaires détectent automatiquement le type d'URL et récupèrent les métadonnées :

1. **MusiqueForm** : Supporte Spotify et YouTube Music
2. **PodcastForm** : Supporte Apple Podcasts
3. **YoutubeForm** : Supporte YouTube (existant)

### Messages d'information

L'application affiche des messages informatifs :
- ✅ URL valide détectée
- ⚠️ Clé API non configurée
- 🔄 Récupération en cours
- ❌ URL non reconnue

## Fonctionnalités Avancées

### Détection YouTube Music
- Analyse des mots-clés musicaux dans le titre et la description
- Vérification de la catégorie YouTube
- Extraction intelligente de l'artiste et du titre

### Recherche de Podcasts
- Recherche par nom si l'URL n'est pas reconnue
- Support de multiples plateformes de podcasts

### Gestion des Erreurs
- Fallback gracieux si l'API échoue
- Messages d'erreur informatifs
- Récupération manuelle toujours possible

## Limitations

### Spotify
- Nécessite une authentification OAuth pour les playlists privées
- Limite de requêtes API (rate limiting)

### YouTube Music
- Détection basée sur des mots-clés (pas 100% fiable)
- Pas d'information d'album disponible

### Apple Podcasts
- API de recherche limitée
- Pas d'accès aux épisodes individuels

## Développement Futur

### Services à ajouter
- **Netflix** : Pas d'API publique disponible
- **Amazon Prime** : API limitée
- **Deezer** : API disponible mais nécessite implémentation
- **SoundCloud** : API disponible

### Améliorations possibles
- Cache des métadonnées
- Recherche par nom pour tous les services
- Support des playlists et albums complets
- Intégration avec plus de plateformes de podcasts 