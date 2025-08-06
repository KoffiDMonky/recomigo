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
 * Extrait l'ID Spotify d'une URL Spotify
 * @param {string} url - URL Spotify
 * @returns {Object|null} - {type, id} ou null
 */
function extractSpotifyId(url) {
  if (!url) return null;

  const patterns = [
    { pattern: /spotify\.com\/track\/([a-zA-Z0-9]+)/, type: 'track' },
    { pattern: /spotify\.com\/album\/([a-zA-Z0-9]+)/, type: 'album' },
    { pattern: /spotify\.com\/playlist\/([a-zA-Z0-9]+)/, type: 'playlist' },
    { pattern: /spotify\.com\/artist\/([a-zA-Z0-9]+)/, type: 'artist' }
  ];

  for (const { pattern, type } of patterns) {
    const match = url.match(pattern);
    if (match) {
      return { type, id: match[1] };
    }
  }

  return null;
}

/**
 * Récupère l'image d'une piste Spotify
 * @param {string} trackId - ID de la piste
 * @returns {Promise<string|null>} - URL de l'image ou null
 */
async function getSpotifyTrackImage(trackId) {
  const token = await getSpotifyAccessToken();
  if (!token) return null;

  try {
    console.log('🖼️ Récupération image piste Spotify:', trackId);
    
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const track = await response.json();
    
    if (track.album && track.album.images && track.album.images.length > 0) {
      const imageUrl = track.album.images[0].url;
      console.log('✅ Image piste Spotify récupérée:', imageUrl);
      return imageUrl;
    } else {
      console.log('⚠️ Aucune image trouvée pour la piste Spotify');
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur récupération image piste Spotify:', error);
    return null;
  }
}

/**
 * Récupère l'image d'un album Spotify
 * @param {string} albumId - ID de l'album
 * @returns {Promise<string|null>} - URL de l'image ou null
 */
async function getSpotifyAlbumImage(albumId) {
  const token = await getSpotifyAccessToken();
  if (!token) return null;

  try {
    console.log('🖼️ Récupération image album Spotify:', albumId);
    
    const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const album = await response.json();
    
    if (album.images && album.images.length > 0) {
      const imageUrl = album.images[0].url;
      console.log('✅ Image album Spotify récupérée:', imageUrl);
      return imageUrl;
    } else {
      console.log('⚠️ Aucune image trouvée pour l\'album Spotify');
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur récupération image album Spotify:', error);
    return null;
  }
}

/**
 * Récupère l'image Spotify à partir d'une URL
 * @param {string} url - URL Spotify
 * @returns {Promise<string|null>} - URL de l'image ou null
 */
export async function getSpotifyImageFromUrl(url) {
  if (!url) {
    console.log('⚠️ URL Spotify manquante');
    return null;
  }

  const spotifyData = extractSpotifyId(url);
  
  if (!spotifyData) {
    console.log('⚠️ Impossible d\'extraire l\'ID Spotify de l\'URL:', url);
    return null;
  }

  console.log(`🖼️ Récupération image Spotify [${spotifyData.type}]:`, spotifyData.id);

  switch (spotifyData.type) {
    case 'track':
      return await getSpotifyTrackImage(spotifyData.id);
    case 'album':
      return await getSpotifyAlbumImage(spotifyData.id);
    default:
      console.log(`⚠️ Type Spotify non supporté pour image: ${spotifyData.type}`);
      return null;
  }
}

/**
 * Vérifie si une URL est une URL Spotify valide
 * @param {string} url - URL à vérifier
 * @returns {boolean} - True si c'est une URL Spotify valide
 */
export function isValidSpotifyUrl(url) {
  if (!url) return false;
  
  const spotifyPatterns = [
    /^https?:\/\/(open\.)?spotify\.com\/track\//,
    /^https?:\/\/(open\.)?spotify\.com\/album\//,
    /^https?:\/\/(open\.)?spotify\.com\/playlist\//,
    /^https?:\/\/(open\.)?spotify\.com\/artist\//
  ];
  
  return spotifyPatterns.some(pattern => pattern.test(url));
}

/**
 * Vérifie si les clés API sont configurées
 * @returns {boolean} - True si les clés API sont configurées
 */
export function isApiKeyConfigured() {
  return SPOTIFY_CLIENT_ID !== 'VOTRE_CLIENT_ID_SPOTIFY' && 
         SPOTIFY_CLIENT_SECRET !== 'VOTRE_CLIENT_SECRET_SPOTIFY';
} 