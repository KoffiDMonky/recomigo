/**
 * Extrait l'ID YouTube d'une URL YouTube
 * @param {string} url - URL YouTube (supporte plusieurs formats)
 * @returns {string|null} - ID de la vidéo ou null si invalide
 */
export function extractYouTubeId(url) {
  if (!url) return null;
  
  // Patterns pour différents formats d'URL YouTube et YouTube Music
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*&v=([^&\n?#]+)/,
    /music\.youtube\.com\/watch\?v=([^&\n?#]+)/,
    /music\.youtube\.com\/watch\?.*&v=([^&\n?#]+)/
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
 * Teste si une URL d'image YouTube est accessible
 * @param {string} url - URL de l'image à tester
 * @returns {Promise<boolean>} - True si l'image est accessible
 */
export async function isYouTubeImageAccessible(url) {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.log('❌ Image YouTube non accessible:', url, error.message);
    return false;
  }
}

/**
 * Essaie différentes qualités d'images YouTube et retourne la première disponible
 * @param {string} videoId - ID de la vidéo YouTube
 * @returns {Promise<string|null>} - URL de la première image disponible ou null
 */
export async function getAvailableYouTubeThumbnail(videoId) {
  if (!videoId) return null;
  
  const qualities = ['hq', 'mq', 'default', 'sd', 'maxres'];
  
  for (const quality of qualities) {
    try {
      const url = getYouTubeThumbnail(videoId, quality);
      const isAccessible = await isYouTubeImageAccessible(url);
      if (isAccessible) {
        console.log(`✅ Image YouTube trouvée avec qualité: ${quality}`);
        return url;
      }
    } catch (error) {
      console.log(`❌ Échec pour qualité ${quality}:`, error.message);
    }
  }
  
  console.log('❌ Aucune image YouTube disponible');
  return null;
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
 * Extrait l'ID YouTube et essaie de trouver une miniature disponible
 * @param {string} url - URL YouTube
 * @returns {Promise<string|null>} - URL de la miniature disponible ou null
 */
export async function getAvailableThumbnailFromUrl(url) {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  
  return await getAvailableYouTubeThumbnail(videoId);
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
    /^https?:\/\/(www\.)?youtube\.com\/v\//,
    /^https?:\/\/music\.youtube\.com\/watch\?v=/,
    /^https?:\/\/(www\.)?music\.youtube\.com\/watch\?v=/
  ];
  
  return youtubePatterns.some(pattern => pattern.test(url));
} 