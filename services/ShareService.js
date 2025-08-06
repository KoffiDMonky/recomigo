import { Share, Alert } from 'react-native';

export default class ShareService {
  /**
   * Génère un deep link pour une carte
   */
  static generateDeepLink(cardId) {
    return `recomigo://card/${cardId}`;
  }

  /**
   * Génère un lien web de fallback
   */
  static generateWebLink(cardId) {
    return `https://recomigo.app/card/${cardId}`;
  }

  /**
   * Crée le contenu JSON d'une carte pour le partage
   */
  static createCardJSON(card) {
    // Vérification de sécurité pour éviter l'erreur TypeError
    if (!card) {
      console.warn('⚠️ Carte invalide dans createCardJSON:', card);
      return null;
    }
    
    return {
      id: card.id,
      title: card.title,
      type: card.type || 'Inconnu',
      description: card.description,
      director: card.director,
      artist: card.artist,
      album: card.album,
      hosts: card.hosts,
      link: card.link,
      recommendedBy: card.recommendedBy,
      image: card.image,
      sharedAt: new Date().toISOString(),
      version: "1.0.0"
    };
  }

  /**
   * Partage une carte
   */
  static async shareCard(card) {
    // Vérification de sécurité pour éviter l'erreur TypeError
    if (!card || !card.id || !card.title) {
      console.warn('⚠️ Carte invalide dans shareCard:', card);
      Alert.alert('Erreur', 'Impossible de partager une carte invalide');
      return;
    }
    
    try {
      const deepLink = this.generateDeepLink(card.id);
      const webLink = this.generateWebLink(card.id);
      
      const message = `Découvre "${card.title}" recommandé par ${card.recommendedBy || 'Adrien'} sur Recomigo !\n\n${deepLink}\n\nSi tu n'as pas l'app : ${webLink}`;

      const result = await Share.share({
        title: `Recomigo - ${card.title}`,
        message: message,
        url: deepLink
      });

      if (result.action === Share.sharedAction) {
        console.log('Partage réussi');
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      Alert.alert('Erreur', 'Impossible de partager la carte');
    }
  }

  /**
   * Affiche les options de partage
   */
  static showShareOptions(card) {
    // Vérification de sécurité pour éviter l'erreur TypeError
    if (!card) {
      console.warn('⚠️ Carte invalide dans showShareOptions:', card);
      return;
    }
    
    // Utiliser directement le partage natif qui propose toutes les options
    this.shareCard(card);
  }
} 