import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from 'expo-linking';
import imageCache from "../utils/imageCache";
import { CATEGORY_CONFIG } from "../data/categories";
import { isValidYouTubeUrl, getAvailableThumbnailFromUrl } from "../utils/youtubeUtils";
import { getSpotifyImageFromUrl, isValidSpotifyUrl } from "../services/SpotifyImageService";

function hexToRgba(hex, alpha = 1) {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

// Fonction pour formater la durée YouTube (format ISO 8601)
function formatDuration(duration) {
  if (!duration) return '';
  
  // Si c'est un nombre (millisecondes Spotify)
  if (typeof duration === 'number') {
    const totalSeconds = Math.floor(duration / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }
  
  // Format ISO 8601: PT1H2M3S (YouTube)
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return duration;
  
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

export default function ContentCard({ item, onEdit, onDelete, onImageLoad }) {
  
  const [cachedImageUri, setCachedImageUri] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  useEffect(() => {
    const loadCachedImage = async () => {
      if (item.image) {
        if (typeof item.image === 'string' && item.image.startsWith('http')) {
          // Image HTTP - utiliser le cache
          setIsLoadingImage(true);
          try {
            const cachedUri = await imageCache.cacheImage(item.image);
            setCachedImageUri(cachedUri);
                      } catch (error) {
              console.log('⚠️ Erreur cache image:', error.message);
              // En cas d'erreur, ne pas afficher d'image (icône de catégorie sera affichée)
              setCachedImageUri(null);
              
              // Retry automatique pour les images Spotify manquantes
              if (isValidSpotifyUrl(item.link)) {
                retrySpotifyImage();
              }
            } finally {
              setIsLoadingImage(false);
            }
        } else {
          // Image locale - utiliser directement
          setCachedImageUri(item.image);
        }
      } else {
        // Pas d'image - essayer de récupérer une image YouTube si c'est une carte YouTube
        if (item.type === 'Youtube' && item.link && isValidYouTubeUrl(item.link)) {
          setIsLoadingImage(true);
          try {
            const thumbnailUrl = await getAvailableThumbnailFromUrl(item.link);
            if (thumbnailUrl) {
              // Mettre en cache l'image YouTube trouvée
              const cachedUri = await imageCache.cacheImage(thumbnailUrl);
              setCachedImageUri(cachedUri);
            } else {
              // Pas d'image YouTube disponible - afficher l'icône de catégorie
              setCachedImageUri(null);
            }
          } catch (error) {
            console.log('⚠️ Erreur récupération image YouTube:', error.message);
            // En cas d'erreur - afficher l'icône de catégorie
            setCachedImageUri(null);
          } finally {
            setIsLoadingImage(false);
          }
        } else {
          // Pas d'image et pas de carte YouTube - afficher l'icône de catégorie
          setCachedImageUri(null);
          
          // Retry automatique pour les images Spotify manquantes
          if (isValidSpotifyUrl(item.link)) {
            retrySpotifyImage();
          }
        }
      }
    };

    loadCachedImage();
  }, [item.image, item.type, item.link]);
  
  if (!item || !item.type ) return null;

  const fallbackBg = ["#000", "#222"];
  const bgArray =
    Array.isArray(item.backgroundColor) && item.backgroundColor.length >= 2
      ? item.backgroundColor
      : fallbackBg;

  // Fonction pour obtenir l'icône de la catégorie
  const getCategoryIcon = (category) => {
    const icons = {
      Film: "film",
      "Série": "tv",
      Musique: "musical-notes",
      Podcast: "radio",
      Youtube: "logo-youtube",
    };
    return icons[category] || "help-circle";
  };

  // Fonction pour obtenir la couleur de la catégorie (version claire pour les icônes)
  const getCategoryColor = (category) => {
    const colors = {
      Film: "#FF6B6B",      // Rouge plus doux
      "Série": "#74B9FF",   // Bleu plus doux
      Musique: "#A29BFE",   // Violet plus doux
      Podcast: "#FDCB6E",   // Orange plus doux
      Youtube: "#FF7675",   // Rouge plus doux
    };
    return colors[category] || "#CCC";
  };

  // Fonction pour retry automatique l'image Spotify
  const retrySpotifyImage = async () => {
    if (!item.link || !isValidSpotifyUrl(item.link)) return;
    
    try {
      console.log('🔄 Retry automatique image Spotify:', item.link);
      const imageUrl = await getSpotifyImageFromUrl(item.link);
      
      if (imageUrl) {
        // Mettre en cache l'image récupérée
        const cachedUri = await imageCache.cacheImage(imageUrl);
        setCachedImageUri(cachedUri);
        console.log('✅ Image Spotify récupérée avec succès');
      } else {
        console.log('⚠️ Aucune image Spotify trouvée');
        setCachedImageUri(null);
      }
    } catch (error) {
      console.log('❌ Erreur retry automatique image Spotify:', error.message);
      setCachedImageUri(null);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.cardContainer}
      onLongPress={() => {
        // Ouvrir le menu d'édition/suppression
        if (onEdit || onDelete) {
          // Pour l'instant, on va juste appeler onEdit
          // Plus tard on pourra ajouter un vrai menu modal
          if (onEdit) {
            onEdit(item);
          }
        }
      }}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        <LinearGradient
          colors={bgArray}
          style={styles.backgroundGradient}
        />
        {cachedImageUri ? (
          <Image 
            source={typeof cachedImageUri === 'string' ? { uri: cachedImageUri } : cachedImageUri} 
            style={styles.contentImage}
            onLoad={() => {
              if (onImageLoad) {
                onImageLoad();
              }
            }}
            onError={(error) => {
              console.log('⚠️ Erreur affichage image:', error);
              // En cas d'erreur d'affichage, afficher l'icône de catégorie
              setCachedImageUri(null);
            }}
          />
        ) : (
          // Affichage de l'icône de catégorie sur fond blanc
          <View style={styles.categoryIconContainer}>
            <View style={styles.categoryIconBackground}>
              <Ionicons 
                name={getCategoryIcon(item.type)} 
                size={120} 
                color={getCategoryColor(item.type)} 
              />
            </View>

          </View>
        )}

        {isLoadingImage && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        )}
        <LinearGradient
          colors={["transparent", hexToRgba(item.categoryColor || bgArray[1], 0.85)]}
          style={styles.overlay}
        >
          {/* The MaskedView and BlurView are removed as per the new_code,
              as they are not present in the new_code. */}
          <View style={styles.contentInfo}>
            <Text style={styles.contentTitle}>{item.title}</Text>
            {item.director && (
              <Text style={styles.contentSubtitle}>
                Réalisateur : {item.director}
              </Text>
            )}
            {item.album && (
              <Text style={styles.contentSubtitle}>Album : {item.album}</Text>
            )}
            {item.artist && (
              <Text style={styles.contentSubtitle}>Auteur : {item.artist}</Text>
            )}
            {item.hosts && (
              <Text style={styles.contentSubtitle}>{item.hosts}</Text>
            )}
            {item.platform && (
              <Text style={styles.contentSubtitle}>
                Plateforme : {item.platform}
              </Text>
            )}
            {item.channelTitle && (
              <Text style={styles.contentSubtitle}>
                Chaîne : {item.channelTitle}
              </Text>
            )}
            {item.duration && (
              <Text style={styles.contentSubtitle}>
                Durée : {formatDuration(item.duration)}
              </Text>
            )}
            {item.description && item.type !== 'Musique' && (
              <Text 
                style={styles.contentDescription}
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                &quot;{item.description}&quot;
              </Text>
            )}
            <View style={styles.bottomContainer}>
              {item.recommendedBy && item.recommendedBy.trim() && (
                <Text 
                  style={[styles.recommendedBy, { color: "white" }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Reco de {item.recommendedBy}
                </Text>
              )}
              {item.link && (
                <TouchableOpacity 
                  style={styles.discoverButton}
                  onPress={async () => {
                    if (item.link) {
                      // Ajouter https:// si le protocole manque
                      let url = item.link;
                      if (!url.startsWith('http://') && !url.startsWith('https://')) {
                        url = 'https://' + url;
                      }
                      
                      console.log('Tentative d\'ouverture du lien:', url);
                      try {
                        const supported = await Linking.canOpenURL(url);
                        if (supported) {
                          await Linking.openURL(url);
                        } else {
                          console.log('Lien non supporté:', url);
                          Alert.alert('Erreur', 'Ce lien ne peut pas être ouvert');
                        }
                      } catch (error) {
                        console.log('Erreur lors de l\'ouverture du lien:', error);
                        Alert.alert('Erreur', 'Impossible d\'ouvrir le lien');
                      }
                    }
                  }}
                >
                  <Text style={styles.discoverButtonText}>Découvrir</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 50,
    borderColor: "#000",
    borderWidth: 2,
    padding: 8,
  },
  card: {
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 40,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderColor: "#000",
    borderWidth: 2,
  },
  cardLoading: {
    height: 200, // Force a fixed height during image loading
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "cover",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 40,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  blurWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "80%",
  },
  contentInfo: {
    position: "absolute",
    bottom: 25,
    left: 25,
    right: 25,
  },
  contentTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  contentSubtitle: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 4,
    opacity: 0.9,
  },
  contentDescription: {
    fontSize: 16,
    color: "#FFF",
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 20,
    fontStyle: "italic",
    flexShrink: 1,
  },
  recommendedBy: {
    fontSize: 14,
    flex: 1,
    flexShrink: 1,
    marginRight: 10,
  },
  discoverButton: {
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  discoverButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 15,
  },
  categoryIconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  categoryIconBackground: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 50,
    padding: 30,
  },

});
