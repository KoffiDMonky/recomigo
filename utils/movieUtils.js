/**
 * Utilitaires pour les images de films et séries
 */

// Images par défaut pour différentes plateformes
const DEFAULT_IMAGES = {
  netflix: 'https://image.tmdb.org/t/p/w500/tVqvztjig1o001EAAZs9wCs3bV6.jpg', // Suits
  disney: 'https://image.tmdb.org/t/p/w500/wN95OS6WD9T4BqA9TNCRATHcmJK.jpg', // Malcolm
  prime: 'https://image.tmdb.org/t/p/w500/tVqvztjig1o001EAAZs9wCs3bV6.jpg', // Suits
  tmdb: null, // TMDB fournit ses propres images
  allocine: 'https://image.tmdb.org/t/p/w500/tVqvztjig1o001EAAZs9wCs3bV6.jpg', // Suits
  imdb: 'https://image.tmdb.org/t/p/w500/tVqvztjig1o001EAAZs9wCs3bV6.jpg' // Suits
};

/**
 * Récupère une image par défaut pour une plateforme
 * @param {string} platform - Nom de la plateforme
 * @returns {string|null} - URL de l'image par défaut
 */
export function getDefaultImage(platform) {
  return DEFAULT_IMAGES[platform.toLowerCase()] || null;
}

/**
 * Vérifie si une image est accessible
 * @param {string} imageUrl - URL de l'image
 * @returns {Promise<boolean>} - True si l'image est accessible
 */
export async function isImageAccessible(imageUrl) {
  if (!imageUrl) return false;
  
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.log('❌ Image non accessible:', imageUrl, error.message);
    return false;
  }
}

/**
 * Récupère la meilleure image disponible
 * @param {string} primaryImage - Image principale
 * @param {string} platform - Plateforme
 * @returns {Promise<string|null>} - URL de la meilleure image
 */
export async function getBestImage(primaryImage, platform) {
  // Si l'image principale est accessible, l'utiliser
  if (primaryImage && await isImageAccessible(primaryImage)) {
    return primaryImage;
  }
  
  // Sinon, utiliser l'image par défaut de la plateforme
  const defaultImage = getDefaultImage(platform);
  if (defaultImage && await isImageAccessible(defaultImage)) {
    return defaultImage;
  }
  
  return null;
}

/**
 * Génère une couleur de fond basée sur le titre
 * @param {string} title - Titre du film/série
 * @returns {string} - Couleur hexadécimale
 */
export function generateBackgroundColor(title) {
  if (!title) return '#4CAF50';
  
  // Hash simple basé sur le titre
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Générer une couleur basée sur le hash
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

/**
 * Formate le titre pour l'affichage
 * @param {string} title - Titre original
 * @returns {string} - Titre formaté
 */
export function formatTitle(title) {
  if (!title) return '';
  
  // Capitaliser la première lettre de chaque mot
  return title
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
} 