import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import LinkInput from "./../../components/LinkInput";
import CustomImagePicker from "./../../components/ImagePicker";
import { isValidYouTubeUrl, getAvailableThumbnailFromUrl } from "./../../utils/youtubeUtils";
import { getVideoInfoFromUrl, isApiKeyConfigured } from "./../../services/YouTubeService";

export default function YoutubeForm({ formData = {}, onChange, onNext, onBack }) {
  const [local, setLocal] = React.useState({
    title: formData.title || '',
    link: formData.link || '',
    recommendedBy: formData.recommendedBy || '',
    image: formData.image || null,
  });
  const [isLoadingVideoInfo, setIsLoadingVideoInfo] = React.useState(false);

  const handleChange = (key, value) => {
    const updated = { ...local, [key]: value };
    setLocal(updated);
    onChange(updated);
  };

  const handleLinkChange = async (text) => {
    handleChange('link', text);
    
    // Récupérer automatiquement les infos YouTube si l'URL est valide
    if (text && isValidYouTubeUrl(text)) {
      setIsLoadingVideoInfo(true);
      try {
        // Essayer de récupérer les infos via l'API si configurée
        if (isApiKeyConfigured()) {
          const videoInfo = await getVideoInfoFromUrl(text);
          if (videoInfo) {
            const updated = {
              ...local,
              link: text,
              title: videoInfo.title || local.title,
              channelTitle: videoInfo.channelTitle,
              duration: videoInfo.duration,
            };
            setLocal(updated);
            onChange(updated);
          }
        } else {
          // Si pas d'API, essayer de récupérer au moins l'image
          try {
            const thumbnailUrl = await getAvailableThumbnailFromUrl(text);
            if (thumbnailUrl) {
              const updated = {
                ...local,
                link: text,
                image: thumbnailUrl,
              };
              setLocal(updated);
              onChange(updated);
            }
          } catch (imageError) {
            console.log('❌ Impossible de récupérer l\'image YouTube:', imageError.message);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des infos YouTube:', error);
      } finally {
        setIsLoadingVideoInfo(false);
      }
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Section Lien - En premier */}
      <Text style={styles.sectionTitle}>🔗 Lien de la vidéo</Text>
      <Text style={styles.sectionDescription}>
        Collez un lien YouTube pour récupérer automatiquement les informations et la miniature
      </Text>
      
      <LinkInput
        value={local.link}
        onChange={handleLinkChange}
      />

      {isLoadingVideoInfo && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.loadingText}>Récupération des informations...</Text>
        </View>
      )}

      {local.link && !isValidYouTubeUrl(local.link) && (
        <Text style={styles.warningText}>
          ⚠️ L'URL ne semble pas être une URL YouTube valide
        </Text>
      )}

      {local.link && isValidYouTubeUrl(local.link) && (
        <Text style={styles.infoText}>
          ✅ URL YouTube valide - La miniature sera récupérée automatiquement
        </Text>
      )}

      {local.link && isValidYouTubeUrl(local.link) && isApiKeyConfigured() && (
        <Text style={styles.infoText}>
          🔄 Récupération automatique du titre et de la description...
        </Text>
      )}

      {local.link && isValidYouTubeUrl(local.link) && !isApiKeyConfigured() && (
        <Text style={styles.warningText}>
          ⚠️ Clé API YouTube non configurée - Récupération manuelle des infos
        </Text>
      )}

      {/* Section Informations - Après le lien */}
      <Text style={styles.sectionTitle}>📝 Informations de la vidéo</Text>
      <Text style={styles.sectionDescription}>
        Ces champs seront automatiquement remplis si vous avez fourni un lien valide
      </Text>

      <Text style={styles.label}>Titre de la vidéo *</Text>
      <TextInput
        placeholder="ex : Pourquoi l'algorithme YouTube t'adore"
        value={local.title}
        onChangeText={(t) => handleChange('title', t)}
        style={styles.input}
      />

      <Text style={styles.label}>Recommandé par</Text>
      <TextInput
        style={styles.input}
        value={local.recommendedBy}
        onChangeText={(t) => handleChange("recommendedBy", t)}
        placeholder="ex : Adrien"
      />

      <Text style={styles.infoText}>
        💡 Si vous ne choisissez pas d'image, la miniature YouTube sera récupérée automatiquement
      </Text>

      <CustomImagePicker
        value={local.image}
        onChange={(imageUri) => handleChange("image", imageUri)}
        placeholder="Ajouter une image personnalisée (optionnel)"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    color: '#333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  label: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginTop: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFF',
    marginBottom: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: '#0066cc',
    fontSize: 14,
  },
  errorText: { color: 'red', marginTop: 8 },
  warningText: {
    color: 'orange',
    marginTop: 8,
    fontSize: 14,
  },
  infoText: {
    color: '#666',
    marginTop: 8,
    fontSize: 14,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});