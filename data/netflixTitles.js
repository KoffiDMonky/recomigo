/**
 * Base de données de correspondance entre IDs Netflix et titres TMDB
 * Cette base permet de chercher automatiquement le bon film/série
 */

export const NETFLIX_TITLES = {
  // Films populaires déjà testés
  '70305903': { title: 'Interstellar', tmdbId: 157336, type: 'movie' },
  '80211726': { title: 'Ready Player One', tmdbId: 333339, type: 'movie' },
  '11819086': { title: 'The Truman Show', tmdbId: 37165, type: 'movie' },
  '70195800': { title: 'Suits', tmdbId: 37680, type: 'tv' },
  
  // Nouveaux films populaires à tester
  '80192098': { title: 'Stranger Things', tmdbId: 299534, type: 'tv' },
  '80057281': { title: 'Narcos', tmdbId: 63351, type: 'tv' },
  '80195800': { title: 'The Crown', tmdbId: 61459, type: 'tv' },
  '80057282': { title: 'The Office', tmdbId: 2316, type: 'tv' },
  '80195801': { title: 'Friends', tmdbId: 1668, type: 'tv' },
  '80057283': { title: 'Breaking Bad', tmdbId: 1396, type: 'tv' },
  '80195802': { title: 'Better Call Saul', tmdbId: 60059, type: 'tv' },
  '80057284': { title: 'BoJack Horseman', tmdbId: 61222, type: 'tv' },
  '80195803': { title: 'Big Mouth', tmdbId: 70785, type: 'tv' },
  
  // Films d'action/SF populaires
  '80211727': { title: 'The Matrix', tmdbId: 603, type: 'movie' },
  '80211728': { title: 'Inception', tmdbId: 27205, type: 'movie' },
  '80211729': { title: 'The Dark Knight', tmdbId: 155, type: 'movie' },
  '80211730': { title: 'Pulp Fiction', tmdbId: 680, type: 'movie' },
  '80211731': { title: 'Fight Club', tmdbId: 550, type: 'movie' },
  
  // Films de comédie populaires
  '80211732': { title: 'The Grand Budapest Hotel', tmdbId: 120467, type: 'movie' },
  '80211733': { title: 'La La Land', tmdbId: 313369, type: 'movie' },
  '80211734': { title: 'Birdman', tmdbId: 194662, type: 'movie' },
  '80211735': { title: 'The Social Network', tmdbId: 37799, type: 'movie' },
  '80211736': { title: 'Her', tmdbId: 152601, type: 'movie' },
  
  // Films de drame populaires
  '80211737': { title: 'The Shawshank Redemption', tmdbId: 278, type: 'movie' },
  '80211738': { title: 'Forrest Gump', tmdbId: 13, type: 'movie' },
  '80211739': { title: 'The Green Mile', tmdbId: 497, type: 'movie' },
  '80211740': { title: 'Schindler\'s List', tmdbId: 424, type: 'movie' },
  '80211741': { title: 'Goodfellas', tmdbId: 769, type: 'movie' },
  
  // Séries populaires
  '80195804': { title: 'The Witcher', tmdbId: 71912, type: 'tv' },
  '80195805': { title: 'Money Heist', tmdbId: 71446, type: 'tv' },
  '80195806': { title: 'Dark', tmdbId: 70523, type: 'tv' },
  '80195807': { title: 'The Queen\'s Gambit', tmdbId: 87739, type: 'tv' },
  '80195808': { title: 'Bridgerton', tmdbId: 87739, type: 'tv' },
  
  // Films d'animation populaires
  '80211742': { title: 'Spider-Man: Into the Spider-Verse', tmdbId: 324857, type: 'movie' },
  '80211743': { title: 'Coco', tmdbId: 354912, type: 'movie' },
  '80211744': { title: 'Zootopia', tmdbId: 269149, type: 'movie' },
  '80211745': { title: 'Moana', tmdbId: 277834, type: 'movie' },
  '80211746': { title: 'Frozen', tmdbId: 109445, type: 'movie' },
};

/**
 * Cherche un titre par ID Netflix
 * @param {string} netflixId - ID Netflix
 * @returns {Object|null} - Informations du titre ou null
 */
export function findNetflixTitle(netflixId) {
  return NETFLIX_TITLES[netflixId] || null;
}

/**
 * Ajoute un nouveau titre à la base
 * @param {string} netflixId - ID Netflix
 * @param {string} title - Titre du film/série
 * @param {number} tmdbId - ID TMDB
 * @param {string} type - 'movie' ou 'tv'
 */
export function addNetflixTitle(netflixId, title, tmdbId, type) {
  NETFLIX_TITLES[netflixId] = { title, tmdbId, type };
}

/**
 * Liste tous les titres disponibles
 * @returns {Object} - Tous les titres
 */
export function getAllNetflixTitles() {
  return NETFLIX_TITLES;
} 