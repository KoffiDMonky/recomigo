import * as Linking from 'expo-linking';
import { Alert } from 'react-native';
import { addCard } from '../data/storage';

export default class DeepLinkService {
  static listener = null;

  /**
   * Initialise le service de deep linking
   */
  static init() {
    // Gérer les deep links quand l'app est déjà ouverte
    this.listener = Linking.addEventListener('url', this.handleDeepLink);
    
    // Gérer les deep links au lancement de l'app
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleDeepLink({ url });
      }
    });
  }

  /**
   * Gère les deep links reçus
   */
  static async handleDeepLink({ url }) {
    try {
      const parsedUrl = Linking.parse(url);
      
      if (parsedUrl.scheme === 'recomigo' && parsedUrl.path) {
        const pathParts = parsedUrl.path.split('/');
        
        if (pathParts[1] === 'card' && pathParts[2]) {
          const cardId = pathParts[2];
          await this.importSharedCard(cardId);
        }
      }
    } catch (error) {
      console.error('Erreur lors du traitement du deep link:', error);
    }
  }

  /**
   * Importe une carte partagée
   */
  static async importSharedCard(cardId) {
    try {
      // Pour l'instant, on simule l'import
      // Plus tard, on pourra récupérer les données depuis un serveur
      Alert.alert(
        'Carte partagée',
        `Carte ${cardId} reçue !\n\nCette fonctionnalité sera disponible dans une prochaine version.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erreur lors de l\'import de la carte:', error);
      Alert.alert('Erreur', 'Impossible d\'importer la carte partagée');
    }
  }

  /**
   * Nettoie les listeners
   */
  static cleanup() {
    if (this.listener) {
      this.listener.remove();
    }
  }
} 