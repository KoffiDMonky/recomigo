import AsyncStorage from '@react-native-async-storage/async-storage';
import { CATEGORY_CONFIG } from "./categories";
import { getThumbnailFromUrl, isValidYouTubeUrl } from "../utils/youtubeUtils";

const STORAGE_KEY = 'recomigo_cards';
const INIT_KEY = 'recomigo_initialized';

// Fonction simple pour générer un ID unique
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Récupère toutes les cartes enregistrées.
 * Si c'est la première ouverture, initialise avec data par défaut.
 * @returns {Promise<Array>} Tableau d'objets card
 */
export async function getAllCards(defaultCards = [], forceInit = true) {
  const initialized = await AsyncStorage.getItem(INIT_KEY);
  
  // Vérifier d'abord s'il y a des cartes dans le storage
  const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
  
  let result = [];
  if (jsonValue != null && jsonValue !== '[]') {
    try {
      result = JSON.parse(jsonValue);
      
      // Si on a des cartes, on remet INIT_KEY à true
      if (result.length > 0 && !initialized) {
        await AsyncStorage.setItem(INIT_KEY, 'true');
      }
    } catch (e) {
      console.error('Erreur parsing JSON:', e);
      await AsyncStorage.removeItem(STORAGE_KEY);
      result = [];
    }
  } else {
    // Seulement initialiser si forceInit est true ET qu'il n'y a pas de cartes
    if (!initialized && forceInit) {
      const enriched = defaultCards.map(addIdIfMissing);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
      await AsyncStorage.setItem(INIT_KEY, 'true');
      return enriched;
    }
  }
  
  return result;
}

/**
 * Sauvegarde la liste complète de cartes.
 * @param {Array} cards Tableau d'objets card
 */
export async function saveCards(cards) {
  try {
    const jsonString = JSON.stringify(cards);
    await AsyncStorage.setItem(STORAGE_KEY, jsonString);
  } catch (e) {
    console.error('Erreur sauvegarde storage:', e);
  }
}

/**
 * Ajoute une nouvelle carte.
 * @param {Object} card Nouvel objet carte
 */
export async function addCard(card) {
  try {
    const cards = await getAllCards([], false);
    const withId = addIdIfMissing(card);
    const newCards = [withId, ...cards];
    await saveCards(newCards);
  } catch (error) {
    console.error('Erreur dans addCard:', error);
    throw error;
  }
}

/**
 * Met à jour une carte existante par son id.
 * @param {string|number} id Identifiant unique de la carte
 * @param {Object} updatedFields Champs à mettre à jour
 */
export async function updateCard(id, updatedFields) {
  const cards = await getAllCards([], false);
  const newCards = cards.map((c) =>
    c.id === id ? { ...c, ...updatedFields } : c
  );
  await saveCards(newCards);
}

/**
 * Supprime une carte par son id.
 * @param {string|number} id Identifiant unique de la carte
 */
export async function deleteCard(id) {
  const cards = await getAllCards([], false);
  const filtered = cards.filter((c) => c.id !== id);
  await saveCards(filtered);
}

/**
 * Initialise les cartes par défaut manuellement (pour phase de dev uniquement)
 */
export async function initializeDefaultCards(defaultCards = []) {
    try {
      const initialized = await AsyncStorage.getItem(INIT_KEY);
      if (!initialized) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCards));
        await AsyncStorage.setItem(INIT_KEY, 'true');
      }
    } catch (e) {
      console.error('Erreur initialisation:', e);
    }
  }

/**
 * Vide complètement le storage (pour debugging).
 */
export async function clearAll() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem(INIT_KEY);
    await AsyncStorage.removeItem('onboarding_completed');
  } catch (e) {
    console.error('Erreur clear storage:', e);
  }
}

export function enrichCard(card) {
  const category = card.type;
  const config = CATEGORY_CONFIG[category];
  
  // Récupérer automatiquement la miniature YouTube si c'est une vidéo YouTube
  let image = card.image;
  if (!image && card.link && isValidYouTubeUrl(card.link)) {
    image = getThumbnailFromUrl(card.link, 'maxres');
  }
  
  if (config) {
    return {
      ...card,
      ...config,
      // Utiliser l'image fournie, la miniature YouTube, ou null pour l'icône
      image: image || null,
    };
  }
  return {
    ...card,
    image: image || null,
  };
}

function addIdIfMissing(card) {
  if (!card.id) {
    return { ...card, id: generateId() };
  }
  return card;
}