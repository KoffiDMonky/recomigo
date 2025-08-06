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
export function extractSpotifyId(url) {
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
 * Récupère les informations d'une piste Spotify
 * @param {string} trackId - ID de la piste
 * @returns {Promise<Object|null>} - Métadonnées de la piste
 */
async function getSpotifyTrackInfo(trackId) {
  const token = await getSpotifyAccessToken();
  if (!token) return null;

  try {
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const track = await response.json();
    
    return {
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      duration: track.duration_ms,
      image: track.album.images[0]?.url,
      externalUrl: track.external_urls.spotify,
      releaseDate: track.album.release_date,
      popularity: track.popularity
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des infos Spotify:', error);
    return null;
  }
}

/**
 * Récupère les informations d'un album Spotify
 * @param {string} albumId - ID de l'album
 * @returns {Promise<Object|null>} - Métadonnées de l'album
 */
async function getSpotifyAlbumInfo(albumId) {
  const token = await getSpotifyAccessToken();
  if (!token) return null;

  try {
    const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const album = await response.json();
    
    return {
      title: album.name,
      artist: album.artists.map(a => a.name).join(', '),
      album: album.name,
      image: album.images[0]?.url,
      externalUrl: album.external_urls.spotify,
      releaseDate: album.release_date,
      totalTracks: album.total_tracks
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des infos album Spotify:', error);
    return null;
  }
}

/**
 * Récupère les métadonnées à partir d'une URL Spotify
 * @param {string} url - URL Spotify
 * @returns {Promise<Object|null>} - Métadonnées
 */
export async function getSpotifyInfoFromUrl(url) {
  const spotifyData = extractSpotifyId(url);
  
  if (!spotifyData) {
    return null;
  }

  switch (spotifyData.type) {
    case 'track':
      return await getSpotifyTrackInfo(spotifyData.id);
    case 'album':
      return await getSpotifyAlbumInfo(spotifyData.id);
    default:
      console.log(`Type Spotify non supporté: ${spotifyData.type}`);
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