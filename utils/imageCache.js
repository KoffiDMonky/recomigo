import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const CACHE_KEY = 'image_cache';
const CACHE_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 jours

class ImageCache {
  constructor() {
    this.cache = new Map();
    this.loadCache();
  }

  async loadCache() {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const cacheData = JSON.parse(cachedData);
        const now = Date.now();
        
        // Filtrer les entrées expirées
        const validEntries = Object.entries(cacheData).filter(([key, data]) => {
          return now - data.timestamp < CACHE_EXPIRY;
        });
        
        this.cache = new Map(validEntries);
        console.log('📦 Cache chargé:', this.cache.size, 'images');
      }
    } catch (error) {
      console.error('❌ Erreur chargement cache:', error);
    }
  }

  async saveCache() {
    try {
      const cacheData = Object.fromEntries(this.cache);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('❌ Erreur sauvegarde cache:', error);
    }
  }

  generateKey(url) {
    // Génère une clé unique basée sur l'URL
    return url.replace(/[^a-zA-Z0-9]/g, '_');
  }

  isCached(url) {
    const key = this.generateKey(url);
    const cached = this.cache.get(key);
    if (!cached) return false;
    
    // Vérifier si l'entrée n'est pas expirée
    const now = Date.now();
    const isValid = now - cached.timestamp < CACHE_EXPIRY;
    
    // Si l'image a échoué, ne pas la considérer comme en cache
    if (cached.failed) {
      return false;
    }
    
    return isValid && cached.localUri;
  }

  getCached(url) {
    const key = this.generateKey(url);
    const cached = this.cache.get(key);
    return cached ? cached.localUri : null;
  }

  async cacheImage(url) {
    const key = this.generateKey(url);
    
    // Vérifier si déjà en cache
    if (this.isCached(url)) {
      console.log('📦 Image en cache:', url);
      return this.getCached(url);
    }

    try {
      console.log('📥 Téléchargement image:', url);
      
      // Créer le dossier de cache s'il n'existe pas
      const cacheDir = `${FileSystem.cacheDirectory}image_cache/`;
      const dirInfo = await FileSystem.getInfoAsync(cacheDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
      }

      // Vérifier d'abord si l'URL est accessible
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
      }

      // Télécharger l'image
      const localUri = `${cacheDir}${key}.jpg`;
      const downloadResult = await FileSystem.downloadAsync(url, localUri);
      
      if (downloadResult.status === 200) {
        // Sauvegarder dans le cache
        this.cache.set(key, {
          localUri: downloadResult.uri,
          timestamp: Date.now()
        });
        
        await this.saveCache();
        console.log('✅ Image mise en cache:', url);
        return downloadResult.uri;
      } else {
        throw new Error(`Erreur téléchargement: ${downloadResult.status}`);
      }
    } catch (error) {
      console.log('⚠️ Erreur cache image:', error.message);
      
      // Si c'est une erreur 404 ou autre, marquer comme échoué
      if (error.message.includes('404') || error.message.includes('Erreur HTTP: 404')) {
        console.log('🚫 Image non disponible (404), pas de retry');
      } else {
        console.log('🚫 Erreur image, pas de retry');
      }
      
      // Marquer comme échoué pour éviter les retries inutiles
      this.cache.set(key, {
        localUri: null,
        timestamp: Date.now(),
        failed: true
      });
      await this.saveCache();
      
      throw error;
    }
  }

  async cleanup() {
    try {
      const now = Date.now();
      const expiredKeys = [];
      const failedKeys = [];
      
      for (const [key, data] of this.cache.entries()) {
        if (now - data.timestamp >= CACHE_EXPIRY) {
          expiredKeys.push(key);
        }
        // Supprimer aussi les entrées marquées comme échouées après un délai
        if (data.failed && now - data.timestamp >= 24 * 60 * 60 * 1000) { // 24h
          failedKeys.push(key);
        }
      }
      
      // Supprimer les entrées expirées et échouées
      for (const key of [...expiredKeys, ...failedKeys]) {
        this.cache.delete(key);
      }
      
      await this.saveCache();
      console.log('🧹 Cache nettoyé:', expiredKeys.length, 'expirées,', failedKeys.length, 'échouées supprimées');
    } catch (error) {
      console.error('❌ Erreur nettoyage cache:', error);
    }
  }

  async clear() {
    try {
      this.cache.clear();
      await AsyncStorage.removeItem(CACHE_KEY);
      console.log('🗑️ Cache vidé');
    } catch (error) {
      console.error('❌ Erreur vidage cache:', error);
    }
  }
}

export default new ImageCache(); 