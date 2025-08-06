import { API_KEYS } from '../config/api';
import { extractYouTubeId, getAvailableThumbnailFromUrl } from '../utils/youtubeUtils';

// Clé API YouTube (réutilise la même clé que YouTube)
const YOUTUBE_API_KEY = API_KEYS.YOUTUBE_API_KEY;

/**
 * Vérifie si une vidéo YouTube est de type musique
 * @param {Object} videoInfo - Informations de la vidéo
 * @returns {boolean} - True si c'est une vidéo musicale
 */
function isMusicVideo(videoInfo) {
  if (!videoInfo || !videoInfo.snippet) return false;
  
  const { snippet } = videoInfo;
  const title = snippet.title.toLowerCase();
  const description = snippet.description.toLowerCase();
  const tags = snippet.tags || [];
  
  // Mots-clés musicaux
  const musicKeywords = [
    'music', 'song', 'track', 'album', 'artist', 'band', 'musique', 'chanson',
    'official music video', 'official video', 'audio', 'lyrics', 'paroles',
    'feat', 'ft', 'featuring', 'remix', 'cover', 'live', 'concert'
  ];
  
  // Vérifier le titre et la description
  const hasMusicKeywords = musicKeywords.some(keyword => 
    title.includes(keyword) || description.includes(keyword)
  );
  
  // Vérifier les tags
  const hasMusicTags = tags.some(tag => 
    musicKeywords.some(keyword => tag.toLowerCase().includes(keyword))
  );
  
  // Vérifier la catégorie (si disponible)
  const categoryId = snippet.categoryId;
  const isMusicCategory = categoryId === '10'; // Catégorie Musique sur YouTube
  
  return hasMusicKeywords || hasMusicTags || isMusicCategory;
}

/**
 * Extrait les informations musicales d'une vidéo YouTube
 * @param {Object} videoInfo - Informations de la vidéo
 * @returns {Object|null} - Métadonnées musicales
 */
function extractMusicInfo(videoInfo) {
  if (!videoInfo || !videoInfo.snippet) return null;
  
  const { snippet } = videoInfo;
  const title = snippet.title;
  
  // Patterns pour extraire l'artiste et le titre
  const patterns = [
    // "Artiste - Titre"
    /^([^-]+)\s*-\s*(.+)$/,
    // "Artiste ft. Featuring - Titre"
    /^([^-]+)\s*(?:ft\.?|feat\.?|featuring)\s*([^-]+)\s*-\s*(.+)$/,
    // "Titre (Official Music Video)"
    /^(.+?)\s*\([^)]*official[^)]*\)$/i,
    // "Titre [Official Video]"
    /^(.+?)\s*\[[^\]]*official[^\]]*\]$/i
  ];
  
  let artist = '';
  let songTitle = title;
  
  // Essayer d'extraire l'artiste du titre
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      if (match.length === 3) {
        // Format "Artiste - Titre"
        artist = match[1].trim();
        songTitle = match[2].trim();
      } else if (match.length === 4) {
        // Format "Artiste ft. Featuring - Titre"
        artist = `${match[1].trim()} ft. ${match[2].trim()}`;
        songTitle = match[3].trim();
      } else {
        // Format avec "Official"
        songTitle = match[1].trim();
      }
      break;
    }
  }
  
  // Si pas d'artiste extrait du titre, essayer depuis la chaîne
  if (!artist) {
    // Nettoyer le nom de la chaîne (enlever "- Topic", "- Official", etc.)
    let channelName = snippet.channelTitle;
    const channelPatterns = [
      /^(.+?)\s*-\s*topic$/i,
      /^(.+?)\s*-\s*official$/i,
      /^(.+?)\s*-\s*vevo$/i,
      /^(.+?)\s*-\s*channel$/i
    ];
    
    for (const pattern of channelPatterns) {
      const match = channelName.match(pattern);
      if (match) {
        channelName = match[1].trim();
        break;
      }
    }
    
    artist = channelName;
  }
  
  // Essayer d'extraire l'album depuis la description et les tags
  let album = '';
  const description = snippet.description;
  
  // Patterns pour détecter l'album dans la description
  const albumPatterns = [
    // "From the album 'Album Name'"
    /from\s+(?:the\s+)?album\s+['"]([^'"]+)['"]/i,
    // "Album: Album Name"
    /album\s*:\s*([^\n\r]+)/i,
    // "Album Name (Official Audio)"
    /([^()]+?)\s*\([^)]*official[^)]*\)/i,
    // "Album Name [Official Audio]"
    /([^[]+?)\s*\[[^\]]*official[^\]]*\]/i,
    // "Album Name - Official"
    /([^-]+?)\s*-\s*official/i,
    // "Album Name | Official"
    /([^|]+?)\s*\|\s*official/i
  ];
  
  // Chercher l'album dans la description
  for (const pattern of albumPatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      const potentialAlbum = match[1].trim();
      // Vérifier que ce n'est pas l'artiste ou le titre
      if (potentialAlbum.length > 2 && 
          potentialAlbum.length < 100 &&
          !potentialAlbum.toLowerCase().includes(artist.toLowerCase()) &&
          !potentialAlbum.toLowerCase().includes(songTitle.toLowerCase())) {
        album = potentialAlbum;
        break;
      }
    }
  }
  
        // Si pas trouvé dans la description, chercher dans les tags
      if (!album && snippet.tags) {
        const excludedWords = [
          'official', 'music', 'video', 'audio', 'lyrics', 'paroles',
          'remix', 'cover', 'live', 'concert', 'performance',
          'new', 'latest', 'release', 'single', 'track', 'song',
          'artist', 'band', 'singer', 'musician', 'topic'
        ];
        
        // Filtrer les tags pour trouver l'album
        const albumTags = snippet.tags.filter(tag => {
          const tagLower = tag.toLowerCase();
          
          // Vérifications de base
          if (tag.length < 3 || tag.length > 50) return false;
          
          // Exclure les mots-clés génériques
          if (excludedWords.some(word => tagLower.includes(word))) return false;
          
          // Exclure si c'est l'artiste ou le titre (plus flexible)
          const artistWords = (artist || '').toLowerCase().split(/\s+/);
          const titleWords = songTitle.toLowerCase().split(/\s+/);
          
          // Vérifier si le tag contient des mots de l'artiste
          const containsArtistWord = artistWords.some(word => 
            word.length > 2 && tagLower.includes(word)
          );
          if (containsArtistWord) return false;
          
          // Vérifier si le tag contient des mots du titre
          const containsTitleWord = titleWords.some(word => 
            word.length > 2 && tagLower.includes(word)
          );
          if (containsTitleWord) return false;
          
          // Exclure les tags trop courts ou trop longs
          if (tag.length < 3 || tag.length > 30) return false;
          
          // Exclure les tags qui ressemblent à des mots-clés YouTube
          const youtubeKeywords = ['topic', 'channel', 'playlist', 'album', 'ep'];
          if (youtubeKeywords.some(keyword => tagLower.includes(keyword))) return false;
          
          return true;
        });
        
        if (albumTags.length > 0) {
          // Prendre le tag le plus long qui pourrait être l'album
          album = albumTags.sort((a, b) => b.length - a.length)[0];
        }
      }
  
  return {
    title: songTitle,
    artist: artist || snippet.channelTitle,
    album: album,
    duration: videoInfo.contentDetails?.duration,
    image: null, // Sera récupéré séparément
    channelTitle: snippet.channelTitle,
    publishedAt: snippet.publishedAt,
    viewCount: videoInfo.statistics?.viewCount,
    likeCount: videoInfo.statistics?.likeCount,
    description: snippet.description
  };
}

/**
 * Récupère les informations d'une vidéo YouTube Music
 * @param {string} videoId - ID de la vidéo
 * @returns {Promise<Object|null>} - Métadonnées musicales
 */
export async function getYouTubeMusicInfo(videoId) {
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
      
      // Vérifier si c'est une vidéo musicale
      if (!isMusicVideo(video)) {
        console.log('⚠️ Cette vidéo ne semble pas être une vidéo musicale');
        // On retourne quand même les infos de base
      }
      
      const musicInfo = extractMusicInfo(video);
      
      // Récupérer la miniature
      try {
        const thumbnailUrl = await getAvailableThumbnailFromUrl(`https://www.youtube.com/watch?v=${videoId}`);
        if (thumbnailUrl) {
          musicInfo.image = thumbnailUrl;
        }
      } catch (error) {
        console.log('❌ Impossible de récupérer la miniature:', error.message);
      }
      
      return musicInfo;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération des infos YouTube Music:', error);
    return null;
  }
}

/**
 * Récupère les métadonnées à partir d'une URL YouTube Music
 * @param {string} url - URL YouTube
 * @returns {Promise<Object|null>} - Métadonnées musicales
 */
export async function getMusicInfoFromUrl(url) {
  const videoId = extractYouTubeId(url);
  
  if (!videoId) {
    return null;
  }
  
  return await getYouTubeMusicInfo(videoId);
}

/**
 * Vérifie si une URL est une URL YouTube Music valide
 * @param {string} url - URL à vérifier
 * @returns {boolean} - True si c'est une URL YouTube valide
 */
export function isValidYouTubeMusicUrl(url) {
  if (!url) return false;
  
  // Patterns pour YouTube et YouTube Music
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