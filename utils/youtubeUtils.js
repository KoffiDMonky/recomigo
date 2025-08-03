/**
 * Extrait l'ID YouTube d'une URL YouTube
 * @param {string} url - URL YouTube (supporte plusieurs formats)
 * @returns {string|null} - ID de la vidéo ou null si invalide
 */
export function extractYouTubeId(url) {
  if (!url) return null;
  
  // Patterns pour différents formats d'URL YouTube
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*&v=([^&\n?#]+)/
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
 * Génère l'URL de la miniature YouTube
 * @param {string} videoId - ID de la vidéo YouTube
 * @param {string} quality - Qualité de l'image ('default', 'hq', 'mq', 'sd', 'maxres')
 * @returns {string} - URL de la miniature
 */
export function getYouTubeThumbnail(videoId, quality = 'hq') {
  if (!videoId) return null;
  
  const qualities = {
    'default': 'default.jpg',
    'hq': 'hqdefault.jpg',
    'mq': 'mqdefault.jpg',
    'sd': 'sddefault.jpg',
    'maxres': 'maxresdefault.jpg'
  };
  
  const filename = qualities[quality] || qualities['hq'];
  return `https://img.youtube.com/vi/${videoId}/${filename}`;
}

/**
 * Extrait l'ID YouTube et génère l'URL de la miniature en une seule fonction
 * @param {string} url - URL YouTube
 * @param {string} quality - Qualité de l'image
 * @returns {string|null} - URL de la miniature ou null
 */
export function getThumbnailFromUrl(url, quality = 'hq') {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  
  return getYouTubeThumbnail(videoId, quality);
}

/**
 * Vérifie si une URL est une URL YouTube valide
 * @param {string} url - URL à vérifier
 * @returns {boolean} - True si c'est une URL YouTube valide
 */
export function isValidYouTubeUrl(url) {
  if (!url) return false;
  
  const youtubePatterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=/,
    /^https?:\/\/youtu\.be\//,
    /^https?:\/\/(www\.)?youtube\.com\/embed\//,
    /^https?:\/\/(www\.)?youtube\.com\/v\//
  ];
  
  return youtubePatterns.some(pattern => pattern.test(url));
} 