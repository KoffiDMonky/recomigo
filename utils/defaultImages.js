/**
 * Utilitaire pour gérer les images par défaut par type de contenu
 */

// Images par défaut pour chaque type de contenu
const DEFAULT_IMAGES = {
  // Films - utiliser des images existantes comme fallback
  'Film': require('../assets/interstellar.jpg'),
  'Série': require('../assets/fleabag.jpg'),
  'Musique': require('../assets/seeyouagain.jpg'),
  'Podcast': require('../assets/floodcast.jpg'),
  'YouTube': require('../assets/everythingisaremix.jpg'),
  'Spotify': require('../assets/seeyouagain.jpg'),
  'Apple Podcasts': require('../assets/floodcast.jpg'),
  
  // Fallback générique
  'default': require('../assets/Logo_expo-Recomigo.jpg')
};

/**
 * Obtient l'image par défaut pour un type de contenu donné
 * @param {string} type - Le type de contenu (Film, Série, Musique, etc.)
 * @returns {any} - L'image par défaut
 */
export function getDefaultImage(type) {
  // Normaliser le type
  const normalizedType = type ? type.trim() : 'default';
  
  // Retourner l'image par défaut pour ce type, ou l'image par défaut générique
  return DEFAULT_IMAGES[normalizedType] || DEFAULT_IMAGES['default'];
}

/**
 * Obtient l'image par défaut basée sur la plateforme de l'URL
 * @param {string} url - L'URL de l'image
 * @returns {any} - L'image par défaut appropriée
 */
export function getDefaultImageByUrl(url) {
  if (!url) return DEFAULT_IMAGES['default'];
  
  if (url.includes('tmdb.org')) {
    return DEFAULT_IMAGES['Film']; // TMDB = films/séries
  }
  if (url.includes('youtube.com') || url.includes('ytimg.com')) {
    return DEFAULT_IMAGES['YouTube'];
  }
  if (url.includes('scdn.co')) {
    return DEFAULT_IMAGES['Spotify'];
  }
  if (url.includes('mzstatic.com')) {
    return DEFAULT_IMAGES['Apple Podcasts'];
  }
  
  return DEFAULT_IMAGES['default'];
}

/**
 * Obtient l'image par défaut basée sur le type et la plateforme
 * @param {string} type - Le type de contenu
 * @param {string} url - L'URL de l'image (optionnel)
 * @returns {any} - L'image par défaut appropriée
 */
export function getBestDefaultImage(type, url = null) {
  // Si on a un type spécifique, l'utiliser en priorité
  if (type) {
    const typeImage = getDefaultImage(type);
    if (typeImage) return typeImage;
  }
  
  // Sinon, utiliser l'URL pour déterminer la plateforme
  if (url) {
    return getDefaultImageByUrl(url);
  }
  
  // Fallback final
  return DEFAULT_IMAGES['default'];
}

/**
 * Vérifie si une image est une image par défaut
 * @param {any} image - L'image à vérifier
 * @returns {boolean} - True si c'est une image par défaut
 */
export function isDefaultImage(image) {
  if (!image) return true;
  
  // Si c'est une image locale (require), c'est probablement une image par défaut
  if (typeof image === 'number') return true;
  
  // Si c'est une URL qui pointe vers nos assets, c'est une image par défaut
  if (typeof image === 'string' && image.includes('assets/')) return true;
  
  return false;
}

export default {
  getDefaultImage,
  getDefaultImageByUrl,
  getBestDefaultImage,
  isDefaultImage,
  DEFAULT_IMAGES
}; 