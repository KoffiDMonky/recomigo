import { API_KEYS } from '../config/api';
import { extractYouTubeId, getAvailableThumbnailFromUrl } from '../utils/youtubeUtils';

// Clé API YouTube (réutilise la même clé que YouTube)
const YOUTUBE_API_KEY = API_KEYS.YOUTUBE_API_KEY;

/**
 * Vérifie si une vidéo YouTube est un podcast
 * @param {Object} videoInfo - Informations de la vidéo
 * @returns {boolean} - True si c'est un podcast
 */
function isPodcastVideo(videoInfo) {
  if (!videoInfo || !videoInfo.snippet) return false;
  
  const { snippet } = videoInfo;
  const title = snippet.title.toLowerCase();
  const description = snippet.description.toLowerCase();
  const tags = snippet.tags || [];
  
  // Mots-clés de podcasts
  const podcastKeywords = [
    'podcast', 'episode', 'épisode', 'show', 'émission', 'radio',
    'interview', 'discussion', 'talk', 'conversation', 'débat',
    'live', 'stream', 'broadcast', 'diffusion'
  ];
  
  // Vérifier le titre et la description
  const hasPodcastKeywords = podcastKeywords.some(keyword => 
    title.includes(keyword) || description.includes(keyword)
  );
  
  // Vérifier les tags
  const hasPodcastTags = tags.some(tag => 
    podcastKeywords.some(keyword => tag.toLowerCase().includes(keyword))
  );
  
  // Vérifier la durée (les podcasts sont généralement plus longs)
  const duration = videoInfo.contentDetails?.duration;
  let isLongVideo = false;
  if (duration) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (match) {
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      const totalMinutes = hours * 60 + minutes;
      isLongVideo = totalMinutes >= 15; // Podcasts généralement > 15 min
    }
  }
  
  return hasPodcastKeywords || hasPodcastTags || isLongVideo;
}

/**
 * Extrait les informations de podcast d'une vidéo YouTube
 * @param {Object} videoInfo - Informations de la vidéo
 * @returns {Object|null} - Métadonnées du podcast
 */
function extractPodcastInfo(videoInfo) {
  if (!videoInfo || !videoInfo.snippet) return null;
  
  const { snippet } = videoInfo;
  const title = snippet.title;
  
  // Essayer d'extraire le numéro d'épisode
  const episodeMatch = title.match(/(?:episode|épisode|#)\s*(\d+)/i);
  const episodeNumber = episodeMatch ? episodeMatch[1] : null;
  
  // Essayer d'extraire le nom du podcast depuis le titre
  let podcastTitle = title;
  let episodeTitle = '';
  
  // Patterns pour séparer le nom du podcast et le titre de l'épisode
  const patterns = [
    /^(.+?)\s*[-–]\s*(.+)$/, // "Nom Podcast - Titre Episode"
    /^(.+?)\s*:\s*(.+)$/,    // "Nom Podcast : Titre Episode"
    /^(.+?)\s*#\s*\d+\s*(.+)$/i // "Nom Podcast #123 Titre Episode"
  ];
  
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      podcastTitle = match[1].trim();
      episodeTitle = match[2].trim();
      break;
    }
  }
  
  return {
    title: episodeTitle || title,
    hosts: snippet.channelTitle,
    description: snippet.description,
    duration: videoInfo.contentDetails?.duration,
    image: null, // Sera récupéré séparément
    channelTitle: snippet.channelTitle,
    publishedAt: snippet.publishedAt,
    viewCount: videoInfo.statistics?.viewCount,
    likeCount: videoInfo.statistics?.likeCount,
    episodeNumber: episodeNumber,
    podcastTitle: podcastTitle
  };
}

/**
 * Récupère les informations d'un podcast YouTube
 * @param {string} videoId - ID de la vidéo
 * @returns {Promise<Object|null>} - Métadonnées du podcast
 */
export async function getYouTubePodcastInfo(videoId) {
  if (!videoId || !YOUTUBE_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet,contentDetails,statistics`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      
      // Vérifier si c'est un podcast
      if (!isPodcastVideo(video)) {
        console.log('⚠️ Cette vidéo ne semble pas être un podcast');
        // On retourne quand même les infos de base
      }
      
      const podcastInfo = extractPodcastInfo(video);
      
      // Récupérer la miniature
      try {
        const thumbnailUrl = await getAvailableThumbnailFromUrl(`https://www.youtube.com/watch?v=${videoId}`);
        if (thumbnailUrl) {
          podcastInfo.image = thumbnailUrl;
        }
      } catch (error) {
        console.log('❌ Impossible de récupérer la miniature:', error.message);
      }
      
      return podcastInfo;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération des infos YouTube Podcast:', error);
    return null;
  }
}

/**
 * Récupère les métadonnées à partir d'une URL YouTube Podcast
 * @param {string} url - URL YouTube
 * @returns {Promise<Object|null>} - Métadonnées du podcast
 */
export async function getPodcastInfoFromUrl(url) {
  const videoId = extractYouTubeId(url);
  
  if (!videoId) {
    return null;
  }
  
  return await getYouTubePodcastInfo(videoId);
}

/**
 * Vérifie si une URL est une URL YouTube Podcast valide
 * @param {string} url - URL à vérifier
 * @returns {boolean} - True si c'est une URL YouTube valide
 */
export function isValidYouTubePodcastUrl(url) {
  if (!url) return false;
  
  // Utilise les mêmes patterns que YouTube
  const youtubePatterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=/,
    /^https?:\/\/youtu\.be\//,
    /^https?:\/\/(www\.)?youtube\.com\/embed\//,
    /^https?:\/\/(www\.)?youtube\.com\/v\//,
    /^https?:\/\/music\.youtube\.com\/watch\?v=/,
    /^https?:\/\/(www\.)?music\.youtube\.com\/watch\?v=/
  ];
  
  return youtubePatterns.some(pattern => pattern.test(url));
}

/**
 * Vérifie si la clé API est configurée
 * @returns {boolean} - True si la clé API est configurée
 */
export function isApiKeyConfigured() {
  return YOUTUBE_API_KEY !== 'VOTRE_CLE_API_YOUTUBE';
} 