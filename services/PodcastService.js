/**
 * Extrait l'ID iTunes d'une URL Apple Podcasts
 * @param {string} url - URL Apple Podcasts
 * @returns {string|null} - ID iTunes ou null
 */
export function extractiTunesId(url) {
  if (!url) return null;
  
  // Patterns pour différents formats d'URL Apple Podcasts
  const patterns = [
    /podcasts\.apple\.com\/[a-z]{2}\/podcast\/[^\/]+\/id(\d+)/,
    /itunes\.apple\.com\/[a-z]{2}\/podcast\/[^\/]+\/id(\d+)/,
    /podcasts\.apple\.com\/[a-z]{2}\/podcast\/id(\d+)/,
    /itunes\.apple\.com\/[a-z]{2}\/podcast\/id(\d+)/
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
 * Extrait l'ID iTunes d'une URL Spotify Podcasts
 * @param {string} url - URL Spotify Podcasts
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
 * Recherche un podcast sur iTunes par ID
 * @param {string} podcastId - ID iTunes du podcast
 * @returns {Promise<Object|null>} - Métadonnées du podcast
 */
export async function getiTunesPodcastInfo(podcastId) {
  if (!podcastId) return null;

  try {
    const response = await fetch(
      `https://itunes.apple.com/lookup?id=${podcastId}&entity=podcast`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const podcast = data.results[0];
      
      return {
        title: podcast.trackName,
        hosts: podcast.artistName,
        description: podcast.description,
        image: podcast.artworkUrl600 || podcast.artworkUrl100,
        externalUrl: podcast.trackViewUrl,
        genre: podcast.primaryGenreName,
        releaseDate: podcast.releaseDate,
        country: podcast.country,
        language: podcast.language,
        episodeCount: podcast.trackCount,
        averageRating: podcast.averageUserRating,
        ratingCount: podcast.userRatingCount
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération des infos iTunes Podcast:', error);
    return null;
  }
}

/**
 * Recherche un podcast sur iTunes par nom
 * @param {string} searchTerm - Terme de recherche
 * @returns {Promise<Object|null>} - Premier résultat trouvé
 */
export async function searchiTunesPodcast(searchTerm) {
  if (!searchTerm) return null;

  try {
    const encodedSearch = encodeURIComponent(searchTerm);
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodedSearch}&entity=podcast&limit=1`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const podcast = data.results[0];
      
      return {
        title: podcast.trackName,
        hosts: podcast.artistName,
        description: podcast.description,
        image: podcast.artworkUrl600 || podcast.artworkUrl100,
        externalUrl: podcast.trackViewUrl,
        genre: podcast.primaryGenreName,
        releaseDate: podcast.releaseDate,
        country: podcast.country,
        language: podcast.language,
        episodeCount: podcast.trackCount,
        averageRating: podcast.averageUserRating,
        ratingCount: podcast.userRatingCount
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la recherche iTunes Podcast:', error);
    return null;
  }
}

/**
 * Récupère les métadonnées d'un podcast Spotify
 * @param {string} podcastId - ID Spotify du podcast
 * @returns {Promise<Object|null>} - Métadonnées du podcast
 */
export async function getSpotifyPodcastInfo(podcastId) {
  if (!podcastId) return null;

  try {
    // Note: Spotify Podcast API nécessite une authentification OAuth
    // Pour l'instant, on retourne null car l'API n'est pas publique
    console.warn('API Spotify Podcasts nécessite une authentification OAuth');
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération des infos Spotify Podcast:', error);
    return null;
  }
}

/**
 * Récupère les métadonnées à partir d'une URL de podcast
 * @param {string} url - URL du podcast
 * @returns {Promise<Object|null>} - Métadonnées du podcast
 */
export async function getPodcastInfoFromUrl(url) {
  if (!url) return null;

  // Essayer d'extraire l'ID iTunes
  const iTunesId = extractiTunesId(url);
  if (iTunesId) {
    return await getiTunesPodcastInfo(iTunesId);
  }

  // Essayer d'extraire l'ID Spotify (Podcast)
  const spotifyId = extractSpotifyPodcastId(url);
  if (spotifyId) {
    const { getSpotifyPodcastInfo } = require('./SpotifyPodcastService');
    return await getSpotifyPodcastInfo(spotifyId);
  }

  // Essayer d'extraire l'ID Spotify (Episode)
  const { extractSpotifyEpisodeId, getSpotifyEpisodeInfo } = require('./SpotifyPodcastService');
  const spotifyEpisodeId = extractSpotifyEpisodeId(url);
  if (spotifyEpisodeId) {
    return await getSpotifyEpisodeInfo(spotifyEpisodeId);
  }

  // Essayer YouTube/YouTube Music
  const { extractYouTubeId } = require('../utils/youtubeUtils');
  const videoId = extractYouTubeId(url);
  if (videoId) {
    const { getYouTubePodcastInfo } = require('./YouTubePodcastService');
    return await getYouTubePodcastInfo(videoId);
  }

  return null;
}

/**
 * Vérifie si une URL est une URL de podcast valide
 * @param {string} url - URL à vérifier
 * @returns {boolean} - True si c'est une URL de podcast valide
 */
export function isValidPodcastUrl(url) {
  if (!url) return false;
  
  const podcastPatterns = [
    // Apple Podcasts
    /^https?:\/\/(podcasts\.apple\.com|itunes\.apple\.com)\/[a-z]{2}\/podcast\//,
    // Spotify Podcasts
    /^https?:\/\/(open\.)?spotify\.com\/show\//,
    // Spotify Episodes
    /^https?:\/\/(open\.)?spotify\.com\/episode\//,
    // YouTube/YouTube Music Podcasts
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=/,
    /^https?:\/\/youtu\.be\//,
    /^https?:\/\/music\.youtube\.com\/watch\?v=/,
    /^https?:\/\/(www\.)?music\.youtube\.com\/watch\?v=/,
    // Autres plateformes de podcasts
    /^https?:\/\/[^\/]+\.com\/podcast\//,
    /^https?:\/\/[^\/]+\.com\/show\//
  ];
  
  return podcastPatterns.some(pattern => pattern.test(url));
}

/**
 * Extrait le nom du podcast d'une URL pour la recherche
 * @param {string} url - URL du podcast
 * @returns {string|null} - Nom du podcast ou null
 */
export function extractPodcastNameFromUrl(url) {
  if (!url) return null;
  
  // Patterns pour extraire le nom du podcast
  const patterns = [
    /podcasts\.apple\.com\/[a-z]{2}\/podcast\/([^\/]+)\//,
    /itunes\.apple\.com\/[a-z]{2}\/podcast\/([^\/]+)\//,
    /spotify\.com\/show\/([^\/\?]+)/,
    /open\.spotify\.com\/show\/([^\/\?]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      // Décoder l'URL et remplacer les tirets par des espaces
      const decoded = decodeURIComponent(match[1]);
      return decoded.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  }
  
  return null;
}

/**
 * Recherche un podcast par nom si l'URL n'est pas reconnue
 * @param {string} url - URL du podcast
 * @returns {Promise<Object|null>} - Métadonnées du podcast
 */
export async function searchPodcastByName(url) {
  const podcastName = extractPodcastNameFromUrl(url);
  
  if (podcastName) {
    return await searchiTunesPodcast(podcastName);
  }
  
  return null;
} 