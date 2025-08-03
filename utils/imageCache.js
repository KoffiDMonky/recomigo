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
    return now - cached.timestamp < CACHE_EXPIRY;
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
      console.error('❌ Erreur cache image:', error);
      throw error;
    }
  }

  async cleanup() {
    try {
      const now = Date.now();
      const expiredKeys = [];
      
      for (const [key, data] of this.cache.entries()) {
        if (now - data.timestamp >= CACHE_EXPIRY) {
          expiredKeys.push(key);
        }
      }
      
      // Supprimer les entrées expirées
      for (const key of expiredKeys) {
        this.cache.delete(key);
      }
      
      await this.saveCache();
      console.log('🧹 Cache nettoyé:', expiredKeys.length, 'entrées supprimées');
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