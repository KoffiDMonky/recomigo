import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const CACHE_KEY = 'image_cache';
const CACHE_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 jours

// Fonction utilitaire pour générer un hash MD5
function generateMD5Hash(str) {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(16);
}

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
        console.log('📦 Cache chargé:', this.cache.size, 'images valides');
        
        // Log des statistiques du cache
        const failedCount = Array.from(this.cache.values()).filter(data => data.failed).length;
        const successCount = this.cache.size - failedCount;
        console.log(`📊 Statistiques cache: ${successCount} succès, ${failedCount} échecs`);
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
    // Génère une clé unique basée sur un hash MD5 de l'URL
    // Cela évite les problèmes de noms de fichiers trop longs
    const hash = generateMD5Hash(url);
    
    // Extraire l'extension de manière plus sûre
    let extension = 'jpg'; // Extension par défaut
    
    try {
      // Essayer d'extraire l'extension de l'URL
      const urlParts = url.split('?')[0]; // Enlever les paramètres
      const lastDotIndex = urlParts.lastIndexOf('.');
      
      if (lastDotIndex !== -1 && lastDotIndex < urlParts.length - 1) {
        const extractedExtension = urlParts.substring(lastDotIndex + 1);
        // Vérifier que l'extension est valide (pas trop longue, pas de caractères spéciaux)
        if (extractedExtension.length <= 4 && /^[a-zA-Z0-9]+$/.test(extractedExtension)) {
          extension = extractedExtension;
        }
      }
    } catch (error) {
      console.log('⚠️ Erreur extraction extension, utilisation par défaut:', error.message);
    }
    
    return `${hash}.${extension}`;
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
    const platform = this.getPlatformFromUrl(url);
    
    console.log(`🖼️ Cache image [${platform}]: ${url.substring(0, 50)}...`);
    console.log(`🔑 Clé générée: ${key}`);
    
    // Vérifier si déjà en cache
    if (this.isCached(url)) {
      console.log(`📦 Image en cache [${platform}]: ${url.substring(0, 30)}...`);
      return this.getCached(url);
    }

    try {
      console.log(`📥 Téléchargement [${platform}]: ${url.substring(0, 50)}...`);
      
      // Essayer d'abord le dossier principal
      let cacheDir = `${FileSystem.cacheDirectory}image_cache/`;
      let localUri = `${cacheDir}${key}`;
      
      try {
        const dirInfo = await FileSystem.getInfoAsync(cacheDir);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
          console.log('📁 Dossier cache créé:', cacheDir);
        }
      } catch (error) {
        console.log('⚠️ Erreur création dossier cache principal:', error.message);
        // Essayer avec un nom de dossier plus simple
        cacheDir = `${FileSystem.cacheDirectory}img_cache/`;
        localUri = `${cacheDir}${key}`;
        
        try {
          const simpleDirInfo = await FileSystem.getInfoAsync(cacheDir);
          if (!simpleDirInfo.exists) {
            await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
            console.log('📁 Dossier cache simple créé:', cacheDir);
          }
        } catch (simpleError) {
          console.log('❌ Erreur création dossier cache simple:', simpleError.message);
          throw simpleError;
        }
      }

      // Vérifier d'abord si l'URL est accessible
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
      }

      // Télécharger l'image
      console.log(`💾 Sauvegarde locale: ${localUri}`);
      
      const downloadResult = await FileSystem.downloadAsync(url, localUri);
      
      if (downloadResult.status === 200) {
        // Sauvegarder dans le cache
        this.cache.set(key, {
          localUri: downloadResult.uri,
          timestamp: Date.now(),
          platform: platform,
          originalUrl: url
        });
        
        await this.saveCache();
        console.log(`✅ Image mise en cache [${platform}]: ${url.substring(0, 30)}...`);
        return downloadResult.uri;
      } else {
        throw new Error(`Erreur téléchargement: ${downloadResult.status}`);
      }
    } catch (error) {
      console.log(`⚠️ Erreur cache image [${platform}]: ${error.message}`);
      
      // Si c'est une erreur 404 ou autre, marquer comme échoué
      if (error.message.includes('404') || error.message.includes('Erreur HTTP: 404')) {
        console.log(`🚫 Image non disponible (404) [${platform}], pas de retry`);
      } else {
        console.log(`🚫 Erreur image [${platform}], pas de retry`);
      }
      
      // Marquer comme échoué pour éviter les retries inutiles
      this.cache.set(key, {
        localUri: null,
        timestamp: Date.now(),
        failed: true,
        platform: platform,
        originalUrl: url,
        error: error.message
      });
      await this.saveCache();
      
      throw error;
    }
  }

  getPlatformFromUrl(url) {
    if (url.includes('tmdb.org')) return 'TMDB';
    if (url.includes('youtube.com') || url.includes('ytimg.com')) return 'YouTube';
    if (url.includes('scdn.co')) return 'Spotify';
    if (url.includes('mzstatic.com')) return 'Apple Podcasts';
    return 'Autre';
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