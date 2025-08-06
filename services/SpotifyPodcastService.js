import { API_KEYS } from '../config/api';

// Clé API Spotify (Client ID)
const SPOTIFY_CLIENT_ID = API_KEYS.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = API_KEYS.SPOTIFY_CLIENT_SECRET;

let spotifyAccessToken = null;
let tokenExpiry = null;

/**
 * Obtient un token d'accès Spotify
 * @returns {Promise<string|null>} - Token d'accès ou null
 */
async function getSpotifyAccessToken() {
  if (spotifyAccessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return spotifyAccessToken;
  }

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    console.warn('Clés API Spotify non configurées');
    return null;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET)
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    spotifyAccessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Expire 1 minute avant

    return spotifyAccessToken;
  } catch (error) {
    console.error('Erreur lors de l\'obtention du token Spotify:', error);
    return null;
  }
}

/**
 * Extrait l'ID Spotify d'une URL Spotify Podcast
 * @param {string} url - URL Spotify Podcast
 * @returns {string|null} - ID Spotify ou null
 */
export function extractSpotifyPodcastId(url) {
  if (!url) return null;
  
  const patterns = [
    /spotify\.com\/show\/([a-zA-Z0-9]+)/,
    /open\.spotify\.com\/show\/([a-zA-Z0-9]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Extrait l'ID Spotify d'une URL Spotify Episode
 * @param {string} url - URL Spotify Episode
 * @returns {string|null} - ID Spotify ou null
 */
export function extractSpotifyEpisodeId(url) {
  if (!url) return null;
  
  const patterns = [
    /spotify\.com\/episode\/([a-zA-Z0-9]+)/,
    /open\.spotify\.com\/episode\/([a-zA-Z0-9]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Recherche un podcast sur Spotify par nom
 * @param {string} searchTerm - Terme de recherche
 * @returns {Promise<Object|null>} - Premier résultat trouvé
 */
export async function searchSpotifyPodcast(searchTerm) {
  if (!searchTerm) return null;

  const token = await getSpotifyAccessToken();
  if (!token) return null;

  try {
    const encodedSearch = encodeURIComponent(searchTerm);
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodedSearch}&type=show&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.shows && data.shows.items && data.shows.items.length > 0) {
      const show = data.shows.items[0];
      
      return {
        title: show.name,
        hosts: show.publisher,
        description: show.description,
        image: show.images[0]?.url,
        externalUrl: show.external_urls.spotify,
        totalEpisodes: show.total_episodes,
        mediaType: show.media_type,
        isExplicit: show.is_explicit,
        languages: show.languages,
        copyrights: show.copyrights
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la recherche Spotify Podcast:', error);
    return null;
  }
}

/**
 * Récupère les métadonnées d'un podcast Spotify par ID
 * @param {string} showId - ID Spotify du podcast
 * @returns {Promise<Object|null>} - Métadonnées du podcast
 */
export async function getSpotifyPodcastInfo(showId) {
  if (!showId) return null;

  const token = await getSpotifyAccessToken();
  if (!token) return null;

  try {
    const response = await fetch(`https://api.spotify.com/v1/shows/${showId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const show = await response.json();
    
    return {
      title: show.name,
      hosts: show.publisher,
      description: show.description,
      image: show.images[0]?.url,
      externalUrl: show.external_urls.spotify,
      totalEpisodes: show.total_episodes,
      mediaType: show.media_type,
      isExplicit: show.is_explicit,
      languages: show.languages,
      copyrights: show.copyrights,
      duration: null // Spotify ne fournit pas la durée des podcasts via cette API
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des infos Spotify Podcast:', error);
    return null;
  }
}

/**
 * Récupère les métadonnées d'un épisode Spotify par ID
 * @param {string} episodeId - ID Spotify de l'épisode
 * @returns {Promise<Object|null>} - Métadonnées de l'épisode
 */
export async function getSpotifyEpisodeInfo(episodeId) {
  if (!episodeId) return null;

  const token = await getSpotifyAccessToken();
  if (!token) return null;

  try {
    const response = await fetch(`https://api.spotify.com/v1/episodes/${episodeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const episode = await response.json();
    
    return {
      title: episode.name,
      hosts: episode.show?.publisher || episode.show?.name,
      description: episode.description,
      image: episode.images[0]?.url || episode.show?.images[0]?.url,
      externalUrl: episode.external_urls.spotify,
      duration: episode.duration_ms, // Durée en millisecondes
      showName: episode.show?.name,
      showId: episode.show?.id,
      language: episode.language,
      isExplicit: episode.is_explicit,
      releaseDate: episode.release_date
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des infos Spotify Episode:', error);
    return null;
  }
}

/**
 * Récupère les métadonnées à partir d'une URL Spotify Podcast
 * @param {string} url - URL Spotify Podcast
 * @returns {Promise<Object|null>} - Métadonnées du podcast
 */
export async function getPodcastInfoFromSpotifyUrl(url) {
  const showId = extractSpotifyPodcastId(url);
  
  if (!showId) {
    return null;
  }
  
  return await getSpotifyPodcastInfo(showId);
}

/**
 * Récupère les métadonnées à partir d'une URL Spotify Episode
 * @param {string} url - URL Spotify Episode
 * @returns {Promise<Object|null>} - Métadonnées de l'épisode
 */
export async function getEpisodeInfoFromSpotifyUrl(url) {
  const episodeId = extractSpotifyEpisodeId(url);
  
  if (!episodeId) {
    return null;
  }
  
  return await getSpotifyEpisodeInfo(episodeId);
}

/**
 * Vérifie si une URL est une URL Spotify Podcast valide
 * @param {string} url - URL à vérifier
 * @returns {boolean} - True si c'est une URL Spotify Podcast valide
 */
export function isValidSpotifyPodcastUrl(url) {
  if (!url) return false;
  
  const spotifyPodcastPatterns = [
    /^https?:\/\/(open\.)?spotify\.com\/show\//,
    /^https?:\/\/spotify\.com\/show\//
  ];
  
  return spotifyPodcastPatterns.some(pattern => pattern.test(url));
}

/**
 * Vérifie si une URL est une URL Spotify Episode valide
 * @param {string} url - URL à vérifier
 * @returns {boolean} - True si c'est une URL Spotify Episode valide
 */
export function isValidSpotifyEpisodeUrl(url) {
  if (!url) return false;
  
  const spotifyEpisodePatterns = [
    /^https?:\/\/(open\.)?spotify\.com\/episode\//,
    /^https?:\/\/spotify\.com\/episode\//
  ];
  
  return spotifyEpisodePatterns.some(pattern => pattern.test(url));
}

/**
 * Vérifie si les clés API sont configurées
 * @returns {boolean} - True si les clés API sont configurées
 */
export function isApiKeyConfigured() {
  return SPOTIFY_CLIENT_ID !== 'VOTRE_CLIENT_ID_SPOTIFY' && 
         SPOTIFY_CLIENT_SECRET !== 'VOTRE_CLIENT_SECRET_SPOTIFY';
} 