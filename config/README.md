# 🔑 Configuration des Clés API

## ⚠️ **IMPORTANT - Sécurité**

Le fichier `config/api.js` contient des clés API sensibles et **NE DOIT PAS** être commité sur GitHub.

## 🚀 **Installation**

### Étape 1 : Copier le template
```bash
cp config/api.template.js config/api.js
```

### Étape 2 : Configurer vos clés API
Éditez `config/api.js` et remplacez les valeurs par vos vraies clés :

```javascript
export const API_KEYS = {
  YOUTUBE_API_KEY: 'VOTRE_CLE_API_YOUTUBE_ICI',
  SPOTIFY_CLIENT_ID: 'VOTRE_CLIENT_ID_SPOTIFY_ICI',
  SPOTIFY_CLIENT_SECRET: 'VOTRE_CLIENT_SECRET_SPOTIFY_ICI',
};
```

## 🔧 **Obtention des Clés API**

### YouTube API
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API **YouTube Data v3**
4. Créez des identifiants (clé API)
5. Remplacez `VOTRE_CLE_API_YOUTUBE_ICI` par votre clé

### Spotify API
1. Allez sur [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Créez une nouvelle application
3. Récupérez le **Client ID** et **Client Secret**
4. Remplacez les valeurs par défaut par vos clés

## 🛡️ **Sécurité**

- ✅ Le fichier `config/api.js` est dans `.gitignore`
- ✅ Le template `config/api.template.js` est commité
- ✅ Les clés sensibles ne sont pas exposées sur GitHub

## 📋 **Services Supportés**

| Service | Clé Requise | Statut |
|---------|-------------|--------|
| 🎵 **YouTube** | `YOUTUBE_API_KEY` | ✅ Opérationnel |
| 🎵 **Spotify Music** | `SPOTIFY_CLIENT_ID` + `SPOTIFY_CLIENT_SECRET` | ✅ Opérationnel |
| 🎙️ **Spotify Podcasts** | `SPOTIFY_CLIENT_ID` + `SPOTIFY_CLIENT_SECRET` | ✅ Opérationnel |
| 🍎 **iTunes Podcasts** | Aucune | ✅ Opérationnel |

## 🔍 **Vérification**

Pour vérifier que vos clés sont configurées :

```javascript
import { API_KEYS } from './config/api';

console.log('YouTube API:', API_KEYS.YOUTUBE_API_KEY ? '✅ Configurée' : '❌ Manquante');
console.log('Spotify API:', API_KEYS.SPOTIFY_CLIENT_ID ? '✅ Configurée' : '❌ Manquante');
``` 