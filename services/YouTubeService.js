import { API_KEYS } from '../config/api';

// Clé API YouTube
const YOUTUBE_API_KEY = API_KEYS.YOUTUBE_API_KEY;

/**
 * Récupère les métadonnées d'une vidéo YouTube
 * @param {string} videoId - ID de la vidéo YouTube
 * @returns {Promise<Object>} - Métadonnées de la vidéo
 */
export async function getYouTubeVideoInfo(videoId) {
  if (!videoId || !YOUTUBE_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet,contentDetails`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      const snippet = video.snippet;
      
      return {
        title: snippet.title,
        description: snippet.description,
        channelTitle: snippet.channelTitle,
        publishedAt: snippet.publishedAt,
        duration: video.contentDetails?.duration,
        viewCount: video.statistics?.viewCount,
        likeCount: video.statistics?.likeCount,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération des infos YouTube:', error);
    return null;
  }
}

/**
 * Récupère les métadonnées à partir d'une URL YouTube
 * @param {string} url - URL YouTube
 * @returns {Promise<Object>} - Métadonnées de la vidéo
 */
export async function getVideoInfoFromUrl(url) {
  const { extractYouTubeId } = require('../utils/youtubeUtils');
  const videoId = extractYouTubeId(url);
  
  if (!videoId) {
    return null;
  }
  
  return await getYouTubeVideoInfo(videoId);
}

/**
 * Vérifie si la clé API est configurée
 * @returns {boolean} - True si la clé API est configurée
 */
export function isApiKeyConfigured() {
  return YOUTUBE_API_KEY !== 'VOTRE_CLE_API_YOUTUBE';
} 