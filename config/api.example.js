// Exemple de configuration API
// Copiez ce fichier vers config/api.js et remplacez par vos vraies clés

export const API_KEYS = {
  // YouTube API - Pour l'import de vidéos YouTube
  YOUTUBE_API_KEY: 'VOTRE_CLE_API_YOUTUBE_ICI',
  
  // Spotify API - Pour l'import de musique et podcasts
  SPOTIFY_CLIENT_ID: 'VOTRE_CLIENT_ID_SPOTIFY_ICI',
  SPOTIFY_CLIENT_SECRET: 'VOTRE_CLIENT_SECRET_SPOTIFY_ICI',
  
  // TMDB API - Pour l'import de films et séries (RECOMMANDÉ)
  TMDB_API_KEY: 'VOTRE_CLE_API_TMDB_ICI',
};

// Instructions pour obtenir les clés API :

// YOUTUBE API :
// 1. Allez sur https://console.cloud.google.com/
// 2. Créez un nouveau projet ou sélectionnez un projet existant
// 3. Activez l'API YouTube Data v3
// 4. Créez des identifiants (clé API)
// 5. Remplacez 'VOTRE_CLE_API_YOUTUBE_ICI' par votre clé

// SPOTIFY API :
// 1. Allez sur https://developer.spotify.com/dashboard/
// 2. Créez une nouvelle application
// 3. Récupérez le Client ID et Client Secret
// 4. Remplacez les valeurs par défaut par vos clés

// TMDB API (The Movie Database) - RECOMMANDÉ pour les films/séries :
// 1. Allez sur https://www.themoviedb.org/settings/api
// 2. Créez un compte gratuit
// 3. Demandez une clé API (gratuite)
// 4. Remplacez 'VOTRE_CLE_API_TMDB_ICI' par votre clé
// 
// Exemples d'URLs TMDB supportées :
// - Films : https://www.themoviedb.org/movie/550-fight-club
// - Séries : https://www.themoviedb.org/tv/1399-game-of-thrones

// Note : Seule la clé TMDB est nécessaire pour l'import de films/séries
// Les autres clés sont optionnelles selon vos besoins 